export type EpistemicStatus = 'VERIFIED_FACT' | 'INFERRED' | 'USER_CLAIM' | 'MISSING_UNKNOWN';

export type OpportunityCategory =
  | 'Scholarship'
  | 'Fellowship'
  | 'Competition'
  | 'Internship'
  | 'Grant'
  | 'Conference'
  | 'Program';

export type AutonomyLevel = 'LEVEL_1_ASSIST' | 'LEVEL_2_APPROVAL' | 'LEVEL_3_AUTHORIZED_AUTOMATION';

export interface EpistemicField<T> {
  value: T;
  status: EpistemicStatus;
  source?: string;
  verifiedAt?: string;
  confidence?: number;
}

export interface UserProfile {
  id: string;
  fullName: EpistemicField<string>;
  preferredName: EpistemicField<string>;
  dob: EpistemicField<string>;
  nationality: EpistemicField<string>;
  currentCountry: EpistemicField<string>;
  
  // Sensitive Identity
  passportNumber: EpistemicField<string>;
  passportExpiry: EpistemicField<string>;
  isPassportMasked: boolean;

  // Academic
  university: EpistemicField<string>;
  degree: EpistemicField<string>;
  academicLevel: EpistemicField<string>; // 'Undergraduate Junior', 'Master's', etc.
  major: EpistemicField<string>;
  cgpa: EpistemicField<string>;
  maxCgpa: EpistemicField<string>;
  expectedGraduation: EpistemicField<string>;
  academicHistory: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
    verified: boolean;
  }>;

  // Professional & Skills
  skills: EpistemicField<string[]>;
  certifications: Array<{ name: string; issuer: string; date: string; verified: boolean }>;
  awards: Array<{ title: string; issuer: string; date: string; verified: boolean }>;
  competitions: Array<{ title: string; placement: string; date: string; verified: boolean }>;
  workExperience: Array<{
    role: string;
    organization: string;
    period: string;
    highlights: string[];
    verified: boolean;
  }>;
  volunteering: Array<{
    role: string;
    organization: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    tags: string[];
    link?: string;
    verified: boolean;
  }>;

  // Preferences
  careerGoals: EpistemicField<string>;
  preferredFields: EpistemicField<string[]>;
  preferredCountries: EpistemicField<string[]>;
  opportunityTypes: EpistemicField<OpportunityCategory[]>;

  // Personal Statement Info & Notes
  personalStatementThemes: string[];
  previousApplications: Array<{
    id: string;
    opportunityName: string;
    category: OpportunityCategory;
    year: string;
    status: 'Accepted' | 'Interviewed' | 'Rejected' | 'Submitted';
    outcomeNotes: string;
  }>;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'CV_Resume' | 'Academic_Transcript' | 'Passport_ID' | 'Certificate' | 'Recommendation_Letter' | 'Award' | 'Essay_Archive';
  fileSize: string;
  uploadDate: string;
  status: 'Parsed' | 'Needs_Verification' | 'Conflicted' | 'Pending';
  extractedData: Array<{
    field: string;
    value: string;
    epistemicStatus: EpistemicStatus;
    confidence: number;
    quote?: string;
  }>;
  hasConflict?: boolean;
}

export interface ConflictItem {
  id: string;
  field: string;
  docA: { name: string; value: string };
  docB: { name: string; value: string };
  description: string;
  resolved: boolean;
  chosenValue?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  organization: string;
  category: OpportunityCategory;
  deadline: string;
  daysRemaining: number;
  location: string;
  funding: string;
  applicationMethod: 'Online Portal' | 'Direct Email' | 'API Form' | 'Hybrid';
  officialUrl: string;
  isLegitimate: boolean;
  matchScore: number;
  probabilityScore: 'Very High' | 'High' | 'Competitive' | 'Selective';
  reasonsQualify: string[];
  reasonsMayNotQualify: string[];
  missingRequirements: string[];
  estimatedEffortHours: number;
  eligibilityRequirements: Array<{
    requirement: string;
    fulfilled: boolean;
    reason: string;
  }>;
  requiredDocuments: Array<{
    docType: string;
    status: 'Attached' | 'Missing' | 'Needs Update';
    required: boolean;
  }>;
  applicationQuestions: Array<{
    id: string;
    prompt: string;
    wordLimit: number;
    type: 'Personal Statement' | 'Motivation Letter' | 'Technical Essay' | 'Short Answer';
    clarificationQuestions?: string[];
  }>;
}

export interface AuditCriterion {
  criterion: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  detail: string;
  recommendation: string;
}

export interface PreSubmissionAuditReport {
  id: string;
  timestamp: string;
  verdict: 'READY' | 'WARNINGS_PRESENT' | 'CRITICAL_BLOCKERS';
  overallScore: number;
  criteria: AuditCriterion[];
  blockersCount: number;
  warningsCount: number;
  summary: string;
}

export interface ApplicationWorkspace {
  opportunityId: string;
  status: 'Drafting' | 'Review Ready' | 'Audited' | 'Awaiting Approval' | 'Submitted';
  activeAutonomyLevel: AutonomyLevel;
  answers: {
    [questionId: string]: {
      prompt: string;
      draft: string;
      wordCount: number;
      factsUsed: string[];
      epistemicBreakdown: {
        verifiedCount: number;
        inferredCount: number;
        claimsCount: number;
      };
      missingClarificationAnswers?: { [key: string]: string };
      isReviewedByUser: boolean;
    };
  };
  attachedDocIds: string[];
  auditReport?: PreSubmissionAuditReport;
  userApprovalGiven: boolean;
  submissionConfirmationId?: string;
  submissionDate?: string;
}

export interface EmailThread {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  date: string;
  category: 'Interview Invitation' | 'Deadline Alert' | 'Application Confirmation' | 'Outcome' | 'General';
  urgency: 'high' | 'medium' | 'low';
  body: string;
  extractedDeadline?: string;
  suggestedAction: string;
  aiReplyDraft?: {
    subject: string;
    body: string;
    requiresUserApproval: boolean;
  };
  status: 'Unread' | 'Action Taken' | 'Dismissed';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'DISCOVERY' | 'PROFILE_SYNC' | 'AI_DRAFT' | 'QUALITY_AUDIT' | 'APPROVAL' | 'SUBMISSION' | 'EMAIL_SCAN' | 'SECURITY';
  details: string;
  dataUsed: string[];
  autonomyLevel: AutonomyLevel;
  userConsentGranted: boolean;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  urgency: 'urgent' | 'important' | 'info';
  type: 'deadline' | 'match' | 'document' | 'interview' | 'conflict';
  read: boolean;
  opportunityId?: string;
}

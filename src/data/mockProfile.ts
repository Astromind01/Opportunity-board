import { UserProfile, DocumentItem, ConflictItem, EmailThread, AuditLogEntry, NotificationItem } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_amina_902',
  fullName: {
    value: 'Amina Zainab Al-Mansoor',
    status: 'VERIFIED_FACT',
    source: 'Passport & Academic Registry',
    confidence: 100,
  },
  preferredName: {
    value: 'Amina',
    status: 'VERIFIED_FACT',
    source: 'User Onboarding',
    confidence: 100,
  },
  dob: {
    value: '2004-06-14',
    status: 'VERIFIED_FACT',
    source: 'Passport Document #G7829104',
    confidence: 100,
  },
  nationality: {
    value: 'British / Omani Dual National',
    status: 'VERIFIED_FACT',
    source: 'Passport Registry & Embassy Attestation',
    confidence: 100,
  },
  currentCountry: {
    value: 'United Kingdom',
    status: 'VERIFIED_FACT',
    source: 'University Enrollment Record',
    confidence: 100,
  },
  passportNumber: {
    value: 'UK928174092B',
    status: 'VERIFIED_FACT',
    source: 'Official Biometric Document Scan',
    confidence: 100,
  },
  passportExpiry: {
    value: '2032-11-20',
    status: 'VERIFIED_FACT',
    source: 'Passport Document Scan',
    confidence: 100,
  },
  isPassportMasked: true,

  // Academic
  university: {
    value: 'Imperial College London & University of Cambridge (Exchange Fellow)',
    status: 'VERIFIED_FACT',
    source: 'Certified Academic Transcript (Summer 2026)',
    confidence: 100,
  },
  degree: {
    value: 'B.Eng (Hons) in Computing & Machine Intelligence',
    status: 'VERIFIED_FACT',
    source: 'Official Matriculation Document',
    confidence: 100,
  },
  academicLevel: {
    value: 'Penultimate Year (Undergraduate Junior/Senior)',
    status: 'VERIFIED_FACT',
    source: 'Student Portal Sync',
    confidence: 100,
  },
  major: {
    value: 'Computer Science, Systems & AI',
    status: 'VERIFIED_FACT',
    source: 'Registry Record',
    confidence: 100,
  },
  cgpa: {
    value: '3.92',
    status: 'VERIFIED_FACT',
    source: 'Official Transcript (Verified Oct 2026)',
    confidence: 100,
  },
  maxCgpa: {
    value: '4.00',
    status: 'VERIFIED_FACT',
    source: 'Imperial College Grading Scale',
    confidence: 100,
  },
  expectedGraduation: {
    value: 'June 2028',
    status: 'INFERRED',
    source: 'CV Resume (Note: conflicts with transcript projected 2029)',
    confidence: 85,
  },
  academicHistory: [
    {
      institution: 'Imperial College London',
      degree: 'B.Eng Computing',
      year: '2024 - Present',
      gpa: '3.92 / 4.00',
      verified: true,
    },
    {
      institution: 'Dubai College',
      degree: 'A-Levels (Maths A*, Further Maths A*, Physics A*, Computer Science A*)',
      year: '2022 - 2024',
      gpa: '4 A*s',
      verified: true,
    },
  ],

  // Skills & Professional
  skills: {
    value: [
      'Distributed Systems',
      'PyTorch & Deep Learning',
      'TypeScript & Rust',
      'Quantum Algorithm Benchmarking',
      'Climate Informatics',
      'Scientific Technical Writing',
      'Docker & Kubernetes',
    ],
    status: 'VERIFIED_FACT',
    source: 'GitHub Portfolio & Published Preprints',
    confidence: 95,
  },
  certifications: [
    {
      name: 'NVIDIA Certified Associate: Generative AI Infrastructure',
      issuer: 'NVIDIA Deep Learning Institute',
      date: 'March 2025',
      verified: true,
    },
    {
      name: 'CERN OpenLab Computational Physics Bootcamp',
      issuer: 'CERN Education Division',
      date: 'August 2025',
      verified: true,
    },
  ],
  awards: [
    {
      title: 'National Science Foundation Undergraduate Fellow (Visiting Tier)',
      issuer: 'NSF Computing Directorate',
      date: '2025',
      verified: true,
    },
    {
      title: 'Dean’s Honor List (Top 1% of Computing Cohort)',
      issuer: 'Imperial College London',
      date: '2024 & 2025',
      verified: true,
    },
    {
      title: 'First Place, Oxford AI Hackathon for Clean Energy',
      issuer: 'Oxford Artificial Intelligence Society',
      date: 'November 2025',
      verified: true,
    },
  ],
  competitions: [
    {
      title: 'International Collegiate Programming Contest (ICPC) NWERC',
      placement: 'Rank 8 Regional Finalist',
      date: 'December 2025',
      verified: true,
    },
    {
      title: 'Microsoft Imagine Cup Global Sustainability Track',
      placement: 'World Semifinalist',
      date: 'February 2026',
      verified: true,
    },
  ],
  workExperience: [
    {
      role: 'Undergraduate Research Assistant (Autonomous Computing Lab)',
      organization: 'Cambridge Computer Laboratory',
      period: 'Oct 2025 - Present',
      highlights: [
        'Co-authored research on energy-efficient neural model quantization on edge hardware.',
        'Reduced memory latency by 31% on embedded microcontrollers.',
      ],
      verified: true,
    },
    {
      role: 'Systems Engineering Intern',
      organization: 'DeepMind Climate Systems Team',
      period: 'June 2025 - Sept 2025',
      highlights: [
        'Built parallel pipeline processing 4TB/day atmospheric telemetry for extreme weather modeling.',
        'Implemented rigorous automated validation tests for spatial prediction models.',
      ],
      verified: true,
    },
  ],
  volunteering: [
    {
      role: 'Director of Outreach & Mentorship',
      organization: 'Women in Computer Science (WiCS) UK',
      period: '2024 - Present',
      description: 'Mentored 40+ high school girls from underrepresented backgrounds entering STEM competitions.',
    },
  ],
  projects: [
    {
      title: 'EcoMesh: Decentralized Grid Micro-Forecaster',
      description: 'Ultra-low-power edge nodes providing real-time local renewable grid demand forecasting.',
      tags: ['Rust', 'PyTorch', 'IoT', 'CleanTech'],
      link: 'https://github.com/amina-almansoor/ecomesh-core',
      verified: true,
    },
  ],

  // Preferences
  careerGoals: {
    value: 'Pioneering sustainable computing infrastructure and leading international research labs addressing planetary energy efficiency.',
    status: 'USER_CLAIM',
    source: 'User Profile Setup',
    confidence: 100,
  },
  preferredFields: {
    value: ['Artificial Intelligence', 'Clean Technology', 'Distributed Computing', 'Quantum Science'],
    status: 'USER_CLAIM',
    source: 'Preferences Questionnaire',
    confidence: 100,
  },
  preferredCountries: {
    value: ['United Kingdom', 'United States', 'Switzerland', 'Singapore', 'Canada', 'Germany'],
    status: 'USER_CLAIM',
    source: 'Preferences Questionnaire',
    confidence: 100,
  },
  opportunityTypes: {
    value: ['Scholarship', 'Fellowship', 'Competition', 'Internship', 'Grant', 'Conference', 'Program'],
    status: 'USER_CLAIM',
    source: 'Preferences Questionnaire',
    confidence: 100,
  },

  personalStatementThemes: [
    'Bridging theoretical computer science with tangible climate resilience',
    'Fostering cross-border research collaborations between Middle Eastern and European universities',
    'Commitment to open-source accessibility and ethical AI governance',
  ],
  previousApplications: [
    {
      id: 'prev_app_1',
      opportunityName: 'Schwarzman Scholars (2025 Intake)',
      category: 'Scholarship',
      year: '2025',
      status: 'Interviewed',
      outcomeNotes: 'Reached Global Finalist round; received commendation for technical vision.',
    },
    {
      id: 'prev_app_2',
      opportunityName: 'DeepMind Research Fellowship',
      category: 'Fellowship',
      year: '2025',
      status: 'Accepted',
      outcomeNotes: 'Selected as one of 6 national undergraduate fellows.',
    },
  ],
};

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_cv_2026',
    name: 'Amina_AlMansoor_Academic_CV_2026.pdf',
    type: 'CV_Resume',
    fileSize: '1.4 MB',
    uploadDate: 'Oct 02, 2026',
    status: 'Parsed',
    hasConflict: true,
    extractedData: [
      { field: 'Full Legal Name', value: 'Amina Zainab Al-Mansoor', epistemicStatus: 'VERIFIED_FACT', confidence: 99 },
      { field: 'CGPA', value: '3.92 / 4.00', epistemicStatus: 'VERIFIED_FACT', confidence: 98 },
      { field: 'Graduation Year', value: 'June 2028', epistemicStatus: 'INFERRED', confidence: 82, quote: 'Expected graduation: June 2028' },
      { field: 'Institution', value: 'Imperial College London', epistemicStatus: 'VERIFIED_FACT', confidence: 99 },
    ],
  },
  {
    id: 'doc_transcript_official',
    name: 'Imperial_Official_Transcript_Certified_2026.pdf',
    type: 'Academic_Transcript',
    fileSize: '3.1 MB',
    uploadDate: 'Oct 03, 2026',
    status: 'Conflicted',
    hasConflict: true,
    extractedData: [
      { field: 'Cumulative GPA', value: '3.92', epistemicStatus: 'VERIFIED_FACT', confidence: 100, quote: 'Cumulative Grade Point Average: 3.92 / 4.00' },
      { field: 'Matriculated Year', value: '2024', epistemicStatus: 'VERIFIED_FACT', confidence: 100 },
      { field: 'Projected Completion', value: 'June 2029 (Integrated MEng Extension)', epistemicStatus: 'VERIFIED_FACT', confidence: 97, quote: 'Degree Path: 5-Year Integrated Master of Engineering with Placement Year' },
    ],
  },
  {
    id: 'doc_passport_biometric',
    name: 'Passport_Scan_Biometric_Masked.pdf',
    type: 'Passport_ID',
    fileSize: '2.8 MB',
    uploadDate: 'Oct 01, 2026',
    status: 'Parsed',
    extractedData: [
      { field: 'Nationality', value: 'British / Omani', epistemicStatus: 'VERIFIED_FACT', confidence: 100 },
      { field: 'Document Expiration', value: '20 Nov 2032', epistemicStatus: 'VERIFIED_FACT', confidence: 100 },
      { field: 'Sensitivity Level', value: 'CRITICAL (Redacted by default in UI)', epistemicStatus: 'VERIFIED_FACT', confidence: 100 },
    ],
  },
  {
    id: 'doc_rec_prof_damon',
    name: 'Recommendation_Letter_Prof_Damon_Cambridge.pdf',
    type: 'Recommendation_Letter',
    fileSize: '840 KB',
    uploadDate: 'Oct 04, 2026',
    status: 'Parsed',
    extractedData: [
      { field: 'Referee', value: 'Prof. Alistair Damon, Head of Autonomous Systems Laboratory', epistemicStatus: 'VERIFIED_FACT', confidence: 100 },
      { field: 'Endorsement Level', value: 'Highest Possible Recommendation (Top 1% in 15 years)', epistemicStatus: 'VERIFIED_FACT', confidence: 99 },
    ],
  },
];

export const initialConflicts: ConflictItem[] = [
  {
    id: 'conflict_grad_year',
    field: 'Graduation Year Timeline',
    docA: { name: 'Amina_AlMansoor_Academic_CV_2026.pdf', value: 'June 2028 (3-Year BEng)' },
    docB: { name: 'Imperial_Official_Transcript_Certified_2026.pdf', value: 'June 2029 (5-Year Integrated MEng Sandwich)' },
    description: 'Your CV states an anticipated graduation in June 2028, but your certified university transcript registers an enrollment for the integrated MEng track graduating in June 2029. Scholarships with strict degree stage restrictions need the exact declared year.',
    resolved: false,
  },
];

export const initialEmails: EmailThread[] = [
  {
    id: 'mail_rhodes_interview',
    sender: 'Rhodes Trust Regional Committee',
    senderEmail: 'interviews@rhodestrust.ox.ac.uk',
    subject: 'Rhodes Scholarship 2027: Finalist Interview Scheduling',
    date: 'Today, 08:30 AM',
    category: 'Interview Invitation',
    urgency: 'high',
    body: `Dear Amina,\n\nThe Regional Selection Committee has completed the evaluation of your portfolio. We are pleased to invite you to an interview via our London panel on Thursday, October 16 or Friday, October 17.\n\nPlease confirm your preferred time slot by replying to this email no later than Monday, October 12, 17:00 GMT.\n\nWarm regards,\nDr. Helena Ward\nSecretary to the Rhodes Selection Committee`,
    extractedDeadline: 'Oct 12, 2026 — 17:00 GMT',
    suggestedAction: 'Review and send confirmed interview time slot',
    aiReplyDraft: {
      subject: 'Re: Rhodes Scholarship 2027: Finalist Interview Scheduling — Amina Al-Mansoor',
      body: `Dear Dr. Ward and Selection Committee,\n\nThank you very much for this honor and invitation. I would be delighted to attend the panel interview on Thursday, October 16 at 14:00 GMT (or Friday, October 17 at 10:00 GMT as a secondary preference).\n\nI look forward to discussing my research in sustainable computing with the committee.\n\nRespectfully,\nAmina Al-Mansoor`,
      requiresUserApproval: true,
    },
    status: 'Unread',
  },
  {
    id: 'mail_gates_deadline',
    sender: 'Gates Cambridge Admissions',
    senderEmail: 'info@gatescambridge.org',
    subject: 'Gates Cambridge International Scholarships: Reference Letter Reminder',
    date: 'Yesterday, 14:15 PM',
    category: 'Deadline Alert',
    urgency: 'high',
    body: `Reminder: The deadline for the Round 2 International Gates Cambridge Scholarship is approaching in 14 days. Ensure both referee letters are submitted directly through the portal.`,
    extractedDeadline: 'Oct 22, 2026',
    suggestedAction: 'Follow up with Referee 2 regarding pending letter upload',
    status: 'Unread',
  },
  {
    id: 'mail_thiel_confirm',
    sender: 'Thiel Foundation Fellowship Team',
    senderEmail: 'fellows@thielfoundation.org',
    subject: 'Application Confirmation: Thiel Fellowship Cohort 2027',
    date: 'Oct 05, 2026',
    category: 'Application Confirmation',
    urgency: 'medium',
    body: `Hi Amina,\n\nWe have received your application dossier for the EcoMesh decentralized micro-grid project. Your submission reference ID is #TF-2027-8912.\n\nOur team conducts rolling evaluations. You can expect an update within 3 weeks.`,
    suggestedAction: 'Recorded in OpportunityOS application tracker',
    status: 'Action Taken',
  },
  {
    id: 'mail_wef_invite',
    sender: 'World Economic Forum Global Shapers',
    senderEmail: 'london-hub@globalshapers.org',
    subject: 'Invitation to Global Shapers London Sustainability Roundtable',
    date: 'Oct 04, 2026',
    category: 'General',
    urgency: 'low',
    body: `Congratulations on your recent Oxford Clean Energy hackathon award. The London Hub would love to invite you to present your micro-grid findings at our upcoming quarterly roundtable.`,
    suggestedAction: 'Draft RSVP confirmation',
    status: 'Unread',
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-10-08 08:35:12',
    action: 'Document Intelligence Ingestion',
    category: 'PROFILE_SYNC',
    details: 'Parsed Imperial_Official_Transcript_Certified_2026.pdf. Extracted 3 verified academic facts with 100% cryptographic source traceability.',
    dataUsed: ['Transcript PDF', 'University Registry Key'],
    autonomyLevel: 'LEVEL_2_APPROVAL',
    userConsentGranted: true,
  },
  {
    id: 'log_02',
    timestamp: '2026-10-08 08:36:04',
    action: 'Discrepancy Flagged',
    category: 'SECURITY',
    details: 'Detected graduation date discrepancy between CV (2028) and Certified Transcript (2029). Paused automated field update pending user decision.',
    dataUsed: ['CV Resume', 'Official Transcript'],
    autonomyLevel: 'LEVEL_2_APPROVAL',
    userConsentGranted: true,
  },
  {
    id: 'log_03',
    timestamp: '2026-10-08 08:42:19',
    action: 'Email Agent Ingestion & Classification',
    category: 'EMAIL_SCAN',
    details: 'Scanned authorized inbox. Detected high-priority interview invitation from Rhodes Trust. Extracted deadline: Oct 12, 2026.',
    dataUsed: ['interviews@rhodestrust.ox.ac.uk message header & body'],
    autonomyLevel: 'LEVEL_2_APPROVAL',
    userConsentGranted: true,
  },
  {
    id: 'log_04',
    timestamp: '2026-10-08 08:45:50',
    action: 'Opportunity Match Pipeline Execution',
    category: 'DISCOVERY',
    details: 'Ran multi-variable eligibility engine across 48 active international scholarship and grant directories. Identified 7 top matches.',
    dataUsed: ['CGPA (3.92)', 'Computing Major', 'UK/Omani Dual Citizenship', 'CleanTech Interest'],
    autonomyLevel: 'LEVEL_1_ASSIST',
    userConsentGranted: true,
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_interview',
    timestamp: '15 mins ago',
    title: 'Interview Invitation Received',
    message: 'Rhodes Scholarship Regional Committee invited you to interview. Response deadline: Oct 12.',
    urgency: 'urgent',
    type: 'interview',
    read: false,
  },
  {
    id: 'notif_conflict',
    timestamp: '1 hour ago',
    title: 'Timeline Conflict Detected',
    message: 'Your CV (Graduation 2028) conflicts with your Official Transcript (Graduation 2029). Action required before submission.',
    urgency: 'urgent',
    type: 'conflict',
    read: false,
  },
  {
    id: 'notif_scholarship',
    timestamp: '3 hours ago',
    title: 'New 98% Match: Rhodes Scholarship 2027',
    message: 'Matches your GPA (3.92 >= 3.70), institution pedigree, and leadership profile. Closes in 18 days.',
    urgency: 'important',
    type: 'match',
    read: false,
    opportunityId: 'opp_rhodes_2027',
  },
  {
    id: 'notif_document',
    timestamp: 'Yesterday',
    title: 'Missing Document Warning',
    message: 'Gates Cambridge application is missing Academic Reference 2. Deadline in 14 days.',
    urgency: 'important',
    type: 'document',
    read: false,
    opportunityId: 'opp_gates_cambridge',
  },
];

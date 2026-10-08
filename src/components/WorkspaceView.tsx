import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Send, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  RefreshCw,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Opportunity, 
  UserProfile, 
  AutonomyLevel, 
  PreSubmissionAuditReport, 
  AuditLogEntry 
} from '../types';
import { apiClient } from '../services/apiClient';

interface WorkspaceViewProps {
  opportunity: Opportunity;
  userProfile: UserProfile;
  autonomyLevel: AutonomyLevel;
  onLogAction: (entry: AuditLogEntry) => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  opportunity,
  userProfile,
  autonomyLevel,
  onLogAction,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'drafter' | 'audit' | 'submission'>('drafter');
  
  // Drafting state
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const currentQuestion = opportunity.applicationQuestions[selectedQuestionIndex] || opportunity.applicationQuestions[0];
  
  const [userGuidanceNote, setUserGuidanceNote] = useState('');
  const [draftText, setDraftText] = useState(
    `My trajectory in sustainable computing stems directly from research at ${userProfile.university.value}, where I have maintained a ${userProfile.cgpa.value} GPA.

[VERIFIED FACT] As an NSF Undergraduate Research Fellow, I spearheaded parallel compiler optimizations for embedded neural networks, reducing inference latency by 31% on edge microcontrollers.

[INFERRED PERSPECTIVE] My dual British-Omani heritage motivates my commitment to cross-border research frameworks addressing critical energy constraints.

[NEEDS USER INPUT: Please describe one specific leadership challenge you navigated during WiCS outreach.]

I am committed to upholding the highest standards of academic integrity and look forward to contributing meaningfully to the cohort.`
  );
  const [isDrafting, setIsDrafting] = useState(false);
  const [factsUsed, setFactsUsed] = useState<string[]>([
    `CGPA: ${userProfile.cgpa.value}`,
    `Institution: ${userProfile.university.value}`,
    'NSF Undergraduate Fellowship',
    '31% edge inference latency reduction project',
  ]);
  const [clarificationsNeeded, setClarificationsNeeded] = useState<string[]>([
    'Specific personal narrative on resolving a leadership conflict in STEM outreach.',
  ]);
  const [clarificationAnswer, setClarificationAnswer] = useState('');

  // 15-Point Audit State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<PreSubmissionAuditReport | null>({
    id: 'audit_rhodes_01',
    timestamp: '2026-10-08 09:20:00',
    verdict: 'WARNINGS_PRESENT',
    overallScore: 94,
    blockersCount: 0,
    warningsCount: 2,
    summary: 'Application passed 13/15 criteria cleanly. 2 non-blocking warnings pending your sign-off: referee letter 2 receipt and mandatory honor declaration agreement.',
    criteria: [
      { criterion: '1. Eligibility Criteria Fulfillment', status: 'PASSED', detail: 'Candidate meets minimum CGPA (3.92 >= 3.70) and citizenship requirements.', recommendation: 'None' },
      { criterion: '2. Deadline Validity', status: 'PASSED', detail: 'Submission window is open (deadline is 18 days away).', recommendation: 'None' },
      { criterion: '3. Required Documents Attachment', status: 'WARNING', detail: 'Academic transcript and passport scan attached; 2nd referee letter pending.', recommendation: 'Follow up with referee.' },
      { criterion: '4. Name Consistency Across Records', status: 'PASSED', detail: 'Full legal name matches passport, CV, and academic transcript.', recommendation: 'None' },
      { criterion: '5. Date & Graduation Timeline', status: 'PASSED', detail: 'Timeline resolved: Expected completion matches university registry (2028).', recommendation: 'None' },
      { criterion: '6. Academic & GPA Precision', status: 'PASSED', detail: '3.92/4.00 verified from official transcript.', recommendation: 'None' },
      { criterion: '7. CV & Resume Alignment', status: 'PASSED', detail: 'Tailored CV highlights research publications and computational fellowship.', recommendation: 'None' },
      { criterion: '8. Essay Prompt & Word Count Constraints', status: 'PASSED', detail: 'Draft length is within limit (current word count conforms to prompt).', recommendation: 'None' },
      { criterion: '9. Anti-Fabrication & Unsupported Claims', status: 'PASSED', detail: '100% of claims cite verified entries in user profile repository. Zero hallucinations.', recommendation: 'None' },
      { criterion: '10. Required Form Fields', status: 'PASSED', detail: 'All mandatory biographical and essay fields are filled.', recommendation: 'None' },
      { criterion: '11. Duplicate Application Check', status: 'PASSED', detail: 'No previous submissions detected for this grant cycle.', recommendation: 'None' },
      { criterion: '12. Internal Contradictions Check', status: 'PASSED', detail: 'Zero conflicting claims across essays and CV entries.', recommendation: 'None' },
      { criterion: '13. Sensitive Data Redaction', status: 'PASSED', detail: 'Passport numbers safely masked until final authorized submission stage.', recommendation: 'None' },
      { criterion: '14. Legal Declaration Agreement', status: 'WARNING', detail: 'User must explicitly confirm original authorship and accuracy checkbox before submission.', recommendation: 'Review certification statement.' },
      { criterion: '15. Academic Tone & Professionalism', status: 'PASSED', detail: 'Tone adheres to international scholarship committee standards.', recommendation: 'None' },
    ],
  });

  // Submission State
  const [unmaskSensitiveData, setUnmaskSensitiveData] = useState(false);
  const [certifyTruthChecked, setCertifyTruthChecked] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionConfirmationId, setSubmissionConfirmationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Calculate word count
  const currentWordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;
  const wordLimit = currentQuestion?.wordLimit || 500;
  const isOverWordLimit = currentWordCount > wordLimit;

  // Handle AI Draft generation
  const handleGenerateDraft = async () => {
    setIsDrafting(true);
    try {
      const res = await apiClient.draftResponse({
        opportunityTitle: opportunity.name,
        promptQuestion: currentQuestion.prompt,
        wordLimit: currentQuestion.wordLimit,
        userProfile,
        materialType: currentQuestion.type,
        userGuidanceNotes: userGuidanceNote + (clarificationAnswer ? ` User clarification: ${clarificationAnswer}` : ''),
      });

      if (res.data) {
        setDraftText(res.data.draft);
        setFactsUsed(res.data.factsUsed || []);
        setClarificationsNeeded(res.data.missingInformationRequests || []);
        
        onLogAction({
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'AI Anti-Fabrication Draft Generated',
          category: 'AI_DRAFT',
          details: `Drafted ${currentQuestion.type} for "${opportunity.name}". Verified ${res.data.factsUsed?.length || 0} facts; flagged ${res.data.missingInformationRequests?.length || 0} missing subjective details.`,
          dataUsed: ['CGPA', 'Institution', 'NSF Fellowship', 'WiCS Outreach'],
          autonomyLevel,
          userConsentGranted: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  // Handle Quality Control Audit execution
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await apiClient.auditApplication({
        opportunity,
        applicationData: {
          questionId: currentQuestion.id,
          draftText,
          wordCount: currentWordCount,
        },
        userProfile,
      });

      if (res.data) {
        setAuditReport({
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          verdict: res.data.verdict,
          overallScore: res.data.overallScore,
          criteria: res.data.items,
          blockersCount: res.data.blockersCount,
          warningsCount: res.data.warningsCount,
          summary: res.data.summaryReport,
        });

        onLogAction({
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: '15-Point Pre-Submission Audit Executed',
          category: 'QUALITY_AUDIT',
          details: `Audit completed for "${opportunity.name}". Verdict: ${res.data.verdict}. Score: ${res.data.overallScore}/100.`,
          dataUsed: ['Transcript', 'CV', 'Draft text', 'Opportunity requirements'],
          autonomyLevel,
          userConsentGranted: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Handle Application Submission
  const handleExecuteSubmission = () => {
    if (!certifyTruthChecked) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const confId = `OPP-${opportunity.category.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmissionConfirmationId(confId);
      setSubmissionComplete(true);
      setIsSubmitting(false);

      onLogAction({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: 'Application Submission Confirmed',
        category: 'SUBMISSION',
        details: `Application submitted for "${opportunity.name}". Confirmation ID: ${confId}. Autonomy level: ${autonomyLevel}. User signed off on legal declarations.`,
        dataUsed: ['Full dossier', 'Passport ID (Decrypted for transmission)', 'Final answers'],
        autonomyLevel,
        userConsentGranted: true,
      });
    }, 1200);
  };

  const handleCopyDossier = () => {
    navigator.clipboard.writeText(
      `OPPORTUNITY APPLICATION DOSSIER\nTarget: ${opportunity.name}\nApplicant: ${userProfile.fullName.value}\nInstitution: ${userProfile.university.value}\nCGPA: ${userProfile.cgpa.value}\n\nESSAY RESPONSE:\n${draftText}`
    );
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {opportunity.category}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-600">{opportunity.organization}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-emerald-700 font-semibold">{opportunity.funding}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {opportunity.name}
            </h1>
          </div>

          {/* Autonomy Level Indicator & Deadline */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Submission Deadline</p>
              <p className="text-sm font-bold text-slate-900 flex items-center justify-end">
                <Clock className="w-4 h-4 text-rose-500 mr-1" />
                {opportunity.deadline} ({opportunity.daysRemaining} days left)
              </p>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Current Autonomy</p>
              <p className="font-bold text-slate-800">
                {autonomyLevel === 'LEVEL_1_ASSIST' && 'Level 1: Assist (Manual Submit)'}
                {autonomyLevel === 'LEVEL_2_APPROVAL' && 'Level 2: Approval Required'}
                {autonomyLevel === 'LEVEL_3_AUTHORIZED_AUTOMATION' && 'Level 3: Authorized Auto'}
              </p>
            </div>
          </div>
        </div>

        {/* Autonomy Explainer Notice */}
        <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
          autonomyLevel === 'LEVEL_1_ASSIST'
            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
            : autonomyLevel === 'LEVEL_2_APPROVAL'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-purple-50/70 border-purple-200 text-purple-900'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {autonomyLevel === 'LEVEL_1_ASSIST' && 'Assist Mode Active: '}
              {autonomyLevel === 'LEVEL_2_APPROVAL' && 'Explicit Approval Mode Active: '}
              {autonomyLevel === 'LEVEL_3_AUTHORIZED_AUTOMATION' && 'Authorized Automation Active: '}
            </span>
            {autonomyLevel === 'LEVEL_1_ASSIST' && 'The agent drafts answers, organizes documents, and verifies eligibility. You copy materials and submit directly on the portal.'}
            {autonomyLevel === 'LEVEL_2_APPROVAL' && 'The agent will prepare all materials and run pre-submission quality audits. You must review and give explicit approval before any submission is initiated.'}
            {autonomyLevel === 'LEVEL_3_AUTHORIZED_AUTOMATION' && 'The agent can submit applications for pre-authorized categories. Sensitive actions (passport uploads, legal declarations, and CAPTCHAs) still mandate your confirmation.'}
          </div>
        </div>

        {/* Workspace Tab Bar */}
        <div className="flex space-x-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveSubTab('drafter')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'drafter'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Response Drafter & Anti-Fabrication</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'checklist'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Eligibility & Documents</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'audit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <span>15-Point Pre-Submission Audit</span>
            {auditReport && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold ml-1">
                Score: {auditReport.overallScore}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('submission')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'submission'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review & Submit</span>
            {submissionComplete && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">Submitted</span>}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AI RESPONSE DRAFTER */}
      {activeSubTab === 'drafter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Question Selector & Draft Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Question Selector Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Question to Answer:</p>
              <div className="flex flex-wrap gap-2">
                {opportunity.applicationQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedQuestionIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Question {idx + 1}: {q.type} ({q.wordLimit}w)
                  </button>
                ))}
              </div>

              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentQuestion.prompt}</p>
                <p className="text-[11px] text-slate-500 mt-1">Word Limit: {currentQuestion.wordLimit} words</p>
              </div>
            </div>

            {/* User Guidance / Context Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
                  Your Guidance Notes (Personal anecdotes / priorities):
                </label>
                <span className="text-[10px] text-slate-400">Never hallucinates without context</span>
              </div>
              <input
                type="text"
                value={userGuidanceNote}
                onChange={(e) => setUserGuidanceNote(e.target.value)}
                placeholder="e.g. Focus on micro-grid clean tech project and mentoring high school girls at WiCS..."
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateDraft}
                  disabled={isDrafting}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDrafting ? 'animate-spin' : ''}`} />
                  <span>{isDrafting ? 'Generating Anti-Fabrication Draft...' : 'Generate Verified Draft'}</span>
                </button>
              </div>
            </div>

            {/* Editable Draft Area with Word Counter */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800">Drafted Response</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                    Anti-Fabrication Guard Active
                  </span>
                </div>
                <div className="text-xs font-semibold">
                  <span className={isOverWordLimit ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                    {currentWordCount} / {wordLimit} words
                  </span>
                </div>
              </div>

              <textarea
                rows={12}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="w-full text-xs sm:text-sm font-serif leading-relaxed text-slate-800 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyDossier}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copyFeedback ? 'Copied!' : 'Copy Draft'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveSubTab('audit')}
                  className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <span>Proceed to 15-Point Audit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Anti-Fabrication Engine & Epistemic Attribution Sidebar */}
          <div className="space-y-4">
            {/* Epistemic Legend Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Epistemic Status Engine</h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                To prevent hallucinated achievements, OpportunityOS tags all assertions into four strict epistemic classes:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 text-[10px] uppercase block">[VERIFIED FACT]</span>
                  <span className="text-[11px] text-emerald-900">Proven by certified transcripts, published papers, or authenticated documents.</span>
                </div>

                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="font-bold text-blue-800 text-[10px] uppercase block">[INFERRED PERSPECTIVE]</span>
                  <span className="text-[11px] text-blue-900">Reasonable deductions based on confirmed academic focus or background.</span>
                </div>

                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-800 text-[10px] uppercase block">[USER CLAIM]</span>
                  <span className="text-[11px] text-amber-900">Direct self-report by applicant pending secondary document attestation.</span>
                </div>

                <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="font-bold text-purple-800 text-[10px] uppercase block">[NEEDS USER INPUT]</span>
                  <span className="text-[11px] text-purple-900">Subjective personal anecdotes or metrics the AI is prohibited from inventing.</span>
                </div>
              </div>
            </div>

            {/* Verified Facts Used In This Draft */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Verified Profile Facts Cited:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {factsUsed.map((fact, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Subjective Information Question Prompt */}
            {clarificationsNeeded.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-xs space-y-2">
                <div className="flex items-center space-x-1.5 text-purple-900">
                  <HelpCircle className="w-4 h-4 text-purple-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wider">User Input Required</h4>
                </div>
                <p className="text-[11px] text-purple-800">
                  The agent cannot safely invent answers for this prompt. Please provide brief personal context below:
                </p>
                <p className="text-xs font-semibold text-purple-950 italic">
                  "{clarificationsNeeded[0]}"
                </p>
                <textarea
                  rows={3}
                  value={clarificationAnswer}
                  onChange={(e) => setClarificationAnswer(e.target.value)}
                  placeholder="e.g. In WiCS, I mediated a dispute between curriculum mentors by piloting a 2-week trial..."
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={handleGenerateDraft}
                  className="w-full py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors"
                >
                  Regenerate with Your Anecdote
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CHECKLIST & REQUIRED DOCUMENTS */}
      {activeSubTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Eligibility Criteria */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> Eligibility Requirements Breakdown
            </h3>
            <div className="space-y-2.5">
              {opportunity.eligibilityRequirements.map((req, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start space-x-3">
                  {req.fulfilled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{req.requirement}</p>
                    <p className="text-slate-600 mt-0.5">{req.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center">
              <FileText className="w-4 h-4 text-indigo-600 mr-2" /> Required Application Documents
            </h3>
            <div className="space-y-2.5">
              {opportunity.requiredDocuments.map((doc, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{doc.docType}</p>
                    <p className="text-[11px] text-slate-500">{doc.required ? 'Mandatory for submission' : 'Optional supporting asset'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                    doc.status === 'Attached'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.status === 'Needs Update'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('documents')}
              className="w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Manage Documents Vault & Upload Missing Files →
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 15-POINT PRE-SUBMISSION AUDIT */}
      {activeSubTab === 'audit' && auditReport && (
        <div className="space-y-6">
          {/* Executive Verdict Banner */}
          <div className={`p-5 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            auditReport.verdict === 'READY'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : auditReport.verdict === 'WARNINGS_PRESENT'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-700" />
                <h3 className="font-extrabold text-base">
                  Pre-Submission Quality Control Report
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-300">
                  Verdict: {auditReport.verdict}
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-2xl">{auditReport.summary}</p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{auditReport.overallScore}/100</span>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Audit Score</p>
              </div>
              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>Re-Audit</span>
              </button>
            </div>
          </div>

          {/* 15-Point Inspection Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Comprehensive 15-Point Quality Check</h4>
              <span className="text-xs text-slate-500">
                Passed: <strong>{auditReport.criteria.filter(c => c.status === 'PASSED').length}</strong> • Warnings: <strong>{auditReport.warningsCount}</strong> • Blockers: <strong>{auditReport.blockersCount}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {auditReport.criteria.map((item, idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50/50">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-900">{item.criterion}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                        item.status === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{item.detail}</p>
                  </div>

                  {item.recommendation !== 'None' && (
                    <div className="text-[11px] font-medium text-amber-800 sm:text-right shrink-0">
                      Action: {item.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveSubTab('submission')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Continue to Submission Sign-off</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SUBMISSION & AUTONOMY GATE */}
      {activeSubTab === 'submission' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {submissionComplete ? (
            /* Submission Success Card */
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Application Submitted & Recorded</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Submission reference ID: <strong className="font-mono text-emerald-800">{submissionConfirmationId}</strong>
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-slate-600 text-left space-y-2">
                <p><strong>Opportunity:</strong> {opportunity.name}</p>
                <p><strong>Organization:</strong> {opportunity.organization}</p>
                <p><strong>Candidate:</strong> {userProfile.fullName.value}</p>
                <p><strong>Next Agent Action:</strong> Email agent is now automatically monitoring your inbox for confirmation emails and committee interview invitations.</p>
              </div>

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={handleCopyDossier}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyFeedback ? 'Copied Dossier!' : 'Copy Submitted Dossier'}</span>
                </button>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Submission Preparation & Privacy Gate */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mr-2" />
                  Pre-Submission Privacy & Authorization Gate
                </h2>
                <p className="text-xs text-slate-500">
                  Inspect the exact data package before transmission. Private documents are masked by default.
                </p>
              </div>

              {/* Data Minimization Disclosure Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Sensitive Identity Document: Passport Scan</span>
                  <button
                    onClick={() => setUnmaskSensitiveData(!unmaskSensitiveData)}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {unmaskSensitiveData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{unmaskSensitiveData ? 'Mask Passport Number' : 'Unmask to Review'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="font-semibold text-slate-800">{userProfile.fullName.value}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Nationality:</span>
                    <span className="font-semibold text-slate-800">{userProfile.nationality.value}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Passport Number:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {unmaskSensitiveData ? userProfile.passportNumber.value : '••••••••902B (Redacted)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CGPA Disclosed:</span>
                    <span className="font-semibold text-emerald-700">{userProfile.cgpa.value} / {userProfile.maxCgpa.value}</span>
                  </div>
                </div>
              </div>

              {/* Anti-Bot / CAPTCHA Boundary Notice */}
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Compliance & Ethical Automation Boundary</p>
                <p className="text-[11px] leading-relaxed">
                  OpportunityOS strictly respects website terms of service and access controls. 
                  The agent never attempts to bypass CAPTCHA, MFA, or anti-bot protections. 
                  If a portal requires manual interactive captcha or institutional single-sign-on, you can use the One-Click Copy Dossier below to complete submission directly.
                </p>
              </div>

              {/* Legal Declaration / Truth Certification */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certifyTruthChecked}
                    onChange={(e) => setCertifyTruthChecked(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">
                      Mandatory Certification of Truth & Authorship
                    </span>
                    <span className="text-slate-600 text-[11px] leading-normal block mt-0.5">
                      I certify that all information submitted in this application is accurate and reflects my genuine achievements. I have reviewed the drafted statements and authorize OpportunityOS to transmit this dossier.
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={handleCopyDossier}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyFeedback ? 'Copied Dossier!' : 'Copy Complete Dossier Packet'}</span>
                </button>

                <button
                  onClick={handleExecuteSubmission}
                  disabled={!certifyTruthChecked || isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  <span>
                    {isSubmitting
                      ? 'Submitting Dossier...'
                      : autonomyLevel === 'LEVEL_1_ASSIST'
                      ? 'Confirm & Record Manual Submission'
                      : 'Approve & Transmit Application'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

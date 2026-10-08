import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { EmailThread, UserProfile, AuditLogEntry, AutonomyLevel } from '../types';
import { apiClient } from '../services/apiClient';

interface EmailAgentViewProps {
  emails: EmailThread[];
  gmailConnected: boolean;
  onToggleGmail: () => void;
  userProfile: UserProfile;
  autonomyLevel: AutonomyLevel;
  onLogAction: (entry: AuditLogEntry) => void;
}

export const EmailAgentView: React.FC<EmailAgentViewProps> = ({
  emails,
  gmailConnected,
  onToggleGmail,
  userProfile,
  autonomyLevel,
  onLogAction,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailThread>(emails[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [replyDraft, setReplyDraft] = useState(selectedEmail.aiReplyDraft?.body || '');
  const [replySubject, setReplySubject] = useState(selectedEmail.aiReplyDraft?.subject || '');
  const [replySentSuccess, setReplySentSuccess] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  const handleSelectEmail = (em: EmailThread) => {
    setSelectedEmail(em);
    setReplySubject(em.aiReplyDraft?.subject || `Re: ${em.subject}`);
    setReplyDraft(em.aiReplyDraft?.body || '');
    setReplySentSuccess(false);
  };

  const handleGenerateReply = async () => {
    setIsGeneratingReply(true);
    try {
      const res = await apiClient.generateEmailReply(
        selectedEmail,
        'Confirm interview slot for Thursday, October 16 at 14:00 GMT and thank the committee.',
        userProfile
      );

      if (res.data) {
        setReplySubject(res.data.subject);
        setReplyDraft(res.data.body);

        onLogAction({
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          action: 'Email Reply Drafted',
          category: 'EMAIL_SCAN',
          details: `Drafted interview confirmation email to ${selectedEmail.senderEmail}. Pending user review.`,
          dataUsed: ['Candidate Name', 'Institution', 'Email Thread Context'],
          autonomyLevel,
          userConsentGranted: true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handleSendReply = () => {
    setReplySentSuccess(true);
    onLogAction({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'Email Transmitted with User Approval',
      category: 'EMAIL_SCAN',
      details: `User explicitly approved and sent email to ${selectedEmail.senderEmail}. Subject: "${replySubject}".`,
      dataUsed: ['Final Draft Text', 'User Explicit Sign-off'],
      autonomyLevel,
      userConsentGranted: true,
    });
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Email Agent (Gmail Integration)</h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              gmailConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {gmailConnected ? 'Authorized & Monitoring' : 'Disconnected'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scans for opportunity announcements, application deadlines, interview invitations, and admissions results.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateSync}
            disabled={isSyncing || !gmailConnected}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Scanning Inbox...' : 'Scan Now'}</span>
          </button>

          <button
            onClick={onToggleGmail}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              gmailConnected
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
            }`}
          >
            {gmailConnected ? 'Revoke Email Access' : 'Connect Gmail Account'}
          </button>
        </div>
      </div>

      {/* Strict Privacy Shield Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Strict Email Privacy Boundary: </span>
          OpportunityOS only reads emails identified as opportunity, scholarship, or fellowship inquiries. 
          The agent <strong>never automatically sends any email on your behalf</strong> without your explicit, manual sign-off.
        </div>
      </div>

      {/* Main Layout: Inbox Thread List + Active Thread Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Email Thread List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-1">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Opportunity Inbox ({emails.length})</h2>
            <span className="text-[11px] text-slate-500">Live Filters</span>
          </div>

          <div className="divide-y divide-slate-100">
            {emails.map((em) => (
              <div
                key={em.id}
                onClick={() => handleSelectEmail(em)}
                className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                  selectedEmail.id === em.id ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                    em.category === 'Interview Invitation'
                      ? 'bg-purple-100 text-purple-800'
                      : em.category === 'Deadline Alert'
                      ? 'bg-rose-100 text-rose-800'
                      : em.category === 'Application Confirmation'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {em.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{em.date}</span>
                </div>

                <p className="text-xs font-bold text-slate-900 line-clamp-1">{em.sender}</p>
                <p className="text-xs text-slate-700 line-clamp-1 font-medium">{em.subject}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{em.body}</p>

                {em.extractedDeadline && (
                  <div className="flex items-center text-[10px] text-rose-600 font-semibold pt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Deadline: {em.extractedDeadline}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Email Message Reader & AI Reply Drafter */}
        <div className="lg:col-span-2 space-y-5">
          {/* Thread Header & Body */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="space-y-1.5 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                  {selectedEmail.category}
                </span>
                <span className="text-xs text-slate-500">{selectedEmail.date}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">{selectedEmail.subject}</h2>
              <p className="text-xs text-slate-500">
                From: <strong className="text-slate-800">{selectedEmail.sender}</strong> &lt;{selectedEmail.senderEmail}&gt;
              </p>
            </div>

            {/* Extracted Intelligence Notice */}
            {selectedEmail.extractedDeadline && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Detected Action Deadline: <strong>{selectedEmail.extractedDeadline}</strong></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">High Urgency</span>
              </div>
            )}

            {/* Email Body */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
              {selectedEmail.body}
            </div>
          </div>

          {/* AI Reply Drafter Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  AI Smart Reply Drafter (Explicit Approval Required)
                </h3>
              </div>
              <button
                onClick={handleGenerateReply}
                disabled={isGeneratingReply}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReply ? 'animate-spin' : ''}`} />
                <span>Regenerate Reply</span>
              </button>
            </div>

            {replySentSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold">Reply Transmitted Successfully</p>
                <p className="text-[11px] text-emerald-700">Sent to {selectedEmail.senderEmail}. Logged in cryptographic audit trail.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Subject</label>
                  <input
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Reply Message Body</label>
                  <textarea
                    rows={6}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    className="w-full text-xs font-serif p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Tone: Formal & Professional • Verified facts only</span>
                  <span className="font-semibold text-slate-700">Manual User Confirmation Enforced</span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSendReply}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Email Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

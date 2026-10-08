import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  History, 
  Key, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Cpu,
  Mail
} from 'lucide-react';
import { AutonomyLevel, AuditLogEntry } from '../types';

interface SecurityAuditViewProps {
  autonomyLevel: AutonomyLevel;
  setAutonomyLevel: (lvl: AutonomyLevel) => void;
  auditLogs: AuditLogEntry[];
  onClearLogs?: () => void;
  gmailConnected: boolean;
  onToggleGmail: () => void;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({
  autonomyLevel,
  setAutonomyLevel,
  auditLogs,
  gmailConnected,
  onToggleGmail,
}) => {
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.category === logFilter;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opportunity_os_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security, Permissions & Audit Trail</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Least-Privilege Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete transparency into agent decision-making, autonomy limits, and data utilization logs.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* AUTONOMY LEVEL GOVERNANCE */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Autonomy Level Configuration</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Define the operational boundary for OpportunityOS. The agent strictly respects these restrictions across all opportunities and connected accounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Level 1: Assist */}
          <div
            onClick={() => setAutonomyLevel('LEVEL_1_ASSIST')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 ${
              autonomyLevel === 'LEVEL_1_ASSIST'
                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">LEVEL 1 — ASSIST</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Agent searches, evaluates, and drafts all responses. The user retains complete manual control and performs all external submissions.
            </p>
            <div className="pt-2 text-[10px] font-bold text-blue-800">
              ✓ Lowest risk profile
            </div>
          </div>

          {/* Level 2: Approval */}
          <div
            onClick={() => setAutonomyLevel('LEVEL_2_APPROVAL')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 ${
              autonomyLevel === 'LEVEL_2_APPROVAL'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">LEVEL 2 — APPROVAL</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Agent fills applications and conducts pre-submission audits. Displays complete application to the user; requires explicit sign-off before submission.
            </p>
            <div className="pt-2 text-[10px] font-bold text-emerald-800">
              ✓ Recommended default
            </div>
          </div>

          {/* Level 3: Authorized Automation */}
          <div
            onClick={() => setAutonomyLevel('LEVEL_3_AUTHORIZED_AUTOMATION')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 ${
              autonomyLevel === 'LEVEL_3_AUTHORIZED_AUTOMATION'
                ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">LEVEL 3 — AUTHORIZED AUTO</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Agent can submit routine applications automatically. Hard-stops mandating user confirmation for sensitive IDs, legal oaths, or CAPTCHAs are strictly enforced.
            </p>
            <div className="pt-2 text-[10px] font-bold text-purple-800">
              ✓ Automated speed with safety stops
            </div>
          </div>
        </div>

        {/* Sensitive Hard-Stops Matrix */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <p className="font-bold text-slate-900">Inviolable Agent Safety Stops (Active Across All Levels):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Identity & Passport document transmission requires explicit approval</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Legal declarations & honor code certifications require user click</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Anti-bot protections (CAPTCHA/MFA) are never bypassed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Zero-Fabrication directive: Missing facts are asked, never invented</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONNECTED ACCOUNTS & LEAST-PRIVILEGE PERMISSIONS */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Key className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Connected Services & Revocation Rights</h2>
        </div>

        <div className="space-y-3">
          {/* Gmail Integration Card */}
          <div className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-slate-900">Google Workspace (Gmail)</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
                    gmailConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {gmailConnected ? 'Connected (Read-only + Draft)' : 'Not Connected'}
                  </span>
                </div>
                <p className="text-slate-500 mt-0.5">
                  Scopes: <code className="bg-slate-100 px-1 py-0.2 rounded-xs text-[10px]">gmail.readonly</code>. Monitored for deadlines and interviews.
                </p>
              </div>
            </div>

            <button
              onClick={onToggleGmail}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                gmailConnected
                  ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
              }`}
            >
              {gmailConnected ? 'Revoke Access' : 'Connect Account'}
            </button>
          </div>
        </div>
      </div>

      {/* LIVE AUDIT TRAIL LOGS */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-1">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Agent Action Audit Log ({filteredLogs.length} events)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Filter:</span>
            <select
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 py-1 px-2 bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="DISCOVERY">Discovery</option>
              <option value="PROFILE_SYNC">Profile Sync</option>
              <option value="AI_DRAFT">AI Drafting</option>
              <option value="QUALITY_AUDIT">Quality Audit</option>
              <option value="SUBMISSION">Submissions</option>
              <option value="EMAIL_SCAN">Email Agent</option>
              <option value="SECURITY">Security</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3.5 hover:bg-slate-50/70 transition-colors text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600">
                    {log.category}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs">
                  User Consented
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
              <div className="flex items-center space-x-1 text-[10px] text-slate-400 pt-0.5">
                <span>Data Elements Accessed:</span>
                <span className="font-medium text-slate-600">{log.dataUsed.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

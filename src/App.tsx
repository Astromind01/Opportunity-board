import React, { useState } from 'react';
import { 
  initialUserProfile, 
  initialDocuments, 
  initialConflicts, 
  initialEmails, 
  initialAuditLogs, 
  initialNotifications 
} from './data/mockProfile';
import { mockOpportunities } from './data/mockOpportunities';
import { 
  UserProfile, 
  Opportunity, 
  AutonomyLevel, 
  DocumentItem, 
  ConflictItem, 
  EmailThread, 
  AuditLogEntry, 
  NotificationItem 
} from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DiscoveryView } from './components/DiscoveryView';
import { WorkspaceView } from './components/WorkspaceView';
import { ProfileVaultView } from './components/ProfileVaultView';
import { DocumentHubView } from './components/DocumentHubView';
import { EmailAgentView } from './components/EmailAgentView';
import { SecurityAuditView } from './components/SecurityAuditView';
import { ArchitectureReportView } from './components/ArchitectureReportView';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('LEVEL_2_APPROVAL');
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity>(mockOpportunities[0]);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [conflicts, setConflicts] = useState<ConflictItem[]>(initialConflicts);
  const [emails, setEmails] = useState<EmailThread[]>(initialEmails);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(true);

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Audit logger helper
  const handleLogAction = (entry: AuditLogEntry) => {
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Conflict resolution handler
  const handleResolveConflict = (conflictId: string, chosenValue: string) => {
    setConflicts((prev) =>
      prev.map((c) => (c.id === conflictId ? { ...c, resolved: true, chosenValue } : c))
    );

    // Update profile expected graduation
    setUserProfile((prev) => ({
      ...prev,
      expectedGraduation: {
        value: chosenValue,
        status: 'VERIFIED_FACT',
        source: `User Resolution of Conflict (${chosenValue})`,
        confidence: 100,
      },
    }));

    // Update document status
    setDocuments((prev) =>
      prev.map((d) => (d.hasConflict ? { ...d, hasConflict: false, status: 'Parsed' } : d))
    );

    // Add to audit trail
    handleLogAction({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: 'Timeline Conflict Resolved by User',
      category: 'SECURITY',
      details: `User explicitly verified graduation timeline: chosen value "${chosenValue}". Updated profile and synchronized with opportunity eligibility criteria.`,
      dataUsed: ['Expected Graduation Date', 'Transcript Path Choice'],
      autonomyLevel,
      userConsentGranted: true,
    });
  };

  // Document upload handler
  const handleUploadDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Opportunity selection
  const handleSelectOpportunity = (opp: Opportunity) => {
    setActiveOpportunity(opp);
    setActiveTab('workspace');
  };

  // Notification selection action
  const handleNotificationSelect = (notif: NotificationItem) => {
    if (notif.type === 'interview') {
      setActiveTab('email');
    } else if (notif.type === 'conflict') {
      setActiveTab('documents');
    } else if (notif.opportunityId) {
      const match = opportunities.find((o) => o.id === notif.opportunityId);
      if (match) {
        setActiveOpportunity(match);
        setActiveTab('workspace');
      }
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleGmail = () => {
    const newState = !gmailConnected;
    setGmailConnected(newState);
    handleLogAction({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action: newState ? 'Gmail Integration Authorized' : 'Gmail Integration Access Revoked',
      category: 'SECURITY',
      details: newState
        ? 'User authorized read-only inbox access for opportunity tracking.'
        : 'User revoked email agent access.',
      dataUsed: ['Google Workspace OAuth Scopes'],
      autonomyLevel,
      userConsentGranted: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autonomyLevel={autonomyLevel}
        setAutonomyLevel={setAutonomyLevel}
        notifications={notifications}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        gmailConnected={gmailConnected}
        onToggleGmail={handleToggleGmail}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            opportunities={opportunities}
            onSelectOpportunity={handleSelectOpportunity}
            conflicts={conflicts}
            onResolveConflictClick={() => setActiveTab('documents')}
            onOpenEmailAgent={() => setActiveTab('email')}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'discovery' && (
          <DiscoveryView
            opportunities={opportunities}
            onSelectOpportunity={handleSelectOpportunity}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceView
            opportunity={activeOpportunity}
            userProfile={userProfile}
            autonomyLevel={autonomyLevel}
            onLogAction={handleLogAction}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileVaultView
            profile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentHubView
            documents={documents}
            conflicts={conflicts}
            onResolveConflict={handleResolveConflict}
            onUploadDocument={handleUploadDocument}
            userProfile={userProfile}
            onLogAction={handleLogAction}
          />
        )}

        {activeTab === 'email' && (
          <EmailAgentView
            emails={emails}
            gmailConnected={gmailConnected}
            onToggleGmail={handleToggleGmail}
            userProfile={userProfile}
            autonomyLevel={autonomyLevel}
            onLogAction={handleLogAction}
          />
        )}

        {activeTab === 'security' && (
          <SecurityAuditView
            autonomyLevel={autonomyLevel}
            setAutonomyLevel={setAutonomyLevel}
            auditLogs={auditLogs}
            gmailConnected={gmailConnected}
            onToggleGmail={handleToggleGmail}
          />
        )}

        {activeTab === 'report' && (
          <ArchitectureReportView />
        )}
      </main>

      {/* Notification Modal Drawer */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onSelectAction={handleNotificationSelect}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">OpportunityOS</span>
            <span>—</span>
            <span>Personal Opportunity & Application Agent</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Autonomy Level: <strong className="text-slate-800">{autonomyLevel.replace(/_/g, ' ')}</strong></span>
            <span>•</span>
            <span>Zero-Fabrication Guarantee</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('report')} 
              className="text-indigo-600 font-semibold hover:underline"
            >
              System Specs & Implementation Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

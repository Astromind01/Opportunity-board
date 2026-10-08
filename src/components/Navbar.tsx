import React from 'react';
import { 
  Compass, 
  FileText, 
  User, 
  FolderLock, 
  Mail, 
  ShieldCheck, 
  Layers, 
  Bell, 
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { AutonomyLevel, NotificationItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  autonomyLevel: AutonomyLevel;
  setAutonomyLevel: (lvl: AutonomyLevel) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onOpenNotifications: () => void;
  gmailConnected: boolean;
  onToggleGmail: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  autonomyLevel,
  setAutonomyLevel,
  notifications: _notifications,
  unreadCount,
  onOpenNotifications,
  gmailConnected,
  onToggleGmail,
}) => {
  const [showAutonomyDropdown, setShowAutonomyDropdown] = React.useState(false);

  const getAutonomyBadge = () => {
    switch (autonomyLevel) {
      case 'LEVEL_1_ASSIST':
        return {
          label: 'Level 1: Assist',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-500',
          desc: 'Agent discovers & drafts; user manually submits.',
        };
      case 'LEVEL_2_APPROVAL':
        return {
          label: 'Level 2: Approval',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotColor: 'bg-emerald-500',
          desc: 'Agent fills applications; requires explicit user sign-off before submit.',
        };
      case 'LEVEL_3_AUTHORIZED_AUTOMATION':
        return {
          label: 'Level 3: Authorized Auto',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
          dotColor: 'bg-purple-500',
          desc: 'Auto-submits pre-authorized categories; pauses on sensitive data & declarations.',
        };
    }
  };

  const badgeInfo = getAutonomyBadge();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'discovery', label: 'Discovery', icon: Compass },
    { id: 'workspace', label: 'Workspace', icon: FileText },
    { id: 'profile', label: 'Profile Vault', icon: User },
    { id: 'documents', label: 'Docs & Conflicts', icon: FolderLock },
    { id: 'email', label: 'Email Agent', icon: Mail },
    { id: 'security', label: 'Security & Audit', icon: ShieldCheck },
    { id: 'report', label: 'Specs & Architecture', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-900/10 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">Opportunity<span className="text-indigo-600">OS</span></span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">AGENT</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">Personal Opportunity & Application Intelligence</p>
              </div>
            </button>
          </div>

          {/* Autonomy Level Control & Agent Status */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Autonomy Level Selector */}
            <div className="relative">
              <button
                onClick={() => setShowAutonomyDropdown(!showAutonomyDropdown)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${badgeInfo.badgeColor}`}
                title="Select Agent Autonomy Level"
              >
                <span className={`w-2 h-2 rounded-full ${badgeInfo.dotColor} animate-pulse`} />
                <span>{badgeInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showAutonomyDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-xs z-50">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-slate-900">Agent Autonomy Level</p>
                    <p className="text-[11px] text-slate-500">Configure how much independent authority OpportunityOS has.</p>
                  </div>

                  <button
                    onClick={() => {
                      setAutonomyLevel('LEVEL_1_ASSIST');
                      setShowAutonomyDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start space-x-2.5 ${
                      autonomyLevel === 'LEVEL_1_ASSIST' ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Level 1: Assist (Default)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Agent discovers, drafts answers, and prepares materials. You submit manually.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setAutonomyLevel('LEVEL_2_APPROVAL');
                      setShowAutonomyDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start space-x-2.5 ${
                      autonomyLevel === 'LEVEL_2_APPROVAL' ? 'bg-emerald-50 text-emerald-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Level 2: Approval</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Agent prepares entire application packet, but requires your explicit approval before any submission.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setAutonomyLevel('LEVEL_3_AUTHORIZED_AUTOMATION');
                      setShowAutonomyDropdown(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start space-x-2.5 ${
                      autonomyLevel === 'LEVEL_3_AUTHORIZED_AUTOMATION' ? 'bg-purple-50 text-purple-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Level 3: Authorized Automation</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Auto-submits for pre-authorized categories. Hard stops on sensitive ID, oaths, and CAPTCHAs.</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Email Agent status button */}
            <button
              onClick={onToggleGmail}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                gmailConnected 
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Gmail sync status"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{gmailConnected ? 'Gmail Synced' : 'Connect Email'}</span>
            </button>

            {/* Anti-Fabrication Privacy Shield Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Fabrication Guard</span>
            </div>
          </div>

          {/* Right Action: Notifications Bell */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications & Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Avatar Capsule */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center">
                AZ
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Amina Al-Mansoor</p>
                <p className="text-[10px] text-slate-500 leading-tight">CGPA 3.92 • Imperial</p>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'documents' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="1 Unresolved Conflict" />
                )}
                {item.id === 'workspace' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">Active</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

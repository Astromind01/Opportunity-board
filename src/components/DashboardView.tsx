import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Award, 
  Calendar, 
  Send, 
  ChevronRight, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  MailCheck,
  Filter
} from 'lucide-react';
import { Opportunity, OpportunityCategory, ConflictItem } from '../types';

interface DashboardViewProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  conflicts: ConflictItem[];
  onResolveConflictClick: () => void;
  onOpenEmailAgent: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  opportunities,
  onSelectOpportunity,
  conflicts,
  onResolveConflictClick,
  onOpenEmailAgent,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Opportunities' },
    { id: 'Scholarship', label: 'Scholarships' },
    { id: 'Fellowship', label: 'Fellowships' },
    { id: 'Competition', label: 'Competitions' },
    { id: 'Internship', label: 'Internships' },
    { id: 'Grant', label: 'Grants' },
    { id: 'Conference', label: 'Conferences' },
    { id: 'Program', label: 'Programs' },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedCategory === 'All') return true;
    return opp.category === selectedCategory;
  });

  const topOpportunities = [...filteredOpportunities].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  const closingSoon = [...opportunities].sort((a, b) => a.daysRemaining - b.daysRemaining).slice(0, 3);

  const unresolvedConflict = conflicts.find((c) => !c.resolved);

  return (
    <div className="space-y-6">
      {/* Hero: "What should I care about today?" */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Opportunity Intelligence • Thursday, Oct 8, 2026</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              What opportunities should I care about today?
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Your profile is matched with <strong className="text-white">8 high-fit opportunities</strong>. 
              Priority focus today: you received a <span className="text-indigo-300 font-semibold underline decoration-indigo-400/50 underline-offset-2">Rhodes Scholarship Interview Invitation</span> needing confirmation, 
              and the <span className="text-amber-300 font-semibold">Gates Cambridge Scholarship (94% match)</span> closes in 14 days with 1 referee letter pending.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectOpportunity(opportunities[0])}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Resume Active Workspace (Rhodes)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenEmailAgent}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/30 text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <MailCheck className="w-4 h-4 text-indigo-300" />
              <span>Review Interview Email (1 Urgent)</span>
            </button>

            <button
              onClick={() => onNavigateTab('discovery')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
            >
              <span>Explore All 8 Opportunities</span>
            </button>
          </div>
        </div>
      </div>

      {/* "NEEDS YOUR ATTENTION" Alert Queue */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Needs Your Attention (3 Action Items)</h2>
              <p className="text-xs text-slate-600">Items requiring your explicit decision before the agent can proceed.</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Item 1: Interview Scheduling */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-sm border border-purple-200">
                  Email Agent
                </span>
                <span className="text-[11px] font-medium text-rose-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Closes in 4d
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Rhodes Finalist Interview</h3>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Regional committee invited you for an Oxford panel on Oct 16. AI has prepared an availability confirmation reply.
              </p>
            </div>
            <button
              onClick={onOpenEmailAgent}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition-colors text-center"
            >
              Review & Send Reply →
            </button>
          </div>

          {/* Item 2: Conflict Resolution */}
          {unresolvedConflict && (
            <div className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-xs flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                    Conflict Detected
                  </span>
                  <span className="text-[11px] font-medium text-amber-700">Action Block</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Graduation Year Mismatch</h3>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  CV says 2028, but Academic Transcript registers 2029 (Integrated MEng track). Scholarships require exact year.
                </p>
              </div>
              <button
                onClick={onResolveConflictClick}
                className="mt-3 w-full py-1.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-colors text-center"
              >
                Resolve Conflict (1 min) →
              </button>
            </div>
          )}

          {/* Item 3: Missing Document */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                  Missing Document
                </span>
                <span className="text-[11px] font-medium text-slate-500">14 Days Left</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Gates Cambridge Referee 2</h3>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Application is at 94% match, but second academic letter of recommendation is not yet verified on portal.
              </p>
            </div>
            <button
              onClick={() => onSelectOpportunity(opportunities[1])}
              className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors text-center"
            >
              Open Gates Checklist →
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Tracked Opportunities</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{opportunities.length}</p>
          <div className="flex items-center text-[10px] text-emerald-600 mt-1 font-medium">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +2 this week
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Average Match</p>
          <p className="text-xl font-bold text-indigo-600 mt-1">92.8%</p>
          <p className="text-[10px] text-slate-500 mt-1">Based on GPA & papers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">In Workspace</p>
          <p className="text-xl font-bold text-slate-900 mt-1">2 Active</p>
          <p className="text-[10px] text-blue-600 mt-1 font-medium">Rhodes & Gates</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Submitted (Logged)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">1 Tracked</p>
          <p className="text-[10px] text-emerald-600 mt-1">Thiel Fellowship #8912</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Upcoming Interviews</p>
          <p className="text-xl font-bold text-purple-700 mt-1">1 Pending</p>
          <p className="text-[10px] text-purple-600 mt-1 font-medium">Rhodes Oxford Panel</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Anti-Fabrication</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">100%</p>
          <div className="flex items-center text-[10px] text-emerald-600 mt-1 font-medium">
            <ShieldCheck className="w-3 h-3 mr-0.5" /> All claims verified
          </div>
        </div>
      </div>

      {/* Opportunity Category Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Filter by Category:</span>
        </div>
        <button
          onClick={() => onNavigateTab('discovery')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          View Full Opportunity Catalog <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Top Recommended Cards + Closing Soon Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Award className="w-4 h-4 text-indigo-600 mr-2" /> Top Recommended For You Today
            </h2>
            <span className="text-xs text-slate-500">Sorted by Profile Eligibility & Mission Fit</span>
          </div>

          <div className="space-y-3.5">
            {topOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all p-5 shadow-xs hover:shadow-md group relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {opp.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{opp.organization}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{opp.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {opp.name}
                    </h3>

                    <p className="text-xs text-emerald-700 font-semibold">
                      Benefit: {opp.funding}
                    </p>
                  </div>

                  {/* Match Score Gauge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex flex-col items-end">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-2xl font-black text-indigo-600">{opp.matchScore}%</span>
                        <span className="text-[11px] font-semibold text-slate-400">match</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs mt-0.5 ${
                        opp.daysRemaining <= 14 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opp.daysRemaining} days left
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why You Qualify Bullet list */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">Why You Qualify</p>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {opp.reasonsQualify.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">Roadblocks / Missing</p>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {opp.missingRequirements.length > 0 ? (
                        opp.missingRequirements.slice(0, 2).map((missing, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-amber-500 font-bold shrink-0">!</span>
                            <span>{missing}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-emerald-600 font-medium">All eligibility requirements met</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Est. effort: <strong className="text-slate-700">{opp.estimatedEffortHours} hrs</strong> • Probability: <strong className="text-indigo-700">{opp.probabilityScore}</strong>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Official Page
                    </a>
                    <button
                      onClick={() => onSelectOpportunity(opp)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                    >
                      <span>Open Workspace</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Closing Soon Pipeline & Recent Audited Actions */}
        <div className="space-y-6">
          {/* Closing Soon Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center">
                <Calendar className="w-4 h-4 text-rose-500 mr-2" /> Deadlines Closing Soon
              </h3>
              <span className="text-[11px] text-slate-500">Next 30 Days</span>
            </div>

            <div className="space-y-3">
              {closingSoon.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp)}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-600">{opp.category}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs ${
                      opp.daysRemaining <= 14 ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {opp.daysRemaining} days left
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{opp.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{opp.organization}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Autonomy Status Card */}
          <div className="bg-linear-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100 p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agent Privacy Guarantee</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              OpportunityOS operates on strict <strong>Least-Privilege</strong>. Sensitive identity documents (passport numbers) remain redacted until final authorized submission. The agent never hallucinates unverified claims.
            </p>
            <button
              onClick={() => onNavigateTab('security')}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center"
            >
              Inspect Security Rules & Audit Logs <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

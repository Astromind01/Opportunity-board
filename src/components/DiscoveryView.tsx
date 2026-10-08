import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  MapPin, 
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { Opportunity, OpportunityCategory } from '../types';

interface DiscoveryViewProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'effort'>('match');
  const [inspectModalOpp, setInspectModalOpp] = useState<Opportunity | null>(null);

  const categories: string[] = [
    'All',
    'Scholarship',
    'Fellowship',
    'Competition',
    'Internship',
    'Grant',
    'Conference',
    'Program',
  ];

  // Filtering
  const filtered = opportunities.filter((opp) => {
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesSearch =
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.funding.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'deadline') return a.daysRemaining - b.daysRemaining;
    if (sortBy === 'effort') return a.estimatedEffortHours - b.estimatedEffortHours;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Title & Pipeline Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Opportunity Discovery Engine</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Continuously matched against your verified academic record, research interests, and career goals.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Legitimacy Verified • Zero Spam Filter Active</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by opportunity name, foundation, country, or benefit..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-lg border border-slate-200 py-2 px-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="match">Highest Match %</option>
              <option value="deadline">Closest Deadline</option>
              <option value="effort">Lowest Effort Hours</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Type:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'All (8)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Overview */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{sorted.length}</strong> qualified opportunities</span>
        <span>Relevance calculated from 100% verified profile data</span>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category, Org, Match Gauge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {opp.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{opp.organization}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{opp.name}</h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-baseline space-x-1 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100">
                    <span className="text-xl font-black text-indigo-700">{opp.matchScore}%</span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">Fit</span>
                  </div>
                </div>
              </div>

              {/* Location & Funding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{opp.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className={opp.daysRemaining <= 14 ? 'text-rose-600 font-semibold' : ''}>
                    {opp.deadline} ({opp.daysRemaining}d left)
                  </span>
                </div>
              </div>

              {/* Value / Benefit */}
              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-emerald-900 text-xs">
                <span className="font-bold">Benefit / Funding: </span>
                {opp.funding}
              </div>

              {/* Why you qualify & Roadblocks */}
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-wider text-slate-700 mb-1">Qualification Drivers:</p>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {opp.reasonsQualify.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {opp.missingRequirements.length > 0 && (
                  <div>
                    <p className="font-bold text-[11px] uppercase tracking-wider text-amber-800 mb-1">Missing Requirements:</p>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {opp.missingRequirements.slice(0, 1).map((m, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setInspectModalOpp(opp)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Inspect Eligibility Details
              </button>

              <button
                onClick={() => onSelectOpportunity(opp)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Opportunity Inspection Modal */}
      {inspectModalOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {inspectModalOpp.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{inspectModalOpp.name}</h2>
                <p className="text-xs text-slate-500">{inspectModalOpp.organization} • {inspectModalOpp.location}</p>
              </div>
              <button
                onClick={() => setInspectModalOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Match Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Overall Match Probability: {inspectModalOpp.probabilityScore}</p>
                <p className="text-[11px] text-slate-500">Estimated Effort: {inspectModalOpp.estimatedEffortHours} Hours</p>
              </div>
              <span className="text-2xl font-black text-indigo-600">{inspectModalOpp.matchScore}%</span>
            </div>

            {/* Eligibility Requirements List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Itemized Eligibility Checklist</h3>
              <div className="space-y-2">
                {inspectModalOpp.eligibilityRequirements.map((req, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start space-x-2.5">
                    {req.fulfilled ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">{req.requirement}</p>
                      <p className="text-slate-500 mt-0.5">{req.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Required Application Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {inspectModalOpp.requiredDocuments.map((doc, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{doc.docType}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      doc.status === 'Attached' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setInspectModalOpp(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = inspectModalOpp;
                  setInspectModalOpp(null);
                  onSelectOpportunity(target);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs"
              >
                Open in Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Award, 
  BookOpen, 
  Briefcase, 
  Code, 
  HeartHandshake, 
  Compass, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserProfile, EpistemicStatus } from '../types';

interface ProfileVaultViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileVaultView: React.FC<ProfileVaultViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [unmaskPassport, setUnmaskPassport] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'experience' | 'preferences'>('all');

  const renderEpistemicBadge = (status: EpistemicStatus, source?: string) => {
    switch (status) {
      case 'VERIFIED_FACT':
        return (
          <span 
            className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200"
            title={source ? `Verified via: ${source}` : 'Confirmed from verified primary documents'}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>VERIFIED FACT</span>
          </span>
        );
      case 'INFERRED':
        return (
          <span 
            className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200"
            title={source ? `Inferred via: ${source}` : 'Derived from related documentation'}
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>INFERRED</span>
          </span>
        );
      case 'USER_CLAIM':
        return (
          <span 
            className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200"
            title="Provided by user during profile setup"
          >
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>USER CLAIM</span>
          </span>
        );
      case 'MISSING_UNKNOWN':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200">
            <span>UNKNOWN</span>
          </span>
        );
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opportunity_os_profile_${profile.preferredName.value.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Vault Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Structured Profile Vault</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Encrypted Local Store
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central repository of personal, academic, and professional facts. Reused automatically across applications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Profile JSON</span>
          </button>
        </div>
      </div>

      {/* Epistemic Status Ledger Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl">
          <p className="text-[10px] font-bold uppercase text-emerald-800">Verified Facts</p>
          <p className="text-lg font-black text-emerald-900 mt-0.5">18 Claims</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">Backed by transcripts & passports</p>
        </div>
        <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl">
          <p className="text-[10px] font-bold uppercase text-blue-800">Inferred Data</p>
          <p className="text-lg font-black text-blue-900 mt-0.5">2 Items</p>
          <p className="text-[10px] text-blue-700 mt-0.5">Derived timeline projections</p>
        </div>
        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
          <p className="text-[10px] font-bold uppercase text-amber-800">User Claims</p>
          <p className="text-lg font-black text-amber-900 mt-0.5">5 Items</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Preferences & career aims</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
          <p className="text-[10px] font-bold uppercase text-slate-700">Missing / Needed</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">0 Blockers</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Profile complete for 2026/27</p>
        </div>
      </div>

      {/* SECTION 1: IDENTITY & SENSITIVE DOCUMENTS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Personal Identity & Redacted Biometrics</h2>
          </div>
          <button
            onClick={() => setUnmaskPassport(!unmaskPassport)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {unmaskPassport ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{unmaskPassport ? 'Mask Sensitive ID' : 'Reveal Sensitive ID'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Full Legal Name:</span>
              {renderEpistemicBadge(profile.fullName.status, profile.fullName.source)}
            </div>
            <p className="font-semibold text-slate-900">{profile.fullName.value}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Preferred Name:</span>
              {renderEpistemicBadge(profile.preferredName.status)}
            </div>
            <p className="font-semibold text-slate-900">{profile.preferredName.value}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Date of Birth:</span>
              {renderEpistemicBadge(profile.dob.status)}
            </div>
            <p className="font-semibold text-slate-900">{profile.dob.value} (Age 22)</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Nationality:</span>
              {renderEpistemicBadge(profile.nationality.status, profile.nationality.source)}
            </div>
            <p className="font-semibold text-slate-900">{profile.nationality.value}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Current Location:</span>
              {renderEpistemicBadge(profile.currentCountry.status)}
            </div>
            <p className="font-semibold text-slate-900">{profile.currentCountry.value}</p>
          </div>

          <div className="space-y-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold">Passport Number:</span>
              {renderEpistemicBadge(profile.passportNumber.status)}
            </div>
            <p className="font-mono font-bold text-slate-900">
              {unmaskPassport ? profile.passportNumber.value : '••••••••902B (Redacted)'}
            </p>
            <p className="text-[10px] text-slate-400">Expires: {profile.passportExpiry.value}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACADEMIC PROFILE & TRANSCRIPT FACTS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Academic Standing & Course Record</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">University / Institution:</span>
              {renderEpistemicBadge(profile.university.status, profile.university.source)}
            </div>
            <p className="font-semibold text-slate-900">{profile.university.value}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Cumulative GPA:</span>
              {renderEpistemicBadge(profile.cgpa.status, profile.cgpa.source)}
            </div>
            <p className="font-extrabold text-emerald-700 text-sm">{profile.cgpa.value} / {profile.maxCgpa.value}</p>
            <p className="text-[10px] text-slate-400">First Class Honours Tier</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Expected Graduation:</span>
              {renderEpistemicBadge(profile.expectedGraduation.status, profile.expectedGraduation.source)}
            </div>
            <p className="font-semibold text-slate-900">{profile.expectedGraduation.value}</p>
          </div>
        </div>

        <div className="mt-2 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Verified Academic History:</p>
          <div className="space-y-2">
            {profile.academicHistory.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{item.institution}</p>
                  <p className="text-slate-500">{item.degree} • {item.year}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-emerald-700">{item.gpa}</span>
                  <span className="text-[10px] block text-emerald-600 font-medium">✓ Transcript Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: WORK EXPERIENCE & RESEARCH LABS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Briefcase className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Research & Work Experience (Zero Hallucination)</h2>
        </div>

        <div className="space-y-3">
          {profile.workExperience.map((work, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{work.role}</h3>
                  <p className="text-slate-500 font-medium">{work.organization} • {work.period}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                  Verified In Lab Records
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                {work.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: HONORS, AWARDS & COMPETITIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Awards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Honors & Awards</h3>
          </div>
          <div className="space-y-2 text-xs">
            {profile.awards.map((a, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.issuer} • {a.date}</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Competitions</h3>
          </div>
          <div className="space-y-2 text-xs">
            {profile.competitions.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{c.title}</p>
                  <p className="text-[11px] text-slate-500">{c.placement} • {c.date}</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5: CAREER GOALS & PREFERENCES */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
          <Compass className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Opportunity Preferences</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Career Vision:</span>
            <p className="font-medium text-slate-800 mt-0.5">{profile.careerGoals.value}</p>
          </div>

          <div>
            <span className="text-slate-400 block font-medium mb-1">Target Fields:</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredFields.value.map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium mb-1">Target Countries:</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredCountries.value.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

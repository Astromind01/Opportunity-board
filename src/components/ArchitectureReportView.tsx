import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Code2,
  Lock,
  Database,
  Terminal
} from 'lucide-react';

export const ArchitectureReportView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase">
            System Design Specification
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-600">OpportunityOS v1.0 Prototype</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Technical Architecture & Prototype Implementation Report
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed transparency report covering implemented production capabilities, simulated components, external API boundaries, security models, and the engineering roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. What Has Been Implemented */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">1. What Has Been Implemented (Functional)</h2>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Unified Epistemic Profile Vault:</strong> Structured schema organizing biographical, academic, research, and preference records with strict classification into <em>VERIFIED FACT</em>, <em>INFERRED</em>, <em>USER CLAIM</em>, and <em>MISSING</em>.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Document Intelligence & Conflict Engine:</strong> Multi-document timeline reconciliation that detects conflicting dates (e.g. CV 2028 vs Certified Transcript 2029) and provides an interactive resolution gate before profile updates.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Anti-Fabrication Application Drafter:</strong> Server-side Gemini 3.8 Flash agent with strict zero-hallucination prompting, inline citation tagging, and dedicated user-input clarification requests for unverified personal anecdotes.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">15-Point Pre-Submission Quality Audit:</strong> Automated verification checking eligibility, deadlines, document presence, identity/date consistency, character limits, unsupported claims, and honor code declarations.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Three-Tier Autonomy Engine (Levels 1, 2, 3):</strong> Fine-grained policy enforcing assist mode, approval gates, and automatic hard-stops for sensitive identity documents, legal declarations, and CAPTCHAs.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Full-Stack Express + Vite Architecture:</strong> Dedicated server-side Gemini API proxy (`/api/ai/*`) ensuring API keys remain strictly server-side with telemetry headers.
              </div>
            </li>
          </ul>
        </div>

        {/* 2. What Is Mocked / Simulated */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">2. What Is Mocked or Simulated</h2>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Live External Web Portal Automation:</strong> Direct browser form autofill (e.g., automated headless browser navigating proprietary university portals) is simulated with one-click copy dossier packets and ethical boundary enforcement.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Live Gmail IMAP/REST Sync:</strong> Email threads (Rhodes interview invite, Gates deadline notice) are realistic seed data demonstrating classification, deadline parsing, and reply generation.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">OCR Binary Document Parsing:</strong> File uploads parse via Gemini multimodal text extraction when keys are configured, falling back to structured deterministic extractions for standard test fixtures.
              </div>
            </li>
          </ul>
        </div>

        {/* 3. What APIs and Integrations Are Required */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">3. Required External APIs & Integrations</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">Google Workspace (Gmail API):</p>
              <p className="text-slate-600 mt-0.5">
                OAuth2 Scopes: <code className="bg-white px-1 py-0.2 rounded-xs border text-[10px]">https://www.googleapis.com/auth/gmail.readonly</code> to scan opportunity threads and <code className="bg-white px-1 py-0.2 rounded-xs border text-[10px]">gmail.compose</code> for client-approved reply drafts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">Document Processing / Multimodal Vision:</p>
              <p className="text-slate-600 mt-0.5">
                Google Cloud Document AI or Gemini Multimodal (`gemini-3.8-flash`) for PDF transcript parsing, table extraction, and stamp/seal verification.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">Academic & Credential Verification Feeds:</p>
              <p className="text-slate-600 mt-0.5">
                National Student Clearinghouse (US), Gradintelligence (UK Higher Education Achievement Report - HEAR), or Open Badges 2.0 API.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Security Considerations Remaining */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">4. Critical Security Considerations</h2>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Zero-Knowledge Document Encryption:</strong> Sensitive PII (passports, national insurance/SSNs) must be encrypted at rest using AES-GCM-256 with user-held client-derived master keys (e.g. WebCrypto PBKDF2).
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Strict Prompt Injection Defense:</strong> Untrusted opportunity descriptions fetched from web portals must be sanitized before ingestion to prevent indirect prompt injection into essay drafting prompts.
              </div>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900">Audit Immutability:</strong> The agent action audit log should be cryptographically chained (Merkle tree hashing) to ensure tamper-evident records of agent actions.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 5. What Should Be Built Next */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">5. Roadmap: What Should Be Built Next</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Phase 1: Browser Extension</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-xs font-semibold">Q1</span>
            </div>
            <p className="text-slate-600 leading-normal">
              Chrome/Edge companion extension that detects active scholarship portal fields, matches them with verified profile attributes, and prompts user for one-click verified autofill.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Phase 2: Live Web Scraper Agent</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-xs font-semibold">Q2</span>
            </div>
            <p className="text-slate-600 leading-normal">
              Continuous background crawler monitoring university fellowship offices, funding grant portals, and international embassy announcements for freshly published RFP deadlines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Phase 3: Multi-Referee Tracker</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-xs font-semibold">Q3</span>
            </div>
            <p className="text-slate-600 leading-normal">
              Automated polite reminder scheduler for university professors and recommendation letter writers, with customized deadline countdowns and one-click draft updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

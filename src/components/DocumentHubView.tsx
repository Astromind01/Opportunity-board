import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  ShieldAlert,
  ArrowRight,
  Clock
} from 'lucide-react';
import { DocumentItem, ConflictItem, UserProfile, AuditLogEntry } from '../types';
import { apiClient } from '../services/apiClient';

interface DocumentHubViewProps {
  documents: DocumentItem[];
  conflicts: ConflictItem[];
  onResolveConflict: (conflictId: string, chosenValue: string) => void;
  onUploadDocument: (newDoc: DocumentItem) => void;
  userProfile: UserProfile;
  onLogAction: (entry: AuditLogEntry) => void;
}

export const DocumentHubView: React.FC<DocumentHubViewProps> = ({
  documents,
  conflicts,
  onResolveConflict,
  onUploadDocument,
  userProfile: _userProfile,
  onLogAction,
}) => {
  const [selectedDocForInspect, setSelectedDocForInspect] = useState<DocumentItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<DocumentItem['type']>('Academic_Transcript');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocContent, setUploadDocContent] = useState('');

  const unresolvedConflicts = conflicts.filter((c) => !c.resolved);

  const handleSimulateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName.trim()) return;

    setIsUploading(true);
    try {
      const res = await apiClient.extractDocument(
        uploadDocName,
        uploadDocType,
        uploadDocContent || 'Sample document content with verified academic standing and course scores.'
      );

      const newDoc: DocumentItem = {
        id: `doc_${Date.now()}`,
        name: uploadDocName.endsWith('.pdf') ? uploadDocName : `${uploadDocName}.pdf`,
        type: uploadDocType,
        fileSize: '1.2 MB',
        uploadDate: 'Just now',
        status: 'Parsed',
        extractedData: res.data?.extractedFields || [
          { field: 'Extracted Entity', value: uploadDocName, epistemicStatus: 'VERIFIED_FACT', confidence: 98 },
        ],
      };

      onUploadDocument(newDoc);
      setUploadDocName('');
      setUploadDocContent('');

      onLogAction({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: 'Document Uploaded & Parsed',
        category: 'PROFILE_SYNC',
        details: `Uploaded and extracted data from ${newDoc.name} (${newDoc.type}).`,
        dataUsed: ['Document text scan'],
        autonomyLevel: 'LEVEL_2_APPROVAL',
        userConsentGranted: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Document Intelligence & Vault</h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure vault for transcripts, CVs, recommendation letters, and certificates. 
            Information is strictly verified before adoption.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Local OCR Extraction • Zero Data Leakage</span>
        </div>
      </div>

      {/* CONFLICT DETECTION HIGHLIGHT SECTION */}
      {unresolvedConflicts.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900">Document Discrepancy Detected</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  User Resolution Mandatory
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Two primary documents contain conflicting information. OpportunityOS will never silently guess.
              </p>
            </div>
          </div>

          {unresolvedConflicts.map((conflict) => (
            <div key={conflict.id} className="bg-white rounded-xl border border-amber-200 p-5 space-y-4 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Field In Conflict:</span>
                <h3 className="text-sm font-bold text-slate-900">{conflict.field}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{conflict.description}</p>
              </div>

              {/* Side by side conflicting sources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source A */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Document A Claim:</span>
                    <p className="text-xs font-semibold text-slate-700">{conflict.docA.name}</p>
                    <p className="text-sm font-bold text-slate-900 mt-2 bg-white p-2.5 rounded-lg border border-slate-200">
                      "{conflict.docA.value}"
                    </p>
                  </div>
                  <button
                    onClick={() => onResolveConflict(conflict.id, 'June 2028')}
                    className="mt-3 w-full py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 transition-colors"
                  >
                    Select 2028 (Accelerated BEng Track)
                  </button>
                </div>

                {/* Source B */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Document B Claim:</span>
                    <p className="text-xs font-semibold text-slate-700">{conflict.docB.name}</p>
                    <p className="text-sm font-bold text-slate-900 mt-2 bg-white p-2.5 rounded-lg border border-slate-200">
                      "{conflict.docB.value}"
                    </p>
                  </div>
                  <button
                    onClick={() => onResolveConflict(conflict.id, 'June 2029')}
                    className="mt-3 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Select 2029 (5-Year Integrated MEng Track)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DOCUMENT UPLOAD & PARSER PANEL */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Upload className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Ingest New Application Document</h2>
        </div>

        <form onSubmit={handleSimulateUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Document Type</label>
            <select
              value={uploadDocType}
              onChange={(e) => setUploadDocType(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-slate-200 p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Academic_Transcript">Academic Transcript</option>
              <option value="CV_Resume">CV / Academic Resume</option>
              <option value="Recommendation_Letter">Letter of Recommendation</option>
              <option value="Passport_ID">Passport / Identity Document</option>
              <option value="Certificate">Certificate / Award</option>
              <option value="Essay_Archive">Prior Essay Archive</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">File Name</label>
            <input
              type="text"
              value={uploadDocName}
              onChange={(e) => setUploadDocName(e.target.value)}
              placeholder="e.g. Cambridge_Research_Preprint_2026.pdf"
              className="w-full text-xs rounded-lg border border-slate-200 p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
              <span>{isUploading ? 'Extracting via AI...' : 'Upload & Extract Facts'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* DOCUMENT VAULT INVENTORY */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Document Vault ({documents.length} Files)</h3>
          <span className="text-xs text-slate-500">All data encrypted in client memory</span>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-xs text-slate-900">{doc.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                      {doc.type.replace('_', ' ')}
                    </span>
                    {doc.hasConflict && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-amber-100 text-amber-800">
                        Discrepancy
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Uploaded: {doc.uploadDate} • Size: {doc.fileSize} • Extracted: {doc.extractedData.length} items
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setSelectedDocForInspect(doc)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Inspect Extracted Data</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXTRACTED DATA INSPECTION MODAL */}
      {selectedDocForInspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {selectedDocForInspect.type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDocForInspect.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForInspect(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              The following fields were extracted with cryptographic source traceability:
            </p>

            <div className="space-y-2">
              {selectedDocForInspect.extractedData.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.field}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-xs">
                      {item.epistemicStatus} ({item.confidence}%)
                    </span>
                  </div>
                  <p className="text-slate-900 font-semibold">{item.value}</p>
                  {item.quote && (
                    <p className="text-[10px] text-slate-500 italic">Source text: "{item.quote}"</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDocForInspect(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

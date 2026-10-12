/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, FileText, Eye, 
  UserCheck, Clock, Check, ArrowRight, Hash, Sparkles
} from 'lucide-react';
import { EnrollmentApplication, UploadedDocument } from '../../types/medicare';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';
import { APP_IMAGES } from '../../assets/images';
import { formatDate, formatCurrency } from '../../utils/helpers';

interface OfficerReviewPortalProps {
  application: EnrollmentApplication;
  documents: UploadedDocument[];
  onUpdateAppStatus: (status: EnrollmentApplication['status']) => void;
  onUpdateDocStatus: (docId: string, status: 'verified' | 'needs_reupload') => void;
}

export const OfficerReviewPortal: React.FC<OfficerReviewPortalProps> = ({
  application,
  documents,
  onUpdateAppStatus,
  onUpdateDocStatus,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const allDocsVerified = documents.every((d) => d.status === 'verified');

  const handleApproveEnrollment = () => {
    onUpdateAppStatus('approved');
    setSuccessNotice('Application officially approved! Medicare Beneficiary record active.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleRequestInfo = () => {
    onUpdateAppStatus('under_review');
    setSuccessNotice('Formal notice dispatched to beneficiary requesting supplemental employer records.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Officer Console Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={APP_IMAGES.advisorAvatar}
              alt="CMS Officer Sarah Jenkins"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-700 shadow-xs"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                CMS Enrollment Determination Workstation
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-xs border border-slate-200 font-semibold">
                Officer ID: CMS-7892
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
              Case Officer Sarah Jenkins · Adjudication Console
            </h2>
            <p className="text-xs text-slate-500">
              Reviewing pending Medicare Part A, Part B &amp; Part C applications against federal eligibility registries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Security Clearance:</span>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            FIPS Level 4 Adjudicator
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Grid: Application Overview + Document Adjudication */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Beneficiary Data & Application Details (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Case File
                </span>
                <h3 className="text-base font-bold font-mono text-blue-900">
                  {application.applicationNumber}
                </h3>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                application.status === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {application.status === 'approved' ? 'Active / Approved' : 'Under Determination'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-semibold text-slate-900">Eleanor Vance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Medicare ID (MBI):</span>
                <span className="font-mono font-bold text-slate-900">1EG4-TE5-MK72</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Qualifying Category:</span>
                <span className="font-semibold text-slate-900">Special Enrollment (SEP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Plan:</span>
                <span className="font-semibold text-slate-900">{application.selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Premium:</span>
                <span className="font-mono font-bold text-slate-900">
                  {application.selectedPlan.monthlyPremium === 0 ? '$0 / mo' : formatCurrency(application.selectedPlan.monthlyPremium)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Electronic Attestation:</span>
                <span className="font-mono text-emerald-700 font-semibold">18 U.S.C. § 1001 Signed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adjudication Notes / Officer Determination
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Enter CMS case notes, verification audit codes, or exceptions..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleApproveEnrollment}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Enrollment &amp; Issue Coverage</span>
              </button>

              <button
                onClick={handleRequestInfo}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Request Additional Documentation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Uploaded Documents for Inspection (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Document Integrity &amp; OCR Inspection
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect uploaded proofs, review SHA-256 hashes, and approve document compliance.
                </p>
              </div>

              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                allDocsVerified
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {allDocsVerified ? 'All Documents Verified' : 'Pending Verification'}
              </span>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.fileName}</h4>
                        <p className="text-[11px] text-slate-500">{doc.categoryLabel}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className="font-mono text-emerald-700">SHA-256: {doc.sha256Checksum.substring(0, 16)}...</span>
                          <span>·</span>
                          <span>{doc.encryptionStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      {doc.status === 'verified' ? (
                        <button
                          onClick={() => onUpdateDocStatus(doc.id, 'needs_reupload')}
                          className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                        >
                          Flag Re-upload
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateDocStatus(doc.id, 'verified')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-2xs"
                        >
                          Mark Verified
                        </button>
                      )}
                    </div>
                  </div>

                  {/* OCR Summary Strip */}
                  {doc.ocrExtractedData && (
                    <div className="p-2.5 bg-white rounded-md border border-slate-200 text-xs">
                      <div className="flex justify-between items-center mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        <span>OCR Extracted Data ({doc.ocrExtractedData.confidence}% Confidence)</span>
                        <span className="text-blue-700">{doc.ocrExtractedData.documentTypeDetected}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(doc.ocrExtractedData.extractedFields).slice(0, 4).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-slate-500">{k}:</span>
                            <span className="font-semibold text-slate-800 font-mono">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <DocumentPreviewModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onVerify={onUpdateDocStatus}
          isOfficer={true}
        />
      )}
    </div>
  );
};

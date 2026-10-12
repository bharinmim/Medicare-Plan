/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Download, CheckCircle, Clock, AlertTriangle, FileText, Hash } from 'lucide-react';
import { UploadedDocument } from '../../types/medicare';
import { formatFileSize, formatDate } from '../../utils/helpers';

interface DocumentPreviewModalProps {
  document: UploadedDocument | null;
  onClose: () => void;
  onVerify?: (docId: string, status: 'verified' | 'needs_reupload') => void;
  isOfficer?: boolean;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onVerify,
  isOfficer = false,
}) => {
  if (!document) return null;

  const handleDownload = () => {
    // Generate simulated download or download preview url
    const element = window.document.createElement('a');
    element.setAttribute('href', document.previewUrl || 'data:text/plain;charset=utf-8,Medicare Document Content Verified');
    element.setAttribute('download', document.fileName);
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">{document.fileName}</h3>
              <p className="text-xs text-slate-400">{document.categoryLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status & Security Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verification Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                {document.status === 'verified' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Verified &amp; Authenticated</span>
                  </>
                )}
                {document.status === 'pending_review' && (
                  <>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700">Pending Review</span>
                  </>
                )}
                {document.status === 'needs_reupload' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-700">Needs Re-upload</span>
                  </>
                )}
                {document.status === 'analyzing' && (
                  <>
                    <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm font-semibold text-blue-700">Analyzing OCR...</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">File Specifications</p>
              <p className="text-xs text-slate-700 mt-1">
                Size: <span className="font-mono font-medium">{formatFileSize(document.fileSize)}</span> · Date: {formatDate(document.uploadDate)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Encryption Standard</p>
              <div className="flex items-center gap-1.5 mt-1 text-slate-700 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{document.encryptionStatus}</span>
              </div>
            </div>
          </div>

          {/* Document Preview Viewport */}
          <div className="border border-slate-200 rounded-lg bg-slate-100 p-4 min-h-60 flex flex-col items-center justify-center relative overflow-hidden">
            {document.previewUrl ? (
              <img
                src={document.previewUrl}
                alt={document.fileName}
                className="max-h-72 max-w-full rounded-md object-contain shadow-xs border border-slate-200"
              />
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-700 mx-auto mb-3 shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{document.fileName}</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Official Medicare PDF Document Document format parsed and decrypted in memory.
                </p>
              </div>
            )}
          </div>

          {/* Automated OCR Extracted Fields */}
          {document.ocrExtractedData && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Optical Character Recognition (OCR) Analysis
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-xs">
                    {document.ocrExtractedData.confidence}% Confidence
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {document.ocrExtractedData.documentTypeDetected}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(document.ocrExtractedData.extractedFields).map(([key, value]) => (
                  <div key={key} className="bg-white p-2.5 rounded-md border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{key}:</span>
                    <span className="font-semibold text-slate-900 font-mono text-right">{value}</span>
                  </div>
                ))}
              </div>

              {document.notes && (
                <div className="mt-3 p-2 bg-blue-50/70 border border-blue-200 rounded-md text-xs text-blue-900">
                  <span className="font-semibold">Reviewer Notes: </span>
                  {document.notes}
                </div>
              )}
            </div>
          )}

          {/* Cryptographic SHA-256 Checksum */}
          <div className="p-3 bg-slate-900 text-slate-300 rounded-lg font-mono text-[11px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">SHA-256: </span>
                <span className="text-emerald-400 select-all">{document.sha256Checksum}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0 bg-slate-800 px-2 py-0.5 rounded-xs">
              TAMPER PROOF
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download Original File
          </button>

          <div className="flex items-center gap-2">
            {isOfficer && onVerify && (
              <>
                <button
                  onClick={() => {
                    onVerify(document.id, 'needs_reupload');
                    onClose();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Flag for Re-upload
                </button>
                <button
                  onClick={() => {
                    onVerify(document.id, 'verified');
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                >
                  Approve Document
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

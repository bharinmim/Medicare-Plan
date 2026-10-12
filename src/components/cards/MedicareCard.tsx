/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, RotateCw, Printer, Shield, Eye, EyeOff } from 'lucide-react';
import { BeneficiaryProfile } from '../../types/medicare';

interface MedicareCardProps {
  beneficiary: BeneficiaryProfile;
  partAEffective?: string;
  partBEffective?: string;
  status?: string;
}

export const MedicareCard: React.FC<MedicareCardProps> = ({
  beneficiary,
  partAEffective = '05-01-2026',
  partBEffective = '05-01-2026',
  status = 'Active Coverage',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [maskMBI, setMaskMBI] = useState(false);

  const handleCopyMBI = () => {
    navigator.clipboard.writeText(beneficiary.mbi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayMBI = maskMBI
    ? `${beneficiary.mbi.substring(0, 4)}-***-****`
    : beneficiary.mbi;

  return (
    <div className="flex flex-col items-center max-w-md w-full mx-auto">
      {/* 3D Card Container with Perspective */}
      <div className="w-full h-64 [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <div
          className={`relative w-full h-full duration-500 rounded-xl shadow-md transition-transform [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* FRONT OF MEDICARE CARD */}
          <div className="absolute inset-0 w-full h-full rounded-xl bg-white border border-slate-300 p-5 flex flex-col justify-between overflow-hidden [backface-visibility:hidden] select-none shadow-sm">
            {/* Top Red & Blue Federal Header */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-900 border border-amber-400 flex items-center justify-center text-[10px] text-amber-200 font-serif font-bold">
                    USA
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-700 tracking-wider uppercase leading-none">
                      Medicare Health Insurance
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-tight">
                      Centers for Medicare &amp; Medicaid Services
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-xs border border-blue-200">
                    {status}
                  </span>
                </div>
              </div>

              {/* Red & Blue Stripes */}
              <div className="h-1.5 w-full flex mt-2 mb-3">
                <div className="h-full w-1/2 bg-red-600"></div>
                <div className="h-full w-1/2 bg-blue-800"></div>
              </div>
            </div>

            {/* Beneficiary Details Body */}
            <div className="space-y-2">
              <div>
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Name/Nombre</p>
                <p className="text-base font-bold font-display uppercase tracking-wide text-slate-900">
                  {beneficiary.firstName} {beneficiary.lastName}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Medicare Number/Número de Medicare</p>
                <p className="text-lg font-mono font-bold tracking-widest text-blue-900">
                  {displayMBI}
                </p>
              </div>
            </div>

            {/* Entitlements Table */}
            <div className="pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-[8px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <span>Entitled to/Con derecho a</span>
                <span>Coverage starts/Comienza cobertura</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 font-mono">
                <span className="text-slate-700">HOSPITAL (PART A)</span>
                <span className="text-blue-900 font-bold">{partAEffective}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 font-mono mt-0.5">
                <span className="text-slate-700">MEDICAL (PART B)</span>
                <span className="text-blue-900 font-bold">{partBEffective}</span>
              </div>
            </div>
          </div>

          {/* BACK OF MEDICARE CARD */}
          <div className="absolute inset-0 w-full h-full rounded-xl bg-slate-100 border border-slate-300 p-5 flex flex-col justify-between overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] select-none text-slate-700">
            {/* Magnetic Stripe representation */}
            <div className="-mx-5 -mt-5 h-9 bg-slate-800 mb-2"></div>

            <div className="space-y-2 text-[10px] leading-tight">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Customer Service / Hotline</p>
                  <p className="text-slate-600">1-800-MEDICARE (1-800-633-4227)</p>
                  <p className="text-slate-500">TTY: 1-877-486-2048 (Available 24/7)</p>
                </div>
                <div className="text-right">
                  <Shield className="w-5 h-5 text-blue-700 inline-block" />
                  <p className="text-[8px] text-slate-500 font-mono">CMS-10106</p>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xs border border-slate-200 text-[9px] text-slate-600">
                <p className="font-semibold text-slate-800 mb-0.5">Important Security Notice:</p>
                Keep this card secure like a credit card. Only provide your Medicare Number to doctors, pharmacists, or trusted health plans. Report Medicare fraud to 1-800-HHS-TIPS.
              </div>

              {/* Signature Strip */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 bg-white border border-slate-300 h-6 flex items-center px-2 text-[9px] font-serif italic text-slate-500">
                  {beneficiary.firstName} {beneficiary.lastName} (Digital Signature on File)
                </div>
                <span className="text-[8px] uppercase font-semibold text-slate-500">Signature</span>
              </div>
            </div>

            <div className="text-center text-[8px] text-slate-500 border-t border-slate-200 pt-1">
              Social Security Administration · Department of Health and Human Services
            </div>
          </div>
        </div>
      </div>

      {/* Card Controls */}
      <div className="w-full flex items-center justify-between gap-2 mt-3 pt-1 text-xs">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-700 transition-colors shadow-2xs text-xs font-medium"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>{isFlipped ? 'Show Front' : 'Flip to Back'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMaskMBI(!maskMBI)}
            title={maskMBI ? 'Show Full MBI' : 'Mask MBI'}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-700 transition-colors"
          >
            {maskMBI ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopyMBI}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-slate-700 transition-colors text-xs font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy MBI</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-md transition-colors text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

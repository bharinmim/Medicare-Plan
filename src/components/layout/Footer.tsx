/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Column 1: Organization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                M
              </div>
              <span className="font-bold text-white text-sm font-display tracking-tight">
                Medicare.gov Portal
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official federal enrollment system administered by the Centers for Medicare &amp; Medicaid Services (CMS) in partnership with the Social Security Administration.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>HIPAA Level 4 Cryptographic Vault</span>
            </div>
          </div>

          {/* Column 2: Beneficiary Services */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-display">
              Beneficiary Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#coverage" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Part A &amp; Part B Hospital/Medical</a></li>
              <li><a href="#advantage" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Medicare Advantage (Part C) Directory</a></li>
              <li><a href="#drugs" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Part D Prescription Drug Formulary</a></li>
              <li><a href="#medigap" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Medigap Supplemental Policies</a></li>
              <li><a href="#extra-help" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Extra Help Low-Income Subsidy (LIS)</a></li>
            </ul>
          </div>

          {/* Column 3: Legal & Security */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-display">
              Compliance &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Act of 1974 Statement</a></li>
              <li><a href="#freedom" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Freedom of Information Act (FOIA)</a></li>
              <li><a href="#nondiscrimination" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Section 504 Nondiscrimination Notice</a></li>
              <li><a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">FIPS 140-2 Level 3 Key Architecture</a></li>
              <li><a href="#vulnerability" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Vulnerability Disclosure Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Emergency */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-display">
              Assistance &amp; Hotline
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>1-800-MEDICARE</span>
              </div>
              <p className="text-[11px] text-slate-400">Available 24 hours a day, 7 days a week</p>
              <p className="text-[10px] text-slate-500">TTY: 1-877-486-2048 for hearing impaired</p>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Health and Human Services (HHS) · 7500 Security Boulevard, Baltimore, MD 21244
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Centers for Medicare &amp; Medicaid Services. An official government website.</p>
          <div className="flex items-center gap-4">
            <span>English / Español</span>
            <span>·</span>
            <span>Accessibility Standards WCAG 2.1 AA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

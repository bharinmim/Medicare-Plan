/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, Clock, FileText, ArrowRight, 
  ExternalLink, Phone, Calendar, HeartHandshake, AlertCircle
} from 'lucide-react';
import { BeneficiaryProfile, EnrollmentApplication, UploadedDocument } from '../../types/medicare';
import { MedicareCard } from '../cards/MedicareCard';
import { APP_IMAGES } from '../../assets/images';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface BeneficiaryDashboardProps {
  beneficiary: BeneficiaryProfile;
  application: EnrollmentApplication;
  documents: UploadedDocument[];
  onNavigate: (tab: string) => void;
}

export const BeneficiaryDashboard: React.FC<BeneficiaryDashboardProps> = ({
  beneficiary,
  application,
  documents,
  onNavigate,
}) => {
  const [selectedPlanDetailsOpen, setSelectedPlanDetailsOpen] = useState(false);

  const verifiedDocCount = documents.filter((d) => d.status === 'verified').length;
  const pendingDocCount = documents.filter((d) => d.status === 'pending_review' || d.status === 'analyzing').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Authentic Hero Photo Split */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Beneficiary Health Portal
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-xs border border-blue-200 font-mono">
                  MBI: {beneficiary.mbi}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
                Welcome back, {beneficiary.firstName}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Your 2026 Medicare enrollment application is actively processed under the Social Security Initial &amp; Special Enrollment guidelines. Manage your coverage, upload required identity proofs, and access your digital red, white, and blue card.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="text-slate-500 font-medium">Coverage Status</p>
                <p className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="text-slate-500 font-medium">Monthly Premium</p>
                <p className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                  {application.selectedPlan.monthlyPremium === 0 ? '$0 / mo' : formatCurrency(application.selectedPlan.monthlyPremium)}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="text-slate-500 font-medium">Verified Vault Docs</p>
                <p className="text-sm font-bold font-mono text-blue-800 mt-0.5">
                  {verifiedDocCount} Files Verified
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('enrollment')}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>View / Edit Enrollment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('documents')}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Documents to Vault</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-60 lg:min-h-full">
            <img
              src={APP_IMAGES.heroConsultation}
              alt="Medicare Beneficiary Consultation"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden"></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Medicare Card & Application Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Digital Medicare Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 font-display">
                  Official Medicare ID Card
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                  Digital Active
                </span>
              </div>
              <span className="text-xs text-slate-400">Click card to flip</span>
            </div>

            <MedicareCard
              beneficiary={beneficiary}
              partAEffective={formatDate(application.effectiveDate)}
              partBEffective={formatDate(application.effectiveDate)}
              status="Enrolled"
            />

            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2 border border-slate-200">
              <Shield className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Present this card to healthcare providers, hospitals, and pharmacies along with your state photo ID.
              </span>
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">CMS 24/7 Medicare Hotline</h4>
                <p className="text-xs text-slate-500">Official toll-free beneficiary assistance</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Call <strong className="text-blue-900 font-mono">1-800-MEDICARE</strong> (1-800-633-4227) or TTY: 1-877-486-2048 anytime for live counseling or claims support.
            </p>
          </div>
        </div>

        {/* Right Column: Application Tracker & Coverage Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Application Lifecycle Tracker */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Lifecycle Tracking
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Application Status: {application.applicationNumber}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                In Review
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4">
              {application.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < application.timeline.length - 1 && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-slate-200"></div>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    item.completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border-2 border-blue-600 text-blue-700'
                  }`}>
                    {item.completed ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[11px] font-mono text-slate-500">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Enrolled Plan Overview */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Enrolled Coverage
                </span>
                <h3 className="text-base font-bold font-display text-slate-900">
                  {application.selectedPlan.name}
                </h3>
                <p className="text-xs text-slate-500">{application.selectedPlan.carrier}</p>
              </div>

              <button
                onClick={() => onNavigate('plans')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Change Plan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Plan Premium</p>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {application.selectedPlan.monthlyPremium === 0 ? '$0 / mo' : formatCurrency(application.selectedPlan.monthlyPremium)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Medical Deductible</p>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {application.selectedPlan.annualDeductible === 0 ? '$0' : formatCurrency(application.selectedPlan.annualDeductible)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Max Out-of-Pocket</p>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {application.selectedPlan.maxOutOfPocket === 0 ? 'No Cap' : formatCurrency(application.selectedPlan.maxOutOfPocket)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Part D Rx Cap</p>
                <p className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  $2,000 / yr Cap
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <div>
                Primary Care: <strong className="text-slate-800">{application.primaryCarePhysician?.name}</strong>
              </div>
              <div>
                Prescriptions: <strong className="text-slate-800">{application.prescriptions.length} Covered Medications</strong>
              </div>
            </div>
          </div>

          {/* Document Vault Quick Status */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">Document Vault &amp; Proofs</h4>
                <p className="text-xs text-slate-500">
                  {verifiedDocCount} documents securely authenticated with SHA-256 and OCR extraction.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('documents')}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-xs"
            >
              Open Vault Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

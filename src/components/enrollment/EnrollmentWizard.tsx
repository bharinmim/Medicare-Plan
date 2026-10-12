/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Check, ArrowRight, ArrowLeft, ShieldCheck, FileText, CheckCircle2, 
  HelpCircle, AlertCircle, Plus, Trash2, Printer, Download, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BeneficiaryProfile, MedicarePlan, UploadedDocument, EnrollmentApplication } from '../../types/medicare';
import { AVAILABLE_PLANS } from '../../data/mockData';
import { formatCurrency, generateApplicationId, formatDate } from '../../utils/helpers';
import { PlanComparisonModal } from '../modals/PlanComparisonModal';

interface EnrollmentWizardProps {
  beneficiary: BeneficiaryProfile;
  existingApplication?: EnrollmentApplication;
  documents: UploadedDocument[];
  onCompleteEnrollment: (application: EnrollmentApplication) => void;
  onNavigateToVault: () => void;
}

export const EnrollmentWizard: React.FC<EnrollmentWizardProps> = ({
  beneficiary,
  existingApplication,
  documents,
  onCompleteEnrollment,
  onNavigateToVault,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Form State
  const [eligibilityType, setEligibilityType] = useState<'age_65' | 'disability' | 'special_enrollment' | 'general_enrollment'>(
    existingApplication?.eligibilityType || 'age_65'
  );
  const [employerCoverageEnding, setEmployerCoverageEnding] = useState('2026-04-30');
  const [selectedPlan, setSelectedPlan] = useState<MedicarePlan>(
    existingApplication?.selectedPlan || AVAILABLE_PLANS[1]
  );
  const [includePartA, setIncludePartA] = useState(true);
  const [includePartB, setIncludePartB] = useState(true);

  // Health & Rx
  const [pcpName, setPcpName] = useState(existingApplication?.primaryCarePhysician?.name || 'Dr. Sarah Lin, MD');
  const [pcpClinic, setPcpClinic] = useState(existingApplication?.primaryCarePhysician?.clinic || 'Springfield Integrated Family Care');
  const [prescriptions, setPrescriptions] = useState<Array<{ name: string; dosage: string; frequency: string; coveredTier: number }>>(
    existingApplication?.prescriptions || [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', coveredTier: 1 },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily (Evening)', coveredTier: 1 },
    ]
  );
  const [newRxName, setNewRxName] = useState('');
  const [newRxDosage, setNewRxDosage] = useState('');

  // Attestation & Signature
  const [signatureText, setSignatureText] = useState(existingApplication?.digitalSignature?.signatureText || `${beneficiary.firstName} ${beneficiary.lastName}`);
  const [attestationAgreed, setAttestationAgreed] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'typed' | 'drawn'>('typed');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Completed Application State
  const [submittedApp, setSubmittedApp] = useState<EnrollmentApplication | null>(null);

  const steps = [
    { number: 1, title: 'Beneficiary Demographics' },
    { number: 2, title: 'Eligibility Assessment' },
    { number: 3, title: 'Coverage & Plan Selection' },
    { number: 4, title: 'Physician & Rx Formulary' },
    { number: 5, title: 'Document Verification' },
    { number: 6, title: 'Attestation & E-Sign' },
    { number: 7, title: 'Enrollment Confirmation' },
  ];

  const handleAddPrescription = () => {
    if (!newRxName) return;
    setPrescriptions([
      ...prescriptions,
      {
        name: newRxName,
        dosage: newRxDosage || 'Standard',
        frequency: 'Daily',
        coveredTier: 1,
      },
    ]);
    setNewRxName('');
    setNewRxDosage('');
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F172A';
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFinalSubmit = () => {
    if (!attestationAgreed) {
      alert('Please check the legal attestation box under 18 U.S.C. § 1001 to proceed.');
      return;
    }

    const application: EnrollmentApplication = {
      id: existingApplication?.id || `APP-${Date.now()}`,
      applicationNumber: existingApplication?.applicationNumber || generateApplicationId(),
      beneficiaryId: beneficiary.id,
      status: 'submitted',
      eligibilityType: eligibilityType,
      eligibilityNotes: `Enrolled via online portal under ${eligibilityType}. Prior coverage end date: ${employerCoverageEnding}`,
      effectiveDate: '2026-05-01',
      submittedAt: new Date().toISOString(),
      selectedPlan: selectedPlan,
      includePartA: includePartA,
      includePartB: includePartB,
      primaryCarePhysician: {
        name: pcpName,
        npi: '1942085711',
        clinic: pcpClinic,
        accepted: true,
      },
      prescriptions: prescriptions,
      documents: documents,
      digitalSignature: {
        signatureText: signatureText,
        signedAt: new Date().toISOString(),
        ipAddress: '198.51.100.42 (TLS 1.3 Certified)',
        attestationAgreed: true,
      },
      timeline: [
        {
          step: '1',
          title: 'Application Submitted',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          completed: true,
          description: 'Official digital enrollment submitted with electronic attestation.',
        },
        {
          step: '2',
          title: 'Document Vault Verification',
          date: 'In Progress',
          completed: documents.length > 0,
          description: `${documents.length} verified documents attached.`,
        },
        {
          step: '3',
          title: 'CMS Underwriting & Carrier Processing',
          date: 'Pending',
          completed: false,
          description: `Transmitted to ${selectedPlan.carrier} for membership provisioning.`,
        },
        {
          step: '4',
          title: 'Active Coverage & Card Issuance',
          date: 'Effective May 01, 2026',
          completed: false,
          description: 'Coverage confirmed. Official Medicare card and policy packet active.',
        },
      ],
    };

    setSubmittedApp(application);
    onCompleteEnrollment(application);
    setCurrentStep(7);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Medicare Form CMS-40B / Part C &amp; D
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Interactive Enrollment Application
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        {/* Stepper bar */}
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 z-0"></div>
          {steps.map((s) => (
            <div key={s.number} className="relative z-10 flex flex-col items-center">
              <button
                disabled={currentStep < s.number && !submittedApp}
                onClick={() => setCurrentStep(s.number)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === s.number
                    ? 'bg-blue-700 text-white ring-4 ring-blue-100'
                    : currentStep > s.number
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {currentStep > s.number ? <Check className="w-4 h-4" /> : s.number}
              </button>
              <span className={`text-[10px] font-medium mt-1 whitespace-nowrap ${
                currentStep === s.number ? 'text-blue-900 font-bold' : 'text-slate-500'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8">
        {/* STEP 1: DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Section 1: Beneficiary Identification &amp; Contact
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify beneficiary legal details as registered with the Social Security Administration (SSA).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={beneficiary.firstName}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={beneficiary.lastName}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="text"
                  disabled
                  value={formatDate(beneficiary.dateOfBirth)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medicare Beneficiary Identifier (MBI)</label>
                <input
                  type="text"
                  disabled
                  value={beneficiary.mbi}
                  className="w-full px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-lg text-blue-900 font-mono font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Residential Address</label>
                <input
                  type="text"
                  disabled
                  value={`${beneficiary.address.street}, ${beneficiary.address.apt || ''}, ${beneficiary.address.city}, ${beneficiary.address.state} ${beneficiary.address.zipCode}`}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Telephone</label>
                <input
                  type="text"
                  disabled
                  value={beneficiary.phone}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email for Official Notices</label>
                <input
                  type="text"
                  disabled
                  value={beneficiary.email}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Personal data verified against SSA Master Beneficiary Record. If legal address or name has changed, contact 1-800-772-1213.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: ELIGIBILITY ASSESSMENT */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Section 2: Medicare Eligibility Determination
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your qualifying pathway to avoid late enrollment penalties and establish effective dates.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'age_65',
                  title: 'Initial Enrollment Period (Turning 65)',
                  description: '7-month window: 3 months prior to 65th birthday, the birth month, and 3 months after.',
                },
                {
                  id: 'special_enrollment',
                  title: 'Special Enrollment Period (SEP) - Loss of Employer Group Health Plan',
                  description: 'Enrolling after 65 because you or your spouse had active employer group health coverage (requires Form CMS-L564).',
                },
                {
                  id: 'disability',
                  title: 'Disability Enrollment (24 Months SSDI)',
                  description: 'Receiving Social Security Disability Insurance (SSDI) benefits for at least 24 consecutive months.',
                },
                {
                  id: 'general_enrollment',
                  title: 'General Enrollment Period (GEP - Jan 1 to Mar 31)',
                  description: 'Enrolling outside IEP/SEP during the standard annual federal general open enrollment.',
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    eligibilityType === option.id
                      ? 'border-blue-700 bg-blue-50/50 ring-1 ring-blue-700'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="eligibility"
                    checked={eligibilityType === option.id}
                    onChange={() => setEligibilityType(option.id as any)}
                    className="mt-1 text-blue-700 focus:ring-blue-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{option.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {eligibilityType === 'special_enrollment' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-900">
                  Employer Group Coverage Timeline
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Date Active Employer Coverage Ended or Will End:
                    </label>
                    <input
                      type="date"
                      value={employerCoverageEnding}
                      onChange={(e) => setEmployerCoverageEnding(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Employer Health Plan Sponsor:
                    </label>
                    <input
                      type="text"
                      defaultValue="Springfield Unified Medical Center"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: COVERAGE & PLAN SELECTION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Section 3: Choose Your 2026 Medicare Plan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare Original Medicare against comprehensive Medicare Advantage and supplemental options.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Side-by-Side Comparison</span>
              </button>
            </div>

            {/* Part A and Part B Checkboxes */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={includePartA}
                  onChange={(e) => setIncludePartA(e.target.checked)}
                  className="rounded text-blue-700"
                />
                <span>Enroll in Part A (Hospital Insurance - $0/mo premium)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={includePartB}
                  onChange={(e) => setIncludePartB(e.target.checked)}
                  className="rounded text-blue-700"
                />
                <span>Enroll in Part B (Medical Outpatient - $185.00/mo)</span>
              </label>
            </div>

            {/* Available Plans Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AVAILABLE_PLANS.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    selectedPlan.id === plan.id
                      ? 'border-blue-700 bg-blue-50/40 ring-2 ring-blue-700 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {plan.carrier}
                      </span>
                      {selectedPlan.id === plan.id && (
                        <span className="text-[10px] font-bold text-white bg-blue-700 px-2 py-0.5 rounded-xs">
                          Selected
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm font-display mb-1">
                      {plan.name}
                    </h4>

                    <div className="my-3">
                      <span className="text-2xl font-bold font-mono text-slate-900">
                        {plan.monthlyPremium === 0 ? '$0' : formatCurrency(plan.monthlyPremium)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium"> / month</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span>Deductible:</span>
                        <span className="font-mono font-medium">{plan.annualDeductible === 0 ? '$0' : formatCurrency(plan.annualDeductible)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Out-of-Pocket:</span>
                        <span className="font-mono font-medium">{plan.maxOutOfPocket === 0 ? 'No Limit' : formatCurrency(plan.maxOutOfPocket)}</span>
                      </div>
                    </div>

                    <ul className="text-[11px] text-slate-600 space-y-1 border-t border-slate-200 pt-3">
                      {plan.features.slice(0, 3).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                    }}
                    className={`mt-4 w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                      selectedPlan.id === plan.id
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {selectedPlan.id === plan.id ? 'Chosen Coverage' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PHYSICIAN & RX */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Section 4: Primary Care Doctor &amp; Prescription Medications
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify provider network acceptance and check covered prescription medication tiers under the new 2026 $2,000 Medicare out-of-pocket cap.
              </p>
            </div>

            {/* Doctor Network Search */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Preferred Primary Care Provider (PCP)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Physician Full Name</label>
                  <input
                    type="text"
                    value={pcpName}
                    onChange={(e) => setPcpName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Clinic / Hospital Network</label>
                  <input
                    type="text"
                    value={pcpClinic}
                    onChange={(e) => setPcpClinic(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In-Network Verified: Dr. Sarah Lin accepts {selectedPlan.carrier} for 2026.
              </p>
            </div>

            {/* Current Medications List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Current Prescription Drugs (Rx Formulary Check)
                </h4>
                <span className="text-xs text-slate-500">
                  {prescriptions.length} medications listed
                </span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {prescriptions.map((rx, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                        Rx
                      </span>
                      <div>
                        <span className="font-bold text-slate-900">{rx.name}</span>
                        <span className="text-slate-500 ml-2">({rx.dosage} · {rx.frequency})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                        Tier {rx.coveredTier} Generic ($0 Copay)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrescription(idx)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Rx Form */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Medication name (e.g. Omeprazole)"
                  value={newRxName}
                  onChange={(e) => setNewRxName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 20mg)"
                  value={newRxDosage}
                  onChange={(e) => setNewRxDosage(e.target.value)}
                  className="w-32 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddPrescription}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded-md text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Rx
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENT VERIFICATION */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Section 5: Verify Enrollment Documents
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Required documents from your Secure Document Vault linked to this enrollment submission.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToVault}
                className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manage Document Vault</span>
              </button>
            </div>

            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-amber-900">No documents found in vault</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Please visit the Document Vault to upload your Government ID and CMS-L564 form.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToVault}
                    className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                  >
                    Go to Document Vault
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.fileName}</p>
                          <p className="text-[11px] text-slate-500">{doc.categoryLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                          {doc.ocrExtractedData ? `${doc.ocrExtractedData.confidence}% OCR Match` : 'Verified'}
                        </span>
                        <span className="text-slate-400 font-mono hidden sm:inline">
                          {doc.encryptionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: LEGAL ATTESTATION & E-SIGN */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Section 6: Legal Attestation &amp; Digital Signature
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Certification of truthfulness under 18 U.S.C. § 1001 (Federal Penalties for False Statements).
              </p>
            </div>

            {/* Legal Attestation Text Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
              <p className="font-bold text-slate-900">
                Official Certification &amp; Release Authorization:
              </p>
              <p>
                I understand that my signature authorizes the Centers for Medicare &amp; Medicaid Services (CMS) and its designated carrier, <strong>{selectedPlan.carrier}</strong>, to process my Medicare enrollment under the Social Security Act.
              </p>
              <p>
                I confirm that the information provided on this application is true, correct, and complete to the best of my knowledge. Anyone who misrepresents, falsifies, or conceals facts regarding eligibility or coverage may be subject to fines, imprisonment, or both under federal law (18 U.S.C. § 1001).
              </p>
              <p>
                I authorize the Social Security Administration to deduct my applicable Medicare Part B monthly premium ($185.00) from my monthly benefit payment if applicable.
              </p>
            </div>

            {/* Checkbox agreement */}
            <label className="flex items-start gap-3 p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 cursor-pointer">
              <input
                type="checkbox"
                checked={attestationAgreed}
                onChange={(e) => setAttestationAgreed(e.target.checked)}
                className="mt-0.5 rounded text-blue-700 focus:ring-blue-600"
              />
              <span className="text-xs font-semibold text-slate-900">
                I attest under penalty of perjury that I am the beneficiary or an authorized legal representative, and all submitted documentation is genuine.
              </span>
            </label>

            {/* Digital Signature Mode Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Digital E-Signature
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-md text-xs">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('typed')}
                    className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                      signatureMode === 'typed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Type Legal Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureMode('drawn')}
                    className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                      signatureMode === 'drawn' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Draw Signature
                  </button>
                </div>
              </div>

              {signatureMode === 'typed' ? (
                <div>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type legal full name"
                    className="w-full px-4 py-3 text-lg font-serif italic border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Typing your legal name constitutes an electronic signature with the same validity as handwritten pen and ink.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="border border-slate-300 rounded-lg bg-white overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-28 cursor-crosshair touch-none"
                    />
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="absolute right-2 bottom-2 text-[10px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 px-2 py-1 rounded-xs"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Use your mouse or touchscreen to draw your official signature.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2">
                <span>Timestamp: {new Date().toLocaleString()}</span>
                <span>Audit IP: 198.51.100.42 (TLS 1.3 Certified)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: CONFIRMATION & OFFICIAL RECEIPT */}
        {currentStep === 7 && submittedApp && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                APPLICATION SUBMITTED SUCCESSFULLY
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-900 mt-2">
                Medicare Enrollment Application Acknowledged
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your application has been received and timestamped by the CMS Federal Health Information Network.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-left max-w-lg mx-auto space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Application Tracking Number</p>
                  <p className="text-base font-mono font-bold text-blue-900">{submittedApp.applicationNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Effective Coverage Date</p>
                  <p className="text-sm font-mono font-semibold text-slate-900">{submittedApp.effectiveDate}</p>
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-semibold text-slate-900">{beneficiary.firstName} {beneficiary.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Medicare Identifier (MBI):</span>
                  <span className="font-mono font-semibold text-slate-900">{beneficiary.mbi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrolled Plan:</span>
                  <span className="font-semibold text-slate-900">{submittedApp.selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Plan Premium:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {submittedApp.selectedPlan.monthlyPremium === 0 ? '$0 / month' : formatCurrency(submittedApp.selectedPlan.monthlyPremium)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Care Physician:</span>
                  <span className="font-semibold text-slate-900">{submittedApp.primaryCarePhysician?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Documents Attached:</span>
                  <span className="font-semibold text-emerald-700">{submittedApp.documents.length} Encrypted Records</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Receipt
                </button>

                <span className="text-[10px] text-slate-400 font-mono">
                  AUTHENTICATED RECORD
                </span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 && currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous Section
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Next Section</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 6 && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit &amp; Certify Enrollment</span>
            </button>
          )}

          {currentStep === 7 && (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              Review Application Details
            </button>
          )}
        </div>
      </div>

      {/* Plan Comparison Modal */}
      <PlanComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectPlan={(plan) => setSelectedPlan(plan)}
        selectedPlanId={selectedPlan.id}
      />
    </div>
  );
};

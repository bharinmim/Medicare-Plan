/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BeneficiaryProfile {
  id: string;
  mbi: string; // Medicare Beneficiary Identifier: e.g. 1EG4-TE5-MK72
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssnLast4: string;
  email: string;
  phone: string;
  address: {
    street: string;
    apt?: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  };
  preferredLanguage: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  documentCategory: 
    | 'identity' 
    | 'citizenship_age' 
    | 'proof_prior_coverage' 
    | 'income_lis' 
    | 'medical_records' 
    | 'cms_form_40b';
  categoryLabel: string;
  status: 'verified' | 'pending_review' | 'needs_reupload' | 'analyzing';
  uploadDate: string;
  encryptionStatus: string;
  sha256Checksum: string;
  previewUrl?: string;
  notes?: string;
  ocrExtractedData?: {
    documentTypeDetected: string;
    confidence: number;
    extractedFields: Record<string, string>;
  };
}

export interface MedicarePlan {
  id: string;
  category: 'original' | 'advantage' | 'part_d' | 'medigap';
  name: string;
  carrier: string;
  planCode: string;
  monthlyPremium: number;
  annualDeductible: number;
  maxOutOfPocket: number;
  rating: number; // 1-5 stars
  features: string[];
  rxCoverage: boolean;
  rxDeductible?: number;
  dentalVisionHearing: boolean;
  idealFor: string;
}

export interface EnrollmentApplication {
  id: string;
  applicationNumber: string; // e.g. MED-2026-89410
  beneficiaryId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'documents_verified' | 'approved' | 'active';
  eligibilityType: 'age_65' | 'disability' | 'special_enrollment' | 'general_enrollment';
  eligibilityNotes: string;
  effectiveDate: string;
  submittedAt?: string;
  selectedPlan: MedicarePlan;
  secondaryPlans?: MedicarePlan[];
  includePartA: boolean;
  includePartB: boolean;
  primaryCarePhysician?: {
    name: string;
    npi: string;
    clinic: string;
    accepted: boolean;
  };
  prescriptions: Array<{
    name: string;
    dosage: string;
    frequency: string;
    coveredTier: number;
  }>;
  documents: UploadedDocument[];
  digitalSignature?: {
    signatureText: string;
    signatureDataUrl?: string;
    signedAt: string;
    ipAddress: string;
    attestationAgreed: boolean;
  };
  timeline: Array<{
    step: string;
    title: string;
    date: string;
    completed: boolean;
    description: string;
  }>;
}

export interface UserSession {
  isAuthenticated: boolean;
  user: BeneficiaryProfile | null;
  role: 'beneficiary' | 'representative' | 'officer';
  sessionToken: string;
  mfaVerified: boolean;
  sessionStartedAt: number;
  lastActiveAt: number;
}

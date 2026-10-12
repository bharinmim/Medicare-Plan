/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BeneficiaryDashboard } from './components/dashboard/BeneficiaryDashboard';
import { EnrollmentWizard } from './components/enrollment/EnrollmentWizard';
import { DocumentVault } from './components/documents/DocumentVault';
import { PlansExplorer } from './components/plans/PlansExplorer';
import { OfficerReviewPortal } from './components/officer/OfficerReviewPortal';
import { AuthModal } from './components/auth/AuthModal';
import { 
  INITIAL_BENEFICIARY, 
  INITIAL_DOCUMENTS, 
  INITIAL_APPLICATION, 
  AVAILABLE_PLANS 
} from './data/mockData';
import { 
  BeneficiaryProfile, 
  UploadedDocument, 
  EnrollmentApplication, 
  UserSession, 
  MedicarePlan 
} from './types/medicare';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Authentication & Session State
  const [session, setSession] = useState<UserSession>({
    isAuthenticated: true,
    user: INITIAL_BENEFICIARY,
    role: 'beneficiary',
    sessionToken: 'FIPS-256-AUTH-TOKEN-8941',
    mfaVerified: true,
    sessionStartedAt: Date.now(),
    lastActiveAt: Date.now(),
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Application & Document Repository State
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [application, setApplication] = useState<EnrollmentApplication>(INITIAL_APPLICATION);

  // Handlers
  const handleLoginSuccess = (user: BeneficiaryProfile, role: 'beneficiary' | 'officer') => {
    setSession({
      isAuthenticated: true,
      user: user,
      role: role,
      sessionToken: `FIPS-256-AUTH-TOKEN-${Math.floor(1000 + Math.random() * 9000)}`,
      mfaVerified: true,
      sessionStartedAt: Date.now(),
      lastActiveAt: Date.now(),
    });
    if (role === 'officer') {
      setCurrentTab('officer');
    } else {
      setCurrentTab('overview');
    }
  };

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      user: null,
      role: 'beneficiary',
      sessionToken: '',
      mfaVerified: false,
      sessionStartedAt: 0,
      lastActiveAt: 0,
    });
  };

  const handleSwitchRole = (newRole: 'beneficiary' | 'officer') => {
    setSession((prev) => ({
      ...prev,
      role: newRole,
    }));
    if (newRole === 'officer') {
      setCurrentTab('officer');
    } else {
      setCurrentTab('overview');
    }
  };

  const handleUploadDocument = (newDoc: UploadedDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    // Also attach to application documents
    setApplication((prev) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
    }));
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setApplication((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  };

  const handleUpdateDocumentStatus = (docId: string, status: 'verified' | 'needs_reupload') => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status } : d))
    );
    setApplication((prev) => ({
      ...prev,
      documents: prev.documents.map((d) => (d.id === docId ? { ...d, status } : d)),
    }));
  };

  const handleUpdateApplicationStatus = (status: EnrollmentApplication['status']) => {
    setApplication((prev) => ({
      ...prev,
      status: status,
      timeline: prev.timeline.map((item, idx) => {
        if (status === 'approved' && idx === prev.timeline.length - 1) {
          return { ...item, completed: true, date: 'Approved Today' };
        }
        return item;
      }),
    }));
  };

  const handleSelectPlanForEnrollment = (plan: MedicarePlan) => {
    setApplication((prev) => ({
      ...prev,
      selectedPlan: plan,
    }));
    setCurrentTab('enrollment');
  };

  const handleCompleteEnrollment = (newApp: EnrollmentApplication) => {
    setApplication(newApp);
  };

  const currentUser = session.user || INITIAL_BENEFICIARY;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar following 3-Zone Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {currentTab === 'overview' && (
          <BeneficiaryDashboard
            beneficiary={currentUser}
            application={application}
            documents={documents}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'enrollment' && (
          <EnrollmentWizard
            beneficiary={currentUser}
            existingApplication={application}
            documents={documents}
            onCompleteEnrollment={handleCompleteEnrollment}
            onNavigateToVault={() => setCurrentTab('documents')}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentVault
            documents={documents}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            isOfficer={session.role === 'officer'}
          />
        )}

        {currentTab === 'plans' && (
          <PlansExplorer
            onSelectPlanForEnrollment={handleSelectPlanForEnrollment}
            selectedPlanId={application.selectedPlan.id}
          />
        )}

        {currentTab === 'officer' && (
          <OfficerReviewPortal
            application={application}
            documents={documents}
            onUpdateAppStatus={handleUpdateApplicationStatus}
            onUpdateDocStatus={handleUpdateDocumentStatus}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

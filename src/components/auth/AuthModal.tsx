/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { BeneficiaryProfile } from '../../types/medicare';
import { INITIAL_BENEFICIARY } from '../../data/mockData';
import { generateMBI } from '../../utils/helpers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: BeneficiaryProfile, role: 'beneficiary' | 'officer') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  
  // Credentials state
  const [identifier, setIdentifier] = useState('1EG4-TE5-MK72');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regDob, setRegDob] = useState('1961-05-12');
  const [regSsnLast4, setRegSsnLast4] = useState('');
  const [regZip, setRegZip] = useState('62704');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  if (!isOpen) return null;

  const handleStartSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('mfa');
      setMfaCode('482910'); // Pre-fill sample security token for seamless demo testing
    }, 400);
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.replace(/\D/g, '').length < 6) {
      setMfaError('Please enter a valid 6-digit authentication code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(INITIAL_BENEFICIARY, 'beneficiary');
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = (role: 'beneficiary' | 'officer') => {
    if (role === 'beneficiary') {
      onLoginSuccess(INITIAL_BENEFICIARY, 'beneficiary');
    } else {
      onLoginSuccess(INITIAL_BENEFICIARY, 'officer');
    }
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail) {
      alert('Please fill in required legal name and contact fields.');
      return;
    }

    const newProfile: BeneficiaryProfile = {
      id: `BEN-${Math.floor(100000 + Math.random() * 900000)}`,
      mbi: generateMBI(),
      firstName: regFirstName,
      lastName: regLastName,
      dateOfBirth: regDob,
      ssnLast4: regSsnLast4 || '7721',
      email: regEmail,
      phone: regPhone || '(555) 234-5678',
      address: {
        street: '100 State Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: regZip,
        county: 'Sangamon County',
      },
      preferredLanguage: 'English',
      emergencyContact: {
        name: 'Family Member',
        relationship: 'Contact',
        phone: '(555) 000-0000',
      },
    };

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(newProfile, 'beneficiary');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Medicare Identity Access</h3>
              <p className="text-[11px] text-slate-400">Federal Health Information Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            onClick={() => {
              setAuthMode('signin');
              setStep('credentials');
            }}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-colors ${
              authMode === 'signin'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Beneficiary Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setStep('credentials');
            }}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 transition-colors ${
              authMode === 'register'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        <div className="p-6">
          {authMode === 'signin' ? (
            step === 'credentials' ? (
              <form onSubmit={handleStartSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medicare Number (MBI) or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 1EG4-TE5-MK72 or email"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your 11-character identifier found on your red, white, and blue card.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <a href="#reset" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email.'); }} className="text-[11px] text-blue-700 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Continue to Multi-Factor Auth</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Demo Login Helpers */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Evaluation Quick-Access
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('beneficiary')}
                      className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-medium text-left transition-colors border border-slate-200 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold truncate">Demo Beneficiary</div>
                        <div className="text-[10px] text-slate-500">Eleanor Vance</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('officer')}
                      className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-medium text-left transition-colors border border-slate-200 flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold truncate">Demo CMS Officer</div>
                        <div className="text-[10px] text-slate-500">Officer Jenkins</div>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyMfa} className="space-y-4">
                <div className="text-center py-2">
                  <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-200">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the 6-digit security code sent via SMS to <span className="font-semibold text-slate-700">(•••) •••-9410</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => {
                      setMfaCode(e.target.value);
                      setMfaError('');
                    }}
                    placeholder="482910"
                    className="w-full text-center tracking-widest text-xl font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden font-bold"
                  />
                  {mfaError && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {mfaError}
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-700 mt-1.5 bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-200">
                    Test OTP pre-filled: enter <strong>482910</strong> or click below.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="py-2.5 px-3 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSubmitting ? 'Authenticating Token...' : 'Verify & Enter Portal'}
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="e.g. Thomas"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="e.g. Mitchell"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SSN (Last 4)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={regSsnLast4}
                    onChange={(e) => setRegSsnLast4(e.target.value)}
                    placeholder="4 digits"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={regZip}
                    onChange={(e) => setRegZip(e.target.value)}
                    placeholder="62704"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div className="p-2.5 bg-blue-50 rounded-md border border-blue-200 text-[11px] text-blue-900 leading-normal">
                An official Medicare Beneficiary Identifier (MBI) will be cryptographically allocated upon submission.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors mt-2 shadow-xs"
              >
                {isSubmitting ? 'Provisioning Beneficiary Records...' : 'Complete Registration & Sign In'}
              </button>
            </form>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>FIPS 140-2 Level 3 Cryptographic Security</span>
          </div>
          <span className="font-mono text-[10px]">AUTH-v2.9</span>
        </div>
      </div>
    </div>
  );
};

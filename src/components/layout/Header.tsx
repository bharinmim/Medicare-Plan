/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, LogOut, ChevronDown, CheckCircle2, FileText, UserCheck } from 'lucide-react';
import { UserSession } from '../../types/medicare';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  session: UserSession;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'beneficiary' | 'officer') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  session,
  onOpenAuth,
  onLogout,
  onSwitchRole,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [bannerExpanded, setBannerExpanded] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15-minute auto-timeout

  useEffect(() => {
    if (!session.isAuthenticated) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.isAuthenticated]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government Trust Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-2.5 bg-red-600 relative overflow-hidden rounded-xs border border-white/20">
              <span className="absolute inset-0 bg-blue-800 w-2 h-1.5"></span>
            </span>
            <span className="font-medium text-slate-200">An official website of the United States government</span>
            <button
              onClick={() => setBannerExpanded(!bannerExpanded)}
              className="text-slate-400 hover:text-white underline ml-1 focus:outline-hidden"
            >
              Here's how you know
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            {session.isAuthenticated && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Session secure: <span className="font-mono tabular-nums text-emerald-400">{formatTimer(secondsRemaining)}</span></span>
              </div>
            )}
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS 1.3 / HIPAA Level 4</span>
            </div>
          </div>
        </div>

        {bannerExpanded && (
          <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pb-1">
            <div className="flex items-start gap-2">
              <div className="p-1 bg-slate-800 rounded-sm mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Official government websites use .gov</p>
                <p className="text-slate-400">A .gov website belongs to an official government organization in the United States.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 bg-slate-800 rounded-sm mt-0.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Secure .gov websites use HTTPS</p>
                <p className="text-slate-400">A lock icon or https:// means you've safely connected to the official Medicare server.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Top Bar: Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onSelectTab('overview')}
          className="text-left group flex items-center gap-3 shrink-0 focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            M
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
              Medicare.gov
            </div>
            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Enrollment &amp; Document Vault Client
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'overview'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Beneficiary Portal
          </button>
          <button
            onClick={() => onSelectTab('enrollment')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'enrollment'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Enrollment Wizard
          </button>
          <button
            onClick={() => onSelectTab('documents')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'documents'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Document Vault
          </button>
          <button
            onClick={() => onSelectTab('plans')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'plans'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Medicare Plans &amp; Rates
          </button>
          <button
            onClick={() => onSelectTab('officer')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentTab === 'officer'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Officer Audit Portal
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {session.isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  {session.role === 'officer' ? 'O' : session.user?.firstName.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {session.role === 'officer' ? 'Officer Jenkins' : `${session.user?.firstName} ${session.user?.lastName}`}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {session.role === 'officer' ? 'CMS Case Worker' : `MBI: ${session.user?.mbi}`}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Authenticated as</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {session.role === 'officer' ? 'Sarah Jenkins (CMS Case Officer)' : `${session.user?.firstName} ${session.user?.lastName}`}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {session.role === 'officer' ? 'ID: CMS-AUTH-771' : `MBI: ${session.user?.mbi}`}
                    </p>
                  </div>

                  <div className="p-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1 px-2">Role Switcher</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          onSwitchRole('beneficiary');
                          setProfileDropdownOpen(false);
                        }}
                        className={`flex-1 text-xs py-1.5 px-2 rounded-md font-medium transition-colors ${
                          session.role === 'beneficiary'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        Beneficiary
                      </button>
                      <button
                        onClick={() => {
                          onSwitchRole('officer');
                          setProfileDropdownOpen(false);
                        }}
                        className={`flex-1 text-xs py-1.5 px-2 rounded-md font-medium transition-colors ${
                          session.role === 'officer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        CMS Officer
                      </button>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('overview');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Beneficiary Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('documents');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Document Vault &amp; Proofs
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('officer');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Officer Review Console
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out Securely
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              Secure Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

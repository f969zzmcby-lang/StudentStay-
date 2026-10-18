import React from 'react';
import { ShieldCheck, MapPin, Lock, Unlock, Rocket, Plus, ExternalLink } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  isOperatorMode: boolean;
  activeTab: 'browse' | 'map' | 'launch' | 'operator' | 'landlord_gate';
  setActiveTab: (tab: 'browse' | 'map' | 'launch' | 'operator' | 'landlord_gate') => void;
  onOpenOperatorLogin: () => void;
  onExitOperatorMode: () => void;
  onOpenAddModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenWelcomeTour?: () => void;
  availableCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isOperatorMode,
  activeTab,
  setActiveTab,
  onOpenOperatorLogin,
  onExitOperatorMode,
  onOpenAddModal,
  onOpenSafetyModal,
  onOpenWelcomeTour,
  availableCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-banner when in Operator Mode */}
      {isOperatorMode && (
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 font-semibold flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operator Mode Active · Platform Owner Console</span>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <span className="text-amber-300 font-normal">Managing Vaal Listings & Subscriptions</span>
          </div>
          <button
            onClick={onExitOperatorMode}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
          >
            Switch to Public Student App →
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isOperatorMode) {
                  setActiveTab('operator');
                } else {
                  setActiveTab('browse');
                }
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <BrandLogo size="md" showBadge={true} />
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {!isOperatorMode ? (
              /* STUDENT NAVIGATION: Clean, zero landlord clutter */
              <>
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'browse' ? 'text-amber-600 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
                  }`}
                >
                  Find Rooms
                </button>

                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'map' ? 'text-amber-600 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
                  }`}
                >
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Campus Map
                </button>

                {onOpenWelcomeTour && (
                  <button
                    onClick={onOpenWelcomeTour}
                    className="flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-amber-800 font-medium"
                    title="Experience the student entrance into accommodation"
                  >
                    <span>🏠 Student Entrance Tour</span>
                  </button>
                )}

                <button
                  onClick={onOpenSafetyModal}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-emerald-700"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Anti-Scam Guide
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('rooms-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else setActiveTab('browse');
                  }}
                  className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-500 text-xs"
                >
                  Available Beds ({availableCount})
                </button>
              </>
            ) : (
              /* OPERATOR NAVIGATION */
              <>
                <button
                  onClick={() => setActiveTab('operator')}
                  className={`font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'operator' ? 'text-amber-600 border-b-2 border-amber-500 pb-0.5' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Landlord Subscriptions & Billing
                </button>

                <button
                  onClick={() => setActiveTab('browse')}
                  className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'browse' ? 'text-amber-600 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
                  }`}
                >
                  Preview Student View
                </button>

                <button
                  onClick={() => setActiveTab('launch')}
                  className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === 'launch' ? 'text-amber-600 font-semibold border-b-2 border-amber-500 pb-0.5' : ''
                  }`}
                >
                  <Rocket className="w-4 h-4 text-slate-400" />
                  30-Day Plan
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {isOperatorMode ? (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload Listing for Landlord</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('rooms-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Vaal Rooms
                </button>

                {/* Discreet Operator / Admin login toggle */}
                <button
                  onClick={onOpenOperatorLogin}
                  title="Platform Operator Console (Owner Access)"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap ${
            activeTab === 'browse' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Rooms ({availableCount})
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap ${
            activeTab === 'map' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Campus Map
        </button>
        <button
          onClick={onOpenSafetyModal}
          className="px-3 py-1.5 rounded font-medium text-emerald-700 whitespace-nowrap"
        >
          Anti-Scam
        </button>
        {isOperatorMode ? (
          <button
            onClick={() => setActiveTab('operator')}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap ${
              activeTab === 'operator' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600'
            }`}
          >
            Operator
          </button>
        ) : (
          <button
            onClick={onOpenOperatorLogin}
            className="px-2.5 py-1.5 rounded font-medium text-slate-400 hover:text-slate-700 whitespace-nowrap"
          >
            Owner
          </button>
        )}
      </div>
    </header>
  );
};

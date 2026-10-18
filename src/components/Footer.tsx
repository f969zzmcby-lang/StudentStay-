import React from 'react';
import { ShieldCheck, Lock, KeyRound } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenSafetyModal: () => void;
  onSelectTab: (tab: 'browse' | 'map' | 'launch' | 'operator' | 'landlord_gate') => void;
  onOpenOperatorLogin: () => void;
  onOpenLandlordLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSafetyModal,
  onSelectTab,
  onOpenOperatorLogin,
  onOpenLandlordLogin,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <BrandLogo size="md" variant="dark" showBadge={true} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Student accommodation platform for South African tertiary institutions, launching around the Vaal Triangle (VUT, NWU, Sedibeng TVET).
            </p>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero upfront student viewing fees</span>
            </div>
          </div>

          {/* Vaal Campuses */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Supported Campuses
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Vaal University of Technology (VUT)</li>
              <li>North-West University (NWU Vaal)</li>
              <li>Sedibeng TVET College (Vanderbijlpark)</li>
              <li>Sedibeng TVET College (Vereeniging)</li>
            </ul>
          </div>

          {/* Suburbs Covered */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Vaal Suburbs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>CW1, CW2 & CW3 · Vanderbijlpark</li>
              <li>SE1 & SE2 · River Sector</li>
              <li>Bedworth Park Student Enclave</li>
              <li>Vereeniging Central & Taxi Ranks</li>
              <li>Sebokeng Zone 10</li>
            </ul>
          </div>

          {/* Student Protection & Platform */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Student Safety & Trust
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenSafetyModal}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Anti-Scam & Safety Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('launch')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  30-Day Launch Roadmap
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800 text-[11px]">
                <button
                  onClick={onOpenLandlordLogin}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3 h-3 text-amber-500" />
                  <span>Landlord Login (Code Access)</span>
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                POPIA Act 4 of 2013 compliant. Personal information is encrypted.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} StudentStay South Africa. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Built for students around the Vaal Triangle</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenOperatorLogin}
              className="text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Access Platform Operator Management"
            >
              <Lock className="w-3 h-3" />
              <span>Operator Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

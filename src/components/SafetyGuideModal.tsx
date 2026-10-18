import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle, Phone, Lock, FileText, Sun, Droplets } from 'lucide-react';

interface SafetyGuideModalProps {
  onClose: () => void;
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Vaal Student Accommodation Safety & Anti-Scam Guide
              </h3>
              <p className="text-xs text-slate-500">
                Essential advice for students moving to Vanderbijlpark and Vereeniging.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5 text-xs">
          {/* Golden Rule Warning */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>The Golden Rule: Never Pay Deposit Funds Before Viewing</span>
            </div>
            <p className="text-rose-800 leading-relaxed">
              Never send eWallet, Instant EFT, or CashSend to anyone claiming they have "too many students interested and need a deposit to hold the keys". Always view the room in person first, accompanied by a friend or relative.
            </p>
          </div>

          {/* 5 Safety Pillars */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm">
              How StudentStay Protects You
            </h4>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>1. Physical Verification of Landlords</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Landlords displaying the green "Verified" shield have had their South African ID, municipal utility bill, or title deed checked by our team.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>2. Load Shedding & Water Supply Checks</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                The Vaal Triangle experiences municipal maintenance outages. Always check if the property has a solar inverter for Wi-Fi/study lights and a JoJo backup water tank with an electric pump.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>3. Written Lease Agreement Required</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Never rely on verbal agreements. Ensure your written lease clearly states: monthly rent, deposit refund terms (within 14 days of move-out), and whether Wi-Fi and water/electricity are included.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>4. Safe Walking Routes to Campus</span>
              </div>
              <p className="text-slate-600 pl-6 leading-relaxed">
                Stick to well-lit student walking avenues when travelling to VUT Main Gate or NWU Vaal. Accommodations in CW1, CW2, SE1, and Bedworth Park usually have safe walking cohorts during semester times.
              </p>
            </div>
          </div>

          {/* Emergency Helplines in the Vaal */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-bold text-slate-900 text-sm mb-2.5">
              Emergency Contacts in the Vaal Triangle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">VUT Campus Protection</div>
                  <div className="text-slate-500">24/7 Security Hotline</div>
                </div>
                <span className="font-mono font-bold text-slate-900">016 950 9999</span>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">NWU Vaal Campus Protection</div>
                  <div className="text-slate-500">24/7 River Campus Control</div>
                </div>
                <span className="font-mono font-bold text-slate-900">016 910 3339</span>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">SAPS Vanderbijlpark</div>
                  <div className="text-slate-500">Police Station CW Area</div>
                </div>
                <span className="font-mono font-bold text-slate-900">016 910 9000</span>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Sedibeng Emergency Services</div>
                  <div className="text-slate-500">Ambulance & Fire</div>
                </div>
                <span className="font-mono font-bold text-slate-900">10177 / 112</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            I Understand, Keep Me Safe
          </button>
        </div>
      </div>
    </div>
  );
};

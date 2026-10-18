import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface OperatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OperatorLoginModal: React.FC<OperatorLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master operator PIN is 2026 or any entry during demo
    if (pin === '2026' || pin === '1234' || pin.trim().length >= 4) {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Operator Console Login</h3>
              <p className="text-[11px] text-slate-500">StudentStay Vaal Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 text-xs space-y-4">
          <p className="text-slate-600 leading-relaxed">
            This administrative area is restricted to the StudentStay owner. Here you can upload listings for landlords, manage subscriptions, and grant portal access.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Master Operator PIN</span>
              <span className="text-[10px] text-amber-700 font-mono">Demo PIN: 2026</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 tracking-widest font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {error && (
              <p className="text-rose-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Incorrect PIN. Please enter 2026 or 1234.
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Authenticate as Operator</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPin('2026');
                onSuccess();
                onClose();
              }}
              className="w-full py-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-medium"
            >
              1-Click Operator Access (Quick Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

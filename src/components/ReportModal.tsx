import React, { useState } from 'react';
import { Property, Room, ReportItem } from '../types';
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  property: Property;
  room?: Room | null;
  onClose: () => void;
  onSubmitReport: (report: Omit<ReportItem, 'id' | 'date' | 'status'>) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  property,
  room,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<ReportItem['reason']>('Incorrect Price');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      propertyId: property.id,
      propertyName: property.name,
      reason,
      details,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Report Listing: {property.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Report Submitted for Moderation
              </h4>
              <p className="text-slate-500 max-w-xs mx-auto">
                Thank you for protecting fellow Vaal students. Our team will contact the landlord and inspect this listing within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Help us keep StudentStay safe and accurate. Please select the issue you experienced with <strong>{property.name}</strong> {room ? `(${room.roomNumber})` : ''}.
              </p>

              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Reason for Report
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Incorrect Price">Advertised Price Differs from Landlord Quote</option>
                  <option value="Room Already Taken">Room is Already Fully Taken / Occupied</option>
                  <option value="Suspicious / Potential Scam">Suspicious Behavior / Demands Upfront Deposit Before Viewing</option>
                  <option value="Unresponsive Landlord">Landlord Does Not Answer Calls or WhatsApp</option>
                  <option value="Condition Differs from Photos">Physical Room Condition Very Different from Photos</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please describe what happened (e.g. Landlord stated rent is actually R3,200 instead of R2,600, or room was already leased last month)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Submit Flag for Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Property, Room, Enquiry } from '../types';
import {
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Users,
  Calendar,
  AlertCircle,
  Eye,
  Trash2,
  Phone,
  RefreshCw,
  Home,
  FileCheck,
} from 'lucide-react';

interface LandlordPortalProps {
  properties: Property[];
  rooms: Room[];
  enquiries: Enquiry[];
  onAddProperty: (property: Property, rooms: Room[]) => void;
  onUpdateRoomStatus: (roomId: string, newStatus: 'available' | 'taken' | 'reserved') => void;
  onRefreshRoomFreshness: (roomId: string) => void;
  onUpdateEnquiryStatus: (enquiryId: string, status: Enquiry['status']) => void;
  onOpenAddModal: () => void;
}

export const LandlordPortal: React.FC<LandlordPortalProps> = ({
  properties,
  rooms,
  enquiries,
  onAddProperty,
  onUpdateRoomStatus,
  onRefreshRoomFreshness,
  onUpdateEnquiryStatus,
  onOpenAddModal,
}) => {
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'rooms' | 'enquiries' | 'verification'>('rooms');
  const [justRefreshedId, setJustRefreshedId] = useState<string | null>(null);

  // Filtered rooms
  const displayRooms = selectedPropertyFilter === 'all'
    ? rooms
    : rooms.filter((r) => r.propertyId === selectedPropertyFilter);

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const takenCount = rooms.filter((r) => r.status === 'taken').length;
  const totalEnquiriesCount = enquiries.length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  const handleQuickRefresh = (roomId: string) => {
    onRefreshRoomFreshness(roomId);
    setJustRefreshedId(roomId);
    setTimeout(() => setJustRefreshedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <span>Landlord Management Dashboard</span>
              <span aria-hidden="true">·</span>
              <span>Vaal Student Rentals</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              My Student Properties & Room Availability
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage your communes, confirm weekly room availability to stay top of search, and reply to student viewing requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Listing</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="text-xs text-slate-500 font-medium">Total Properties</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
              {properties.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across Vanderbijlpark & Vereeniging</div>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/60">
            <div className="text-xs text-emerald-800 font-medium">Available Rooms</div>
            <div className="text-2xl font-bold text-emerald-950 mt-1 tabular-nums font-mono">
              {availableCount}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Ready for immediate student occupancy</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="text-xs text-slate-500 font-medium">Occupied Rooms</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
              {takenCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active lease agreements</div>
          </div>

          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60">
            <div className="text-xs text-amber-800 font-medium">Student Inquiries</div>
            <div className="text-2xl font-bold text-amber-950 mt-1 tabular-nums font-mono">
              {pendingEnquiriesCount} New / {totalEnquiriesCount} Total
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">Awaiting viewing confirmations</div>
          </div>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
            activeTab === 'rooms'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Room Inventory ({rooms.length})
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'enquiries'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Student Inquiries</span>
          {pendingEnquiriesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
              {pendingEnquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'verification'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Landlord Verification</span>
        </button>
      </div>

      {/* Tab 1: Room Inventory Table & Freshness Actions */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Filter by Property:</span>
              <select
                value={selectedPropertyFilter}
                onChange={(e) => setSelectedPropertyFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">All Properties ({properties.length})</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.suburb})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Click <strong>"Confirm Live"</strong> to update search rank and prove the room is genuinely vacant.</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Room / Unit</th>
                  <th className="px-5 py-3">Property & Suburb</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Monthly Rent</th>
                  <th className="px-5 py-3">Availability Status</th>
                  <th className="px-5 py-3">Last Verified</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayRooms.map((rm) => {
                  const prop = properties.find((p) => p.id === rm.propertyId);
                  const isRefreshed = justRefreshedId === rm.id;

                  return (
                    <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {rm.roomNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="font-medium text-slate-800">{prop?.name}</div>
                        <div className="text-[11px] text-slate-400">{prop?.suburb} · {prop?.primaryCampus}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium whitespace-nowrap">
                        {rm.type}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        R {rm.monthlyRentZAR.toLocaleString('en-ZA')}
                        <span className="text-[10px] font-normal text-slate-400 ml-1">/mo</span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <select
                          value={rm.status}
                          onChange={(e) => onUpdateRoomStatus(rm.id, e.target.value as any)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border focus:outline-none cursor-pointer ${
                            rm.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : rm.status === 'taken'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved / Viewing</option>
                          <option value="taken">Taken / Occupied</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          {isRefreshed ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Just confirmed!
                            </span>
                          ) : (
                            <span>{rm.lastConfirmedDate}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleQuickRefresh(rm.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-semibold rounded-md border border-slate-200 transition-colors cursor-pointer text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRefreshed ? 'animate-spin text-amber-600' : ''}`} />
                          <span>Confirm Live</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Student Inquiries & Viewings */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Student Viewing Requests & Inquiries
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {enquiries.length} Inquiries recorded
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No inquiries received yet. When students click "Schedule Viewing", they will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map((enq) => {
                const prop = properties.find((p) => p.id === enq.propertyId);
                const rm = rooms.find((r) => r.id === enq.roomId);
                const waUrl = `https://wa.me/${enq.studentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi ${enq.studentName}, thank you for your enquiry regarding ${rm?.roomNumber || 'the room'} at ${prop?.name || 'StudentStay'}. I would like to confirm your viewing.`
                )}`;

                return (
                  <div
                    key={enq.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{enq.studentName}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-600 font-medium">{enq.institution}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-400">{enq.createdAt}</span>
                      </div>

                      <div className="text-slate-700">
                        Interested in: <strong>{rm?.roomNumber}</strong> at <strong>{prop?.name}</strong> (R{rm?.monthlyRentZAR}/mo)
                      </div>

                      {enq.preferredViewingDate && (
                        <div className="text-amber-800 font-medium flex items-center gap-1.5 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Requested Viewing: {enq.preferredViewingDate}</span>
                        </div>
                      )}

                      <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200/60 mt-1.5">
                        "{enq.message}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
                      <select
                        value={enq.status}
                        onChange={(e) => onUpdateEnquiryStatus(enq.id, e.target.value as any)}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <option value="New">Status: New</option>
                        <option value="Viewing Scheduled">Status: Viewing Scheduled</option>
                        <option value="Deposit Paid">Status: Lease Signed</option>
                        <option value="Declined">Status: Declined</option>
                      </select>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Landlord Trust & Verification Checklist */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>StudentStay Landlord Verification Badge</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Build Student Trust in the Vaal Triangle
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Because student rental scams are widespread in Vanderbijlpark and Vereeniging, verified listings receive 4.5x more inquiries. Complete the 4 verification pillars below to receive the green verified shield.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. South African ID Verification
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Verified
                </span>
              </div>
              <p className="text-emerald-800">
                Landlord ID confirmed against National Home Affairs database.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  2. Municipal Rates / Title Deed
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Confirmed
                </span>
              </div>
              <p className="text-emerald-800">
                Proof of property ownership registered in Vanderbijlpark/Vereeniging.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  3. NSFAS Accommodation Accreditation
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                  Audit Ready
                </span>
              </div>
              <p className="text-slate-600">
                Submit DHET / VUT / NWU official accommodation compliance certificate.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-600" />
                  4. Physical Inspection by StudentStay Team
                </span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  Book Walkthrough
                </span>
              </div>
              <p className="text-slate-600">
                Our Vaal field agent checks locks, solar backup, JoJo water pump, and study desks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

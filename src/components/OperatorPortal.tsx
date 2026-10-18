import React, { useState } from 'react';
import { Property, Room, Enquiry, LandlordAccount, Institution } from '../types';
import { INSTITUTIONS } from '../data/initialData';
import { OperatorAnalytics } from './OperatorAnalytics';
import {
  ShieldCheck,
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users,
  DollarSign,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  ExternalLink,
  Calendar,
  AlertCircle,
  Copy,
  Send,
  Eye,
  Check,
  Trash2,
  UserPlus,
  TrendingUp,
  BarChart2,
} from 'lucide-react';

interface OperatorPortalProps {
  properties: Property[];
  rooms: Room[];
  enquiries: Enquiry[];
  landlords: LandlordAccount[];
  institutions?: Institution[];
  onAddProperty: (property: Property, rooms: Room[]) => void;
  onUpdateRoomStatus: (roomId: string, newStatus: 'available' | 'taken' | 'reserved') => void;
  onRefreshRoomFreshness: (roomId: string) => void;
  onUpdateEnquiryStatus: (enquiryId: string, status: Enquiry['status']) => void;
  onToggleLandlordAccess: (landlordId: string) => void;
  onRecordSubscriptionPayment: (landlordId: string, plan: LandlordAccount['subscriptionPlan']) => void;
  onAddNewLandlord: (landlord: LandlordAccount) => void;
  onOpenAddModal: () => void;
  onSimulateLandlordLogin: (landlord: LandlordAccount) => void;
  onExitOperatorMode: () => void;
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({
  properties,
  rooms,
  enquiries,
  landlords,
  institutions = INSTITUTIONS,
  onAddProperty,
  onUpdateRoomStatus,
  onRefreshRoomFreshness,
  onUpdateEnquiryStatus,
  onToggleLandlordAccess,
  onRecordSubscriptionPayment,
  onAddNewLandlord,
  onOpenAddModal,
  onSimulateLandlordLogin,
  onExitOperatorMode,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'subscriptions' | 'inventory' | 'enquiries'>('analytics');
  const [showNewLandlordModal, setShowNewLandlordModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Landlord form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsApp, setNewWhatsApp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<LandlordAccount['subscriptionPlan']>('Standard Listing (R149/mo)');
  const [initialPaymentReceived, setInitialPaymentReceived] = useState(true);

  // Stats calculation
  const totalMonthlyRevenueZAR = landlords
    .filter((l) => l.subscriptionStatus === 'active')
    .reduce((sum, l) => sum + (l.monthlyFeeZAR || 149), 0);

  const activeSubscriptionsCount = landlords.filter((l) => l.subscriptionStatus === 'active').length;
  const pendingPaymentCount = landlords.filter((l) => l.subscriptionStatus === 'pending_payment').length;
  const totalBeds = rooms.length;
  const availableBeds = rooms.filter((r) => r.status === 'available').length;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSendWhatsAppAccess = (landlord: LandlordAccount) => {
    const text = encodeURIComponent(
      `Hello ${landlord.name}, this is the StudentStay platform administrator. Your student accommodation listing is active! Your portal access code is: ${landlord.accessCode}. You can log into your landlord dashboard to confirm weekly room availability and view student viewing inquiries.`
    );
    window.open(`https://wa.me/${landlord.whatsapp}?text=${text}`, '_blank');
  };

  const handleSendPaymentReminder = (landlord: LandlordAccount) => {
    const text = encodeURIComponent(
      `Hello ${landlord.name}, your StudentStay listing subscription of R${landlord.monthlyFeeZAR} is currently pending payment. To activate your property in front of VUT and NWU students, please EFT to: StudentStay / Capitec Account 1234567890 / Ref: ${landlord.name}. Thank you!`
    );
    window.open(`https://wa.me/${landlord.whatsapp}?text=${text}`, '_blank');
  };

  const handleCreateLandlord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newWhatsApp) return;

    const cleanWa = newWhatsApp.replace(/\D/g, '');
    const code = `${newName.split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;

    const newAcc: LandlordAccount = {
      id: `landlord-${Date.now()}`,
      name: newName,
      phone: newPhone || `+27 ${cleanWa}`,
      whatsapp: cleanWa.startsWith('27') ? cleanWa : `27${cleanWa.replace(/^0/, '')}`,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      propertiesCount: 0,
      subscriptionStatus: initialPaymentReceived ? 'active' : 'pending_payment',
      subscriptionPlan: newPlan,
      subscriptionExpires: initialPaymentReceived ? '2026-11-30' : 'Awaiting Payment',
      monthlyFeeZAR: newPlan.includes('299') ? 299 : newPlan.includes('699') ? 699 : 149,
      accessGranted: initialPaymentReceived,
      accessCode: code,
      verificationStatus: 'Pending Verification',
      notes: initialPaymentReceived ? 'Payment confirmed by operator' : 'Awaiting payment confirmation',
      registeredDate: 'October 2026',
    };

    onAddNewLandlord(newAcc);
    setShowNewLandlordModal(false);
    setNewName('');
    setNewPhone('');
    setNewWhatsApp('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Operator Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>StudentStay Platform Operator Console</span>
              <span aria-hidden="true">·</span>
              <span>Owner Access Only</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Landlord Subscriptions & Listing Management
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Upload accommodations on landlords' behalf, track monthly listing subscriptions in Rand, and grant or revoke landlord portal access upon payment confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Upload Listing for Landlord</span>
            </button>

            <button
              onClick={onExitOperatorMode}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              Return to Student App
            </button>
          </div>
        </div>

        {/* 4 Operator Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-slate-900">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Monthly Recurring Subscriptions</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums font-mono">
              R {totalMonthlyRevenueZAR.toLocaleString('en-ZA')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {activeSubscriptionsCount} Active Subscribed Landlords
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Pending Subscription Payments</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums font-mono">
              {pendingPaymentCount} Landlords
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Access blocked until EFT confirmed
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Vaal Properties Managed</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
              {properties.length} Homes / {totalBeds} Beds
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              {availableBeds} Currently vacant for students
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Total Student Inquiries</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
              {enquiries.length} Requests
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Viewing requests & WhatsApp chats
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Market Analytics & Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Landlord Subscriptions ({landlords.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rooms & Freshness ({rooms.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Student Inquiries</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
              {enquiries.length}
            </span>
          </button>
        </div>

        <button
          onClick={() => setShowNewLandlordModal(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Add New Landlord Account</span>
        </button>
      </div>

      {/* TAB 0: MARKET ANALYTICS & OCCUPANCY TRENDS */}
      {activeTab === 'analytics' && (
        <OperatorAnalytics
          rooms={rooms}
          properties={properties}
          enquiries={enquiries}
          institutions={institutions}
        />
      )}

      {/* TAB 1: SUBSCRIPTIONS & ACCESS CONTROL */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Subscription & Portal Access Table</span>
              <p className="text-[11px] text-slate-500">
                Landlords only get portal access once they pay their monthly fee. You can upload properties for them regardless of access status.
              </p>
            </div>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              R149 – R299 / Month Tiers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Landlord Name</th>
                  <th className="px-5 py-3">Property in Vaal</th>
                  <th className="px-5 py-3">Subscription Tier</th>
                  <th className="px-5 py-3">Payment Status</th>
                  <th className="px-5 py-3">Portal Access</th>
                  <th className="px-5 py-3">Access Code</th>
                  <th className="px-5 py-3 text-right">Owner Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {landlords.map((landlord) => {
                  const prop = properties.find((p) => p.landlordId === landlord.id || p.landlord.id === landlord.id);
                  const isCopied = copiedCode === landlord.accessCode;

                  return (
                    <tr key={landlord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                        <div>{landlord.name}</div>
                        <div className="text-[11px] font-normal text-slate-400 font-mono">
                          {landlord.phone}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {prop ? (
                          <div>
                            <div className="font-medium text-slate-800">{prop.name}</div>
                            <div className="text-[11px] text-slate-400">{prop.suburb}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No property uploaded yet</span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{landlord.subscriptionPlan}</span>
                        <div className="text-[11px] text-slate-400">Exp: {landlord.subscriptionExpires}</div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {landlord.subscriptionStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid (Active)
                          </span>
                        ) : landlord.subscriptionStatus === 'pending_payment' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending (R{landlord.monthlyFeeZAR})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Expired
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleLandlordAccess(landlord.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer border ${
                            landlord.accessGranted
                              ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {landlord.accessGranted ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span>Access Granted</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Access Locked</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {landlord.accessCode}
                          </span>
                          <button
                            onClick={() => handleCopyCode(landlord.accessCode)}
                            title="Copy Code"
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {landlord.subscriptionStatus !== 'active' ? (
                            <button
                              onClick={() => onRecordSubscriptionPayment(landlord.id, landlord.subscriptionPlan)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded border border-emerald-300 font-semibold text-[11px] cursor-pointer"
                            >
                              Confirm Payment
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSendWhatsAppAccess(landlord)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Send Code</span>
                            </button>
                          )}

                          {landlord.subscriptionStatus === 'pending_payment' && (
                            <button
                              onClick={() => handleSendPaymentReminder(landlord)}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] cursor-pointer"
                              title="Send WhatsApp payment reminder"
                            >
                              Remind
                            </button>
                          )}

                          <button
                            onClick={() => onSimulateLandlordLogin(landlord)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                            title="Preview Landlord Portal as this user"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & FRESHNESS CONFIRMATION */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">Master Properties & Room Vacancy</span>
              <p className="text-[11px] text-slate-500">
                Directly manage room availability and confirm freshness on behalf of landlords.
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors"
            >
              + Upload Property
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3">Room / Unit</th>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Landlord</th>
                  <th className="px-5 py-3">Monthly Rent</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Last Verified</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((rm) => {
                  const prop = properties.find((p) => p.id === rm.propertyId);
                  const landlord = landlords.find((l) => l.id === prop?.landlordId || l.id === prop?.landlord.id);

                  return (
                    <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {rm.roomNumber} ({rm.type})
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {prop?.name} ({prop?.suburb})
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {landlord?.name || prop?.landlord.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                        R {rm.monthlyRentZAR.toLocaleString('en-ZA')}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={rm.status}
                          onChange={(e) => onUpdateRoomStatus(rm.id, e.target.value as any)}
                          className={`text-xs font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                            rm.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="taken">Taken</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {rm.lastConfirmedDate}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onRefreshRoomFreshness(rm.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded border border-slate-200 text-xs font-semibold cursor-pointer"
                        >
                          Confirm Live
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

      {/* TAB 3: STUDENT INQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Student Accommodation Inquiries Across the Vaal
            </h3>
            <span className="text-slate-500 font-medium">{enquiries.length} Inquiries recorded</span>
          </div>

          <div className="space-y-3">
            {enquiries.map((enq) => {
              const prop = properties.find((p) => p.id === enq.propertyId);
              const landlord = landlords.find((l) => l.id === prop?.landlordId || l.id === prop?.landlord.id);

              return (
                <div
                  key={enq.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
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
                      Target: <strong>{prop?.name}</strong> (Landlord: {landlord?.name || prop?.landlord.name})
                    </div>

                    {enq.preferredViewingDate && (
                      <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>Requested Viewing: {enq.preferredViewingDate}</span>
                      </div>
                    )}

                    <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                      "{enq.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => onUpdateEnquiryStatus(enq.id, e.target.value as any)}
                      className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="New">Status: New</option>
                      <option value="Viewing Scheduled">Status: Viewing Scheduled</option>
                      <option value="Deposit Paid">Status: Lease Signed</option>
                      <option value="Declined">Status: Declined</option>
                    </select>

                    <a
                      href={`https://wa.me/${landlord?.whatsapp || prop?.landlord.whatsapp}?text=${encodeURIComponent(
                        `Hi ${landlord?.name || prop?.landlord.name}, here is a new student viewing enquiry for ${prop?.name} from ${enq.studentName} (${enq.studentPhone}): "${enq.message}"`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Forward to Landlord</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW LANDLORD ACCOUNT */}
      {showNewLandlordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Add New Landlord Account</h3>
              <button
                onClick={() => setShowNewLandlordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLandlord} className="p-5 text-xs space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Landlord Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Bongani Mthembu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number (For Direct Student Contact)</label>
                <input
                  type="tel"
                  required
                  value={newWhatsApp}
                  onChange={(e) => setNewWhatsApp(e.target.value)}
                  placeholder="e.g. 083 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subscription Package</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Standard Listing (R149/mo)">Standard Listing (R149 / month)</option>
                  <option value="Featured Pro (R299/mo)">Featured Pro with Solar Badge (R299 / month)</option>
                  <option value="Semester Pass (R699/term)">Full Semester Pass (R699 / 6 months)</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={initialPaymentReceived}
                    onChange={(e) => setInitialPaymentReceived(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                  />
                  <span className="font-semibold text-slate-800">
                    Subscription payment already confirmed (Grant access immediately)
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
                  If unchecked, landlord access remains locked until they pay via EFT/Cash.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLandlordModal(false)}
                  className="px-3.5 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Create Landlord Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Property, Room, Enquiry, LandlordAccount, Conversation } from '../types';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Calendar,
  LogOut,
  Phone,
  Plus,
  Send,
  Bed,
  ExternalLink,
  Wifi,
  Sparkles,
  Users,
  Eye,
  Check,
} from 'lucide-react';

interface LandlordGatedPortalProps {
  landlords: LandlordAccount[];
  properties: Property[];
  rooms: Room[];
  enquiries: Enquiry[];
  conversations: Conversation[];
  activeLandlord: LandlordAccount | null;
  onLogin: (landlord: LandlordAccount) => void;
  onLogout: () => void;
  onUpdateRoomStatus: (roomId: string, newStatus: 'available' | 'taken' | 'reserved') => void;
  onRefreshRoomFreshness: (roomId: string) => void;
  onUpdateEnquiryStatus: (enquiryId: string, status: Enquiry['status']) => void;
  onSendLandlordMessage: (conversationId: string, text: string) => void;
  onAddRoomToProperty: (
    propertyId: string,
    newRoom: Omit<Room, 'id' | 'propertyId' | 'lastConfirmedDate' | 'lastConfirmedTimestamp'>
  ) => void;
  onReturnToStudentApp: () => void;
}

export const LandlordGatedPortal: React.FC<LandlordGatedPortalProps> = ({
  landlords,
  properties,
  rooms,
  enquiries,
  conversations,
  activeLandlord,
  onLogin,
  onLogout,
  onUpdateRoomStatus,
  onRefreshRoomFreshness,
  onUpdateEnquiryStatus,
  onSendLandlordMessage,
  onAddRoomToProperty,
  onReturnToStudentApp,
}) => {
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'messages' | 'viewings' | 'property_info'>('rooms');

  // Filter within landlord's own properties (if they manage multiple)
  const [selectedPropertyFilterId, setSelectedPropertyFilterId] = useState<string>('all');

  // Chat state inside landlord portal
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Add room modal
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [targetPropertyIdForNewRoom, setTargetPropertyIdForNewRoom] = useState<string>('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState<Room['type']>('Single Room');
  const [newRoomRent, setNewRoomRent] = useState(2500);
  const [newRoomDeposit, setNewRoomDeposit] = useState(1000);
  const [newRoomSharingDetails, setNewRoomSharingDetails] = useState('');
  const [newRoomBedType, setNewRoomBedType] = useState('Single Bed with Orthopedic Mattress');
  const [newRoomStudyTable, setNewRoomStudyTable] = useState('Dedicated study desk, task chair & reading lamp');
  const [newRoomFeatures, setNewRoomFeatures] = useState('Study desk, Single bed, Cupboard, Wi-Fi');

  // ---------------------------------------------------------
  // STRICT DATA FILTERING ENGINE (ZERO LEAKAGE TO OTHER LANDLORDS)
  // ---------------------------------------------------------
  const scopedProperties = useMemo(() => {
    if (!activeLandlord) return [];
    return properties.filter(
      (p) => p.landlordId === activeLandlord.id || p.landlord.id === activeLandlord.id
    );
  }, [properties, activeLandlord]);

  const scopedPropertyIds = useMemo(
    () => scopedProperties.map((p) => p.id),
    [scopedProperties]
  );

  // Filtered properties based on internal landlord selection
  const displayedProperties = useMemo(() => {
    if (selectedPropertyFilterId === 'all') return scopedProperties;
    return scopedProperties.filter((p) => p.id === selectedPropertyFilterId);
  }, [scopedProperties, selectedPropertyFilterId]);

  const displayedPropertyIds = useMemo(
    () => displayedProperties.map((p) => p.id),
    [displayedProperties]
  );

  // STRICT ROOM FILTERING: Only rooms in this landlord's properties
  const scopedRooms = useMemo(() => {
    if (!activeLandlord) return [];
    return rooms.filter((r) => displayedPropertyIds.includes(r.propertyId));
  }, [rooms, displayedPropertyIds, activeLandlord]);

  // STRICT ENQUIRIES FILTERING: Only enquiries for this landlord's properties
  const scopedEnquiries = useMemo(() => {
    if (!activeLandlord) return [];
    return enquiries.filter((e) => displayedPropertyIds.includes(e.propertyId));
  }, [enquiries, displayedPropertyIds, activeLandlord]);

  // STRICT CONVERSATIONS FILTERING: Only conversations for this landlord
  const scopedConversations = useMemo(() => {
    if (!activeLandlord) return [];
    return conversations.filter(
      (c) =>
        c.landlordId === activeLandlord.id ||
        displayedPropertyIds.includes(c.propertyId)
    );
  }, [conversations, activeLandlord, displayedPropertyIds]);

  // STRICT OCCUPANCY METRICS CALCULATIONS (EXCLUSIVELY FOR THIS LANDLORD)
  const totalBeds = scopedRooms.length;
  const roomsLeftCount = scopedRooms.filter((r) => r.status === 'available').length;
  const roomsOccupiedCount = scopedRooms.filter((r) => r.status === 'taken').length;
  const roomsReservedCount = scopedRooms.filter((r) => r.status === 'reserved').length;
  const occupancyPercent =
    totalBeds > 0 ? Math.round((roomsOccupiedCount / totalBeds) * 100) : 0;

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = accessCodeInput.trim().toUpperCase();
    const match = landlords.find(
      (l) =>
        l.accessCode.toUpperCase() === cleanInput ||
        l.phone.replace(/\D/g, '') === cleanInput.replace(/\D/g, '') ||
        l.whatsapp.replace(/\D/g, '') === cleanInput.replace(/\D/g, '')
    );

    if (match) {
      setLoginError(null);
      setSelectedPropertyFilterId('all');
      setSelectedConversationId(null);
      onLogin(match);
    } else {
      setLoginError('Invalid access code or unregistered phone number. Please contact StudentStay admin.');
    }
  };

  // ---------------------------------------------------------
  // SECURITY ACTION GUARDS (PREVENT MUTATIONS OUTSIDE SCOPE)
  // ---------------------------------------------------------
  const handleSafeUpdateRoomStatus = (
    roomId: string,
    newStatus: 'available' | 'taken' | 'reserved'
  ) => {
    const isMine = scopedRooms.some((r) => r.id === roomId);
    if (!isMine) {
      console.warn('Security alert: Attempted to update room outside landlord scope');
      return;
    }
    onUpdateRoomStatus(roomId, newStatus);
  };

  const handleSafeRefreshRoomFreshness = (roomId: string) => {
    const isMine = scopedRooms.some((r) => r.id === roomId);
    if (!isMine) {
      console.warn('Security alert: Attempted to refresh room outside landlord scope');
      return;
    }
    onRefreshRoomFreshness(roomId);
  };

  const handleSafeUpdateEnquiryStatus = (enquiryId: string, status: Enquiry['status']) => {
    const isMine = scopedEnquiries.some((e) => e.id === enquiryId);
    if (!isMine) {
      console.warn('Security alert: Attempted to update enquiry outside landlord scope');
      return;
    }
    onUpdateEnquiryStatus(enquiryId, status);
  };

  const handleSafeSendLandlordReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConversationId) return;
    const isMine = scopedConversations.some((c) => c.id === selectedConversationId);
    if (!isMine) {
      console.warn('Security alert: Attempted to reply to conversation outside landlord scope');
      return;
    }
    onSendLandlordMessage(selectedConversationId, replyText.trim());
    setReplyText('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim() || scopedProperties.length === 0) return;

    const targetPropId = targetPropertyIdForNewRoom || scopedProperties[0].id;
    if (!scopedPropertyIds.includes(targetPropId)) return;

    const isSharing = newRoomType.includes('Sharing');

    onAddRoomToProperty(targetPropId, {
      roomNumber: newRoomNumber.trim(),
      type: newRoomType,
      isSharing,
      monthlyRentZAR: Number(newRoomRent),
      depositZAR: Number(newRoomDeposit),
      status: 'available',
      sharingDetails:
        newRoomSharingDetails.trim() ||
        (isSharing
          ? `${newRoomType}: Students share bedroom, shared bathroom & commune kitchen`
          : 'Private single bedroom, shared bathroom & commune kitchen'),
      hasBed: true,
      bedType: newRoomBedType,
      hasStudyDesk: true,
      studyTableDetails: newRoomStudyTable,
      sharedFacilities: ['Communal Kitchen', 'Shared Bathroom', 'Social Lounge', 'Braai Area'],
      privateFacilities: ['Private Bed', 'Study Desk', 'Lockable Wardrobe'],
      features: newRoomFeatures.split(',').map((s) => s.trim()).filter(Boolean),
      image: scopedProperties[0].images[0],
    });

    setIsAddRoomOpen(false);
    setNewRoomNumber('');
    setNewRoomSharingDetails('');
  };

  // ---------------------------------------------------------
  // VIEW A: LOGGED-IN & STRICTLY ISOLATED DASHBOARD
  // ---------------------------------------------------------
  if (activeLandlord) {
    // GATED: Subscription unpaid / access not granted
    if (!activeLandlord.accessGranted || activeLandlord.subscriptionStatus !== 'active') {
      return (
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Subscription Required
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Portal Access Locked for {activeLandlord.name}
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Your monthly listing subscription of <strong>R{activeLandlord.monthlyFeeZAR || 149}</strong> is currently{' '}
                <span className="font-semibold text-rose-600">
                  {activeLandlord.subscriptionStatus === 'pending_payment' ? 'Pending Payment Confirmation' : 'Expired'}
                </span>
                . Once your subscription is active, you will be able to confirm room availability and view student inquiries.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-left space-y-2">
              <div className="font-bold text-slate-900">How to activate your listing:</div>
              <p className="text-slate-600">
                1. Make an EFT payment of <strong>R{activeLandlord.monthlyFeeZAR || 149}</strong> with reference <strong>{activeLandlord.name}</strong>.
              </p>
              <p className="text-slate-600">
                2. Send proof of payment via WhatsApp to the StudentStay platform administrator.
              </p>
              <p className="text-slate-600">
                3. The administrator will instantly unlock your access code (<strong>{activeLandlord.accessCode}</strong>).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/27825551928?text=${encodeURIComponent(
                  `Hello StudentStay Admin, I am landlord ${activeLandlord.name} (Code: ${activeLandlord.accessCode}). I would like to pay/activate my subscription for my accommodation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Proof of Payment on WhatsApp</span>
              </a>

              <button
                onClick={onLogout}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentConversation =
      scopedConversations.find((c) => c.id === selectedConversationId) ||
      scopedConversations[0];

    const primaryAccommodationName =
      scopedProperties.map((p) => p.name).join(' & ') || 'My Accommodation';

    return (
      <div className="space-y-6">
        {/* Strict Data Isolation Security Badge */}
        <div className="bg-emerald-950 text-emerald-200 px-4 py-2 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-emerald-800/80 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Strict Landlord Isolation Active:</strong> Viewing exclusively data for{' '}
              <span className="text-white font-semibold">{activeLandlord.name}</span> (
              <span className="text-amber-300 font-semibold">{primaryAccommodationName}</span>).
              All other accommodations in the Vaal are hidden.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 shrink-0">
            Landlord ID: {activeLandlord.id}
          </span>
        </div>

        {/* Landlord Top Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Landlord Portal · {activeLandlord.subscriptionPlan}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {primaryAccommodationName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Landlord: <strong>{activeLandlord.name}</strong> · Suburb:{' '}
                {scopedProperties[0]?.suburb || 'Vanderbijlpark'}
                <span className="text-emerald-700 font-semibold ml-2">
                  (Exclusive access to {scopedProperties.length} listed accommodation)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-mono font-semibold">
                Code: {activeLandlord.accessCode}
              </span>
              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Internal Property Filter (if landlord has > 1 property) */}
          {scopedProperties.length > 1 && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Filter By Your Property:</span>
              <select
                value={selectedPropertyFilterId}
                onChange={(e) => setSelectedPropertyFilterId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium"
              >
                <option value="all">All My Properties ({scopedProperties.length})</option>
                {scopedProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.suburb})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Core Occupancy Counters (Exclusively for THIS Landlord's Rooms) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-xs">
            {/* Rooms Left (Vacant) */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="text-emerald-800 font-semibold flex items-center justify-between">
                <span>Rooms Left to Fill</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-3xl font-bold text-emerald-950 mt-1 font-mono">
                {roomsLeftCount}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                Vacant beds available for students
              </div>
            </div>

            {/* Occupied / Leased */}
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
              <div className="text-rose-800 font-semibold flex items-center justify-between">
                <span>Occupied / Leased</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              </div>
              <div className="text-3xl font-bold text-rose-950 mt-1 font-mono">
                {roomsOccupiedCount}
              </div>
              <div className="text-[11px] text-rose-700 mt-0.5 font-medium">
                Students currently placed ({occupancyPercent}% full)
              </div>
            </div>

            {/* In-App Messages */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="text-amber-800 font-semibold flex items-center justify-between">
                <span>Student Messages</span>
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-950 mt-1 font-mono">
                {scopedConversations.length}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5 font-medium">
                Chats from prospective students
              </div>
            </div>

            {/* Total Bed Capacity */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-slate-500 font-semibold flex items-center justify-between">
                <span>Total Capacity</span>
                <Bed className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1 font-mono">
                {totalBeds}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Total registered beds in your listing
              </div>
            </div>
          </div>

          {/* Occupancy Progress Visualizer */}
          <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-800">
                {scopedProperties[0]?.name || 'Accommodation'} Occupancy Progress
              </span>
              <span className="text-slate-600 font-mono">
                {roomsLeftCount} Left · {roomsOccupiedCount} Occupied · {roomsReservedCount} Reserved
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${totalBeds > 0 ? (roomsOccupiedCount / totalBeds) * 100 : 0}%` }}
                title={`${roomsOccupiedCount} Occupied`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${totalBeds > 0 ? (roomsReservedCount / totalBeds) * 100 : 0}%` }}
                title={`${roomsReservedCount} Reserved`}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${totalBeds > 0 ? (roomsLeftCount / totalBeds) * 100 : 0}%` }}
                title={`${roomsLeftCount} Available`}
              />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Rooms &amp; Availability ({scopedRooms.length})
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
              <span>In-App Student Messages ({scopedConversations.length})</span>
              {scopedConversations.some((c) => c.unreadByLandlord) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('viewings')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'viewings'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Viewing Bookings ({scopedEnquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('property_info')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'property_info'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Accommodation Details</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTargetPropertyIdForNewRoom(scopedProperties[0]?.id || '');
              setIsAddRoomOpen(true);
            }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Add Room to My Property</span>
          </button>
        </div>

        {/* TAB 1: ROOM VACANCY & AVAILABILITY TABLE */}
        {activeTab === 'rooms' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">
                  {scopedProperties[0]?.name || 'My Accommodation'} Room Inventory
                </span>
                <p className="text-[11px] text-slate-500">
                  Toggle status between Available and Taken as students pay their deposits.
                </p>
              </div>
              <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Isolated Landlord View ({scopedRooms.length} Rooms)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Room / Unit</th>
                    <th className="px-5 py-3">Format &amp; Sharing</th>
                    <th className="px-5 py-3">Monthly Rent</th>
                    <th className="px-5 py-3">Deposit</th>
                    <th className="px-5 py-3">Availability Status</th>
                    <th className="px-5 py-3">Last Verified Live</th>
                    <th className="px-5 py-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scopedRooms.map((rm) => (
                    <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {rm.roomNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-900">{rm.type}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                          {rm.sharingDetails || 'Private room with shared facilities'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 tabular-nums">
                        R {rm.monthlyRentZAR.toLocaleString('en-ZA')}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600 tabular-nums">
                        {rm.depositZAR > 0 ? `R ${rm.depositZAR.toLocaleString('en-ZA')}` : 'None'}
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={rm.status}
                          onChange={(e) =>
                            handleSafeUpdateRoomStatus(rm.id, e.target.value as any)
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer ${
                            rm.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : rm.status === 'taken'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="available">✓ Available (Vacant)</option>
                          <option value="reserved">⏳ Reserved / Viewing</option>
                          <option value="taken">✕ Occupied (Taken)</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {rm.lastConfirmedDate}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSafeRefreshRoomFreshness(rm.id)}
                          className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                        >
                          Confirm Live Today
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: IN-APP STUDENT MESSAGING */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">In-App Student Communication Hub</span>
                <p className="text-[11px] text-slate-500">
                  Chat directly with prospective students who inquire through the app, or switch to direct WhatsApp.
                </p>
              </div>
              <span className="text-slate-500 font-medium">
                {scopedConversations.length} Active Student Conversations for {primaryAccommodationName}
              </span>
            </div>

            {scopedConversations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No in-app student messages received yet. When students click &quot;Chat in App&quot; on your listing, their inquiries will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                {/* Conversation List Sidebar (Col 4) */}
                <div className="md:col-span-4 border-r border-slate-200 p-3 space-y-1.5 bg-slate-50/50 overflow-y-auto max-h-[500px]">
                  {scopedConversations.map((conv) => {
                    const isSelected = currentConversation?.id === conv.id;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border text-xs ${
                          isSelected
                            ? 'bg-white border-amber-400 shadow-xs'
                            : 'bg-white/80 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{conv.studentName}</span>
                          <span className="text-[10px] text-slate-400">{conv.lastTimestamp}</span>
                        </div>
                        <div className="text-[11px] text-amber-700 font-semibold mb-1">
                          {conv.roomNumber || 'Room Inquiry'}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Active Chat Conversation View (Col 8) */}
                {currentConversation ? (
                  <div className="md:col-span-8 flex flex-col justify-between h-[500px] bg-white">
                    {/* Chat Header */}
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {currentConversation.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Target: {currentConversation.roomNumber} ({currentConversation.studentPhone})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${currentConversation.studentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${currentConversation.studentName}, this is ${activeLandlord.name} replying to your StudentStay inquiry for ${currentConversation.roomNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Direct WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${currentConversation.studentPhone}`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                          title="Call student"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 text-xs">
                      {currentConversation.messages.map((msg) => {
                        const isMe = msg.sender === 'landlord';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                              {msg.senderName} · {msg.timestamp}
                            </div>
                            <div
                              className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                                isMe
                                  ? 'bg-slate-900 text-white font-medium rounded-tr-xs'
                                  : 'bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-tl-xs'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Input */}
                    <form
                      onSubmit={handleSafeSendLandlordReply}
                      className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
                    >
                      <input
                        type="text"
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${currentConversation.studentName} through the app...`}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="md:col-span-8 flex items-center justify-center p-8 text-slate-400 text-xs">
                    Select a student conversation to reply.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIEWINGS */}
        {activeTab === 'viewings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Scheduled Student Viewings for {primaryAccommodationName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Only booking inquiries submitted for your listed properties appear here.
                </p>
              </div>
              <span className="text-slate-500 font-medium">{scopedEnquiries.length} Requests</span>
            </div>

            {scopedEnquiries.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No viewing bookings yet for your accommodation.
              </div>
            ) : (
              <div className="space-y-3">
                {scopedEnquiries.map((enq) => (
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

                      {enq.preferredViewingDate && (
                        <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Viewing Requested: {enq.preferredViewingDate}</span>
                        </div>
                      )}

                      <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                        &quot;{enq.message}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleSafeUpdateEnquiryStatus(enq.id, e.target.value as any)
                        }
                        className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        <option value="New">Status: New</option>
                        <option value="Viewing Scheduled">Status: Scheduled</option>
                        <option value="Deposit Paid">Status: Lease Signed</option>
                        <option value="Declined">Status: Declined</option>
                      </select>

                      <a
                        href={`https://wa.me/${enq.studentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi ${enq.studentName}, this is ${activeLandlord.name} regarding your viewing request for ${primaryAccommodationName} on StudentStay!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACCOMMODATION PROFILE & AMENITIES */}
        {activeTab === 'property_info' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {scopedProperties[0]?.name} Profile &amp; Amenities
                </h3>
                <p className="text-[11px] text-slate-500">
                  Details published to students searching around VUT, NWU, and Sedibeng TVET.
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1 rounded-full border border-emerald-200">
                {scopedProperties[0]?.isCommune ? 'Student Commune' : 'Apartment Style'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wi-Fi & Electricity Backup */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Wi-Fi Specification</span>
                </div>
                <div className="text-slate-700">
                  Speed: <strong>{scopedProperties[0]?.wifiDetails?.speed || '100Mbps Uncapped'}</strong>
                </div>
                <p className="text-slate-600 text-[11px]">
                  {scopedProperties[0]?.wifiDetails?.description ||
                    'Uncapped Wi-Fi backed by battery / solar system during load shedding.'}
                </p>
              </div>

              {/* Activities in Accommodation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Activities &amp; Social Recreation</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(scopedProperties[0]?.activities || [
                    'Swimming Pool',
                    'Pool Table (8-Ball)',
                    'Communal Braai Area',
                  ]).map((act, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-semibold text-[11px]"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="font-bold text-slate-900">Published Description:</div>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {scopedProperties[0]?.description}
              </p>
            </div>
          </div>
        )}

        {/* MODAL: ADD ROOM TO MY PROPERTY */}
        {isAddRoomOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900">
                  Add Room to {scopedProperties[0]?.name || 'My Accommodation'}
                </h3>
                <button
                  onClick={() => setIsAddRoomOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="p-5 text-xs space-y-3.5">
                {scopedProperties.length > 1 && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Property</label>
                    <select
                      value={targetPropertyIdForNewRoom}
                      onChange={(e) => setTargetPropertyIdForNewRoom(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                    >
                      {scopedProperties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Label / Number</label>
                  <input
                    type="text"
                    required
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. Unit C2 - Private Single"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Format</label>
                    <select
                      value={newRoomType}
                      onChange={(e) => setNewRoomType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-medium"
                    >
                      <option value="Single Room">Single Room</option>
                      <option value="2-Sharing Room">2-Sharing Room</option>
                      <option value="3-Sharing Room">3-Sharing Room</option>
                      <option value="Bachelor Flat">Bachelor Flat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (ZAR)</label>
                    <input
                      type="number"
                      step="50"
                      value={newRoomRent}
                      onChange={(e) => setNewRoomRent(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Deposit (ZAR)</label>
                    <input
                      type="number"
                      step="50"
                      value={newRoomDeposit}
                      onChange={(e) => setNewRoomDeposit(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bed Setup</label>
                    <input
                      type="text"
                      value={newRoomBedType}
                      onChange={(e) => setNewRoomBedType(e.target.value)}
                      placeholder="e.g. Single Bed with Mattress"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Study Table Specification</label>
                  <input
                    type="text"
                    value={newRoomStudyTable}
                    onChange={(e) => setNewRoomStudyTable(e.target.value)}
                    placeholder="e.g. Dedicated wooden study desk, task chair & lamp"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sharing Details (What is shared vs private)
                  </label>
                  <input
                    type="text"
                    value={newRoomSharingDetails}
                    onChange={(e) => setNewRoomSharingDetails(e.target.value)}
                    placeholder="e.g. 2 students share bedroom, shared bathroom & commune kitchen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Features (Comma separated)</label>
                  <input
                    type="text"
                    value={newRoomFeatures}
                    onChange={(e) => setNewRoomFeatures(e.target.value)}
                    placeholder="e.g. Study desk, ergonomic chair, single bed"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddRoomOpen(false)}
                    className="px-3.5 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Add Room to Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------
  // VIEW B: SECURE LANDLORD ACCESS LOGIN
  // ---------------------------------------------------------
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto font-bold shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            StudentStay Landlord Portal
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Log in to manage your specific accommodation, see occupied vs vacant beds, and reply to student messages.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Your Landlord Access Code or Registered Phone
            </label>
            <input
              type="text"
              required
              value={accessCodeInput}
              onChange={(e) => {
                setAccessCodeInput(e.target.value);
                setLoginError(null);
              }}
              placeholder="e.g. NDLOVU-77 or 0825551928"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 font-mono tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {loginError && (
              <p className="text-rose-600 text-[11px] mt-1.5 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {loginError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-xs"
          >
            Access My Property Dashboard
          </button>

          {/* Quick Demo Logins for Testing Landlord Isolation */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 text-center">
              Test Strict Landlord Isolation (Choose an account):
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  const sipho = landlords.find((l) => l.id === 'landlord-1');
                  if (sipho) onLogin(sipho);
                }}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 rounded-xl text-left cursor-pointer transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <span>Mr. Ndlovu</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">Acacia Residence Only</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Code: NDLOVU-77</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const lerato = landlords.find((l) => l.id === 'landlord-2');
                  if (lerato) onLogin(lerato);
                }}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 rounded-xl text-left cursor-pointer transition-colors"
              >
                <div className="font-bold flex items-center gap-1">
                  <span>Mrs. Mokoena</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">Riverfront Commons Only</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Code: MOKOENA-12</div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center italic">
              Notice: When logging in as Mr. Ndlovu, Mrs. Mokoena's Riverfront property and messages will be completely hidden.
            </p>
          </div>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Want to list your accommodation? Contact the platform administrator on WhatsApp to pay your subscription and receive your unique code.
        </div>

        <button
          onClick={onReturnToStudentApp}
          className="w-full py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
        >
          ← Return to Student App
        </button>
      </div>
    </div>
  );
};

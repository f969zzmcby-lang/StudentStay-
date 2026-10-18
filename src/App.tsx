/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Property,
  Room,
  Institution,
  Review,
  Enquiry,
  ReportItem,
  LandlordAccount,
  Conversation,
  ChatMessage,
} from './types';
import {
  INSTITUTIONS,
  INITIAL_PROPERTIES,
  INITIAL_ROOMS,
  INITIAL_REVIEWS,
  INITIAL_ENQUIRIES,
  INITIAL_LANDLORDS,
  INITIAL_CONVERSATIONS,
} from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { InteractiveMap } from './components/InteractiveMap';
import { OperatorPortal } from './components/OperatorPortal';
import { LandlordGatedPortal } from './components/LandlordGatedPortal';
import { LaunchPlanModal } from './components/LaunchPlanModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { OperatorLoginModal } from './components/OperatorLoginModal';
import { ReportModal } from './components/ReportModal';
import { InAppChatModal } from './components/InAppChatModal';
import { WelcomeSplashScreen } from './components/WelcomeSplashScreen';
import { Footer } from './components/Footer';
import {
  Search,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Primary domain state
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [institutions] = useState<Institution[]>(INSTITUTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [landlords, setLandlords] = useState<LandlordAccount[]>(INITIAL_LANDLORDS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Navigation & Role states
  const [isOperatorMode, setIsOperatorMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'map' | 'launch' | 'operator' | 'landlord_gate'>('browse');
  const [activeLoggedLandlord, setActiveLoggedLandlord] = useState<LandlordAccount | null>(null);

  // Attractive initial loading & welcome experience (Student entering accommodation)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);

  // Filter & Search states (Student App)
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(3800);
  const [nsfasOnly, setNsfasOnly] = useState<boolean>(false);
  const [solarOnly, setSolarOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'walking-time' | 'freshness'>('recommended');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'taken'>('available');

  // Modal states
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [isOperatorLoginOpen, setIsOperatorLoginOpen] = useState<boolean>(false);
  const [reportingTarget, setReportingTarget] = useState<{ property: Property; room: Room | null } | null>(null);

  // In-App Chat modal state (between student and specific accommodation landlord)
  const [activeChatTarget, setActiveChatTarget] = useState<{ property: Property; room?: Room | null } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pair each room with its property for rendering
  const pairedRooms = useMemo(() => {
    return rooms.map((room) => {
      const property = properties.find((p) => p.id === room.propertyId) || properties[0];
      return { room, property };
    });
  }, [rooms, properties]);

  // Filtered rooms
  const filteredPairedRooms = useMemo(() => {
    return pairedRooms.filter(({ room, property }) => {
      if (statusFilter === 'available' && room.status !== 'available') return false;
      if (statusFilter === 'taken' && room.status === 'available') return false;

      if (selectedCampus !== 'All' && property.primaryCampus !== selectedCampus) {
        return false;
      }

      if (selectedRoomType !== 'All' && room.type !== selectedRoomType) {
        return false;
      }

      if (room.monthlyRentZAR > maxBudget) {
        return false;
      }

      if (nsfasOnly && !property.nsfasAccredited) {
        return false;
      }

      if (solarOnly && !property.hasSolarBackup) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = property.name.toLowerCase().includes(q);
        const matchesSuburb = property.suburb.toLowerCase().includes(q);
        const matchesAddress = property.address.toLowerCase().includes(q);
        const matchesRoom = room.roomNumber.toLowerCase().includes(q);
        const matchesCampus = property.primaryCampus.toLowerCase().includes(q);
        const matchesActivities = (property.activities || []).some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesSuburb && !matchesAddress && !matchesRoom && !matchesCampus && !matchesActivities) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.room.monthlyRentZAR - b.room.monthlyRentZAR;
      }
      if (sortBy === 'price-high') {
        return b.room.monthlyRentZAR - a.room.monthlyRentZAR;
      }
      if (sortBy === 'walking-time') {
        return a.property.walkingTimeMin - b.property.walkingTimeMin;
      }
      if (sortBy === 'freshness') {
        return b.room.lastConfirmedTimestamp - a.room.lastConfirmedTimestamp;
      }
      if (a.room.status === 'available' && b.room.status !== 'available') return -1;
      if (b.room.status === 'available' && a.room.status !== 'available') return 1;
      return b.property.rating - a.property.rating;
    });
  }, [
    pairedRooms,
    statusFilter,
    selectedCampus,
    selectedRoomType,
    maxBudget,
    nsfasOnly,
    solarOnly,
    searchQuery,
    sortBy,
  ]);

  // Room selection handler
  const handleSelectRoom = (room: Room, property: Property) => {
    setSelectedRoom(room);
    setSelectedProperty(property);
  };

  // Direct WhatsApp contact trigger
  const handleQuickWhatsApp = (room: Room, property: Property) => {
    const text = encodeURIComponent(
      `Hello ${property.landlord.name}, I found your student accommodation listing for ${property.name} (${room.roomNumber}) on StudentStay. Monthly rent is R${room.monthlyRentZAR}. Is this room currently available for viewing?`
    );
    const url = `https://wa.me/${property.landlord.whatsapp}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp chat with ${property.landlord.name}...`);
  };

  // Trigger in-app communication
  const handleOpenInAppChat = (room: Room, property: Property) => {
    setActiveChatTarget({ property, room });
  };

  // Student sends an in-app message to landlord
  const handleStudentSendMessage = (
    propertyId: string,
    roomId: string | undefined,
    studentName: string,
    studentPhone: string,
    messageText: string
  ) => {
    const targetProperty = properties.find((p) => p.id === propertyId);
    const targetRoom = rooms.find((r) => r.id === roomId);
    const existingIndex = conversations.findIndex(
      (c) => c.propertyId === propertyId && c.studentPhone.replace(/\D/g, '') === studentPhone.replace(/\D/g, '')
    );

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: existingIndex >= 0 ? conversations[existingIndex].id : `conv-${Date.now()}`,
      sender: 'student',
      senderName: studentName,
      text: messageText,
      timestamp: 'Just now',
    };

    if (existingIndex >= 0) {
      const updated = [...conversations];
      updated[existingIndex] = {
        ...updated[existingIndex],
        lastMessage: messageText,
        lastTimestamp: 'Just now',
        unreadByLandlord: true,
        messages: [...updated[existingIndex].messages, newMsg],
      };
      setConversations(updated);
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        propertyId,
        propertyName: targetProperty?.name || 'Accommodation',
        roomId: targetRoom?.id,
        roomNumber: targetRoom?.roomNumber || 'Room Inquiry',
        landlordId: targetProperty?.landlordId || targetProperty?.landlord.id || 'landlord-1',
        landlordName: targetProperty?.landlord.name || 'Landlord',
        studentName,
        studentPhone,
        lastMessage: messageText,
        lastTimestamp: 'Just now',
        unreadByLandlord: true,
        unreadByStudent: false,
        messages: [newMsg],
      };
      setConversations([newConv, ...conversations]);
    }

    showToast(`Message sent to ${targetProperty?.landlord.name || 'landlord'} in app!`);
  };

  // Landlord sends reply inside their isolated portal
  const handleLandlordSendMessage = (conversationId: string, text: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: 'landlord',
      senderName: conv.landlordName,
      text,
      timestamp: 'Just now',
    };

    setConversations(
      conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: 'Just now',
              unreadByStudent: true,
              unreadByLandlord: false,
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    showToast(`Reply sent to student ${conv.studentName}!`);
  };

  // Add new property and rooms handler (Operator upload on landlord's behalf)
  const handleAddProperty = (newProperty: Property, newRooms: Room[], newLandlord?: LandlordAccount) => {
    if (newLandlord) {
      setLandlords([newLandlord, ...landlords]);
    }
    setProperties([newProperty, ...properties]);
    setRooms([...newRooms, ...rooms]);
    showToast(`Uploaded ${newProperty.name} with ${newRooms.length} rooms to directory!`);
  };

  // Room availability toggle
  const handleUpdateRoomStatus = (roomId: string, newStatus: 'available' | 'taken' | 'reserved') => {
    setRooms(
      rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: newStatus,
              lastConfirmedDate: 'Today',
              lastConfirmedTimestamp: Date.now(),
            }
          : r
      )
    );
    showToast(`Updated room status to ${newStatus}`);
  };

  // Refresh room freshness
  const handleRefreshRoomFreshness = (roomId: string) => {
    setRooms(
      rooms.map((r) =>
        r.id === roomId
          ? {
              ...r,
              lastConfirmedDate: 'Just now',
              lastConfirmedTimestamp: Date.now(),
            }
          : r
      )
    );
    showToast(`Live availability confirmed for room!`);
  };

  // Booking / Viewing enquiry
  const handleBookViewing = (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: 'Just now',
    };
    setEnquiries([newEnquiry, ...enquiries]);
    showToast('Viewing request submitted to landlord & operator!');
  };

  // Enquiry status change
  const handleUpdateEnquiryStatus = (enquiryId: string, status: Enquiry['status']) => {
    setEnquiries(
      enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e))
    );
    showToast(`Enquiry marked as ${status}`);
  };

  // Toggle Landlord Portal Access (Grant / Revoke upon subscription payment)
  const handleToggleLandlordAccess = (landlordId: string) => {
    setLandlords(
      landlords.map((l) =>
        l.id === landlordId
          ? {
              ...l,
              accessGranted: !l.accessGranted,
              subscriptionStatus: !l.accessGranted ? 'active' : 'expired',
            }
          : l
      )
    );
    const target = landlords.find((l) => l.id === landlordId);
    showToast(
      target?.accessGranted
        ? `Portal access revoked for ${target?.name}`
        : `Portal access granted to ${target?.name}!`
    );
  };

  // Record Subscription Payment
  const handleRecordSubscriptionPayment = (landlordId: string, plan: LandlordAccount['subscriptionPlan']) => {
    setLandlords(
      landlords.map((l) =>
        l.id === landlordId
          ? {
              ...l,
              subscriptionStatus: 'active',
              accessGranted: true,
              subscriptionPlan: plan,
              subscriptionExpires: '2026-11-30',
              notes: 'Subscription payment verified via EFT by Operator',
            }
          : l
      )
    );
    showToast(`Payment confirmed! Access granted to landlord.`);
  };

  // Add new landlord
  const handleAddNewLandlord = (newLandlord: LandlordAccount) => {
    setLandlords([newLandlord, ...landlords]);
    showToast(`Added landlord account for ${newLandlord.name} (Code: ${newLandlord.accessCode})`);
  };

  // Simulate logging in as a specific landlord
  const handleSimulateLandlordLogin = (landlord: LandlordAccount) => {
    setActiveLoggedLandlord(landlord);
    setActiveTab('landlord_gate');
    showToast(`Previewing Landlord Portal as ${landlord.name}`);
  };

  // Report listing
  const handleReportListing = (reportData: Omit<ReportItem, 'id' | 'date' | 'status'>) => {
    const newReport: ReportItem = {
      ...reportData,
      id: `rep-${Date.now()}`,
      date: new Date().toLocaleDateString('en-ZA'),
      status: 'Under Review',
    };
    setReports([newReport, ...reports]);
    showToast('Listing flagged for StudentStay safety inspection.');
  };

  const availableCount = rooms.filter((r) => r.status === 'available').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Attractive Access Screen (Student entering accommodation) */}
      {showWelcomeScreen && (
        <WelcomeSplashScreen
          onEnter={() => setShowWelcomeScreen(false)}
          availableRoomsCount={availableCount}
        />
      )}

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        isOperatorMode={isOperatorMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOperatorLogin={() => setIsOperatorLoginOpen(true)}
        onExitOperatorMode={() => {
          setIsOperatorMode(false);
          setActiveTab('browse');
          showToast('Switched to Student App view');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenWelcomeTour={() => setShowWelcomeScreen(true)}
        availableCount={availableCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: OPERATOR SIDE (Protected Owner Management) */}
        {activeTab === 'operator' && isOperatorMode && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OperatorPortal
              properties={properties}
              rooms={rooms}
              enquiries={enquiries}
              landlords={landlords}
              institutions={institutions}
              onAddProperty={handleAddProperty}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onRefreshRoomFreshness={handleRefreshRoomFreshness}
              onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
              onToggleLandlordAccess={handleToggleLandlordAccess}
              onRecordSubscriptionPayment={handleRecordSubscriptionPayment}
              onAddNewLandlord={handleAddNewLandlord}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSimulateLandlordLogin={handleSimulateLandlordLogin}
              onExitOperatorMode={() => {
                setIsOperatorMode(false);
                setActiveTab('browse');
              }}
            />
          </section>
        )}

        {/* VIEW 2: GATED LANDLORD PORTAL (Strictly Isolated to Landlord's Own Accommodation) */}
        {activeTab === 'landlord_gate' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LandlordGatedPortal
              landlords={landlords}
              properties={
                activeLoggedLandlord
                  ? properties.filter(
                      (p) =>
                        p.landlordId === activeLoggedLandlord.id ||
                        p.landlord.id === activeLoggedLandlord.id
                    )
                  : properties
              }
              rooms={
                activeLoggedLandlord
                  ? rooms.filter((r) => {
                      const prop = properties.find((p) => p.id === r.propertyId);
                      return (
                        prop &&
                        (prop.landlordId === activeLoggedLandlord.id ||
                          prop.landlord.id === activeLoggedLandlord.id)
                      );
                    })
                  : rooms
              }
              enquiries={
                activeLoggedLandlord
                  ? enquiries.filter((e) => {
                      const prop = properties.find((p) => p.id === e.propertyId);
                      return (
                        prop &&
                        (prop.landlordId === activeLoggedLandlord.id ||
                          prop.landlord.id === activeLoggedLandlord.id)
                      );
                    })
                  : enquiries
              }
              conversations={
                activeLoggedLandlord
                  ? conversations.filter(
                      (c) =>
                        c.landlordId === activeLoggedLandlord.id ||
                        properties.some(
                          (p) =>
                            p.id === c.propertyId &&
                            (p.landlordId === activeLoggedLandlord.id ||
                              p.landlord.id === activeLoggedLandlord.id)
                        )
                    )
                  : conversations
              }
              activeLandlord={activeLoggedLandlord}
              onLogin={(landlord) => {
                setActiveLoggedLandlord(landlord);
                showToast(`Signed in as ${landlord.name}`);
              }}
              onLogout={() => {
                setActiveLoggedLandlord(null);
                showToast('Signed out of Landlord Portal');
              }}
              onUpdateRoomStatus={handleUpdateRoomStatus}
              onRefreshRoomFreshness={handleRefreshRoomFreshness}
              onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
              onSendLandlordMessage={handleLandlordSendMessage}
              onAddRoomToProperty={(propertyId, newRoom) => {
                const newRoomId = `room-${propertyId}-${Date.now()}`;
                const roomToAdd: Room = {
                  ...newRoom,
                  id: newRoomId,
                  propertyId,
                  lastConfirmedDate: 'Today',
                  lastConfirmedTimestamp: Date.now(),
                };
                setRooms([roomToAdd, ...rooms]);
                showToast(`Added ${newRoom.roomNumber} to accommodation!`);
              }}
              onReturnToStudentApp={() => {
                setActiveLoggedLandlord(null);
                setActiveTab('browse');
              }}
            />
          </section>
        )}

        {/* VIEW 3: 30-DAY LAUNCH ROADMAP */}
        {activeTab === 'launch' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LaunchPlanModal />
          </section>
        )}

        {/* VIEW 4: CAMPUS MAP */}
        {activeTab === 'map' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InteractiveMap
              properties={properties}
              rooms={rooms}
              institutions={institutions}
              onSelectRoom={handleSelectRoom}
              onQuickWhatsApp={handleQuickWhatsApp}
            />
          </section>
        )}

        {/* VIEW 5: PUBLIC STUDENT APP (Default Browse & Search Experience) */}
        {activeTab === 'browse' && (
          <div>
            {/* Hero Section */}
            <Hero
              institutions={institutions}
              selectedCampus={selectedCampus}
              setSelectedCampus={setSelectedCampus}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              nsfasOnly={nsfasOnly}
              setNsfasOnly={setNsfasOnly}
              solarOnly={solarOnly}
              setSolarOnly={setSolarOnly}
              onExploreClick={() => {
                const el = document.getElementById('rooms-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              totalRoomsCount={availableCount}
            />

            {/* Student Directory Section */}
            <section id="rooms-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Filter & Search Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Search input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search suburb (CW1, Bedworth), pool table, swimming pool, or residence..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Buttons */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => setStatusFilter('available')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        statusFilter === 'available'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Available Rooms ({availableCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        statusFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Rooms ({rooms.length})
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium whitespace-nowrap">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="recommended">Recommended &amp; Verified</option>
                      <option value="price-low">Rent: Lowest to Highest</option>
                      <option value="price-high">Rent: Highest to Lowest</option>
                      <option value="walking-time">Shortest Walk to Campus</option>
                      <option value="freshness">Most Recently Confirmed</option>
                    </select>
                  </div>
                </div>

                {/* Active filter summary */}
                {(selectedCampus !== 'All' || selectedRoomType !== 'All' || maxBudget < 5000 || nsfasOnly || solarOnly || searchQuery) && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-700">Filters:</span>
                      {selectedCampus !== 'All' && <span>Campus: {selectedCampus}</span>}
                      {selectedRoomType !== 'All' && <span>· Format: {selectedRoomType}</span>}
                      {maxBudget < 5000 && <span>· Max: R{maxBudget}</span>}
                      {nsfasOnly && <span>· NSFAS Accredited</span>}
                      {solarOnly && <span>· Solar Backup</span>}
                      {searchQuery && <span>· Query: "{searchQuery}"</span>}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCampus('All');
                        setSelectedRoomType('All');
                        setMaxBudget(5000);
                        setNsfasOnly(false);
                        setSolarOnly(false);
                        setSearchQuery('');
                      }}
                      className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer whitespace-nowrap"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Product Grid */}
              {filteredPairedRooms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No student rooms matched these criteria
                  </h3>
                  <p className="text-xs text-slate-500">
                    Try adjusting your maximum budget slider or clearing the campus filter to see more accommodations in Vanderbijlpark and Vereeniging.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCampus('All');
                      setSelectedRoomType('All');
                      setMaxBudget(5000);
                      setNsfasOnly(false);
                      setSolarOnly(false);
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    View All Student Rooms
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredPairedRooms.map(({ room, property }) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      property={property}
                      onSelectRoom={handleSelectRoom}
                      onQuickWhatsApp={handleQuickWhatsApp}
                      onOpenInAppChat={handleOpenInAppChat}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* MODALS */}
      {selectedRoom && selectedProperty && (
        <RoomDetailModal
          room={selectedRoom}
          property={selectedProperty}
          reviews={reviews}
          onClose={() => {
            setSelectedRoom(null);
            setSelectedProperty(null);
          }}
          onBookViewing={handleBookViewing}
          onReportListing={(prop, rm) => {
            setReportingTarget({ property: prop, room: rm });
          }}
          onOpenInAppChat={(rm, prop) => {
            handleOpenInAppChat(rm, prop);
            setSelectedRoom(null);
            setSelectedProperty(null);
          }}
        />
      )}

      {/* In-App Chat Modal between student and accommodation landlord */}
      {activeChatTarget && (
        <InAppChatModal
          property={activeChatTarget.property}
          room={activeChatTarget.room}
          conversation={conversations.find(
            (c) => c.propertyId === activeChatTarget.property.id
          )}
          onClose={() => setActiveChatTarget(null)}
          onSendMessage={handleStudentSendMessage}
          onDirectWhatsApp={() => {
            if (activeChatTarget.room) {
              handleQuickWhatsApp(activeChatTarget.room, activeChatTarget.property);
            }
          }}
        />
      )}

      {/* Operator Add Property Modal (Upload for Landlord) */}
      {isAddModalOpen && (
        <AddPropertyModal
          landlords={landlords}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProperty}
        />
      )}

      {/* Operator PIN Login Modal */}
      {isOperatorLoginOpen && (
        <OperatorLoginModal
          isOpen={isOperatorLoginOpen}
          onClose={() => setIsOperatorLoginOpen(false)}
          onSuccess={() => {
            setIsOperatorMode(true);
            setActiveTab('operator');
            showToast('Operator Mode Unlocked: Welcome Platform Admin');
          }}
        />
      )}

      {/* Student Safety Guide Modal */}
      {isSafetyModalOpen && (
        <SafetyGuideModal onClose={() => setIsSafetyModalOpen(false)} />
      )}

      {/* Scam / Misleading Listing Report Modal */}
      {reportingTarget && (
        <ReportModal
          property={reportingTarget.property}
          room={reportingTarget.room}
          onClose={() => setReportingTarget(null)}
          onSubmitReport={handleReportListing}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onSelectTab={setActiveTab}
        onOpenOperatorLogin={() => setIsOperatorLoginOpen(true)}
        onOpenLandlordLogin={() => {
          setActiveTab('landlord_gate');
          showToast('Navigated to Landlord Access Gate');
        }}
      />
    </div>
  );
}

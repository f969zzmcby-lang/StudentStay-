import React, { useState } from 'react';
import { Property, Room, LandlordAccount } from '../types';
import { X, Plus, Trash2, Building, Bed, DollarSign, MapPin, Check, Sun, Droplets, Wifi, Shield, User } from 'lucide-react';
import singleRoomImg from '../assets/images/student_room_single_vut_1792174485273.jpg';
import sharingRoomImg from '../assets/images/student_room_sharing_nwu_1792174485547.jpg';
import exteriorImg from '../assets/images/student_apartment_exterior_1792174485303.jpg';

interface AddPropertyModalProps {
  landlords: LandlordAccount[];
  onClose: () => void;
  onSave: (property: Property, rooms: Room[], newLandlord?: LandlordAccount) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ landlords, onClose, onSave }) => {
  // Mode: Assign to existing landlord or create new
  const [landlordMode, setLandlordMode] = useState<'existing' | 'new'>(landlords.length > 0 ? 'existing' : 'new');
  const [selectedLandlordId, setSelectedLandlordId] = useState<string>(landlords[0]?.id || '');

  // New Landlord details (if mode === 'new')
  const [landlordName, setLandlordName] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');
  const [landlordWhatsApp, setLandlordWhatsApp] = useState('');
  const [newSubscriptionPlan, setNewSubscriptionPlan] = useState<LandlordAccount['subscriptionPlan']>('Standard Listing (R149/mo)');
  const [subscriptionPaid, setSubscriptionPaid] = useState(true);

  // Property details
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('CW1, Vanderbijlpark');
  const [primaryCampus, setPrimaryCampus] = useState('VUT');
  const [campusDistanceKm, setCampusDistanceKm] = useState(0.8);
  const [walkingTimeMin, setWalkingTimeMin] = useState(10);
  const [nsfasAccredited, setNsfasAccredited] = useState(true);
  const [genderPolicy, setGenderPolicy] = useState<'Co-ed' | 'Female Only' | 'Male Only'>('Co-ed');
  const [hasSolarBackup, setHasSolarBackup] = useState(true);
  const [hasWaterBackup, setHasWaterBackup] = useState(true);
  const [description, setDescription] = useState('');

  // Rooms inside this property (Separation of Property from Rooms)
  const [rooms, setRooms] = useState<Array<{
    roomNumber: string;
    type: 'Single Room' | '2-Sharing Room' | '3-Sharing Room' | 'Bachelor Flat';
    monthlyRentZAR: number;
    depositZAR: number;
    features: string;
    imageType: 'single' | 'sharing' | 'exterior';
  }>>([
    {
      roomNumber: 'Room 1 (Single)',
      type: 'Single Room',
      monthlyRentZAR: 2800,
      depositZAR: 1400,
      features: 'Single Bed, Study Desk, Cupboard, Garden View',
      imageType: 'single',
    },
    {
      roomNumber: 'Room 2 (Sharing)',
      type: '2-Sharing Room',
      monthlyRentZAR: 2100,
      depositZAR: 1000,
      features: 'Two Beds, Two Desks, Built-in Cupboards',
      imageType: 'sharing',
    },
  ]);

  const addRoomRow = () => {
    setRooms([
      ...rooms,
      {
        roomNumber: `Room ${rooms.length + 1}`,
        type: 'Single Room',
        monthlyRentZAR: 2600,
        depositZAR: 1000,
        features: 'Bed, Desk, Wardrobe',
        imageType: 'single',
      },
    ]);
  };

  const removeRoomRow = (index: number) => {
    if (rooms.length <= 1) return;
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    let targetLandlordId = selectedLandlordId;
    let targetLandlordInfo = landlords.find((l) => l.id === selectedLandlordId);
    let createdLandlord: LandlordAccount | undefined = undefined;

    if (landlordMode === 'new') {
      if (!landlordName || !landlordWhatsApp) return;
      const cleanWa = landlordWhatsApp.replace(/\D/g, '');
      const code = `${landlordName.split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;

      createdLandlord = {
        id: `landlord-${Date.now()}`,
        name: landlordName,
        phone: landlordPhone || `+27 ${cleanWa}`,
        whatsapp: cleanWa.startsWith('27') ? cleanWa : `27${cleanWa.replace(/^0/, '')}`,
        email: `${landlordName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        propertiesCount: 1,
        subscriptionStatus: subscriptionPaid ? 'active' : 'pending_payment',
        subscriptionPlan: newSubscriptionPlan,
        subscriptionExpires: subscriptionPaid ? '2026-11-30' : 'Awaiting Payment',
        monthlyFeeZAR: newSubscriptionPlan.includes('299') ? 299 : newSubscriptionPlan.includes('699') ? 699 : 149,
        accessGranted: subscriptionPaid,
        accessCode: code,
        verificationStatus: 'Verified (ID & Rates)',
        notes: subscriptionPaid ? 'Subscription paid on upload' : 'Pending payment of R149',
        registeredDate: 'October 2026',
      };
      targetLandlordId = createdLandlord.id;
      targetLandlordInfo = createdLandlord;
    }

    const propertyId = `prop-${Date.now()}`;

    const newProperty: Property = {
      id: propertyId,
      name,
      propertyType: 'Student Commune',
      isCommune: true,
      address,
      suburb,
      coordinates: {
        lat: -26.705,
        lng: 27.84,
        xPercent: 32 + Math.floor(Math.random() * 20),
        yPercent: 36 + Math.floor(Math.random() * 20),
      },
      primaryCampus,
      campusDistanceKm: Number(campusDistanceKm),
      walkingTimeMin: Number(walkingTimeMin),
      taxiRankDistanceKm: 1.2,
      nsfasAccredited,
      genderPolicy,
      amenities: [
        'High-Speed Wi-Fi',
        hasSolarBackup ? 'Solar Inverter Backup' : '',
        hasWaterBackup ? 'JoJo Backup Water Pump' : '',
        'Perimeter Electric Fencing',
        'Communal Kitchen',
        'Study Desks in all rooms',
      ].filter(Boolean),
      activities: [
        'Swimming Pool',
        'Pool Table (8-Ball)',
        'Communal Braai Area',
        'TV & Gaming Lounge',
      ],
      wifiDetails: {
        speed: '100Mbps Uncapped Fiber',
        uncapped: true,
        backupPower: hasSolarBackup,
        description: 'High-speed uncapped Wi-Fi with backup power during load shedding.',
      },
      images: [exteriorImg, singleRoomImg, sharingRoomImg],
      landlordId: targetLandlordId,
      landlord: {
        id: targetLandlordId,
        name: targetLandlordInfo?.name || landlordName || 'Verified Landlord',
        phone: targetLandlordInfo?.phone || landlordPhone || '+27 82 000 0000',
        whatsapp: targetLandlordInfo?.whatsapp || landlordWhatsApp.replace(/\D/g, '') || '27820000000',
        isVerified: true,
        verificationBadge: 'Verified Landlord · Platform Inspected',
        memberSince: 'October 2026',
        responseRate: '100%',
      },
      rating: 5.0,
      reviewCount: 1,
      description: description || `Neat and secure student residence situated in ${suburb}, just ${walkingTimeMin} minutes walking distance from ${primaryCampus}.`,
      hasSolarBackup,
      hasWaterBackup,
    };

    const newRooms: Room[] = rooms.map((r, idx) => {
      const isSharing = r.type.includes('Sharing');
      return {
        id: `room-${propertyId}-${idx + 1}`,
        propertyId,
        roomNumber: r.roomNumber,
        type: r.type,
        isSharing,
        monthlyRentZAR: Number(r.monthlyRentZAR),
        depositZAR: Number(r.depositZAR),
        status: 'available',
        lastConfirmedDate: 'Today (Uploaded by Admin)',
        lastConfirmedTimestamp: Date.now(),
        sharingDetails: isSharing
          ? `${r.type}: Students share bedroom, shared bathroom & commune kitchen`
          : 'Private lockable single room, shared bathroom & commune kitchen',
        hasBed: true,
        bedType: 'Single Bed & High-Density Mattress',
        hasStudyDesk: true,
        studyTableDetails: 'Dedicated study desk, task chair & reading lamp',
        sharedFacilities: ['Communal Fitted Kitchen', 'Shared Bathroom', 'Pool Table Games Lounge', 'Braai Lapa'],
        privateFacilities: ['Private Bed', 'Study Desk', 'Clothes Wardrobe'],
        features: r.features.split(',').map((s) => s.trim()).filter(Boolean),
        image: r.imageType === 'sharing' ? sharingRoomImg : singleRoomImg,
      };
    });

    onSave(newProperty, newRooms, createdLandlord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-0.5">
              <span>Operator Console</span>
              <span aria-hidden="true">·</span>
              <span>Listing Upload</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-600" />
              Upload Accommodation on Landlord's Behalf
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 text-xs">
          {/* Section 1: Landlord Assignment & Subscription */}
          <div className="space-y-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-amber-700" />
                1. Landlord Account & Subscription Status
              </h4>

              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLandlordMode('existing')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    landlordMode === 'existing'
                      ? 'bg-amber-400 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Existing Landlord
                </button>
                <button
                  type="button"
                  onClick={() => setLandlordMode('new')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    landlordMode === 'new'
                      ? 'bg-amber-400 text-slate-950 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + New Landlord
                </button>
              </div>
            </div>

            {landlordMode === 'existing' ? (
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Select Registered Landlord (Vaal Triangle)
                </label>
                <select
                  value={selectedLandlordId}
                  onChange={(e) => setSelectedLandlordId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {landlords.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.phone} ({l.subscriptionStatus === 'active' ? '✓ Subscription Paid' : '⚠️ Payment Pending'} · {l.subscriptionPlan})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Listing will be immediately connected to this landlord's portal code and WhatsApp.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Landlord Full Name</label>
                    <input
                      type="text"
                      required
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      placeholder="e.g. Sanele Hlatshwayo"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp (Direct Student Enquiries)</label>
                    <input
                      type="tel"
                      required
                      value={landlordWhatsApp}
                      onChange={(e) => setLandlordWhatsApp(e.target.value)}
                      placeholder="e.g. 082 555 1234"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subscription Tier</label>
                    <select
                      value={newSubscriptionPlan}
                      onChange={(e) => setNewSubscriptionPlan(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Standard Listing (R149/mo)">Standard Listing (R149 / mo)</option>
                      <option value="Featured Pro (R299/mo)">Featured Pro with Solar (R299 / mo)</option>
                      <option value="Semester Pass (R699/term)">Full Semester Pass (R699 / 6 mo)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={subscriptionPaid}
                        onChange={(e) => setSubscriptionPaid(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                      />
                      <span className="font-semibold text-slate-800">
                        Subscription Fee Paid (Grant Portal Access)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Property Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              2. Property Information (Vaal Triangle)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residence / House Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CW1 Executive Student Manor"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 18 Piet Retief Boulevard"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Suburb / Sector</label>
                <select
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="CW1, Vanderbijlpark">CW1, Vanderbijlpark</option>
                  <option value="CW2, Vanderbijlpark">CW2, Vanderbijlpark</option>
                  <option value="CW3, Vanderbijlpark">CW3, Vanderbijlpark</option>
                  <option value="SE1, Vanderbijlpark">SE1, Vanderbijlpark</option>
                  <option value="SE2, Vanderbijlpark">SE2, Vanderbijlpark</option>
                  <option value="Bedworth Park, Vanderbijlpark">Bedworth Park</option>
                  <option value="Vereeniging Central">Vereeniging Central</option>
                  <option value="Sebokeng Zone 10">Sebokeng Zone 10</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Campus</label>
                <select
                  value={primaryCampus}
                  onChange={(e) => setPrimaryCampus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="VUT">VUT (Vaal Tech)</option>
                  <option value="NWU Vaal">NWU Vaal Triangle</option>
                  <option value="Sedibeng TVET">Sedibeng TVET Vanderbijlpark</option>
                  <option value="Sedibeng TVET Ver">Sedibeng TVET Vereeniging</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Walking Time (Min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={walkingTimeMin}
                  onChange={(e) => setWalkingTimeMin(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={nsfasAccredited}
                  onChange={(e) => setNsfasAccredited(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                />
                <span>NSFAS Accredited</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={hasSolarBackup}
                  onChange={(e) => setHasSolarBackup(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Solar / Inverter Backup
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={hasWaterBackup}
                  onChange={(e) => setHasWaterBackup(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  JoJo Backup Water
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Room Inventory inside property */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  3. Individual Room Pricing & Vacancy
                </h4>
                <p className="text-[11px] text-slate-500">
                  Configure the rooms available at this property with individual ZAR rental rates.
                </p>
              </div>
              <button
                type="button"
                onClick={addRoomRow}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room</span>
              </button>
            </div>

            <div className="space-y-3">
              {rooms.map((rm, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Room #{idx + 1}</span>
                    {rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomRow(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Room Label</label>
                      <input
                        type="text"
                        value={rm.roomNumber}
                        onChange={(e) => {
                          const updated = [...rooms];
                          updated[idx].roomNumber = e.target.value;
                          setRooms(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Format</label>
                      <select
                        value={rm.type}
                        onChange={(e) => {
                          const updated = [...rooms];
                          updated[idx].type = e.target.value as any;
                          setRooms(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5"
                      >
                        <option value="Single Room">Single Room</option>
                        <option value="2-Sharing Room">2-Sharing Room</option>
                        <option value="3-Sharing Room">3-Sharing Room</option>
                        <option value="Bachelor Flat">Bachelor Flat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Monthly Rent (ZAR)</label>
                      <input
                        type="number"
                        step="50"
                        value={rm.monthlyRentZAR}
                        onChange={(e) => {
                          const updated = [...rooms];
                          updated[idx].monthlyRentZAR = Number(e.target.value);
                          setRooms(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deposit (ZAR)</label>
                      <input
                        type="number"
                        step="50"
                        value={rm.depositZAR}
                        onChange={(e) => {
                          const updated = [...rooms];
                          updated[idx].depositZAR = Number(e.target.value);
                          setRooms(updated);
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={rm.features}
                      onChange={(e) => {
                        const updated = [...rooms];
                        updated[idx].features = e.target.value;
                        setRooms(updated);
                      }}
                      placeholder="e.g. Single bed, study desk, lockable cupboard"
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Publish to Student Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

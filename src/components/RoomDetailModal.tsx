import React, { useState } from 'react';
import { Property, Room, Review, Enquiry } from '../types';
import {
  X,
  Footprints,
  ShieldCheck,
  Check,
  MessageSquare,
  Calendar,
  Phone,
  AlertTriangle,
  Star,
  Sun,
  Droplets,
  Wifi,
  Send,
  Bed,
  Sparkles,
  Users,
  Tv,
  CheckCircle2,
} from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  property: Property | null;
  reviews: Review[];
  onClose: () => void;
  onBookViewing: (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;
  onReportListing: (property: Property, room: Room) => void;
  onOpenInAppChat?: (room: Room, property: Property) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  property,
  reviews,
  onClose,
  onBookViewing,
  onReportListing,
  onOpenInAppChat,
}) => {
  if (!room || !property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showViewingForm, setShowViewingForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentInstitution, setStudentInstitution] = useState(property.primaryCampus);
  const [preferredViewingDate, setPreferredViewingDate] = useState('2026-02-23');
  const [preferredViewingTime, setPreferredViewingTime] = useState('14:00');
  const [preferredMoveDate, setPreferredMoveDate] = useState('2026-03-01');
  const [customMessage, setCustomMessage] = useState(
    `Hi ${property.landlord.name}, I am interested in viewing ${room.roomNumber} (${room.type}) at ${property.name}. Is it still available?`
  );
  const [submittedBooking, setSubmittedBooking] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [room.image];
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);
  const isSharing = room.isSharing || room.type.includes('Sharing');

  // Pre-generate authentic WhatsApp message URL (Direct to Landlord)
  const waText = encodeURIComponent(
    `Hello ${property.landlord.name}, I saw your listing "${property.name} - ${room.roomNumber}" (${room.type}) on StudentStay. Monthly rent is R${room.monthlyRentZAR}. Is this room still available for viewing?`
  );
  const whatsappUrl = `https://wa.me/${property.landlord.whatsapp}?text=${waText}`;

  const handleSubmitViewing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) return;

    onBookViewing({
      propertyId: property.id,
      roomId: room.id,
      studentName,
      studentPhone,
      studentEmail: studentEmail || `${studentName.toLowerCase().replace(/\s+/g, '')}@student.ac.za`,
      institution: studentInstitution,
      message: customMessage,
      preferredMoveDate,
      preferredViewingDate: `${preferredViewingDate} at ${preferredViewingTime}`,
    });

    setSubmittedBooking(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Sticky Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{property.name}</span>
            <span aria-hidden="true">·</span>
            <span>{room.roomNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">
              Confirmed {room.lastConfirmedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReportListing(property, room)}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report Listing</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Gallery & Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={images[activeImageIndex] || room.image}
                  alt={property.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
                  <span>{room.type}</span>
                  {property.isCommune && (
                    <span className="text-amber-400 font-bold">· Commune</span>
                  )}
                </div>
                {room.status === 'available' ? (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs">
                    Available For Lease
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-xs">
                    Room Taken
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-amber-500 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Campus Walking & Transit Callout */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-3">
                <Footprints className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900">
                    Commute to {property.primaryCampus}
                  </div>
                  <p className="mt-0.5 text-amber-800">
                    {property.walkingTimeMin} min safe walk ({property.campusDistanceKm} km) · {property.taxiRankDistanceKm} km from nearest local taxi pick-up point.
                  </p>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase & Landlord Contact Module */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div>
                <div className="text-xs text-slate-500 font-medium">Monthly Rental Rate</div>
                <div className="text-3xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                  R {room.monthlyRentZAR.toLocaleString('en-ZA')}
                  <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
                </div>

                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Accommodation Type</span>
                    <span className="font-semibold text-slate-800">
                      {property.isCommune ? 'Student Commune' : property.propertyType || 'Apartment'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Room Format</span>
                    <span className="font-semibold text-slate-800">
                      {isSharing ? 'Sharing Room' : 'Single Room (Private)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Security Deposit</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {room.depositZAR > 0 ? `R ${room.depositZAR.toLocaleString('en-ZA')}` : 'No Deposit Required'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>NSFAS Accreditation</span>
                    <span className={`font-semibold ${property.nsfasAccredited ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {property.nsfasAccredited ? 'Approved & Accredited' : 'Private Direct Lease'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Gender Policy</span>
                    <span className="font-semibold text-slate-800">{property.genderPolicy}</span>
                  </div>
                </div>

                {/* Landlord Card */}
                <div className="mt-4 bg-white rounded-lg p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Listed By Landlord</div>
                      <div className="text-sm font-bold text-slate-900">{property.landlord.name}</div>
                    </div>
                    {property.landlord.isVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex flex-col gap-0.5">
                    <span>{property.landlord.verificationBadge}</span>
                    <span>Response Rate: {property.landlord.responseRate}</span>
                  </div>
                </div>
              </div>

              {/* DUAL COMMUNICATION ACTIONS (In-App Chat OR Direct to Landlord) */}
              <div className="mt-5 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Contact & Communication Options:
                </div>

                {/* Option 1: Communicate Through App */}
                {onOpenInAppChat && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenInAppChat(room, property);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Communicate Through the App</span>
                  </button>
                )}

                {/* Option 2: Direct to Landlord via WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Direct to Landlord on WhatsApp</span>
                </a>

                {/* Option 3: Schedule Viewing */}
                <button
                  type="button"
                  onClick={() => setShowViewingForm(!showViewingForm)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{showViewingForm ? 'Hide Viewing Form' : 'Schedule In-Person Viewing'}</span>
                </button>

                <p className="text-[10px] text-center text-slate-500">
                  ⚠️ Never pay deposit funds before viewing the actual room with the landlord.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: COMMUNE & SHARING BREAKDOWN (Explicit details) */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>
                  {property.isCommune ? 'Student Commune Living & Sharing Structure' : 'Living Layout & Sharing Details'}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {room.sharingDetails ||
                  (isSharing
                    ? '2 or more students share bedroom with separate beds. Kitchen and bathroom are shared.'
                    : 'Private bedroom with own door key. Bathroom and communal kitchen are shared with housemates.')}
              </p>

              {/* Two columns: What is Private vs What is Shared */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-200/80 text-xs">
                {/* Column 1: Private to This Room */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Private To Your Room:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {(room.privateFacilities || [
                      'Private Bed & Mattress',
                      'Dedicated Study Table & Chair',
                      'Personal Clothes Wardrobe',
                      'Private Room Key & Lock',
                    ]).map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: What is Shared */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Shared With Fellow Students:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    {(room.sharedFacilities || [
                      'Communal Kitchen (stove, fridge, microwave)',
                      'Bathroom Facilities',
                      'Commune Social Lounge',
                      'Braai & Relaxation Area',
                    ]).map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: SPECIFIC WIFI, BED & STUDY TABLE SPECS */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Furnishings, Study Setup & Connectivity</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wi-Fi Details Card */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span>Wi-Fi & Internet Specification</span>
                </div>
                <div className="font-mono text-xs font-bold text-emerald-950">
                  Speed: {property.wifiDetails?.speed || '100Mbps Uncapped Fiber'}
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {property.wifiDetails?.description ||
                    'High-speed uncapped Wi-Fi available throughout the house. Battery/solar backup maintains router power during load shedding.'}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {property.wifiDetails?.backupPower ? 'Load Shedding Protected Wi-Fi' : 'Standard Wi-Fi Setup'}
                  </span>
                </div>
              </div>

              {/* Bed & Study Table Card */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Bed className="w-4 h-4 text-amber-700" />
                  <span>Bed & Study Table Included</span>
                </div>
                <div className="space-y-1 text-slate-700 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900">Bed Setup: </span>
                    <span>{room.bedType || 'Single Bed with High-Density Foam Mattress'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Study Table: </span>
                    <span>
                      {room.studyTableDetails ||
                        'Dedicated wooden study table with ergonomic task chair, double power strip & desk lamp'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ready for laptop, textbooks, and studying</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: ACCOMMODATION ACTIVITIES & RECREATION (Swimming Pool, Pool Table, etc.) */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Activities & Recreation in This Accommodation</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">Free for all tenants</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(property.activities && property.activities.length > 0
                ? property.activities
                : [
                    'Swimming Pool',
                    'Pool Table (8-Ball Billiards)',
                    'Communal Braai Area',
                    'DSTV & Netflix Student Lounge',
                    'Quiet Study Hall',
                  ]
              ).map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-800 font-semibold"
                >
                  <span className="text-lg">
                    {act.includes('Swimming Pool')
                      ? '🏊'
                      : act.includes('Pool Table')
                      ? '🎱'
                      : act.includes('Braai')
                      ? '🍖'
                      : act.includes('Tennis')
                      ? '🏓'
                      : act.includes('Lounge') || act.includes('TV')
                      ? '📺'
                      : act.includes('Study')
                      ? '📚'
                      : '✨'}
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive In-Person Viewing Form (when triggered) */}
          {showViewingForm && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 transition-all">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Schedule Room Viewing for {room.roomNumber}
              </h4>

              {submittedBooking ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Viewing Request Sent to {property.landlord.name}!
                  </div>
                  <p className="mt-1">
                    Your appointment has been registered on the landlord portal for{' '}
                    <strong>{preferredViewingDate} at {preferredViewingTime}</strong>. The landlord will confirm via WhatsApp or SMS at <strong>{studentPhone}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitViewing} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Sanele Khumalo"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="e.g. 076 123 4567"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Institution</label>
                      <select
                        value={studentInstitution}
                        onChange={(e) => setStudentInstitution(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="VUT">VUT (Vaal Tech)</option>
                        <option value="NWU Vaal">NWU Vaal Triangle</option>
                        <option value="Sedibeng TVET">Sedibeng TVET College</option>
                        <option value="Other">Other / Prospective Student</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={preferredViewingDate}
                        onChange={(e) => setPreferredViewingDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                      <select
                        value={preferredViewingTime}
                        onChange={(e) => setPreferredViewingTime(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="10:00">10:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Note to Landlord</label>
                    <textarea
                      rows={2}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowViewingForm(false)}
                      className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Viewing Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Description */}
          <div className="border-t border-slate-200 pt-5">
            <h4 className="font-bold text-slate-900 mb-1.5 text-sm">About This Residence</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Student Reviews Section */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Student Reviews</span>
                <span className="text-xs font-semibold text-slate-500">({propertyReviews.length})</span>
              </h4>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.rating} / 5</span>
              </div>
            </div>

            {propertyReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet for this listing. Be the first student to review after viewing!</p>
            ) : (
              <div className="space-y-3">
                {propertyReviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900">{rev.studentName}</div>
                      <div className="text-[11px] text-slate-400">{rev.date}</div>
                    </div>
                    <div className="text-[11px] text-slate-500 mb-1.5">
                      {rev.institution} · {rev.roomType} ({rev.stayPeriod})
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected by StudentStay Zero-Scam Verification</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

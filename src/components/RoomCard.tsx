import React from 'react';
import { Property, Room } from '../types';
import {
  MessageSquare,
  Footprints,
  ShieldCheck,
  Sun,
  Droplets,
  Check,
  Clock,
  Eye,
  Phone,
  Wifi,
  Bed,
  Sparkles,
  Users,
  Bus,
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
  property: Property;
  onSelectRoom: (room: Room, property: Property) => void;
  onQuickWhatsApp: (room: Room, property: Property) => void;
  onOpenInAppChat?: (room: Room, property: Property) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  property,
  onSelectRoom,
  onQuickWhatsApp,
  onOpenInAppChat,
}) => {
  const isAvailable = room.status === 'available';
  const isSharing = room.isSharing || room.type.includes('Sharing');

  // Filter top social activities to highlight
  const topActivities = (property.activities || []).slice(0, 3);

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
      {/* Product Image Slot */}
      <div
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onSelectRoom(room, property)}
      >
        <img
          src={room.image || property.images[0]}
          alt={`${property.name} - ${room.roomNumber}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Status Label */}
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs ${
              isAvailable
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isAvailable ? 'Available Now' : 'Room Taken'}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {property.transportToSchool?.hasTransport && property.transportToSchool.isDistanceRes && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-600/90 text-white shadow-xs backdrop-blur-xs flex items-center gap-1">
                <Bus className="w-2.5 h-2.5" />
                <span>Free Shuttle</span>
              </span>
            )}
            {property.isCommune && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 shadow-xs backdrop-blur-xs">
                Commune
              </span>
            )}
            {property.nsfasAccredited && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950/85 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-xs">
                NSFAS
              </span>
            )}
          </div>
        </div>

        {/* Bottom subtle gradient bar showing freshness */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/75 to-transparent p-2.5 pt-6 flex items-center justify-between text-[11px] text-slate-200">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Confirmed {room.lastConfirmedDate}</span>
          </span>
          <span className="font-medium text-white/90">
            {property.suburb}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Living Style & Campus Proximity */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 flex-wrap">
            <span className="font-bold text-slate-800">{room.type}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">{property.propertyType || 'Commune'}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            {property.transportToSchool?.isDistanceRes ? (
              <span className="flex items-center gap-1 text-sky-700 font-medium bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                <Bus className="w-3 h-3 text-sky-600" />
                <span>{property.transportToSchool.travelTimeMin}m ride ({property.campusDistanceKm}km to {property.primaryCampus})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-600">
                <Footprints className="w-3 h-3 text-amber-600" />
                <span>{property.walkingTimeMin} min walk to {property.primaryCampus}</span>
              </span>
            )}
          </div>

          {/* Property Name & Room Title */}
          <h3
            onClick={() => onSelectRoom(room, property)}
            className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
          >
            {property.name}
          </h3>

          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {room.roomNumber} · {property.address}
          </p>

          {/* Transportation to School Banner (Specially when distant from res to school) */}
          {property.transportToSchool && (
            <div className={`mt-2 p-2 rounded-lg border text-[11px] ${
              property.transportToSchool.isDistanceRes
                ? 'bg-sky-50/80 border-sky-200/80 text-sky-950'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}>
              <div className="flex items-start gap-1.5">
                <Bus className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                  property.transportToSchool.isDistanceRes ? 'text-sky-600' : 'text-slate-500'
                }`} />
                <div className="line-clamp-2">
                  <span className="font-bold">
                    {property.transportToSchool.isDistanceRes ? '🚌 Transport to School Included: ' : '🚶 Walking Proximity: '}
                  </span>
                  <span>{property.transportToSchool.shuttleSchedule}</span>
                </div>
              </div>
            </div>
          )}

          {/* Explicit Sharing Breakdown Box */}
          <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px]">
            <div className="flex items-start gap-1.5 text-slate-700">
              <Users className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="line-clamp-2">
                {room.sharingDetails ? (
                  <span>{room.sharingDetails}</span>
                ) : isSharing ? (
                  <span>
                    <strong>Sharing Room:</strong> Students share bedroom, bathroom, and communal kitchen.
                  </span>
                ) : (
                  <span>
                    <strong>Private Room:</strong> Private bedroom with lockable key. Shared bathroom & commune kitchen.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Wi-Fi & Bed/Study Table Specs Row */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700 bg-emerald-50/60 border border-emerald-100 rounded px-2 py-1">
              <Wifi className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">{property.wifiDetails?.speed || '100Mbps Wi-Fi'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 bg-amber-50/60 border border-amber-100 rounded px-2 py-1">
              <Bed className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate font-medium">{room.bedType ? 'Bed & Study Table' : 'Furnished Bed & Desk'}</span>
            </div>
          </div>

          {/* Accommodation Activities (Pool table, swimming pool, braai) */}
          {topActivities.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Activities:
              </span>
              {topActivities.map((act, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium"
                >
                  {act.includes('Swimming Pool') ? '🏊 Pool' : act.includes('Pool Table') ? '🎱 Pool Table' : act.includes('Braai') ? '🍖 Braai Lapa' : act.includes('Tennis') ? '🏓 Table Tennis' : act}
                </span>
              ))}
            </div>
          )}

          {/* Key Utilities row */}
          <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-600">
            {property.hasSolarBackup && (
              <span className="flex items-center gap-1 text-slate-700" title="Solar & Inverter Backup for Load Shedding">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Solar Backup</span>
              </span>
            )}
            {property.hasWaterBackup && (
              <span className="flex items-center gap-1 text-slate-700" title="JoJo Water Backup System">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>JoJo Tank</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{property.landlord.isVerified ? 'Verified Landlord' : 'Direct'}</span>
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Monthly Rent</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums leading-tight">
              R {room.monthlyRentZAR.toLocaleString('en-ZA')}
              <span className="text-xs font-normal text-slate-500 ml-0.5">/mo</span>
            </div>
            {room.depositZAR > 0 ? (
              <div className="text-[10px] text-slate-400">
                Deposit: R {room.depositZAR.toLocaleString('en-ZA')}
              </div>
            ) : (
              <div className="text-[10px] text-emerald-600 font-semibold">No Deposit</div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Communicate through App button */}
            {onOpenInAppChat && (
              <button
                type="button"
                onClick={() => onOpenInAppChat(room, property)}
                title="Communicate through the app"
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Chat in App</span>
              </button>
            )}

            {/* Direct WhatsApp to landlord */}
            <button
              type="button"
              onClick={() => onQuickWhatsApp(room, property)}
              title="Takes you directly to landlord on WhatsApp"
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* View Details */}
            <button
              type="button"
              onClick={() => onSelectRoom(room, property)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

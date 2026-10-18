import React, { useState } from 'react';
import { Property, Room, Institution } from '../types';
import {
  MapPin,
  Footprints,
  Navigation,
  School,
  Building,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Layers,
  Info,
} from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  rooms: Room[];
  institutions: Institution[];
  onSelectRoom: (room: Room, property: Property) => void;
  onQuickWhatsApp: (room: Room, property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  rooms,
  institutions,
  onSelectRoom,
  onQuickWhatsApp,
}) => {
  const [selectedCampusFocus, setSelectedCampusFocus] = useState<string>('all');
  const [activePropertyId, setActivePropertyId] = useState<string | null>(properties[0]?.id || null);
  const [showTransitRings, setShowTransitRings] = useState<boolean>(true);

  const activeProperty = properties.find((p) => p.id === activePropertyId) || properties[0];
  const activePropertyRooms = activeProperty ? rooms.filter((r) => r.propertyId === activeProperty.id) : [];
  const availableRoomsCount = activePropertyRooms.filter((r) => r.status === 'available').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Control Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-600" />
            Vaal Triangle Student Proximity Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize walking routes between residences and VUT, NWU Vaal, or Sedibeng TVET campuses.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <School className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={selectedCampusFocus}
              onChange={(e) => setSelectedCampusFocus(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">View All Vaal Campuses</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.shortName}>
                  Focus on {inst.shortName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowTransitRings(!showTransitRings)}
            className={`px-3 py-1.5 border rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              showTransitRings
                ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Walking Rings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Interactive Visual Map Area (Col 8) */}
        <div className="lg:col-span-8 relative bg-slate-900 overflow-hidden select-none flex items-center justify-center min-h-[420px] lg:min-h-[580px]">
          {/* Subtle Grid / Cartography Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

          {/* Vaal River Curvature Representation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Vaal River line */}
            <path
              d="M 0,480 Q 250,560 500,430 T 1000,500"
              fill="none"
              stroke="#0284c7"
              strokeWidth="24"
              strokeOpacity="0.3"
            />
            <path
              d="M 0,480 Q 250,560 500,430 T 1000,500"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="8"
              strokeOpacity="0.4"
            />
            <text x="560" y="470" fill="#7dd3fc" fontSize="11" fontFamily="sans-serif" opacity="0.7">
              ~ Vaal River ~
            </text>

            {/* Walking distance rings from VUT (36%, 44%) */}
            {showTransitRings && (
              <>
                <circle
                  cx="36%"
                  cy="44%"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.35"
                />
                <circle
                  cx="36%"
                  cy="44%"
                  r="130"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.2"
                />
                <text x="36%" y="30%" fill="#fbbf24" fontSize="10" opacity="0.6">
                  800m Walk Zone
                </text>
              </>
            )}

            {/* Connecting dashed line from active property to its campus */}
            {activeProperty && (
              <line
                x1={`${activeProperty.coordinates.xPercent}%`}
                y1={`${activeProperty.coordinates.yPercent}%`}
                x2="36%"
                y2="44%"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            )}
          </svg>

          {/* Suburb Name Watermarks */}
          <div className="absolute top-6 left-8 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
            Bedworth Park
          </div>
          <div className="absolute top-28 left-20 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
            CW1 · Vanderbijlpark
          </div>
          <div className="absolute bottom-28 left-44 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
            SE1 · River Sector
          </div>
          <div className="absolute top-12 right-12 text-[11px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
            Vereeniging Central
          </div>

          {/* Campus Landmarks */}
          {institutions.map((inst) => {
            const isHighlighted = selectedCampusFocus === 'all' || selectedCampusFocus === inst.shortName;
            return (
              <div
                key={inst.id}
                style={{
                  left: `${inst.coordinates.xPercent}%`,
                  top: `${inst.coordinates.yPercent}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity ${
                  isHighlighted ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg ring-4 ring-amber-400/30">
                    <School className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-amber-500/30">
                    {inst.shortName} Campus
                  </div>
                </div>
              </div>
            );
          })}

          {/* Student Accommodation Pins */}
          {properties.map((prop) => {
            const propRooms = rooms.filter((r) => r.propertyId === prop.id);
            const hasAvailable = propRooms.some((r) => r.status === 'available');
            const isSelected = activeProperty?.id === prop.id;
            const matchesCampus = selectedCampusFocus === 'all' || prop.primaryCampus === selectedCampusFocus;

            return (
              <div
                key={prop.id}
                style={{
                  left: `${prop.coordinates.xPercent}%`,
                  top: `${prop.coordinates.yPercent}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-200 cursor-pointer ${
                  matchesCampus ? 'opacity-100' : 'opacity-30'
                }`}
                onClick={() => setActivePropertyId(prop.id)}
              >
                <div className="relative group">
                  {/* Pin container */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shadow-xl transition-all border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-200 scale-110 ring-4 ring-amber-400/40 font-bold'
                        : hasAvailable
                        ? 'bg-slate-900 text-white border-slate-700 hover:scale-105'
                        : 'bg-rose-950 text-rose-200 border-rose-800 opacity-80'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        hasAvailable ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-[11px] whitespace-nowrap">
                      {prop.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">
                      R{propRooms[0]?.monthlyRentZAR ? `${Math.round(propRooms[0].monthlyRentZAR / 1000)}k` : ''}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-950/95 text-white p-2.5 rounded-lg text-xs shadow-xl pointer-events-none z-40 border border-slate-800">
                    <div className="font-bold text-amber-300">{prop.name}</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {prop.walkingTimeMin} min walk to {prop.primaryCampus}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                      {hasAvailable ? 'Available Rooms' : 'Fully Booked'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md rounded-lg p-3 text-[11px] text-slate-300 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[8px]">
                U
              </div>
              <span>Higher Ed Campus (VUT / NWU / TVET)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Available Student Accommodation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>Fully Taken Property</span>
            </div>
          </div>
        </div>

        {/* Selected Property Sidebar Details (Col 4) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
          {activeProperty ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{activeProperty.suburb}</span>
                <span className="font-semibold text-emerald-700">
                  {availableRoomsCount} Available Room{availableRoomsCount !== 1 ? 's' : ''}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {activeProperty.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{activeProperty.address}</p>

              {/* Transit callout */}
              <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
                <Footprints className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-semibold">{activeProperty.walkingTimeMin} min walking</span>
                  <span className="text-slate-500"> ({activeProperty.campusDistanceKm} km) to {activeProperty.primaryCampus}</span>
                </div>
              </div>

              {/* Property Image preview */}
              <div className="mt-3.5 relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={activeProperty.images[0]}
                  alt={activeProperty.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Room list inside selected property */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Rooms at this Residence ({activePropertyRooms.length})
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activePropertyRooms.map((rm) => (
                    <div
                      key={rm.id}
                      className="p-2.5 bg-slate-50 hover:bg-amber-50/50 rounded-lg border border-slate-200 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{rm.type}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          R {rm.monthlyRentZAR.toLocaleString('en-ZA')} / mo
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onQuickWhatsApp(rm, activeProperty)}
                          title="WhatsApp Landlord"
                          className="p-1.5 bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectRoom(rm, activeProperty)}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Click any residence pin on the Vaal map to inspect rooms.
            </div>
          )}

          {/* Safety hint footer */}
          <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Map markers show verified student routes in Vanderbijlpark and Vereeniging.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

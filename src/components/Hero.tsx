import React from 'react';
import { Search, MapPin, CheckCircle2, ShieldCheck, Sun, Zap, Wifi, SlidersHorizontal, Bus } from 'lucide-react';
import { Institution } from '../types';
import heroImg from '../assets/images/hero_studentstay_vaal_1792174484494.jpg';

interface HeroProps {
  institutions: Institution[];
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  selectedRoomType: string;
  setSelectedRoomType: (type: string) => void;
  maxBudget: number;
  setMaxBudget: (budget: number) => void;
  nsfasOnly: boolean;
  setNsfasOnly: (val: boolean) => void;
  solarOnly: boolean;
  setSolarOnly: (val: boolean) => void;
  transportOnly?: boolean;
  setTransportOnly?: (val: boolean) => void;
  onExploreClick: () => void;
  totalRoomsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  institutions,
  selectedCampus,
  setSelectedCampus,
  selectedRoomType,
  setSelectedRoomType,
  maxBudget,
  setMaxBudget,
  nsfasOnly,
  setNsfasOnly,
  solarOnly,
  setSolarOnly,
  transportOnly = false,
  setTransportOnly,
  onExploreClick,
  totalRoomsCount,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-8 pb-12 lg:pt-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Search Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">
              <span>South African Student Accommodation</span>
              <span aria-hidden="true">·</span>
              <span>Vaal Triangle Pilot</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
              Find verified student rooms near VUT, NWU & Sedibeng TVET.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-balance">
              Compare actual monthly rent in Rand, walking distances to campus gates, and solar backup status. Connect directly with confirmed landlords via WhatsApp without middleman fees.
            </p>

            {/* Practical Quick Filter Box */}
            <div className="mt-7 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Campus Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Target Campus
                  </label>
                  <select
                    value={selectedCampus}
                    onChange={(e) => setSelectedCampus(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                  >
                    <option value="All">All Vaal Campuses</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.shortName}>
                        {inst.shortName} · {inst.campusName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                    Room Format
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs"
                  >
                    <option value="All">Any Room Type</option>
                    <option value="Single Room">Single Room (Private)</option>
                    <option value="2-Sharing Room">2-Sharing Room</option>
                    <option value="3-Sharing Room">3-Sharing Room</option>
                    <option value="Bachelor Flat">Bachelor Flat / Studio</option>
                  </select>
                </div>
              </div>

              {/* Price & Essential Checks */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-700 mb-1">
                    <span>Max Monthly Rent:</span>
                    <span className="font-mono text-sm text-amber-700 font-bold tabular-nums">
                      R {maxBudget.toLocaleString('en-ZA')} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="5000"
                    step="100"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full sm:w-56 accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={nsfasOnly}
                      onChange={(e) => setNsfasOnly(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">NSFAS Accredited</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={solarOnly}
                      onChange={(e) => setSolarOnly(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">Solar Backup</span>
                  </label>

                  {setTransportOnly && (
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sky-700">
                      <input
                        type="checkbox"
                        checked={transportOnly}
                        onChange={(e) => setTransportOnly(e.target.checked)}
                        className="rounded text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
                      />
                      <span className="font-semibold flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-sky-600" />
                        Campus Shuttle / Transport
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800 font-semibold">{totalRoomsCount}</strong> available student listings
                </span>
                <button
                  onClick={onExploreClick}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Search Rooms</span>
                </button>
              </div>
            </div>

            {/* Trust Markers Adjacent to Form */}
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                No scam deposits
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Walking distance to campus
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-sky-800 font-medium">
                <Bus className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                Free campus shuttles for distant res
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Live landlord WhatsApp chats
              </span>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image & Live Campus Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 group">
              <img
                src={heroImg}
                alt="StudentStay accommodation campus in Vanderbijlpark, Vaal Triangle"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Grounded Information Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="flex items-center justify-between text-xs font-medium text-amber-300 mb-1">
                  <span>CW1 · Vanderbijlpark</span>
                  <span>7 min walk to VUT Main Gate</span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Acacia Student Residence
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-200 border-t border-white/20 pt-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Solar backup</span>
                    <span aria-hidden="true">·</span>
                    <Wifi className="w-3.5 h-3.5 text-blue-300" />
                    <span>Uncapped 100Mbps</span>
                  </div>
                  <span className="font-mono font-bold text-sm text-white">
                    From R 2,150 / mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof Metric Strip Below Hero */}
        <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-500 font-medium">Vaal Coverage</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              3 Institutions
            </div>
            <div className="text-xs text-slate-600 mt-0.5">VUT, NWU & Sedibeng TVET</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Average Proximity</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              8–14 Min Walk
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Safe student transit routes</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Monthly Rent Range</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              R1,750 – R3,900
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Sharing to private bachelor flats</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Availability Guarantee</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              Verified & Fresh
            </div>
            <div className="text-xs text-slate-600 mt-0.5">Landlords confirm status weekly</div>
          </div>
        </div>
      </div>
    </section>
  );
};

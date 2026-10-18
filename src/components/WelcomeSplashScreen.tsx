import React, { useState, useEffect } from 'react';
import {
  Home,
  CheckCircle2,
  Sparkles,
  Wifi,
  Bed,
  ArrowRight,
  ShieldCheck,
  Footprints,
  Phone,
  MessageSquare,
  Users,
  Sun,
  X,
  Bus,
} from 'lucide-react';
import studentEnteringImg from '../assets/images/student_entering_house_1792341790483.jpg';
import { BrandLogo } from './BrandLogo';

interface WelcomeSplashScreenProps {
  onEnter: () => void;
  availableRoomsCount: number;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  onEnter,
  availableRoomsCount,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-progress bar over 4.5 seconds unless paused or dismissed
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onEnter();
          return 100;
        }
        return prev + 2;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [isPaused, onEnter]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Visual Image Side (Student Entering Accommodation) */}
        <div className="relative md:w-1/2 min-h-[280px] sm:min-h-[360px] md:min-h-[500px] overflow-hidden group">
          <img
            src={studentEnteringImg}
            alt="Student entering modern accommodation house in the Vaal"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />

          {/* Floating Live Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{availableRoomsCount} Verified Beds Available Now</span>
          </div>

          {/* Student Welcome Overlay Note */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl text-xs text-white shadow-xl">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
              <Sparkles className="w-4 h-4" />
              <span>Sunset Lodge & Vaal Communes</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Modern student residences with solar backup, study tables, uncapped Wi-Fi, and swimming pools.
            </p>
          </div>
        </div>

        {/* Text & Action Side */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-slate-900 text-white space-y-6">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <BrandLogo size="md" variant="dark" showBadge={true} />

              <button
                onClick={onEnter}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                title="Skip intro directly to directory"
              >
                <span>Skip</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Headline */}
            <div className="mt-5 space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Student Accommodation</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Step Inside Your New Student Home
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse student communes, single bedrooms, and sharing accommodations in <strong>Vanderbijlpark &amp; Vereeniging</strong>. Safe walking distance or <strong>Free Campus Shuttles</strong> to <strong>VUT, NWU Vaal</strong>, and <strong>Sedibeng TVET</strong>.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-5 text-xs">
              <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-100 text-[11px]">Communes &amp; Sharing</div>
                  <div className="text-[10px] text-slate-400">Clear breakdown of what is private vs shared</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex items-start gap-2">
                <Bus className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-100 text-[11px]">Campus Transportation</div>
                  <div className="text-[10px] text-slate-400">Free daily shuttles for distant accommodations</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex items-start gap-2">
                <Wifi className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-100 text-[11px]">100Mbps Wi-Fi &amp; Solar</div>
                  <div className="text-[10px] text-slate-400">Study uninterrupted through load shedding</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-100 text-[11px]">Pools &amp; Pool Tables</div>
                  <div className="text-[10px] text-slate-400">Active student life, braai lapas &amp; lounges</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions & Progress Bar */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Auto progress line */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{isPaused ? 'Auto-entry paused' : 'Entering StudentStay...'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onEnter}
                className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Enter &amp; Browse Accommodations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Direct WhatsApp to Landlords</span>
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span>In-App Messaging</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import creativeLogoImg from '../assets/images/creative_studentstay_logo_1792342636525.jpg';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  showBadge?: boolean;
  useImageEmblem?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  showBadge = false,
  useImageEmblem = true,
  className = '',
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[10px]', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs', badge: 'text-xs px-2.5 py-0.5' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-sm', badge: 'text-xs px-3 py-1' },
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Creative Attractive Emblem Icon */}
      <div className="relative shrink-0">
        {useImageEmblem ? (
          <div
            className={`${dimensions.icon} rounded-xl overflow-hidden shadow-md ring-2 ring-amber-400/40 group-hover:ring-amber-500 group-hover:shadow-amber-500/25 transition-all duration-300 bg-white p-0.5 flex items-center justify-center`}
          >
            <img
              src={creativeLogoImg}
              alt="StudentStay South Africa Logo"
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          /* Bespoke SVG Emblem */
          <div
            className={`${dimensions.icon} rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1.5 shadow-md ring-2 ring-amber-400/30 flex items-center justify-center text-slate-950 group-hover:scale-105 transition-transform duration-300`}
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Sun rays */}
              <circle cx="50" cy="40" r="22" fill="#FDE047" opacity="0.95" />
              <path d="M50 8v8M50 64v8M18 40h8M74 40h8M27 17l6 6M67 57l6 6M27 63l6-6M67 23l6-6" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              {/* Graduation Cap Mortarboard Roof */}
              <path
                d="M50 20L18 36L50 52L82 36L50 20Z"
                fill="#1E293B"
                className="drop-shadow-sm"
              />
              <path d="M78 39v18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="78" cy="59" r="2.5" fill="#F59E0B" />
              {/* House walls & welcoming arched doorway */}
              <path
                d="M30 46v36h40V46"
                stroke="#D97706"
                strokeWidth="5"
                strokeLinecap="round"
                fill="#FBBF24"
              />
              <path
                d="M44 82V62a6 6 0 0 1 12 0v20"
                fill="#1E293B"
              />
            </svg>
          </div>
        )}

        {/* Ambient subtle glow */}
        <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-40 blur-xs transition-opacity duration-300 -z-10" />
      </div>

      {/* Modern Wordmark Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight leading-none transition-colors whitespace-nowrap ${dimensions.text} ${
              isDark
                ? 'text-white group-hover:text-amber-400'
                : 'text-slate-900 group-hover:text-amber-600'
            }`}
          >
            Student<span className="text-amber-500 font-extrabold">Stay</span>
          </span>

          {showBadge && (
            <span
              className={`rounded-full font-bold uppercase tracking-wider whitespace-nowrap bg-amber-100 text-amber-900 border border-amber-300/80 ${dimensions.badge}`}
            >
              Vaal SA
            </span>
          )}
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-semibold tracking-wider uppercase whitespace-nowrap ${dimensions.sub} ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Vaal Student Living Network
            </span>
            <span
              className={`w-1 h-1 rounded-full ${
                isDark ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`font-medium ${dimensions.sub} ${
                isDark ? 'text-amber-400/90' : 'text-emerald-700'
              }`}
            >
              Verified
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

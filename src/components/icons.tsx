/** Set ikon SVG (pengganti emoji untuk UI inti; jsPDF tak merender emoji). */
import React from "react";

type P = { size?: number; className?: string; filled?: boolean; strokeWidth?: number };

function S({ size = 20, className = "", children, fill = "none", stroke = "currentColor", viewBox = "0 0 24 24", strokeWidth = 2 }: P & { children: React.ReactNode; fill?: string; stroke?: string; viewBox?: string }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

export const IconStar = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.4l-5.8 3.05 1.1-6.45-4.7-4.6 6.5-.95z" />
  </S>
);

export const IconCoin = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="1.8" />
  </S>
);

export const IconFlame = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <path d="M12 2c1 3-1.5 4.5-1.5 6.5A2.5 2.5 0 0 0 13 11c1-1 1.2-2 1-3 .8 1 1.3 2 1.3 3A4.3 4.3 0 0 1 11 15.3 4.5 4.5 0 0 1 6.5 11C6.5 8 8 6 9.5 4.5 9 6 8.7 7 9 8c-.5-.5-.6-1-.5-1.5C9.5 5 11 4 12 2z" />
  </S>
);

export const IconHome = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </S>
);

export const IconBook = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-2z" />
    <path d="M4 5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 1-2-2z" opacity="0" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </S>
);

export const IconGame = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <rect x="2" y="8" width="20" height="9" rx="4" />
    <path d="M7 11v3M5.5 12.5h3" />
    <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" />
    <circle cx="18" cy="13.5" r="0.5" fill="currentColor" />
  </S>
);

export const IconChart = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M3 3v18h18" />
    <path d="M7 15l3-4 3 2 4-6" />
  </S>
);

export const IconGear = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
  </S>
);

export const IconBack = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M15 5l-7 7 7 7" />
  </S>
);

export const IconCheck = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M4 12.5l5 5L20 6.5" />
  </S>
);

export const IconX = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);

export const IconLock = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </S>
);

export const IconTrophy = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
    <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M12 17c-2 0-3 1-3 1.5s1 1.5 3 1.5 3-.5 3-1.5S14 17 12 17z" />
  </S>
);

export const IconSticker = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M4 4h12l4 4v12H4z" />
    <path d="M16 4v4h4" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </S>
);

export const IconShop = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M3 9l2-5h14l2 5M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M8 13a4 4 0 0 0 8 0" />
  </S>
);

export const IconQuestion = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.2-1.5 2.5" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </S>
);

export const IconRefresh = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M4 4v6h6M20 20v-6h-6" />
    <path d="M4 10a8 8 0 0 1 14-4M20 14a8 8 0 0 1-14 4" />
  </S>
);

export const IconSound = ({ size = 20, className = "", off = false, strokeWidth }: P & { off?: boolean }) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" stroke="none" />
    {off ? (
      <path d="M16 9l5 5M21 9l-5 5" />
    ) : (
      <path d="M16.5 8.5a4 4 0 0 1 0 7M19 6a7 7 0 0 1 0 12" />
    )}
  </S>
);

export const IconMap = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </S>
);

export const IconFlag = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <path d="M5 21V4" />
    <path d="M5 4l9 3.5L5 11z" fill="currentColor" stroke="none" />
  </S>
);

export const IconMaskot = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <circle cx="12" cy="8" r="5" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    <circle cx="10" cy="7" r="0.6" fill="currentColor" />
    <circle cx="14" cy="7" r="0.6" fill="currentColor" />
    <path d="M10.5 10c.8.7 2.2.7 3 0" />
  </S>
);

export const IconGrid = ({ size = 20, className = "", strokeWidth }: P) => (
  <S size={size} className={className} strokeWidth={strokeWidth}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </S>
);

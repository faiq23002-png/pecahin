/**
 * MarketProps.tsx — aset visual bertema pasar (SVG/CSS murni, ringan & tajam di semua layar).
 * Gaya: garis tepi gelap tegas + warna solid, selaras dengan Beranda.
 */
import React, { useId } from "react";

const INK = "#1e293b";

export type AwningTone = "teal" | "orange" | "violet" | "rose" | "red" | "blue" | "amber" | "green" | "slate" | "wood";

const AWNING_COLOR: Record<AwningTone, string> = {
  teal: "#0f766e",
  green: "#15803d",
  orange: "#78350f", // Cokelat Kayu Jati / Batang Kayu Treasure
  wood: "#602c0b",   // Mahogany / Kayu Gelap Antik
  violet: "#7c3aed",
  rose: "#f43f5e",
  red: "#dc2626",
  blue: "#2563eb",
  amber: "#854d0e",
  slate: "#94a3b8",
};

/**
 * Kanopi tenda bergaris dengan lekukan (scallop) di bawah.
 * Lebar mengikuti container; motif tidak melar karena memakai pattern userSpaceOnUse.
 */
export function Awning({
  tone = "orange",
  height = 26,
  stripe = 18,
  light = "#fef3c7",
  outline = true,
  className = "",
}: {
  tone?: AwningTone;
  height?: number;
  stripe?: number;
  light?: string;
  outline?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const dark = AWNING_COLOR[tone] ?? AWNING_COLOR.orange;
  const isWoodTone = tone === "orange" || tone === "wood";
  const strokeColor = isWoodTone ? "#451a03" : INK;
  const railColor = isWoodTone ? "#3e2412" : INK;
  const r = stripe / 2;
  const body = height - r; // tinggi bagian lurus sebelum lekukan
  const sw = outline ? 2 : 0;

  return (
    <svg width="100%" height={height + sw} className={`block ${className}`} aria-hidden>
      <defs>
        <pattern id={`aw-${id}`} width={stripe * 2} height={height + sw} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={stripe} height={body} fill={dark} />
          <rect x={stripe} y="0" width={stripe} height={body} fill={light} />
          <path
            d={`M0 ${body} A${r} ${r} 0 0 0 ${stripe} ${body} Z`}
            fill={dark}
            stroke={outline ? strokeColor : "none"}
            strokeWidth={sw}
          />
          <path
            d={`M${stripe} ${body} A${r} ${r} 0 0 0 ${stripe * 2} ${body} Z`}
            fill={light}
            stroke={outline ? strokeColor : "none"}
            strokeWidth={sw}
          />
          {/* tutup garis atas lekukan agar bersih */}
          <rect x="0" y={body - 1} width={stripe * 2} height="2" fill="transparent" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height={height + sw} fill={`url(#aw-${id})`} />
      {/* rel/batang kanopi kayu jati */}
      <rect x="0" y="0" width="100%" height="4" fill={railColor} />
    </svg>
  );
}

/** Untaian bendera segitiga warna-warni (bunting) khas pasar malam. */
export function Bunting({ count = 14, className = "" }: { count?: number; className?: string }) {
  const colors = ["#f97316", "#0f766e", "#fbbf24", "#f43f5e", "#7c3aed"];
  const w = 100 / count;
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" width="100%" height="18" className={`block ${className}`} aria-hidden>
      <path d="M0 1 Q50 4 100 1" fill="none" stroke={INK} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: count }).map((_, i) => {
        const x = i * w;
        const sag = 1 + Math.sin((i / (count - 1)) * Math.PI) * 2.2;
        return (
          <path
            key={i}
            d={`M${x + w * 0.12} ${sag} L${x + w * 0.88} ${sag} L${x + w / 2} ${sag + 7} Z`}
            fill={colors[i % colors.length]}
            stroke={INK}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/** Untaian lampu lampion kuning bercahaya neon khas pasar malam (Festoon Lights). */
export function MarketFestoonLights({
  count = 9,
  className = "",
  glow = true,
}: {
  count?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative w-full h-8 pointer-events-none select-none ${className}`}>
      {/* Tali kawat lengkung gantung */}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-3 block" aria-hidden>
        <path d="M0 2 Q25 8 50 2 T100 2" fill="none" stroke="#334155" strokeWidth="1" />
      </svg>
      {/* Deretan bohlam/lampion kuning neon pasar malam lengkap utuh */}
      <div className="absolute top-1 inset-x-0 flex justify-between px-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Tali pendek & Fitting soket hitam */}
            <div className="w-[1.5px] h-1 bg-slate-700" />
            <div className="w-2 h-1 bg-slate-900 rounded-t-xs" />
            {/* Bohlam Lampion Oval Utuh dengan Efek Cahaya Neon */}
            <div
              className={`w-3.5 h-4.5 rounded-[50%_50%_45%_45%] bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-500 border border-yellow-200/90 ${
                glow
                  ? "shadow-[0_0_10px_#fde047,0_0_18px_#f59e0b,0_0_24px_rgba(245,158,11,0.6)] animate-pulse"
                  : "shadow-[0_0_6px_#fde047]"
              }`}
              style={{
                animationDuration: `${1.4 + (i % 4) * 0.3}s`,
                animationDelay: `${(i % 5) * 0.25}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Papan nama kayu yang digantung dengan dua tali. */
export function HangingSign({
  children,
  className = "",
  rope = 14,
}: {
  children: React.ReactNode;
  className?: string;
  rope?: number;
}) {
  return (
    <div className={`relative inline-flex flex-col items-center max-w-full ${className}`}>
      <div className="flex w-full justify-between px-5" style={{ height: rope }} aria-hidden>
        <span className="w-0.5 bg-[#451a03]" />
        <span className="w-0.5 bg-[#451a03]" />
      </div>
      <div className="wood-plank rounded-xl border-2 border-[#451a03] px-3 py-1.5 shadow-[0_3px_0_#451a03] max-w-full text-center">
        {children}
      </div>
    </div>
  );
}

/** Label harga berbentuk tag (dengan lubang tali). */
export function PriceTag({
  children,
  color = "amber",
  className = "",
}: {
  children: React.ReactNode;
  color?: "amber" | "green" | "white" | "red";
  className?: string;
}) {
  const bg =
    color === "green" ? "bg-green-500 text-white" : color === "white" ? "bg-white text-ink" : color === "red" ? "bg-red-500 text-white" : "bg-amber-300 text-ink";
  return (
    <span className={`price-tag-wrap ${className}`}>
      <span className={`price-tag inline-flex items-center gap-1 py-0.5 pr-2 pl-4 text-[11px] font-extrabold ${bg}`}>{children}</span>
    </span>
  );
}

/** Papan kecil "TUTUP" yang digantung miring — penanda lapak/game terkunci. */
export function ClosedSign({ label = "TUTUP", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`pointer-events-none flex flex-col items-center ${className}`} aria-hidden>
      <svg width="34" height="10" viewBox="0 0 34 10">
        <path d="M4 10 L17 1 L30 10" fill="none" stroke={INK} strokeWidth="1.5" />
        <circle cx="17" cy="1.5" r="1.5" fill={INK} />
      </svg>
      <div className="-mt-px rotate-[-6deg] rounded-md border-2 border-ink bg-red-500 px-2 py-0.5 font-display text-[10px] font-extrabold tracking-widest text-white shadow-[0_2px_0_#1e293b]">
        {label}
      </div>
    </div>
  );
}

/** Peti kayu dagangan dengan isi (emoji/ikon) yang menyembul di atasnya. */
export function Crate({ children, size = 52, className = "" }: { children: React.ReactNode; size?: number; className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-x-0 top-0 grid place-items-center" style={{ height: size * 0.62 }}>
        <span style={{ fontSize: size * 0.48, lineHeight: 1 }} aria-hidden>
          {children}
        </span>
      </div>
      <div
        className="wood-plank absolute inset-x-0 bottom-0 rounded-md border-2 border-ink"
        style={{ height: size * 0.42 }}
        aria-hidden
      >
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink/40" />
      </div>
    </div>
  );
}

/** Meja/konter kayu di bagian bawah lapak. */
export function Counter({ className = "" }: { className?: string }) {
  return <div className={`wood-plank h-3 border-t-2 border-ink ${className}`} aria-hidden />;
}

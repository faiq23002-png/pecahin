/**
 * MarketBoothHeader.tsx
 * Header bergaya Stan / Lapak Pasar & Supermarket Edukasi PECAH-IN.
 */
import React from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { Mascot } from "@/components/Mascot";
import { FractionShape, type ObjKind } from "@/components/FractionShape";
import { IconStar, IconCoin, IconFlame, IconBack, IconSound, IconGear } from "@/components/icons";
import type { Gender } from "@/lib/types";

const OBJ: Record<string, ObjKind> = { m1: "semangka", m2: "kue-tart", m3: "kue-batang" };


/**
 * Scalloped awning curtain bottom with hanging glowing festoon bulbs.
 */
export function AwningScallops({
  lightCount = 5,
  colorScheme = "teal",
}: {
  lightCount?: number;
  colorScheme?: "teal" | "red" | "orange";
}) {
  const scallopColor =
    colorScheme === "red" ? "#b91c1c" : colorScheme === "orange" ? "#c2410c" : "#0f766e";

  return (
    <div className="relative w-full overflow-hidden leading-none select-none">
      {/* SVG Scallop Wave */}
      <svg
        className="w-full h-4 sm:h-5 block text-teal-700"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ fill: scallopColor }}
      >
        <path d="M0,0 C60,90 120,90 180,0 C240,90 300,90 360,0 C420,90 480,90 540,0 C600,90 660,90 720,0 C780,90 840,90 900,0 C960,90 1020,90 1080,0 C1140,90 1200,90 1200,0 L1200,0 L0,0 Z"></path>
      </svg>

      {/* Festoon Lights (Lampu Feston Pasar) */}
      <div className="absolute top-0 inset-x-0 flex justify-around px-4 pointer-events-none z-10">
        {Array.from({ length: lightCount }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Cable string */}
            <div className="w-[1.5px] h-2 bg-amber-900/60" />
            {/* Glowing Bulb */}
            <div className="w-2.5 h-3.5 rounded-full bg-amber-300 border border-amber-400 festoon-bulb" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Supermarket Price Tag Badge (Tag Harga Pasar)
 */
export function PriceTagChip({
  icon,
  label,
  value,
  color = "yellow",
}: {
  icon: React.ReactNode;
  label?: string;
  value: React.ReactNode;
  color?: "yellow" | "orange" | "amber";
}) {
  const bg =
    color === "orange"
      ? "bg-gradient-to-b from-orange-400 to-orange-500 text-white border-orange-600"
      : color === "amber"
      ? "bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 border-amber-500"
      : "bg-gradient-to-b from-yellow-200 to-amber-300 text-slate-900 border-amber-400";

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold border-2 shadow-md transition-transform hover:scale-105 ${bg}`}
    >
      {/* Price tag hole circle */}
      <div className="w-1.5 h-1.5 rounded-full bg-amber-950/40 border border-white/60 shrink-0" />
      <span className="shrink-0">{icon}</span>
      {label && <span className="opacity-80 text-[10px] uppercase font-bold">{label}</span>}
      <span className="font-display font-black text-sm">{value}</span>
    </div>
  );
}

/**
 * Main Home Market Booth Header (Hero Header Beranda).
 * Merubah header beranda menjadi Stand/Booth Pasar Supermarket 3D!
 */
export function HomeBoothHeader({
  profil,
  poin,
  maskotLevel,
}: {
  profil: { nama: string; koin: number; streak: number; gender: Gender };
  aktifMateri: { id: string; urutan: number; judul: string };
  poin: number;
  maskotLevel: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] bg-teal-800 text-white shadow-lg">
      <div className="bg-market-awning-teal pt-3 pb-2 px-4 relative">
        {/* Plang Papan Nama Pasar */}
        <div className="mx-auto max-w-xs bg-amber-400 text-amber-950 rounded-full py-1 px-4 text-center border-2 border-amber-300 shadow-md relative z-10 flex items-center justify-between">
          <span className="text-xs">🏬</span>
          <span className="font-display font-black tracking-wider text-xs uppercase">
            PASAR PECAH-IN
          </span>
          <span className="text-xs">🍉</span>
        </div>

        {/* Card Profil & Stat Clean */}
        <div className="mt-3 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-teal-200/80 shadow-md text-slate-800 relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md border border-amber-200">
                  🏪 Stan Kasir Cilik
                </span>
              </div>
              <h1 className="font-display text-lg font-black text-slate-900">
                Hai, {profil.nama}! 👋
              </h1>
              <p className="text-xs font-semibold text-teal-700">
                Siap belajar pecahan hari ini?
              </p>
            </div>

            {/* Mascot Avatar in Clean Circular Frame */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 p-1 shadow-sm grid place-items-center relative overflow-hidden">
                <Mascot gender={profil.gender} level={maskotLevel} size={48} />
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-amber-700 rounded-b-xl" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow">
                Lvl {maskotLevel + 1}
              </span>
            </div>
          </div>

          {/* Clean Stat Badges (⭐ Poin, 🪙 Koin) */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-around gap-2">
            <PriceTagChip
              icon={<IconStar size={15} className="text-amber-500 fill-amber-400" />}
              label="Poin"
              value={`${poin}/100`}
              color="yellow"
            />
            <PriceTagChip
              icon={<IconCoin size={15} className="text-amber-700 fill-amber-500" />}
              label="Koin"
              value={profil.koin}
              color="amber"
            />
          </div>
        </div>
      </div>

      <AwningScallops lightCount={6} colorScheme="teal" />
    </div>
  );
}

/**
 * Kartu bergaya lapak/stan pasar (papan putih dengan header kayu).
 */
export function StallCard({
  children,
  icon = "🧺",
  title,
  tone = "amber",
  className = "",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  tone?: "amber" | "teal" | "orange" | "purple";
  className?: string;
}) {
  const borderClr =
    tone === "teal"
      ? "border-teal-600"
      : tone === "orange"
      ? "border-orange-600"
      : tone === "purple"
      ? "border-purple-600"
      : "border-amber-600";

  return (
    <div className={`overflow-hidden rounded-3xl border-2 ${borderClr} bg-basket-card p-4 shadow-xl relative ${className}`}>
      {/* Anyaman bambu rim top accent */}
      <div className="h-2.5 -mx-4 -mt-4 bg-basket-woven mb-3 border-b border-amber-700/60" />

      {title && (
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-200 border border-amber-400 text-base shadow-sm shrink-0">
              {icon}
            </span>
          )}
          <h3 className="font-display font-black text-slate-900 text-base truncate drop-shadow-sm">
            {title}
          </h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

/**
 * Sticky Page Header untuk halaman sub bergaya stan/tenda pasar.
 */
export function PageBoothHeader({
  title,
  subtitle,
  icon = "🏪",
  onBack,
  rightElement,
  colorScheme = "teal",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  colorScheme?: "teal" | "red" | "orange";
}) {
  const awningBg =
    colorScheme === "red"
      ? "bg-market-awning-red"
      : colorScheme === "orange"
      ? "bg-market-awning-orange"
      : "bg-market-awning-teal";

  return (
    <div className="sticky top-0 z-30 w-full select-none">
      {/* Top Striped Canopy */}
      <div className={`${awningBg} px-3 pt-2 pb-1`}>
        <div className="mx-auto max-w-md flex items-center justify-between gap-2 bg-slate-900/95 rounded-2xl p-2 border-2 border-amber-400/60 shadow-lg">
          {/* Back Button formatted as wooden sign post peg */}
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-wood-sign-light text-amber-100 shadow-md active:scale-90 transition"
            >
              <IconBack size={20} />
            </button>
          ) : (
            <div className="w-2" />
          )}

          {/* Center Wooden Signboard Header Title */}
          <div className="flex-1 text-center min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-wood-sign border border-amber-400/80 shadow max-w-full">
              <span className="text-base shrink-0">{icon}</span>
              <span className="font-display font-black text-amber-100 text-sm tracking-wide truncate drop-shadow">
                {title}
              </span>
            </div>
            {subtitle && (
              <p className="text-[10px] font-bold text-teal-200/90 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Action Element */}
          {rightElement ? (
            <div className="shrink-0">{rightElement}</div>
          ) : (
            <div className="w-8 shrink-0" />
          )}
        </div>
      </div>

      {/* Awning Scallops */}
      <AwningScallops lightCount={5} colorScheme={colorScheme} />
    </div>
  );
}



/** Maskot Peca/Peco — Gaya Flat Kawaii (contoh karakter.jpg) dengan Evolusi Visual Jelas. */
import React from "react";
import type { Gender } from "@/lib/types";

type Pose = "idle" | "senang" | "sedih" | "bicara";

export function Mascot({
  gender = "cewe",
  level = 0,
  pose = "idle",
  size = 120,
  className = "",
}: {
  gender?: Gender;
  level?: number;
  pose?: Pose;
  size?: number;
  className?: string;
}) {
  const isCewe = gender === "cewe";
  const happy = pose === "senang";
  const sad = pose === "sedih";
  const talking = pose === "bicara";

  // Palette Kawaii
  const skin = "#FED7AA"; // Soft peach skin
  const hair = isCewe ? "#5B3A21" : "#3F2E21"; // Warm brown hair
  const outfitMain = isCewe ? "#F97316" : "#0F766E"; // Orange for Pica, Teal for Peco
  const outfitSecondary = isCewe ? "#FDE047" : "#38BDF8"; // Yellow / Sky Blue accents

  return (
    <svg viewBox="0 0 120 140" width={size} height={size * 1.15} className={className} aria-hidden>
      {/* ===== LEVEL 3+: AURA CAHAYA SULTAN / PROFESOR ===== */}
      {level >= 3 && (
        <g id="aura-glow">
          <circle cx="60" cy="65" r="54" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.7" className="animate-pulse" />
          <path d="M12 25 L16 30 L12 35 L8 30 Z" fill="#FACC15" />
          <path d="M108 25 L112 30 L108 35 L104 30 Z" fill="#FACC15" />
          <text x="14" y="60" fontSize="12">✨</text>
          <text x="96" y="60" fontSize="12">✨</text>
        </g>
      )}

      {/* ===== LEVEL 2+: KILAUAN SPARKLES JURAGAN ===== */}
      {level >= 2 && level < 3 && (
        <g id="juragan-sparkles">
          <text x="12" y="32" fontSize="10">✨</text>
          <text x="98" y="32" fontSize="10">✨</text>
        </g>
      )}

      {/* ===== BADAN & PAKAIAN ===== */}
      <g id="body">
        {/* LEVEL 3+: JUBAH SUTRA SULTAN / PROFESOR */}
        {level >= 3 && (
          <path d="M26 84 C15 95, 12 125, 20 135 L100 135 C108 125, 105 95, 94 84 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
        )}

        {/* Kaos Dalam */}
        <rect x="42" y="80" width="36" height="40" rx="8" fill={outfitSecondary} />

        {/* Tangan Kiri & Kanan */}
        <rect x="28" y="84" width="14" height="24" rx="7" fill={skin} transform="rotate(12 28 84)" />
        <rect x="78" y="84" width="14" height="24" rx="7" fill={skin} transform="rotate(-12 92 84)" />

        {/* Baju Overalls / Celemek Pasar */}
        <path d="M38 90 Q38 82 48 82 L72 82 Q82 82 82 90 L84 130 L36 130 Z" fill={level >= 2 ? "#D97706" : outfitMain} />

        {/* Tali Suspender */}
        <rect x="44" y="82" width="6" height="26" rx="2" fill="rgba(0,0,0,0.15)" />
        <rect x="70" y="82" width="6" height="26" rx="2" fill="rgba(0,0,0,0.15)" />
        <circle cx="47" cy="104" r="2.5" fill="#FEF08A" />
        <circle cx="73" cy="104" r="2.5" fill="#FEF08A" />

        {/* Saku Depan */}
        <path d="M50 102 L70 102 L67 118 L53 118 Z" fill="rgba(255,255,255,0.3)" />

        {/* LEVEL 3+: SELEMPANG SASH EMAS */}
        {level >= 3 && (
          <path d="M38 86 L82 120 L76 126 L32 92 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        )}
      </g>

      {/* ===== LEHER & MEDALI EVOLUSI ===== */}
      <rect x="52" y="72" width="16" height="14" rx="5" fill={skin} />

      {/* LEVEL 2+: KALUNG MEDALI EMAS */}
      {level >= 2 && (
        <g id="juragan-medallion">
          <path d="M48 76 L60 90 L72 76" fill="none" stroke="#DC2626" strokeWidth="2" />
          <circle cx="60" cy="90" r="6" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
          <text x="60" y="93" fontSize="7" textAnchor="middle" fontWeight="900" fill="#FFFFFF">🥇</text>
        </g>
      )}

      {/* ===== RAMBUT BELAKANG ===== */}
      {isCewe && (
        <g id="pigtails">
          <circle cx="24" cy="56" r="12" fill={hair} />
          <circle cx="96" cy="56" r="12" fill={hair} />
          <circle cx="20" cy="70" r="10" fill={hair} />
          <circle cx="100" cy="70" r="10" fill={hair} />
          {/* Pita Pink */}
          <circle cx="28" cy="48" r="5" fill={level >= 2 ? "#F59E0B" : "#EC4899"} />
          <circle cx="92" cy="48" r="5" fill={level >= 2 ? "#F59E0B" : "#EC4899"} />
        </g>
      )}

      {/* ===== KEPALA ===== */}
      <rect x="28" y="24" width="64" height="56" rx="24" fill={skin} />

      {/* ===== RAMBUT DEPAN & TOPI ===== */}
      {isCewe ? (
        <g id="pica-hair-front">
          <path d="M28 36 Q38 46 60 40 Q82 46 92 36 Q92 24 60 24 Q28 24 28 36 Z" fill={hair} />
          {/* Topi Jerami Pedagang */}
          {level < 2 && (
            <>
              <path d="M20 28 Q60 14 100 28 Q60 18 20 28 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
              <path d="M34 26 C34 12, 86 12, 86 26 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <rect x="36" y="22" width="48" height="4" fill="#EC4899" />
            </>
          )}
        </g>
      ) : (
        <g id="peco-hair-front">
          <path d="M28 38 Q40 44 60 38 Q80 44 92 38 Q92 24 60 24 Q28 24 28 38 Z" fill={hair} />
          {/* Topi Pet Green */}
          {level < 2 && (
            <>
              <path d="M32 28 C32 14, 88 14, 88 28 Z" fill="#0F766E" />
              <path d="M22 28 Q60 22 98 28 L94 33 Q60 27 26 33 Z" fill="#14B8A6" />
              <circle cx="60" cy="18" r="3" fill="#FDE047" />
            </>
          )}
        </g>
      )}

      {/* ===== LEVEL 2: MAHKOTA EMAS JURAGAN ===== */}
      {level === 2 && (
        <g id="level2-crown">
          <path d="M42 22 L47 8 L54 18 L60 6 L66 18 L73 8 L78 22 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="60" cy="12" r="3" fill="#EF4444" />
          <circle cx="47" cy="14" r="2" fill="#3B82F6" />
          <circle cx="73" cy="14" r="2" fill="#3B82F6" />
        </g>
      )}

      {/* ===== LEVEL 3+: MAHKOTA AKBAR PROFESOR / SULTAN ===== */}
      {level >= 3 && (
        <g id="level3-grand-crown">
          {/* Topi Toga / Crown Sultan */}
          <path d="M36 22 L44 4 L53 16 L60 2 L67 16 L76 4 L84 22 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <circle cx="60" cy="8" r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <circle cx="44" cy="10" r="3" fill="#10B981" />
          <circle cx="76" cy="10" r="3" fill="#10B981" />
          <rect x="38" y="20" width="44" height="5" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
        </g>
      )}

      {/* ===== WAJAH ===== */}
      <g id="face">
        {/* Pipi Merona Pink */}
        <circle cx="38" cy="56" r="6" fill="#FB7185" opacity="0.6" />
        <circle cx="82" cy="56" r="6" fill="#FB7185" opacity="0.6" />

        {/* Mata */}
        {happy ? (
          <>
            <path d="M40 48 Q44 42 48 48" fill="none" stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
            <path d="M72 48 Q76 42 80 48" fill="none" stroke="#27272A" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : sad ? (
          <>
            <circle cx="44" cy="48" r="4" fill="#27272A" />
            <circle cx="76" cy="48" r="4" fill="#27272A" />
            <path d="M38 40 L48 43" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M82 40 L72 43" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="44" cy="48" r="3.5" fill="#27272A" />
            <circle cx="76" cy="48" r="3.5" fill="#27272A" />
            <circle cx="45" cy="47" r="1.2" fill="#FFFFFF" />
            <circle cx="77" cy="47" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Mulut */}
        {talking ? (
          <path d="M53 58 Q60 67 67 58 Z" fill="#991B1B" />
        ) : sad ? (
          <path d="M53 62 Q60 56 67 62" fill="none" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M53 57 Q60 64 67 57" fill="none" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </g>

      {/* ===== LEVEL 3+: KACAMATA EMAS PROFESOR ===== */}
      {level >= 3 && (
        <g id="professor-glasses">
          <circle cx="44" cy="48" r="9" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="76" cy="48" r="9" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="53" y1="48" x2="67" y2="48" stroke="#F59E0B" strokeWidth="2.5" />
        </g>
      )}

      {/* ===== LEVEL 1: BADGE DETEKTIF BINTANG ===== */}
      {level === 1 && (
        <g id="level1-detektif">
          {/* Pin Bintang Emas di Dada */}
          <circle cx="60" cy="95" r="7" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
          <text x="60" y="98" fontSize="9" textAnchor="middle" fontWeight="900" fill="#78350F">⭐</text>
        </g>
      )}
    </svg>
  );
}

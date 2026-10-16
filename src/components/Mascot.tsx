/**
 * Mascot.tsx
 * Menampilkan ilustrasi maskot resmi PECO & PICA (Level 0–3).
 * Menggunakan kanvas 1:1 persegi yang terpusat rapi dan ukuran konsisten di semua layar.
 */
import React from "react";
import type { Gender } from "@/lib/types";

type Pose = "idle" | "senang" | "sedih" | "bicara";

interface MascotProps {
  gender?: Gender;
  level?: number;
  pose?: Pose;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Mascot({
  gender = "cewe",
  level = 1,
  size = 120,
  className = "",
  style = {},
}: MascotProps) {
  const isCewe = gender === "cewe";
  // Level 1..4 (Level 1: Pelajar, Level 2: Detektif Muda, Level 3: Ahli Pecahan, Level 4: Profesor)
  // File index di public/maskot: 0..3 (peco-0..peco-3)
  const safeLevel = level <= 1 ? 1 : Math.min(4, Math.floor(level));
  const fileIndex = safeLevel - 1;
  const prefix = isCewe ? "pica" : "peco";
  const imageSrc = `/maskot/${prefix}-${fileIndex}.png`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      {/* Pendaran Cahaya untuk Pangkat Tertinggi (Level 3 & 4) */}
      {safeLevel === 4 && (
        <div
          className="absolute inset-2 rounded-full bg-amber-400/20 blur-xl pointer-events-none"
          aria-hidden
        />
      )}
      {safeLevel === 3 && (
        <div
          className="absolute inset-3 rounded-full bg-amber-300/15 blur-lg pointer-events-none"
          aria-hidden
        />
      )}

      <img
        src={imageSrc}
        alt={`${prefix} level ${safeLevel}`}
        width={size}
        height={size}
        className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]"
        draggable={false}
      />
    </div>
  );
}

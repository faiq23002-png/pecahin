/** Overlay selebrasi (bintang + confetti sederhana). */
import React from "react";
import { IconStar } from "./icons";
import { PrimaryButton } from "./ui";

export function CelebrationOverlay({
  title,
  subtitle,
  bintang,
  onClose,
  buttonLabel = "Lanjut",
}: {
  title: string;
  subtitle?: string;
  bintang?: number;
  onClose: () => void;
  buttonLabel?: string;
}) {
  const confetti = Array.from({ length: 24 });
  const colors = ["#14B8A6", "#F97316", "#FBBF24", "#22C55E", "#EC4899"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-1.5 animate-confetti"
            style={{ left: `${(i * 41) % 100}%`, top: "-10px", background: colors[i % colors.length], animationDelay: `${(i % 8) * 0.15}s` }}
          />
        ))}
      </div>
      <div className="relative w-full max-w-xs animate-pop rounded-3xl wood-plank border-4 border-ink p-6 text-center shadow-[0_8px_0_#1e293b]">
        {bintang !== undefined && (
          <div className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full border-2 border-amber-800 bg-amber-100/95 px-4 py-1.5 shadow-sm">
            <IconStar size={24} className="text-amber-500" />
            <span className="font-display text-2xl font-extrabold text-amber-700">+{bintang}</span>
          </div>
        )}
        <h2 className="font-display text-2xl font-extrabold text-white [text-shadow:0_2px_0_rgba(0,0,0,0.4)]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm font-bold text-amber-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            {subtitle}
          </p>
        )}
        <PrimaryButton onClick={onClose} className="mt-5 w-full border-2 border-ink shadow-[0_4px_0_#1e293b] active:translate-y-1">
          {buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

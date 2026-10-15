/**
 * GameLoadingScreen.tsx
 * Screen loading sebelum masuk ke panggung arena game.
 * Menampilkan logo transparan PECAH-IN, animasi pasar, dan bar progres loading dinamis.
 */
import React, { useEffect, useState } from "react";

interface GameLoadingScreenProps {
  onLoaded: () => void;
  gameTitle?: string;
  durationMs?: number;
}

export function GameLoadingScreen({
  onLoaded,
  gameTitle = "Menyiapkan Lapak Game...",
  durationMs = 1800,
}: GameLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(onLoaded, 250);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onLoaded]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none bg-slate-900/90 backdrop-blur-md">
      {/* Background layer bggame */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none opacity-40">
        <img
          src="/bggame.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/60 pointer-events-none" />
      </div>

      <div className="flex flex-col items-center max-w-sm w-full text-center">
        {/* Logo PECAH-IN dengan Animasi Melayang */}
        <div className="relative mb-6">
          <img
            src="/logo-pecahin.png"
            alt="PECAH-IN"
            className="w-72 sm:w-80 h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] animate-float"
          />
        </div>

        {/* Kotak Loading Kayu Pasar */}
        <div className="w-full rounded-3xl bg-slate-900/80 border-2 border-amber-400/80 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between text-xs font-black text-amber-200 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="animate-spin text-sm">🍉</span>
              <span>{gameTitle}</span>
            </span>
            <span className="tabular-nums font-display text-sm text-yellow-300 font-extrabold">
              {progress}%
            </span>
          </div>

          {/* Bar Progres Loading Bertema Garis Pasar */}
          <div className="h-4 w-full rounded-full bg-slate-950/80 p-0.5 border border-amber-300/40 shadow-inner overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-75 relative bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 shadow-[0_0_12px_#fde047]"
              style={{ width: `${progress}%` }}
            >
              {/* Efek kilau cahaya bar */}
              <div className="absolute inset-0 bg-white/25 rounded-full" />
            </div>
          </div>

          <p className="mt-3 text-[11px] font-bold text-amber-100/80 tracking-wide">
            Mengatur dagangan buah & piring pecahan...
          </p>
        </div>
      </div>
    </div>
  );
}

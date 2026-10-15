/** Bar tahap 🧠 Ayo Belajar → 🎮 Ayo Coba → ✏️ Ayo Latihan. */
import React from "react";
import type { StatusTahap } from "@/lib/types";

const TAHAP = [
  { key: "tahapBelajar", emoji: "🧠", label: "Ayo Belajar" },
  { key: "tahapCoba", emoji: "🎮", label: "Ayo Coba" },
  { key: "tahapLatihan", emoji: "✏️", label: "Ayo Latihan" },
] as const;

export function TahapTabs({
  status,
  active,
  onSelect,
}: {
  status: Record<string, StatusTahap>;
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TAHAP.map((t) => {
        const st = status[t.key] ?? "terkunci";
        const locked = st === "terkunci";
        const isActive = active === t.key;
        const isSelesai = st === "selesai";

        return (
          <button
            key={t.key}
            onClick={() => !locked && onSelect(t.key)}
            disabled={locked}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-3 text-center transition active:scale-95 shadow-[0_3px_0_#1e293b] ${
              isActive
                ? "wood-plank border-ink text-white ring-2 ring-amber-300"
                : locked
                ? "border-slate-300 bg-slate-100 opacity-60 text-slate-400 shadow-none"
                : isSelesai
                ? "wood-plank border-ink text-white"
                : "border-ink bg-white text-ink"
            }`}
          >
            <span
              className={`text-xs sm:text-sm font-extrabold ${
                isActive || isSelesai ? "text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]" : "text-ink"
              }`}
            >
              {t.label}
            </span>
            {locked && (
              <span className="text-[10px] font-bold text-slate-400">
                Terkunci
              </span>
            )}
            {isSelesai && !locked && (
              <span className="rounded-md bg-amber-900/60 px-2 py-0.5 text-[10px] font-black text-amber-200 border border-amber-300/40">
                ✓ Selesai
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

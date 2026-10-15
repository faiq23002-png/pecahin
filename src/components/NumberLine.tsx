/** Garis bilangan 0..1 (untuk Cek Masuk Akal & banding). */
import React from "react";

function fracLabel(v: number): string {
  const p6 = Math.round(v * 6);
  if (p6 === 0) return "0";
  if (p6 === 6) return "1";
  return `${p6}/6`;
}

export function NumberLine({
  operands = [],
  estimate = null,
  onEstimate,
  readOnly = false,
}: {
  operands?: number[];
  estimate?: number | null;
  onEstimate?: (v: number) => void;
  readOnly?: boolean;
}) {
  const ticks = [0, 1 / 4, 1 / 2, 3 / 4, 1];
  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onEstimate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onEstimate(Math.round(v * 6) / 6);
  };

  return (
    <div className="w-full select-none">
      <div className="relative mx-2 h-16 cursor-pointer" onClick={handle}>
        <div className="absolute left-0 right-0 top-8 h-1 rounded bg-slate-300" />
        {ticks.map((t) => (
          <div key={t} className="absolute top-8 -translate-x-1/2" style={{ left: `${t * 100}%` }}>
            <div className="h-2.5 w-0.5 bg-slate-400" />
            <div className="mt-1 text-xs font-bold text-muted">{t === 0 ? "0" : t === 1 ? "1" : `${Math.round(t * 4)}/4`}</div>
          </div>
        ))}
        {operands.map((o, i) => (
          <div key={i} className="absolute top-8 -translate-x-1/2 -translate-y-1/2" style={{ left: `${o * 100}%` }}>
            <div className="h-4 w-4 rounded-full border-2 border-orange-600 bg-orange-400" />
            <div className="mt-1 -translate-x-1/2 text-xs font-bold text-orange-700">{fracLabel(o)}</div>
          </div>
        ))}
        {estimate !== null && (
          <div className="absolute top-8 -translate-x-1/2 -translate-y-1/2" style={{ left: `${estimate * 100}%` }}>
            <div className="h-5 w-5 rounded-full border-2 border-teal-700 bg-teal-500 shadow" />
            <div className="mt-1 -translate-x-1/2 text-xs font-bold text-teal-700">{fracLabel(estimate)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

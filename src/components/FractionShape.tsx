/** Objek pecahan realistik (SVG): lingkaran & persegi/balok, arsir + hatch (aman buta warna). */
import React, { useId } from "react";
import type { ObjKind } from "@/lib/types";

export type { ObjKind };

interface Cfg {
  shape: "circle" | "rect";
  flesh: string;
  fade: string;
  rind: string;
  ringW?: number;
}

const CFG: Record<ObjKind, Cfg> = {
  semangka: { shape: "circle", flesh: "#E11D48", fade: "#FFE4E6", rind: "#15803D", ringW: 9 },
  jeruk: { shape: "circle", flesh: "#F97316", fade: "#FFEDD5", rind: "#C2410C", ringW: 8 },
  "kue-tart": { shape: "circle", flesh: "#EC4899", fade: "#FCE7F3", rind: "#A16207", ringW: 8 },
  pizza: { shape: "circle", flesh: "#FACC15", fade: "#FEF9C3", rind: "#92400E", ringW: 10 },
  roti: { shape: "rect", flesh: "#D97706", fade: "#FEF3C7", rind: "#B45309" },
  cokelat: { shape: "rect", flesh: "#92400E", fade: "#D6D3D1", rind: "#451A03" },
  keju: { shape: "rect", flesh: "#FDE047", fade: "#FEFCE8", rind: "#CA8A04" },
  "kue-batang": { shape: "rect", flesh: "#F9A8D4", fade: "#FCE7F3", rind: "#D97706" },
};

function sectorPath(cx: number, cy: number, r: number, i: number, n: number): string {
  const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = 2 * Math.PI / n > Math.PI ? 1 : 0;
  return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
}

function CircleObj({ kind, n, k, hatch }: { kind: ObjKind; n: number; k: number; hatch: string }) {
  const cfg = CFG[kind];
  const cx = 60, cy = 60, r = 45, rw = cfg.ringW ?? 8;
  const extra = (() => {
    switch (kind) {
      case "semangka":
        return [[-12, -8, -20], [13, -10, 15], [-16, 12, -6], [15, 10, 8], [0, 20, 0]].map(([x, y, rot], i) => (
          <ellipse key={i} cx={cx + x} cy={cy + y} rx="1.4" ry="2.2" fill="#1F2937" transform={`rotate(${rot} ${cx + x} ${cy + y})`} />
        ));
      case "jeruk":
        return (
          <>
            <path d="M60 9 q16 -9 25 -2 q-12 9 -25 2Z" fill="#16A34A" />
            <circle cx="60" cy="60" r="4" fill="#FDBA74" />
          </>
        );
      case "kue-tart":
        return (
          <>
            <circle cx="60" cy="60" r="8" fill="#B91C1C" />
            <circle cx="60" cy="60" r="3" fill="#7F1D1D" />
            <circle cx="40" cy="40" r="1.7" fill="#22C55E" />
            <circle cx="82" cy="46" r="1.7" fill="#3B82F6" />
            <circle cx="46" cy="82" r="1.7" fill="#F59E0B" />
            <circle cx="76" cy="78" r="1.7" fill="#8B5CF6" />
          </>
        );
      case "pizza":
        return Array.from({ length: k }).map((_, i) => {
          const a = -Math.PI / 2 + (i + 0.5) * ((2 * Math.PI) / n);
          return <circle key={i} cx={60 + 26 * Math.cos(a)} cy={60 + 26 * Math.sin(a)} r="4.5" fill="#DC2626" />;
        });
      default:
        return null;
    }
  })();

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <circle cx={cx} cy={cy} r={r + rw / 2} fill="none" stroke={cfg.rind} strokeWidth={rw} />
      {Array.from({ length: n }).map((_, i) => (
        <path key={i} d={sectorPath(cx, cy, r, i, n)} fill={i < k ? cfg.flesh : cfg.fade} stroke="rgba(255,255,255,.85)" strokeWidth="1.5" />
      ))}
      {Array.from({ length: n }).map((_, i) => (i < k ? <path key={i} d={sectorPath(cx, cy, r, i, n)} fill={`url(#${hatch})`} /> : null))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
      {extra}
    </svg>
  );
}

function RectObj({ kind, n, k, hatch }: { kind: ObjKind; n: number; k: number; hatch: string }) {
  const cfg = CFG[kind];
  const x = 12, y = 32, w = 96, h = 56;
  const seg = w / n;
  const layers = kind === "kue-batang" || kind === "keju";
  const holes = kind === "keju";

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full">
      <rect x={x} y={y} width={w} height={h} rx="9" fill={cfg.rind} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="6" fill={cfg.fade} />
      {Array.from({ length: n }).map((_, i) =>
        i < k ? <rect key={i} x={x + 4 + (i * (w - 8)) / n} y={y + 4} width={(w - 8) / n} height={h - 8} fill={cfg.flesh} /> : null,
      )}
      {Array.from({ length: n }).map((_, i) =>
        i < k ? <rect key={i} x={x + 4 + (i * (w - 8)) / n} y={y + 4} width={(w - 8) / n} height={h - 8} fill={`url(#${hatch})`} /> : null,
      )}
      {layers && (
        <>
          <rect x={x + 5} y={y + 4 + h * 0.3} width={w - 10} height="5" fill="rgba(255,255,255,.55)" />
          <rect x={x + 5} y={y + 4 + h * 0.6} width={w - 10} height="5" fill="rgba(255,255,255,.55)" />
        </>
      )}
      {holes &&
        Array.from({ length: k }).map((_, i) => {
          const hx = x + 4 + (i + 0.5) * ((w - 8) / n);
          return <circle key={i} cx={hx} cy={y + h / 2} r="4.5" fill="#FACC15" />;
        })}
      {Array.from({ length: n - 1 }).map((_, i) => (
        <line key={i} x1={x + (i + 1) * seg} y1={y} x2={x + (i + 1) * seg} y2={y + h} stroke="rgba(255,255,255,.85)" strokeWidth="2" />
      ))}
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="6" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="1" />
    </svg>
  );
}

export function FractionShape({
  kind = "semangka",
  n = 4,
  k = 3,
  className = "",
}: {
  kind?: ObjKind;
  n?: number;
  k?: number;
  className?: string;
}) {
  const rawId = useId();
  const hatch = `hatch-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const cfg = CFG[kind];
  return (
    <div className={className}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <pattern id={hatch} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.18)" strokeWidth="1.4" />
          </pattern>
        </defs>
      </svg>
      {cfg.shape === "circle" ? <CircleObj kind={kind} n={n} k={k} hatch={hatch} /> : <RectObj kind={kind} n={n} k={k} hatch={hatch} />}
    </div>
  );
}

/** Objek untuk aktivitas mengarsir interaktif (tap bagian untuk mengarsir). */
export function ArsirShape({
  kind = "semangka",
  n = 4,
  shaded,
  onToggle,
  disabled = false,
  className = "",
}: {
  kind?: ObjKind;
  n?: number;
  shaded: Set<number>;
  onToggle?: (i: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  const rawId = useId();
  const hatch = `hatch-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const cfg = CFG[kind];
  const defs = (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <pattern id={hatch} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.18)" strokeWidth="1.4" />
        </pattern>
      </defs>
    </svg>
  );

  if (cfg.shape === "circle") {
    const cx = 60, cy = 60, r = 45, rw = cfg.ringW ?? 8;
    return (
      <div className={className}>
        {defs}
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle cx={cx} cy={cy} r={r + rw / 2} fill="none" stroke={cfg.rind} strokeWidth={rw} />
          {Array.from({ length: n }).map((_, i) => (
            <path
              key={i}
              d={sectorPath(cx, cy, r, i, n)}
              fill={shaded.has(i) ? cfg.flesh : cfg.fade}
              stroke="rgba(255,255,255,.9)"
              strokeWidth="1.5"
              className={disabled ? "" : "cursor-pointer"}
              onClick={disabled ? undefined : () => onToggle?.(i)}
            />
          ))}
          {Array.from({ length: n }).map((_, i) =>
            shaded.has(i) ? <path key={i} d={sectorPath(cx, cy, r, i, n)} fill={`url(#${hatch})`} pointerEvents="none" /> : null,
          )}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1" pointerEvents="none" />
        </svg>
      </div>
    );
  }

  const x = 12, y = 32, w = 96, h = 56;
  return (
    <div className={className}>
      {defs}
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <rect x={x} y={y} width={w} height={h} rx="9" fill={cfg.rind} />
        {Array.from({ length: n }).map((_, i) => (
          <rect
            key={i}
            x={x + 4 + (i * (w - 8)) / n}
            y={y + 4}
            width={(w - 8) / n}
            height={h - 8}
            fill={shaded.has(i) ? cfg.flesh : cfg.fade}
            stroke="rgba(255,255,255,.9)"
            strokeWidth="2"
            className={disabled ? "" : "cursor-pointer"}
            onClick={disabled ? undefined : () => onToggle?.(i)}
          />
        ))}
        {Array.from({ length: n }).map((_, i) =>
          shaded.has(i) ? <rect key={i} x={x + 4 + (i * (w - 8)) / n} y={y + 4} width={(w - 8) / n} height={h - 8} fill={`url(#${hatch})`} pointerEvents="none" /> : null,
        )}
        <rect x={x} y={y} width={w} height={h} rx="9" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="1" pointerEvents="none" />
      </svg>
    </div>
  );
}

/** Objek yang dibagi jadi beberapa bagian — untuk soal "bagi sama besar". */
export function BagiVisual({
  kind = "kue-tart",
  parts = 4,
  equal = true,
  className = "",
}: {
  kind?: ObjKind;
  parts?: number;
  equal?: boolean;
  className?: string;
}) {
  const cfg = CFG[kind];
  // Sudut garis pembagi lingkaran (derajat dari atas, searah jarum jam).
  const circleAngles = equal
    ? Array.from({ length: parts }, (_, i) => (i * 360) / parts)
    : parts === 6
      ? [0, 35, 115, 190, 245, 310]
      : parts === 4
        ? [0, 48, 140, 220]
        : parts === 3
          ? [0, 42, 200]
          : parts === 5
            ? [0, 50, 125, 210, 290]
            : Array.from({ length: parts }, (_, i) => (i * 360) / parts + (i % 2 === 0 ? 25 : -15));
  // Posisi garis pembagi persegi (fraksi 0..1).
  const rectFracs = equal
    ? Array.from({ length: parts - 1 }, (_, i) => (i + 1) / parts)
    : parts === 6
      ? [0.2, 0.42, 0.58, 0.76, 0.9]
      : parts === 4
        ? [0.55, 0.68, 0.8]
        : parts === 3
          ? [0.45, 0.72]
          : parts === 5
            ? [0.18, 0.42, 0.55, 0.82]
            : Array.from({ length: parts - 1 }, (_, i) => (i + 1) / parts + (i % 2 === 0 ? 0.08 : -0.05));

  if (cfg.shape === "circle") {
    const cx = 60, cy = 60, r = 45, rw = cfg.ringW ?? 8;
    return (
      <div className={className}>
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <circle cx={cx} cy={cy} r={r + rw / 2} fill="none" stroke={cfg.rind} strokeWidth={rw} />
          <circle cx={cx} cy={cy} r={r} fill={cfg.flesh} />
          {circleAngles.map((deg, i) => {
            const a = ((deg - 90) * Math.PI) / 180;
            return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="#fff" strokeWidth="2.6" />;
          })}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  const x = 12, y = 32, w = 96, h = 56;
  return (
    <div className={className}>
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <rect x={x} y={y} width={w} height={h} rx="9" fill={cfg.rind} />
        <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="6" fill={cfg.flesh} />
        {rectFracs.map((f, i) => (
          <line key={i} x1={x + 4 + f * (w - 8)} y1={y} x2={x + 4 + f * (w - 8)} y2={y + h} stroke="#fff" strokeWidth="2.6" />
        ))}
        <rect x={x} y={y} width={w} height={h} rx="9" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="1" />
      </svg>
    </div>
  );
}

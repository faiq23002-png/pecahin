/** Komponen UI dasar. */
import React from "react";

export function PrimaryButton({
  children,
  onClick,
  color = "orange",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: "orange" | "teal" | "white";
  disabled?: boolean;
  className?: string;
}) {
  const palette =
    color === "orange"
      ? "bg-orange-500 text-white shadow-[0_6px_16px_rgba(234,88,12,.35)]"
      : color === "teal"
        ? "bg-teal-700 text-white shadow-[0_6px_16px_rgba(15,118,110,.3)]"
        : "bg-white text-teal-700 shadow";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl px-6 py-3 font-display text-base font-bold transition active:scale-95 disabled:opacity-40 disabled:active:scale-100 ${palette} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatChip({ icon, value, color = "white" }: { icon: React.ReactNode; value: React.ReactNode; color?: "white" | "amber" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${
        color === "amber" ? "bg-amber-400/90 text-amber-900" : "bg-white/90 text-ink"
      }`}
    >
      {icon}
      {value}
    </span>
  );
}

export function ProgressBar({ value, className = "", color = "teal" }: { value: number; className?: string; color?: "teal" | "orange" | "green" }) {
  const pct = Math.max(0, Math.min(100, value));
  const c = color === "orange" ? "bg-orange-500" : color === "green" ? "bg-green-500" : "bg-teal-500";
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div className={`h-full rounded-full ${c} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-[0_6px_18px_rgba(15,118,110,.1)] ${className}`}>{children}</div>;
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 py-2">
      <h2 className="font-display text-base font-bold text-ink">{children}</h2>
      {action}
    </div>
  );
}

/** Pecahan bersusun (pembilang di atas, penyebut di bawah, garis tengah). */
export function StackedFraction({
  num,
  den,
  className = "",
  size = "md",
}: {
  num: React.ReactNode;
  den: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-[13px]" : "text-base";
  return (
    <span className={`inline-flex flex-col items-center align-middle leading-none ${sz} ${className}`}>
      <span className="font-display font-extrabold tabular-nums">{num}</span>
      <span className="my-1 h-[2px] w-5 rounded-full bg-current" />
      <span className="font-display font-extrabold tabular-nums">{den}</span>
    </span>
  );
}

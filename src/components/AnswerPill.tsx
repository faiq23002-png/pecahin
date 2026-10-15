/** Opsi jawaban pill (A/B/C/D) dengan state benar/salah pakai tint + ikon (kontras AA). */
import React from "react";
import { IconCheck, IconX } from "./icons";
import { FractionText } from "./ui";

export type PillState = "idle" | "selected" | "correct" | "wrong";

export function AnswerPill({
  label,
  state = "idle",
  onClick,
  disabled,
}: {
  label: string;
  state?: PillState;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = (() => {
    switch (state) {
      case "selected":
        return "border-teal-700 bg-teal-50 text-teal-700";
      case "correct":
        return "border-green-700 bg-green-50 text-green-700";
      case "wrong":
        return "border-red-700 bg-red-50 text-red-700";
      default:
        return "border-slate-200 bg-white text-ink";
    }
  })();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-bold transition active:scale-[0.98] ${cls} ${disabled ? "opacity-90" : ""}`}
    >
      <span className="flex-1"><FractionText text={label} size="sm" /></span>
      {state === "correct" && <IconCheck size={20} className="shrink-0 text-green-700" />}
      {state === "wrong" && <IconX size={20} className="shrink-0 text-red-700" />}
    </button>
  );
}

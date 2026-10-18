/**
 * InfoModalCard.tsx
 * Custom Modal Popup Card bergaya Stan Pasar untuk menggantikan alert() & confirm() bawaan browser.
 */
import React from "react";
import { AwningScallops } from "@/components/MarketBoothHeader";
import { PrimaryButton } from "@/components/ui";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  type?: "info" | "warning" | "danger";
}

export function InfoModalCard({
  isOpen,
  onClose,
  title,
  icon = "ℹ️",
  children,
  confirmText = "Mengerti!",
  cancelText,
  onConfirm,
  type = "info",
}: ModalProps) {
  if (!isOpen) return null;

  const colorScheme = type === "danger" ? "red" : "orange";

  const awningBg =
    type === "danger"
      ? "bg-market-awning-red"
      : "bg-market-awning-orange";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-pop select-none">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-[#fffefc] via-[#fdf6e7] to-[#faedd0] shadow-[0_16px_40px_rgba(0,0,0,0.5)] border-4 border-[#78350f]">
        {/* Modal Awning Canopy Header */}
        <div className={`${awningBg} pt-3.5 pb-1 px-4 text-center relative shadow-sm`}>
          <div className="mx-auto max-w-[240px] bg-wood-sign rounded-xl py-1.5 px-3.5 border-2 border-amber-300 shadow-[0_3px_6px_rgba(0,0,0,0.35)] flex items-center justify-center gap-2">
            <span className="text-xl filter drop-shadow">{icon}</span>
            <span className="font-display font-black text-amber-100 text-xs sm:text-sm tracking-wide [text-shadow:0_1px_2px_rgba(0,0,0,0.85)] uppercase">
              {title}
            </span>
          </div>
        </div>

        <AwningScallops lightCount={4} colorScheme={colorScheme} />

        {/* Modal Body Content */}
        <div className="p-5 pt-3">
          <div className="text-sm font-semibold text-[#451a03] leading-relaxed">
            {children}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2.5 justify-end">
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border-2 border-[#b45309]/60 bg-gradient-to-b from-[#fffbeb] to-[#fde68a] py-3 px-3 font-display text-xs font-black text-[#78350f] shadow-[0_3px_0_#92400e] hover:bg-amber-100 active:translate-y-[2px] active:shadow-none transition"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
              className={`flex-1 rounded-2xl border-2 py-3 px-3 font-display text-xs font-black text-white transition active:translate-y-[2px] active:shadow-none [text-shadow:0_1px_2px_rgba(0,0,0,0.5)] ${
                type === "danger"
                  ? "border-[#7f1d1d] bg-gradient-to-b from-red-500 to-red-700 shadow-[0_4px_0_#7f1d1d] hover:brightness-105"
                  : "border-[#0f766e] bg-gradient-to-b from-teal-500 to-teal-700 shadow-[0_4px_0_#0f766e] hover:brightness-105"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

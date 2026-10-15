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

  const colorScheme = type === "danger" ? "red" : type === "warning" ? "orange" : "teal";

  const awningBg =
    type === "danger"
      ? "bg-market-awning-red"
      : type === "warning"
      ? "bg-market-awning-orange"
      : "bg-market-awning-teal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl border-2 border-amber-400 select-none">
        {/* Modal Awning Canopy Header */}
        <div className={`${awningBg} pt-3 pb-1 px-4 text-center relative`}>
          <div className="mx-auto max-w-[220px] bg-wood-sign rounded-xl py-1 px-3 border border-amber-300 shadow flex items-center justify-center gap-1.5">
            <span className="text-base">{icon}</span>
            <span className="font-display font-black text-amber-100 text-sm tracking-wide drop-shadow">
              {title}
            </span>
          </div>
        </div>

        <AwningScallops lightCount={4} colorScheme={colorScheme} />

        {/* Modal Body Content */}
        <div className="p-5 pt-3">
          <div className="text-sm font-semibold text-slate-700 leading-relaxed">
            {children}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2 justify-end">
            {cancelText && (
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border-2 border-slate-200 bg-slate-100 py-3 font-display text-sm font-bold text-slate-600 shadow-sm transition active:scale-95 hover:bg-slate-200"
              >
                {cancelText}
              </button>
            )}

            <PrimaryButton
              color={type === "danger" ? "orange" : "teal"}
              onClick={() => {
                if (onConfirm) {
                  onConfirm();
                } else {
                  onClose();
                }
              }}
              className="flex-1 py-3 text-sm"
            >
              {confirmText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

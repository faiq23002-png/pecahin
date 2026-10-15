/** Rapor: penguasaan per domain + miskonsepsi + PDF. */
import React, { useState } from "react";
import { useApp } from "@/lib/profil-context";
import { hitungPenguasaan, persenPenguasaan, miskonsepsiTersering, MIN_JAWABAN_LABEL } from "@/lib/diagnosis";
import { simpanRaporPDF } from "@/lib/rapor";
import { BottomNav } from "@/components/BottomNav";
import { PrimaryButton, Card } from "@/components/ui";
import { sfx } from "@/lib/audio";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { InfoModalCard } from "@/components/InfoModalCard";
import { useRouter } from "@/lib/router-context";

const DOMAIN = [
  { key: "konsep", label: "Konsep", color: "bg-teal-500", icon: "🧠" },
  { key: "prinsip", label: "Prinsip", color: "bg-orange-500", icon: "🧮" },
  { key: "verbal", label: "Verbal", color: "bg-amber-400", icon: "💬" },
] as const;

export default function Rapor() {
  const { profil, riwayat, progress, resetAll, poin } = useApp();
  const { navigate, goBack } = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (isResetting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-krim p-6 text-center select-none">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-600 border-t-transparent shadow-lg" />
        <div className="mt-4 font-display text-xl font-extrabold text-ink">Mereset Data Pasar... 🛒</div>
        <p className="mt-1 text-sm font-semibold text-muted">Menyiapkan lembaran baru untukmu!</p>
      </div>
    );
  }

  if (!profil) return null;

  const stat = hitungPenguasaan(riwayat);
  const top = miskonsepsiTersering(riwayat).slice(0, 4);

  const executeReset = () => {
    setShowConfirmReset(false);
    sfx("tap");
    setIsResetting(true);
    setTimeout(() => {
      resetAll();
      navigate("profil");
    }, 750);
  };

  return (
    <div className="min-h-screen bg-krim pb-20">
      <PageBoothHeader
        title="RAPOR BELAJAR PASAR"
        subtitle={`${profil.nama} · ⭐ ${poin}/100 poin`}
        icon="📜"
        onBack={() => goBack("menu")}
        colorScheme="teal"
      />

      <div className="mx-auto max-w-md px-4">
        <Card className="mt-4">
          <div className="font-display text-base font-bold text-ink">Penguasaan per domain</div>
          <div className="mt-3 flex flex-col gap-3">
            {DOMAIN.map((d) => {
              const s = stat[d.key];
              const pct = persenPenguasaan(s);
              const perluLatihan = s.total >= MIN_JAWABAN_LABEL && pct >= 0 && pct < 60;
              return (
                <div key={d.key}>
                  <div className="flex items-center justify-between text-sm font-bold text-ink">
                    <span>
                      {d.icon} {d.label}
                    </span>
                    <span className="text-muted">
                      {pct < 0 ? "belum ada data" : `${s.benar} dari ${s.total}`}
                    </span>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${pct < 0 ? 0 : pct}%` }} />
                  </div>
                  <div className="mt-0.5 flex justify-between text-xs font-bold">
                    <span className="text-muted">{pct < 0 ? "—" : `${pct}%`}</span>
                    {perluLatihan && <span className="text-red-700">perlu latihan</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mt-3">
          <div className="font-display text-base font-bold text-ink">Miskonsepsi yang perlu diperhatikan</div>
          {top.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-muted">Belum ada data. Kerjakan Ayo Latihan dulu!</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {top.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-ink">
                  <span>{t.nama}</span>
                  <span className="text-muted">{t.count}×</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <PrimaryButton
          onClick={() => {
            sfx("success");
            simpanRaporPDF(profil, riwayat, progress, poin);
          }}
          className="mt-4 w-full"
        >
          Simpan PDF 📄
        </PrimaryButton>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 py-3 font-display text-sm font-bold text-red-600 shadow-sm transition active:scale-95 hover:bg-red-100"
        >
          <span>🔄</span>
          <span>Reset Progres Belajar</span>
        </button>
      </div>

      <InfoModalCard
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="KONFIRMASI RESET"
        icon="⚠️"
        type="danger"
        confirmText="Ya, Reset Semua"
        cancelText="Batal"
        onConfirm={executeReset}
      >
        <div className="text-center space-y-2">
          <p className="font-bold text-slate-800 text-sm">
            Apakah kamu yakin ingin mereset seluruh progres & data di aplikasi?
          </p>
          <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
            Semua bintang, koin, stiker, dan riwayat belajar akan dihapus bersih.
          </p>
        </div>
      </InfoModalCard>

      <BottomNav />
    </div>
  );
}



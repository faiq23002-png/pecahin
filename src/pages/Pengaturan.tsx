/** Pengaturan: karakter, suara, reset, mode juri, tentang. */
import React, { useEffect, useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { Mascot } from "@/components/Mascot";
import { IconSound } from "@/components/icons";
import { setAudioMuted, sfx } from "@/lib/audio";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { InfoModalCard } from "@/components/InfoModalCard";
import { BottomNav } from "@/components/BottomNav";

export default function Pengaturan() {
  const { navigate, goBack } = useRouter();
  const { profil, toggleSuara, resetAll, toggleModeJuri, modeJuri, buatProfil } = useApp();
  const [tapCount, setTapCount] = useState(0);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    if (profil) setAudioMuted(!profil.suaraOn);
  }, [profil?.suaraOn]);

  if (!profil) return null;

  const tapVersi = () => {
    const c = tapCount + 1;
    setTapCount(c);
    if (c >= 7) {
      toggleModeJuri();
      setTapCount(0);
      sfx("unlock");
    }
  };

  return (
    <div className="min-h-screen bg-krim pb-24 select-none">
      <PageBoothHeader
        title="PENGATURAN TOKO"
        subtitle="Atur karakter, suara & akun"
        icon="⚙️"
        onBack={() => goBack("menu")}
        colorScheme="teal"
      />


      <div className="mx-auto max-w-md px-4">
        {/* karakter */}
        <div className="rounded-3xl bg-white p-4 shadow">
          <div className="font-display text-base font-bold text-ink">Karakter</div>
          <div className="mt-2 flex items-center gap-3">
            <Mascot gender={profil.gender} level={0} size={64} />
            <div className="flex-1">
              <div className="font-bold text-ink">{profil.gender === "cowo" ? "Peco" : "Pica"} ({profil.gender})</div>
              <button
                onClick={() => {
                  buatProfil(profil.nama, profil.gender === "cowo" ? "cewe" : "cowo");
                  sfx("pop");
                }}
                className="mt-1 rounded-full bg-teal-100 px-3 py-1 text-[12px] font-bold text-teal-700"
              >
                Ganti ke {profil.gender === "cowo" ? "Pica" : "Peco"}
              </button>
            </div>
          </div>
        </div>

        {/* suara */}
        <button
          onClick={() => {
            toggleSuara();
            sfx("tap");
          }}
          className="mt-3 flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow active:scale-[0.99]"
        >
          <IconSound size={22} off={!profil.suaraOn} className="text-teal-700" />
          <span className="font-bold text-ink">Suara & musik</span>
          <span className="ml-auto text-sm font-bold text-muted">{profil.suaraOn ? "Nyala" : "Mati"}</span>
        </button>

        {/* mode juri */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow">
          <div className="font-display text-base font-bold text-ink">Mode Juri</div>
          <p className="text-xs font-semibold text-muted">Buka semua tahap & materi sekaligus (untuk penilaian cepat).</p>
          <button
            onClick={toggleModeJuri}
            className={`mt-2 rounded-full px-4 py-1.5 text-[12px] font-extrabold ${modeJuri ? "bg-green-500 text-white" : "bg-slate-200 text-ink"}`}
          >
            {modeJuri ? "✓ Aktif" : "Aktifkan"}
          </button>
        </div>

        {/* reset */}
        <button
          onClick={() => setShowConfirmReset(true)}
          className="mt-3 w-full rounded-3xl bg-red-50 p-4 text-left font-bold text-red-700 shadow active:scale-[0.99]"
        >
          Reset semua progres
        </button>

        <button type="button" onClick={tapVersi} className="mt-6 w-full text-center text-xs font-semibold text-muted">
          PECAH-IN · Petualangan Pecahan di Pasar
          <br />
          versi 0.1.0 · FIP Championship 2026
        </button>
      </div>

      <InfoModalCard
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        title="KONFIRMASI RESET"
        icon="⚠️"
        type="danger"
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        onConfirm={() => {
          setShowConfirmReset(false);
          sfx("tap");
          resetAll();
          navigate("profil");
        }}
      >
        <div className="text-center space-y-2">
          <p className="font-bold text-slate-800 text-sm">
            Yakin ingin menghapus seluruh progres belajar?
          </p>
          <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-xl border border-red-200">
            Aksi ini akan mereset data akun dan membawa kamu kembali ke pendaftaran nama.
          </p>
        </div>
      </InfoModalCard>
      <BottomNav />
    </div>
  );
}


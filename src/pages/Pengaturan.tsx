import React, { useEffect, useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { Mascot } from "@/components/Mascot";
import { IconSound, IconCoin, IconBook, IconGame } from "@/components/icons";
import { setAudioMuted, setVolumeMusik, setVolumeSfx, initOrPlayBgm, sfx } from "@/lib/audio";
import { PageBoothHeader } from "@/components/MarketBoothHeader";
import { BottomNav } from "@/components/BottomNav";

export default function Pengaturan() {
  const { goBack } = useRouter();
  const {
    profil,
    toggleSuara,
    toggleModeJuri,
    modeJuri,
    buatProfil,
    setVolumeMusik: updateStoreMusik,
    setVolumeSfx: updateStoreSfx,
    setKoinManual,
    setSemuaMateriSelesai,
    setSemuaGameTerbuka,
    maskotLevel,
  } = useApp();

  const [inputKoin, setInputKoin] = useState("");
  const [toastDemo, setToastDemo] = useState<string | null>(null);

  const volMusik = profil?.volumeMusik ?? 70;
  const volSfx = profil?.volumeSfx ?? 80;

  useEffect(() => {
    if (profil) {
      setAudioMuted(!profil.suaraOn);
      setVolumeMusik(volMusik);
      setVolumeSfx(volSfx);
      if (profil.suaraOn) {
        initOrPlayBgm();
      }
    }
  }, [profil?.suaraOn, volMusik, volSfx]);

  const showToast = (msg: string) => {
    setToastDemo(msg);
    setTimeout(() => setToastDemo(null), 2500);
  };

  if (!profil) return null;

  const handleMusikSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolumeMusik(val);
    updateStoreMusik(val);
  };

  const handleSfxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolumeSfx(val);
    updateStoreSfx(val);
    sfx("tap");
  };

  const handleSetKoin = (jumlah: number) => {
    sfx("pop");
    setKoinManual(jumlah);
    showToast(`💰 Koin disetel ke ${jumlah}!`);
  };

  return (
    <div className="min-h-screen bg-krim pb-24 select-none relative">
      <PageBoothHeader
        title="PENGATURAN TOKO"
        subtitle="Atur suara, karakter & mode demo"
        icon="⚙️"
        onBack={() => goBack("menu")}
        colorScheme="orange"
      />

      <div className="mx-auto max-w-md px-4 pt-3 space-y-4">
        {/* Karakter */}
        <div className="rounded-3xl border-2 border-ink bg-white p-4 shadow-[0_3px_0_#1e293b]">
          <div className="font-display text-base font-extrabold text-ink">Pedagang Cilik</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl border-2 border-ink bg-amber-100 grid place-items-center">
              <Mascot gender={profil.gender} level={maskotLevel} size={52} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm text-ink">
                {profil.nama} ({profil.gender === "cowo" ? "Peco - Laki-laki" : "Pica - Perempuan"})
              </div>
              <button
                onClick={() => {
                  buatProfil(profil.nama, profil.gender === "cowo" ? "cewe" : "cowo");
                  sfx("pop");
                }}
                className="mt-1.5 rounded-full border border-teal-600 bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 active:scale-95"
              >
                Ganti Karakter ke {profil.gender === "cowo" ? "Pica 👧" : "Peco 👦"}
              </button>
            </div>
          </div>
        </div>

        {/* ================= ATUR SUARA & MUSIK DENGAN SLIDER VOLUME PERSEN ================= */}
        <div className="rounded-3xl border-2 border-ink bg-white p-4 shadow-[0_3px_0_#1e293b]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <IconSound size={22} off={!profil.suaraOn} className="text-teal-700" />
              <span className="font-display text-base font-extrabold text-ink">Suara & Musik Pasar</span>
            </div>
            <button
              type="button"
              onClick={() => {
                sfx("tap");
                toggleSuara();
              }}
              className={`rounded-full px-3 py-1 text-xs font-extrabold transition ${
                profil.suaraOn ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {profil.suaraOn ? "🔊 Aktif" : "🔇 Bisu"}
            </button>
          </div>

          <div className="mt-3.5 space-y-3.5">
            {/* Slider Musik Backsound */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>🎵</span> Backsound Musik Pasar
                </span>
                <span className="font-black tabular-nums text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {volMusik}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volMusik}
                disabled={!profil.suaraOn}
                onChange={handleMusikSlider}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Slider Efek Suara SFX */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>🔔</span> Efek Suara (SFX Sentuhan & Tombol)
                </span>
                <span className="font-black tabular-nums text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {volSfx}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volSfx}
                disabled={!profil.suaraOn}
                onChange={handleSfxSlider}
                className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* ================= MODE KREATOR / DEMO SHOWCASE (PENGATURAN MATERI, GAME & KOIN) ================= */}
        <div className="rounded-3xl border-2 border-ink bg-amber-50/80 p-4 shadow-[0_3px_0_#1e293b]">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div>
              <div className="flex items-center gap-1.5 font-display text-base font-extrabold text-amber-950">
                <span>🎬</span>
                <span>Mode Kreator &amp; Demo</span>
              </div>
              <p className="text-[11px] font-semibold text-amber-800">
                Atur materi, stan game, &amp; saldo koin bebas untuk kebutuhan perekaman video demo.
              </p>
            </div>
            <button
              onClick={() => {
                sfx("pop");
                toggleModeJuri();
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-black shadow-xs transition active:scale-95 ${
                modeJuri
                  ? "bg-amber-500 text-white ring-2 ring-amber-300"
                  : "bg-white border-2 border-ink text-slate-700 hover:bg-amber-100"
              }`}
            >
              {modeJuri ? "✓ Aktif" : "Aktifkan"}
            </button>
          </div>

          <div className="mt-3.5 space-y-3">
            {/* Kontrol Cepat Materi & Game */}
            <div>
              <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider block mb-2">
                Pintasan Buka Akses
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sfx("unlock");
                    setSemuaMateriSelesai(true);
                    showToast("✨ Semua Lapak 1, 2, 3 Selesai!");
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-white py-2 px-2 text-xs font-black text-ink shadow-[0_2px_0_#1e293b] active:translate-y-[1px]"
                >
                  <IconBook size={16} className="text-teal-700" />
                  <span>Selesaikan Materi</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx("unlock");
                    setSemuaGameTerbuka(true);
                    showToast("🎪 Semua Stan Game Terbuka!");
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-white py-2 px-2 text-xs font-black text-ink shadow-[0_2px_0_#1e293b] active:translate-y-[1px]"
                >
                  <IconGame size={16} className="text-orange-600" />
                  <span>Buka Semua Game</span>
                </button>
              </div>
            </div>

            {/* Atur Koin Bebas */}
            <div className="pt-2 border-t border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
                  Atur Saldo Koin ({profil.koin} Koin)
                </span>
                <span className="text-[11px] font-bold text-amber-800">Pilih Preset:</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[50, 100, 250, 500].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => handleSetKoin(nominal)}
                    className="flex items-center justify-center gap-1 rounded-lg border border-amber-300 bg-white py-1.5 text-xs font-extrabold text-amber-950 shadow-xs hover:bg-amber-100 active:scale-95"
                  >
                    <IconCoin size={12} className="text-amber-700" />
                    <span>+{nominal}</span>
                  </button>
                ))}
              </div>

              {/* Input Koin Custom */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Ketik koin bebas..."
                    value={inputKoin}
                    onChange={(e) => setInputKoin(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const num = parseInt(inputKoin, 10);
                    if (!isNaN(num)) {
                      handleSetKoin(num);
                      setInputKoin("");
                    }
                  }}
                  className="rounded-xl border-2 border-ink bg-amber-400 px-3.5 py-1.5 text-xs font-black text-amber-950 shadow-[0_2px_0_#1e293b] active:translate-y-[1px]"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifikasi Demo */}
      {toastDemo && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div className="animate-pop rounded-full border-2 border-ink bg-ink px-4 py-2 text-xs font-black text-white shadow-lg">
            {toastDemo}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}


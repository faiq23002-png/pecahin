import React from "react";
import { useApp } from "@/lib/profil-context";
import { useRouter } from "@/lib/router-context";
import { MATERI, SOAL, MASKOT_STAGES, ITEM_TOKO } from "@/lib/content";
import { hitungPenguasaan, persenPenguasaan, miskonsepsiTersering } from "@/lib/diagnosis";
import { poinMateri, poinGame, POIN_GAME_MAX, POIN_LATIHAN_MAX, GAME_ROUNDS } from "@/lib/poin";
import { BottomNav } from "@/components/BottomNav";

export default function RaporCetak() {
  const { profil, riwayat, progress, game, harian, items, poin, maskotLevel } = useApp();
  const { goBack } = useRouter();

  if (!profil) return null;

  const stat = hitungPenguasaan(riwayat);
  const stageNow = MASKOT_STAGES.find((s) => s.level === maskotLevel) ?? MASKOT_STAGES[0];
  const topMiskonsepsi = miskonsepsiTersering(riwayat).slice(0, 4);

  // Perhitungan Data Lapak Materi
  const materiData = MATERI.map((m) => {
    const soalIds = SOAL.filter((s) => s.materiId === m.id).map((s) => s.id);
    const p = progress[m.id];
    const totalSoal = soalIds.length || 10;
    const poin = poinMateri(riwayat, soalIds);
    const persen = Math.round((poin / totalSoal) * 100);
    const selesai = !!p?.selesai;
    return {
      ...m,
      poin,
      totalSoal,
      persen,
      selesai,
      status: selesai ? "Selesai" : p?.tahapBelajar !== "terkunci" ? "Sedang Belajar" : "Terkunci",
    };
  });

  const totalPoinLapak = materiData.reduce((acc, m) => acc + m.poin, 0);
  const totalItemSoal = 30; // 3 materi x 10 soal

  // Game data
  const gameDefs = [
    { id: "g1", nama: "Lapak 1: Bagi Rata Buah 🍉", max: POIN_GAME_MAX["g1"] ?? 15 },
    { id: "g2", nama: "Lapak 2: Banding & Jodoh Kue 🍰", max: POIN_GAME_MAX["g2"] ?? 15 },
    { id: "g3", nama: "Lapak 3: Pesanan Tambah Porsi 🧺", max: POIN_GAME_MAX["g3"] ?? 15 },
    { id: "gCampuran", nama: "Panggung Utama: Grand Bazaar 🏆", max: POIN_GAME_MAX["gCampuran"] ?? 25 },
  ];

  const totalPoinGame = poinGame(game);

  // Hari aktif belajar
  const hariAktif = Object.keys(harian).length || profil.streak || 1;

  // Tanggal cetak format Indonesia
  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Souvenir & Koleksi Pasar
  const koleksiSouvenir = items.map((id) => ITEM_TOKO.find((it) => it.id === id)).filter(Boolean);

  // Rekomendasi Pedagogis Guru/Pendamping
  let rekomendasi = "Hebat! Ananda menunjukkan pemahaman yang sangat baik dalam konsep dasar pecahan di pasar.";
  if (topMiskonsepsi.length > 0) {
    const utama = topMiskonsepsi[0].nama;
    rekomendasi = `Disarankan memberikan pendampingan khusus pada materi terkait "${utama}". Ajak ananda mempraktikkan langsung dengan benda konkret seperti memotong buah semangka atau kue lipat sama besar di rumah.`;
  } else if (poin < 30) {
    rekomendasi = "Ajak ananda rutin berlatih 10–15 menit setiap hari di Lapak Buah & Kue untuk memperkuat pemahaman kesamaan ukuran bagian pecahan.";
  }

  return (
    <div className="report-root bg-slate-200 min-h-screen py-4 px-2 sm:py-6 sm:px-4 flex flex-col items-center font-sans text-slate-800">
      <style>{`
        /* ===== SCREEN / MOBILE VIEW (RESPONSIF PORTRAIT) ===== */
        .a4-page {
          background: #ffffff;
          width: 100%;
          max-width: 210mm;
          min-height: auto;
          padding: 16px;
          margin-bottom: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: relative;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .a4-page {
            padding: 12mm 15mm 12mm 15mm;
            min-height: 297mm;
            border-radius: 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          }
        }

        .no-print-toolbar {
          position: sticky;
          top: 10px;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid #cbd5e1;
          border-radius: 50px;
          padding: 8px 16px;
          margin-bottom: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 210mm;
        }

        /* ===== PRINT / PDF VIEW (STRICT SINGLE A4 PAGE) ===== */
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background: #ffffff !important;
            padding: 0 !important;
          }
          .report-root {
            background: #ffffff !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .no-print-toolbar, nav[aria-label="Navigasi utama"] {
            display: none !important;
          }
          .a4-page {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            border-radius: 0 !important;
          }
          tr, table, .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* Floating Toolbar Unduh / Cetak PDF */}
      <div className="no-print-toolbar">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <button
            onClick={() => goBack("menu")}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition"
          >
            <span>‹</span> Kembali
          </button>
          <span className="hidden sm:inline">📄 Rapor Belajar &amp; Cetak PDF PECAH-IN</span>
          <span className="sm:hidden text-[11px]">📄 Rapor Belajar</span>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md flex items-center gap-1.5 transition active:scale-95"
        >
          <span>⬇️</span>
          <span>Simpan PDF</span>
        </button>
      </div>

      {/* ======================= DOKUMEN RAPOR (A4 PORTRAIT) ======================= */}
      <div className="a4-page flex flex-col justify-between" id="halaman-rapor">
        <div>
          {/* Header Laporan */}
          <div className="flex items-center gap-3 border-b-[2.5px] border-orange-500 pb-2.5 mb-3">
            <div className="text-3xl sm:text-4xl leading-none">🍉</div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase leading-snug">
                LAPORAN PERKEMBANGAN BELAJAR MATEMATIKA — PECAHAN
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500">
                PECAH-IN — Petualangan Pecahan di Pasar Tradisional Ramah Anak (Kelas 3–4 SD)
              </p>
            </div>
          </div>

          {/* Card Profil Anak */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 grid grid-cols-2 sm:flex sm:justify-between gap-2 sm:gap-3 mb-3 text-xs text-slate-500">
            <div>
              Nama Pedagang Cilik:
              <b className="block text-slate-900 text-xs sm:text-sm font-extrabold mt-0.5 truncate">{profil.nama}</b>
            </div>
            <div>
              Aktivitas:
              <b className="block text-slate-900 text-xs sm:text-sm font-extrabold mt-0.5">
                🔥 {profil.streak} Hari Streak ({hariAktif} Hari Aktif)
              </b>
            </div>
            <div>
              Pangkat Pasar:
              <b className="block text-orange-600 text-xs sm:text-sm font-extrabold mt-0.5">
                ⭐ {poin}/100 ({stageNow.nama})
              </b>
            </div>
            <div>
              Tanggal Cetak:
              <b className="block text-slate-900 text-xs sm:text-sm font-extrabold mt-0.5">{tanggalCetak}</b>
            </div>
          </div>

          {/* 4 Kotak Statistik Cepat */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2 text-center">
              <div className="text-lg sm:text-xl font-black text-orange-600 leading-tight">{poin}/100</div>
              <div className="text-[9px] font-bold text-amber-900 uppercase tracking-wide mt-0.5">
                Total Poin Pasar
              </div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2 text-center">
              <div className="text-lg sm:text-xl font-black text-orange-600 leading-tight">
                {totalPoinLapak}/{POIN_LATIHAN_MAX}
              </div>
              <div className="text-[9px] font-bold text-amber-900 uppercase tracking-wide mt-0.5">
                Skor Ayo Latihan
              </div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2 text-center">
              <div className="text-lg sm:text-xl font-black text-orange-600 leading-tight">
                {totalPoinGame}/70
              </div>
              <div className="text-[9px] font-bold text-amber-900 uppercase tracking-wide mt-0.5">
                Skor Stan Game
              </div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2 text-center">
              <div className="text-lg sm:text-xl font-black text-orange-600 leading-tight">
                {items.length} Item
              </div>
              <div className="text-[9px] font-bold text-amber-900 uppercase tracking-wide mt-0.5">
                Koleksi Souvenir
              </div>
            </div>
          </div>

          {/* Section: Capaian & Penguasaan */}
          <div className="avoid-break">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-l-4 border-orange-500 pl-2 mb-2">
              Capaian &amp; Penguasaan Konsep Pecahan Siswa
            </h2>

            {/* Overall Progress Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-2.5 flex items-center gap-2.5">
              <div className="text-[11px] font-extrabold text-slate-800 whitespace-nowrap">
                Overall:
              </div>
              <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (poin / 100) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] font-extrabold text-orange-600 whitespace-nowrap">
                {poin}% ({stageNow.nama})
              </div>
            </div>

            {/* A1. Tabel Capaian Per Lapak Materi */}
            <h3 className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-700 mb-1">
              A1. Capaian Penguasaan Per Lapak Materi (Fase B Kelas 3–4)
            </h3>
            <div className="w-full overflow-x-auto mb-2.5">
              <table className="w-full border-collapse text-[9.5px] sm:text-[10px]">
                <thead>
                  <tr className="bg-orange-500 text-white font-extrabold">
                    <th className="p-1.5 text-left">Lapak Materi</th>
                    <th className="p-1.5 text-left w-1/4">Progress Latihan</th>
                    <th className="p-1.5 text-center">Poin / Soal</th>
                    <th className="p-1.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {materiData.map((m, idx) => (
                    <tr key={m.id} className={idx % 2 === 1 ? "bg-amber-50/50" : "bg-white"}>
                      <td className="p-1.5 border-b border-slate-100 font-bold text-slate-800">
                        {m.judul}
                      </td>
                      <td className="p-1.5 border-b border-slate-100">
                        <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full"
                            style={{ width: `${m.persen}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-1.5 border-b border-slate-100 text-center font-bold text-slate-700">
                        <b>{m.poin}</b>/{m.totalSoal} ({m.persen}%)
                      </td>
                      <td className="p-1.5 border-b border-slate-100 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-extrabold ${
                            m.selesai
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-slate-100 text-slate-600 border border-slate-300"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-amber-100/70 font-extrabold text-slate-900 border-t border-amber-300">
                    <td colSpan={2} className="p-1.5 text-left">
                      Total Akumulasi Latihan
                    </td>
                    <td className="p-1.5 text-center text-orange-700">
                      {totalPoinLapak} / {totalItemSoal} Soal
                    </td>
                    <td className="p-1.5 text-center">
                      {totalPoinLapak >= totalItemSoal ? "100%" : `${Math.round((totalPoinLapak / totalItemSoal) * 100)}%`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* A2. Penguasaan 3 Domain Diagnosis & Stan Game */}
            <h3 className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-700 mb-1">
              A2. Diagnosis 3 Domain Kompetensi &amp; Stan Game Pasar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
              {/* Kolom Kiri: 3 Domain */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <div className="text-[10px] font-bold text-slate-800 mb-1.5">
                  🎯 Penguasaan Domain Kognitif:
                </div>
                {(["konsep", "prinsip", "verbal"] as const).map((d) => {
                  const s = stat[d];
                  const pct = persenPenguasaan(s);
                  const icon = d === "konsep" ? "🧠" : d === "prinsip" ? "🧮" : "💬";
                  const label = d === "konsep" ? "Konsep Dasar" : d === "prinsip" ? "Prinsip Operasi" : "Verbal / Cerita";
                  return (
                    <div key={d} className="mb-1.5 text-[9px] sm:text-[9.5px]">
                      <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                        <span>
                          {icon} {label}
                        </span>
                        <span>{pct < 0 ? "Belum ada" : `${s.benar}/${s.total} (${pct}%)`}</span>
                      </div>
                      <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full"
                          style={{ width: `${pct < 0 ? 0 : pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Kolom Kanan: Stan Game Festival */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                <div className="text-[10px] font-bold text-slate-800 mb-1.5">
                  🎪 Rekor Stan Game Festival:
                </div>
                {gameDefs.map((g) => {
                  const gd = game[g.id];
                  const skor = gd?.skorTerbaik ?? 0;
                  const didapat = Math.round((g.max * Math.min(skor, GAME_ROUNDS)) / GAME_ROUNDS);
                  return (
                    <div key={g.id} className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-0 text-[9px] sm:text-[9.5px]">
                      <span className="font-semibold text-slate-700 truncate pr-2">{g.nama}</span>
                      <span className="font-extrabold text-orange-600 whitespace-nowrap">
                        {didapat} / {g.max} poin
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* A3. Deteksi Miskonsepsi */}
            <h3 className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-700 mb-1">
              A3. Analisis Miskonsepsi Siswa
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 mb-2">
              <div className="text-[9px] font-bold text-slate-700 mb-1">
                Pola Kesalahan / Pengecoh Terpilih:
              </div>
              {topMiskonsepsi.length === 0 ? (
                <div className="text-[9px] text-green-700 font-bold">
                  ✅ Luar biasa! Belum terdeteksi adanya miskonsepsi yang berulang.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {topMiskonsepsi.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-bold"
                    >
                      <span>⚠️</span>
                      <span>
                        {t.nama} ({t.count}× terdeteksi)
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* A4. Koleksi Souvenir Pasar (Apresiasi Ketekunan & Koin Kejujuran) */}
            <h3 className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-700 mb-1">
              A4. Koleksi Souvenir Pasar (Apresiasi Ketekunan Koin Kejujuran)
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 sm:p-2.5 mb-2">
              <div className="text-[9px] text-slate-600 mb-1.5">
                Item dagangan &amp; souvenir yang berhasil ditukarkan dari hasil ketekunan mengumpulkan koin pasar:
              </div>
              {koleksiSouvenir.length === 0 ? (
                <div className="text-[9px] sm:text-[9.5px] text-slate-500 italic">
                  Belum ada souvenir yang dibeli. Terus selesaikan tantangan untuk mendapatkan koin belanja!
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {koleksiSouvenir.map((it) => (
                    <span
                      key={it?.id}
                      className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-800 shadow-2xs"
                    >
                      <span className="text-sm">{it?.ikon}</span>
                      <span>{it?.nama}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rekomendasi Pedagogis Guru/Pendamping */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-2 text-[9.5px] sm:text-[10px] flex gap-2 items-start mb-3">
              <span className="text-sm leading-none">💡</span>
              <p className="text-amber-900 leading-relaxed">
                <strong>Rekomendasi Pembelajaran:</strong> {rekomendasi}
              </p>
            </div>

            {/* Validasi & Tanda Tangan Kolaborasi Sekolah - Rumah */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-2">
              <div className="flex justify-between px-4 text-[9.5px] text-slate-700">
                <div className="text-center w-36">
                  <div>Orang Tua / Wali Murid,</div>
                  <div className="mt-10 border-b border-slate-400"></div>
                  <div className="mt-1 text-[8.5px] text-slate-500">( Tanda Tangan &amp; Nama )</div>
                </div>
                <div className="text-center w-36">
                  <div>Guru / Pembimbing Matematika,</div>
                  <div className="mt-10 border-b border-slate-400"></div>
                  <div className="mt-1 text-[8.5px] text-slate-500">( Tanda Tangan &amp; NIP )</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Dokumen */}
        <div className="border-t border-slate-200 pt-1.5 flex justify-between text-[8.5px] text-slate-400 mt-2">
          <span>PECAH-IN — Portofolio Pembelajaran Matematika Kontekstual Pasar (100% Offline Safe)</span>
          <span>Dokumen Resmi Capaian Siswa</span>
        </div>
      </div>

      <div className="print:hidden w-full h-24" />
      <BottomNav />
    </div>
  );
}

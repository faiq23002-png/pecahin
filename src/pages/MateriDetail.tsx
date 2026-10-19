/** Detail materi: 3 tahap (Ayo Belajar → Ayo Coba → Ayo Latihan). */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { getMateri, getSoalByMateri, PELAJARAN, MATERI } from "@/lib/content";
import type { Soal, StatusTahap } from "@/lib/types";
import { shuffle } from "@/lib/util";
import { sfx, playSoal, stopSoal } from "@/lib/audio";
import { operandDari } from "@/lib/operand";
import { statusSoalMateri } from "@/lib/latihan";
import { KRITERIA_SELESAI } from "@/lib/progress";
import { TahapTabs } from "@/components/TahapTabs";
import { FractionShape, ArsirShape, BagiVisual, type ObjKind } from "@/components/FractionShape";
import { NumberLine } from "@/components/NumberLine";
import { AnswerPill, type PillState } from "@/components/AnswerPill";
import { PrimaryButton, Card, ProgressBar, StackedFraction, FractionText } from "@/components/ui";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { IconBack, IconSound, IconLock } from "@/components/icons";
import { StallCard } from "@/components/MarketBoothHeader";
import { BottomNav } from "@/components/BottomNav";
import { Awning, HangingSign } from "@/components/MarketProps";
import { Fraction3DSlice } from "@/components/Fraction3DSlice";

const OBJ: Record<string, ObjKind> = { m1: "semangka", m2: "kue-tart", m3: "kue-batang" };

export const FRUITS: Array<{ id: ObjKind; name: string; icon: string }> = [
  { id: "semangka", name: "Semangka", icon: "🍉" },
  { id: "jeruk", name: "Jeruk", icon: "🍊" },
  { id: "apel", name: "Apel", icon: "🍎" },
  { id: "melon", name: "Melon", icon: "🍈" },
  { id: "naga", name: "Buah Naga", icon: "🐲" },
];

export default function MateriDetail({
  materiId,
  initialTahap,
}: {
  materiId: string;
  initialTahap?: string;
}) {
  const { navigate, goBack } = useRouter();
  const { progress, selesaikanTahap, modeJuri, catatTerakhirDibuka } = useApp();
  const mat = getMateri(materiId)!;
  const prog = progress[materiId] ?? { tahapBelajar: "terkunci", tahapCoba: "terkunci", tahapLatihan: "terkunci" };

  useEffect(() => {
    if (mat) {
      catatTerakhirDibuka({
        type: "materi",
        id: materiId,
        route: `materi${mat.urutan}`,
        nama: mat.judul,
        sub: materiId === "m1" ? "Lapak 1 · Toko Buah Segar" : `Lapak Materi ${mat.urutan}`,
        emoji: materiId === "m1" ? "🧺" : materiId === "m2" ? "🍰" : "📜",
        waktu: new Date().toISOString(),
      });
    }
  }, [materiId]);

  const [tahap, setTahap] = useState<string>(() => {
    if (initialTahap && ["tahapBelajar", "tahapCoba", "tahapLatihan"].includes(initialTahap)) {
      if (modeJuri || prog[initialTahap as keyof typeof prog] !== "terkunci") {
        return initialTahap;
      }
    }
    return prog.tahapBelajar === "terkunci"
      ? "tahapBelajar"
      : prog.tahapCoba === "terbuka"
        ? "tahapCoba"
        : "tahapBelajar";
  });

  useEffect(() => {
    if (initialTahap && ["tahapBelajar", "tahapCoba", "tahapLatihan"].includes(initialTahap)) {
      if (modeJuri || prog[initialTahap as keyof typeof prog] !== "terkunci") {
        setTahap(initialTahap);
      }
    }
  }, [initialTahap, materiId]);

  const status: Record<string, StatusTahap> = modeJuri
    ? { tahapBelajar: "selesai", tahapCoba: "terbuka", tahapLatihan: "terbuka" }
    : { tahapBelajar: prog.tahapBelajar, tahapCoba: prog.tahapCoba, tahapLatihan: prog.tahapLatihan };

  const itemEmoji = materiId === "m1" ? "🍉" : materiId === "m2" ? "🍰" : "📜";
  const prev = MATERI.find((m) => m.urutan === mat.urutan - 1);

  // Guard: materi terkunci tidak bisa dibuka langsung (deep-link)
  if (prog.tahapBelajar === "terkunci" && !modeJuri) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 pb-24 text-center select-none relative">
        {/* Background Pasar Lapak Materi */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <img
            src="/bgpasar.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-slate-900/30 pointer-events-none" />
        </div>

        <div className="w-full max-w-sm rounded-3xl border-2 border-ink bg-white/95 p-6 shadow-[0_5px_0_#1e293b] backdrop-blur-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-slate-300 bg-slate-100 text-slate-500 shadow-inner">
            <IconLock size={36} />
          </div>
          <div className="mt-4 font-display text-xl font-extrabold text-ink">Lapak Masih Terkunci 🔒</div>
          <p className="mt-1.5 text-xs font-bold text-slate-600 leading-relaxed">
            Selesaikan {prev ? prev.judul : "lapak sebelumnya"} dulu, ya!
          </p>
          <PrimaryButton onClick={() => goBack("materi")} className="mt-5 w-full">
            Ke Peta Pasar
          </PrimaryButton>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-36 select-none relative">
      {/* Background Pasar Lapak Materi */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bgpasar.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fef08a" />
        {/* Tombol kembali floating di kiri atas kanopi */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => goBack("materi")}
            aria-label="Kembali"
            className="absolute left-3 top-1 z-20 grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
          >
            <IconBack size={20} className="text-ink" />
          </button>
          {/* Papan judul kayu gantung di tengah, dengan ruang padding aman */}
          <div className="-mt-1 flex items-center justify-center px-14 pb-1">
            <HangingSign rope={12} className="max-w-[210px] sm:max-w-xs">
              <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)] truncate block">
                {mat.judul}
              </span>
            </HangingSign>
          </div>
        </div>
      </div>


      <div className="mx-auto max-w-md px-4 mt-2">
        <TahapTabs status={status} active={tahap} onSelect={setTahap} />

        <div className="mt-4">
          {tahap === "tahapBelajar" && (
            <Belajar
              materiId={materiId}
              onLanjut={() => {
                selesaikanTahap(materiId, "tahapBelajar");
                sfx("unlock");
                setTahap("tahapCoba");
              }}
            />
          )}
          {tahap === "tahapCoba" && (
            <Coba
              materiId={materiId}
              onLanjut={() => {
                selesaikanTahap(materiId, "tahapCoba");
                sfx("unlock");
                setTahap("tahapLatihan");
              }}
            />
          )}
          {tahap === "tahapLatihan" && <Latihan materiId={materiId} />}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function BelajarM1({ pel }: { pel: any }) {
  const [selectedFruit, setSelectedFruit] = useState<ObjKind>("semangka");
  const [k1, setK1] = useState(1);
  const [equal, setEqual] = useState(true);
  const [highlight, setHighlight] = useState<"pembilang" | "penyebut" | null>("pembilang");

  const curFruit = FRUITS.find((f) => f.id === selectedFruit) ?? FRUITS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Kartu 1: Bagian dari Keseluruhan */}
      <StallCard icon="🧺" title="Etalase Toko Buah Segar" tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[0].teks}</p>

        {/* Pemilih Buah di Toko Buah */}
        <div className="mb-3.5 rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
          <div className="text-xs font-black text-amber-950 mb-2 flex items-center gap-1.5">
            <span className="text-sm">🧺</span>
            <span>Pilih Aneka Buah di Toko:</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {FRUITS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setSelectedFruit(f.id);
                  sfx("pop");
                }}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 px-1 text-xs font-black transition border ${
                  selectedFruit === f.id
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-sm scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="text-lg leading-none">{f.icon}</span>
                <span className="text-[10px] font-bold truncate max-w-full">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-teal-50/80 p-3 border border-teal-200 flex flex-col items-center">
          <div className="text-xs font-bold text-teal-800 mb-2">Cobalah Ubah Bagian Terarsir ({curFruit.name}):</div>
          <div className="flex gap-1.5 mb-3">
            {[1, 2, 3, 4].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => { setK1(v); sfx("pop"); }}
                className={`px-3 py-1 rounded-xl text-xs font-black border transition ${k1 === v
                  ? "bg-teal-600 text-white border-teal-700 shadow"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {v}/4
              </button>
            ))}
          </div>

          {/* Visual 3D Interaktif Three.js dengan Swipe Potong Pisau */}
          <div className="w-full flex flex-col items-center">
            <Fraction3DSlice
              key={`${selectedFruit}-${k1}`}
              kind={selectedFruit}
              n={4}
              k={k1}
              onSliceCut={() => {
                setK1((prev) => (prev % 4) + 1);
              }}
              className="w-full"
            />
            <div className="mt-2 text-center bg-white py-2 px-4 rounded-2xl border border-teal-200 shadow-sm w-full">
              <div className="font-display text-2xl font-extrabold text-teal-700">{k1}/4 Bagian</div>
              <div className="text-xs font-bold text-slate-600">
                {k1} dari 4 potong {curFruit.name.toLowerCase()} 3D terangkat keluar
              </div>
            </div>
          </div>
        </div>
      </StallCard>

      {/* Kartu 2: Bagi Sama Besar */}
      <StallCard icon="⚖️" title={pel.belajar[1].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[1].teks}</p>

        <div className="rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
          <div className="flex justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setEqual(true); sfx("pop"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${equal ? "bg-green-600 text-white shadow" : "bg-white text-slate-700 border"
                }`}
            >
              <span>⚖️ Adil (Sama Besar)</span>
            </button>
            <button
              type="button"
              onClick={() => { setEqual(false); sfx("pop"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${!equal ? "bg-red-600 text-white shadow" : "bg-white text-slate-700 border"
                }`}
            >
              <span>❌ Tidak Adil (Beda Ukuran)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 items-center gap-3">
            <div className="h-28">
              <BagiVisual kind={selectedFruit} parts={4} equal={equal} />
            </div>
            <div className={`p-3 rounded-2xl text-xs font-bold border ${equal ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
              }`}>
              {equal ? (
                <div>
                  <div className="text-sm font-extrabold mb-1">✅ INI PECAHAN</div>
                  Setiap potongan {curFruit.name.toLowerCase()} persis <strong>1/4 sama besar</strong>.
                </div>
              ) : (
                <div>
                  <div className="text-sm font-extrabold mb-1">❌ BUKAN PECAHAN</div>
                  Ukurannya beda-beda, jadi <strong>tidak bisa</strong> dinamai pecahan!
                </div>
              )}
            </div>
          </div>
        </div>
      </StallCard>

      {/* Kartu 3: Pembilang & Penyebut */}
      <StallCard icon="📐" title={pel.belajar[2].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[2].teks}</p>

        <div className="rounded-2xl bg-white p-3 border-2 border-teal-200 shadow-sm flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-2">Tap bagian pecahan untuk melihat artinya:</div>

          <div className="flex items-center justify-around w-full max-w-xs">
            {/* Display Pecahan Interaktif */}
            <div className="flex flex-col items-center font-display text-4xl font-extrabold">
              <button
                type="button"
                onClick={() => { setHighlight("pembilang"); sfx("tap"); }}
                className={`px-4 py-1 rounded-xl transition ${highlight === "pembilang"
                  ? "bg-amber-400 text-amber-950 ring-4 ring-amber-300 shadow scale-110"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                3
              </button>
              <div className="h-1.5 w-16 bg-slate-800 my-1 rounded-full" />
              <button
                type="button"
                onClick={() => { setHighlight("penyebut"); sfx("tap"); }}
                className={`px-4 py-1 rounded-xl transition ${highlight === "penyebut"
                  ? "bg-teal-600 text-white ring-4 ring-teal-300 shadow scale-110"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
              >
                4
              </button>
            </div>

            {/* Shape Visual */}
            <div className="h-24 w-24">
              <FractionShape kind={selectedFruit} n={4} k={highlight === "penyebut" ? 4 : 3} />
            </div>
          </div>

          <div className="mt-4 w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 text-center">
            {highlight === "pembilang" ? (
              <span className="text-amber-900">
                ⭐ <strong>Pembilang (3)</strong> = Angka atas. Jumlah bagian {curFruit.name.toLowerCase()} yang diarsir/diambil (3 potong).
              </span>
            ) : (
              <span className="text-teal-800">
                📦 <strong>Penyebut (4)</strong> = Angka bawah. Jumlah SELURUH potongan {curFruit.name.toLowerCase()} utuh (4 potong).
              </span>
            )}
          </div>
        </div>
      </StallCard>
    </div>
  );
}

function BelajarM2({ pel }: { pel: any }) {
  const [k1, setK1] = useState(2);
  const [k2, setK2] = useState(4);
  const [denom, setDenom] = useState<2 | 4 | 8>(4);
  const [senilaiIdx, setSenilaiIdx] = useState(1);
  const senilaiList = [
    { label: "1/2", k: 1, n: 2, text: "1 dari 2 potong" },
    { label: "2/4", k: 2, n: 4, text: "2 dari 4 potong" },
    { label: "3/6", k: 3, n: 6, text: "3 dari 6 potong" },
    { label: "4/8", k: 4, n: 8, text: "4 dari 8 potong" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Kartu 1: Banding Penyebut Sama */}
      <StallCard icon="🍊" title={pel.belajar[0].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[0].teks}</p>

        <div className="rounded-2xl bg-teal-50/80 p-3 border border-teal-200">
          <div className="text-xs font-bold text-teal-800 mb-2 text-center">Bandingkan 2 Potongan Jeruk:</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-teal-100">
              <span className="text-xs font-extrabold text-teal-700 mb-1">Lapak A ({k1}/5)</span>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setK1(v); sfx("pop"); }}
                    className={`h-6 w-6 rounded-lg text-xs font-bold ${k1 === v ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="h-20 w-20">
                <FractionShape kind="jeruk" n={5} k={k1} />
              </div>
            </div>

            <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-teal-100">
              <span className="text-xs font-extrabold text-orange-700 mb-1">Lapak B ({k2}/5)</span>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setK2(v); sfx("pop"); }}
                    className={`h-6 w-6 rounded-lg text-xs font-bold ${k2 === v ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="h-20 w-20">
                <FractionShape kind="jeruk" n={5} k={k2} />
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-teal-200 text-center font-display text-base font-extrabold text-slate-800 flex items-center justify-center gap-2">
            <span>{k1}/5</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950 text-xl font-black">
              {k1 > k2 ? "> Lebih Besar" : k1 < k2 ? "< Lebih Kecil" : "= Sama"}
            </span>
            <span>{k2}/5</span>
          </div>
        </div>
      </StallCard>

      {/* Kartu 2: Pembilang Satu (Ukuran Potongan) */}
      <StallCard icon="🍕" title={pel.belajar[1].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[1].teks}</p>

        <div className="rounded-2xl bg-amber-50/80 p-3 border border-amber-200 flex flex-col items-center">
          <div className="text-xs font-bold text-amber-900 mb-2">Pilih berapa orang yang berbagi 1 Pizza:</div>
          <div className="flex gap-2 mb-3">
            {[2, 4, 8].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => { setDenom(d as 2 | 4 | 8); sfx("pop"); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border ${denom === d
                  ? "bg-amber-500 text-white border-amber-600 shadow"
                  : "bg-white text-slate-700 border-slate-200"
                  }`}
              >
                1/{d} ({d} orang)
              </button>
            ))}
          </div>

          <div className="w-full bg-white p-3 rounded-2xl border border-amber-200 flex flex-col items-center">
            <Fraction3DSlice kind="pizza" n={denom} k={1} allowSwipeCut={false} className="w-full" />
            <div className="mt-2 text-xs font-bold text-slate-700 text-center">
              <div className="text-sm font-extrabold text-amber-700">1/{denom} bagian</div>
              <p>
                {denom === 8 && "🔴 Dibagi 8 orang → Potongannya KECIL!"}
                {denom === 4 && "🟡 Dibagi 4 orang → Potongannya SEDANG."}
                {denom === 2 && "🟢 Dibagi 2 orang → Potongannya PALING BESAR!"}
              </p>
            </div>
          </div>
        </div>
      </StallCard>

      {/* Kartu 3: Pecahan Senilai */}
      <StallCard icon="🍞" title={pel.belajar[2].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[2].teks}</p>

        <div className="rounded-2xl bg-white p-3 border-2 border-teal-200 shadow-sm flex flex-col items-center">
          <div className="text-xs font-bold text-slate-600 mb-2">Lihat Luas Area Terarsir yang Sama:</div>
          <div className="flex gap-1.5 mb-3">
            {senilaiList.map((item, idx) => (
              <button
                key={item.label}
                type="button"
                onClick={() => { setSenilaiIdx(idx); sfx("pop"); }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition border ${senilaiIdx === idx
                  ? "bg-teal-600 text-white border-teal-700 shadow"
                  : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 items-center gap-3 w-full bg-teal-50/50 p-3 rounded-2xl border border-teal-100">
            <div className="h-24 mx-auto">
              <FractionShape kind="roti" n={senilaiList[senilaiIdx].n} k={senilaiList[senilaiIdx].k} />
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-teal-700">{senilaiList[senilaiIdx].label}</div>
              <div className="text-xs font-bold text-slate-600 mt-1">
                {senilaiList[senilaiIdx].text}
              </div>
              <div className="mt-2 text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Luasnya persis 50% (SAMA)!
              </div>
            </div>
          </div>
        </div>
      </StallCard>
    </div>
  );
}

function BelajarM3({ pel }: { pel: any }) {
  const [added, setAdded] = useState(1);
  const [caraMode, setCaraMode] = useState<"benar" | "salah">("benar");
  const [selectedKw, setSelectedKw] = useState<number>(0);
  const keywords = [
    { kw: "Membeli lagi / Ditambah 🛒", op: "+ (Penjumlahan)", desc: "Menambahkan potongan pecahan yang sama jenisnya.", eg: "Ibu membeli 1/4 kg terigu, lalu membeli lagi 2/4 kg." },
    { kw: "Total Keseluruhan 📦", op: "+ (Penjumlahan)", desc: "Menghitung gabungan semua bagian.", eg: "Berapa total pecahan semangka di piring?" },
    { kw: "Disambung / Digabung 🔗", op: "+ (Penjumlahan)", desc: "Menyatukan dua bagian potongan.", eg: "Tali 2/6 meter disambung dengan tali 3/6 meter." },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Kartu 1: Jumlahkan Pembilang */}
      <StallCard icon="🍰" title={pel.belajar[0].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[0].teks}</p>

        <div className="rounded-2xl bg-teal-50/80 p-3 border border-teal-200">
          <div className="text-xs font-bold text-teal-800 mb-2 text-center">
            Ibu sudah punya <StackedFraction num={1} den={6} size="sm" className="text-teal-700" /> kue. Pilih berapa bagian lagi yang ditambahkan:
          </div>

          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => { setAdded(v); sfx("pop"); }}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-bold transition border ${added === v
                  ? "bg-teal-600 text-white border-teal-700 shadow"
                  : "bg-white text-slate-700 border-slate-200"
                  }`}
              >
                <StackedFraction num={v} den={6} size="sm" />
              </button>
            ))}
          </div>

          <div className="bg-white p-3 rounded-2xl border border-teal-200 flex flex-col items-center">
            <Fraction3DSlice kind="kue-batang" n={6} k={1 + added} allowSwipeCut={false} className="w-full" />
            <div className="mt-2 flex items-center justify-center gap-2 text-teal-700">
              <StackedFraction num={1} den={6} size="lg" />
              <span className="text-2xl font-black">+</span>
              <StackedFraction num={added} den={6} size="lg" />
              <span className="text-2xl font-black">=</span>
              <span className="text-amber-600"><StackedFraction num={1 + added} den={6} size="lg" /></span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-1 text-center">
              Pembilang dijumlah: (1 + {added} = {1 + added}), Penyebut TETAP (6)
            </div>
          </div>
        </div>
      </StallCard>

      {/* Kartu 2: Kenapa Penyebut Tidak Dijumlah? */}
      <StallCard icon="❓" title={pel.belajar[1].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[1].teks}</p>

        <div className="rounded-2xl bg-white p-3 border-2 border-teal-200 shadow-sm">
          <div className="flex justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => { setCaraMode("benar"); sfx("pop"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${caraMode === "benar" ? "bg-green-600 text-white shadow" : "bg-slate-100 text-slate-700"
                }`}
            >
              <span>✅ Cara BENAR (Penyebut Tetap)</span>
            </button>
            <button
              type="button"
              onClick={() => { setCaraMode("salah"); sfx("pop"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${caraMode === "salah" ? "bg-red-600 text-white shadow" : "bg-slate-100 text-slate-700"
                }`}
            >
              <span>❌ Cara SALAH (Dijumlahkan)</span>
            </button>
          </div>

          {caraMode === "benar" ? (
            <div className="p-3 bg-green-50 rounded-2xl border border-green-300 text-xs font-bold text-green-900 space-y-2">
              <div className="text-sm font-extrabold text-green-700">2/6 + 1/6 = 3/6 ✅</div>
              <p>Ukuran potongannya tetap per-enaman (1/6). Yang bertambah hanya jumlah potongannya dari 2 buah menjadi 3 buah!</p>
            </div>
          ) : (
            <div className="p-3 bg-red-50 rounded-2xl border border-red-300 text-xs font-bold text-red-900 space-y-2">
              <div className="text-sm font-extrabold text-red-700">2/6 + 1/6 ≠ 3/12 ❌</div>
              <p>Kalau penyebut dijumlah (6+6=12), ukuran potongan kue malah mengecil jadi 1/12! Itu tidak sesuai dengan kenyataan.</p>
            </div>
          )}
        </div>
      </StallCard>

      {/* Kartu 3: Kata Kunci Cerita */}
      <StallCard icon="🔑" title={pel.belajar[2].judul} tone="teal">
        <p className="text-sm font-medium text-ink mb-3">{pel.belajar[2].teks}</p>

        <div className="rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
          <div className="text-xs font-bold text-amber-900 mb-2">Tap Kata Kunci untuk Penjelasan:</div>

          <div className="flex flex-col gap-2 mb-3">
            {keywords.map((kw, i) => (
              <button
                key={kw.kw}
                type="button"
                onClick={() => { setSelectedKw(i); sfx("pop"); }}
                className={`p-2.5 rounded-xl text-xs font-extrabold text-left transition border flex items-center justify-between ${selectedKw === i
                  ? "bg-amber-400 text-amber-950 border-amber-500 shadow"
                  : "bg-white text-slate-700 border-slate-200"
                  }`}
              >
                <span>{kw.kw}</span>
                <span className="px-2 py-0.5 rounded-md bg-white/80 text-amber-900 text-[11px] font-black">
                  {kw.op}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200 text-xs font-bold text-slate-700 space-y-1">
            <div className="text-amber-800 font-extrabold text-sm">{keywords[selectedKw].kw}</div>
            <div>{keywords[selectedKw].desc}</div>
            <div className="mt-1 p-2 rounded-lg bg-slate-50 border border-slate-200 italic text-slate-600">
              Contoh: "{keywords[selectedKw].eg}"
            </div>
          </div>
        </div>
      </StallCard>
    </div>
  );
}

function Belajar({ materiId, onLanjut }: { materiId: string; onLanjut: () => void }) {
  const pel = PELAJARAN[materiId];
  return (
    <div className="flex flex-col gap-4">
      {materiId === "m1" && <BelajarM1 pel={pel} />}
      {materiId === "m2" && <BelajarM2 pel={pel} />}
      {materiId === "m3" && <BelajarM3 pel={pel} />}
      <button
        type="button"
        onClick={onLanjut}
        className="w-full wood-plank border-2 border-ink rounded-2xl py-3.5 px-6 font-display text-base font-extrabold text-white shadow-[0_4px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_2px_0_#1e293b] transition [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]"
      >
        Selesai, Lanjut ke Ayo Coba
      </button>
    </div>
  );
}

function Coba({ materiId, onLanjut }: { materiId: string; onLanjut: () => void }) {
  const pel = PELAJARAN[materiId];
  const kind = OBJ[materiId];
  const [selectedFruit, setSelectedFruit] = useState<ObjKind>("semangka");
  const [n, setN] = useState(4);
  const [k, setK] = useState(1);

  const activeKind = materiId === "m1" ? selectedFruit : kind;

  // Materi 3 (Penjumlahan) pakai konsep "Gabungkan Potongan"
  if (materiId === "m3") return <CobaM3 onLanjut={onLanjut} />;

  return (
    <div className="flex flex-col gap-4">
      <StallCard icon="🎮" title={pel.coba[0].judul} tone="teal">
        <p className="text-sm font-medium text-ink">{pel.coba[0].teks}</p>
      </StallCard>

      <StallCard icon="🍽️" title={materiId === "m1" ? "Meja Potong Toko Buah" : "Bagi & Arsir"} tone="orange">
        {materiId === "m1" && (
          <div className="mb-3.5 rounded-2xl bg-amber-50/80 p-3 border border-amber-200">
            <div className="text-xs font-black text-amber-950 mb-2 flex items-center gap-1.5">
              <span className="text-sm">🧺</span>
              <span>Pilih Buah yang Ingin Dipotong:</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {FRUITS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setSelectedFruit(f.id);
                    sfx("pop");
                  }}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 px-1 text-xs font-black transition border ${
                    selectedFruit === f.id
                      ? "bg-amber-400 text-amber-950 border-amber-500 shadow-sm scale-105"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg leading-none">{f.icon}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm font-bold text-ink">Bagi jadi berapa?</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[2, 3, 4, 5, 6, 8].map((v) => (
            <button
              key={v}
              onClick={() => {
                setN(v);
                setK(Math.min(k, v));
                sfx("pop");
              }}
              className={`h-12 w-12 rounded-full font-display text-sm font-bold ${n === v ? "bg-teal-700 text-white" : "bg-slate-100 text-ink"}`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm font-bold text-ink">Arsir berapa bagian?</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Array.from({ length: n + 1 }).map((_, v) => (
            <button
              key={v}
              onClick={() => {
                setK(v);
                sfx("pop");
              }}
              className={`h-12 min-w-12 rounded-full px-2 font-display text-sm font-bold ${k === v ? "bg-orange-500 text-white" : "bg-slate-100 text-ink"}`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Fraction3DSlice key={`${activeKind}-${n}-${k}`} kind={activeKind} n={n} k={k} allowSwipeCut={false} className="w-full" />
          <div className="mt-1 text-center">
            <div className="font-display text-4xl font-extrabold text-orange-600">{k}/{n}</div>
            <div className="text-xs font-semibold text-muted">bagian terarsir</div>
          </div>
        </div>
      </StallCard>

      {/* demo khas per materi */}
      {materiId === "m2" && (
        <Card>
          <div className="font-display text-sm font-bold text-teal-700">Pecahan Senilai</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[
              { n: 2, k: 1, label: "1/2" },
              { n: 4, k: 2, label: "2/4" },
              { n: 6, k: 3, label: "3/6" },
            ].map((d) => (
              <div key={d.label}>
                <div className="h-20"><FractionShape kind={kind} n={d.n} k={d.k} /></div>
                <div className="text-xs font-bold text-ink">{d.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-muted">Nilai sama, tulisannya beda!</p>
        </Card>
      )}

      <button
        type="button"
        onClick={onLanjut}
        className="w-full wood-plank border-2 border-ink rounded-2xl py-3.5 px-6 font-display text-base font-extrabold text-white shadow-[0_4px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_2px_0_#1e293b] transition [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]"
      >
        Selesai, Lanjut ke Ayo Latihan
      </button>
    </div>
  );
}

function CobaM3({ onLanjut }: { onLanjut: () => void }) {
  const pel = PELAJARAN.m3;
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [jawaban, setJawaban] = useState<number | null>(null);
  const [dicek, setDicek] = useState(false);
  const total = a + b;

  const opsi = useMemo(
    () =>
      shuffle([
        { num: total, den: 6, benar: true },
        { num: total, den: 12, benar: false },
        { num: a, den: 6, benar: false },
        { num: b, den: 6, benar: false },
      ]),
    [a, b],
  );

  const pilih = (v: number, isA: boolean) => {
    if (isA) setA(v);
    else setB(v);
    setJawaban(null);
    setDicek(false);
  };

  const periksa = () => {
    if (jawaban === null) return;
    setDicek(true);
    sfx(opsi[jawaban].benar ? "success" : "wrong");
  };

  const optCls = (i: number) => {
    if (!dicek) return jawaban === i ? "border-teal-700 bg-teal-50 ring-2 ring-teal-500" : "border-slate-200 bg-white";
    if (opsi[i].benar) return "border-green-600 bg-green-50";
    if (jawaban === i) return "border-red-600 bg-red-50";
    return "border-slate-200 bg-white opacity-40";
  };

  return (
    <div className="flex flex-col gap-4">
      <StallCard icon="🎮" title={pel.coba[0].judul} tone="teal">
        <p className="text-sm font-medium text-ink">{pel.coba[0].teks}</p>
      </StallCard>

      <StallCard icon="🍰" title="Gabungkan Potongan" tone="orange">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-1">Kue pertama</div>
            <div className="mb-2 flex justify-center gap-1">
              {[1, 2, 3, 4].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pilih(v, true)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold ${a === v ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="mx-auto h-20 w-20"><FractionShape kind="kue-batang" n={6} k={a} /></div>
            <div className="mt-1 text-xs font-bold text-teal-700"><StackedFraction num={a} den={6} size="sm" /></div>
          </div>

          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-1">Kue kedua</div>
            <div className="mb-2 flex justify-center gap-1">
              {[1, 2, 3, 4].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pilih(v, false)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold ${b === v ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="mx-auto h-20 w-20"><FractionShape kind="kue-batang" n={6} k={b} /></div>
            <div className="mt-1 text-xs font-bold text-orange-600"><StackedFraction num={b} den={6} size="sm" /></div>
          </div>
        </div>

        {/* rumus gabung */}
        <div className="mt-3 flex items-center justify-center gap-2 text-teal-700">
          <StackedFraction num={a} den={6} size="lg" />
          <span className="text-2xl font-black">+</span>
          <StackedFraction num={b} den={6} size="lg" />
          <span className="text-2xl font-black">=</span>
          <span className="font-display text-2xl font-black text-amber-600">?</span>
        </div>

        <div className="mt-3 text-center text-xs font-bold text-slate-600">Pilih hasil gabungannya:</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {opsi.map((o, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setJawaban(i);
                setDicek(false);
              }}
              disabled={dicek}
              className={`flex flex-col items-center rounded-xl border-2 p-2 transition ${optCls(i)}`}
            >
              <StackedFraction num={o.num} den={o.den} size="sm" />
            </button>
          ))}
        </div>

        {!dicek ? (
          <PrimaryButton onClick={periksa} disabled={jawaban === null} color="teal" className="mt-3 w-full">
            Periksa
          </PrimaryButton>
        ) : (
          <div className={`mt-3 w-full rounded-xl border p-2 text-center font-display text-sm font-black ${opsi[jawaban!].benar ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
            {opsi[jawaban!].benar ? "✓ Benar! Penyebut tetap, pembilang dijumlah." : "✗ Coba lagi: jumlahkan pembilang, penyebut tetap 6."}
          </div>
        )}
      </StallCard>

      <button
        type="button"
        onClick={onLanjut}
        className="w-full wood-plank border-2 border-ink rounded-2xl py-3.5 px-6 font-display text-base font-extrabold text-white shadow-[0_4px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_2px_0_#1e293b] transition [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]"
      >
        Selesai, Lanjut ke Ayo Latihan
      </button>
    </div>
  );
}

function parseArsir(jawaban: string, kind?: ObjKind): { kind: ObjKind; n: number; target: number } | null {
  const m = jawaban.match(/(\d+)\s*dari\s*(\d+)/);
  if (!m) return null;
  return { kind: kind ?? "semangka", n: Number(m[2]), target: Number(m[1]) };
}

function SoalVisual({ soal }: { soal: Soal }) {
  if (!soal.visual) return null;
  // Satu objek → tampilkan 3D interaktif; banyak objek (vs/penjumlahan) → 2D biar ringan
  if (soal.visual.shapes.length === 1) {
    const s = soal.visual.shapes[0];
    return (
      <div className="mt-3 rounded-2xl bg-slate-50 p-2">
        <Fraction3DSlice key={`${s.kind}-${s.n}-${s.k}`} kind={s.kind} n={s.n} k={s.k} allowSwipeCut={false} className="w-full" />
      </div>
    );
  }
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-slate-50 p-3">
      {soal.visual.shapes.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="font-display text-lg font-extrabold text-ink">
              {soal.visual!.op === "+" ? "+" : soal.visual!.op === "vs" ? "vs" : ""}
            </span>
          )}
          <div className="h-20 w-20">
            <FractionShape kind={s.kind} n={s.n} k={s.k} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function Latihan({ materiId }: { materiId: string }) {
  const { navigate } = useRouter();
  const { recordJawaban, catatJawaban, selesaikanMateri, riwayat, progress } = useApp();
  const soalList = useMemo(() => getSoalByMateri(materiId), [materiId]);
  const soalIds = useMemo(() => soalList.map((s) => s.id), [soalList]);
  const status = useMemo(() => statusSoalMateri(riwayat, soalIds), [riwayat, soalIds]);
  const benarCount = soalIds.filter((id) => status[id]?.benar).length;
  const sisaCount = soalIds.filter((id) => !status[id]?.benar).length;

  const [idx, setIdx] = useState(() => {
    const i = soalIds.findIndex((id) => !status[id]?.benar);
    return i < 0 ? 0 : i;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [estimasi, setEstimasi] = useState<number | null>(null);
  const [narasi, setNarasi] = useState(false);
  const [shaded, setShaded] = useState<Set<number>>(new Set());
  const [celeb, setCeleb] = useState<null | { title: string; sub: string; semua: boolean }>(null);

  const soal: Soal = soalList[idx];
  const sudahBenar = !!status[soal.id]?.benar && !checked;
  const pilihan = useMemo(() => shuffle(soal.pilihan), [soal.id]);
  const operand = soal.tipe === "penjumlahan" ? operandDari(soal) : null;
  const isArsir = soal.tipe === "arsir" && !!soal.interaktif;
  const arsirInfo = isArsir ? parseArsir(soal.jawabanBenar, soal.visual?.shapes[0]?.kind) : null;
  const opsiBenar = soal.pilihan.find((p) => p.benar);
  const punyaVisualOpsi = soal.pilihan.some((p) => p.visual);

  // pastikan materi ditandai selesai bila syarat sudah terpenuhi (mis. dari sesi lalu)
  useEffect(() => {
    if (benarCount >= KRITERIA_SELESAI && !progress[materiId]?.selesai) {
      selesaikanMateri(materiId, benarCount, soalList.length);
    }
    return () => {
      stopSoal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const efekBenar = (benar: boolean) => {
    sfx(benar ? "success" : "wrong");
    if (!benar) return;
    const nb = benarCount + 1;
    if (nb >= KRITERIA_SELESAI && !progress[materiId]?.selesai) {
      selesaikanMateri(materiId, nb, soalList.length);
    }
    if (nb >= soalList.length) {
      setCeleb({ title: "Sempurna! 10/10", sub: "Semua soal benar!", semua: true });
    } else if (nb === KRITERIA_SELESAI) {
      setCeleb({ title: "Materi Selesai!", sub: `Benar ${nb} dari ${soalList.length} soal`, semua: false });
    }
  };

  const periksa = () => {
    // soal mengarsir interaktif (bukan pilihan ganda)
    if (isArsir && arsirInfo) {
      if (shaded.size === 0) return;
      setChecked(true);
      const benar = shaded.size === arsirInfo.target;
      // mengarsir bagian yang TIDAK diminta (sisa) → M1A
      const misk = !benar && shaded.size === arsirInfo.n - arsirInfo.target ? "M1A" : undefined;
      catatJawaban(soal.id, benar, misk);
      efekBenar(benar);
      return;
    }
    if (!selected) return;
    setChecked(true);
    const res = recordJawaban(soal.id, selected);
    efekBenar(res.benar);
  };

  const toggleShade = (i: number) => {
    if (checked) return;
    setShaded((prev) => {
      const s = new Set(prev);
      if (s.has(i)) s.delete(i);
      else s.add(i);
      return s;
    });
    sfx("pop");
  };

  const pindah = (i: number) => {
    if (i === idx) return;
    stopSoal();
    setNarasi(false);
    setSelected(null);
    setChecked(false);
    setEstimasi(null);
    setShaded(new Set());
    setIdx(i);
    sfx("tap");
  };

  const lanjut = () => {
    stopSoal();
    setNarasi(false);
    setSelected(null);
    setChecked(false);
    setEstimasi(null);
    setShaded(new Set());
    // pindah ke soal berikutnya yang belum benar
    const sisa = soalIds.map((id, i) => ({ id, i })).filter((x) => !status[x.id]?.benar);
    if (sisa.length === 0) return;
    const sesudah = sisa.find((x) => x.i > idx);
    setIdx((sesudah ?? sisa[0]).i);
  };

  const dengarkan = () => {
    if (narasi) {
      stopSoal();
      setNarasi(false);
    } else {
      setNarasi(true);
      playSoal(soal).finally(() => setNarasi(false));
    }
  };

  const pillState = (p: { id: string; benar: boolean }): PillState => {
    if (!checked) return selected === p.id ? "selected" : "idle";
    if (p.benar) return "correct";
    if (selected === p.id) return "wrong";
    return "idle";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* kartu navigasi soal 1-10 */}
      <StallCard icon="🗺️" title="Peta Soal" tone="teal">
        <div className="flex items-center justify-between text-sm font-bold text-muted">
          <span className="text-green-700">✓ {benarCount} benar</span>
          <span>sisa {sisaCount} soal</span>
        </div>
        <ProgressBar value={(benarCount / soalList.length) * 100} className="mt-1.5" color="green" />
        <div className="mt-2.5 grid grid-cols-5 gap-2">
          {soalList.map((s, i) => {
            const stt = status[s.id];
            const cur = i === idx;
            const cls = stt?.benar
              ? "border-green-600 bg-green-500 text-white"
              : stt?.dijawab
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-slate-200 bg-white text-ink";
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pindah(i)}
                aria-label={`Soal ${i + 1}`}
                className={`relative grid h-11 place-items-center rounded-xl border-2 font-display text-base font-extrabold ${cls} ${cur ? "ring-2 ring-teal-700 ring-offset-1" : ""}`}
              >
                {i + 1}
                {stt?.benar && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-green-700 text-xs leading-none text-white">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </StallCard>

      {sudahBenar ? (
        <StallCard icon="✅" title={`Soal ${idx + 1} · Sudah Benar`} tone="teal">
          <div className="flex items-start justify-between gap-2">
            <div className="font-display text-base font-bold text-ink"><FractionText text={soal.teks} size="md" /></div>
            <button
              type="button"
              onClick={dengarkan}
              aria-label="Dengarkan soal"
              aria-pressed={narasi}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition active:scale-95 ${narasi ? "bg-teal-700 text-white animate-pulse" : "bg-teal-100 text-teal-700 hover:bg-teal-200"}`}
            >
              <IconSound size={20} />
            </button>
          </div>
          {isArsir && arsirInfo ? (
            <div className="mx-auto mt-3 h-36 w-36">
              <FractionShape kind={arsirInfo.kind} n={arsirInfo.n} k={arsirInfo.target} />
            </div>
          ) : opsiBenar?.visual ? (
            <div className="mx-auto mt-3 h-32 w-32">
              <BagiVisual kind={opsiBenar.visual.kind} parts={opsiBenar.visual.parts} equal={opsiBenar.visual.equal} />
            </div>
          ) : (
            <SoalVisual soal={soal} />
          )}
          <div className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-green-700">Jawaban: {soal.jawabanBenar}</div>
        </StallCard>
      ) : (
        <>
          <StallCard icon="✏️" title={`Soal ${idx + 1}`} tone="orange">
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-lg font-bold text-ink"><FractionText text={soal.teks} size="md" /></div>
              <button
                type="button"
                onClick={dengarkan}
                aria-label="Dengarkan soal"
                aria-pressed={narasi}
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${narasi ? "bg-teal-700 text-white" : "bg-teal-100 text-teal-700"}`}
              >
                <IconSound size={22} />
              </button>
            </div>
            {!isArsir && <SoalVisual soal={soal} />}
            {soal.kataKunci && (
              <div className="mt-2 flex flex-wrap gap-1">
                {soal.kataKunci.map((kk) => (
                  <span key={kk} className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
                    🔑 {kk}
                  </span>
                ))}
              </div>
            )}
          </StallCard>

          {isArsir && arsirInfo ? (
            <StallCard icon="🎨" title="Arsir bagiannya (tap)" tone="orange">
              <div className="mx-auto h-40 w-40">
                <ArsirShape kind={arsirInfo.kind} n={arsirInfo.n} shaded={shaded} onToggle={toggleShade} disabled={checked} />
              </div>
              {/* <div className="mt-2 text-center text-sm font-bold text-ink">
                Kamu mengarsir: {shaded.size} dari {arsirInfo.n} bagian
              </div> */}
              {checked && (
                <div className={`mt-1 text-center text-sm font-bold ${shaded.size === arsirInfo.target ? "text-green-700" : "text-red-700"}`}>
                  {shaded.size === arsirInfo.target ? "✓ Benar!" : `✗ Belum tepat. Seharusnya: arsir ${soal.jawabanBenar}`}
                </div>
              )}
            </StallCard>
          ) : (
            <>
              {punyaVisualOpsi ? (
                <div className="grid grid-cols-3 gap-2">
                  {pilihan.map((p) => {
                    const st = pillState(p);
                    const cls =
                      st === "selected"
                        ? "border-teal-700 bg-teal-50"
                        : st === "correct"
                          ? "border-green-700 bg-green-50"
                          : st === "wrong"
                            ? "border-red-700 bg-red-50"
                            : "border-slate-200 bg-white";
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => !checked && setSelected(p.id)}
                        disabled={checked}
                        aria-label={p.teks}
                        className={`relative rounded-2xl border-2 p-2 transition active:scale-[0.98] ${cls}`}
                      >
                        {p.visual ? (
                          <div className="mx-auto aspect-square w-full">
                            <BagiVisual kind={p.visual.kind} parts={p.visual.parts} equal={p.visual.equal} />
                          </div>
                        ) : (
                          <div className="grid h-24 place-items-center px-1 text-xs font-bold text-ink">{p.teks}</div>
                        )}
                        {st === "correct" && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-green-600 text-xs text-white">✓</span>}
                        {st === "wrong" && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-xs text-white">✗</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pilihan.map((p) => (
                    <AnswerPill key={p.id} label={p.teks} state={pillState(p)} onClick={() => !checked && setSelected(p.id)} disabled={checked} />
                  ))}
                </div>
              )}
            </>
          )}

          {!checked ? (
            <PrimaryButton onClick={periksa} disabled={isArsir ? shaded.size === 0 : !selected} color="teal">
              Periksa Jawaban
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={lanjut}>Soal Berikutnya ›</PrimaryButton>
          )}
        </>
      )}

      {sisaCount === 0 && (
        <button
          type="button"
          onClick={() => navigate("menu")}
          className="w-full wood-plank border-2 border-ink rounded-2xl py-3.5 px-6 font-display text-base font-extrabold text-white shadow-[0_4px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_2px_0_#1e293b] transition [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]"
        >
          Semua Selesai! Ke Menu
        </button>
      )}

      {celeb && (
        <CelebrationOverlay
          title={celeb.title}
          subtitle={celeb.sub}
          bintang={Math.min(benarCount, 3)}
          buttonLabel={celeb.semua ? "Ke Menu" : "Lanjut Latihan"}
          onClose={() => {
            const semua = celeb.semua;
            setCeleb(null);
            if (semua) navigate("menu");
          }}
        />
      )}
    </div>
  );
}

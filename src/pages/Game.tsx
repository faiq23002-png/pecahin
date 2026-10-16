/**
 * Game.tsx — Halaman Game & Lapak Jualan Pasar PECAH-IN.
 * 10 Soal per sesi dengan visual dominan, tanpa soal kembar, & mode interaktif (Arsir, Bagi Rata, Banding, Cocokkan/Tarik Garis, Susun Puzzle, Jumlah).
 */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "@/lib/router-context";
import { useApp } from "@/lib/profil-context";
import { GAMES } from "@/lib/content";
import { semuaSelesai } from "@/lib/progress";
import { shuffle } from "@/lib/util";
import { sfx } from "@/lib/audio";
import { FractionShape, ArsirShape, BagiVisual, type ObjKind } from "@/components/FractionShape";
import { Fraction3DSlice } from "@/components/Fraction3DSlice";
import { Mascot } from "@/components/Mascot";
import { PrimaryButton, ProgressBar, StackedFraction } from "@/components/ui";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { PageBoothHeader, AwningScallops } from "@/components/MarketBoothHeader";
import { IconLock, IconBack } from "@/components/icons";
import { BottomNav } from "@/components/BottomNav";
import { Awning, HangingSign } from "@/components/MarketProps";
import { GameLoadingScreen } from "@/components/GameLoadingScreen";

const ROUNDS = 10;
const BUAH: ObjKind[] = ["semangka", "jeruk", "kue-tart", "pizza", "roti", "cokelat", "keju", "kue-batang"];

function randomBuah(): ObjKind {
  return BUAH[Math.floor(Math.random() * BUAH.length)];
}

type Frac = [number, number];

/** Tipe tugas interaktif */
type Tugas =
  | {
      id: string;
      mode: "arsir";
      kind: ObjKind;
      n: number;
      k: number;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "bagiRata";
      opsi: { kind: ObjKind; parts: number; equal: boolean }[];
      benarIdx: number;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "banding";
      kind: ObjKind;
      a: Frac;
      b: Frac;
      cari: "besar" | "kecil";
      benarIdx: 0 | 1;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "cocokkan";
      pairs: { leftLabel: string; frac: Frac; kind: ObjKind }[];
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "susun";
      items: { frac: Frac; kind: ObjKind }[];
      arah: "terkecil" | "terbesar";
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "jumlah";
      kind: ObjKind;
      a: Frac;
      c: Frac;
      opsi: { n: number; k: number; label: string }[];
      benarIdx: number;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "potong";
      kind: ObjKind;
      n: number;
      k: number;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "piring";
      kind: ObjKind;
      a: Frac;
      c: Frac;
      prompt: string;
      customerSpeech: string;
    }
  | {
      id: string;
      mode: "timpa";
      kind: ObjKind;
      target: Frac;
      opsi: Frac[];
      benarIdx: number;
      prompt: string;
      customerSpeech: string;
    };

/* ==================================================== GENERATOR TUGAS UNIK */
function genArsir(usedKeys: Set<string>): Tugas | null {
  const nOptions = [3, 4, 5, 6, 8];
  const n = nOptions[Math.floor(Math.random() * nOptions.length)];
  const k = 1 + Math.floor(Math.random() * (n - 1));
  const kind = randomBuah();
  const key = `arsir-${kind}-${n}-${k}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const itemNama = kind === "semangka" ? "semangka" : kind === "pizza" ? "pizza" : kind === "roti" ? "roti" : "kue";
  return {
    id: key,
    mode: "arsir",
    kind,
    n,
    k,
    prompt: `Arsirlah ${k} dari ${n} bagian!`,
    customerSpeech: `Halo! Tolong siapkan ${k}/${n} potong ${itemNama} untukku ya!`,
  };
}

function genBagiRata(usedKeys: Set<string>): Tugas | null {
  const parts = [3, 4, 6][Math.floor(Math.random() * 3)];
  const k1 = randomBuah();
  const k2 = randomBuah();
  const k3 = randomBuah();
  const key = `bagiRata-${parts}-${k1}-${k2}-${k3}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const opsi = shuffle([
    { kind: k1, parts, equal: true },
    { kind: k2, parts, equal: false },
    { kind: k3, parts, equal: false },
  ]);
  const benarIdx = opsi.findIndex((o) => o.equal);
  return {
    id: key,
    mode: "bagiRata",
    opsi,
    benarIdx,
    prompt: "Pilih piring yang dipotong SAMA BESAR!",
    customerSpeech: "Saya mau beli makanan yang dipotong adil sama besar!",
  };
}

function genBanding(usedKeys: Set<string>): Tugas | null {
  const cari: "besar" | "kecil" = Math.random() < 0.5 ? "besar" : "kecil";
  const kind = randomBuah();
  let a: Frac, b: Frac;

  if (Math.random() < 0.5) {
    const denList = [3, 4, 6, 8];
    const d1 = denList[Math.floor(Math.random() * denList.length)];
    let d2 = denList[Math.floor(Math.random() * denList.length)];
    while (d2 === d1) d2 = denList[Math.floor(Math.random() * denList.length)];
    a = [1, Math.min(d1, d2)];
    b = [1, Math.max(d1, d2)];
  } else {
    const den = [4, 5, 6, 8][Math.floor(Math.random() * 4)];
    const p1 = 1 + Math.floor(Math.random() * (den - 2));
    const p2 = p1 + 1 + Math.floor(Math.random() * (den - p1 - 1));
    a = [p1, den];
    b = [p2, den];
  }

  const key = `banding-${kind}-${a.join("/")}-${b.join("/")}-${cari}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const va = a[0] / a[1];
  const vb = b[0] / b[1];
  const benarIdx: 0 | 1 = cari === "besar" ? (va >= vb ? 0 : 1) : (va <= vb ? 0 : 1);

  return {
    id: key,
    mode: "banding",
    kind,
    a,
    b,
    cari,
    benarIdx,
    prompt: `Pilihlah piring pecahan yang LEBIH ${cari.toUpperCase()}!`,
    customerSpeech: `Tolong pilihkan porsi piring yang lebih ${cari} ya!`,
  };
}

function genCocokkan(usedKeys: Set<string>): Tugas | null {
  const dataset: { label: string; frac: Frac }[] = shuffle<
    { label: string; frac: Frac }
  >([
    { label: "1/2", frac: [1, 2] },
    { label: "1/3", frac: [1, 3] },
    { label: "1/4", frac: [1, 4] },
    { label: "2/4", frac: [2, 4] },
    { label: "3/4", frac: [3, 4] },
    { label: "2/3", frac: [2, 3] },
    { label: "2/5", frac: [2, 5] },
    { label: "3/6", frac: [3, 6] },
  ]).slice(0, 3);


  const key = `cocokkan-${dataset.map((d) => d.label).join("-")}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const pairs = dataset.map((d) => ({
    leftLabel: d.label,
    frac: d.frac,
    kind: randomBuah(),
  }));

  return {
    id: key,
    mode: "cocokkan",
    pairs,
    prompt: "Jodohkan angka pecahan dengan piring makanan yang sesuai!",
    customerSpeech: "Bantu saya menghubungkan label harga pecahan dengan makanan di piring!",
  };
}

function genSusun(usedKeys: Set<string>): Tugas | null {
  const arah: "terkecil" | "terbesar" = Math.random() < 0.5 ? "terkecil" : "terbesar";
  const dataset: Frac[] = shuffle([
    [1, 8] as Frac,
    [1, 4] as Frac,
    [1, 2] as Frac,
    [3, 4] as Frac,
    [5, 6] as Frac,
  ]).slice(0, 3);

  const key = `susun-${dataset.map((d) => d.join("/")).join("-")}-${arah}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const items = dataset.map((frac) => ({
    frac,
    kind: randomBuah(),
  }));

  return {
    id: key,
    mode: "susun",
    items,
    arah,
    prompt: `Susun 3 piring kue dari yang ${arah.toUpperCase()} ke yang ${arah === "terkecil" ? "TERBESAR" : "TERKECIL"}!`,
    customerSpeech: `Tolong susunkan piring saji ini berurutan dari yang ${arah}!`,
  };
}

function genJumlah(usedKeys: Set<string>): Tugas | null {
  const den = [4, 5, 6, 8][Math.floor(Math.random() * 4)];
  const a = 1 + Math.floor(Math.random() * Math.floor((den - 1) / 2));
  const c = 1 + Math.floor(Math.random() * Math.floor((den - a) / 2 || 1));
  const total = a + c;

  const kind = randomBuah();
  const key = `jumlah-${kind}-${a}/${den}+${c}/${den}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);

  const opsi = shuffle([
    { n: den, k: total, label: `${total}/${den}` },
    { n: den + den, k: total, label: `${total}/${den + den}` },
    { n: total, k: total, label: `${total}/${total}` },
    { n: den, k: a, label: `${a}/${den}` },
  ]);
  const benarIdx = opsi.findIndex((o) => o.label === `${total}/${den}`);

  return {
    id: key,
    mode: "jumlah",
    kind,
    a: [a, den],
    c: [c, den],
    opsi,
    benarIdx,
    prompt: `Hitung total pesanan: ${a}/${den} + ${c}/${den} = ?`,
    customerSpeech: `Saya mau beli ${a}/${den} ditambah ${c}/${den}, berapa totalnya di piring?`,
  };
}

function genPotong(usedKeys: Set<string>): Tugas | null {
  const nOptions = [4, 6, 8];
  const n = nOptions[Math.floor(Math.random() * nOptions.length)];
  const k = 1 + Math.floor(Math.random() * (n - 1));
  const kind = randomBuah();
  const key = `potong-${kind}-${n}-${k}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);
  return {
    id: key,
    mode: "potong",
    kind,
    n,
    k,
    prompt: `Geser pisau 🔪 untuk mengambil ${k} dari ${n} potong!`,
    customerSpeech: `Tolong ambilkan saya ${k}/${n} potong, pakai pisau ya! 🔪`,
  };
}

function genPiring(usedKeys: Set<string>): Tugas | null {
  const den = [4, 5, 6, 8][Math.floor(Math.random() * 4)];
  const a = 1 + Math.floor(Math.random() * Math.floor((den - 1) / 2));
  let c = 1 + Math.floor(Math.random() * Math.floor((den - 1) / 2));
  if (a + c >= den) c = Math.max(1, den - 1 - a);
  const kind = randomBuah();
  const key = `piring-${kind}-${a}/${den}+${c}/${den}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);
  return {
    id: key,
    mode: "piring",
    kind,
    a: [a, den],
    c: [c, den],
    prompt: "Seret kedua piring makanan ke piring saji untuk digabung!",
    customerSpeech: `Gabungkan ${a}/${den} dan ${c}/${den} ke piring saji ya!`,
  };
}

function genTimpa(usedKeys: Set<string>): Tugas | null {
  const kind = randomBuah();
  // [pembilang, penyebut]: 2/4 (senilai 1/2), 1/3, 2/3
  const opsi = shuffle<Frac>([[2, 4], [1, 3], [2, 3]]);
  const benarIdx = opsi.findIndex(([num, den]) => num === 2 && den === 4);
  const key = `timpa-${kind}-${opsi.map((f) => f.join("/")).join("-")}`;
  if (usedKeys.has(key)) return null;
  usedKeys.add(key);
  return {
    id: key,
    mode: "timpa",
    kind,
    target: [1, 2], // 1/2
    opsi,
    benarIdx,
    prompt: "Seret kue yang SENILAI ke atas kue 1/2!",
    customerSpeech: "Cari kue yang nilainya sama dengan 1/2, lalu timpa ke atasnya!",
  };
}

/** Generate 10 soal unik per sesi game (Anti-pengulangan dengan 6 variasi mode interaktif) */
function generate10UniqueRounds(gameId: string): Tugas[] {
  const usedKeys = new Set<string>();
  const rounds: Tugas[] = [];

  const allGenerators = [
    () => genArsir(usedKeys),
    () => genBagiRata(usedKeys),
    () => genBanding(usedKeys),
    () => genCocokkan(usedKeys),
    () => genSusun(usedKeys),
    () => genJumlah(usedKeys),
    () => genPotong(usedKeys),
    () => genPiring(usedKeys),
    () => genTimpa(usedKeys),
  ];

  const focusByGame: Record<string, (() => Tugas | null)[]> = {
    // Lapak 1 — Kenal Pecahan & Bagi Rata
    g1: [
      () => genPotong(usedKeys),
      () => genArsir(usedKeys),
      () => genBagiRata(usedKeys),
      () => genCocokkan(usedKeys),
    ],
    // Lapak 2 — Banding, Urut & Senilai
    g2: [
      () => genBanding(usedKeys),
      () => genSusun(usedKeys),
      () => genTimpa(usedKeys),
    ],
    // Lapak 3 — Jumlah & Cerita
    g3: [
      () => genJumlah(usedKeys),
      () => genPiring(usedKeys),
    ],
    gCampuran: allGenerators,
  };

  const pool = focusByGame[gameId] ?? allGenerators;

  let attempts = 0;
  while (rounds.length < ROUNDS && attempts < 250) {
    attempts++;
    // Acak pilihan generator agar variasi soal selalu berbeda dan segar di setiap ronde
    const genIndex = (attempts + Math.floor(Math.random() * pool.length)) % pool.length;
    const task = pool[genIndex]();
    if (task) {
      rounds.push(task);
    }
  }

  return rounds;
}

/* ==================================================== KOMPONEN GAME MAIN */
export default function Game({ gameId }: { gameId: string }) {
  const { navigate, goBack } = useRouter();
  const { progress, recordGame, modeJuri, catatTerakhirDibuka } = useApp();
  const game = GAMES.find((g) => g.id === gameId);

  const icon = gameId === "g1" ? "🍉" : gameId === "g2" ? "🍰" : gameId === "g3" ? "🏪" : "🏆";

  useEffect(() => {
    if (game) {
      catatTerakhirDibuka({
        type: "game",
        id: gameId,
        route:
          gameId === "gCampuran"
            ? "game-campuran"
            : gameId === "g1"
            ? "game-bagi-rata"
            : gameId === "g2"
            ? "game-banding-jodoh"
            : "game-lapak-jualan",
        nama: game.nama,
        sub: "Game Lapak Pasar",
        emoji: icon,
        waktu: new Date().toISOString(),
      });
    }
  }, [gameId]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [gameId]);

  if (!game) return null;

  if (loading) {
    return (
      <GameLoadingScreen
        gameTitle={game.nama}
        durationMs={2800}
        onLoaded={() => setLoading(false)}
      />
    );
  }

  const terkunci = (gameId === "gCampuran" ? !semuaSelesai(progress) : !!game?.materiId && !progress[game.materiId]?.selesai) && !modeJuri;

  if (terkunci) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 pb-24 text-center select-none relative">
        {/* Background Panggung Game Pasar */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <img
            src="/bggame.jpg"
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
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink">{game.nama}</h1>
          <p className="mt-1.5 text-xs font-bold text-slate-600 leading-relaxed">
            {gameId === "gCampuran" ? "Selesaikan semua lapak pasar dulu!" : "Selesaikan materi lapak ini terlebih dahulu, ya!"}
          </p>
          <PrimaryButton onClick={() => goBack("game")} className="mt-5 w-full">
            Kembali
          </PrimaryButton>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <GamePlayEngine
      key={gameId}
      gameId={gameId}
      nama={game.nama}
      icon={icon}
      onDone={(skor) => recordGame(gameId, skor, skor)}
      onExit={(currentSkor = 0) => {
        if (currentSkor > 0) {
          recordGame(gameId, currentSkor, currentSkor);
        }
        goBack("game");
      }}
    />
  );
}

/* ==================================================== MESIN RUANG GAMEPLAY (STAND PASAR) */
interface RoundState {
  jawaban: number | null;
  shaded: number[];
  matchedPairs: Record<number, number>;
  susunOrder: number[];
  kTaken: number;
  dropped: string[];
  checked: boolean;
  isCorrect: boolean;
}

function GamePlayEngine({
  gameId,
  nama,
  icon,
  onDone,
  onExit,
}: {
  gameId: string;
  nama: string;
  icon: string;
  onDone: (skor: number) => void;
  onExit: (currentSkor?: number) => void;
}) {
  const [rounds] = useState<Tugas[]>(() => generate10UniqueRounds(gameId));
  const [idx, setIdx] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  // Menyimpan state per ronde (soal 1-10) secara terpisah
  const [roundStates, setRoundStates] = useState<RoundState[]>(() =>
    Array.from({ length: ROUNDS }, () => ({
      jawaban: null,
      shaded: [],
      matchedPairs: {},
      susunOrder: [],
      kTaken: 0,
      dropped: [],
      checked: false,
      isCorrect: false,
    }))
  );

  const tugas = rounds[idx];
  const currentRoundState = roundStates[idx] || {
    jawaban: null,
    shaded: [],
    matchedPairs: {},
    susunOrder: [],
    kTaken: 0,
    dropped: [],
    checked: false,
    isCorrect: false,
  };

  const updateCurrentRound = (patch: Partial<RoundState>) => {
    setRoundStates((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const totalBenar = roundStates.filter((s) => s.checked && s.isCorrect).length;
  const totalSalah = roundStates.filter((s) => s.checked && !s.isCorrect).length;
  const totalSelesai = roundStates.filter((s) => s.checked).length;

  /* ---------------- Drag & Drop (mode piring & timpa) ---------------- */
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ id: string; x: number; y: number } | null>(null);

  const startDrag = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    dragStateRef.current = { id, x: e.clientX, y: e.clientY };
    setDragId(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  // Listener global (window) agar seret tetap terdeteksi walau jari keluar dari tombol
  useEffect(() => {
    if (!dragId) return;
    const onMove = (e: PointerEvent) => {
      dragStateRef.current = { id: dragId, x: e.clientX, y: e.clientY };
      setDragPos({ x: e.clientX, y: e.clientY });
    };
    const onUp = (e: PointerEvent) => {
      const st = dragStateRef.current;
      if (st) {
        const zone = dropRef.current;
        if (zone) {
          const r = zone.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            let droppedNow = false;
            setRoundStates((prev) => {
              const next = [...prev];
              const cur = next[idx];
              if (cur && !cur.dropped.includes(st.id)) {
                next[idx] = { ...cur, dropped: [...cur.dropped, st.id] };
                droppedNow = true;
              }
              return next;
            });
            if (droppedNow) sfx("pop");
          }
        }
      }
      dragStateRef.current = null;
      setDragId(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragId, idx]);

  /* ---------------- Periksa Jawaban ---------------- */
  const periksa = () => {
    let benar = false;

    if (tugas.mode === "arsir") {
      benar = currentRoundState.shaded.length === tugas.k;
    } else if (tugas.mode === "potong") {
      benar = currentRoundState.kTaken === tugas.k;
    } else if (tugas.mode === "piring") {
      benar = currentRoundState.dropped.length >= 2;
    } else if (tugas.mode === "timpa") {
      benar = currentRoundState.dropped.length === 1 && Number(currentRoundState.dropped[0]) === tugas.benarIdx;
    } else if (tugas.mode === "bagiRata" || tugas.mode === "banding" || tugas.mode === "jumlah") {
      benar = currentRoundState.jawaban === tugas.benarIdx;
    } else if (tugas.mode === "cocokkan") {
      if (Object.keys(currentRoundState.matchedPairs).length < tugas.pairs.length) return;
      benar = tugas.pairs.every((p, leftIdx) => {
        const rightIdx = currentRoundState.matchedPairs[leftIdx];
        if (rightIdx === undefined) return false;
        const targetItem = cocokkanRightItems[rightIdx];
        if (!targetItem) return false;
        return p.frac[0] / p.frac[1] === targetItem.frac[0] / targetItem.frac[1];
      });
    } else if (tugas.mode === "susun") {
      if (currentRoundState.susunOrder.length < tugas.items.length) return;
      const values = currentRoundState.susunOrder.map((i) => tugas.items[i].frac[0] / tugas.items[i].frac[1]);
      if (tugas.arah === "terkecil") {
        benar = values.every((val, i) => i === 0 || val >= values[i - 1]);
      } else {
        benar = values.every((val, i) => i === 0 || val <= values[i - 1]);
      }
    }

    updateCurrentRound({ checked: true, isCorrect: benar });
    sfx(benar ? "success" : "wrong");
  };

  /* ---------------- Pindah ke Ronde Berikutnya ---------------- */
  const lanjut = () => {
    if (idx + 1 >= rounds.length) {
      setDone(true);
      onDone(totalBenar);
      sfx("unlock");
    } else {
      setIdx((prev) => prev + 1);
      setSelectedLeft(null);
    }
  };

  /* ---------------- Class styling opsi pilihan ---------------- */
  const optCls = (i: number, benarIdx: number) => {
    const terpilih = currentRoundState.jawaban === i;
    if (!currentRoundState.checked)
      return terpilih ? "border-teal-700 bg-teal-50 ring-4 ring-teal-500/40" : "border-slate-200 bg-white hover:border-amber-400";
    if (i === benarIdx) return "border-green-600 bg-green-50 ring-2 ring-green-500";
    if (terpilih) return "border-red-600 bg-red-50";
    return "border-slate-200 bg-white opacity-40";
  };

  // Visual Shuffled Right Items untuk Mode Cocokkan
  const cocokkanRightItems = useMemo(() => {
    if (!tugas || tugas.mode !== "cocokkan") return [];
    let items = shuffle([...tugas.pairs]);
    if (items.length > 1 && items.every((item, i) => item.leftLabel === tugas.pairs[i].leftLabel)) {
      items = [items[1], items[2], items[0]];
    }
    return items;
  }, [tugas]);

  /* ---------------- Overlay Celebration ---------------- */
  if (done) {
    return (
      <div className="min-h-screen pb-28 select-none relative">
        {/* Background Panggung Game Pasar */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <img
            src="/bggame.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
        </div>

        <CelebrationOverlay
          title="Lapak Game Selesai! 🎪"
          subtitle={`Hasil Jualan: ${totalBenar}/${rounds.length} pesanan benar!`}
          bintang={Math.min(totalBenar, 3)}
          buttonLabel="Ke Panggung Game"
          onClose={() => onExit(totalBenar)}
        />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 select-none relative">
      {/* Background Panggung Game Pasar */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="/bggame.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />
      </div>

      {/* ================= GERBANG ATAP & JUDUL (FIXED TOP) ================= */}
      <div className="sticky top-0 z-30 w-full select-none">
        <Awning tone="orange" height={32} stripe={22} light="#fff8f0" />
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => onExit(totalBenar)}
            aria-label="Kembali"
            className="absolute left-3 top-1 z-20 grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-white shadow-[0_3px_0_#1e293b] active:translate-y-[2px] active:shadow-[0_1px_0_#1e293b]"
          >
            <IconBack size={20} className="text-ink" />
          </button>
          <div className="-mt-1 flex items-center justify-center px-14 pb-1">
            <HangingSign rope={12} className="max-w-[210px] sm:max-w-xs">
              <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_0_rgba(0,0,0,.4)] truncate block">
                {nama}
              </span>
            </HangingSign>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 pt-3 space-y-3">
        {/* NAVIGASI NOMOR SOAL (1 - 10) */}
        <div className="bg-white p-3 rounded-2xl shadow border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-700">
            <span className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 font-extrabold">
                Soal {idx + 1} / {rounds.length}
              </span>
              <span className="text-slate-500 text-[11px] font-bold">Tekan nomor untuk pindah:</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-black">
              <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 shadow-xs">
                ✓ {totalBenar} Benar
              </span>
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shadow-xs">
                ✗ {totalSalah} Salah
              </span>
            </div>
          </div>

          {/* Row Navigasi Nomor Soal 1..10 */}
          <div className="grid grid-cols-10 gap-1 pt-1">
            {rounds.map((_, i) => {
              const st = roundStates[i];
              const isActive = i === idx;

              let badgeStyle = "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200";
              let mark: React.ReactNode = i + 1;

              if (st.checked) {
                if (st.isCorrect) {
                  badgeStyle = "bg-green-500 text-white border-green-600 font-extrabold shadow-sm";
                  mark = "✓";
                } else {
                  badgeStyle = "bg-red-500 text-white border-red-600 font-extrabold shadow-sm";
                  mark = "✗";
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIdx(i);
                    setSelectedLeft(null);
                    sfx("pop");
                  }}
                  className={`h-9 rounded-xl border-2 font-display text-xs flex items-center justify-center transition-all ${badgeStyle} ${
                    isActive ? "ring-4 ring-amber-400 border-amber-500 font-black scale-110 z-10 shadow-md" : ""
                  }`}
                  title={`Ke Soal Nomor ${i + 1}`}
                >
                  {mark}
                </button>
              );
            })}
          </div>

          <ProgressBar value={(totalSelesai / rounds.length) * 100} className="mt-2" color="orange" />
        </div>

        {/* Stand Penjual & Pembeli (Market Customer Counter) */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border-2 border-amber-400 text-white shadow-xl">
          <div className="bg-market-awning-orange pt-2 pb-1 px-3">
            <div className="flex items-center justify-between text-[11px] font-black text-amber-950 bg-amber-300 px-3 py-0.5 rounded-full shadow w-fit">
              <span>🏪 Meja Kasir Lapak • Soal #{idx + 1}</span>
            </div>
          </div>
          <AwningScallops lightCount={5} colorScheme="orange" />

          {/* Customer Speech Bubble Banner */}
          <div className="p-3.5 pt-1 flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 border-2 border-amber-400 grid place-items-center shrink-0 shadow">
              <Mascot gender={idx % 2 === 0 ? "cewe" : "cowo"} level={1} size={40} />
            </div>

            <div className="flex-1 bg-white text-slate-900 p-3 rounded-2xl border-2 border-amber-300 shadow-md relative">
              <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
              <div className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                👤 Pembeli Bertanya:
              </div>
              <p className="font-display text-sm font-extrabold text-slate-800 leading-snug mt-0.5">
                "{tugas.customerSpeech}"
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Card Interaktif Per Mode */}
        <div className="rounded-3xl border-2 border-amber-400/80 bg-white p-4 shadow-xl">
          <div className="font-display text-base font-black text-slate-900 text-center mb-2">
            {tugas.prompt}
          </div>

          {/* ================= MODE 1: ARSIR (POTONG & ARSIR PESANAN) ================= */}
          {tugas.mode === "arsir" && (
            <div className="flex flex-col items-center">
              <div className="h-44 w-44 my-2">
                <ArsirShape
                  kind={tugas.kind}
                  n={tugas.n}
                  shaded={new Set(currentRoundState.shaded)}
                  onToggle={(partIdx) => {
                    if (currentRoundState.checked) return;
                    const prev = new Set(currentRoundState.shaded);
                    prev.has(partIdx) ? prev.delete(partIdx) : prev.add(partIdx);
                    updateCurrentRound({ shaded: Array.from(prev) });
                    sfx("pop");
                  }}
                  disabled={currentRoundState.checked}
                />
              </div>
              <div className="text-center font-display font-extrabold text-sm text-slate-800">
                Diarsir: <span className="text-orange-600 font-black text-base">{currentRoundState.shaded.length}</span> dari {tugas.n} bagian
              </div>
              {currentRoundState.checked && (
                <div
                  className={`mt-2 font-display text-sm font-black p-2 rounded-xl border w-full text-center ${
                    currentRoundState.isCorrect ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"
                  }`}
                >
                  {currentRoundState.isCorrect ? "✓ Pas! Pesanan pembeli sesuai!" : `✗ Kurang pas. Seharusnya ${tugas.k} dari ${tugas.n} bagian.`}
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 2: BAGI RATA ================= */}
          {tugas.mode === "bagiRata" && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {tugas.opsi.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (currentRoundState.checked) return;
                    updateCurrentRound({ jawaban: i });
                    sfx("pop");
                  }}
                  disabled={currentRoundState.checked}
                  className={`relative rounded-2xl border-2 p-2 transition active:scale-95 ${optCls(i, tugas.benarIdx)}`}
                >
                  <div className="mx-auto aspect-square w-full">
                    <BagiVisual kind={o.kind} parts={o.parts} equal={o.equal} />
                  </div>
                  {currentRoundState.checked && i === tugas.benarIdx && (
                    <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-green-600 text-xs text-white shadow">
                      ✓
                    </span>
                  )}
                  {currentRoundState.checked && currentRoundState.jawaban === i && i !== tugas.benarIdx && (
                    <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-xs text-white shadow">
                      ✗
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ================= MODE 3: BANDINGKAN ================= */}
          {tugas.mode === "banding" && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[tugas.a, tugas.b].map((f, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (currentRoundState.checked) return;
                    updateCurrentRound({ jawaban: i });
                    sfx("pop");
                  }}
                  disabled={currentRoundState.checked}
                  className={`relative rounded-2xl border-2 p-3 transition active:scale-95 flex flex-col items-center ${optCls(i, tugas.benarIdx)}`}
                >
                  <div className="h-28 w-28">
                    <FractionShape kind={tugas.kind} n={f[1]} k={f[0]} />
                  </div>
                  <div className="mt-2 text-center font-display font-black text-lg text-slate-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                    {f[0]}/{f[1]}
                  </div>
                  {currentRoundState.checked && i === tugas.benarIdx && (
                    <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-green-600 text-xs text-white shadow">
                      ✓
                    </span>
                  )}
                  {currentRoundState.checked && currentRoundState.jawaban === i && i !== tugas.benarIdx && (
                    <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-xs text-white shadow">
                      ✗
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ================= MODE 4: COCOKKAN PASANGAN ================= */}
          {tugas.mode === "cocokkan" && (
            <div className="space-y-3 mt-2">
              <p className="text-xs text-center font-bold text-slate-500">
                Tap kartu angka di kiri, lalu tap piring pecahan yang sesuai di kanan!
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Kolom Kiri */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-center text-teal-800 uppercase">1. Pilih Angka</div>
                  {tugas.pairs.map((p, leftIdx) => {
                    const isSelected = selectedLeft === leftIdx;
                    const isMatched = currentRoundState.matchedPairs[leftIdx] !== undefined;
                    return (
                      <button
                        key={leftIdx}
                        onClick={() => {
                          if (currentRoundState.checked) return;
                          setSelectedLeft(leftIdx);
                          sfx("pop");
                        }}
                        disabled={currentRoundState.checked}
                        className={`w-full p-2.5 rounded-2xl border-2 font-display text-lg font-black transition text-center flex items-center justify-between ${
                          isSelected
                            ? "bg-amber-300 border-amber-500 text-amber-950 ring-4 ring-amber-400/40"
                            : isMatched
                            ? "bg-teal-100 border-teal-500 text-teal-900"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <span>{p.leftLabel}</span>
                        {isMatched && <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">Terhubung 🔗</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-center text-orange-800 uppercase">2. Pilih Piring</div>
                  {cocokkanRightItems.map((p, rightIdx) => {
                    const connectedLeft = Object.keys(currentRoundState.matchedPairs).find(
                      (l) => currentRoundState.matchedPairs[Number(l)] === rightIdx
                    );
                    return (
                      <button
                        key={rightIdx}
                        onClick={() => {
                          if (currentRoundState.checked || selectedLeft === null) return;
                          updateCurrentRound({
                            matchedPairs: { ...currentRoundState.matchedPairs, [selectedLeft]: rightIdx },
                          });
                          setSelectedLeft(null);
                          sfx("pop");
                        }}
                        disabled={currentRoundState.checked}
                        className={`w-full p-2 rounded-2xl border-2 transition flex items-center justify-between ${
                          connectedLeft !== undefined
                            ? "bg-amber-100 border-amber-500 ring-2 ring-amber-400"
                            : selectedLeft !== null
                            ? "bg-white border-amber-300 hover:border-amber-500 shadow"
                            : "bg-slate-50 border-slate-200 opacity-80"
                        }`}
                      >
                        <div className="h-12 w-12 shrink-0">
                          <FractionShape kind={p.kind} n={p.frac[1]} k={p.frac[0]} />
                        </div>
                        {connectedLeft !== undefined && (
                          <span className="text-[11px] font-black text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full">
                            = {tugas.pairs[Number(connectedLeft)].leftLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 5: SUSUN PUZZLE URUTAN ================= */}
          {tugas.mode === "susun" && (
            <div className="space-y-3 mt-2">
              <div className="bg-amber-50 p-3 rounded-2xl border-2 border-amber-300 text-center">
                <div className="text-xs font-black text-amber-900 uppercase mb-2">
                  📥 Order Urutan ({tugas.arah === "terkecil" ? "Kecil ➔ Besar" : "Besar ➔ Kecil"}):
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, slotIdx) => {
                    const itemIdx = currentRoundState.susunOrder[slotIdx];
                    const item = itemIdx !== undefined ? tugas.items[itemIdx] : null;
                    return (
                      <button
                        key={slotIdx}
                        onClick={() => {
                          if (currentRoundState.checked || itemIdx === undefined) return;
                          updateCurrentRound({
                            susunOrder: currentRoundState.susunOrder.filter((_, i) => i !== slotIdx),
                          });
                          sfx("pop");
                        }}
                        disabled={currentRoundState.checked}
                        className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-1 transition ${
                          item ? "bg-white border-teal-500 shadow" : "bg-amber-100/50 border-amber-400 text-amber-800"
                        }`}
                      >
                        {item ? (
                          <>
                            <div className="h-14 w-14">
                              <FractionShape kind={item.kind} n={item.frac[1]} k={item.frac[0]} />
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-600 mt-1">Tap Batal</span>
                          </>
                        ) : (
                          <span className="text-xs font-black text-amber-700">Slot {slotIdx + 1}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-black text-slate-600 uppercase mb-1">
                  Tap piring makanan untuk mengisi slot:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {tugas.items.map((it, i) => {
                    const alreadyChosen = currentRoundState.susunOrder.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (currentRoundState.checked || alreadyChosen || currentRoundState.susunOrder.length >= 3) return;
                          updateCurrentRound({
                            susunOrder: [...currentRoundState.susunOrder, i],
                          });
                          sfx("pop");
                        }}
                        disabled={currentRoundState.checked || alreadyChosen}
                        className={`p-2 rounded-2xl border-2 transition flex flex-col items-center justify-center ${
                          alreadyChosen
                            ? "bg-slate-200 border-slate-300 opacity-30"
                            : "bg-white border-slate-200 hover:border-amber-400 active:scale-95 shadow"
                        }`}
                      >
                        <div className="h-16 w-16">
                          <FractionShape kind={it.kind} n={it.frac[1]} k={it.frac[0]} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 6: JUMLAH ================= */}
          {tugas.mode === "jumlah" && (
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="h-16 w-16 shrink-0">
                  <FractionShape kind={tugas.kind} n={tugas.a[1]} k={tugas.a[0]} />
                </div>
                <span className="font-display text-2xl font-black text-slate-700">+</span>
                <div className="h-16 w-16 shrink-0">
                  <FractionShape kind={tugas.kind} n={tugas.c[1]} k={tugas.c[0]} />
                </div>
                <span className="font-display text-2xl font-black text-slate-700">=</span>
                <span className="font-display text-2xl font-black text-orange-600">?</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {tugas.opsi.map((o, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (currentRoundState.checked) return;
                      updateCurrentRound({ jawaban: i });
                      sfx("pop");
                    }}
                    disabled={currentRoundState.checked}
                    className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition active:scale-95 ${optCls(i, tugas.benarIdx)}`}
                  >
                    <div className="h-16 w-16">
                      <FractionShape kind={tugas.kind} n={o.n} k={o.k} />
                    </div>
                    <span className="font-display text-base font-black text-slate-800">{o.label}</span>
                    {currentRoundState.checked && i === tugas.benarIdx && (
                      <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-green-600 text-xs text-white shadow">
                        ✓
                      </span>
                    )}
                    {currentRoundState.checked && currentRoundState.jawaban === i && i !== tugas.benarIdx && (
                      <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-xs text-white shadow">
                        ✗
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= MODE 7: POTONG (3D SWIPE PISAU) ================= */}
          {tugas.mode === "potong" && (
            <div className="flex flex-col items-center">
              <div className="w-full">
                <Fraction3DSlice
                  kind={tugas.kind}
                  n={tugas.n}
                  k={currentRoundState.kTaken}
                  onSliceCut={() => {
                    if (currentRoundState.checked) return;
                    updateCurrentRound({ kTaken: Math.min(currentRoundState.kTaken + 1, tugas.n) });
                  }}
                  className="w-full"
                />
              </div>
              <div className="mt-1 text-center font-display font-extrabold text-sm text-slate-800">
                Terambil: <span className="text-base text-orange-600">{currentRoundState.kTaken}</span> dari {tugas.n} bagian
              </div>
              {currentRoundState.checked && (
                <div className={`mt-2 w-full rounded-xl border p-2 text-center font-display text-sm font-black ${currentRoundState.isCorrect ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                  {currentRoundState.isCorrect ? "✓ Pas! Potongan sesuai pesanan!" : `✗ Seharusnya ${tugas.k} dari ${tugas.n} bagian.`}
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 8: PIRING (DRAG GABUNG) ================= */}
          {tugas.mode === "piring" && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                {[
                  { id: "A", f: tugas.a },
                  { id: "B", f: tugas.c },
                ].map((src) => {
                  const dropped = currentRoundState.dropped.includes(src.id);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onPointerDown={(e) => {
                        if (dropped || currentRoundState.checked) return;
                        startDrag(src.id, e);
                      }}
                      className={`flex cursor-grab touch-none flex-col items-center rounded-2xl border-2 p-2 transition ${dropped ? "border-slate-200 bg-slate-100 opacity-40" : "border-slate-200 bg-white active:scale-95"}`}
                    >
                      <div className="h-20 w-20"><FractionShape kind={tugas.kind} n={src.f[1]} k={src.f[0]} /></div>
                      <span className="mt-1 font-display text-sm font-black text-slate-700">{src.f[0]}/{src.f[1]}</span>
                    </button>
                  );
                })}
              </div>

              <div ref={dropRef} className="mx-auto flex min-h-28 w-40 flex-col items-center justify-center rounded-full border-4 border-dashed border-amber-400 bg-amber-50 p-3">
                {currentRoundState.dropped.length === 2 ? (
                  <>
                    <div className="h-20 w-20"><FractionShape kind={tugas.kind} n={tugas.a[1]} k={tugas.a[0] + tugas.c[0]} /></div>
                    <span className="mt-1 font-display text-base font-black text-orange-600">{(tugas.a[0] + tugas.c[0])}/{tugas.a[1]}</span>
                  </>
                ) : (
                  <span className="text-xs font-black text-amber-700">🫓 Piring Saji — seret kue ke sini</span>
                )}
              </div>

              {currentRoundState.checked && (
                <div className={`w-full rounded-xl border p-2 text-center font-display text-sm font-black ${currentRoundState.isCorrect ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                  {currentRoundState.isCorrect ? "✓ Berhasil digabung!" : "✗ Gabungkan kedua piring dulu!"}
                </div>
              )}
            </div>
          )}

          {/* ================= MODE 9: TIMPA (DRAG SENILAI) ================= */}
          {tugas.mode === "timpa" && (
            <div className="space-y-3">
              <div ref={dropRef} className="mx-auto flex h-28 w-32 flex-col items-center justify-center rounded-2xl border-4 border-dashed border-teal-400 bg-teal-50">
                <div className="h-16 w-16"><FractionShape kind={tugas.kind} n={tugas.target[1]} k={tugas.target[0]} /></div>
                <span className="mt-1 text-teal-700"><StackedFraction num={tugas.target[0]} den={tugas.target[1]} size="sm" /></span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {tugas.opsi.map((f, i) => {
                  const dropped = currentRoundState.dropped.includes(String(i));
                  return (
                    <button
                      key={i}
                      type="button"
                      onPointerDown={(e) => {
                        if (dropped || currentRoundState.checked) return;
                        startDrag(String(i), e);
                      }}
                      className={`flex cursor-grab touch-none flex-col items-center rounded-2xl border-2 p-2 transition ${dropped ? "border-slate-200 bg-slate-100 opacity-40" : "border-slate-200 bg-white active:scale-95"}`}
                    >
                      <div className="h-20 w-20"><FractionShape kind={tugas.kind} n={f[1]} k={f[0]} /></div>
                      <span className="mt-1 text-slate-700"><StackedFraction num={f[0]} den={f[1]} size="sm" /></span>
                    </button>
                  );
                })}
              </div>

              {currentRoundState.checked && (
                <div className={`w-full rounded-xl border p-2 text-center font-display text-sm font-black ${currentRoundState.isCorrect ? "border-green-300 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
                  {currentRoundState.isCorrect ? "✓ Benar! Nilainya sama." : "✗ Coba seret kue yang senilai."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overlay objek yang sedang di-drag */}
        {dragId !== null && (
          <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2" style={{ left: dragPos.x, top: dragPos.y }}>
            <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-2xl ring-2 ring-amber-400">
              {tugas.mode === "piring" && (
                dragId === "A"
                  ? <FractionShape kind={tugas.kind} n={tugas.a[1]} k={tugas.a[0]} />
                  : <FractionShape kind={tugas.kind} n={tugas.c[1]} k={tugas.c[0]} />
              )}
              {tugas.mode === "timpa" && <FractionShape kind={tugas.kind} n={tugas.opsi[Number(dragId)][1]} k={tugas.opsi[Number(dragId)][0]} />}
            </div>
          </div>
        )}

        {/* Tombol Periksa / Ronde Berikutnya */}
        <div>
          {!currentRoundState.checked ? (
            <PrimaryButton
              onClick={periksa}
              disabled={
                tugas.mode === "arsir"
                  ? currentRoundState.shaded.length === 0
                  : tugas.mode === "potong"
                  ? currentRoundState.kTaken === 0
                  : tugas.mode === "piring" || tugas.mode === "timpa"
                  ? currentRoundState.dropped.length === 0
                  : tugas.mode === "cocokkan"
                  ? Object.keys(currentRoundState.matchedPairs).length < 3
                  : tugas.mode === "susun"
                  ? currentRoundState.susunOrder.length < 3
                  : currentRoundState.jawaban === null
              }
              color="teal"
              className="w-full py-3 text-base shadow-lg"
            >
              Sajikan & Periksa Pesanan 🍽️
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={lanjut} color="orange" className="w-full py-3 text-base shadow-lg">
              {idx + 1 >= rounds.length ? "Lihat Hasil Jualan 🎉" : "Pesanan Berikutnya ›"}
            </PrimaryButton>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

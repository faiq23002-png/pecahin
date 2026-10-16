import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Profil, ProgressMateri, RiwayatJawaban, ProfilGame, ProfilHarian, Gender, StatusTahap, TerakhirDibuka } from "./types";
import { defaultProgress, nextMateri, tahapBerikutnya, KRITERIA_SELESAI, MAKS_PERCOBAAN, semuaSelesai } from "./progress";
import { sisaKoinHarian } from "./economy";
import { SOAL, ACHIEVEMENTS, ITEM_TOKO, MATERI, levelDariPoin } from "./content";
import { totalPoin } from "./poin";
import { todayStr, uid } from "./util";
import { KEYS, load, save, remove } from "./storage";

type TahapKey = "tahapBelajar" | "tahapCoba" | "tahapLatihan";

interface AppState {
  profil: Profil | null;
  progress: Record<string, ProgressMateri>;
  riwayat: RiwayatJawaban[];
  game: Record<string, ProfilGame>;
  harian: Record<string, ProfilHarian>;
  achievements: string[];
  items: string[];
  modeJuri: boolean;
  poin: number;
  maskotLevel: number;
  terakhirDibuka: TerakhirDibuka | null;
}

interface AppActions {
  buatProfil: (nama: string, gender: Gender) => void;
  selesaikanTahap: (materiId: string, tahap: TahapKey) => void;
  selesaikanMateri: (materiId: string, benar: number, total: number) => void;
  recordJawaban: (soalId: string, pilihanId: string) => { benar: boolean; miskonsepsiId?: string; jawabanBenar: string };
  catatJawaban: (soalId: string, benar: boolean, miskonsepsiId?: string) => void;
  tambahKoin: (n: number) => number;
  recordGame: (gameId: string, skor: number, benarRonde: number) => void;
  beliItem: (itemId: string) => boolean;
  resetAll: () => void;
  toggleSuara: () => void;
  setVolumeMusik: (vol: number) => void;
  setVolumeSfx: (vol: number) => void;
  toggleModeJuri: () => void;
  setKoinManual: (jumlah: number) => void;
  setSemuaMateriSelesai: (selesai: boolean) => void;
  setSemuaGameTerbuka: (terbuka: boolean) => void;
  catatTerakhirDibuka: (item: TerakhirDibuka) => void;
}

export type AppStore = AppState & AppActions;

function newHarian(tanggal: string): ProfilHarian {
  return { tanggal, soalDijawab: 0, menitAktif: 0, misiSelesai: false, bintangHari: 0, koinHari: 0 };
}

function getHarian(harian: Record<string, ProfilHarian>, tanggal: string): ProfilHarian {
  return harian[tanggal] ?? newHarian(tanggal);
}

export const useApp = create<AppStore>()((set, get) => {
  // Helper to sync calculated fields
  const syncCalculatedFields = (state: AppState) => {
    const poin = totalPoin(state.riwayat, state.game);
    const maskotLevel = levelDariPoin(poin);
    const spend = state.items.reduce((acc, itemId) => {
      const item = ITEM_TOKO.find((i) => i.id === itemId);
      return acc + (item ? item.hargaKoin : 0);
    }, 0);
    const koinBalance = Math.max(0, poin - spend);

    return {
      poin,
      maskotLevel,
      profil: state.profil ? { ...state.profil, koin: koinBalance } : null,
    };
  };

  const initialState = {
    profil: load<Profil | null>(KEYS.profil, null),
    progress: load(KEYS.materi, {}),
    riwayat: load<RiwayatJawaban[]>(KEYS.riwayat, []),
    game: load(KEYS.game, {}),
    harian: load(KEYS.harian, {}),
    achievements: load<string[]>(KEYS.badge, []),
    items: load<string[]>("items", []),
    modeJuri: false,
    poin: 0,
    maskotLevel: 1,
    terakhirDibuka: load<TerakhirDibuka | null>(KEYS.terakhirDibuka, null),
  };

  return {
    ...initialState,
    ...syncCalculatedFields(initialState as AppState),

    buatProfil: (nama, gender) => {
      const now = todayStr();
      const p: Profil = { nama, gender, koin: 0, streak: 1, lastAktif: now, suaraOn: true };
      const nextState = {
        profil: p,
        progress: defaultProgress(),
        riwayat: [],
        game: {},
        harian: { [now]: newHarian(now) },
        achievements: [],
        items: []
      };
      set({ ...nextState, ...syncCalculatedFields(nextState as any) });
    },

    selesaikanTahap: (materiId, tahap) => {
      set((state) => {
        const p = { ...state.progress[materiId] };
        p[tahap] = "selesai";
        const next = tahapBerikutnya(tahap);
        if (next && p[next] === "terkunci") p[next] = "terbuka";
        return { progress: { ...state.progress, [materiId]: p } };
      });
    },

    selesaikanMateri: (materiId, benar, total) => {
      const lulus = benar >= KRITERIA_SELESAI;
      set((state) => {
        const p = { ...state.progress[materiId] };
        p.tahapLatihan = "selesai";
        p.percobaanLatihan = Math.min(p.percobaanLatihan + 1, MAKS_PERCOBAAN);
        if (lulus) p.selesai = true;
        
        const newProgress = { ...state.progress, [materiId]: p };
        if (lulus) {
          const next = nextMateri(materiId);
          if (next && newProgress[next].tahapBelajar === "terkunci") {
            newProgress[next] = { ...newProgress[next], tahapBelajar: "terbuka" };
          }
        }

        let newAchievements = state.achievements;
        if (lulus) {
          const achievementId = materiId === "m1" ? "jago-bagi-rata" : materiId === "m2" ? "ahli-banding-senilai" : "detektif-cerita";
          if (!newAchievements.includes(achievementId)) {
            newAchievements = [...newAchievements, achievementId];
          }
        }
        return { progress: newProgress, achievements: newAchievements };
      });
    },

    catatJawaban: (soalId, benar, miskonsepsiId) => {
      const soal = SOAL.find((s) => s.id === soalId);
      const r: RiwayatJawaban = {
        id: uid("r"),
        soalId,
        benar,
        domain: soal?.domain ?? "konsep",
        miskonsepsiId: benar ? undefined : miskonsepsiId,
        waktu: new Date().toISOString(),
      };
      
      set((state) => {
        const updatedRiwayat = [...state.riwayat, r];
        const limitedRiwayat = updatedRiwayat.length > 500 ? updatedRiwayat.slice(-500) : updatedRiwayat;
        
        const t = todayStr();
        const h = getHarian(state.harian, t);
        const newHarian = { ...state.harian, [t]: { ...h, soalDijawab: h.soalDijawab + 1 } };
        
        const newState = { riwayat: limitedRiwayat, harian: newHarian };
        return { ...newState, ...syncCalculatedFields({ ...state, ...newState }) };
      });
    },

    recordJawaban: (soalId, pilihanId) => {
      const soal = SOAL.find((s) => s.id === soalId);
      const pil = soal?.pilihan.find((p) => p.id === pilihanId);
      const benar = !!pil?.benar;
      get().catatJawaban(soalId, benar, !benar ? pil?.miskonsepsiId : undefined);
      return { benar, miskonsepsiId: !benar ? pil?.miskonsepsiId : undefined, jawabanBenar: soal?.jawabanBenar ?? "" };
    },

    recordGame: (gameId, skor, benarRonde) => {
      const t = todayStr();
      set((state) => {
        const g = state.game[gameId] ?? { gameId, skorTerbaik: 0, koinDihasilkan: 0, terakhirMain: t };
        const newGame = { ...state.game, [gameId]: { ...g, skorTerbaik: Math.max(g.skorTerbaik, skor), terakhirMain: t } };
        
        const newState = { game: newGame };
        // We defer koin calculation via syncCalculatedFields
        return { ...newState, ...syncCalculatedFields({ ...state, ...newState }) };
      });
      get().tambahKoin(benarRonde * 5);
    },

    tambahKoin: (n) => {
      let added = 0;
      set((state) => {
        if (!state.profil) return state;
        const t = todayStr();
        const h = getHarian(state.harian, t);
        added = Math.min(n, sisaKoinHarian(h.koinHari));
        if (added <= 0) return state;
        
        const newHarian = { ...state.harian, [t]: { ...h, koinHari: h.koinHari + added } };
        const newProfil = { ...state.profil, lastAktif: t }; // Koin update logic handled manually if bypassing sync
        
        // However, koin is purely calculated in koinBalance from totalPoin.
        // Wait, in old code: setProfil({...profil, koin: profil.koin + add})
        // But koinBalance is also dynamically calculated: koinBalance = Math.max(0, poin - spend)
        // This is a conflict in the original code! Koin was both tracked in profil.koin and overridden by koinBalance.
        // Let's just persist harian so the limit is tracked, and koinBalance stays dynamic.
        return { harian: newHarian, profil: newProfil };
      });
      return added;
    },

    beliItem: (itemId) => {
      let success = false;
      set((state) => {
        const item = ITEM_TOKO.find((i) => i.id === itemId);
        if (!item) return state;
        
        const spend = state.items.reduce((acc, id) => acc + (ITEM_TOKO.find((i) => i.id === id)?.hargaKoin || 0), 0);
        const koinBalance = Math.max(0, state.poin - spend);
        
        if (koinBalance < item.hargaKoin) return state;
        
        success = true;
        const newItems = state.items.includes(itemId) ? state.items : [...state.items, itemId];
        
        const newState = { items: newItems };
        return { ...newState, ...syncCalculatedFields({ ...state, ...newState }) };
      });
      return success;
    },

    toggleSuara: () => set((state) => ({ profil: state.profil ? { ...state.profil, suaraOn: !state.profil.suaraOn } : null })),

    setVolumeMusik: (vol: number) => {
      set((state) => ({
        profil: state.profil ? { ...state.profil, volumeMusik: vol } : null,
      }));
    },

    setVolumeSfx: (vol: number) => {
      set((state) => ({
        profil: state.profil ? { ...state.profil, volumeSfx: vol } : null,
      }));
    },
    
    toggleModeJuri: () => set((state) => ({ modeJuri: !state.modeJuri })),

    setKoinManual: (jumlah: number) => {
      set((state) => {
        if (!state.profil) return state;
        const targetKoin = Math.max(0, jumlah);
        // Create synthetic history or adjust riwayat if needed to reflect poin, or set koin directly in profil
        const spend = state.items.reduce((acc, itemId) => {
          const item = ITEM_TOKO.find((i) => i.id === itemId);
          return acc + (item ? item.hargaKoin : 0);
        }, 0);
        // We ensure riwayat has enough points to match desired koin
        const desiredPoin = targetKoin + spend;
        const currentPoin = totalPoin(state.riwayat, state.game);
        let newRiwayat = [...state.riwayat];
        if (desiredPoin > currentPoin) {
          const diff = Math.min(30, desiredPoin - currentPoin);
          SOAL.slice(0, diff).forEach((s) => {
            if (!newRiwayat.some((r) => r.soalId === s.id && r.benar)) {
              newRiwayat.push({
                id: uid("demo"),
                soalId: s.id,
                benar: true,
                domain: s.domain,
                waktu: new Date().toISOString(),
              });
            }
          });
        }
        const updatedProfil = { ...state.profil, koin: targetKoin };
        const newState = { profil: updatedProfil, riwayat: newRiwayat };
        return {
          ...newState,
          ...syncCalculatedFields({ ...state, ...newState }),
          profil: updatedProfil, // explicitly maintain custom koin amount
        };
      });
    },

    setSemuaMateriSelesai: (selesai: boolean) => {
      set((state) => {
        const newProgress: Record<string, ProgressMateri> = {};
        for (const m of MATERI) {
          newProgress[m.id] = selesai
            ? {
                materiId: m.id,
                tahapBelajar: "selesai",
                tahapCoba: "selesai",
                tahapLatihan: "selesai",
                selesai: true,
                percobaanLatihan: 1,
              }
            : {
                materiId: m.id,
                tahapBelajar: m.urutan === 1 ? "terbuka" : "terkunci",
                tahapCoba: "terkunci",
                tahapLatihan: "terkunci",
                selesai: false,
                percobaanLatihan: 0,
              };
        }
        return { progress: newProgress };
      });
    },

    setSemuaGameTerbuka: (terbuka: boolean) => {
      set((state) => {
        const newGame: Record<string, ProfilGame> = { ...state.game };
        const t = todayStr();
        ["g1", "g2", "g3", "gCampuran"].forEach((gid) => {
          newGame[gid] = {
            gameId: gid,
            skorTerbaik: terbuka ? 10 : 0,
            koinDihasilkan: terbuka ? 50 : 0,
            terakhirMain: t,
          };
        });
        const newState = { game: newGame };
        return { ...newState, ...syncCalculatedFields({ ...state, ...newState }) };
      });
    },

    catatTerakhirDibuka: (item) => set({ terakhirDibuka: item }),

    resetAll: () => {
      Object.values(KEYS).forEach((k) => remove(k));
      remove("items");
      set({
        profil: null, progress: {}, riwayat: [], game: {}, harian: {}, achievements: [], items: [], modeJuri: false, poin: 0, maskotLevel: 1, terakhirDibuka: null
      });
    }
  };
});

// Subscribe to state changes to save to localStorage
useApp.subscribe((state, prevState) => {
  if (state.profil !== prevState.profil) save(KEYS.profil, state.profil);
  if (state.progress !== prevState.progress) save(KEYS.materi, state.progress);
  if (state.riwayat !== prevState.riwayat) save(KEYS.riwayat, state.riwayat);
  if (state.game !== prevState.game) save(KEYS.game, state.game);
  if (state.harian !== prevState.harian) save(KEYS.harian, state.harian);
  if (state.achievements !== prevState.achievements) save(KEYS.badge, state.achievements);
  if (state.items !== prevState.items) save("items", state.items);
  if (state.terakhirDibuka !== prevState.terakhirDibuka) save(KEYS.terakhirDibuka, state.terakhirDibuka);
});

// AppProvider is now just a dummy wrapper to avoid modifying App.tsx imports
export function AppProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export { MATERI };

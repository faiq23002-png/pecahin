/**
 * Helper localStorage (pola kunci-nilai JSON terstruktur).
 * Keys mengikuti PROPOSAL-PECAH-IN.md §14.
 */
const PREFIX = "pecahin.";

export const KEYS = {
  profil: "profil",
  tahap: "tahap",
  materi: "materi",
  riwayat: "riwayat",
  game: "game",
  harian: "harian",
  badge: "badge",
  audio: "audio",
  terakhirDibuka: "terakhirDibuka",
} as const;

// Helper Base64 sederhana (Bisa dimodifikasi jika ingin lebih rumit)
const encodeData = (data: string) => btoa(encodeURIComponent(data));
const decodeData = (data: string) => decodeURIComponent(atob(data));

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    try {
      const decoded = decodeData(raw);
      return JSON.parse(decoded) as T;
    } catch {
      // Fallback if data is not encoded (e.g. from previous version)
      return JSON.parse(raw) as T;
    }
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    const jsonStr = JSON.stringify(value);
    const encoded = encodeData(jsonStr);
    localStorage.setItem(PREFIX + key, encoded);
  } catch (error: any) {
    // Tangani error quota exceeded
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert("⚠️ Ruang penyimpanan di perangkatmu penuh! Progres belajar tidak dapat disimpan.");
    }
    console.error("Gagal menyimpan data:", error);
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* abaikan */
  }
}

/** SFX ringan via Web Audio API (tanpa file, offline). */

import type { Soal } from "./types";

let ctx: AudioContext | null = null;
let muted = false;
let sfxVolume = 0.8; // 0..1
let musikVolume = 0.7; // 0..1
let bgmAudio: HTMLAudioElement | null = null;

export function setAudioMuted(m: boolean) {
  muted = m;
  if (bgmAudio) {
    if (m) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(() => {});
    }
  }
}

export function isAudioMuted() {
  return muted;
}

export function setVolumeSfx(vol: number) {
  sfxVolume = Math.max(0, Math.min(1, vol / 100));
}

export function setVolumeMusik(vol: number) {
  musikVolume = Math.max(0, Math.min(1, vol / 100));
  if (bgmAudio) {
    bgmAudio.volume = musikVolume;
  }
}

export function initOrPlayBgm() {
  if (typeof window === "undefined") return;
  if (!bgmAudio) {
    bgmAudio = new Audio(import.meta.env.BASE_URL + "audio/market-bgm.mp3");
    bgmAudio.loop = true;
  }
  bgmAudio.volume = musikVolume;
  if (!muted) {
    bgmAudio.play().catch(() => {
      // Browser autoplay policy might need first interaction
      const startOnInteraction = () => {
        if (!muted && bgmAudio && bgmAudio.paused) {
          bgmAudio.play().catch(() => {});
        }
        window.removeEventListener("pointerdown", startOnInteraction);
        window.removeEventListener("keydown", startOnInteraction);
      };
      window.addEventListener("pointerdown", startOnInteraction, { once: true });
      window.addEventListener("keydown", startOnInteraction, { once: true });
    });
  }
}

export function stopBgm() {
  if (bgmAudio) {
    bgmAudio.pause();
  }
}

function ac(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0) {
  const c = ac();
  if (!c) return;
  const effectiveVol = vol * sfxVolume;
  if (effectiveVol <= 0.0001) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(effectiveVol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

type SfxName = "tap" | "pop" | "star" | "success" | "wrong" | "unlock" | "bounce" | "whoosh";

export function sfx(name: SfxName) {
  if (muted) return;
  switch (name) {
    case "tap":
      tone(660, 0.06, "triangle", 0.08);
      break;
    case "pop":
      tone(440, 0.08, "triangle", 0.1);
      tone(660, 0.08, "triangle", 0.08, 0.05);
      break;
    case "star":
      tone(880, 0.1, "sine", 0.12);
      tone(1320, 0.12, "sine", 0.1, 0.08);
      break;
    case "success":
      tone(523, 0.12, "sine", 0.12);
      tone(659, 0.12, "sine", 0.12, 0.1);
      tone(784, 0.2, "sine", 0.12, 0.2);
      break;
    case "wrong":
      tone(200, 0.18, "sawtooth", 0.1);
      tone(150, 0.2, "sawtooth", 0.08, 0.1);
      break;
    case "unlock":
      tone(392, 0.1, "triangle", 0.1);
      tone(523, 0.1, "triangle", 0.1, 0.08);
      tone(659, 0.16, "triangle", 0.1, 0.16);
      break;
    case "bounce":
      tone(300, 0.08, "sine", 0.1);
      tone(380, 0.08, "sine", 0.1, 0.07);
      break;
    case "whoosh":
      tone(600, 0.2, "sine", 0.06);
      break;
  }
}

/* ================= Narasi soal ("Dengarkan soal") ================= */

let currentSoalAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentSafetyTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Format teks soal agar dibaca ramah dan natural oleh TTS Bahasa Indonesia
 * (mengubah pecahan 3/4 jadi "tiga per empat", simbol +, =, dll).
 */
export function teksUntukSuara(teks: string): string {
  return teks
    // Hilangkan emoji dan simbol visual
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Konversi pecahan umum
    .replace(/\b1\/2\b/g, "satu per dua")
    .replace(/\b1\/3\b/g, "satu per tiga")
    .replace(/\b2\/3\b/g, "dua per tiga")
    .replace(/\b1\/4\b/g, "satu per empat")
    .replace(/\b2\/4\b/g, "dua per empat")
    .replace(/\b3\/4\b/g, "tiga per empat")
    .replace(/\b1\/5\b/g, "satu per lima")
    .replace(/\b2\/5\b/g, "dua per lima")
    .replace(/\b3\/5\b/g, "tiga per lima")
    .replace(/\b4\/5\b/g, "empat per lima")
    .replace(/\b1\/6\b/g, "satu per enam")
    .replace(/\b2\/6\b/g, "dua per enam")
    .replace(/\b3\/6\b/g, "tiga per enam")
    .replace(/\b4\/6\b/g, "empat per enam")
    .replace(/\b5\/6\b/g, "lima per enam")
    .replace(/\b1\/7\b/g, "satu per tujuh")
    .replace(/\b2\/7\b/g, "dua per tujuh")
    .replace(/\b1\/8\b/g, "satu per delapan")
    .replace(/\b2\/8\b/g, "dua per delapan")
    .replace(/\b3\/8\b/g, "tiga per delapan")
    .replace(/\b5\/8\b/g, "lima per delapan")
    .replace(/\b7\/8\b/g, "tujuh per delapan")
    // Format pecahan angka umum: misalnya 5/10 -> 5 per 10
    .replace(/(\d+)\/(\d+)/g, "$1 per $2")
    // Simbol dan operator matematika
    .replace(/\+/g, " ditambah ")
    .replace(/=/g, " sama dengan ")
    .replace(/</g, " lebih kecil dari ")
    .replace(/>/g, " lebih besar dari ")
    .replace(/[…\.]{2,}/g, " berapa ")
    .replace(/:\s*/g, ", ")
    // Rapikan spasi berlebih
    .replace(/\s+/g, " ")
    .trim();
}

/* ===== Util suara TTS: preload & pilih voice Indonesia ===== */
let cachedVoices: SpeechSynthesisVoice[] = [];

function muatVoices(): SpeechSynthesisVoice[] {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    const v = window.speechSynthesis.getVoices();
    if (v && v.length) cachedVoices = v;
  } catch {
    /* abaikan */
  }
  return cachedVoices;
}

function pilihVoiceId(): SpeechSynthesisVoice | null {
  const voices = muatVoices();
  if (!voices.length) return null;
  // Prioritas 1: lang id-ID
  const id = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("id"));
  if (id) return id;
  // Prioritas 2: nama mengandung "indonesia"
  const indo = voices.find((v) => /indonesia/i.test(v.name));
  if (indo) return indo;
  // Prioritas 3: suara default browser
  const def = voices.find((v) => v.default);
  if (def) return def;
  // Fallback: suara pertama yang tersedia
  return voices[0];
}

// Preload suara sejak awal + tangkap event voiceschanged (voice dimuat async)
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  muatVoices();
  window.speechSynthesis.onvoiceschanged = () => muatVoices();
}

function ttsSoal(soal: Soal, done: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    done();
    return;
  }

  try {
    if (currentSafetyTimeout) {
      clearTimeout(currentSafetyTimeout);
      currentSafetyTimeout = null;
    }

    const synth = window.speechSynthesis;

    // Batalkan suara lama dan pastikan tidak dalam state paused
    synth.cancel();
    if (synth.paused) {
      synth.resume();
    }

    const kalimat = teksUntukSuara(soal.teks);
    const u = new SpeechSynthesisUtterance(kalimat);
    // Simpan referensi global untuk mencegah garbage collection oleh browser V8
    currentUtterance = u;
    (window as any).__lastUtterance = u;

    u.lang = "id-ID";
    u.rate = 0.9;
    u.pitch = 1.0;

    // Pilih voice Indonesia secara eksplisit (fallback ke suara default bila tak ada)
    const voice = pilihVoiceId();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || "id-ID";
    } else {
      console.warn("[TTS] Tidak ada voice di perangkat ini — butuh MP3 narasi di public/audio/.");
    }

    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        if (currentSafetyTimeout) {
          clearTimeout(currentSafetyTimeout);
          currentSafetyTimeout = null;
        }
        currentUtterance = null;
        done();
      }
    };

    u.onend = finish;
    u.onerror = (e) => {
      console.warn("TTS Error:", e);
      finish();
    };

    // Panggil speak() LANGSUNG secara sinkron dalam user gesture handler
    synth.speak(u);
    if (synth.paused) {
      synth.resume();
    }

    // Safety timeout berbasis jumlah kata
    const wordCount = kalimat.split(/\s+/).length;
    const durasiMs = Math.max(5000, Math.min(25000, (wordCount / 2) * 1000 + 4000));
    currentSafetyTimeout = setTimeout(finish, durasiMs);
  } catch (err) {
    console.warn("TTS Fatal:", err);
    done();
  }
}

/**
 * Putar narasi soal: MP3 custom jika ada, atau TTS sintetis Bahasa Indonesia langsung.
 * Resolve saat selesai (atau gagal), supaya UI bisa reset state "sedang bicara".
 */
export function playSoal(soal: Soal): Promise<void> {
  return new Promise<void>((resolve) => {
    stopSoal();
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    // Jika soal memiliki rekaman audio custom eksplisit
    if (soal.audioPath) {
      try {
        const audio = new Audio(soal.audioPath);
        currentSoalAudio = audio;
        audio.onended = () => {
          currentSoalAudio = null;
          done();
        };
        audio.onerror = () => {
          currentSoalAudio = null;
          ttsSoal(soal, done);
        };
        audio.play().catch(() => {
          currentSoalAudio = null;
          ttsSoal(soal, done);
        });
      } catch {
        ttsSoal(soal, done);
      }
    } else {
      // Langsung eksekusi TTS tanpa delay request 404 agar gesture klik browser tetap aktif
      ttsSoal(soal, done);
    }
  });
}

export function stopSoal(): void {
  if (currentSafetyTimeout) {
    clearTimeout(currentSafetyTimeout);
    currentSafetyTimeout = null;
  }
  if (currentSoalAudio) {
    currentSoalAudio.pause();
    currentSoalAudio.onended = null;
    currentSoalAudio.onerror = null;
    currentSoalAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }
  currentUtterance = null;
}

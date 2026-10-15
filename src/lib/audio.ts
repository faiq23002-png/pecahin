/** SFX ringan via Web Audio API (tanpa file, offline). */

import type { Soal } from "./types";

let ctx: AudioContext | null = null;
let muted = false;

export function setAudioMuted(m: boolean) {
  muted = m;
}
export function isAudioMuted() {
  return muted;
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
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
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

function ttsSoal(soal: Soal, done: () => void) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(soal.teks);
    u.lang = "id-ID";
    u.rate = 0.9;
    u.onend = done;
    u.onerror = done;
    speechSynthesis.speak(u);
    // safety bila voice Indonesia tidak terpasang
    setTimeout(done, 6000);
  } catch {
    done();
  }
}

/**
 * Putar narasi soal: MP3 utama (public/audio/<id>.mp3), TTS sebagai cadangan.
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
    const src = soal.audioPath ?? import.meta.env.BASE_URL + "audio/" + soal.id + ".mp3";
    try {
      const audio = new Audio(src);
      currentSoalAudio = audio;
      audio.onended = done;
      audio.onerror = () => ttsSoal(soal, done);
      audio.play().catch(() => ttsSoal(soal, done));
    } catch {
      ttsSoal(soal, done);
    }
  });
}

export function stopSoal(): void {
  if (currentSoalAudio) {
    currentSoalAudio.pause();
    currentSoalAudio.onended = null;
    currentSoalAudio.onerror = null;
    currentSoalAudio = null;
  }
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

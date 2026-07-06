/**
 * Lightweight quiz sound effects using the Web Audio API on web,
 * and expo-av as a fallback on native.
 *
 * No external audio files needed — tones are synthesised in real time.
 */
import { Platform } from "react-native";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationMs: number,
  type: OscillatorType = "sine",
  gain = 0.08,
) {
  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);

  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + durationMs / 1000);

  osc.connect(g);
  g.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + durationMs / 1000);
}

/** Soft tick — every second during normal countdown. */
export function playTick() {
  playTone(880, 60, "sine", 0.05);
}

/** Warning pulse — last 5 seconds. */
export function playWarning() {
  playTone(660, 120, "square", 0.07);
}

/** Timeout buzz — when timer hits zero. */
export function playTimeout() {
  playTone(220, 350, "sawtooth", 0.1);
}

/** Correct answer chime. */
export function playCorrect() {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t + i * 0.08);
    g.gain.setValueAtTime(0.06, t + i * 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.25);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t + i * 0.08);
    osc.stop(t + i * 0.08 + 0.25);
  });
}

/** Wrong answer low tone. */
export function playWrong() {
  playTone(200, 250, "triangle", 0.08);
}

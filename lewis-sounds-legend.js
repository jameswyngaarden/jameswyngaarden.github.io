/*
 * LewisSounds (Legend edition) — character sound motifs for the Lewis Pixel board,
 * in the spirit of late-80s / early-90s console adventure games.
 * NES-style pulse waves (12.5 / 25 / 50% duty), triangle bass, 1-bit noise,
 * a synthesized formant "voice", and a short echo. Original motifs; no audio files.
 *
 * Same API as lewis-sounds.js, so the two files are drop-in swaps:
 *   LewisSounds.move(move) · LewisSounds.play(name) · LewisSounds.toggleMuted()
 */
(function (root) {
  'use strict';

  const VOLUME = 0.32;
  const LAND_DELAY = 0.38;   // matches the board's ANIM_MS

  // ---- notes -----------------------------------------------------------
  const SEMI = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  function hz(n) {
    const m = /^([A-G])(b|#)?(\d)$/.exec(n);
    return 440 * Math.pow(2, (SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] - 4) * 12) / 12);
  }

  // ---- waveforms ---------------------------------------------------------
  function pulseWave(c, duty) {
    c.__lewisWaves = c.__lewisWaves || {};
    if (!c.__lewisWaves[duty]) {
      const N = 64, re = new Float32Array(N), im = new Float32Array(N);
      for (let n = 1; n < N; n++) re[n] = 2 * Math.sin(Math.PI * n * duty) / (Math.PI * n);
      c.__lewisWaves[duty] = c.createPeriodicWave(re, im);
    }
    return c.__lewisWaves[duty];
  }
  const DUTY = { pulse12: 0.125, pulse25: 0.25, pulse50: 0.5 };

  function osc(c, type) {
    const o = c.createOscillator();
    if (DUTY[type]) o.setPeriodicWave(pulseWave(c, DUTY[type])); else o.type = type;
    return o;
  }

  function vibrato(c, o, t, { cents = 15, rate = 5.5, delay = 0.08, dur = 1 }) {
    const lfo = c.createOscillator(), depth = c.createGain();
    lfo.frequency.value = rate;
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(cents, t + delay + 0.1);
    lfo.connect(depth); depth.connect(o.detune);
    lfo.start(t); lfo.stop(t + dur + 0.05);
  }

  // ---- primitives --------------------------------------------------------
  function tone(c, out, t, o) {
    const { freq, dur, slideTo = null, vol = 0.5, type = 'pulse25',
      attack = 0.003, release = 0.04, vib = null, decay = false } = o;
    const s = osc(c, type), g = c.createGain();
    s.frequency.setValueAtTime(freq, t);
    if (slideTo) s.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    if (vib) vibrato(c, s, t, Object.assign({ dur }, vib));
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    if (decay) g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    else {
      g.gain.setValueAtTime(vol, t + Math.max(attack, dur - release));
      g.gain.linearRampToValueAtTime(0, t + dur);
    }
    s.connect(g); g.connect(out);
    s.start(t); s.stop(t + dur + 0.05);
  }

  function noiseBuffer(c) {
    if (!c.__lewisNoise) {
      const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0);
      let v = 1, hold = 0;
      for (let i = 0; i < d.length; i++) {
        if (hold-- <= 0) { v = Math.random() < 0.5 ? -1 : 1; hold = 1 + (Math.random() * 3 | 0); }
        d[i] = v;
      }
      c.__lewisNoise = b;
    }
    return c.__lewisNoise;
  }

  function noise(c, out, t, o) {
    const { dur, vol = 0.5, from = 4000, to = 200, type = 'lowpass', q = 0.7 } = o;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = noiseBuffer(c);
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); g.connect(out);
    s.start(t); s.stop(t + dur + 0.05);
  }

  // Formant "voice": a buzzy source through three vowel resonances, with vibrato and glide.
  const VOWELS = {
    a: [[800, 1.0, 10], [1150, 0.5, 12], [2900, 0.18, 22]],   // "ah" (higher voice)
    o: [[450, 1.0, 8], [800, 0.4, 10], [2830, 0.08, 20]],     // "oh" (lower voice)
  };
  function voice(c, out, t, notes, o = {}) {
    const { vowel = 'a', vol = 0.5, attack = 0.05, release = 0.12, cents = 22 } = o;
    const total = notes.reduce((s, n) => s + n[1], 0);
    const src = c.createOscillator(), src2 = c.createOscillator();
    src.type = 'sawtooth'; src2.type = 'sawtooth';
    src2.detune.value = 9;                                   // slight chorus
    let tt = t;
    for (const [n, d] of notes) {
      src.frequency.setTargetAtTime(hz(n), tt, tt === t ? 0.001 : 0.025);
      src2.frequency.setTargetAtTime(hz(n), tt, tt === t ? 0.001 : 0.025);
      tt += d;
    }
    vibrato(c, src, t, { cents, dur: total, delay: 0.12 });
    vibrato(c, src2, t, { cents, dur: total, delay: 0.12, rate: 5.2 });
    const mix = c.createGain(); mix.gain.value = 0.5;
    src.connect(mix); src2.connect(mix);
    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(vol, t + attack);
    env.gain.setValueAtTime(vol, t + total - release);
    env.gain.linearRampToValueAtTime(0, t + total);
    for (const [f, g, q] of VOWELS[vowel]) {
      const bp = c.createBiquadFilter(), gg = c.createGain();
      bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
      gg.gain.value = g * 3.2;
      mix.connect(bp); bp.connect(gg); gg.connect(env);
    }
    env.connect(out);
    src.start(t); src2.start(t);
    src.stop(t + total + 0.05); src2.stop(t + total + 0.05);
  }

  const seq = (c, out, t, notes, opts) => {          // [[note, dur], ...] as separate notes
    let tt = t;
    for (const [n, d] of notes) {
      if (n) tone(c, out, tt, Object.assign({ freq: hz(n), dur: d * 0.92 }, opts));
      tt += d;
    }
  };

  // ---- the characters ----------------------------------------------------
  const SOUNDS = {
    // Pawn — a humble little footstep pair
    pawn(c, out, t) {
      seq(c, out, t, [['A4', 0.06], ['D5', 0.08]], { type: 'pulse12', vol: 0.4, decay: true });
      tone(c, out, t, { freq: hz('D3'), dur: 0.08, type: 'triangle', vol: 0.5, decay: true });
    },

    // Knight — galloping "da-da-DUM" with hoofbeats, heroic rising fifth
    knight(c, out, t) {
      const beats = [[0, 'D5', 0.06], [0.075, 'D5', 0.06], [0.15, 'A5', 0.2]];
      for (const [dt, n, d] of beats) {
        tone(c, out, t + dt, { freq: hz(n), dur: d, type: 'pulse25', vol: 0.32, vib: d > 0.1 ? { cents: 12 } : null });
        noise(c, out, t + dt, { dur: 0.035, vol: 0.3, from: 6000, to: 1800 });
      }
      seq(c, out, t, [['D3', 0.075], ['D3', 0.075], ['A2', 0.2]], { type: 'triangle', vol: 0.55 });
    },

    // Bishop — a small church-organ "amen" (plagal cadence) with a held bell
    bishop(c, out, t) {
      for (const [chord, dt, d] of [[['C4', 'E4', 'G4'], 0, 0.2], [['B3', 'D4', 'G4'], 0.2, 0.34]]) {
        for (const n of chord) tone(c, out, t + dt, { freq: hz(n), dur: d, type: 'pulse25', vol: 0.15, attack: 0.02, release: 0.08 });
      }
      seq(c, out, t, [['C3', 0.2], ['G2', 0.34]], { type: 'triangle', vol: 0.55, attack: 0.02 });
      tone(c, out, t + 0.2, { freq: hz('G6'), dur: 0.45, type: 'sine', vol: 0.12, decay: true });
    },

    // Rook — stone and earth: low descending fourth with a rumble
    rook(c, out, t) {
      tone(c, out, t, { freq: hz('D2'), slideTo: hz('A1'), dur: 0.24, type: 'triangle', vol: 0.8, decay: true });
      seq(c, out, t, [['A3', 0.08], ['E3', 0.14]], { type: 'pulse50', vol: 0.18 });
      noise(c, out, t, { dur: 0.26, vol: 0.4, from: 700, to: 60 });
    },

    // Queen — a sung "aah" phrase with a harp flourish
    queen(c, out, t) {
      ['D5', 'F#5', 'A5', 'D6'].forEach((n, i) =>
        tone(c, out, t + i * 0.035, { freq: hz(n), dur: 0.25, type: 'pulse12', vol: 0.13, decay: true }));
      voice(c, out, t + 0.06, [['A4', 0.16], ['E5', 0.18], ['D5', 0.42]], { vowel: 'a', vol: 0.5 });
      tone(c, out, t + 0.06, { freq: hz('D3'), dur: 0.7, type: 'triangle', vol: 0.3, attack: 0.05, release: 0.2 });
    },

    // King — a brass fanfare over a deep "oh"
    king(c, out, t) {
      const fan = [['G3', 0.09], ['G3', 0.06], ['C4', 0.12], ['G4', 0.34]];
      seq(c, out, t, fan, { type: 'pulse50', vol: 0.22, vib: { cents: 10, delay: 0.05 } });
      seq(c, out, t, fan.map(([n, d]) => [n.replace(/\d/, (x) => +x + 1), d]), { type: 'pulse25', vol: 0.1 });
      voice(c, out, t + 0.27, [['C3', 0.36]], { vowel: 'o', vol: 0.35, cents: 12 });
      seq(c, out, t, [['C2', 0.27], ['C2', 0.34]], { type: 'triangle', vol: 0.5 });
    },

    // Capture — sword slash, blade ring, and impact
    capture(c, out, t) {
      noise(c, out, t, { dur: 0.12, vol: 0.55, from: 9000, to: 1200, type: 'bandpass', q: 1.5 });
      tone(c, out, t + 0.07, { freq: hz('E6'), dur: 0.22, type: 'pulse12', vol: 0.2, decay: true });
      tone(c, out, t + 0.07, { freq: hz('F6'), dur: 0.22, type: 'pulse12', vol: 0.15, decay: true });
      tone(c, out, t + 0.07, { freq: hz('A2'), slideTo: hz('A1'), dur: 0.18, type: 'triangle', vol: 0.7, decay: true });
      noise(c, out, t + 0.07, { dur: 0.16, vol: 0.4, from: 2000, to: 100 });
    },

    // Check — a tense danger tremolo
    check(c, out, t) {
      for (let i = 0; i < 8; i++)
        tone(c, out, t + i * 0.045, { freq: hz(i % 2 ? 'Eb5' : 'D5'), dur: 0.04, type: 'pulse25', vol: 0.28 });
      tone(c, out, t, { freq: hz('D3'), dur: 0.4, type: 'triangle', vol: 0.5 });
      tone(c, out, t + 0.36, { freq: hz('Ab4'), dur: 0.18, type: 'pulse50', vol: 0.18, decay: true });
    },

    // Checkmate — a solemn sung cadence and a final low toll
    mate(c, out, t) {
      voice(c, out, t, [['D5', 0.26], ['C5', 0.26], ['A4', 0.7]], { vowel: 'a', vol: 0.45 });
      seq(c, out, t, [['Bb2', 0.26], ['A2', 0.26], ['D2', 0.8]], { type: 'triangle', vol: 0.6, release: 0.3 });
      seq(c, out, t, [['F4', 0.26], ['E4', 0.26], ['D4', 0.7]], { type: 'pulse25', vol: 0.1, attack: 0.03, release: 0.25 });
      tone(c, out, t + 0.52, { freq: hz('D6'), dur: 0.9, type: 'sine', vol: 0.1, decay: true });
    },

    // Promotion — a transformation: sparkle run and a rising sung swell
    promote(c, out, t) {
      ['D5', 'F#5', 'A5', 'D6', 'F#6', 'A6', 'D7'].forEach((n, i) =>
        tone(c, out, t + i * 0.03, { freq: hz(n), dur: 0.2, type: 'pulse12', vol: 0.24, decay: true }));
      voice(c, out, t + 0.12, [['A4', 0.12], ['D5', 0.4]], { vowel: 'a', vol: 0.6, attack: 0.1 });
    },
  };

  const PIECE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

  function cuesFor(move, land = LAND_DELAY) {
    const cues = [[PIECE[move.piece], 0]];
    const f = move.flags || '', san = move.san || '';
    if (/[kq]/.test(f)) cues.push(['rook', land]);
    if (/[ce]/.test(f)) cues.push(['capture', land]);
    if (move.promotion) cues.push(['promote', land + (/[ce]/.test(f) ? 0.2 : 0)]);
    if (san.includes('#')) cues.push(['mate', land + 0.25]);
    else if (san.includes('+')) cues.push(['check', land + 0.15]);
    return cues;
  }

  // Echo: a short dampened delay for a little dungeon-hall space
  function graph(c, dest) {
    const input = c.createGain();
    input.connect(dest);
    const send = c.createGain(), d = c.createDelay(1), fb = c.createGain(), lp = c.createBiquadFilter();
    send.gain.value = 0.3; d.delayTime.value = 0.15; fb.gain.value = 0.3;
    lp.type = 'lowpass'; lp.frequency.value = 2400;
    input.connect(send); send.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(dest);
    return input;
  }

  // ---- live playback ----------------------------------------------------
  let ctx = null, fxIn = null, current = null, muted = false;
  try { muted = localStorage.getItem('lewisSoundsMuted') === '1'; } catch (e) {}

  function audio() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = VOLUME;
      master.connect(ctx.destination);
      fxIn = graph(ctx, master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function freshBus(c) {
    if (current) {
      const g = current.gain;
      g.cancelScheduledValues(c.currentTime);
      g.setValueAtTime(g.value, c.currentTime);
      g.linearRampToValueAtTime(0, c.currentTime + 0.04);
    }
    current = c.createGain();
    current.connect(fxIn);
    return current;
  }

  const LewisSounds = {
    names: Object.keys(SOUNDS),
    cuesFor,
    graph,
    schedule(c, out, name, t) { SOUNDS[name](c, out, t); },
    play(name) {
      if (muted || !SOUNDS[name]) return;
      const c = audio(); if (!c) return;
      SOUNDS[name](c, freshBus(c), c.currentTime + 0.01);
    },
    move(move, opts = {}) {
      if (muted || !move) return;
      const c = audio(); if (!c) return;
      const bus = freshBus(c), t0 = c.currentTime + 0.01;
      for (const [name, dt] of cuesFor(move, opts.landDelay)) SOUNDS[name](c, bus, t0 + dt);
    },
    isMuted() { return muted; },
    setMuted(m) {
      muted = !!m;
      try { localStorage.setItem('lewisSoundsMuted', muted ? '1' : '0'); } catch (e) {}
      if (muted && current && ctx) current.gain.setValueAtTime(0, ctx.currentTime);
      return muted;
    },
    toggleMuted() { return this.setMuted(!muted); },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = LewisSounds;
  else root.LewisSounds = LewisSounds;
})(typeof window !== 'undefined' ? window : globalThis);

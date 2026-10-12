/*
 * LewisBoard — perspective 1-bit chessboard renderer for the "Lewis Pixel" set.
 *
 *   const board = new LewisBoard(containerEl, { spritePath: 'stimuli/lewis-pixel/' });
 *   board.setOrientation('white' | 'black');
 *   board.show(fen, { lastMove });                 // static position, optional highlight
 *   board.play(prevFen, fen, move);                // animate one move (chess.js move object)
 *
 * Sprites: <spritePath>{white|black}-{king|queen|rook|bishop|knight|pawn}.png
 */
(function (root) {
  'use strict';

  const NAMES = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
  const PALETTE = {
    bg: [200, 193, 180],
    paper: [255, 255, 255],
    orange: [232, 150, 42],
    hl: [222, 110, 18],
    from: [240, 178, 96],
  };
  const ASPECT = 0.74;        // canvas height / width
  const PERSP = 0.28;         // depth foreshortening (far edge = 1/(1+PERSP) of near width)
  const NEAR_W = 0.90;        // near edge width, fraction of canvas width
  const NEAR_Y = 0.96;        // near edge y, fraction of canvas height
  const FAR_Y = 0.30;         // far edge y
  const PIECE_H = 1.35;       // king height in near-square widths
  const KING_SPRITE_H = 120;  // native king sprite height, used as the size reference
  const ANIM_MS = 380;
  const ANIM_STEPS = 12;      // quantized frames for a stepped, early-Mac feel

  function parseFen(fen) {
    const out = [];
    const rows = fen.split(' ')[0].split('/');
    for (let i = 0; i < 8; i++) {
      let file = 0;
      for (const ch of rows[i]) {
        if (/\d/.test(ch)) { file += +ch; continue; }
        out.push({
          color: ch === ch.toUpperCase() ? 'w' : 'b',
          type: ch.toLowerCase(),
          file,
          rank: 7 - i,
        });
        file++;
      }
    }
    return out;
  }

  const sq = (s) => ({ file: s.charCodeAt(0) - 97, rank: +s[1] - 1 });

  class LewisBoard {
    constructor(container, opts = {}) {
      this.opts = Object.assign({ spritePath: 'stimuli/lewis-pixel/' }, opts);
      this.orientation = 'white';
      this.pieces = [];
      this.lastMove = null;
      this.anim = null;
      this.sprites = opts.sprites || null;   // { 'w-k': Image, ... } may be injected
      this.canvas = opts.canvas || document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      if (container) {
        this.canvas.className = 'lewis-board';
        this.canvas.style.width = '100%';
        this.canvas.style.display = 'block';
        this.canvas.style.imageRendering = 'pixelated';
        container.innerHTML = '';
        container.appendChild(this.canvas);
        this.container = container;
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(() => this.resize()).observe(container);
        }
      }
      this.ready = this.sprites ? Promise.resolve() : this._loadSprites();
      this.ready.then(() => { this.resize(); });
    }

    _loadSprites() {
      this.sprites = {};
      const jobs = [];
      for (const c of ['w', 'b']) {
        for (const t of Object.keys(NAMES)) {
          const img = new Image();
          const color = c === 'w' ? 'white' : 'black';
          img.src = `${this.opts.spritePath}${color}-${NAMES[t]}.png`;
          this.sprites[`${c}-${t}`] = img;
          jobs.push(img.decode ? img.decode().catch(() => {}) :
            new Promise((r) => { img.onload = img.onerror = r; }));
        }
      }
      return Promise.all(jobs);
    }

    resize(width) {
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
      const cssW = width || (this.container ? this.container.clientWidth : 800) || 800;
      const W = Math.round(cssW * dpr);
      const H = Math.round(W * ASPECT);
      if (this.canvas.width !== W || this.canvas.height !== H) {
        this.canvas.width = W;
        this.canvas.height = H;
        this._boardCache = null;
      }
      this.draw();
    }

    setOrientation(color) {
      const o = color === 'black' ? 'black' : 'white';
      if (o !== this.orientation) { this.orientation = o; this._boardCache = null; }
    }

    show(fen, { lastMove = null } = {}) {
      this._finishAnim();
      this.pieces = parseFen(fen);
      this.lastMove = lastMove;
      this._boardCache = null;
      this.draw();
    }

    play(prevFen, fen, move) {
      this._finishAnim();
      const before = parseFen(prevFen);
      const after = parseFen(fen);
      const movers = [];
      const from = sq(move.from), to = sq(move.to);
      movers.push({ color: move.color, type: move.piece, from, to, endType: move.promotion || move.piece });
      if (move.flags && /[kq]/.test(move.flags)) {               // castling: rook rides along
        const r = from.rank, ks = move.flags.includes('k');
        movers.push({ color: move.color, type: 'r', from: { file: ks ? 7 : 0, rank: r },
          to: { file: ks ? 5 : 3, rank: r }, endType: 'r' });
      }
      const moving = new Set(movers.map((m) => m.from.file + ',' + m.from.rank));
      const statics = before.filter((p) => !moving.has(p.file + ',' + p.rank));
      this.lastMove = move;
      this._boardCache = null;
      this.anim = { start: null, movers, statics, after };
      const step = (ts) => {
        if (!this.anim) return;
        if (this.anim.start === null) this.anim.start = ts;
        const raw = Math.min(1, (ts - this.anim.start) / ANIM_MS);
        this.anim.t = Math.round(raw * ANIM_STEPS) / ANIM_STEPS;
        if (raw >= 1) { this._finishAnim(); return; }
        this.draw();
        this.anim.raf = requestAnimationFrame(step);
      };
      this.anim.raf = requestAnimationFrame(step);
    }

    _finishAnim() {
      if (!this.anim) return;
      if (this.anim.raf && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.anim.raf);
      this.pieces = this.anim.after;
      this.anim = null;
      this.draw();
    }

    // ---- geometry -------------------------------------------------------
    // Board coordinates: fx 0..8 across, d 0..8 depth (0 = near edge), display space.
    _proj(fx, d) {
      const W = this.canvas.width, H = this.canvas.height;
      const z = 1 / (1 + PERSP * d / 8);
      const zFar = 1 / (1 + PERSP);
      const tt = (1 - z) / (1 - zFar);
      const nearY = NEAR_Y * H, farY = FAR_Y * H;
      return {
        x: W / 2 + (fx - 4) / 8 * NEAR_W * W * z,
        y: nearY + (farY - nearY) * tt,
        z,
      };
    }

    _display(file, rank) {
      return this.orientation === 'white'
        ? { df: file, dd: rank }
        : { df: 7 - file, dd: 7 - rank };
    }

    // ---- drawing --------------------------------------------------------
    _renderBoard() {
      const W = this.canvas.width, H = this.canvas.height;
      const img = this.ctx.createImageData(W, H);
      const px = img.data;
      const zFar = 1 / (1 + PERSP);
      const nearY = NEAR_Y * H, farY = FAR_Y * H;
      const dot = Math.max(2, Math.round(W / 300));
      const hl = {};
      if (this.lastMove) {
        const f = this._display(sq(this.lastMove.from).file, sq(this.lastMove.from).rank);
        const t = this._display(sq(this.lastMove.to).file, sq(this.lastMove.to).rank);
        hl[f.df + ',' + f.dd] = PALETTE.from;
        hl[t.df + ',' + t.dd] = PALETTE.hl;
      }
      for (let i = 0; i < W * H; i++) {
        px[i * 4] = PALETTE.bg[0]; px[i * 4 + 1] = PALETTE.bg[1];
        px[i * 4 + 2] = PALETTE.bg[2]; px[i * 4 + 3] = 255;
      }
      for (let y = Math.ceil(farY); y < Math.floor(nearY); y++) {
        const tt = (y - nearY) / (farY - nearY);
        const z = 1 - tt * (1 - zFar);
        const d = (1 / z - 1) / PERSP * 8;
        const r = Math.min(7, Math.floor(d));
        const w = NEAR_W * W * z;
        const x0 = Math.ceil(W / 2 - w / 2), x1 = Math.floor(W / 2 + w / 2);
        for (let x = x0; x < x1; x++) {
          const f = Math.min(7, Math.floor((x - W / 2) / w * 8 + 4));
          let c;
          const h = hl[f + ',' + r];
          if (h) c = h;
          else if ((f + r) % 2 === 0) {                       // dark square: orange dither
            c = ((Math.floor(x / dot) + Math.floor(y / dot)) % 2 === 0) ? PALETTE.orange : PALETTE.paper;
          } else c = PALETTE.paper;
          const k = (y * W + x) * 4;
          px[k] = c[0]; px[k + 1] = c[1]; px[k + 2] = c[2];
        }
      }
      return img;
    }

    _drawPiece(p, fx, d, hop = 0) {
      const img = this.sprites && this.sprites[`${p.color}-${p.type}`];
      if (!img || !img.width) return;
      const W = this.canvas.width;
      const c = this._proj(fx, d);
      const squareW = NEAR_W * W * c.z / 8;
      const scale = PIECE_H * squareW / KING_SPRITE_H;
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const x = Math.round(c.x - w / 2);
      const y = Math.round(c.y - h + squareW * 0.12 - hop * squareW);
      this.ctx.drawImage(img, x, y, w, h);
    }

    draw() {
      if (!this.canvas.width) return;
      if (!this._boardCache) this._boardCache = this._renderBoard();
      this.ctx.putImageData(this._boardCache, 0, 0);
      this.ctx.imageSmoothingEnabled = false;

      const items = [];
      const src = this.anim ? this.anim.statics : this.pieces;
      for (const p of src) {
        const { df, dd } = this._display(p.file, p.rank);
        items.push({ p, fx: df + 0.5, d: dd + 0.5, hop: 0 });
      }
      if (this.anim) {
        const t = this.anim.t || 0;
        for (const m of this.anim.movers) {
          const a = this._display(m.from.file, m.from.rank);
          const b = this._display(m.to.file, m.to.rank);
          const fx = a.df + (b.df - a.df) * t + 0.5;
          const d = a.dd + (b.dd - a.dd) * t + 0.5;
          const hop = m.type === 'n' ? Math.sin(Math.PI * t) * 0.9 : 0;   // knights jump
          items.push({ p: { color: m.color, type: t >= 1 ? m.endType : m.type }, fx, d, hop, mover: true });
        }
        // a piece being captured stays until the mover lands on it
        const landing = this.anim.movers.map((m) => m.to.file + ',' + m.to.rank);
        for (const it of items) {
          if (!it.mover && t > 0.85 && landing.includes(it.p.file + ',' + it.p.rank)) it.skip = true;
        }
      }
      items.sort((a, b) => b.d - a.d || (a.mover ? 1 : -1));
      for (const it of items) if (!it.skip) this._drawPiece(it.p, it.fx, it.d, it.hop);
    }
  }

  LewisBoard.START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  if (typeof module !== 'undefined' && module.exports) module.exports = LewisBoard;
  else root.LewisBoard = LewisBoard;
})(typeof window !== 'undefined' ? window : globalThis);

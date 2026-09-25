/* ===================================================================
   Hero Reel - 15s canvas showreel at the top of the home hero
   Ingest -> Bronze/Silver/Gold -> CI/CD -> Azure + GCP -> VA end card.
   Every frame is a pure function of time, so replay just resets t.
   Scene coordinates live in a centered square of side H ("world"),
   wx() maps a fraction of the full stage width into that space.
   Reuses LOGO_PATHS and mulberry32 from background-logo.js.
   =================================================================== */

(function () {
  const DURATION = 15;
  const N = 256;
  const TAU = Math.PI * 2;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOutExpo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));
  const easeInOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const easeOutBack = (k) => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2);
  const hex = (h) => [1, 3, 5].map((o) => parseInt(h.slice(o, o + 2), 16));
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  const palette = (p) => {
    const out = { BG: p.BG, SURFACE_1: p.SURFACE_1, SURFACE_2: p.SURFACE_2 };
    Object.keys(p).forEach((k) => {
      if (!(k in out)) out[k] = Array.isArray(p[k]) ? p[k].map(hex) : hex(p[k]);
    });
    return out;
  };

  const PALETTES = {
    // Moonlight roles and syntax hues from docs/blog/moonlight-palette.md.
    // Signals keep their meaning: success only marks a passed gate.
    moonlight: palette({
      BG: "#0D0E17", SURFACE_1: "#141726", SURFACE_2: "#1C2033",
      TEXT: "#EEEEFA", MUTED: "#9BA3C4",
      RAW: ["#7E86A4", "#9BA3C4", "#8A9BE0", "#B9C6F5", "#79C0FF", "#C9A0EE"],
      BRONZE: "#F2B199", SILVER: "#CDCFE7", GOLD: "#DBB060",
      BLUE: "#8A9BE0", GREEN: "#49EF95", ACCENT: "#A2B0EA",
      LOGO_TOP: "#B9C6F5", LOGO_BOTTOM: "#7386D0",
      AZURE: "#79C0FF", GCP: ["#7386D0", "#B86CB3", "#FF72B0", "#DBB060"],
    }),
    // The first cut of the reel, kept for the exported videos
    classic: palette({
      BG: "#1b1d2b", SURFACE_1: "#1e2030", SURFACE_2: "#2f334d",
      TEXT: "#e4ebff", MUTED: "#c8d3f5",
      RAW: ["#636da6", "#7a88cf", "#828bb8", "#c8d3f5", "#86e1fc", "#fca7ea"],
      BRONZE: "#d08a4e", SILVER: "#c8d3f5", GOLD: "#ffc777",
      BLUE: "#82aaff", GREEN: "#c3e88d", ACCENT: "#c099ff",
      LOGO_TOP: "#c099ff", LOGO_BOTTOM: "#82aaff",
      AZURE: "#3fa9ff", GCP: ["#4285f4", "#ea4335", "#fbbc05", "#34a853"],
    }),
  };

  const NODE_W = [0.25, 0.5, 0.75];
  const NODE_Y = 0.55;
  const NODE_POP = [7.35, 7.47, 7.59];
  const NODE_CHECK = [7.9, 8.4, 8.9];
  const BAR_HEIGHTS = [18, 26, 34, 30, 40, 36, 44, 28];
  const SWEEP = 0.7;
  const END = 13.4;
  const SPLIT = 13.0;

  const MONO = 'ui-monospace, "JetBrains Mono", Consolas, monospace';
  const SANS = "Mulish, system-ui, sans-serif";

  function initHeroReel() {
    const stage = document.querySelector(".hero-reel-stage");
    if (!stage || stage.querySelector("canvas") || typeof LOGO_PATHS === "undefined") return;

    const pt = document.documentElement.lang.toLowerCase().startsWith("pt");
    const L = pt
      ? { ingest: "INGESTÃO", silver: "PRATA", gold: "OURO", role: "ENGENHEIRO DE DADOS E IA", replay: "Rever o reel", play: "Assistir ao reel" }
      : { ingest: "INGEST", silver: "SILVER", gold: "GOLD", role: "DATA & AI ENGINEER", replay: "Replay the reel", play: "Play the reel" };

    const canvas = document.createElement("canvas");
    canvas.className = "hero-reel";
    canvas.setAttribute("aria-hidden", "true");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hero-reel__replay";
    stage.append(canvas, button);
    const ctx = canvas.getContext("2d");

    let W = 0;
    let H = 0;
    let OX = 0;
    let bg = null;
    let P = PALETTES.moonlight;
    const wx = (f) => (f * W - OX) / H;
    const X = (x) => OX + x * H;
    // The page heading already carries the name; exported videos opt into the full card
    const fullEndCard = () => stage.dataset.endcard === "full";

    const rand = mulberry32(7);
    const R = Array.from({ length: N }, () => [rand(), rand(), rand(), rand(), rand()]);

    const gold = [];
    BAR_HEIGHTS.forEach((h, c) => {
      for (let k = 0; k < h; k++) {
        gold.push({ c, x: 0.18 + c * 0.084 + (k % 2) * 0.027, y: 0.8 - Math.floor(k / 2) * 0.027 });
      }
    });

    // Piece 0 is the top of the mark (the A), piece 1 the bottom (the V)
    const pieces = LOGO_PATHS.map((d) => new Path2D(d));
    const boxes = LOGO_PATHS.map((d) => {
      const pts = parsePoly(d);
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    });
    const logoPts = sampleOutline(LOGO_PATHS, N);

    const chaos = (i, t) => {
      const r = R[i];
      const aspect = Math.max(1, (W / H) * 0.8);
      const k = easeOutExpo(clamp((t - r[3]) / 1.2));
      const rad = 0.34 * Math.sqrt(r[0]);
      const ang = r[1] * TAU;
      const tx = 0.5 + Math.cos(ang) * rad * aspect + 0.02 * Math.sin(t * 1.3 + r[2] * TAU);
      const ty = 0.52 + Math.sin(ang) * rad + 0.02 * Math.cos(t * 1.1 + r[2] * TAU);
      const far = 0.4 + (W / H) * 0.6;
      const sx = 0.5 + Math.cos(r[4] * TAU) * far;
      const sy = 0.5 + Math.sin(r[4] * TAU) * far;
      return [lerp(sx, tx, k), lerp(sy, ty, k), ...P.RAW[i % P.RAW.length], 0.9, 0.0075, 1];
    };

    const grid = (i) => [0.2 + (i % 16) * 0.04, 0.26 + Math.floor(i / 16) * 0.04];

    const bronze = (i, t) => {
      const [x, y] = grid(i);
      const j = R[i][2] * TAU;
      return [x + 0.01 * Math.sin(t * 2 + j), y + 0.01 * Math.cos(t * 1.7 + j), ...P.BRONZE, 0.95, 0.008, 1];
    };

    const silver = (i) => [...grid(i), ...P.SILVER, 1, 0.011, 0.3];

    const goldCell = (i) => [gold[i].x, gold[i].y, ...P.GOLD, 1, 0.0125, 0.15];

    const ci = (i, t) => {
      const u = (i / N + (t - 7.2) * 0.11) % 1;
      const x = wx(0.04 + u * 0.92);
      let passed = 0;
      NODE_W.forEach((nw, k) => {
        if (t >= NODE_CHECK[k] && x > wx(nw)) passed++;
      });
      const col = P.BLUE.map((c, n) => lerp(c, P.GREEN[n], passed / 3));
      return [x, NODE_Y + 0.012 * Math.sin(u * TAU * 3 - t * 4), ...col, 1, 0.006, 1];
    };

    const cloudRing = (even, t) => {
      const imp = easeInOutCubic(clamp((t - 10.9) / 0.5));
      return { cx: lerp(wx(even ? 0.36 : 0.64), 0.5, imp), rad: 0.19 * (1 - imp) };
    };

    const cloud = (i, t) => {
      const even = i % 2 === 0;
      const idx = i >> 1;
      const { cx, rad } = cloudRing(even, t);
      const ang = (idx / (N / 2)) * TAU + t * (even ? 0.9 : -0.9);
      const wob = rad + 0.01 * Math.sin(ang * 6 + t * 3) * (rad / 0.19);
      const col = even ? P.AZURE : P.GCP[Math.floor((idx / (N / 2)) * 4)];
      return [cx + Math.cos(ang) * wob, 0.5 + Math.sin(ang) * wob, ...col, 1, 0.0065, 1];
    };

    const logo = (i, t) => {
      const [px, py] = logoPts[i];
      const col = P.LOGO_TOP.map((c, n) => lerp(c, P.LOGO_BOTTOM[n], py));
      return [0.5 + (px - 0.5) * 0.66, 0.5 + (py - 0.5) * 0.66, ...col, 1 - clamp((t - 12.3) / 0.5), 0.0055, 1];
    };

    // A particle converts when the full-width scan line reaches it
    const sweep = { dur: 0.45, stagger: (i, p) => (X(p[0]) / W) * SWEEP, ease: easeOutExpo };
    const SCENES = [
      { t0: 0, f: chaos, title: L.ingest },
      { t0: 2.4, f: bronze, title: "BRONZE", scan: "BRONZE", ...sweep },
      { t0: 4.0, f: silver, title: L.silver, scan: "SILVER", ...sweep },
      { t0: 5.6, f: goldCell, title: L.gold, scan: "GOLD", ...sweep },
      { t0: 7.2, f: ci, title: "CI/CD", dur: 0.7, stagger: (i) => (gold[i].c / 8) * 0.45, ease: easeInOutCubic },
      { t0: 9.4, f: cloud, title: "AZURE + GCP", dur: 0.8, stagger: (i) => R[i][0] * 0.3, ease: easeInOutCubic },
      { t0: 11.4, f: logo, dur: 0.9, stagger: (i) => R[i][1] * 0.35, ease: easeOutBack },
    ];
    const IMPACTS = SCENES.slice(1).map((s) => s.t0).concat(12.3);

    function particle(i, t) {
      let s = 0;
      while (s + 1 < SCENES.length && t >= SCENES[s + 1].t0) s++;
      const sc = SCENES[s];
      const cur = sc.f(i, t);
      if (s === 0) return cur;
      const prev = SCENES[s - 1].f(i, t);
      const e = sc.ease(clamp((t - sc.t0 - sc.stagger(i, prev)) / sc.dur));
      return cur.map((v, n) => lerp(prev[n], v, e));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      const next = PALETTES[stage.dataset.palette] || PALETTES.moonlight;
      if ((w === W && h === H && next === P) || !w || !h) return;
      P = next;
      canvas.width = W = w;
      canvas.height = H = h;
      OX = (W - H) / 2;
      bg = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.6);
      bg.addColorStop(0, P.SURFACE_2);
      bg.addColorStop(1, P.BG);
    }

    function drawBackground(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      const step = H / 12;
      const off = (t * H * 0.01) % step;
      ctx.strokeStyle = rgba(P.MUTED, 0.06);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let p = off; p < W; p += step) {
        ctx.moveTo(p, 0);
        ctx.lineTo(p, H);
      }
      for (let p = off; p < H; p += step) {
        ctx.moveTo(0, p);
        ctx.lineTo(W, p);
      }
      ctx.stroke();
    }

    function camera(t) {
      let punch = 0;
      IMPACTS.forEach((ti) => {
        if (t > ti) punch += 0.03 * Math.exp(-(t - ti) * 6);
      });
      ctx.setTransform(1 + punch, 0, 0, 1 + punch, (-W * punch) / 2, (-H * punch) / 2);
    }

    function drawScans(t) {
      SCENES.forEach((sc) => {
        if (!sc.scan) return;
        const p = (t - sc.t0) / SWEEP;
        if (p < 0 || p > 1.15) return;
        const x = p * W;
        const tail = H * 0.25;
        const g = ctx.createLinearGradient(x - tail, 0, x, 0);
        g.addColorStop(0, rgba(P[sc.scan], 0));
        g.addColorStop(1, rgba(P[sc.scan], 0.28));
        ctx.fillStyle = g;
        ctx.fillRect(x - tail, 0, tail, H);
        ctx.fillStyle = rgba(P[sc.scan], 0.9);
        ctx.fillRect(x - H * 0.002, 0, H * 0.004, H);
      });
    }

    function drawTrack(t) {
      if (t < 7.2 || t > 9.9) return;
      ctx.strokeStyle = rgba(P.BLUE, 0.18 * clamp((t - 7.2) / 0.4) * (1 - clamp((t - 9.4) / 0.5)));
      ctx.lineWidth = H * 0.004;
      ctx.beginPath();
      ctx.moveTo(W * 0.04, H * NODE_Y);
      ctx.lineTo(W * 0.96, H * NODE_Y);
      ctx.stroke();
    }

    // Drawn after the particles, so the stream passes behind the gates
    function drawNodes(t) {
      if (t < 7.2 || t > 9.9) return;
      ctx.globalAlpha = 1 - clamp((t - 9.4) / 0.5);
      ["dev", "staging", "prod"].forEach((name, k) => {
        const pop = easeOutBack(clamp((t - NODE_POP[k]) / 0.35));
        if (pop <= 0) return;
        const x = W * NODE_W[k];
        const y = H * NODE_Y;
        const checked = clamp((t - NODE_CHECK[k]) / 0.25);
        if (checked > 0 && t - NODE_CHECK[k] < 0.5) {
          const q = (t - NODE_CHECK[k]) / 0.5;
          ctx.strokeStyle = rgba(P.GREEN, 0.7 * (1 - q));
          ctx.lineWidth = H * 0.005;
          ctx.beginPath();
          ctx.arc(x, y, H * (0.035 + q * 0.07), 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = P.SURFACE_1;
        ctx.strokeStyle = rgba(checked > 0 ? P.GREEN : P.BLUE, 1);
        ctx.lineWidth = H * 0.006;
        ctx.beginPath();
        ctx.arc(x, y, H * 0.034 * pop, 0, TAU);
        ctx.fill();
        ctx.stroke();
        if (checked > 0) {
          const pts = [[-0.013, 0], [-0.004, 0.01], [0.014, -0.011]];
          const reach = checked * 2;
          ctx.strokeStyle = rgba(P.GREEN, 1);
          ctx.lineWidth = H * 0.007;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x + pts[0][0] * H, y + pts[0][1] * H);
          for (let s = 0; s < 2 && s < reach; s++) {
            const k2 = Math.min(1, reach - s);
            ctx.lineTo(x + lerp(pts[s][0], pts[s + 1][0], k2) * H, y + lerp(pts[s][1], pts[s + 1][1], k2) * H);
          }
          ctx.stroke();
        }
        ctx.fillStyle = rgba(P.MUTED, 0.8 * clamp(pop));
        ctx.font = `600 ${H * 0.032}px ${MONO}`;
        ctx.textAlign = "center";
        ctx.fillText(name, x, y + H * 0.085);
        ctx.textAlign = "left";
      });
      ctx.globalAlpha = 1;
    }

    function drawClouds(t) {
      if (t < 9.4 || t > 11.4) return;
      const a = clamp((t - 9.5) / 0.4) * (1 - clamp((t - 10.9) / 0.4));
      ctx.setLineDash([H * 0.01, H * 0.014]);
      ctx.lineDashOffset = -t * H * 0.05;
      ctx.font = `600 ${H * 0.034}px ${MONO}`;
      ctx.textAlign = "center";
      [[true, "Azure", P.AZURE], [false, "GCP", P.GCP[0]]].forEach(([even, name, col]) => {
        const { cx, rad } = cloudRing(even, t);
        ctx.strokeStyle = rgba(col, 0.35 * a);
        ctx.lineWidth = H * 0.003;
        ctx.beginPath();
        ctx.arc(X(cx), H * 0.5, (rad + 0.035) * H, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = rgba(P.MUTED, 0.85 * a);
        ctx.fillText(name, X(cx), H * 0.8);
      });
      ctx.textAlign = "left";
      ctx.setLineDash([]);
    }

    function drawParticles(t) {
      if (t > 12.9) return;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = 0; i < N; i++) {
        const p = particle(i, t);
        const a = p[5];
        if (a <= 0.01) continue;
        const x = X(p[0]);
        const y = p[1] * H;
        const h = p[6] * H;
        const q = particle(i, Math.max(0, t - 0.035));
        const dx = x - X(q[0]);
        const dy = y - q[1] * H;
        const col = p.slice(2, 5);
        if (dx * dx + dy * dy > h * h) {
          ctx.strokeStyle = rgba(col, a * 0.35);
          ctx.lineWidth = h * 1.2;
          ctx.beginPath();
          ctx.moveTo(X(q[0]), q[1] * H);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.fillStyle = rgba(col, a);
        ctx.beginPath();
        ctx.roundRect(x - h, y - h, h * 2, h * 2, h * p[7]);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function drawLogo(t) {
      if (t > 11.4 && t < 12) {
        const q = (t - 11.4) / 0.6;
        ctx.strokeStyle = rgba(P.ACCENT, 0.6 * (1 - q));
        ctx.lineWidth = H * 0.012 * (1 - q);
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, q * W * 0.5, 0, TAU);
        ctx.stroke();
      }
      const fill = clamp((t - 12.2) / 0.4);
      if (fill <= 0) return;
      const lock = lockup();
      const e = easeInOutCubic(clamp((t - SPLIT) / 0.9));
      const m = (H * 0.66) / 48;
      const g = ctx.createLinearGradient(0, 1.4, 0, 46.6);
      g.addColorStop(0, rgba(P.LOGO_TOP, 1));
      g.addColorStop(1, rgba(P.LOGO_BOTTOM, 1));
      ctx.globalAlpha = fill;
      ctx.shadowColor = rgba(P.ACCENT, 0.7);
      ctx.shadowBlur = H * (0.05 + 0.02 * Math.sin(t * 3)) * (1 - 0.6 * e);
      ctx.fillStyle = g;
      // A faded copy of the whole mark stays centered behind the split pieces
      if (e > 0) {
        ctx.save();
        ctx.globalAlpha = fill * 0.14 * e;
        ctx.shadowBlur = 0;
        ctx.translate(W / 2, H / 2);
        ctx.scale(m, m);
        ctx.translate(-24, -24);
        pieces.forEach((p) => ctx.fill(p));
        ctx.restore();
      }
      // The V slides left and drops, the A slides right and rises, so the mark visibly splits
      [[1, lock.v, 1], [0, lock.a, -1]].forEach(([k, left, dir]) => {
        const b = boxes[k];
        ctx.save();
        ctx.translate(
          lerp(W / 2 + (b.x0 - 24) * m, left, e),
          lerp(H / 2 + (b.y1 - 24) * m, lock.base, e) + dir * H * 0.07 * Math.sin(Math.PI * e),
        );
        const sc = lerp(m, lock.scale, e);
        ctx.scale(sc, sc);
        ctx.translate(-b.x0, -b.y1);
        ctx.fill(pieces[k]);
        ctx.restore();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // [V]inicius [A]morim: the two pieces of the mark stand in for the initials
    function lockup() {
      let fs = H * 0.13;
      ctx.font = `800 ${fs}px ${SANS}`;
      const w1 = ctx.measureText("inicius").width / fs;
      const w2 = ctx.measureText("morim").width / fs;
      const vb = boxes[1];
      const ab = boxes[0];
      const s = 0.72 / (vb.y1 - vb.y0);
      const vw = (vb.x1 - vb.x0) * s;
      const aw = (ab.x1 - ab.x0) * s;
      const gap = 0.06;
      const word = 0.4;
      const total = vw + gap + w1 + word + aw + gap + w2;
      fs = Math.min(fs, (W * 0.84) / total);
      const x0 = (W - total * fs) / 2;
      return {
        fs,
        base: H * (fullEndCard() ? 0.58 : 0.62),
        scale: s * fs,
        v: x0,
        first: x0 + (vw + gap) * fs,
        a: x0 + (vw + gap + w1 + word) * fs,
        last: x0 + (vw + gap + w1 + word + aw + gap) * fs,
      };
    }

    function drawEndCard(t) {
      if (t < SPLIT + 0.5) return;
      const lock = lockup();
      ctx.font = `800 ${lock.fs}px ${SANS}`;
      [["inicius", lock.first, 0.55], ["morim", lock.last, 0.7]].forEach(([word, x0, delay]) => {
        let cx = x0;
        [...word].forEach((ch, j) => {
          const k = easeOutExpo(clamp((t - SPLIT - delay - j * 0.03) / 0.5));
          ctx.fillStyle = rgba(P.TEXT, k);
          ctx.fillText(ch, cx, lock.base + (1 - k) * lock.fs * 0.4);
          cx += ctx.measureText(ch).width;
        });
      });
      if (!fullEndCard()) return;
      const r = clamp((t - SPLIT - 1.2) / 0.5);
      ctx.textAlign = "center";
      ctx.font = `600 ${H * 0.034}px ${MONO}`;
      ctx.fillStyle = rgba(P.MUTED, 0.8 * r);
      ctx.fillText(L.role, W / 2, lock.base + H * 0.14);
      const lw = W * 0.18 * easeOutExpo(r);
      ctx.fillStyle = rgba(P.ACCENT, 0.9);
      ctx.fillRect(W / 2 - lw / 2, lock.base + H * 0.18, lw, Math.max(1, H * 0.004));
      ctx.textAlign = "left";
    }

    function drawTitles(t) {
      SCENES.forEach((sc, idx) => {
        if (!sc.title) return;
        const t0 = sc.t0 + 0.1;
        // The outgoing title clears before the next one enters at next t0 + 0.1
        const t1 = SCENES[idx + 1].t0 - 0.55;
        if (t < t0 || t > t1 + 0.6) return;
        const fs = H * 0.1;
        const x = Math.max(H * 0.08, W * 0.05);
        const y = H * 0.2;
        ctx.font = `${H * 0.03}px ${MONO}`;
        ctx.fillStyle = rgba(P[sc.scan] || P.MUTED, 0.75 * clamp((t - t0) / 0.3) * (1 - clamp((t - t1) / 0.3)));
        ctx.fillText(`0${idx + 1} / 06`, x, y - fs * 0.95);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y - fs * 0.9, W, fs * 1.2);
        ctx.clip();
        ctx.font = `800 ${fs}px ${SANS}`;
        ctx.fillStyle = rgba(P.TEXT, 1);
        let cx = x;
        [...sc.title].forEach((ch, j) => {
          const inK = easeOutExpo(clamp((t - t0 - j * 0.03) / 0.5));
          const outK = easeInOutCubic(clamp((t - t1 - j * 0.015) / 0.3));
          ctx.fillText(ch, cx, y + (1 - inK) * fs * 1.1 - outK * fs * 1.1);
          cx += ctx.measureText(ch).width + fs * 0.02;
        });
        ctx.restore();
      });
    }

    function drawProgress(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const a = 0.7 * (1 - clamp((t - END) / 0.6));
      if (a <= 0) return;
      ctx.fillStyle = rgba(P.ACCENT, a);
      ctx.fillRect(0, H - H * 0.008, (W * t) / DURATION, H * 0.008);
    }

    function drawFlash(t) {
      if (t < 12.3) return;
      const a = 0.35 * Math.exp(-(t - 12.3) * 8);
      if (a < 0.01) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = rgba(P.TEXT, a);
      ctx.fillRect(0, 0, W, H);
    }

    function draw(t) {
      resize();
      drawBackground(t);
      camera(t);
      drawScans(t);
      drawTrack(t);
      drawClouds(t);
      drawParticles(t);
      drawNodes(t);
      drawLogo(t);
      drawEndCard(t);
      drawTitles(t);
      drawProgress(t);
      drawFlash(t);
    }

    let t = 0;
    let last = null;
    let raf = 0;

    function frame(now) {
      if (last !== null) t += Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(Math.min(t, DURATION));
      if (t >= DURATION) return finish();
      raf = requestAnimationFrame(frame);
    }

    function setButton(kind) {
      const path = kind === "play" ? "M8 5v14l11-7z" : "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z";
      button.setAttribute("aria-label", L[kind]);
      button.title = L[kind];
      button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
    }

    function play() {
      cancelAnimationFrame(raf);
      t = 0;
      last = null;
      stage.classList.add("is-playing");
      raf = requestAnimationFrame(frame);
    }

    function finish() {
      stage.classList.remove("is-playing");
      setButton("replay");
    }

    button.addEventListener("click", play);
    // Redraw the held end card when the stage width changes
    new ResizeObserver(() => {
      if (!stage.classList.contains("is-playing")) draw(DURATION);
    }).observe(canvas);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setButton("play");
      draw(DURATION);
    } else {
      setButton("replay");
      play();
    }
  }

  // Evenly spaced points along the closed polygons of the mark, in 0..1 units
  function parsePoly(d) {
    return d.replace(/[MZ]/g, "").trim().split(/\s+/).map((p) => p.split(",").map(Number));
  }

  function sampleOutline(paths, count) {
    const polys = paths.map(parsePoly);
    const segs = [];
    polys.forEach((poly) => {
      poly.forEach((a, k) => {
        const b = poly[(k + 1) % poly.length];
        segs.push([a, b, Math.hypot(b[0] - a[0], b[1] - a[1])]);
      });
    });
    const total = segs.reduce((s, g) => s + g[2], 0);
    const pts = [];
    let seg = 0;
    let acc = 0;
    for (let i = 0; i < count; i++) {
      const d = (i / count) * total;
      while (acc + segs[seg][2] < d) acc += segs[seg++][2];
      const [a, b, len] = segs[seg];
      const k = len ? (d - acc) / len : 0;
      pts.push([lerp(a[0], b[0], k) / 48, lerp(a[1], b[1], k) / 48]);
    }
    return pts;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroReel);
  } else {
    initHeroReel();
  }
})();

/* ===================================================================
   Sky - a still starfield in place of the dot grid (dark mode).
   The cursor leaves a comet trail that lights the stars it passes and
   reveals the VA mark as hidden constellations, which fade slowly.
   The stars are drawn once; frames run only while a trail or a mark
   is fading. Reduced motion and touch screens get the sky with no trail.
   =================================================================== */

(function () {
  const canvas = document.createElement("canvas");
  canvas.className = "sky";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const base = document.createElement("canvas");
  const baseCtx = base.getContext("2d");

  const pointer = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)").matches;
  const dark = () => document.body.getAttribute("data-md-color-scheme") === "slate";

  const COLOURS = ["238,238,250", "185,198,245", "185,198,245", "162,176,234", "207,149,202"];
  const LIT = "238,238,250";
  const TRAIL_MS = 900;
  const REACH = 55;
  // Each mark: centre as a share of the viewport, size as a share of its height
  const MARKS = [[0.8, 0.3, 0.32], [0.93, 0.82, 0.18], [0.1, 0.8, 0.2]];

  let W = 0, H = 0, dpr = 1;
  let stars = [], marks = [], cells = new Map(), trail = [];
  let running = false, prev = 0;

  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Evenly spaced points along the mark's outlines (LOGO_PATHS from background-logo.js), in 0..1 units
  function outline(count) {
    const segs = [];
    LOGO_PATHS.forEach((d) => {
      const poly = d.replace(/[MZ]/g, "").trim().split(/\s+/).map((p) => p.split(",").map(Number));
      poly.forEach((a, k) => {
        const b = poly[(k + 1) % poly.length];
        segs.push([a, b, Math.hypot(b[0] - a[0], b[1] - a[1])]);
      });
    });
    const total = segs.reduce((s, g) => s + g[2], 0);
    const pts = [];
    let seg = 0, acc = 0;
    for (let i = 0; i < count; i++) {
      const d = (i / count) * total;
      while (acc + segs[seg][2] < d) acc += segs[seg++][2];
      const [a, b, len] = segs[seg];
      const k = len ? (d - acc) / len : 0;
      pts.push([(a[0] + (b[0] - a[0]) * k) / 48, (a[1] + (b[1] - a[1]) * k) / 48]);
    }
    return pts;
  }

  const cellKey = (x, y) => `${Math.floor(x / REACH)},${Math.floor(y / REACH)}`;

  // Places outline points as a mark of size s centred at (cx, cy), turned by angle; lines only join close neighbours
  function makeMark(pts, cx, cy, s, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const mark = pts.map(([u, v]) => {
      const dx = (u - 0.5) * s, dy = (v - 0.5) * s;
      return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos, r: 1.2, a: 0.06, c: COLOURS[1], f: 0, h: 0 };
    });
    mark.gap = (s * 4.8) / pts.length;
    return mark;
  }

  function star(c2d, s, f) {
    const a = Math.min(1, s.a + f * 0.75);
    const r = s.r * (1 + f * 0.7);
    const c = f > 0.3 ? LIT : s.c;
    if (r > 1.3) {
      c2d.fillStyle = `rgba(${c},${a * 0.12})`;
      c2d.beginPath();
      c2d.arc(s.x, s.y, r * 3.2, 0, 7);
      c2d.fill();
    }
    c2d.fillStyle = `rgba(${c},${a})`;
    c2d.beginPath();
    c2d.arc(s.x, s.y, r, 0, 7);
    c2d.fill();
  }

  function build() {
    const rand = mulberry32(7);
    stars = [];
    const count = Math.round((W * H) / 3300);
    for (let i = 0; i < count; i++) {
      const b = rand();
      stars.push({
        x: rand() * W, y: rand() * H,
        r: b > 0.985 ? 1.7 : b > 0.92 ? 1.1 : 0.6,
        a: b > 0.985 ? 0.8 : b > 0.92 ? 0.45 : 0.2 + rand() * 0.15,
        c: COLOURS[Math.floor(rand() * COLOURS.length)],
        f: 0,
      });
    }
    const large = outline(40);
    marks = MARKS.map(([cx, cy, share]) => makeMark(large, cx * W, cy * H, share * H, 0));
    // The small marks take the place of the old scattered logos: turned at random, never on top of another mark
    const small = outline(20);
    const placed = MARKS.map(([cx, cy, share]) => [cx * W, cy * H, (share * H) / 2]);
    const target = W < 480 ? 8 : W < 960 ? 14 : 20;
    for (let tries = 0; marks.length < MARKS.length + target && tries < 400; tries++) {
      const s = 40 + rand() * 70, x = rand() * W, y = rand() * H;
      if (placed.some(([px, py, pr]) => Math.hypot(px - x, py - y) < pr + s)) continue;
      placed.push([x, y, s / 2]);
      marks.push(makeMark(small, x, y, s, rand() * Math.PI * 2));
    }
    cells = new Map();
    [...stars, ...marks.flat()].forEach((s) => {
      const key = cellKey(s.x, s.y);
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(s);
    });
    base.width = W * dpr;
    base.height = H * dpr;
    baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    [...stars, ...marks.flat()].forEach((s) => star(baseCtx, s, 0));
  }

  // Light only the stars near the trail, found through the cell index instead of a scan of every star
  function lightTrail(now) {
    const lit = new Set();
    trail = trail.filter((p) => now - p.t < TRAIL_MS);
    for (const p of trail) {
      const age = 1 - (now - p.t) / TRAIL_MS;
      const cx = Math.floor(p.x / REACH), cy = Math.floor(p.y / REACH);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (const s of cells.get(`${cx + dx},${cy + dy}`) || []) {
            const v = Math.max(0, 1 - Math.hypot(s.x - p.x, s.y - p.y) / REACH) * age;
            if (v > s.f) { s.f = v; lit.add(s); }
          }
        }
      }
    }
    return lit;
  }

  // Returns whether anything is still fading, so the caller knows to ask for another frame
  function draw(now, dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!dark()) return false;
    ctx.drawImage(base, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lit = lightTrail(now);
    for (const s of lit) if (s.h === undefined) star(ctx, s, s.f);
    // A mark keeps its light after the trail moves on, and fades at the same pace on any refresh rate
    const fade = Math.pow(0.985, dt / 16.7);
    let glowing = false;
    ctx.lineWidth = 0.8;
    for (const mark of marks) {
      for (const s of mark) {
        s.h = Math.max(s.h * fade, s.f);
        if (s.h < 0.02) s.h = 0;
        else { glowing = true; star(ctx, s, s.h); }
      }
      for (let i = 0; i < mark.length; i++) {
        const a = mark[i], b = mark[(i + 1) % mark.length];
        const f = Math.max(a.h, b.h);
        if (f < 0.02 || Math.hypot(a.x - b.x, a.y - b.y) > mark.gap) continue;
        ctx.strokeStyle = `rgba(162,176,234,${f * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    for (const s of lit) s.f = 0;
    return trail.length > 0 || glowing;
  }

  function frame(now) {
    const busy = draw(now, now - prev);
    prev = now;
    running = busy;
    if (busy) requestAnimationFrame(frame);
  }

  function wake() {
    if (running) return;
    running = true;
    prev = performance.now();
    requestAnimationFrame(frame);
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    build();
    draw(performance.now(), 0);
  }

  size();
  window.addEventListener("resize", size);
  new MutationObserver(() => draw(performance.now(), 0)).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

  if (pointer) {
    const move = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
    window.addEventListener(move, (e) => {
      const last = trail[trail.length - 1];
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 6) return;
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      wake();
    });
  }
})();

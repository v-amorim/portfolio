/* ===================================================================
   Background Logo - Constellation Field
   Scattered logo instances with organic placement, size/opacity
   variation, and soft edge fading via CSS mask.

   Strategy:
   - JS generates N logo SVGs at pseudo-random positions (seeded)
   - Each instance gets unique size, opacity, rotation, animation delay
   - CSS handles the float animation and radial mask fade
   - Container is position:fixed, covers viewport, behind content
   - Respects prefers-reduced-motion
   =================================================================== */

// VA monogram path data extracted from templates/.icons/logo.svg
// Three overlapping shapes: V (mirrored), diagonal stroke, A
const LOGO_GROUPS = [
  { matrix: "-1 0 0 -1 359.2 465.17", translate: "-690.79, -582.73", d: "M 737.5 405 C 746.295 403.681 752.486 407.187 757 414.5 C 757 414.5 926 739.5 926 739.5 C 927.79 747.598 921.673 757.424 913.5 759 C 901.081 761.395 797.571 761.244 784.5 759 C 776.871 757.69 771.194 751.308 768 744.5 C 768 744.5 718.5 629 718.5 629 C 718.5 629 619 746.5 619 746.5 C 615.755 749.813 609.765 756.69 605.5 758 C 597.629 760.417 481.501 760.857 470.5 759 C 457.253 756.764 450.601 741.429 459 730.5 C 546.708 631.771 625.534 524.476 714 426.5 C 719.452 420.462 729.978 406.128 737.5 405 Z" },
  { matrix: "1 0 0 1 537.3 540", translate: "-506.29, -510.8", d: "M 645.5 247 C 657.611 244.791 667.697 248.882 675 258.5 C 680.306 265.489 717.595 336.585 720 344.5 C 722.28 352.004 722.056 359.169 719 366.5 C 719 366.5 384 764.5 384 764.5 C 370.125 780.06 352.016 778.227 340 761.5 C 332.629 751.24 296.75 682.93 293 671.5 C 290.231 663.059 290.299 655.528 294 647.5 C 294 647.5 635.5 252 635.5 252 C 638.476 250.813 642.42 247.562 645.5 247 Z" },
  { matrix: "1 0 0 1 721.8 611.94", translate: "-690.79, -582.73", d: "M 737.5 405 C 746.295 403.681 752.486 407.187 757 414.5 C 757 414.5 926 739.5 926 739.5 C 927.79 747.598 921.673 757.424 913.5 759 C 901.081 761.395 797.571 761.244 784.5 759 C 776.871 757.69 771.194 751.308 768 744.5 C 768 744.5 718.5 629 718.5 629 C 718.5 629 619 746.5 619 746.5 C 615.755 749.813 609.765 756.69 605.5 758 C 597.629 760.417 481.501 760.857 470.5 759 C 457.253 756.764 450.601 741.429 459 730.5 C 546.708 631.771 625.534 524.476 714 426.5 C 719.452 420.462 729.978 406.128 737.5 405 Z" },
];
const LOGO_VIEWBOX = "0 0 1080 1080";

// Seeded PRNG (mulberry32) so the field is deterministic per-session
// but different across page loads.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createLogoField() {
  // Don't duplicate on re-navigation (MkDocs instant nav)
  const existing = document.getElementById("logo-constellation");
  if (existing) return;

  const container = document.createElement("div");
  container.id = "logo-constellation";
  container.setAttribute("aria-hidden", "true");

  // Insert as first child of body so it's behind everything
  document.body.prepend(container);

  const rng = mulberry32(Date.now() & 0xffff);

  // Responsive count: fewer on mobile
  const vw = window.innerWidth;
  let count;
  if (vw < 480) count = 12;
  else if (vw < 960) count = 20;
  else count = 30;

  // Poisson-disc-like rejection sampling for minimum spacing
  const placed = [];
  const MIN_DIST = 8; // % units - minimum distance between logos
  const MAX_ATTEMPTS = 150;

  function tooClose(x, y) {
    for (const p of placed) {
      const dx = x - p.x;
      const dy = y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return true;
    }
    return false;
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    // Find a non-overlapping position
    let x, y;
    let attempts = 0;
    do {
      // Extend beyond viewport edges (-10% to 110%) so logos
      // don't cluster away from edges
      x = rng() * 120 - 10;
      y = rng() * 120 - 10;
      attempts++;
    } while (tooClose(x, y) && attempts < MAX_ATTEMPTS);

    placed.push({ x, y });

    const size = 40 + rng() * 100; // 40px - 140px
    const opacity = 0.015 + rng() * 0.04; // 0.015 - 0.055
    const rotation = -30 + rng() * 60; // -30deg to +30deg
    const animDelay = rng() * -20; // stagger float start
    const animDuration = 15 + rng() * 15; // 15s - 30s

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", LOGO_VIEWBOX);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size); // 1:1 viewBox
    svg.classList.add("constellation-logo");

    svg.style.cssText = [
      `left:${x}%`,
      `top:${y}%`,
      `opacity:${opacity}`,
      `transform:rotate(${rotation}deg)`,
      `animation-delay:${animDelay}s`,
      `animation-duration:${animDuration}s`,
      `--base-rotation:${rotation}deg`,
    ].join(";");

    // Build the 3 transformed groups that form the VA monogram
    for (const group of LOGO_GROUPS) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `matrix(${group.matrix})`);

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", group.d);
      path.setAttribute("fill", "currentColor");
      path.setAttribute(
        "transform",
        `translate(${group.translate})`
      );

      g.appendChild(path);
      svg.appendChild(g);
    }

    fragment.appendChild(svg);
  }

  container.appendChild(fragment);
}

function destroyLogoField() {
  const el = document.getElementById("logo-constellation");
  if (el) el.remove();
}

function initLogoField() {
  // Recreate on navigation to get fresh placement
  destroyLogoField();
  createLogoField();
}

// Initial load
document.addEventListener("DOMContentLoaded", initLogoField);

// Handle instant navigation (MkDocs Material)
if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    initLogoField();
  });
}

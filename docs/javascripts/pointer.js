/* ===================================================================
   Pointer - the /deck glowing dot in place of the system cursor.
   Only for a fine pointer with motion allowed; touch screens and
   reduced motion keep the normal cursor.
   =================================================================== */

(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

  const pointer = document.createElement("div");
  pointer.className = "pointer";
  document.documentElement.classList.add("has-pointer");
  document.documentElement.appendChild(pointer);

  // pointerrawupdate is not frame-aligned like mousemove, so each frame draws the newest position
  const move = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
  addEventListener(move, (e) => {
    pointer.style.translate = `${e.clientX}px ${e.clientY}px`;
    pointer.classList.add("on");
  });
  document.documentElement.addEventListener("mouseleave", () => pointer.classList.remove("on"));
  addEventListener("mousedown", () => pointer.classList.add("down"));
  addEventListener("mouseup", () => pointer.classList.remove("down"));
})();

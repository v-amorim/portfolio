/* ===================================================================
   Contents toggle - folds a post's contents panel to its header and
   back. The choice is kept in localStorage, so it holds across posts.
   =================================================================== */

(function () {
  const KEY = "toc-folded";
  const LABELS = document.documentElement.lang.startsWith("pt")
    ? { hide: "Ocultar", show: "Mostrar" }
    : { hide: "Hide", show: "Show" };

  const folded = () => localStorage.getItem(KEY) === "1";

  function initToggle() {
    // Material also keeps a copy of the contents inside the hidden post list (for phones); only the panel's own copy gets the toggle
    const title = document.querySelector(".md-main__inner:has(.post-header) .md-sidebar--secondary .md-nav--secondary > .md-nav__title");
    if (!title || title.querySelector(".toc-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "toc-toggle";

    function render() {
      const isFolded = folded();
      document.documentElement.classList.toggle("toc-folded", isFolded);
      button.textContent = isFolded ? LABELS.show : LABELS.hide;
      button.setAttribute("aria-expanded", String(!isFolded));
    }

    // The title is Material's label for the phone drawer, so the click must not reach it
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      localStorage.setItem(KEY, folded() ? "0" : "1");
      render();
    });

    title.append(button);
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();

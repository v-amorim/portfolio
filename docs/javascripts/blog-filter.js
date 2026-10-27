/* ===================================================================
   Blog filter - round 4b pick B. The posts' own topic tags become the
   projects page's multi-select chips, in a column at the left of the
   list: "+ topic" adds, a picked topic's × takes it off, Clear all
   resets. A post shows when it has any picked topic.
   =================================================================== */

(function () {
  const LABELS = document.documentElement.lang.startsWith("pt")
    ? { clear: "Limpar tudo", picked: "Tópicos escolhidos", filter: "Filtrar posts por tópico" }
    : { clear: "Clear all", picked: "Picked topics", filter: "Filter posts by topic" };
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initFilter() {
    const list = document.querySelector(".md-typeset .post-list");
    if (!list || list.dataset.filterReady) return;
    list.dataset.filterReady = "1";

    const cards = [...list.querySelectorAll(".post-card")];
    const topicsOf = (card) => [...card.querySelectorAll(".tag")].map((tag) => tag.textContent.trim());
    const counts = new Map();
    cards.forEach((card) => topicsOf(card).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1)));

    const picked = document.createElement("div");
    picked.className = "projects-picked";
    picked.setAttribute("role", "group");
    picked.setAttribute("aria-label", LABELS.picked);
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "projects-clear";
    clear.textContent = LABELS.clear;
    picked.append(clear);

    const bar = document.createElement("div");
    bar.className = "projects-filter";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", LABELS.filter);
    const buttons = [...counts].map(([topic, count]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "projects-filter__btn";
      button.dataset.filter = topic;
      button.append(`${topic} `);
      const number = document.createElement("span");
      number.className = "projects-filter__count";
      number.textContent = count;
      button.append(number);
      return button;
    });

    const side = document.createElement("aside");
    side.className = "blog-filter";
    side.append(picked, bar);
    const layout = document.createElement("div");
    layout.className = "blog-layout";
    list.before(layout);
    layout.append(side, list);

    const chosen = new Set();

    function apply() {
      // Walking the chips in their first order keeps each group in that order as chips move between them
      buttons.forEach((button) => {
        const on = chosen.has(button.dataset.filter);
        button.setAttribute("aria-pressed", String(on));
        if (on) picked.insertBefore(button, clear);
        else bar.append(button);
      });
      picked.hidden = chosen.size === 0;
      cards.forEach((card) => {
        card.hidden = chosen.size > 0 && !topicsOf(card).some((topic) => chosen.has(topic));
      });
    }

    function update(change) {
      const run = () => { change(); apply(); };
      if (document.startViewTransition && !reducedMotion()) document.startViewTransition(run);
      else run();
    }

    buttons.forEach((button) => button.addEventListener("click", () => update(() => {
      const topic = button.dataset.filter;
      if (chosen.has(topic)) chosen.delete(topic);
      else chosen.add(topic);
    })));
    clear.addEventListener("click", () => update(() => chosen.clear()));
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFilter);
  else initFilter();
})();

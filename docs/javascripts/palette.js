// Palette cards: switch the displayed color format, click a card to copy it.

(() => {
  const FORMATS = ["hex", "rgb", "oklch"];

  const toRgb = (hex) => {
    const value = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const valueFor = (card, format) => {
    const hex = card.dataset.hex;
    if (format === "rgb") return toRgb(hex);
    if (format === "oklch") return card.dataset.oklch ?? hex;
    return hex;
  };

  const render = (format) => {
    document.querySelectorAll(".palette-card").forEach((card) => {
      const target = card.querySelector(".palette-card__value");
      if (target) target.textContent = valueFor(card, format);
    });

    document.querySelectorAll(".palette-format button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.format === format));
    });
  };

  const init = () => {
    const cards = document.querySelectorAll(".palette-card");
    if (cards.length === 0) return;

    let format = "hex";

    document.querySelectorAll(".palette-format").forEach((bar) => {
      FORMATS.forEach((name) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.format = name;
        button.textContent = name;
        button.setAttribute("aria-pressed", String(name === format));
        button.addEventListener("click", () => {
          format = name;
          render(format);
        });
        bar.append(button);
      });
    });

    cards.forEach((card) => {
      card.addEventListener("click", async () => {
        const text = valueFor(card, format);

        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return;
        }

        card.dataset.copied = "true";
        setTimeout(() => delete card.dataset.copied, 1200);
      });
    });

    render(format);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

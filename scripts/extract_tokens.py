#!/usr/bin/env python3
"""Emite docs/assets/moonlight-tokens.json a partir da pagina do blog.

A pagina e a fonte da verdade. Este script le os cards de paleta dela, recalcula
OKLCH e contraste a partir do hex e falha se o valor escrito na pagina divergir do
valor medido, ou se um par texto/superficie ficar abaixo do minimo declarado.
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "docs" / "blog" / "moonlight-palette.md"
OUT = ROOT / "docs" / "assets" / "moonlight-tokens.json"

CARD = re.compile(
    r'data-token="(?P<token>[^"]+)"\s+'
    r'data-hex="(?P<hex>#[0-9A-Fa-f]{6,8})"\s+'
    r'data-oklch="(?P<oklch>[^"]+)"'
    r'.*?palette-card__role">(?P<role>[^<]*)<'
    r'.*?palette-card__use">(?P<use>[^<]*)<',
    re.DOTALL,
)

# (primeiro plano, fundo, minimo WCAG). O minimo vem do papel: 4.5 para texto
# corrido, 3.0 para texto grande e elementos graficos.
PAIRS = [
    ("on-surface", "bg", 4.5),
    ("on-surface", "surface-3", 4.5),
    ("on-surface-muted", "bg", 4.5),
    ("on-surface-muted", "surface-1", 4.5),
    ("on-surface-dim", "bg", 4.5),
    ("on-surface-dim", "surface-1", 4.5),
    ("primary", "bg", 3.0),
    ("primary-60", "bg", 4.5),
    ("primary-70", "bg", 4.5),
    ("secondary", "bg", 4.5),
    ("on-primary", "primary", 4.5),
    ("success", "bg", 4.5),
    ("warning", "bg", 4.5),
    ("error", "bg", 4.5),
]

M1 = (
    (0.4122214708, 0.5363325363, 0.0514459929),
    (0.2119034982, 0.6806995451, 0.1073969566),
    (0.0883024619, 0.2817188376, 0.6299787005),
)
M2 = (
    (0.2104542553, 0.7936177850, -0.0040720468),
    (1.9779984951, -2.4285922050, 0.4505937099),
    (0.0259040371, 0.7827717662, -0.8086757660),
)


def channels(hex_value: str) -> list[float]:
    body = hex_value.lstrip("#")[:6]
    return [int(body[i : i + 2], 16) / 255 for i in (0, 2, 4)]


def to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_value: str) -> float:
    r, g, b = (to_linear(c) for c in channels(hex_value))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(fg: str, bg: str) -> float:
    a, b = luminance(fg), luminance(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


def oklch(hex_value: str) -> tuple[float, float, float]:
    r, g, b = (to_linear(c) for c in channels(hex_value))
    lms = [m[0] * r + m[1] * g + m[2] * b for m in M1]
    lms = [c ** (1 / 3) if c >= 0 else -((-c) ** (1 / 3)) for c in lms]
    lab = [m[0] * lms[0] + m[1] * lms[1] + m[2] * lms[2] for m in M2]
    chroma = math.hypot(lab[1], lab[2])
    hue = math.degrees(math.atan2(lab[2], lab[1])) % 360
    return lab[0], chroma, hue


def format_oklch(hex_value: str) -> str:
    L, C, H = oklch(hex_value)
    return f"oklch({L:.3f} {C:.3f} {H:.1f})"


def flatten(hex_value: str, over: str) -> str:
    """Compoe um hex de 8 digitos sobre um fundo, para medir contraste real."""
    body = hex_value.lstrip("#")
    if len(body) != 8:
        return hex_value
    alpha = int(body[6:8], 16) / 255
    top, bottom = channels("#" + body[:6]), channels(over)
    mixed = [t * alpha + b * (1 - alpha) for t, b in zip(top, bottom)]
    return "#" + "".join(f"{round(c * 255):02X}" for c in mixed)


def main() -> int:
    text = PAGE.read_text(encoding="utf-8")
    tokens: dict[str, dict[str, str]] = {}
    problems: list[str] = []

    for m in CARD.finditer(text):
        token, hex_value = m["token"], m["hex"].upper()
        if token in tokens:
            problems.append(f"token duplicado na pagina: {token}")
        measured = format_oklch(hex_value)
        declared = m["oklch"].strip()
        if len(hex_value.lstrip("#")) == 6 and declared != measured:
            problems.append(f"{token}: pagina diz {declared}, o hex da {measured}")
        tokens[token] = {
            "value": hex_value,
            "oklch": measured,
            "role": m["role"].strip(),
            "use": m["use"].strip(),
        }

    if not tokens:
        print("nenhum card com data-token encontrado em", PAGE, file=sys.stderr)
        return 1

    checks = []
    for fg, bg, minimum in PAIRS:
        if fg not in tokens or bg not in tokens:
            problems.append(f"par declarado sobre token inexistente: {fg} sobre {bg}")
            continue
        bg_hex = tokens[bg]["value"]
        ratio = contrast(flatten(tokens[fg]["value"], bg_hex), bg_hex)
        checks.append({"foreground": fg, "background": bg, "ratio": round(ratio, 2), "minimum": minimum})
        if ratio < minimum:
            problems.append(f"{fg} sobre {bg}: {ratio:.2f}:1, minimo {minimum}:1")

    if problems:
        print("Falhou:", file=sys.stderr)
        for p in problems:
            print("  -", p, file=sys.stderr)
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "$comment": f"Gerado por scripts/extract_tokens.py a partir de {PAGE.relative_to(ROOT).as_posix()}. Nao editar a mao.",
                "name": "Moonlight",
                "type": "dark",
                "colors": tokens,
                "contrast": checks,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(tokens)} tokens, {len(checks)} pares de contraste -> {OUT.relative_to(ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

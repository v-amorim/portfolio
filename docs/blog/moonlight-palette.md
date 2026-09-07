---
title: The Moonlight palette, the full guide
---

# The Moonlight palette, the full guide

<small>September 7, 2026 · Design, Documentation</small>

Moonlight runs on my [prompt](https://github.com/v-amorim/moonlight-oh-my-posh), my [editor](https://github.com/v-amorim/moonlight-vscode-theme), mpv, a TachiyomiJ2K fork, and this site's [diagrams](mermaid-examples.md). This is the reference I use when porting it somewhere new.

Code samples here render in **Aurora**, the cooler syntax variant added in 5.6.0.

## Source of truth

Oh My Posh's `Moonlight.omp.json` palette block is canonical; everything else derives from it. Colors shift there first, in [OKLCH](https://oklch.com/), then propagate.

OKLCH because the three things that matter, background depth, text contrast, accent hue, map straight onto L, C and H. One step darker is "lower L, same C and H" instead of guessing a hex and rechecking by eye.

## The palette

Three families. Click a card to copy it.

<div class="palette-format">
<span class="palette-format__label">Copy as</span>
</div>

### Night

Backgrounds, darkest to lightest, plus the border above them.

<div class="palette-grid">
<button class="palette-card" data-hex="#0D0E17" data-oklch="oklch(16.7% 0.019 279.2)"><span class="palette-card__chip" style="background:#0D0E17"></span><span class="palette-card__body"><span class="palette-card__role">Deepest background</span><span class="palette-card__value">#0D0E17</span><span class="palette-card__use">Editor and terminal canvas</span></span></button>
<button class="palette-card" data-hex="#191726" data-oklch="oklch(21.5% 0.029 289.8)"><span class="palette-card__chip" style="background:#191726"></span><span class="palette-card__body"><span class="palette-card__role">Base surface</span><span class="palette-card__value">#191726</span><span class="palette-card__use">Panels, widgets, sidebars</span></span></button>
<button class="palette-card" data-hex="#272D44" data-oklch="oklch(30.2% 0.043 272.4)"><span class="palette-card__chip" style="background:#272D44"></span><span class="palette-card__body"><span class="palette-card__role">Selection / hover</span><span class="palette-card__value">#272D44</span><span class="palette-card__use">Active row, selected text</span></span></button>
<button class="palette-card" data-hex="#303751" data-oklch="oklch(34.2% 0.047 272.2)"><span class="palette-card__chip" style="background:#303751"></span><span class="palette-card__body"><span class="palette-card__role">Elevated surface</span><span class="palette-card__value">#303751</span><span class="palette-card__use">Popups, tooltips, dividers</span></span></button>
<button class="palette-card" data-hex="#3C466F" data-oklch="oklch(40.5% 0.070 272.5)"><span class="palette-card__chip" style="background:#3C466F"></span><span class="palette-card__body"><span class="palette-card__role">Structural border</span><span class="palette-card__value">#3C466F</span><span class="palette-card__use">Buttons, hard borders</span></span></button>
</div>

### Ink

Text, brightest to faintest. These gaps carry the hierarchy once the monitor is dimmed.

<div class="palette-grid">
<button class="palette-card" data-hex="#F8EAF8" data-oklch="oklch(95.2% 0.024 325.8)"><span class="palette-card__chip" style="background:#F8EAF8"></span><span class="palette-card__body"><span class="palette-card__role">Primary text</span><span class="palette-card__value">#F8EAF8</span><span class="palette-card__use">Body text</span></span></button>
<button class="palette-card" data-hex="#CED9FF" data-oklch="oklch(88.9% 0.054 272.6)"><span class="palette-card__chip" style="background:#CED9FF"></span><span class="palette-card__body"><span class="palette-card__role">Header / bright</span><span class="palette-card__value">#CED9FF</span><span class="palette-card__use">Headings, emphasis</span></span></button>
<button class="palette-card" data-hex="#CDCFE7" data-oklch="oklch(86.0% 0.033 281.9)"><span class="palette-card__chip" style="background:#CDCFE7"></span><span class="palette-card__body"><span class="palette-card__role">Secondary text</span><span class="palette-card__value">#CDCFE7</span><span class="palette-card__use">Type hints, separators</span></span></button>
<button class="palette-card" data-hex="#AEA4BF" data-oklch="oklch(73.6% 0.040 302.3)"><span class="palette-card__chip" style="background:#AEA4BF"></span><span class="palette-card__body"><span class="palette-card__role">Dim text</span><span class="palette-card__value">#AEA4BF</span><span class="palette-card__use">Comments, disabled labels</span></span></button>
<button class="palette-card" data-hex="#6E7681" data-oklch="oklch(56.3% 0.020 256.3)"><span class="palette-card__chip" style="background:#6E7681"></span><span class="palette-card__body"><span class="palette-card__role">Separator</span><span class="palette-card__value">#6E7681</span><span class="palette-card__use">Line numbers, hairlines</span></span></button>
</div>

### Signals

These five mean something, so nothing cosmetic ever borrows them.

<div class="palette-grid">
<button class="palette-card" data-hex="#5DABF3" data-oklch="oklch(72.2% 0.131 248.4)"><span class="palette-card__chip" style="background:#5DABF3"></span><span class="palette-card__body"><span class="palette-card__role">Accent</span><span class="palette-card__value">#5DABF3</span><span class="palette-card__use">Links, active elements</span></span></button>
<button class="palette-card" data-hex="#49EF95" data-oklch="oklch(84.6% 0.185 154.9)"><span class="palette-card__chip" style="background:#49EF95"></span><span class="palette-card__body"><span class="palette-card__role">Success</span><span class="palette-card__value">#49EF95</span><span class="palette-card__use">Additions, confirmations</span></span></button>
<button class="palette-card" data-hex="#99E6B3" data-oklch="oklch(86.1% 0.104 154.6)"><span class="palette-card__chip" style="background:#99E6B3"></span><span class="palette-card__body"><span class="palette-card__role">Success, muted</span><span class="palette-card__value">#99E6B3</span><span class="palette-card__use">Untracked files</span></span></button>
<button class="palette-card" data-hex="#CA5F71" data-oklch="oklch(62.0% 0.137 11.4)"><span class="palette-card__chip" style="background:#CA5F71"></span><span class="palette-card__body"><span class="palette-card__role">Error</span><span class="palette-card__value">#CA5F71</span><span class="palette-card__use">Diagnostics, deletions</span></span></button>
<button class="palette-card" data-hex="#FFCB6B" data-oklch="oklch(86.9% 0.128 81.1)"><span class="palette-card__chip" style="background:#FFCB6B"></span><span class="palette-card__body"><span class="palette-card__role">Warning</span><span class="palette-card__value">#FFCB6B</span><span class="palette-card__use">Lightbulbs, cautions</span></span></button>
</div>

Selection and elevated surface got an OKLCH lightness bump on 2026-09-07: `#282e46` → `#272D44`, `#2d3654` → `#303751`. Same hue and chroma, better separation from the base surface.

## Syntax

27 roles from the VS Code theme's `tokenColors`. Semantic tokens resolve to the same values, so there is one list, not two.

```python
# Comments and annotations
@dataclass  # decorator
class MoonlightPalette:  # class name
    """Docstrings and strings look like this."""
    accent: str = "#5DABF3"        # string literal
    steps: int = 12                # numeric literal

    def nearest_role(self, hex_value):  # function definition
        if hex_value in KNOWN_ROLES:   # keyword + operator
            return KNOWN_ROLES[hex_value]
        return None
```

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#AEA4BF"></span> | `#AEA4BF` | Comments and annotations |
| <span class="swatch-dot" style="background:#CDCFE7"></span> | `#CDCFE7` | Type hints and separators |
| <span class="swatch-dot" style="background:#B0B9E5"></span> | `#B0B9E5` | Functions and types |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `#ACB9E6` | Markdown formatting |
| <span class="swatch-dot" style="background:#9CB6ED"></span> | `#9CB6ED` | Classes and decorators |
| <span class="swatch-dot" style="background:#97B7FA"></span> | `#97B7FA` | SQL keywords, member variables |
| <span class="swatch-dot" style="background:#A5CFFF"></span> | `#A5CFFF` | Strings, docstrings, regex |
| <span class="swatch-dot" style="background:#78A1FA"></span> | `#78A1FA` | Member access, object properties |
| <span class="swatch-dot" style="background:#7386D0"></span> | `#7386D0` | Commands, links, builtin functions |
| <span class="swatch-dot" style="background:#79B8FF"></span> | `#79B8FF` | Numeric literals |
| <span class="swatch-dot" style="background:#79C0FF"></span> | `#79C0FF` | Headings, `self`, dunders |
| <span class="swatch-dot" style="background:#49EF95"></span> | `#49EF95` | Diff insertions |
| <span class="swatch-dot" style="background:#F2B199"></span> | `#F2B199` | Diff modifications |
| <span class="swatch-dot" style="background:#FFAFAF"></span> | `#FFAFAF` | Parameters, attributes, inheritance |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `#CA5F71` | Keywords and operators |
| <span class="swatch-dot" style="background:#FF6BAB"></span> | `#FF6BAB` | f/r-string prefixes |
| <span class="swatch-dot" style="background:#F279B2"></span> | `#F279B2` | Uppercase constants |
| <span class="swatch-dot" style="background:#FF98BA"></span> | `#FF98BA` | Symbolic values |
| <span class="swatch-dot" style="background:#FAA4C9"></span> | `#FAA4C9` | String delimiters, escapes |
| <span class="swatch-dot" style="background:#FDBAF2"></span> | `#FDBAF2` | References, namespaces |
| <span class="swatch-dot" style="background:#F8EAF8"></span> | `#F8EAF8` | Accessed variables |
| <span class="swatch-dot" style="background:#B58EE8"></span> | `#B58EE8` | Declarations |
| <span class="swatch-dot" style="background:#A5A1E9"></span> | `#A5A1E9` | Punctuation, storage types |
| <span class="swatch-dot" style="background:#D388F0"></span> | `#D388F0` | Config variables |
| <span class="swatch-dot" style="background:#E08ADB"></span> | `#E08ADB` | Constants, enums |
| <span class="swatch-dot" style="background:#CED9FF"></span> | `#CED9FF` | Enum members |
| <span class="swatch-dot" style="background:#698CFF"></span> | `#698CFF` | Method calls |

Bracket pairs cycle through six, then the error color when unmatched:

<div class="palette-swatch-row">
<span class="palette-swatch" style="background:#5DABF3;color:#0D0E17">1 · #5DABF3</span>
<span class="palette-swatch" style="background:#7386D0">2 · #7386D0</span>
<span class="palette-swatch" style="background:#B86CB3">3 · #B86CB3</span>
<span class="palette-swatch" style="background:#FF72B0;color:#0D0E17">4 · #FF72B0</span>
<span class="palette-swatch" style="background:#DBB060;color:#0D0E17">5 · #DBB060</span>
<span class="palette-swatch" style="background:#43C97F;color:#0D0E17">6 · #43C97F</span>
<span class="palette-swatch" style="background:#CA5F71">unmatched · #CA5F71</span>
</div>

## Aurora

Same UI, five recolored syntax roles. Coral keywords go, a cool blue-violet field replaces them.

Why: lightness gaps compress when you dim a monitor, hue gaps survive. Stock Moonlight leans on coral as its warm anchor; Aurora spreads the literals apart by hue instead.

<div class="palette-grid">
<button class="palette-card" data-hex="#7386D0" data-oklch="oklch(63.7% 0.114 271.9)"><span class="palette-card__chip" style="background:#7386D0"></span><span class="palette-card__body"><span class="palette-card__role">Keywords, operators</span><span class="palette-card__value">#7386D0</span><span class="palette-card__use">was #CA5F71</span></span></button>
<button class="palette-card" data-hex="#B0C8FF" data-oklch="oklch(83.4% 0.082 266.3)"><span class="palette-card__chip" style="background:#B0C8FF"></span><span class="palette-card__body"><span class="palette-card__role">Numbers</span><span class="palette-card__value">#B0C8FF</span><span class="palette-card__use">was #79B8FF</span></span></button>
<button class="palette-card" data-hex="#D8A8F0" data-oklch="oklch(80.0% 0.112 314.1)"><span class="palette-card__chip" style="background:#D8A8F0"></span><span class="palette-card__body"><span class="palette-card__role">Constants, enums</span><span class="palette-card__value">#D8A8F0</span><span class="palette-card__use">was #E08ADB</span></span></button>
<button class="palette-card" data-hex="#C9A0EE" data-oklch="oklch(77.1% 0.117 307.9)"><span class="palette-card__chip" style="background:#C9A0EE"></span><span class="palette-card__body"><span class="palette-card__role">Quotes, f-prefix, escapes</span><span class="palette-card__value">#C9A0EE</span><span class="palette-card__use">was #FAA4C9 and #FF6BAB</span></span></button>
<button class="palette-card" data-hex="#CA5F71" data-oklch="oklch(62.0% 0.137 11.4)"><span class="palette-card__chip" style="background:#CA5F71"></span><span class="palette-card__body"><span class="palette-card__role">Diff deletions</span><span class="palette-card__value">#CA5F71</span><span class="palette-card__use">now its own scope group</span></span></button>
</div>

That last one is the trap: `markup.deleted` sits inside the keywords scope group upstream, so deletions were coral only by coincidence. Recolor keywords and removed lines turn blue with them.

## Git and diagnostics

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#49EF95"></span> | `#49EF95` | Added |
| <span class="swatch-dot" style="background:#99E6B3"></span> | `#99E6B3` | Untracked |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `#ACB9E6` | Modified |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `#CA5F71` | Deleted |
| <span class="swatch-dot" style="background:#F2B6B6"></span> | `#F2B6B6` | Conflicting |
| <span class="swatch-dot" style="background:#7386D0"></span> | `#7386D0` | Renamed |
| <span class="swatch-dot" style="background:#72788C"></span> | `#72788C` | Ignored |
| <span class="swatch-dot" style="background:#D9CECC"></span> | `#D9CECC` | Submodule |

Diff backgrounds are those accents at low alpha: `#49EF952A` in, `#CA5F713A` out.

## Oh My Posh

| Swatch | Token | Hex |
|---|---|---|
| <span class="swatch-dot" style="background:#1E2336"></span> | `main_background` | `#1E2336` |
| <span class="swatch-dot" style="background:#272D44"></span> | `secondary_background` | `#272D44` |
| <span class="swatch-dot" style="background:#303751"></span> | `tertiary_background` | `#303751` |
| <span class="swatch-dot" style="background:#5DABF3"></span> | `terminal_blue` | `#5DABF3` |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `terminal_bluegray` | `#ACB9E6` |
| <span class="swatch-dot" style="background:#CED9FF"></span> | `terminal_brightgray` | `#CED9FF` |
| <span class="swatch-dot" style="background:#CBCFE7"></span> | `terminal_lightgray` | `#CBCFE7` |
| <span class="swatch-dot" style="background:#AEA4BF"></span> | `terminal_gray` | `#AEA4BF` |
| <span class="swatch-dot" style="background:#7386D0"></span> | `terminal_lightblue` | `#7386D0` |
| <span class="swatch-dot" style="background:#49EF95"></span> | `terminal_green` | `#49EF95` |
| <span class="swatch-dot" style="background:#99E6B3"></span> | `terminal_lightteal` | `#99E6B3` |
| <span class="swatch-dot" style="background:#B86CB3"></span> | `terminal_pink` | `#B86CB3` |
| <span class="swatch-dot" style="background:#CA5FA6"></span> | `terminal_red` | `#CA5FA6` |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `terminal_error` | `#CA5F71` |

Battery and CPU meters use a 6-step ramp, the one place Moonlight leaves blue-violet on purpose. Built in OKLCH so it reads as a gradient, not five unrelated colors.

<div class="palette-swatch-row">
<span class="palette-swatch" style="background:#CED9FF;color:#0D0E17">#CED9FF</span>
<span class="palette-swatch" style="background:#ACB9E6;color:#0D0E17">#ACB9E6</span>
<span class="palette-swatch" style="background:#CDBBE5;color:#0D0E17">#CDBBE5</span>
<span class="palette-swatch" style="background:#EA98EE;color:#0D0E17">#EA98EE</span>
<span class="palette-swatch" style="background:#F883C9;color:#0D0E17">#F883C9</span>
<span class="palette-swatch" style="background:#FF6F7A;color:#0D0E17">#FF6F7A</span>
</div>

## Android

Material3 needs container levels and on-color pairs, so the TachiyomiJ2K fork derives its own scale rather than copying hexes.

| Swatch | Token | Hex |
|---|---|---|
| <span class="swatch-dot" style="background:#15151F"></span> | `moonlight_background` | `#15151F` |
| <span class="swatch-dot" style="background:#191726"></span> | `moonlight_surface` | `#191726` |
| <span class="swatch-dot" style="background:#232739"></span> | `moonlight_primary_variant` | `#232739` |
| <span class="swatch-dot" style="background:#2A3046"></span> | `moonlight_surface_container_high` | `#2A3046` |
| <span class="swatch-dot" style="background:#323954"></span> | `moonlight_surface_container_highest` | `#323954` |
| <span class="swatch-dot" style="background:#F8EAF8"></span> | `moonlight_on_background` | `#F8EAF8` |
| <span class="swatch-dot" style="background:#EDE7F4"></span> | `moonlight_action_bar_text` | `#EDE7F4` |
| <span class="swatch-dot" style="background:#AEC4F5"></span> | `moonlight_primary` | `#AEC4F5` |
| <span class="swatch-dot" style="background:#0D0E17"></span> | `moonlight_on_primary` | `#0D0E17` |
| <span class="swatch-dot" style="background:#8190E3"></span> | `moonlight_secondary` | `#8190E3` |
| <span class="swatch-dot" style="background:#3C466F"></span> | `moonlight_secondary_variant` | `#3C466F` |
| <span class="swatch-dot" style="background:#8190E3"></span> | `moonlight_highlight` | `#8190E3` at 12% |
| <span class="swatch-dot" style="background:#7A7689"></span> | `moonlight_tab_bar_icon_inactive` | `#7A7689` |

The three container rows got the same +0.015 L bump on 2026-09-07.

## mpv

Three extras for the `keybind-visualizer` and `sub-seek` search UI.

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#2B2A3D"></span> | `#2B2A3D` | Matched key fill |
| <span class="swatch-dot" style="background:#D3D0DE"></span> | `#D3D0DE` | Matched key border, query text |
| <span class="swatch-dot" style="background:#A9C0FF"></span> | `#A9C0FF` | Typed characters inside a match |

## Mermaid

Named hues for flowchart, pie and sequence coloring. Tint and mid-tone arrays are derived from these, so a new chart type inherits the family. Full gallery: [every Mermaid diagram in Moonlight](mermaid-examples.md).

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#0D0E17"></span> | `#0D0E17` | `bg` |
| <span class="swatch-dot" style="background:#191726"></span> | `#191726` | `card` |
| <span class="swatch-dot" style="background:#F8EAF8"></span> | `#F8EAF8` | `text` |
| <span class="swatch-dot" style="background:#7386D0"></span> | `#7386D0` | `primary` |
| <span class="swatch-dot" style="background:#5DABF3"></span> | `#5DABF3` | `blue` |
| <span class="swatch-dot" style="background:#79C0FF"></span> | `#79C0FF` | `sky` |
| <span class="swatch-dot" style="background:#58A6FF"></span> | `#58A6FF` | `azure` |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `#ACB9E6` | `lavender` |
| <span class="swatch-dot" style="background:#A5A1E9"></span> | `#A5A1E9` | `violet` |
| <span class="swatch-dot" style="background:#B86CB3"></span> | `#B86CB3` | `pink` |
| <span class="swatch-dot" style="background:#CA5FA6"></span> | `#CA5FA6` | `magenta` |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `#CA5F71` | `red` |
| <span class="swatch-dot" style="background:#49EF95"></span> | `#49EF95` | `green` |
| <span class="swatch-dot" style="background:#99E6B3"></span> | `#99E6B3` | `mint` |
| <span class="swatch-dot" style="background:#FFCB6B"></span> | `#FFCB6B` | `yellow` |

## Porting it somewhere new

1. Start from the tables here, not a screenshot of another port.
2. Map the target's vocabulary onto these roles first. Most design systems need 3-4 background roles, not all five.
3. Need a role that doesn't exist? Derive it in OKLCH from the nearest one: same hue and chroma, move L. New hues only for genuinely new kinds of thing.
4. Copy hexes when roles line up 1:1 (VS Code, mpv). Derive when they don't (Android).
5. Update this page when a shared role changes.

## Known gaps

Still on the pre-2026-09-07 `#282e46`:

- `moonlight-comic-reader` → `colors.xml`, the download badge.
- This site → `mermaid-config.js`, the dark scheme's `accent`.

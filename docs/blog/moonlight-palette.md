---
title: The Moonlight palette, the full guide
---

# The Moonlight palette, the full guide

<small>September 10, 2026 · Design, Documentation</small>

Moonlight runs on my [prompt](https://github.com/v-amorim/moonlight-oh-my-posh), my [editor](https://github.com/v-amorim/moonlight-vscode-theme), mpv, Windows Terminal, PowerShell, bash, the YASB status bar, three Windhawk stylers, a TachiyomiJ2K fork, and this site's [diagrams](mermaid-examples.md). Ten ports, one palette.

## Source of truth

**This page.** `just tokens` reads the cards below, recomputes OKLCH and WCAG contrast from each hex, and writes [`moonlight-tokens.json`](../assets/moonlight-tokens.json), which every port reads. It fails the build when a stated OKLCH disagrees with its hex, or when a text-on-surface pair drops below its minimum, so the page cannot claim a number it does not have.

## The system

1. **One hue family.** Every surface, every text tier and the whole accent ramp sit within 5° of hue 274.
2. **Even lightness steps.** Surfaces climb +0.04 L each, the accent +0.065 L each, measured in OKLCH where equal steps look equal.
3. **One ranked accent.** A single hue with four steps, so every port emphasises the same way.
4. **Borders in alpha.** One border token over any layer, instead of a new opaque value per surface.

## Surfaces

Four layers. The canvas, the chrome, the active thing, the selected thing.

<div class="tonal-ladder">
<div class="tonal-ladder__rung"><span class="tonal-ladder__hex">#0D0E17</span><span class="tonal-ladder__bar" style="background:#0D0E17"></span><span class="tonal-ladder__meta"><b>L 0.167 · h279.2</b>bg, the canvas</span></div>
<div class="tonal-ladder__rung"><span class="tonal-ladder__hex">#141726</span><span class="tonal-ladder__bar" style="background:#141726"></span><span class="tonal-ladder__meta"><b>L 0.209 · +0.042</b>surface-1, the chrome</span></div>
<div class="tonal-ladder__rung"><span class="tonal-ladder__hex">#1C2033</span><span class="tonal-ladder__bar" style="background:#1C2033"></span><span class="tonal-ladder__meta"><b>L 0.249 · +0.040</b>surface-2, the active thing</span></div>
<div class="tonal-ladder__rung"><span class="tonal-ladder__hex">#252A42</span><span class="tonal-ladder__bar" style="background:#252A42"></span><span class="tonal-ladder__meta"><b>L 0.292 · +0.043</b>surface-3, the selected thing</span></div>
</div>

<div class="palette-format">
<span class="palette-format__label">Copy as</span>
</div>

<div class="palette-grid">
<button class="palette-card" data-token="bg" data-hex="#0D0E17" data-oklch="oklch(0.167 0.019 279.2)"><span class="palette-card__chip" style="background:#0D0E17"></span><span class="palette-card__body"><span class="palette-card__role">bg</span><span class="palette-card__value">#0D0E17</span><span class="palette-card__use">Editor, terminal, panel, page canvas</span></span></button>
<button class="palette-card" data-token="surface-1" data-hex="#141726" data-oklch="oklch(0.209 0.030 274.8)"><span class="palette-card__chip" style="background:#141726"></span><span class="palette-card__body"><span class="palette-card__role">surface-1</span><span class="palette-card__value">#141726</span><span class="palette-card__use">Sidebar, tab bar, status bar, input, card, widget</span></span></button>
<button class="palette-card" data-token="surface-2" data-hex="#1C2033" data-oklch="oklch(0.249 0.037 274.3)"><span class="palette-card__chip" style="background:#1C2033"></span><span class="palette-card__body"><span class="palette-card__role">surface-2</span><span class="palette-card__value">#1C2033</span><span class="palette-card__use">Active tab, section header, line highlight</span></span></button>
<button class="palette-card" data-token="surface-3" data-hex="#252A42" data-oklch="oklch(0.292 0.044 274.3)"><span class="palette-card__chip" style="background:#252A42"></span><span class="palette-card__body"><span class="palette-card__role">surface-3</span><span class="palette-card__value">#252A42</span><span class="palette-card__use">List selection, checkbox fill, terminal selection</span></span></button>
</div>

### Which layer gets what

**Chrome sits on `bg`, with the canvas.** Sidebar, tab bar, activity bar, status bar, title bar, panel header: anything touching an edge of the window is the same color as the editor behind it. **Only what floats lifts.** Widgets, popups, notifications, hover states, dropdowns and inputs take `surface-1`. The active tab takes `surface-2`, selection takes `surface-3`.

The instinct is to lift the chrome one step above the canvas. Resist it, or the theme reads lighter than a dark theme should. The edge comes from the alpha border instead, steady at 1.19:1 to 1.24:1 on every layer.

## Text

Three tiers, one job each. The gaps carry the hierarchy once a monitor is dimmed.

<div class="palette-grid">
<button class="palette-card" data-token="on-surface" data-hex="#EEEEFA" data-oklch="oklch(0.953 0.016 286.1)"><span class="palette-card__chip" style="background:#EEEEFA"></span><span class="palette-card__body"><span class="palette-card__role">on-surface</span><span class="palette-card__value">#EEEEFA</span><span class="palette-card__use">Body text, headings, active labels</span></span></button>
<button class="palette-card" data-token="on-surface-muted" data-hex="#9BA3C4" data-oklch="oklch(0.720 0.049 274.4)"><span class="palette-card__chip" style="background:#9BA3C4"></span><span class="palette-card__body"><span class="palette-card__role">on-surface-muted</span><span class="palette-card__value">#9BA3C4</span><span class="palette-card__use">Supporting copy, comments, inactive icons</span></span></button>
<button class="palette-card" data-token="on-surface-dim" data-hex="#7E86A4" data-oklch="oklch(0.624 0.046 273.3)"><span class="palette-card__chip" style="background:#7E86A4"></span><span class="palette-card__body"><span class="palette-card__role">on-surface-dim</span><span class="palette-card__value">#7E86A4</span><span class="palette-card__use">Line numbers, placeholders, ghost text</span></span></button>
</div>

`on-surface-dim` has to clear 4.5:1 on *every* surface it renders on, not just the canvas: line numbers sit on `bg`, placeholders on `surface-1`. It clears both, at 5.34:1 and 4.94:1.

The primary text keeps a lavender lean at chroma 0.016, hue 286. Low enough to read as white, close enough to the family not to fight the tiers beside it.

## Accent

<div class="palette-grid">
<button class="palette-card" data-token="primary" data-hex="#7386D0" data-oklch="oklch(0.637 0.114 271.9)"><span class="palette-card__chip" style="background:#7386D0"></span><span class="palette-card__body"><span class="palette-card__role">primary</span><span class="palette-card__value">#7386D0</span><span class="palette-card__use">Filled button, focus ring, branch segment, progress</span></span></button>
<button class="palette-card" data-token="primary-60" data-hex="#8A9BE0" data-oklch="oklch(0.703 0.103 272.9)"><span class="palette-card__chip" style="background:#8A9BE0"></span><span class="palette-card__body"><span class="palette-card__role">primary-60</span><span class="palette-card__value">#8A9BE0</span><span class="palette-card__use">Hover on primary, active icon</span></span></button>
<button class="palette-card" data-token="primary-70" data-hex="#A2B0EA" data-oklch="oklch(0.767 0.085 273.8)"><span class="palette-card__chip" style="background:#A2B0EA"></span><span class="palette-card__body"><span class="palette-card__role">primary-70</span><span class="palette-card__value">#A2B0EA</span><span class="palette-card__use">Cursor, badge, uosc progress bar</span></span></button>
<button class="palette-card" data-token="secondary" data-hex="#B9C6F5" data-oklch="oklch(0.833 0.068 272.8)"><span class="palette-card__chip" style="background:#B9C6F5"></span><span class="palette-card__body"><span class="palette-card__role">secondary</span><span class="palette-card__value">#B9C6F5</span><span class="palette-card__use">Links and inline emphasis</span></span></button>
<button class="palette-card" data-token="on-primary" data-hex="#0D0E17" data-oklch="oklch(0.167 0.019 279.2)"><span class="palette-card__chip" style="background:#0D0E17"></span><span class="palette-card__body"><span class="palette-card__role">on-primary</span><span class="palette-card__value">#0D0E17</span><span class="palette-card__use">Text on a primary fill</span></span></button>
</div>

`on-primary` is the background, not white. White on `primary` measures 3.47:1 and fails normal text; the canvas color gives 5.54:1. Filled buttons carry dark text.

## Borders

Two tokens, both in alpha, so one value works on all four layers.

<div class="palette-grid">
<button class="palette-card" data-token="border" data-hex="#9BA3C41F" data-oklch="oklch(0.720 0.049 274.4)"><span class="palette-card__chip" style="background:linear-gradient(90deg,#0D0E17 0 25%,#141726 25% 50%,#1C2033 50% 75%,#252A42 75%);box-shadow:inset 0 0 0 1px #9BA3C41F"></span><span class="palette-card__body"><span class="palette-card__role">border</span><span class="palette-card__value">#9BA3C41F</span><span class="palette-card__use">Separators, card and control outlines</span></span></button>
<button class="palette-card" data-token="border-strong" data-hex="#FFFFFF26" data-oklch="oklch(1.000 0.000 89.9)"><span class="palette-card__chip" style="background:linear-gradient(90deg,#0D0E17 0 25%,#141726 25% 50%,#1C2033 50% 75%,#252A42 75%);box-shadow:inset 0 0 0 1px #FFFFFF26"></span><span class="palette-card__body"><span class="palette-card__role">border-strong</span><span class="palette-card__value">#FFFFFF26</span><span class="palette-card__use">Interactive control outline, secondary button</span></span></button>
</div>

Composited, `border` holds between 1.19:1 and 1.24:1 against whatever sits under it. That is the argument for alpha: an opaque border vanishes on the light layers and shouts on the dark ones, which is how palettes end up with two border values meaning the same thing.

| Under | Composited | Separation |
|---|---|---|
| `bg` | `#1E202C` | 1.19:1 |
| `surface-1` | `#242839` | 1.22:1 |
| `surface-2` | `#2B3045` | 1.24:1 |
| `surface-3` | `#333952` | 1.24:1 |

## Signals

These three mean something, so nothing cosmetic borrows them. They are also the syntax identity, which is why they sit outside the hue family.

<div class="palette-grid">
<button class="palette-card" data-token="success" data-hex="#49EF95" data-oklch="oklch(0.846 0.185 154.9)"><span class="palette-card__chip" style="background:#49EF95"></span><span class="palette-card__body"><span class="palette-card__role">success</span><span class="palette-card__value">#49EF95</span><span class="palette-card__use">Additions, confirmations</span></span></button>
<button class="palette-card" data-token="warning" data-hex="#FFCB6B" data-oklch="oklch(0.869 0.128 81.1)"><span class="palette-card__chip" style="background:#FFCB6B"></span><span class="palette-card__body"><span class="palette-card__role">warning</span><span class="palette-card__value">#FFCB6B</span><span class="palette-card__use">Lightbulbs, cautions</span></span></button>
<button class="palette-card" data-token="error" data-hex="#CA5F71" data-oklch="oklch(0.620 0.137 11.4)"><span class="palette-card__chip" style="background:#CA5F71"></span><span class="palette-card__body"><span class="palette-card__role">error</span><span class="palette-card__value">#CA5F71</span><span class="palette-card__use">Diagnostics, deletions</span></span></button>
</div>

`warning` already sits at 100% of the chroma sRGB allows for its lightness and hue. It cannot get more vivid, and a P3 display will not change that.

## Contrast, measured

Every pair the generator checks. Recomputed from the hexes on each build, alpha composited before measuring.

| Foreground | Background | Ratio | Minimum |
|---|---|---|---|
| `on-surface` | `bg` | <span class="cr" data-level="pass">16.70:1</span> | 4.5:1 |
| `on-surface` | `surface-3` | <span class="cr" data-level="pass">12.26:1</span> | 4.5:1 |
| `on-surface-muted` | `bg` | <span class="cr" data-level="pass">7.72:1</span> | 4.5:1 |
| `on-surface-muted` | `surface-1` | <span class="cr" data-level="pass">7.14:1</span> | 4.5:1 |
| `on-surface-dim` | `bg` | <span class="cr" data-level="pass">5.35:1</span> | 4.5:1 |
| `on-surface-dim` | `surface-1` | <span class="cr" data-level="pass">4.94:1</span> | 4.5:1 |
| `primary` | `bg` | <span class="cr" data-level="pass">5.55:1</span> | 3:1 |
| `primary-60` | `bg` | <span class="cr" data-level="pass">7.18:1</span> | 4.5:1 |
| `primary-70` | `bg` | <span class="cr" data-level="pass">9.10:1</span> | 4.5:1 |
| `secondary` | `bg` | <span class="cr" data-level="pass">11.41:1</span> | 4.5:1 |
| `on-primary` | `primary` | <span class="cr" data-level="pass">5.55:1</span> | 4.5:1 |
| `success` | `bg` | <span class="cr" data-level="pass">12.88:1</span> | 4.5:1 |
| `warning` | `bg` | <span class="cr" data-level="pass">12.82:1</span> | 4.5:1 |
| `error` | `bg` | <span class="cr" data-level="pass">4.93:1</span> | 4.5:1 |

## Ports

Roles map 1:1 wherever the target has a vocabulary for them. Where it does not, the port derives from the nearest role in OKLCH: same hue and chroma, move L.

### VS Code

589 keys in `colors`, mapped by value with three key-name exceptions: border patterns go to `border`, the slider group to `border` at higher alpha, find-match highlights to `primary` at low alpha. `tokenColors` keeps its own hexes apart from the three text tiers. Nineteen chrome keys sit on `bg`; the twenty-one on `surface-1` are all widgets, popups or controls.

| Key | Value |
|---|---|
| `sideBar.background` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `statusBar.background` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `terminal.background` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `editorWidget.background` | <span class="hexcell" style="background:#141726;color:#EEEEFA">#141726</span> |
| `tab.activeBackground` | <span class="hexcell" style="background:#1C2033dd;color:#EEEEFA">#1C2033dd</span> |
| `button.background` | <span class="hexcell" style="background:#7386D0;color:#0D0E17">#7386D0</span> |
| `button.foreground` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `textLink.foreground` | <span class="hexcell" style="background:#B9C6F5;color:#0D0E17">#B9C6F5</span> |
| `editorCursor.foreground` | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> |
| `editorLineNumber.foreground` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> |
| `panel.border` | <span class="hexcell" style="background:#9BA3C41F;color:#EEEEFA">#9BA3C41F</span> |
| `tab.border` | <span class="hexcell" style="background:#9BA3C41F;color:#EEEEFA">#9BA3C41F</span> |

### Windows Terminal

Terminal and editor share `bg`, so an integrated terminal has no seam. The ANSI blues and cyans take the accent ramp.

| Slot | Value |
|---|---|
| `background` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `foreground`, `white`, `brightWhite` | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> |
| `black` | <span class="hexcell" style="background:#141726;color:#EEEEFA">#141726</span> |
| `brightBlack` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> |
| `blue` | <span class="hexcell" style="background:#7386D0;color:#0D0E17">#7386D0</span> |
| `brightBlue` | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> |
| `cyan` | <span class="hexcell" style="background:#B9C6F5;color:#0D0E17">#B9C6F5</span> |
| `brightCyan` | <span class="hexcell" style="background:#8A9BE0;color:#0D0E17">#8A9BE0</span> |
| `selectionBackground` | <span class="hexcell" style="background:#252A42;color:#EEEEFA">#252A42</span> |
| `cursorColor` | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> |

### This site

The `slate` scheme already named its variables the way the token set does, so it was a repoint, not a restructure. Values land as `oklch()` because the `default` scheme already uses that notation. `--header-background` and `--sidebar` sit on `bg`, same rule as the editor chrome; `--card` and `--popover` keep `surface-1`, because a card floats.

### mpv

`uosc.conf` carries the whole theme on one line.

```ini
color=foreground=A2B0EA,foreground_text=0D0E17,background=141726,background_text=EEEEFA,curtain=0D0E17,success=49EF95,error=CA5F71
```

`stats.conf` is still the brown upstream default, `FFD9CE`, `36231E`, `F3AB5D`, and reads as a different application.

### Oh My Posh

The three prompt backgrounds take the three surface levels, the three gray tokens the three text tiers.

| Token | Value | Role |
|---|---|---|
| `main_background` | <span class="hexcell" style="background:#141726;color:#EEEEFA">#141726</span> | `surface-1` |
| `secondary_background` | <span class="hexcell" style="background:#1C2033;color:#EEEEFA">#1C2033</span> | `surface-2` |
| `tertiary_background` | <span class="hexcell" style="background:#252A42;color:#EEEEFA">#252A42</span> | `surface-3` |
| `terminal_brightgray` | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> | `on-surface` |
| `terminal_lightgray` | <span class="hexcell" style="background:#9BA3C4;color:#0D0E17">#9BA3C4</span> | `on-surface-muted` |
| `terminal_gray` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> | `on-surface-dim` |
| `terminal_blue` | <span class="hexcell" style="background:#7386D0;color:#0D0E17">#7386D0</span> | `primary` |
| `terminal_lightblue` | <span class="hexcell" style="background:#8A9BE0;color:#0D0E17">#8A9BE0</span> | `primary-60` |
| `terminal_bluegray` | <span class="hexcell" style="background:#B9C6F5;color:#0D0E17">#B9C6F5</span> | `secondary` |

Every color lives in the `palette` block, so nine edits cover the whole prompt. The dated snapshots in `themes/` are history and stay untouched.

The `usage_0` to `usage_5` battery and CPU ramp is the one place Moonlight leaves the blue-violet family on purpose.

<div class="palette-swatch-row">
<span class="palette-swatch" style="background:#CED9FF;color:#0D0E17">#CED9FF</span>
<span class="palette-swatch" style="background:#ACB9E6;color:#0D0E17">#ACB9E6</span>
<span class="palette-swatch" style="background:#CDBBE5;color:#0D0E17">#CDBBE5</span>
<span class="palette-swatch" style="background:#EA98EE;color:#0D0E17">#EA98EE</span>
<span class="palette-swatch" style="background:#F883C9;color:#0D0E17">#F883C9</span>
<span class="palette-swatch" style="background:#FF6F7A;color:#0D0E17">#FF6F7A</span>
</div>

### PowerShell

`Profile.ps1` colors PSReadLine. The syntax roles were already in the palette; the neutrals were not.

| Function | Value | Role |
|---|---|---|
| `CDefault` | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> | `on-surface` |
| `CComment` | <span class="hexcell" style="background:#9BA3C4;color:#0D0E17">#9BA3C4</span> | `on-surface-muted` |
| `CListPredictionTooltip` | <span class="hexcell" style="background:#9BA3C4;color:#0D0E17">#9BA3C4</span> | `on-surface-muted` |
| `CContinuationPrompt` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> | `on-surface-dim` |
| `CInLinePrediction` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> | `on-surface-dim` |
| `CSelection`, `CListPredictionSelected` background | <span class="hexcell" style="background:#252A42;color:#EEEEFA">#252A42</span> | `surface-3` |
| `CEmphasis` | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> | `primary-70` |
| `CMember` | <span class="hexcell" style="background:#B9C6F5;color:#0D0E17">#B9C6F5</span> | `secondary` |
| `CType` | <span class="hexcell" style="background:#B0B9E5;color:#0D0E17">#B0B9E5</span> | Functions and types |

The old neutrals were pure grays with no hue, next to an interface where everything else carries hue 274.

### bash

`.blerc` configures ble.sh, which takes an xterm-256 index rather than a hex, so each role is quantized to the nearest index measured in OKLab.

| Variable | Index | Target |
|---|---|---|
| `COMMENT_COLOR` | <span class="hexcell" style="background:#87AFD7;color:#0D0E17">110</span> | <span class="hexcell" style="background:#9BA3C4;color:#0D0E17">#9BA3C4</span> |
| `DEFAULT_TOKEN_COLOR` | <span class="hexcell" style="background:#EEEEEE;color:#0D0E17">255</span> | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> |
| `DOCUMENT_COLOR` | <span class="hexcell" style="background:#AFD7FF;color:#0D0E17">153</span> | <span class="hexcell" style="background:#B9C6F5;color:#0D0E17">#B9C6F5</span> |
| `EMPHASIS_COLOR` | <span class="hexcell" style="background:#AFAFD7;color:#0D0E17">146</span> | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> |
| `ERROR_COLOR` | <span class="hexcell" style="background:#D75F5F;color:#0D0E17">167</span> | <span class="hexcell" style="background:#CA5F71;color:#0D0E17">#CA5F71</span> |
| `KEYWORD_COLOR` | <span class="hexcell" style="background:#D75F5F;color:#0D0E17">167</span> | <span class="hexcell" style="background:#CA5F71;color:#0D0E17">#CA5F71</span> |
| `NUMBER_COLOR` | <span class="hexcell" style="background:#87AFFF;color:#0D0E17">111</span> | <span class="hexcell" style="background:#B0C8FF;color:#0D0E17">#B0C8FF</span> |
| `PARAMETER_COLOR` | <span class="hexcell" style="background:#AF87D7;color:#0D0E17">140</span> | <span class="hexcell" style="background:#B58EE8;color:#0D0E17">#B58EE8</span> |
| `PREDICTION_COLOR` | <span class="hexcell" style="background:#8787AF;color:#0D0E17">103</span> | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> |
| `STAR_COLOR` | <span class="hexcell" style="background:#FF87AF;color:#0D0E17">211</span> | <span class="hexcell" style="background:#F279B2;color:#0D0E17">#F279B2</span> |
| `TYPE_COLOR` | <span class="hexcell" style="background:#AFAFD7;color:#0D0E17">146</span> | <span class="hexcell" style="background:#B0B9E5;color:#0D0E17">#B0B9E5</span> |
| `VARIABLE_COLOR` | <span class="hexcell" style="background:#5F87D7;color:#0D0E17">68</span> | <span class="hexcell" style="background:#7386D0;color:#0D0E17">#7386D0</span> |

Two collisions survive the quantization: `EMPHASIS_COLOR` and `TYPE_COLOR` land on 146, `DOCUMENT_COLOR` and `STRING_COLOR` on 153. `NUMBER_COLOR` keeps 111 rather than its true nearest, 153, which is already taken twice. The 256-color cube has nothing between them; 24-bit hex would fix all three.

### YASB

The status bar keeps its palette in one `:root` block, and it was Catppuccin Mocha. Catppuccin names by color and Moonlight names by role, so this port is a name-to-role map rather than a value swap.

| Catppuccin | Value | Role |
|---|---|---|
| `base` | `#141726` | `surface-1`, since the bar floats over the desktop |
| `crust` | `#0D0E17` | `bg` |
| `surface0`, `surface1`, `surface2` | `#1C2033`, `#252A42`, `#2F3654` | the layers above it |
| `text` | `#EEEEFA` | `on-surface` |
| `subtext0`, `subtext1`, `overlay2` | `#9BA3C4` | `on-surface-muted` |
| `overlay0`, `overlay1` | `#7E86A4` | `on-surface-dim` |
| `blue` | `#7386D0` | `primary` |
| `sapphire` | `#8A9BE0` | `primary-60` |
| `sky` | `#A2B0EA` | `primary-70` |
| `lavender` | `#B9C6F5` | `secondary` |
| `green` | `#49EF95` | `success` |
| `yellow` | `#FFCB6B` | `warning` |
| `red` | `#CA5F71` | `error` |

Catppuccin has five neutral tiers between text and background where Moonlight has three, so `subtext0`, `subtext1` and `overlay2` collapse onto one value: a role the target does not have is a role it does not need. The warm accents map onto the syntax family, which is where Moonlight keeps its warmth.

### Windhawk

Three styler mods, also on Catppuccin, and the whole look rode on two values: `#181825` for the flyout and bar background, `#45475a` for the hairline border. They become `surface-1` and `surface-3`, with every `Opacity` attribute left alone, so only the hue moves.

Settings live in the registry rather than in files, so the port ships as `.reg` exports.

### Android

Material3 wants container levels and on-color pairs, so the TachiyomiJ2K fork derives its scale rather than copying hexes.

The chrome rule lands on one line in `themes.xml`: `colorSurface` points at `moonlight_background`, so app bars sit flat while the `colorSurfaceContainer*` ramp keeps its steps and dialogs stay lifted. Flattening the `moonlight_surface` color itself would have taken the dialogs down with it.

| Token | Value |
|---|---|
| `moonlight_background` | <span class="hexcell" style="background:#0D0E17;color:#EEEEFA">#0D0E17</span> |
| `moonlight_surface` | <span class="hexcell" style="background:#141726;color:#EEEEFA">#141726</span> |
| `moonlight_primary_variant` | <span class="hexcell" style="background:#1C2033;color:#EEEEFA">#1C2033</span> |
| `moonlight_surface_container_high` | <span class="hexcell" style="background:#252A42;color:#EEEEFA">#252A42</span> |
| `moonlight_surface_container_highest` | <span class="hexcell" style="background:#2F3654;color:#EEEEFA">#2F3654</span> |
| `moonlight_on_background` | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> |
| `moonlight_action_bar_text` | <span class="hexcell" style="background:#EEEEFA;color:#0D0E17">#EEEEFA</span> |
| `moonlight_primary` | <span class="hexcell" style="background:#A2B0EA;color:#0D0E17">#A2B0EA</span> |
| `moonlight_secondary` | <span class="hexcell" style="background:#7386D0;color:#0D0E17">#7386D0</span> |
| `moonlight_secondary_variant` | <span class="hexcell" style="background:#252A42;color:#EEEEFA">#252A42</span> |
| `moonlight_tab_bar_icon_inactive` | <span class="hexcell" style="background:#7E86A4;color:#0D0E17">#7E86A4</span> |

## Syntax

26 roles from the VS Code theme's `tokenColors`. Semantic tokens resolve to the same values, so there is one list, not two.

```python
# Comments and annotations
@dataclass  # decorator
class MoonlightPalette:  # class name
    """Docstrings and strings look like this."""
    accent: str = "#7386D0"        # string literal
    steps: int = 12                # numeric literal

    def nearest_role(self, hex_value):  # function definition
        if hex_value in KNOWN_ROLES:   # keyword + operator
            return KNOWN_ROLES[hex_value]
        return None
```

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#9BA3C4"></span> | `#9BA3C4` | Comments and annotations |
| <span class="swatch-dot" style="background:#CDCFE7"></span> | `#CDCFE7` | Type hints and separators |
| <span class="swatch-dot" style="background:#B0B9E5"></span> | `#B0B9E5` | Functions and types |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `#ACB9E6` | Markdown formatting |
| <span class="swatch-dot" style="background:#9CB6ED"></span> | `#9CB6ED` | Classes and decorators |
| <span class="swatch-dot" style="background:#97B7FA"></span> | `#97B7FA` | SQL keywords, member variables |
| <span class="swatch-dot" style="background:#A5CFFF"></span> | `#A5CFFF` | Strings, docstrings, regex |
| <span class="swatch-dot" style="background:#78A1FA"></span> | `#78A1FA` | Member access, object properties |
| <span class="swatch-dot" style="background:#7386D0"></span> | `#7386D0` | Keywords, operators, commands, links, builtin functions |
| <span class="swatch-dot" style="background:#B0C8FF"></span> | `#B0C8FF` | Numeric literals |
| <span class="swatch-dot" style="background:#79C0FF"></span> | `#79C0FF` | Headings, `self`, dunders |
| <span class="swatch-dot" style="background:#49EF95"></span> | `#49EF95` | Diff insertions |
| <span class="swatch-dot" style="background:#F2B199"></span> | `#F2B199` | Diff modifications |
| <span class="swatch-dot" style="background:#FFAFAF"></span> | `#FFAFAF` | Parameters, attributes, inheritance |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `#CA5F71` | Diff deletions |
| <span class="swatch-dot" style="background:#C9A0EE"></span> | `#C9A0EE` | String quotes, delimiters, escapes, f/r-string prefixes |
| <span class="swatch-dot" style="background:#F279B2"></span> | `#F279B2` | Uppercase constants |
| <span class="swatch-dot" style="background:#FF98BA"></span> | `#FF98BA` | Symbolic values |
| <span class="swatch-dot" style="background:#FDBAF2"></span> | `#FDBAF2` | References, namespaces |
| <span class="swatch-dot" style="background:#EEEEFA"></span> | `#EEEEFA` | Accessed variables |
| <span class="swatch-dot" style="background:#B58EE8"></span> | `#B58EE8` | Declarations |
| <span class="swatch-dot" style="background:#A5A1E9"></span> | `#A5A1E9` | Punctuation, storage types |
| <span class="swatch-dot" style="background:#D388F0"></span> | `#D388F0` | Config variables |
| <span class="swatch-dot" style="background:#D8A8F0"></span> | `#D8A8F0` | Constants, enums |
| <span class="swatch-dot" style="background:#CED9FF"></span> | `#CED9FF` | Enum members |
| <span class="swatch-dot" style="background:#698CFF"></span> | `#698CFF` | Method calls |

Bracket pairs cycle through six, then the error color when unmatched:

<div class="palette-swatch-row">
<span class="palette-swatch" style="background:#8A9BE0;color:#0D0E17">1 · #8A9BE0</span>
<span class="palette-swatch" style="background:#7386D0">2 · #7386D0</span>
<span class="palette-swatch" style="background:#B86CB3">3 · #B86CB3</span>
<span class="palette-swatch" style="background:#FF72B0;color:#0D0E17">4 · #FF72B0</span>
<span class="palette-swatch" style="background:#DBB060;color:#0D0E17">5 · #DBB060</span>
<span class="palette-swatch" style="background:#43C97F;color:#0D0E17">6 · #43C97F</span>
<span class="palette-swatch" style="background:#CA5F71">unmatched · #CA5F71</span>
</div>

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

## Mermaid

Named hues for flowchart, pie and sequence coloring. Tint and mid-tone arrays derive from these, so a new chart type inherits the family. Full gallery: [every Mermaid diagram in Moonlight](mermaid-examples.md).

| Swatch | Hex | Role |
|---|---|---|
| <span class="swatch-dot" style="background:#0D0E17"></span> | `#0D0E17` | `bg` |
| <span class="swatch-dot" style="background:#141726"></span> | `#141726` | `card` |
| <span class="swatch-dot" style="background:#EEEEFA"></span> | `#EEEEFA` | `text` |
| <span class="swatch-dot" style="background:#7386D0"></span> | `#7386D0` | `primary` |
| <span class="swatch-dot" style="background:#8A9BE0"></span> | `#8A9BE0` | `blue` |
| <span class="swatch-dot" style="background:#A2B0EA"></span> | `#A2B0EA` | `sky` |
| <span class="swatch-dot" style="background:#B9C6F5"></span> | `#B9C6F5` | `azure` |
| <span class="swatch-dot" style="background:#ACB9E6"></span> | `#ACB9E6` | `lavender` |
| <span class="swatch-dot" style="background:#A5A1E9"></span> | `#A5A1E9` | `violet` |
| <span class="swatch-dot" style="background:#B86CB3"></span> | `#B86CB3` | `pink` |
| <span class="swatch-dot" style="background:#CA5FA6"></span> | `#CA5FA6` | `magenta` |
| <span class="swatch-dot" style="background:#CA5F71"></span> | `#CA5F71` | `red` |
| <span class="swatch-dot" style="background:#49EF95"></span> | `#49EF95` | `green` |
| <span class="swatch-dot" style="background:#99E6B3"></span> | `#99E6B3` | `mint` |
| <span class="swatch-dot" style="background:#FFCB6B"></span> | `#FFCB6B` | `yellow` |

## Porting it somewhere new

1. Read [`moonlight-tokens.json`](../assets/moonlight-tokens.json), not a screenshot of another port.
2. Map the target's vocabulary onto these roles first. Most systems need three surface levels, not four.
3. Need a role that does not exist? Derive it in OKLCH from the nearest one: same hue and chroma, move L. New hues only for genuinely new kinds of thing.
4. Measure every text-on-surface pair in the target, on the surface it actually renders on, not just on the canvas. This is the step that gets skipped.
5. A shared role changes on this page first, then `just tokens`, then the ports.

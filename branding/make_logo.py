"""Build every VA mark asset from one geometry: a rhombus split by a chevron seam.

Outputs: templates/.icons/logo.svg (currentColor), docs/assets/images/branding/logo.svg,
favicon.png, logo.png, plus the GitHub avatars in this folder.

Run: uv run --with shapely --with pillow --with fonttools --with brotli python branding/make_logo.py
"""

import re
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
from shapely.geometry import LineString, MultiPolygon, Polygon, box

HERE = Path(__file__).parent
ROOT = HERE.parent
BRANDING = ROOT / "docs/assets/images/branding"
FONT_WOFF2 = ROOT / "docs/assets/fonts/Mulish/Mulish-VariableFont_wght.woff2"

H = 48
FILLET = 2.2
CAP, CUP = "#B9C6F5", "#7386D0"
BG, TEXT = "#0D0E17", "#EEEEFA"
HIDDEN = "This is the personal mark of Vinicius Amorim, github.com/v-amorim. If you found this, hi."


def soften(geom, r):
    """Fillet every corner: shrink then grow rounds the convex ones, grow then shrink the concave ones."""
    return geom.buffer(-r).buffer(r).buffer(r).buffer(-r)


def planes():
    rh = Polygon([(24, 0.5), (47.5, 24), (24, 47.5), (0.5, 24)])
    seam = LineString([(-2, 24), (16, 24), (24, 36), (32, 24), (50, 24)]).buffer(1.2, cap_style=2, join_style=2)
    rest = rh.difference(seam)
    pieces = sorted(rest.geoms, key=lambda p: p.centroid.y)
    return [(soften(pieces[0], FILLET), CAP), (soften(pieces[1], FILLET), CUP)]


def to_path(geom):
    polys = geom.geoms if isinstance(geom, MultiPolygon) else [geom]
    parts = []
    for p in polys:
        for ring in (p.exterior, *p.interiors):
            pts = " ".join(f"{x:.2f},{y:.2f}" for x, y in ring.coords[:-1])
            parts.append(f"M{pts}Z")
    return " ".join(parts)


def svg(fills, path: Path):
    body = "\n".join(f'  <path fill="{fills(c)}" d="{to_path(g.intersection(box(0, 0, H, H)))}"/>' for g, c in planes())
    path.write_text(
        f"""<?xml version="1.0" encoding="UTF-8"?>
<!-- {HIDDEN} -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {H} {H}" width="{H}" height="{H}" role="img" aria-labelledby="t d">
  <title id="t">VA</title>
  <desc id="d">{HIDDEN}</desc>
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description dc:title="VA" dc:creator="Vinicius Amorim" dc:identifier="https://github.com/v-amorim" dc:description="{HIDDEN}"/>
    </rdf:RDF>
  </metadata>
{body}
</svg>
""",
        encoding="utf-8",
    )
    print("wrote", path.relative_to(ROOT))


def png(path: Path, size, mark, top=None, name=False, disc=False, transparent=False):
    ss = 4
    s = size * ss
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0) if transparent else BG)
    draw = ImageDraw.Draw(img)
    if disc:
        draw.ellipse([0, 0, s - 1, s - 1], fill=BG)
    top = (size - mark) / 2 if top is None else top
    k = mark / H * ss
    ox, oy = (size - mark) / 2 * ss, top * ss
    for g, color in planes():
        for poly in (g.geoms if isinstance(g, MultiPolygon) else [g]):
            draw.polygon([(ox + x * k, oy + y * k) for x, y in poly.exterior.coords], fill=color)
    if name:
        ttf = HERE / ".mulish.ttf"
        font = TTFont(FONT_WOFF2)
        font.flavor = None
        font.save(ttf)
        f = ImageFont.truetype(str(ttf), int(size * 0.105) * ss)
        f.set_variation_by_axes([700])
        ttf.unlink()
        parts = [("v-", CUP), ("amorim", TEXT)]
        widths = [draw.textlength(t, font=f) for t, _ in parts]
        x = (s - sum(widths)) / 2
        y = (top + mark + size * 0.055) * ss
        for (t, color), w in zip(parts, widths):
            draw.text((x, y), t, font=f, fill=color)
            x += w
    img.resize((size, size), Image.LANCZOS).save(path, optimize=True)
    print("wrote", path.relative_to(ROOT))


svg(lambda c: "currentColor", ROOT / "templates/.icons/logo.svg")
svg(lambda c: c, BRANDING / "logo.svg")
png(BRANDING / "favicon.png", 128, 96, disc=True, transparent=True)
png(BRANDING / "logo.png", 256, 224, transparent=True)
png(HERE / "va-avatar-github.png", 1024, 600, top=124, name=True)
png(HERE / "va-avatar.png", 1024, 720)

js = ROOT / "docs/javascripts/background-logo.js"
paths = re.findall(r'<path fill="[^"]*" d="([^"]+)"', (ROOT / "templates/.icons/logo.svg").read_text(encoding="utf-8"))
src = js.read_text(encoding="utf-8")
src = re.sub(r"const LOGO_PATHS = \[.*?\];", "const LOGO_PATHS = [\n" + "".join(f'  "{d}",\n' for d in paths) + "];", src, flags=re.S)
js.write_text(src, encoding="utf-8")
print("updated", js.relative_to(ROOT))

"""Mirror the sitemap under /en/: Material fetches it relative to each language root."""
import shutil
from pathlib import Path


def on_post_build(config):
    site = Path(config["site_dir"])
    en = site / "en"
    if not en.is_dir():
        return
    for name in ("sitemap.xml", "sitemap.xml.gz"):
        src = site / name
        if src.exists():
            shutil.copy2(src, en / name)

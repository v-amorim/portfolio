"""Fail the build when a Material upgrade changes the header partial that templates/partials/header.html copies."""
import hashlib
from pathlib import Path

import material
from mkdocs.exceptions import PluginError

# sha256 of material/templates/partials/header.html in mkdocs-material 9.7.6
COPIED_FROM = "8cf3fb15bcf969ff596649616fd99366b3c31c08d57a86d05308efc16d8fa75f"


def on_config(config):
    upstream = Path(material.__file__).parent / "templates" / "partials" / "header.html"
    if hashlib.sha256(upstream.read_bytes()).hexdigest() != COPIED_FROM:
        raise PluginError(
            f"Material's header partial changed ({upstream}). Port the change into "
            "templates/partials/header.html, then update COPIED_FROM in hooks/header_guard.py."
        )

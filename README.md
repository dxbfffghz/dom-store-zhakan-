# dom-store-zhakan

**Lab 5 — DOM, events, forms**
Author: Akerke Zhakan
Live: https://dxbfffghz.github.io/dom-store-zhakan/

An interactive product list built with pure JavaScript and the DOM API.
No frameworks — only `document`, `addEventListener`, and my own `Store`
class carried over from Lab 4.

## How to open

The project uses ES modules (`<script type="module">`), so it must be
served over HTTP, not opened as `file://`.

Easiest way — VS Code + Live Server:

1. Install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.

Or with Python:

```bash
python -m http.server 8000
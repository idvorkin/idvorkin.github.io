# Editing Floating and Zooming

This is a hand-off for whichever agent picks it up next. The explainer lives in the blog repo as one static page: `floating-zooming/app.html` (Jekyll front matter `layout: empty`, permalink `/floating-zooming/app.html`) plus felt sprites in `floating-zooming/art/`. There's no build step beyond Jekyll copying it. Readers see it inside the post `_d/staying-afloat.md` (https://idvork.in/staying-afloat), which iframes it twice: `?embed=float` shows only Part 1's scene and panel, `?embed=zoom` only Part 2's interactive. The post carries the prose, so prose edits go there. `/floating-zooming/`, `/floating` and `/zooming` redirect to the post. Embed-mode rules are under `/* ---- embed mode` in the stylesheet; check any layout change at both iframe widths (about 360px on a phone, about 800px on desktop). `app.html` is in `.prettierignore` so the hook can't reformat its 2,000 lines. This file has no front matter, so Jekyll copies it as-is rather than rendering it.

## Ground rules from Igor (keep these)

- **Two separate ideas, never blended.** Part 1 _Floating_ is about coping capacity: balloons, weights, water. Part 2 _Zooming_ is about how pain narrows attention, and how to widen it again. They're linked as a series and nothing more.
- **Weights are named things, not "not X".** For example "anger" and "debt", not "people not liking me". Balloons and weights are separate: cutting a weight doesn't add a balloon.
- **Sleep matters most.** Its dial has `power: 2.5` and the sprite grows (`grow`).
- **Dials:** Sleep, Friends, Family time (how much time you spend with them), Moving. Each dial is a weight at one end and a balloon at the other.
- **Stress tolerance** is the only thing that moves the water. It's one slider at the top of the sidebar. Igor rejected a "where panic sets in" control as complexity for nothing.
- **Felt raccoon art only.** No vector people. His shirt reads "THIS TOO SHALL PASS".
- **Game feel matters**, and sound is off by default. Removing a balloon pops it, removing a weight lets it go into the sea, and scissors cut strings or chains.

## Where things live in `app.html`

| What                                                                | Search for                                                     |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Sprite config (figure, balloons, weights, chain, ring, water)       | `var ART = {` and `var FIGURES = {`                            |
| Raccoon anchors (paws, feet, head, face points for expressions)     | `FIGURES.A2` (sprite pixels; the code converts to scene units) |
| Items: dials and toggles (labels, sizes, colors, power)             | `var DIALS = [` / `var TOGGLES = [`                            |
| Height math (lift − load → feet height, sink depth)                 | `var net = lift - load;` and `var shown =`                     |
| Zones (thriving / coping / barely coping / overwhelmed)             | `function zoneOf` and `buildZones`                             |
| Camera (keeps water in frame, zooms out up to 1.4× before cropping) | `// the water (and the overwhelmed tag) is always in frame`    |
| Raccoon alive: breathing, trembling, sweat, face mood               | `function alive(` and the `#face` CSS                          |
| Overwhelmed gasp cycle                                              | `// overwhelmed: he doesn't just sit under`                    |
| Weight pendulum swing                                               | `// a pendulum on its drop`                                    |
| In-scene controls: hold to pump, drag to flip, tray, scissors       | `// ---------- inline controls`, `renderTray`, `$('scissors')` |
| Pop and let go                                                      | `function popBalloon`, `n.fall`, `n.fly`                       |
| Layout: sticky scene + side panel (≥1024px), sticky scene on phone  | `/* ---- inline controls: sticky scene + side panel`           |

## Pending

- **Felt scared-face sprite.** The code is ready: add `scared: 'art/floating-A2-scared.webp'` to `FIGURES.A2` and it swaps in when he's overwhelmed. Make the sprite with the `gen-image` skill (Muse Image, image edit of `art/floating-A2.webp`, face only, same pose and framing, 677×1024, feet at about (316,1010), raised paw at about (565,205)). The inputs are prepared on the MacBook Air in `~/tmp/agent/image/raccoon-scared/` (`ref-green.png`, `prompt.txt`). It was blocked on 2026-11-08 because the OpenRouter key's own limit ($40) is nearly used up; raise the key limit, not the account balance. Until then a hand-drawn felt overlay (`#face`) shows the moods.
- **Cross-links** to the post live in `/explainers` (table row), `/act` § "3. Present: notice X" and `/anxiety` § "Perspective".

## How to check a change

1. Run `just jekyll-serve` and open `/staying-afloat` (embedded) or `/floating-zooming/app.html` (standalone), or open `floating-zooming/app.html` directly (file:// works, but skip the front-matter lines), or review with Lavish: `lavish-axi app.html`, then `lavish-axi poll app.html --agent-reply "..."` after every change so the board never goes deaf.
2. Playwright smoke test: load the page, scroll to `#float-wrap`, and check there are no `pageerror`s and no horizontal overflow at 1440×900 and 390×844. Useful selectors: `#zone-val` (current zone, hidden but kept updated), `#dial-sleep` … `#dial-moving`, `#tolerance`, `#preset-both` / `#preset-neither` / `#preset-reset`, toggle buttons by accessible name (for example `^pain,`), `#tray .spare`, `#scissors`, `#face[data-mood]`.
3. Screenshot `#float-figure` in these states: default, everything on (`#preset-both`), every weight on with sleep at −3 (overwhelmed: he should gasp up and sink), and low tolerance.

Respect `prefers-reduced-motion`. Every animation has a reduced-motion path, so keep it that way.

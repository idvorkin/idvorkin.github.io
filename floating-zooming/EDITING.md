# Editing Floating and Zooming

This is a hand-off for whichever agent picks it up next. The explainer lives in the blog repo as one static page: `floating-zooming/app.html` (Jekyll front matter `layout: empty`, permalink `/floating-zooming/app.html`) plus felt sprites in `floating-zooming/art/`. There's no build step beyond Jekyll copying it. Readers see it inside the post `_d/staying-afloat.md` (https://idvork.in/staying-afloat), which iframes `?embed=float` (Part 1's scene and panel only). Zooming was cut from the post on 2026-11-09 (Igor: "get rid of the whole Zoom thing"); its code and `?embed=zoom` still work in `app.html` but nothing embeds them. The post carries the prose, so prose edits go there. `/floating-zooming/`, `/floating` and `/zooming` redirect to the post. Embed-mode rules are under `/* ---- embed mode` in the stylesheet.

**Embed contract (touch-first).** The iframe never scrolls by itself: a nested scroller traps a finger's swipe. The embed posts `{afloat: 'height', h}` and the post's inline script sizes the iframe to fit. The post calls `iframe.contentWindow.afloatView(top, vh)` straight from its scroll handler (same origin). Don't turn that back into a `postMessage`: a message lands a frame late and the scene shudders by the scroll distance on every frame. `fitScene()` in the embed script sizes the scene from that viewport height: as wide as the column, no taller than one screen less the strips, capped at 680px, and it sets `.narrow` on the figure (480-wide framing, bigger labels) when the scene is drawn under 500px wide. Size things there, never by `100vh` or a viewport media query (inside a fit-to-content iframe `100vh` is the whole iframe, and an iPad's scene beside its controls is phone-sized). Under `(pointer: coarse)` every control is at least 44px.

**Default view is the picture and the two strips, nothing else** (Igor, 2026-11-09: "get rid of all those controls or hide behind advanced"). Everything else is in the `#more` disclosure, "More controls", closed in the embed and open standalone: presets, stress tolerance, dials, the balloon and weight chips, Add your own, Sound. Closed, the scene is centered and fills one screen. Open, the controls sit beside the scene from a 660px column (`.side`), else under it while the scene follows the reader down them (`follow()`, capped at half the screen so controls stay visible). The how-to is a caption under the scene, not an overlay.

**Before shipping a layout change**, run Playwright passes with touch emulation at 390x844, 844x390, 820x1180 and 1180x820: tap a tag in each strip, hold to pump, drag to flip, scissors, open More controls, slider drag, and a swipe on the scene and on the panel must scroll the page. Drive fingers with CDP `Input.dispatchTouchEvent` (headless ignores `Input.synthesizeScrollGesture`), and hide `#dev-info-banner` on the local server, which sits over the top of the scene. Screenshots stall frames, so don't count them as jank. `app.html` is in `.prettierignore` so the hook can't reformat its 2,000 lines. This file has no front matter, so Jekyll copies it as-is rather than rendering it.

## Ground rules from Igor (keep these)

- **Two separate ideas, never blended.** Part 1 _Floating_ is about coping capacity: balloons, weights, water. Part 2 _Zooming_ is about how pain narrows attention, and how to widen it again. They're linked as a series and nothing more.
- **Weights are named things, not "not X".** For example "anger" and "debt", not "people not liking me". Balloons and weights are separate: cutting a weight doesn't add a balloon.
- **Sleep matters most.** Its dial has `power: 2.5` and the sprite grows (`grow`).
- **Dials:** Sleep, Friends, Family time (how much time you spend with them), Moving. Each dial is a weight at one end and a balloon at the other.
- **Stress tolerance** is the only thing that moves the water. It's one slider at the top of the sidebar. Igor rejected a "where panic sets in" control as complexity for nothing.
- **Felt raccoon art only.** No vector people. His shirt reads "THIS TOO SHALL PASS".
- **Game feel matters**, and sound is off by default. Removing a balloon pops it, removing a weight lets it go into the sea, and scissors cut strings or chains.
- **Nothing covers the scene.** The waterline and the water are the point of the picture, so spare items live in felt strips that frame the scene, never in an overlay (Igor, 2026-11-09: "I can't see the water because of that overlay"). The strips are one row and a fixed height, so adding a tag never moves the scene; a long row scrolls sideways.
- **Good things on top, weights below.** The top strip holds the tools (scissors, balloon pump) and the spare balloons; the bottom strip, under the water, holds the spare weights (Igor: "positive ideas on top just like -ones are on the bottom"). A dial is one thing that's either a balloon or a weight, so its tag waits in the strip it isn't in the scene from: with the sleep balloon up, "bad sleep" is in the bottom strip, and tapping it there takes the balloon away and hangs the weight (Igor, 2026-11-09: "if you add on bottom it takes from top and you can flip it"). Off altogether, it's in both strips. Dropping anything into either strip takes it off.
- **The raccoon never leaves the frame** (Igor, 2026-11-09: "make sure guy never leaves the screen"). `frame()` clamps the camera to him after easing it, and that wins over keeping the water or the balloon tops in view. Don't put a CSS transition on `#floater`: its transform is rewritten every frame, so a transition makes him trail his own position and drift out of the frame.
- **The pump is a tool, not a gesture.** Tap it to arm it (it glows), then tap or hold balloons to pump them; tap it again or press Escape to put it down. Dragging the pump onto a balloon pumps that one once. Holding a balloon still pumps it too.

## Where things live in `app.html`

| What                                                                | Search for                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Sprite config (figure, balloons, weights, chain, ring, water)       | `var ART = {` and `var FIGURES = {`                                       |
| Raccoon anchors (paws, feet, head, face points for expressions)     | `FIGURES.A2` (sprite pixels; the code converts to scene units)            |
| Items: dials and toggles (labels, sizes, colors, power)             | `var DIALS = [` / `var TOGGLES = [`                                       |
| Height math (lift − load → feet height, sink depth)                 | `var net = lift - load;` and `var shown =`                                |
| Zones (thriving / coping / barely coping / overwhelmed)             | `function zoneOf` and `buildZones`                                        |
| Camera (keeps water in frame, zooms out up to 1.4× before cropping) | `// the water (and the overwhelmed tag) is always in frame`               |
| Raccoon alive: breathing, trembling, sweat, face mood               | `function alive(` and the `#face` CSS                                     |
| Overwhelmed gasp cycle                                              | `// overwhelmed: he doesn't just sit under`                               |
| Weight pendulum swing                                               | `// a pendulum on its drop`                                               |
| Controls: hold to pump, drag to flip, strips, scissors, pump        | `// ---------- inline controls`, `renderTray`, `$('scissors')`, `pumpBtn` |
| Pop and let go                                                      | `function popBalloon`, `n.fall`, `n.fly`                                  |
| Layout: sticky scene + side panel (≥1024px), sticky scene on phone  | `/* ---- inline controls: sticky scene + side panel`                      |
| Embed layout: scene size, More controls, following the scroll       | `function fitScene`, `function follow`, `window.afloatView`               |

## Pending

- **Felt scared-face sprite.** The code is ready: add `scared: 'art/floating-A2-scared.webp'` to `FIGURES.A2` and it swaps in when he's overwhelmed. Make the sprite with the `gen-image` skill (Muse Image, image edit of `art/floating-A2.webp`, face only, same pose and framing, 677×1024, feet at about (316,1010), raised paw at about (565,205)). The inputs are prepared on the MacBook Air in `~/tmp/agent/image/raccoon-scared/` (`ref-green.png`, `prompt.txt`). It was blocked on 2026-11-08 because the OpenRouter key's own limit ($40) is nearly used up; raise the key limit, not the account balance. Until then a hand-drawn felt overlay (`#face`) shows the moods.
- **Cross-links** to the post live in `/explainers` (table row). The `/act` and `/anxiety` links pointed at Zooming and were dropped with it.

## How to check a change

1. Run `just jekyll-serve` and open `/staying-afloat` (embedded) or `/floating-zooming/app.html` (standalone), or open `floating-zooming/app.html` directly (file:// works, but skip the front-matter lines), or review with Lavish: `lavish-axi app.html`, then `lavish-axi poll app.html --agent-reply "..."` after every change so the board never goes deaf.
2. Playwright smoke test: load the page, scroll to `#float-wrap`, and check there are no `pageerror`s and no horizontal overflow at 1440×900 and 390×844. Useful selectors: `#zone-val` (current zone, hidden but kept updated), `#dial-sleep` … `#dial-moving`, `#tolerance`, `#preset-both` / `#preset-neither` / `#preset-reset`, toggle buttons by accessible name (for example `^pain,`), `#tray-up .spare` (balloons), `#tray .spare` (weights), `#scissors`, `#pump`, `#more > summary` (open it before touching anything in the panel), `#face[data-mood]`.
3. Screenshot `#float-figure` in these states: default, everything on (`#preset-both`), every weight on with sleep at −3 (overwhelmed: he should gasp up and sink), and low tolerance.

Respect `prefers-reduced-motion`. Every animation has a reduced-motion path, so keep it that way.

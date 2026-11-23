# Den #18 "Marco": shot list

Each panel is the END of an action. Paths are in the run dir; the prompts are
in `prompts/`. All in-betweens are on Kling v3 Std, each chained through a Muse
midpoint (`prompts/mid-*.txt`). Final cut:

```text
stitch.sh final/den-018-marco-inbetweens-360p.mp4 reveal/p1.mp4@0:5.1 +0.25 bridges/b12a.mp4 bridges/b12b.mp4@0:2.5 +0.15 reveal/p2.mp4@0:3.1 bridges/b23b.mp4@0:2.6 +0.15 reveal/p3.mp4@0.45:6.1 +0.25 bridges/b34a.mp4 bridges/b34b.mp4@0:2.0 +0.15 reveal/p4.mp4
```

## P1 → P2: the drip

- **In the picture (P2):** Igor is back on the stairs, pointing. A long drip of blue paint has run from the robot's brush down the easel into a small puddle.
- **Action that made it:** Igor steps back up the stairs and points. The drip slides down the easel leg and plops onto the rug.
- **Render:** `b12a` covers the camera move and Igor's walk. `b12b` is the drip landing; it's small at 360p, so it's trimmed to 2.5 s.

## P2 → P3: Igor crosses the room

- **In the picture (P3):** Igor is at the armchair with his paws clasped; the puddle is wider.
- **Action that made it:** Igor walks over while the puddle spreads.
- **Render:** `b23a` was dropped: Igor walked out of frame to the right and came back in from the left. Instead, the video hard cuts from P2 to `b23b`, which is Igor walking in from the left. A cut on the action is fine.

## P3 → P4: the flood

- **In the picture (P4):** a blue pool covers the whole floor, with the armchair standing in it. Igor sits atop a white lifeguard chair, in a visor and whistle.
- **Action that made it:** the paint floods across the attic and Igor climbs the lifeguard chair. This is the gag, so it gets the full clip.
- **Render:** `b34a` covers the flood plus the climb, with a fast camera move to P4's framing. `b34b` is the last rungs, trimmed to 2 s.

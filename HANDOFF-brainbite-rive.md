# Handoff: Brainbite Rive Case Study Update

## Branch

We are working on branch **`codex/rive-viewer-enhancements`** (based on commit `a1bf9cf "made SEO changes"`). All work below is **uncommitted**.

## What was done

Implemented the Brainbite Rive case study plan: replaced the single mascot demo with a 4-tab interactive showcase, in both the homepage overlay (`CaseStudyOverlay`) and the standalone `/work/brainbite` page.

### Files changed (uncommitted)

- **`data/portfolio.ts`** — Replaced the `mascot` object with `riveShowcase: RiveShowcaseEntry[]`. Added types `RiveShowcaseEntry` (`kind: "rive" | "video"`, optional `artboard`, `artboards`, `stateMachine`, `inputs`), `RiveBooleanInput`, and `RiveTriggerInput` (`fireIcon?`). The four entries are:
  1. **Character animations** — `steveirwin.riv`, state machine `IdleTalkingLogic`, boolean `isTalking` (labeled "switch states").
  2. **Celebration screens** — `brainbite-highscore.mp4` rendered as a video (no Rive file exists, per user).
  3. **Mini-games and quizzes** — `bleumonk__the_clarifying_question.riv`, artboard `Sequence`, state machine `State Machine 1`, booleans `firstAnswered`, `secondAnswered`, `thirdAnswered`, `fourthAnswered`, `successfulCompletion`, plus trigger `nextSequence` shown as a fire-icon button.
  4. **Game assets** — `coins.riv` rendered as an all-artboards grid: `BronzeCoin`, `EmptyCoin`, `PurpleCoin`, `SilverCoin`, `ProgressCoinV2`, `GreyCoin`, `ProgressCoinCustom`, `GoldCoin`.
- **`components/RiveShowcase.tsx`** (new) — Generic client-side showcase component: tab bar, video preview, single-artboard view with play/stop plus boolean toggle chips and trigger fire button, and an all-artboards grid. Uses `useRive` / `useStateMachineInput` from `@rive-app/react-canvas` with the `Rive` type (lint enforces no `any`).
- **`components/CaseStudyOverlay.tsx`** — Swapped `RiveMascotDemo` import for `RiveShowcase`; the mascot section is now `.brainbite-rive-showcase-section` rendering `caseStudy.riveShowcase`.
- **`app/work/[slug]/page.tsx`** — Added `RiveShowcase` import and a `<div className="work-rive-showcase">` block under the "Animation of learning mascots" section.
- **`components/RiveMascotDemo.tsx`** — **DELETED** (orphaned).
- **`app/globals.css`** — Styles for `.rive-showcase` restyled to match the Figma design: `#f5f5f5` container (24px radius, 604px min-height), orange (`#f77916`) active pill tab, black `415×400px` preview panel with the Figma drop-shadow, bordered control chips, responsive `1100px`/`767px` (select-dropdown on mobile), and `.work-rive-showcase` simplified. Removed unused `.brainbite-mascot-*` / `.rive-mascot-*` rules.
- **`public/assets/bleumonk__the_clarifying_question.riv`** — Copied from `~/Documents/`.
- **`public/assets/coins.riv`** — Copied from `~/Documents/Rive Animations/`.

### Verification status

- `npm run typecheck` passes.
- `npm run lint` passes.
- Dev server was running on http://localhost:3000 (background task `s6z4r7iyb`) — restart with `npm run dev` if it is no longer up.

## Open threads / next steps

1. **Figma visual check COMPLETE** — the tabbed showcase layout has been matched against the Figma "better Rive preview" design (https://www.figma.com/design/Q6mNGqv0GGV3AkE0onPPwY/Portfolio-2.0?node-id=115-348) and verified via headless Chrome computed styles (all tokens match).
2. **All Rive previews verified working** — character animations (state machine plays), celebration video, bleumonk mini-games (all inputs + trigger), and game assets grid (all 8 coins render).
3. **Bleumonk state machine fixed** — now `"Master sequence"` (was `"State Machine 1"`). Artboard is `"Sequence"` (already correct).
4. **`components/RiveMascotDemo.tsx` DELETED** — was orphaned; superseded by `RiveShowcase`.
5. **Unused CSS cleaned up** — `.brainbite-mascot-*` and `.rive-mascot-*` rules removed from `globals.css`.
6. **Design tokens matched** — showcase container `#f5f5f5`/24px radius/604px min-height; active tab `#f77916` pill; preview panel black 415×400px with the Figma drop-shadow; controls as bordered chips.

## Post-review fixes (user feedback round 2)

1. **Black preview box removed** — the black `415×400px` panel was a Figma placeholder. Previews now render directly in the `#f5f5f5` showcase container at full size (artboard-sized via `fitCanvasToArtboardHeight`, max-height 520px).
2. **Character animations autoplay on scroll** — `SingleArtboardView` uses an IntersectionObserver: ~2s after the preview scrolls ≥60% into view it calls `rive.play(stateMachine)` and flips the button to "stop".
3. **Mini-games lag debugged & fixed** — root cause: the data referenced state-machine inputs (`firstAnswered`, `secondAnswered`, `thirdAnswered`, `fourthAnswered`, `successfulCompletion`, `nextSequence`) that **do not exist on the `Sequence`/`Master sequence` state machine** (they live on nested `Card`/`Button` artboards). With no real inputs, "play" was a no-op and the page felt stuck. Fix: removed the phantom `inputs` from the bleumonk entry so it just renders `Sequence` + `Master sequence` and autoplays on scroll. Verified animating (canvas pixel hash changes) and 60fps.
4. **Game assets shown as a 2-column grid** (not scrollable) — all 8 coins render side-by-side in the gray container with no black box.
5. `useRive` now uses `fitCanvasToArtboardHeight: true` for single-artboard views and coin cards so containers match each artboard's natural aspect ratio (steveirwin 1:1, bleumonk 1.69:1, coins 1:1) without black-letterboxing.

## Assumptions baked into the work

- Bleumonk state machine is `Master sequence` (confirmed via `.riv` binary inspection + user instruction; the handoff originally assumed `State Machine 1`). Artboard is `Sequence`. The `Sequence`/`Master sequence` state machine has **no inputs** — earlier agent's `inputs` data was wrong and has been removed.
- All Bleumonk boolean inputs default to `false`.
- "Mini-games and quizes" is spelled "Mini-games and quizzes".
- Celebration screens use the MP4 video only, with no Rive controls.
- Game-asset coins render via the `Logic` state machine / default animation (all 8 artboards verified rendering).

## Data model reference

```ts
type RiveShowcaseEntry = {
  label: string;
  kind: "rive" | "video";
  src: string;
  artboard?: string;
  artboards?: string[];
  stateMachine?: string;
  inputs?: (
    | { kind: "boolean"; name: string; label?: string }
    | { kind: "trigger"; name: string; label?: string; fireIcon?: boolean }
  )[];
};
```

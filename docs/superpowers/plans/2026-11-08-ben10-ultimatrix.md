# 3D Ben 10 Ultimatrix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive 3D Ben 10 Ultimatrix simulator web application featuring a procedural 3D forearm gauntlet, spring-action pop-up dial, rotating holographic alien selection, slam-down transformation sequence, 4 retractable evolutionary spikes for "Ultimate" mode, synthesized sci-fi audio engine, and sci-fi HUD.

**Architecture:** Client-side 3D web application powered by Vite, TypeScript, Three.js, and Web Audio API. Decoupled into a deterministic finite-state machine (`UltimatrixState`), procedural audio synthesizer (`UltimatrixAudioEngine`), procedural 3D gauntlet scene with bloom shaders (`UltimatrixScene`), and a Galvan holographic HUD overlay (`UltimatrixHUD`).

**Tech Stack:** TypeScript, Vite, Three.js, UnrealBloomPass, Web Audio API, Vitest.

**Spec:** Option 1 (Full Forearm Gauntlet & Transformation Simulator with 3D model, sound, holograms, pop-up core, evolutionary spikes, and transformations).

## Global Constraints
- High-performance 60 FPS WebGL rendering with zero external asset bottlenecks (procedural geometries, shaders, and procedural Web Audio).
- Strict adherence to TypeScript type safety with automated Vitest unit tests covering state machine transitions and alien selection logic.
- Clean responsive layout that runs seamlessly in any modern desktop and mobile browser.

## Review Focus
1. Rapid clicking/toggling state transitions (e.g. popping up dial and slamming it before animation finishes) must not get stuck in invalid states.
2. Web Audio context creation must handle browser autoplay policies gracefully (unlock on first user interaction).
3. Dial rotation wrapping (cycling past first or last alien smoothly without jumps).
4. Ultimate evolution mode toggling (spikes sliding out smoothly and reverting cleanly when de-transforming).
5. Window resize handling without 3D scene distortion or camera aspect ratio breaking.

---

### Task 1: Project Scaffolding, TypeScript, and Test Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/types.ts`
- Test: `tests/setup.test.ts`

- [ ] Initialize `package.json` with dependencies (`three`, `@types/three`, `vite`, `typescript`, `vitest`).
- [ ] Configure `tsconfig.json` for strict TypeScript with ES2022 and modern DOM/WebGL libraries.
- [ ] Configure `vite.config.ts` with test configuration for Vitest.
- [ ] Create basic `index.html` container with canvas and HUD root elements.
- [ ] Define shared TypeScript interfaces in `src/types.ts` (UltimatrixMode, AlienData, StateMachineEvents).
- [ ] Run test suite with Vitest to verify setup passes.
- [ ] Commit initial scaffolding.

---

### Task 2: Deterministic Ultimatrix State Machine & Alien Roster

**Files:**
- Create: `src/core/aliens.ts`
- Create: `src/core/UltimatrixState.ts`
- Test: `tests/UltimatrixState.test.ts`

- [ ] Write failing unit test for `UltimatrixState` checking state transitions (`STANDBY` -> `ACTIVE_SELECTION` -> `TRANSFORMING` -> `TRANSFORMED` -> `ULTIMATE_MODE` -> `COOLDOWN` -> `STANDBY`).
- [ ] Implement `src/core/aliens.ts` with the 6 iconic aliens (Swampfire, Humungousaur, Echo Echo, Big Chill, Cannonbolt, Spidermonkey) and their Ultimate forms, colors, abilities, and SVG/canvas silhouettes.
- [ ] Implement `src/core/UltimatrixState.ts` with state transitions, alien cycling (`nextAlien`, `prevAlien`, `selectAlien`), core pop-up/down events, and ultimate evolution toggle.
- [ ] Run Vitest to verify all state machine tests pass.
- [ ] Commit state machine and alien data.

---

### Task 3: Procedural Web Audio Sound Engine

**Files:**
- Create: `src/audio/SoundEngine.ts`
- Test: `tests/SoundEngine.test.ts`

- [ ] Write unit tests verifying `SoundEngine` can initialize audio nodes (oscillators, biquad filters, gain nodes) without throwing.
- [ ] Implement `SoundEngine` with procedural sound synthesis:
  - `playPopUp()`: Rising metallic chirp with spring resonance.
  - `playDialTurn()`: Sharp mechanical detent click.
  - `playSlam()`: Heavy hydraulic clunk with bass resonance.
  - `playTransform()`: Powerful energy burst with harmonic modulation.
  - `playUltimateEvolve()`: Menacing metallic spike slide clatter followed by high-voltage cosmic thrum.
  - `playTimeout()`: Galvan emergency warning beeps.
  - `startHum()` and `stopHum()`: Ambient idle reactor hum.
- [ ] Run Vitest to verify audio node mock synthesis tests pass.
- [ ] Commit audio engine.

---

### Task 4: 3D Procedural Ultimatrix Gauntlet Mesh & Animations

**Files:**
- Create: `src/three/materials.ts`
- Create: `src/three/UltimatrixMesh.ts`
- Create: `src/three/HologramDisplay.ts`
- Test: `tests/UltimatrixMesh.test.ts`

- [ ] Create procedural PBR materials in `src/three/materials.ts` (brushed metallic gunmetal, luminescent alien green, chrome silver, ruby ultimate red, glowing circuit lines).
- [ ] Implement `UltimatrixMesh.ts`:
  - Forearm gauntlet sleeve with tapered ergonomic shell and wrist latch.
  - Glowing circuit channels along the gauntlet sides.
  - Cylindrical dial housing and beveled bezel with hour marks.
  - Pop-up spring core with interlocked triangles / hourglass crystal emblem.
  - 4 retractable mechanical spikes that extend symmetrically in Ultimate mode.
  - Animation update hooks for core elevation ($0.0$ to $1.0$), spike extension ($0.0$ to $1.0$), and dial rotation ($0$ to $360^\circ$).
- [ ] Implement `HologramDisplay.ts`:
  - 3D floating hologram beam projecting from the core.
  - Procedural wireframe 3D icon / silhouette disk of the active alien.
  - Hologram ring with orbiting particle runes.
- [ ] Write and run tests verifying mesh component hierarchy and animation setters.
- [ ] Commit 3D mesh components.

---

### Task 5: 3D Scene Manager, Camera, Lighting & Bloom Post-Processing

**Files:**
- Create: `src/three/SceneManager.ts`
- Create: `src/main.ts`

- [ ] Implement `SceneManager.ts` encapsulating:
  - Three.js Scene, PerspectiveCamera, WebGLRenderer with tone mapping.
  - Studio HDRI-style 3-point lighting + dynamic green core point light + red ultimate accent lights.
  - Post-processing pipeline with `EffectComposer`, `RenderPass`, and `UnrealBloomPass` for realistic neon glow.
  - Smooth OrbitControls with constrained angles to keep the gauntlet heroically framed.
  - Responsive window resize handling with auto-adjusting aspect ratio and DPR scaling.
  - Camera shake effect during transformation and ultimate evolution.
- [ ] Connect `UltimatrixMesh` and `HologramDisplay` to `SceneManager` animation loop.
- [ ] Wire up `src/main.ts` entry point.
- [ ] Commit scene manager and main initialization.

---

### Task 6: Sci-Fi Galvan HUD Overlay & Interactive Controls

**Files:**
- Create: `src/ui/HUD.ts`
- Create: `src/style.css`

- [ ] Implement `HUD.ts`:
  - Header: Omniverse Galvanic OS status, current mode indicator (STANDBY, ACTIVE, TRANSFORMED, ULTIMATE).
  - Alien holographic selector bar with alien avatars and name tags.
  - Status telemetry display: Alien species, homeworld, powers, and DNA stability bar.
  - Action buttons: "POP UP CORE" / "SLAM DOWN", "EVOLVE TO ULTIMATE", "RECHARGE / TIMEOUT", "SOUND ON/OFF", "FULLSCREEN".
  - Interactive keybind indicators: [Space] to activate/transform, [Left/Right] to cycle, [U] to evolve, [A] for audio.
- [ ] Style with retro-futuristic Ben 10 Galvan neon-green HUD CSS, glassmorphism blur, scanlines, and animated glow borders.
- [ ] Commit HUD implementation.

---

### Task 7: Full Integration, TDD Verification, Polish & CodeRabbit Review

**Files:**
- Modify: `src/main.ts`
- Run: Vitest unit tests suite
- Run: `vite build` production bundle check
- Run: Code review audit

- [ ] Verify full end-to-end integration: clicking dial triggers pop-up, turning dial changes alien silhouette and sounds, slamming dial triggers transformation sequence, clicking ultimate triggers spikes and sound.
- [ ] Execute Vitest test suite and confirm all tests pass cleanly.
- [ ] Execute `npm run build` to confirm zero TypeScript compilation errors and production build bundle succeeds.
- [ ] Perform CodeRabbit / ponytail code review and polish any edge cases.
- [ ] Final commit.

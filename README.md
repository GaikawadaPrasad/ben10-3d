# ⚡ Ben 10 Ultimatrix - 3D Interactive Simulator

An authentic, fully interactive 3D simulator of the **Galvan Ultimatrix** from *Ben 10: Ultimate Alien*, built with Three.js, TypeScript, Vite, UnrealBloomPass post-processing, and procedural Web Audio synthesis.

![Ben 10 Ultimatrix](data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23050807' stroke='%2300ff66' stroke-width='4'/><polygon points='25,25 75,25 50,50' fill='%2300ff66'/><polygon points='25,75 75,75 50,50' fill='%2300ff66'/></svg>)

---

## 🌟 Key Features

### 1. 3D Procedural Gauntlet & Animations
* **Forearm Gauntlet Sleeve**: Tapered ergonomic shell with gunmetal metallic casing, emerald Galvan armor plates, and glowing circuitry channels.
* **Spring-Action Pop-Up Core**: Elevating dial mechanism with the iconic interlocked triangles / hourglass crystal emblem.
* **4 Retractable Ultimate Spikes**: Angled metallic prongs that slide outward around the perimeter when transitioning to Ultimate mode.
* **Holographic Projection Display**: Floating 3D alien wireframe silhouettes, scanline rings, and orbiting Galvan energy particles.
* **Sci-Fi Bloom Post-Processing**: Dynamic UnrealBloomPass neon lighting for the core, circuit lines, and transformation auras.

### 2. Procedural Web Audio Sound Engine
* 100% dependency-free audio synthesis using Web Audio API:
  - Spring-loaded core pop-up chirp
  - Mechanical detent clicks when rotating the alien dial
  - Hydraulic bass thud upon slamming the dial
  - Cinematic transformation energy blast
  - Multi-chord ultimate evolutionary surge with spike extension clatter
  - Galvan emergency cooldown warning pulses
  - Ambient idle extraterrestrial reactor hum

### 3. Alien Roster & Evolutionary Forms
* **Swampfire** ➔ **Ultimate Swampfire** (Methanosian / Blue Plasma Fire & Bio-Napalm)
* **Humungousaur** ➔ **Ultimate Humungousaur** (Vaxasaurian / Bio-Gatling Cannons & Mace Tail)
* **Echo Echo** ➔ **Ultimate Echo Echo** (Sonorosian / Detachable Sonic Doom Discs)
* **Big Chill** ➔ **Ultimate Big Chill** (Necrofriggian / Fire So Cold It Burns)
* **Cannonbolt** ➔ **Ultimate Cannonbolt** (Arburian Pelarota / Spiked Gunmetal Shell)
* **Spidermonkey** ➔ **Ultimate Spidermonkey** (Arachnichimp / 8-Legged Gorilla Bruiser)

---

## 🎮 Controls & Shortcuts

| Action | Control | Description |
| :--- | :--- | :--- |
| **Orbit 3D Camera** | `Click + Drag Canvas` | 360° pan, tilt, and zoom around the gauntlet |
| **3D Direct Interaction** | `Click on Watch/Dial` | Click directly on the 3D model to pop up / slam down / evolve |
| **Pop Up / Slam Dial** | `[SPACE]` or Primary Button | Unlocks core in Standby; Slams down in Selection |
| **Cycle Aliens** | `[←]` / `[→]` or Carousel | Rotates dial and projects holographic alien wireframe |
| **Evolve to Ultimate** | `[U]` or Ultimate Button | Unleashes the 4 evolutionary spikes and cosmic aura |
| **Revert to Ben** | `[R]` or Revert Button | De-transforms back to Standby mode |
| **Toggle Sound** | `[M]` or Audio Icon | Mutes or unmutes synthesized sound effects |
| **Fullscreen** | `[F]` or Fullscreen Icon | Toggles full-screen immersive display |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated unit test suite (Vitest)
npm test

# 4. Build optimized production bundle
npm run build
```

---

## 🏗️ Architecture & Engineering
* **`src/core/UltimatrixState.ts`**: Deterministic finite state machine managing states (`STANDBY`, `ACTIVE_SELECTION`, `TRANSFORMED`, `ULTIMATE_MODE`, `COOLDOWN`).
* **`src/audio/SoundEngine.ts`**: Procedural sound generation without audio file dependencies.
* **`src/three/UltimatrixMesh.ts`**: Custom procedural Three.js geometry, materials, and mechanical animation lerp hooks.
* **`src/three/HologramDisplay.ts`**: 3D holographic wireframes and particle system.
* **`src/three/SceneManager.ts`**: Studio lighting, orbit controls, camera shake, and bloom post-processing.
* **`src/ui/HUD.ts`**: Galvanic OS glassmorphic user interface.

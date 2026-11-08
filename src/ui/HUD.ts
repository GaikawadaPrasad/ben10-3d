import { SoundEngine } from '../audio/SoundEngine';
import { UltimatrixState } from '../core/UltimatrixState';
import { ALIEN_ART } from '../core/alienArt';
import type { UltimatrixStateSnapshot } from '../types';

export class HUD {
  private root: HTMLElement;
  private state: UltimatrixState;
  private soundEngine: SoundEngine;

  private modeBadgeEl!: HTMLElement;
  private hintTextEl!: HTMLElement;
  private alienCardEl!: HTMLElement;
  private alienPortraitEl!: HTMLElement;
  private alienNameEl!: HTMLElement;
  private alienSpeciesEl!: HTMLElement;
  private alienPlanetEl!: HTMLElement;
  private alienDescEl!: HTMLElement;
  private alienAbilitiesEl!: HTMLElement;
  private audioBtn!: HTMLButtonElement;
  private fullscreenBtn!: HTMLButtonElement;
  private flashEl!: HTMLElement;

  constructor(root: HTMLElement, state: UltimatrixState, soundEngine: SoundEngine) {
    this.root = root;
    this.state = state;
    this.soundEngine = soundEngine;

    this.render();
    this.bindEvents();
    this.state.subscribe(this.onStateChange.bind(this));
  }

  private render(): void {
    this.root.innerHTML = `
      <div class="hud-container minimal-hud">
        <!-- Top Bar -->
        <header class="hud-header">
          <div class="hud-brand">
            <div class="omnitrix-logo-icon"></div>
            <div>
              <h1 class="hud-title">ULTIMATRIX</h1>
              <div class="hud-subtitle">GALVAN LEVEL 20 TECH</div>
            </div>
          </div>
          <div class="hud-controls-right">
            <button id="btn-audio" class="hud-btn hud-btn-icon" title="Toggle Sound [M]">
              <span id="audio-icon">🔊</span>
            </button>
            <button id="btn-fullscreen" class="hud-btn hud-btn-icon" title="Fullscreen [F]">
              <span>⛶</span>
            </button>
            <div id="mode-badge" class="mode-badge badge-standby">STANDBY</div>
          </div>
        </header>

        <!-- Center Screen Flare / Shockwave for Transformations -->
        <div id="transform-flash" class="transform-flash"></div>

        <!-- Sleek Floating Alien Info Card (Appears after transformation with full image) -->
        <aside id="alien-card" class="alien-card card-hidden">
          <div class="card-accent-line"></div>
          
          <div class="card-header">
            <span class="dna-code">GENETIC TELEMETRY</span>
            <span id="alien-tag" class="alien-tag">STANDARD</span>
          </div>

          <!-- Alien Holographic Portrait Display -->
          <div class="alien-portrait-container">
            <div class="corner-bracket top-left"></div>
            <div class="corner-bracket top-right"></div>
            <div class="corner-bracket bottom-left"></div>
            <div class="corner-bracket bottom-right"></div>
            <div class="holo-scanline"></div>
            <div id="alien-portrait" class="alien-portrait"></div>
          </div>

          <h2 id="alien-name" class="alien-title">Swampfire</h2>
          
          <div class="alien-meta">
            <div><span class="meta-label">SPECIES:</span> <span id="alien-species">Methanosian</span></div>
            <div><span class="meta-label">PLANET:</span> <span id="alien-planet">Methanos</span></div>
          </div>
          
          <p id="alien-desc" class="alien-desc"></p>
          
          <div class="abilities-section">
            <div class="meta-label">SPECIAL COMBAT POWERS:</div>
            <ul id="alien-abilities" class="abilities-list"></ul>
          </div>
        </aside>

        <!-- Dynamic Contextual Interaction Prompt at Bottom -->
        <footer class="hud-footer-minimal">
          <div id="hud-hint" class="hud-hint-pill">
            <span class="hint-pulse"></span>
            <span id="hint-text">CLICK WATCH TO POP UP CORE • SCROLL MOUSE WHEEL TO CYCLE ALIENS</span>
          </div>
        </footer>
      </div>
    `;

    // Query elements
    this.modeBadgeEl = this.root.querySelector('#mode-badge') as HTMLElement;
    this.hintTextEl = this.root.querySelector('#hint-text') as HTMLElement;
    this.alienCardEl = this.root.querySelector('#alien-card') as HTMLElement;
    this.alienPortraitEl = this.root.querySelector('#alien-portrait') as HTMLElement;
    this.alienNameEl = this.root.querySelector('#alien-name') as HTMLElement;
    this.alienSpeciesEl = this.root.querySelector('#alien-species') as HTMLElement;
    this.alienPlanetEl = this.root.querySelector('#alien-planet') as HTMLElement;
    this.alienDescEl = this.root.querySelector('#alien-desc') as HTMLElement;
    this.alienAbilitiesEl = this.root.querySelector('#alien-abilities') as HTMLElement;
    this.audioBtn = this.root.querySelector('#btn-audio') as HTMLButtonElement;
    this.fullscreenBtn = this.root.querySelector('#btn-fullscreen') as HTMLButtonElement;
    this.flashEl = this.root.querySelector('#transform-flash') as HTMLElement;
  }

  private bindEvents(): void {
    // Audio toggle
    this.audioBtn.addEventListener('click', () => {
      const enabled = this.state.toggleAudio();
      this.soundEngine.setEnabled(enabled);
      const icon = this.root.querySelector('#audio-icon') as HTMLElement;
      icon.textContent = enabled ? '🔊' : '🔇';
    });

    // Fullscreen toggle
    this.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'KeyM') {
        this.audioBtn.click();
      } else if (e.code === 'KeyR') {
        this.soundEngine.playSlam();
        this.triggerFlash('green');
        this.state.detransform();
      } else if (e.code === 'KeyU') {
        const snap = this.state.getSnapshot();
        if (snap.mode === 'TRANSFORMED') {
          this.soundEngine.playUltimateEvolve();
          this.triggerFlash('red');
          this.state.toggleUltimate();
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        const snap = this.state.getSnapshot();
        if (snap.mode === 'STANDBY') {
          this.soundEngine.playPopUp();
          this.state.toggleActivation();
        } else if (snap.mode === 'ACTIVE_SELECTION') {
          this.soundEngine.playSlam();
          this.soundEngine.playTransform();
          this.triggerFlash('green');
          this.state.slamDial();
        } else if (snap.mode === 'TRANSFORMED') {
          this.soundEngine.playUltimateEvolve();
          this.triggerFlash('red');
          this.state.toggleUltimate();
        } else {
          this.soundEngine.playSlam();
          this.state.detransform();
        }
      }
    });
  }

  public triggerFlash(color: 'green' | 'red'): void {
    if (!this.flashEl) return;
    this.flashEl.className = `transform-flash flash-active flash-${color}`;
    setTimeout(() => {
      this.flashEl.className = 'transform-flash';
    }, 450);
  }

  private onStateChange(snapshot: UltimatrixStateSnapshot): void {
    const { mode, selectedAlien, isUltimate } = snapshot;

    // 1. Update Mode Badge
    this.modeBadgeEl.className = `mode-badge badge-${mode.toLowerCase()}`;
    this.modeBadgeEl.textContent = isUltimate ? 'ULTIMATE FORM' : mode.replace('_', ' ');

    // 2. Contextual Interaction Prompt
    if (mode === 'STANDBY') {
      this.hintTextEl.innerHTML = `⚡ <strong>CLICK WATCH</strong> TO POP UP CORE • SCROLL MOUSE WHEEL TO CYCLE ALIENS`;
      this.alienCardEl.classList.add('card-hidden');
    } else if (mode === 'ACTIVE_SELECTION') {
      this.hintTextEl.innerHTML = `🔄 <strong>SCROLL MOUSE WHEEL</strong> TO ROTATE DIAL • ⚡ <strong>CLICK WATCH</strong> TO TRANSFORM INTO <strong>${selectedAlien.name.toUpperCase()}</strong>`;
      this.alienCardEl.classList.add('card-hidden');
    } else if (mode === 'TRANSFORMED') {
      this.hintTextEl.innerHTML = `💥 <strong>TRANSFORMED!</strong> CLICK WATCH TO EVOLVE TO <strong>ULTIMATE</strong> • PRESS [R] TO REVERT`;
      this.alienCardEl.classList.remove('card-hidden');
      this.updateAlienCard(selectedAlien, false);
      this.triggerFlash('green');
    } else if (mode === 'ULTIMATE_MODE') {
      this.hintTextEl.innerHTML = `🔥 <strong>${selectedAlien.ultimateName.toUpperCase()} ACTIVE!</strong> CLICK WATCH OR PRESS [R] TO REVERT`;
      this.alienCardEl.classList.remove('card-hidden');
      this.updateAlienCard(selectedAlien, true);
      this.triggerFlash('red');
    } else if (mode === 'COOLDOWN') {
      this.hintTextEl.innerHTML = `⚠️ <strong>RECHARGING...</strong> (${Math.round(snapshot.cooldownPercent)}%)`;
      this.alienCardEl.classList.add('card-hidden');
    }
  }

  private updateAlienCard(alien: UltimatrixStateSnapshot['selectedAlien'], isUltimate: boolean): void {
    const alienTagEl = this.root.querySelector('#alien-tag') as HTMLElement;
    const art = ALIEN_ART[alien.id];

    // Inject SVG portrait illustration
    if (art && this.alienPortraitEl) {
      this.alienPortraitEl.innerHTML = isUltimate ? art.ultimateSvg : art.normalSvg;
    }

    if (isUltimate) {
      this.alienCardEl.classList.add('card-ultimate');
      alienTagEl.textContent = 'HYPER-EVOLVED DNA';
      alienTagEl.className = 'alien-tag tag-ultimate';
      this.alienNameEl.textContent = alien.ultimateName;
      this.alienDescEl.textContent = alien.ultimateDescription;
      this.renderAbilities(alien.ultimateAbilities);
    } else {
      this.alienCardEl.classList.remove('card-ultimate');
      alienTagEl.textContent = 'STANDARD FORM';
      alienTagEl.className = 'alien-tag tag-normal';
      this.alienNameEl.textContent = alien.name;
      this.alienDescEl.textContent = alien.description;
      this.renderAbilities(alien.abilities);
    }

    this.alienSpeciesEl.textContent = alien.species;
    this.alienPlanetEl.textContent = alien.planet;
  }

  private renderAbilities(abilities: string[]): void {
    this.alienAbilitiesEl.innerHTML = abilities
      .map((ability) => `<li><span class="bullet">▹</span> ${ability}</li>`)
      .join('');
  }
}

import { ALIENS } from '../core/aliens';
import { UltimatrixState } from '../core/UltimatrixState';
import { SoundEngine } from '../audio/SoundEngine';
import type { UltimatrixStateSnapshot } from '../types';

export class HUD {
  private root: HTMLElement;
  private state: UltimatrixState;
  private soundEngine: SoundEngine;

  private modeBadgeEl!: HTMLElement;
  private alienCardEl!: HTMLElement;
  private alienNameEl!: HTMLElement;
  private alienSpeciesEl!: HTMLElement;
  private alienPlanetEl!: HTMLElement;
  private alienDescEl!: HTMLElement;
  private alienAbilitiesEl!: HTMLElement;
  private carouselListEl!: HTMLElement;
  private activateBtn!: HTMLButtonElement;
  private ultimateBtn!: HTMLButtonElement;
  private audioBtn!: HTMLButtonElement;
  private fullscreenBtn!: HTMLButtonElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;

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
      <div class="hud-container">
        <!-- Top Bar -->
        <header class="hud-header">
          <div class="hud-brand">
            <div class="omnitrix-logo-icon"></div>
            <div>
              <h1 class="hud-title">ULTIMATRIX</h1>
              <div class="hud-subtitle">GALVAN PRIME • LEVEL 20 DNA MATRIX</div>
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

        <!-- Center Flash Overlay for Transformations -->
        <div id="transform-flash" class="transform-flash"></div>

        <!-- Left Holographic Telemetry Panel -->
        <aside id="alien-card" class="alien-card">
          <div class="card-accent-line"></div>
          <div class="card-header">
            <span class="dna-code">DNA SAMPLE #0<span id="alien-num">1</span></span>
            <span id="alien-tag" class="alien-tag">NORMAL</span>
          </div>
          <h2 id="alien-name" class="alien-title">Swampfire</h2>
          <div class="alien-meta">
            <div><span class="meta-label">SPECIES:</span> <span id="alien-species">Methanosian</span></div>
            <div><span class="meta-label">PLANET:</span> <span id="alien-planet">Methanos</span></div>
          </div>
          <p id="alien-desc" class="alien-desc">Loading Galvan genetic telemetry...</p>
          <div class="abilities-section">
            <div class="meta-label">CORE COMBAT POWERS:</div>
            <ul id="alien-abilities" class="abilities-list"></ul>
          </div>
        </aside>

        <!-- Bottom Action Bar & Alien Selector -->
        <footer class="hud-footer">
          <div class="alien-carousel-container">
            <button id="btn-prev" class="carousel-arrow" title="Previous Alien [Left Arrow]">◀</button>
            <div id="carousel-list" class="carousel-list"></div>
            <button id="btn-next" class="carousel-arrow" title="Next Alien [Right Arrow]">▶</button>
          </div>

          <div class="action-buttons-row">
            <button id="btn-activate" class="hud-btn hud-btn-primary">
              <span class="btn-icon">⚡</span>
              <span id="activate-btn-text">ACTIVATE CORE</span>
            </button>
            <button id="btn-ultimate" class="hud-btn hud-btn-ultimate" disabled>
              <span class="btn-icon">💥</span>
              <span>ULTIMATE EVOLUTION</span>
            </button>
            <button id="btn-recharge" class="hud-btn hud-btn-secondary">
              <span class="btn-icon">⏱</span>
              <span>TIMEOUT MODE</span>
            </button>
          </div>

          <!-- Controls Legend -->
          <div class="hud-legend">
            <span class="legend-item"><kbd>SPACE</kbd> Core Pop/Slam</span>
            <span class="legend-item"><kbd>←</kbd> <kbd>→</kbd> Cycle Aliens</span>
            <span class="legend-item"><kbd>U</kbd> Ultimate Mode</span>
            <span class="legend-item"><kbd>R</kbd> Detransform</span>
            <span class="legend-item"><kbd>Click Watch</kbd> In 3D</span>
          </div>
        </footer>
      </div>
    `;

    // Query elements
    this.modeBadgeEl = this.root.querySelector('#mode-badge') as HTMLElement;
    this.alienCardEl = this.root.querySelector('#alien-card') as HTMLElement;
    this.alienNameEl = this.root.querySelector('#alien-name') as HTMLElement;
    this.alienSpeciesEl = this.root.querySelector('#alien-species') as HTMLElement;
    this.alienPlanetEl = this.root.querySelector('#alien-planet') as HTMLElement;
    this.alienDescEl = this.root.querySelector('#alien-desc') as HTMLElement;
    this.alienAbilitiesEl = this.root.querySelector('#alien-abilities') as HTMLElement;
    this.carouselListEl = this.root.querySelector('#carousel-list') as HTMLElement;
    this.activateBtn = this.root.querySelector('#btn-activate') as HTMLButtonElement;
    this.ultimateBtn = this.root.querySelector('#btn-ultimate') as HTMLButtonElement;
    this.audioBtn = this.root.querySelector('#btn-audio') as HTMLButtonElement;
    this.fullscreenBtn = this.root.querySelector('#btn-fullscreen') as HTMLButtonElement;
    this.prevBtn = this.root.querySelector('#btn-prev') as HTMLButtonElement;
    this.nextBtn = this.root.querySelector('#btn-next') as HTMLButtonElement;

    // Populate carousel items
    this.populateCarousel();
  }

  private populateCarousel(): void {
    this.carouselListEl.innerHTML = '';
    ALIENS.forEach((alien, index) => {
      const item = document.createElement('button');
      item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
      item.dataset.index = index.toString();
      item.innerHTML = `
        <div class="carousel-icon-box">
          <span class="alien-avatar-symbol">⚡</span>
        </div>
        <span class="carousel-alien-label">${alien.name}</span>
      `;
      item.addEventListener('click', () => {
        this.soundEngine.playDialTurn();
        this.state.selectAlien(index);
      });
      this.carouselListEl.appendChild(item);
    });
  }

  private bindEvents(): void {
    // 1. Activate / Slam Dial button
    this.activateBtn.addEventListener('click', () => {
      const current = this.state.getSnapshot().mode;
      if (current === 'STANDBY') {
        this.soundEngine.playPopUp();
        this.state.toggleActivation();
      } else if (current === 'ACTIVE_SELECTION') {
        this.soundEngine.playSlam();
        this.triggerFlash('green');
        this.state.slamDial();
      } else if (current === 'TRANSFORMED' || current === 'ULTIMATE_MODE') {
        this.soundEngine.playSlam();
        this.triggerFlash('green');
        this.state.detransform();
      }
    });

    // 2. Ultimate Evolution button
    this.ultimateBtn.addEventListener('click', () => {
      const snapshot = this.state.getSnapshot();
      if (snapshot.mode === 'TRANSFORMED') {
        this.soundEngine.playUltimateEvolve();
        this.triggerFlash('red');
        this.state.toggleUltimate();
      } else if (snapshot.mode === 'ULTIMATE_MODE') {
        this.soundEngine.playSlam();
        this.triggerFlash('green');
        this.state.toggleUltimate();
      }
    });

    // 3. Recharge / Timeout button
    const rechargeBtn = this.root.querySelector('#btn-recharge') as HTMLButtonElement;
    rechargeBtn.addEventListener('click', () => {
      this.soundEngine.playTimeout();
      this.state.triggerTimeout();
    });

    // 4. Carousel arrows
    this.prevBtn.addEventListener('click', () => {
      this.soundEngine.playDialTurn();
      this.state.prevAlien();
    });
    this.nextBtn.addEventListener('click', () => {
      this.soundEngine.playDialTurn();
      this.state.nextAlien();
    });

    // 5. Audio toggle
    this.audioBtn.addEventListener('click', () => {
      const enabled = this.state.toggleAudio();
      this.soundEngine.setEnabled(enabled);
      const icon = this.root.querySelector('#audio-icon') as HTMLElement;
      icon.textContent = enabled ? '🔊' : '🔇';
    });

    // 6. Fullscreen toggle
    this.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // 7. Keyboard Hotkeys
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.activateBtn.click();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.prevBtn.click();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextBtn.click();
          break;
        case 'KeyU':
          e.preventDefault();
          if (!this.ultimateBtn.disabled) {
            this.ultimateBtn.click();
          }
          break;
        case 'KeyR':
          e.preventDefault();
          this.soundEngine.playSlam();
          this.state.detransform();
          break;
        case 'KeyM':
          e.preventDefault();
          this.audioBtn.click();
          break;
      }
    });
  }

  private triggerFlash(color: 'green' | 'red'): void {
    const flashEl = this.root.querySelector('#transform-flash') as HTMLElement;
    if (!flashEl) return;
    flashEl.className = `transform-flash flash-active flash-${color}`;
    setTimeout(() => {
      flashEl.className = 'transform-flash';
    }, 400);
  }

  private onStateChange(snapshot: UltimatrixStateSnapshot): void {
    const { mode, selectedAlien, selectedAlienIndex, isUltimate } = snapshot;

    // 1. Update Mode Badge
    this.modeBadgeEl.className = `mode-badge badge-${mode.toLowerCase()}`;
    this.modeBadgeEl.textContent = isUltimate ? 'ULTIMATE FORM' : mode.replace('_', ' ');

    // 2. Update Primary Action Button
    const btnTextEl = this.root.querySelector('#activate-btn-text') as HTMLElement;
    if (mode === 'STANDBY') {
      btnTextEl.textContent = 'ACTIVATE CORE';
      this.activateBtn.disabled = false;
      this.ultimateBtn.disabled = true;
    } else if (mode === 'ACTIVE_SELECTION') {
      btnTextEl.textContent = 'SLAM DIAL (TRANSFORM)';
      this.activateBtn.disabled = false;
      this.ultimateBtn.disabled = true;
    } else if (mode === 'TRANSFORMED') {
      btnTextEl.textContent = 'REVERT TO BEN';
      this.activateBtn.disabled = false;
      this.ultimateBtn.disabled = false;
    } else if (mode === 'ULTIMATE_MODE') {
      btnTextEl.textContent = 'REVERT TO BEN';
      this.activateBtn.disabled = false;
      this.ultimateBtn.disabled = false;
    } else if (mode === 'COOLDOWN') {
      btnTextEl.textContent = `RECHARGING (${Math.round(snapshot.cooldownPercent)}%)`;
      this.activateBtn.disabled = true;
      this.ultimateBtn.disabled = true;
    }

    // 3. Update Alien Telemetry Card
    const alienNumEl = this.root.querySelector('#alien-num') as HTMLElement;
    const alienTagEl = this.root.querySelector('#alien-tag') as HTMLElement;

    alienNumEl.textContent = (selectedAlienIndex + 1).toString();
    if (isUltimate) {
      this.alienCardEl.classList.add('card-ultimate');
      alienTagEl.textContent = 'EVOLVED SPECIES';
      alienTagEl.className = 'alien-tag tag-ultimate';
      this.alienNameEl.textContent = selectedAlien.ultimateName;
      this.alienDescEl.textContent = selectedAlien.ultimateDescription;
      this.renderAbilities(selectedAlien.ultimateAbilities);
    } else {
      this.alienCardEl.classList.remove('card-ultimate');
      alienTagEl.textContent = 'STANDARD FORM';
      alienTagEl.className = 'alien-tag tag-normal';
      this.alienNameEl.textContent = selectedAlien.name;
      this.alienDescEl.textContent = selectedAlien.description;
      this.renderAbilities(selectedAlien.abilities);
    }

    this.alienSpeciesEl.textContent = selectedAlien.species;
    this.alienPlanetEl.textContent = selectedAlien.planet;

    // 4. Update Carousel Active Indicator
    const items = this.carouselListEl.querySelectorAll('.carousel-item');
    items.forEach((item, idx) => {
      if (idx === selectedAlienIndex) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  private renderAbilities(abilities: string[]): void {
    this.alienAbilitiesEl.innerHTML = abilities
      .map((ability) => `<li><span class="bullet">▹</span> ${ability}</li>`)
      .join('');
  }
}

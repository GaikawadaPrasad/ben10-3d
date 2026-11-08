import { ALIENS } from './aliens';
import type { UltimatrixMode, UltimatrixStateSnapshot, StateChangeCallback } from '../types';

export class UltimatrixState {
  private mode: UltimatrixMode = 'STANDBY';
  private selectedAlienIndex: number = 0;
  private isUltimate: boolean = false;
  private cooldownPercent: number = 0;
  private audioEnabled: boolean = true;
  private listeners: Set<StateChangeCallback> = new Set();
  private cooldownTimer: number | null = null;

  public getSnapshot(): UltimatrixStateSnapshot {
    return {
      mode: this.mode,
      selectedAlienIndex: this.selectedAlienIndex,
      selectedAlien: ALIENS[this.selectedAlienIndex],
      isUltimate: this.isUltimate,
      cooldownPercent: this.cooldownPercent,
      audioEnabled: this.audioEnabled
    };
  }

  public subscribe(listener: StateChangeCallback): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  public toggleActivation(): void {
    if (this.mode === 'COOLDOWN') return;

    if (this.mode === 'STANDBY') {
      this.mode = 'ACTIVE_SELECTION';
      this.isUltimate = false;
    } else if (this.mode === 'ACTIVE_SELECTION') {
      this.mode = 'STANDBY';
    } else if (this.mode === 'TRANSFORMED' || this.mode === 'ULTIMATE_MODE') {
      this.detransform();
      return;
    }
    this.notify();
  }

  public nextAlien(): void {
    if (this.mode === 'COOLDOWN') return;
    this.selectedAlienIndex = (this.selectedAlienIndex + 1) % ALIENS.length;
    this.notify();
  }

  public prevAlien(): void {
    if (this.mode === 'COOLDOWN') return;
    this.selectedAlienIndex = (this.selectedAlienIndex - 1 + ALIENS.length) % ALIENS.length;
    this.notify();
  }

  public selectAlien(index: number): void {
    if (index >= 0 && index < ALIENS.length) {
      this.selectedAlienIndex = index;
      this.notify();
    }
  }

  public slamDial(): void {
    if (this.mode === 'ACTIVE_SELECTION') {
      this.mode = 'TRANSFORMED';
      this.isUltimate = false;
      this.notify();
    } else if (this.mode === 'TRANSFORMED') {
      // Slamming while transformed triggers ultimate evolution!
      this.toggleUltimate();
    } else if (this.mode === 'ULTIMATE_MODE') {
      // Revert from ultimate
      this.detransform();
    } else if (this.mode === 'STANDBY') {
      // Pop up core first
      this.toggleActivation();
    }
  }

  public toggleUltimate(): void {
    if (this.mode === 'TRANSFORMED') {
      this.mode = 'ULTIMATE_MODE';
      this.isUltimate = true;
      this.notify();
    } else if (this.mode === 'ULTIMATE_MODE') {
      this.mode = 'TRANSFORMED';
      this.isUltimate = false;
      this.notify();
    }
  }

  public detransform(): void {
    if (this.mode === 'TRANSFORMED' || this.mode === 'ULTIMATE_MODE') {
      this.mode = 'STANDBY';
      this.isUltimate = false;
      this.notify();
    }
  }

  public triggerTimeout(): void {
    this.mode = 'COOLDOWN';
    this.isUltimate = false;
    this.cooldownPercent = 100;
    this.notify();

    if (this.cooldownTimer !== null) {
      clearInterval(this.cooldownTimer);
    }

    const intervalTime = 100; // ms
    const step = 2; // reduces cooldown in 5s
    this.cooldownTimer = window.setInterval(() => {
      this.cooldownPercent -= step;
      if (this.cooldownPercent <= 0) {
        this.cooldownPercent = 0;
        this.mode = 'STANDBY';
        if (this.cooldownTimer !== null) {
          clearInterval(this.cooldownTimer);
          this.cooldownTimer = null;
        }
      }
      this.notify();
    }, intervalTime);
  }

  public toggleAudio(): boolean {
    this.audioEnabled = !this.audioEnabled;
    this.notify();
    return this.audioEnabled;
  }
}

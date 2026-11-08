import { ALIENS } from './aliens';
import type { UltimatrixMode, UltimatrixStateSnapshot, StateChangeCallback } from '../types';

export class UltimatrixState {
  private mode: UltimatrixMode = 'STANDBY';
  private selectedAlienIndex: number = 0;
  private isUltimate: boolean = false;
  private cooldownPercent: number = 0;
  private timeRemaining: number = 0;
  private totalDuration: number = 0;
  private audioEnabled: boolean = true;
  private listeners: Set<StateChangeCallback> = new Set();
  private timerId: ReturnType<typeof setInterval> | null = null;

  public getSnapshot(): UltimatrixStateSnapshot {
    return {
      mode: this.mode,
      selectedAlienIndex: this.selectedAlienIndex,
      selectedAlien: ALIENS[this.selectedAlienIndex],
      isUltimate: this.isUltimate,
      cooldownPercent: this.cooldownPercent,
      timeRemaining: this.timeRemaining,
      totalDuration: this.totalDuration,
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

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private startTimer(seconds: number, onComplete: () => void): void {
    this.clearTimer();
    this.totalDuration = seconds;
    this.timeRemaining = seconds;
    this.cooldownPercent = 100;

    const intervalMs = 100;
    this.timerId = setInterval(() => {
      this.timeRemaining = Math.max(0, +(this.timeRemaining - 0.1).toFixed(1));
      if (this.totalDuration > 0) {
        this.cooldownPercent = (this.timeRemaining / this.totalDuration) * 100;
      }
      this.notify();

      if (this.timeRemaining <= 0) {
        this.clearTimer();
        onComplete();
      }
    }, intervalMs);
  }

  public toggleActivation(): void {
    if (this.mode === 'COOLDOWN') return; // Cannot activate while recharging

    if (this.mode === 'STANDBY') {
      this.mode = 'ACTIVE_SELECTION';
      this.isUltimate = false;
      this.clearTimer();
    } else if (this.mode === 'ACTIVE_SELECTION') {
      this.mode = 'STANDBY';
      this.clearTimer();
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
    if (this.mode === 'COOLDOWN') return;
    if (index >= 0 && index < ALIENS.length) {
      this.selectedAlienIndex = index;
      this.notify();
    }
  }

  public slamDial(): void {
    if (this.mode === 'ACTIVE_SELECTION') {
      // Normal transformation lasts 6 seconds
      this.mode = 'TRANSFORMED';
      this.isUltimate = false;
      this.startTimer(6.0, () => {
        this.triggerTimeout(2.0);
      });
      this.notify();
    } else if (this.mode === 'TRANSFORMED') {
      // Evolving to Ultimate lasts 4 seconds
      this.toggleUltimate();
    } else if (this.mode === 'ULTIMATE_MODE') {
      this.detransform();
    } else if (this.mode === 'STANDBY') {
      this.toggleActivation();
    }
  }

  public toggleUltimate(): void {
    if (this.mode === 'TRANSFORMED') {
      // Ultimate form lasts 4 seconds
      this.mode = 'ULTIMATE_MODE';
      this.isUltimate = true;
      this.startTimer(4.0, () => {
        this.triggerTimeout(2.0);
      });
      this.notify();
    } else if (this.mode === 'ULTIMATE_MODE') {
      // Revert to normal transformed (resets normal 6s timer)
      this.mode = 'TRANSFORMED';
      this.isUltimate = false;
      this.startTimer(6.0, () => {
        this.triggerTimeout(2.0);
      });
      this.notify();
    }
  }

  public detransform(): void {
    if (this.mode === 'TRANSFORMED' || this.mode === 'ULTIMATE_MODE') {
      this.clearTimer();
      this.mode = 'STANDBY';
      this.isUltimate = false;
      this.timeRemaining = 0;
      this.totalDuration = 0;
      this.cooldownPercent = 0;
      this.notify();
    }
  }

  public triggerTimeout(cooldownSeconds: number = 2.0): void {
    this.clearTimer();
    this.mode = 'COOLDOWN';
    this.isUltimate = false;

    // Red Cooldown lasts 2 seconds, then automatically returns to green STANDBY
    this.startTimer(cooldownSeconds, () => {
      this.mode = 'STANDBY';
      this.isUltimate = false;
      this.timeRemaining = 0;
      this.totalDuration = 0;
      this.cooldownPercent = 0;
      this.notify();
    });
    this.notify();
  }

  public toggleAudio(): boolean {
    this.audioEnabled = !this.audioEnabled;
    this.notify();
    return this.audioEnabled;
  }
}

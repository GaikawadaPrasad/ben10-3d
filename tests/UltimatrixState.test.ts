import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UltimatrixState } from '../src/core/UltimatrixState';
import { ALIENS } from '../src/core/aliens';

describe('UltimatrixState Machine', () => {
  let state: UltimatrixState;

  beforeEach(() => {
    state = new UltimatrixState();
  });

  it('starts in STANDBY mode with Swampfire as default alien', () => {
    const snapshot = state.getSnapshot();
    expect(snapshot.mode).toBe('STANDBY');
    expect(snapshot.isUltimate).toBe(false);
    expect(snapshot.selectedAlien.id).toBe('swampfire');
    expect(snapshot.selectedAlienIndex).toBe(0);
  });

  it('transitions from STANDBY to ACTIVE_SELECTION on toggleActivation()', () => {
    state.toggleActivation();
    expect(state.getSnapshot().mode).toBe('ACTIVE_SELECTION');
  });

  it('cycles aliens clockwise and counterclockwise correctly with wrap-around', () => {
    state.toggleActivation();
    const initialIndex = state.getSnapshot().selectedAlienIndex;
    
    state.nextAlien();
    expect(state.getSnapshot().selectedAlienIndex).toBe((initialIndex + 1) % ALIENS.length);
    
    state.prevAlien();
    expect(state.getSnapshot().selectedAlienIndex).toBe(initialIndex);

    state.prevAlien();
    expect(state.getSnapshot().selectedAlienIndex).toBe(ALIENS.length - 1);
  });

  it('transforms when slammed down from ACTIVE_SELECTION', () => {
    state.toggleActivation();
    expect(state.getSnapshot().mode).toBe('ACTIVE_SELECTION');

    state.slamDial();
    expect(state.getSnapshot().mode).toBe('TRANSFORMED');
  });

  it('toggles ULTIMATE_MODE when transformed', () => {
    state.toggleActivation();
    state.slamDial();
    expect(state.getSnapshot().mode).toBe('TRANSFORMED');
    expect(state.getSnapshot().isUltimate).toBe(false);

    state.toggleUltimate();
    expect(state.getSnapshot().mode).toBe('ULTIMATE_MODE');
    expect(state.getSnapshot().isUltimate).toBe(true);

    state.toggleUltimate();
    expect(state.getSnapshot().mode).toBe('TRANSFORMED');
    expect(state.getSnapshot().isUltimate).toBe(false);
  });

  it('can de-transform back to STANDBY mode', () => {
    state.toggleActivation();
    state.slamDial();
    state.detransform();
    expect(state.getSnapshot().mode).toBe('STANDBY');
  });

  it('notifies listeners when state changes', () => {
    const listener = vi.fn();
    const unsubscribe = state.subscribe(listener);
    // Initial call on subscription
    expect(listener).toHaveBeenCalledTimes(1);

    state.toggleActivation();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ mode: 'ACTIVE_SELECTION' }));

    unsubscribe();
    state.nextAlien();
    // No more calls after unsubscribe
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('runs 6s timer for normal form and transitions to red COOLDOWN, then reverts to STANDBY after 2s', () => {
    vi.useFakeTimers();
    state.toggleActivation();
    state.slamDial();

    expect(state.getSnapshot().mode).toBe('TRANSFORMED');
    expect(state.getSnapshot().timeRemaining).toBe(6.0);

    // Fast-forward 6 seconds
    vi.advanceTimersByTime(6000);

    // Should now be in red COOLDOWN
    expect(state.getSnapshot().mode).toBe('COOLDOWN');
    expect(state.getSnapshot().timeRemaining).toBe(2.0);

    // Fast-forward 2 seconds
    vi.advanceTimersByTime(2000);

    // Should now be back in STANDBY, ready to transform again
    expect(state.getSnapshot().mode).toBe('STANDBY');
    vi.useRealTimers();
  });

  it('runs 4s timer for ultimate form and transitions to red COOLDOWN, then reverts to STANDBY after 2s', () => {
    vi.useFakeTimers();
    state.toggleActivation();
    state.slamDial();
    state.toggleUltimate();

    expect(state.getSnapshot().mode).toBe('ULTIMATE_MODE');
    expect(state.getSnapshot().timeRemaining).toBe(4.0);

    // Fast-forward 4 seconds
    vi.advanceTimersByTime(4000);

    // Should now be in red COOLDOWN
    expect(state.getSnapshot().mode).toBe('COOLDOWN');
    expect(state.getSnapshot().timeRemaining).toBe(2.0);

    // Fast-forward 2 seconds
    vi.advanceTimersByTime(2000);

    // Should now be back in STANDBY
    expect(state.getSnapshot().mode).toBe('STANDBY');
    vi.useRealTimers();
  });
});

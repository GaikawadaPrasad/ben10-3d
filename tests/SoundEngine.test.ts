import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SoundEngine } from '../src/audio/SoundEngine';

describe('SoundEngine Procedural Audio', () => {
  let soundEngine: SoundEngine;

  beforeEach(() => {
    soundEngine = new SoundEngine();
  });

  it('instantiates without throwing in non-browser or test environments', () => {
    expect(soundEngine).toBeDefined();
    expect(soundEngine.isAudioReady()).toBe(false);
  });

  it('allows enabling and disabling sound output', () => {
    soundEngine.setEnabled(false);
    expect(soundEngine.isEnabled()).toBe(false);

    soundEngine.setEnabled(true);
    expect(soundEngine.isEnabled()).toBe(true);
  });

  it('safely handles playback methods when audio context is inactive or muted', () => {
    expect(() => {
      soundEngine.playPopUp();
      soundEngine.playDialTurn();
      soundEngine.playSlam();
      soundEngine.playTransform();
      soundEngine.playUltimateEvolve();
      soundEngine.playTimeout();
      soundEngine.startHum();
      soundEngine.stopHum();
    }).not.toThrow();
  });

  it('initializes AudioContext mock when provided', () => {
    const mockOscillator = {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };

    const mockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      connect: vi.fn()
    };

    const mockContext = {
      state: 'running',
      currentTime: 0,
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGain),
      destination: {}
    } as unknown as AudioContext;

    soundEngine.setContext(mockContext);
    expect(soundEngine.isAudioReady()).toBe(true);

    soundEngine.playPopUp();
    expect(mockContext.createOscillator).toHaveBeenCalled();
    expect(mockContext.createGain).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
  });
});

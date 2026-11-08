import './style.css';
import { UltimatrixState } from './core/UltimatrixState';
import { SoundEngine } from './audio/SoundEngine';
import { SceneManager } from './three/SceneManager';
import { HUD } from './ui/HUD';

function initApp(): void {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud-root') as HTMLElement;

  if (!canvas || !hudRoot) {
    console.error('Missing root elements');
    return;
  }

  // 1. Initialize State & Sound Engine
  const state = new UltimatrixState();
  const soundEngine = new SoundEngine();

  // 2. Initialize 3D WebGL Scene
  const sceneManager = new SceneManager(canvas, state, soundEngine);

  // 3. Initialize Galvan Sci-Fi HUD
  const hud = new HUD(hudRoot, state, soundEngine);

  // 4. Unlock AudioContext on first user interaction
  const unlockAudio = (): void => {
    soundEngine.ensureContext();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  console.log('Galvan Ultimatrix 3D Simulator initialized successfully', { sceneManager, hud });
}

window.addEventListener('DOMContentLoaded', initApp);

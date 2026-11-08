import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { UltimatrixMesh } from './UltimatrixMesh';
import { UltimatrixState } from '../core/UltimatrixState';
import { SoundEngine } from '../audio/SoundEngine';

export class SceneManager {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private controls: OrbitControls;
  private bloomPass: UnrealBloomPass;
  public ultimatrix: UltimatrixMesh;
  private state: UltimatrixState;
  private soundEngine: SoundEngine;

  private clock: THREE.Clock;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private shakeIntensity: number = 0;
  private targetCameraPos: THREE.Vector3;
  private targetControlsTarget: THREE.Vector3;

  constructor(canvas: HTMLCanvasElement, state: UltimatrixState, soundEngine: SoundEngine) {
    this.canvas = canvas;
    this.state = state;
    this.soundEngine = soundEngine;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040806);
    this.scene.fog = new THREE.FogExp2(0x040806, 0.045);

    // 2. Camera: Heroic perspective focused on the Ultimatrix
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(2.8, 3.4, 3.8);
    this.targetCameraPos = this.camera.position.clone();
    this.targetControlsTarget = new THREE.Vector3(0, 0.35, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 9.0;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.target.set(0, 0.35, 0);

    // 5. Lighting
    this.setupLighting();

    // 6. Post-Processing Bloom
    const renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.95, // strength
      0.4,  // radius
      0.65  // threshold
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);

    // 7. Ultimatrix 3D Mesh
    this.ultimatrix = new UltimatrixMesh();
    this.scene.add(this.ultimatrix.group);

    // 8. Studio Grid Floor Pedestal
    this.buildPedestal();

    // 9. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.canvas.addEventListener('pointerdown', this.onCanvasPointerDown.bind(this));
    window.addEventListener('wheel', this.onWindowWheel.bind(this), { passive: false });

    // 10. Subscribe to State changes
    this.state.subscribe(this.onStateChange.bind(this));

    // Start render loop
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x1a2e22, 1.4);
    this.scene.add(ambientLight);

    // Key Light (warm metallic highlight)
    const keyLight = new THREE.DirectionalLight(0xe8f0f8, 2.6);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    // Fill Light (emerald Galvan tint)
    const fillLight = new THREE.DirectionalLight(0x00ff88, 1.5);
    fillLight.position.set(-6, 3, -4);
    this.scene.add(fillLight);

    // Rim Light (cool blue back reflection)
    const rimLight = new THREE.DirectionalLight(0x3a7bd5, 1.8);
    rimLight.position.set(0, 6, -8);
    this.scene.add(rimLight);
  }

  private buildPedestal(): void {
    const gridHelper = new THREE.GridHelper(16, 32, 0x00ff66, 0x0c2417);
    gridHelper.position.y = -1.6;
    this.scene.add(gridHelper);

    const ringGeo = new THREE.RingGeometry(2.4, 2.55, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -1.58;
    this.scene.add(ringMesh);
  }

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.composer.setSize(width, height);
  }

  // Mouse wheel rotates the Ultimatrix dial and changes alien!
  private onWindowWheel(event: WheelEvent): void {
    const currentMode = this.state.getSnapshot().mode;
    if (currentMode === 'ACTIVE_SELECTION') {
      event.preventDefault(); // Take over scroll wheel exclusively for dial rotation
      if (event.deltaY > 0) {
        this.soundEngine.playDialTurn();
        this.state.nextAlien();
      } else if (event.deltaY < 0) {
        this.soundEngine.playDialTurn();
        this.state.prevAlien();
      }
    } else if (currentMode === 'STANDBY') {
      // If user scrolls in standby, automatically pop up the watch into selection!
      event.preventDefault();
      this.soundEngine.playPopUp();
      this.state.toggleActivation();
    }
  }

  private onCanvasPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.ultimatrix.group.children, true);

    if (intersects.length > 0) {
      // User clicked directly on the 3D Ultimatrix watch!
      const currentMode = this.state.getSnapshot().mode;
      if (currentMode === 'STANDBY') {
        this.soundEngine.playPopUp();
        this.state.toggleActivation();
      } else if (currentMode === 'ACTIVE_SELECTION') {
        this.soundEngine.playSlam();
        this.soundEngine.playTransform();
        this.triggerCameraShake(0.5);
        this.state.slamDial();
      } else if (currentMode === 'TRANSFORMED') {
        // Slam again to evolve to Ultimate
        this.soundEngine.playUltimateEvolve();
        this.triggerCameraShake(0.65);
        this.state.toggleUltimate();
      } else if (currentMode === 'ULTIMATE_MODE') {
        this.soundEngine.playSlam();
        this.triggerCameraShake(0.25);
        this.state.detransform();
      }
    }
  }

  public triggerCameraShake(intensity: number): void {
    this.shakeIntensity = intensity;
  }

  private onStateChange(snapshot: ReturnType<UltimatrixState['getSnapshot']>): void {
    // Update mesh visuals with alien index so dial face renders the alien silhouette!
    this.ultimatrix.setModeVisuals(snapshot.mode, snapshot.isUltimate, snapshot.selectedAlienIndex);

    // Update hologram alien display
    this.ultimatrix.hologram.setAlien(snapshot.selectedAlienIndex, snapshot.isUltimate);

    // Rotate dial smoothly
    const alienAngle = (snapshot.selectedAlienIndex / 6) * Math.PI * 2;
    this.ultimatrix.setRotationTarget(alienAngle);

    // Bloom intensity adjust
    if (snapshot.isUltimate) {
      this.bloomPass.strength = 1.45;
    } else if (snapshot.mode === 'ACTIVE_SELECTION') {
      this.bloomPass.strength = 1.15;
    } else {
      this.bloomPass.strength = 0.85;
    }

    // Camera framing focus and center target
    if (snapshot.mode === 'ACTIVE_SELECTION') {
      this.targetCameraPos.set(2.0, 3.4, 4.6);
      this.targetControlsTarget.set(0, 0.80, 0);
    } else if (snapshot.mode === 'ULTIMATE_MODE') {
      this.targetCameraPos.set(2.6, 3.5, 4.5);
      this.targetControlsTarget.set(0, 0.70, 0);
    } else if (snapshot.mode === 'TRANSFORMED') {
      this.targetCameraPos.set(2.8, 3.4, 4.0);
      this.targetControlsTarget.set(0, 0.45, 0);
    } else {
      this.targetCameraPos.set(2.8, 3.4, 3.8);
      this.targetControlsTarget.set(0, 0.35, 0);
    }
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // 1. Update 3D mesh components and animations
    this.ultimatrix.update(delta);

    // 2. Camera smooth framing and target interpolation
    this.camera.position.lerp(this.targetCameraPos, Math.min(1, delta * 3.0));
    this.controls.target.lerp(this.targetControlsTarget, Math.min(1, delta * 3.0));

    // 3. Camera shake decay
    if (this.shakeIntensity > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.z += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity -= delta * 1.2;
      if (this.shakeIntensity < 0) {
        this.shakeIntensity = 0;
      }
    }

    // 4. Orbit controls
    this.controls.update();

    // 5. Render with post-processing bloom
    this.composer.render();
  };
}

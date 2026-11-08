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
  private cameraBasePosition: THREE.Vector3;

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

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(3.8, 3.2, 4.2);
    this.cameraBasePosition = this.camera.position.clone();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 12.0;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15; // don't go too far below floor
    this.controls.target.set(0, 0.4, 0);

    // 5. Lighting
    this.setupLighting();

    // 6. Post-Processing Bloom
    const renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.85, // strength
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

    // 10. Subscribe to State changes
    this.state.subscribe(this.onStateChange.bind(this));

    // Start render loop
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x1a2e22, 1.2);
    this.scene.add(ambientLight);

    // Key Light (warm metallic highlight)
    const keyLight = new THREE.DirectionalLight(0xe8f0f8, 2.5);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    // Fill Light (emerald Galvan tint)
    const fillLight = new THREE.DirectionalLight(0x00ff88, 1.2);
    fillLight.position.set(-6, 3, -4);
    this.scene.add(fillLight);

    // Rim Light (cool blue back reflection)
    const rimLight = new THREE.DirectionalLight(0x3a7bd5, 1.8);
    rimLight.position.set(0, 6, -8);
    this.scene.add(rimLight);
  }

  private buildPedestal(): void {
    // Sci-fi Galvan holographic platform ring under the gauntlet
    const gridHelper = new THREE.GridHelper(16, 32, 0x00ff66, 0x0c2417);
    gridHelper.position.y = -1.6;
    this.scene.add(gridHelper);

    // Inner glowing pedestal ring
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

  private onCanvasPointerDown(event: PointerEvent): void {
    // Only react to primary mouse button
    if (event.button !== 0) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.ultimatrix.group.children, true);

    if (intersects.length > 0) {
      // User clicked on the 3D Ultimatrix!
      const currentMode = this.state.getSnapshot().mode;
      if (currentMode === 'STANDBY') {
        this.soundEngine.playPopUp();
        this.state.toggleActivation();
      } else if (currentMode === 'ACTIVE_SELECTION') {
        this.soundEngine.playSlam();
        this.triggerCameraShake(0.25);
        this.state.slamDial();
      } else if (currentMode === 'TRANSFORMED') {
        // Slam again to evolve to Ultimate
        this.soundEngine.playUltimateEvolve();
        this.triggerCameraShake(0.45);
        this.state.toggleUltimate();
      } else if (currentMode === 'ULTIMATE_MODE') {
        this.soundEngine.playSlam();
        this.triggerCameraShake(0.2);
        this.state.detransform();
      }
    }
  }

  public triggerCameraShake(intensity: number): void {
    this.shakeIntensity = intensity;
  }

  private onStateChange(snapshot: ReturnType<UltimatrixState['getSnapshot']>): void {
    // Update mesh visuals
    this.ultimatrix.setModeVisuals(snapshot.mode, snapshot.isUltimate);

    // Update hologram alien display
    this.ultimatrix.hologram.setAlien(snapshot.selectedAlienIndex, snapshot.isUltimate);

    // Rotate dial according to alien index
    const alienAngle = (snapshot.selectedAlienIndex / 6) * Math.PI * 2;
    this.ultimatrix.setRotationTarget(alienAngle);

    // Bloom intensity adjust
    if (snapshot.isUltimate) {
      this.bloomPass.strength = 1.35;
    } else if (snapshot.mode === 'ACTIVE_SELECTION') {
      this.bloomPass.strength = 1.05;
    } else {
      this.bloomPass.strength = 0.75;
    }
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    // 1. Update 3D mesh components and animations
    this.ultimatrix.update(delta);

    // 2. Camera shake decay
    if (this.shakeIntensity > 0) {
      this.camera.position.x = this.cameraBasePosition.x + (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.y = this.cameraBasePosition.y + (Math.random() - 0.5) * this.shakeIntensity;
      this.camera.position.z = this.cameraBasePosition.z + (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity -= delta * 0.9;
      if (this.shakeIntensity < 0) {
        this.shakeIntensity = 0;
        this.camera.position.copy(this.cameraBasePosition);
      }
    } else {
      this.cameraBasePosition.copy(this.camera.position);
    }

    // 3. Orbit controls
    this.controls.update();

    // 4. Render with post-processing bloom
    this.composer.render();
  };
}

import * as THREE from 'three';
import type { UltimatrixMaterials } from './materials';
import { ALIENS } from '../core/aliens';
import { ALIEN_ART } from '../core/alienArt';

export class HologramDisplay {
  public group: THREE.Group;
  private particleSystem: THREE.Points;
  private ringMesh: THREE.Mesh;
  private projectorCone: THREE.Mesh;
  private hologramPlanesGroup: THREE.Group;
  private holoMat!: THREE.MeshBasicMaterial;
  private holoCanvas: HTMLCanvasElement | null = null;
  private holoCtx: CanvasRenderingContext2D | null = null;
  private holoTexture!: THREE.CanvasTexture | THREE.Texture;
  private activeAlienIndex: number = -1;
  private activeIsUltimate: boolean = false;
  private materials: UltimatrixMaterials;

  constructor(materials: UltimatrixMaterials) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.group.position.set(0, 0.9, 0);

    // 1. Semi-transparent projection cone radiating from dial
    const coneGeo = new THREE.ConeGeometry(1.4, 2.0, 32, 1, true);
    coneGeo.translate(0, 1.0, 0);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.projectorCone = new THREE.Mesh(coneGeo, coneMat);
    this.projectorCone.rotation.x = Math.PI; // Inverted cone pointing up
    this.group.add(this.projectorCone);

    // 2. Holographic rotating pedestal ring
    const ringGeo = new THREE.TorusGeometry(1.0, 0.025, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.position.y = 1.8;
    this.group.add(this.ringMesh);

    // 3. Orbiting holographic particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.35 + Math.random() * 0.7;
      const y = 0.4 + Math.random() * 1.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSystem = new THREE.Points(particleGeo, this.materials.hologramParticle);
    this.group.add(this.particleSystem);

    // 4. Setup Offscreen Canvas & Texture for Alien Hologram
    this.setupHoloTexture();

    // 5. 3D Cross-Planes for Volumetric Hologram of Alien Figure
    this.hologramPlanesGroup = new THREE.Group();
    this.hologramPlanesGroup.position.set(0, 1.6, 0);

    const planeGeo = new THREE.PlaneGeometry(1.8, 2.2);
    const planeA = new THREE.Mesh(planeGeo, this.holoMat);
    this.hologramPlanesGroup.add(planeA);

    const planeB = new THREE.Mesh(planeGeo, this.holoMat);
    planeB.rotation.y = Math.PI / 3;
    this.hologramPlanesGroup.add(planeB);

    const planeC = new THREE.Mesh(planeGeo, this.holoMat);
    planeC.rotation.y = (Math.PI * 2) / 3;
    this.hologramPlanesGroup.add(planeC);

    this.group.add(this.hologramPlanesGroup);

    // Initial render
    this.setAlien(0, false);
  }

  private setupHoloTexture(): void {
    if (typeof document !== 'undefined') {
      this.holoCanvas = document.createElement('canvas');
      this.holoCanvas.width = 512;
      this.holoCanvas.height = 640;
      this.holoCtx = this.holoCanvas.getContext('2d');
      this.holoTexture = new THREE.CanvasTexture(this.holoCanvas);
      this.holoTexture.colorSpace = THREE.SRGBColorSpace;
      this.holoMat = new THREE.MeshBasicMaterial({
        map: this.holoTexture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
    } else {
      this.holoTexture = new THREE.Texture();
      this.holoMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.8
      });
    }
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public setColor(hexColor: number): void {
    (this.projectorCone.material as THREE.MeshBasicMaterial).color.setHex(hexColor);
    (this.ringMesh.material as THREE.MeshBasicMaterial).color.setHex(hexColor);
    this.materials.hologramParticle.color.setHex(hexColor);
  }

  public setAlien(index: number, isUltimate: boolean = false): void {
    if (this.activeAlienIndex === index && this.activeIsUltimate === isUltimate) return;
    this.activeAlienIndex = index;
    this.activeIsUltimate = isUltimate;

    if (!this.holoCtx || !this.holoCanvas) return;

    const alien = ALIENS[index];
    if (!alien) return;
    const art = ALIEN_ART[alien.id];
    if (!art) return;

    const svgStr = isUltimate ? art.ultimateSvg : art.normalSvg;
    const ctx = this.holoCtx;
    const canvas = this.holoCanvas;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw SVG art
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add sci-fi holographic scanline overlay
      ctx.fillStyle = isUltimate ? 'rgba(255, 17, 34, 0.12)' : 'rgba(0, 255, 102, 0.12)';
      for (let y = 0; y < canvas.height; y += 6) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      if (this.holoTexture instanceof THREE.CanvasTexture) {
        this.holoTexture.needsUpdate = true;
      }
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  public update(delta: number): void {
    if (!this.group.visible) return;

    // Smooth floating rotation of the 3D alien hologram
    this.hologramPlanesGroup.rotation.y += delta * 0.9;
    this.ringMesh.rotation.z += delta * 0.6;
    this.particleSystem.rotation.y += delta * 0.4;

    // Gentle holographic breathing / scanline vertical bob
    const bob = Math.sin(Date.now() * 0.003) * 0.06;
    this.hologramPlanesGroup.position.y = 1.6 + bob;
    this.ringMesh.position.y = 1.8 + bob;
  }
}

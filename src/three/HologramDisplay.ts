import * as THREE from 'three';
import type { UltimatrixMaterials } from './materials';
import { ALIENS } from '../core/aliens';
import { ALIEN_ART, type AlienArtData } from '../core/alienArt';

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

  // Cached base heights to prevent drift during animations
  private readonly planeBaseY: number = 0.62;
  private readonly ringBaseY: number = 0.70;

  constructor(materials: UltimatrixMaterials) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.group.visible = false;
    // Positioned relative to core dial surface
    this.group.position.set(0, 0.28, 0);

    // 1. Semi-transparent projection cone radiating directly from dial surface
    const coneGeo = new THREE.ConeGeometry(0.75, 1.05, 32, 1, true);
    coneGeo.translate(0, 0.525, 0);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.projectorCone = new THREE.Mesh(coneGeo, coneMat);
    this.projectorCone.rotation.x = Math.PI; // Inverted cone opening upward
    this.group.add(this.projectorCone);

    // 2. Holographic rotating pedestal ring
    const ringGeo = new THREE.TorusGeometry(0.60, 0.018, 16, 48);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.position.y = this.ringBaseY;
    this.group.add(this.ringMesh);

    // 3. Orbiting holographic particles around the alien projection
    const particleCount = 110;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.22 + Math.random() * 0.45;
      const y = 0.15 + Math.random() * 1.0;
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
    this.hologramPlanesGroup.position.set(0, this.planeBaseY, 0);

    const planeGeo = new THREE.PlaneGeometry(1.05, 1.22);
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
      this.holoCanvas.height = 600;
      this.holoCtx = this.holoCanvas.getContext('2d');
      this.holoTexture = new THREE.CanvasTexture(this.holoCanvas);
      this.holoTexture.colorSpace = THREE.SRGBColorSpace;
      this.holoMat = new THREE.MeshBasicMaterial({
        map: this.holoTexture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
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

    const imgPath = isUltimate ? art.ultimateImage : art.image;
    const ctx = this.holoCtx;
    const canvas = this.holoCanvas;

    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect-preserving scaling to fit inside canvas with padding
        const pad = 24;
        const maxW = canvas.width - pad * 2;
        const maxH = canvas.height - pad * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (canvas.width - dw) / 2;
        const dy = (canvas.height - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);

        // Holographic color grading & scanlines over pixel silhouette
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = isUltimate ? 'rgba(255, 30, 50, 0.32)' : 'rgba(0, 255, 120, 0.30)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = isUltimate ? 'rgba(255, 180, 180, 0.45)' : 'rgba(180, 255, 200, 0.45)';
        for (let y = 0; y < canvas.height; y += 8) {
          ctx.fillRect(0, y, canvas.width, 2);
        }
        ctx.restore();

        if (this.holoTexture instanceof THREE.CanvasTexture) {
          this.holoTexture.needsUpdate = true;
        }
      };

      img.onerror = () => {
        this.renderSvgFallback(art, isUltimate);
      };

      img.src = imgPath;
    } else {
      this.renderSvgFallback(art, isUltimate);
    }
  }

  private renderSvgFallback(art: AlienArtData, isUltimate: boolean): void {
    if (!this.holoCtx || !this.holoCanvas) return;
    const ctx = this.holoCtx;
    const canvas = this.holoCanvas;
    const svgStr = isUltimate ? art.ultimateSvg : art.normalSvg;

    if (typeof Image !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (this.holoTexture instanceof THREE.CanvasTexture) {
          this.holoTexture.needsUpdate = true;
        }
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    }
  }

  public update(delta: number): void {
    if (!this.group.visible) return;

    // Smooth floating rotation of the 3D alien hologram
    this.hologramPlanesGroup.rotation.y += delta * 0.9;
    this.ringMesh.rotation.z += delta * 0.6;
    this.particleSystem.rotation.y += delta * 0.4;

    // Gentle holographic breathing / scanline vertical bob around baseline
    const bob = Math.sin(Date.now() * 0.003) * 0.04;
    this.hologramPlanesGroup.position.y = this.planeBaseY + bob;
    this.ringMesh.position.y = this.ringBaseY + bob;
  }
}

import * as THREE from 'three';
import type { UltimatrixMaterials } from './materials';

export class HologramDisplay {
  public group: THREE.Group;
  private wireframeGroup: THREE.Group;
  private particleSystem: THREE.Points;
  private ringMesh: THREE.Mesh;
  private projectorCone: THREE.Mesh;
  private activeAlienIndex: number = -1;
  private materials: UltimatrixMaterials;

  constructor(materials: UltimatrixMaterials) {
    this.materials = materials;
    this.group = new THREE.Group();
    this.group.visible = false;
    this.group.position.set(0, 1.2, 0);

    // 1. Semi-transparent projection cone
    const coneGeo = new THREE.ConeGeometry(1.2, 1.4, 32, 1, true);
    coneGeo.translate(0, 0.7, 0);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.projectorCone = new THREE.Mesh(coneGeo, coneMat);
    this.projectorCone.rotation.x = Math.PI; // Inverted cone pointing up from dial
    this.group.add(this.projectorCone);

    // 2. Holographic ring
    const ringGeo = new THREE.TorusGeometry(0.85, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.rotation.x = Math.PI / 2;
    this.ringMesh.position.y = 1.35;
    this.group.add(this.ringMesh);

    // 3. Orbiting holographic particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.4 + Math.random() * 0.55;
      const y = 0.3 + Math.random() * 1.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSystem = new THREE.Points(particleGeo, this.materials.hologramParticle);
    this.group.add(this.particleSystem);

    // 4. Container for alien 3D geometric silhouettes
    this.wireframeGroup = new THREE.Group();
    this.wireframeGroup.position.set(0, 1.35, 0);
    this.group.add(this.wireframeGroup);
  }

  public setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  public setColor(hexColor: number): void {
    this.materials.hologramWireframe.color.setHex(hexColor);
    this.materials.hologramParticle.color.setHex(hexColor);
    (this.projectorCone.material as THREE.MeshBasicMaterial).color.setHex(hexColor);
    (this.ringMesh.material as THREE.MeshBasicMaterial).color.setHex(hexColor);
  }

  public setAlien(index: number, isUltimate: boolean = false): void {
    if (this.activeAlienIndex === index && this.wireframeGroup.children.length > 0) return;
    this.activeAlienIndex = index;

    // Clear previous silhouette
    while (this.wireframeGroup.children.length > 0) {
      const child = this.wireframeGroup.children[0];
      this.wireframeGroup.remove(child);
    }

    const alienModel = this.buildAlienHologram(index, isUltimate);
    this.wireframeGroup.add(alienModel);
  }

  private buildAlienHologram(index: number, isUltimate: boolean): THREE.Group {
    const group = new THREE.Group();
    const lineMat = this.materials.hologramWireframe;

    switch (index) {
      case 0: {
        // Swampfire: Fire flame silhouette + thorny vines
        const flamePoints: THREE.Vector3[] = [];
        const segments = 16;
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const y = t * 1.1;
          const r = Math.sin(t * Math.PI) * (0.35 + 0.1 * Math.sin(t * 12));
          flamePoints.push(new THREE.Vector3(r, y, 0));
        }
        for (let i = segments; i >= 0; i--) {
          const t = i / segments;
          const y = t * 1.1;
          const r = -Math.sin(t * Math.PI) * (0.35 + 0.1 * Math.sin(t * 12));
          flamePoints.push(new THREE.Vector3(r, y, 0));
        }
        const flameGeo = new THREE.BufferGeometry().setFromPoints(flamePoints);
        group.add(new THREE.Line(flameGeo, lineMat));

        // Cross petals
        const crossGeo = flameGeo.clone();
        crossGeo.rotateY(Math.PI / 2);
        group.add(new THREE.Line(crossGeo, lineMat));
        break;
      }
      case 1: {
        // Humungousaur: Heavy broad armored dinosaur crest with horns
        const crestPoints = [
          new THREE.Vector3(-0.4, 0, 0),
          new THREE.Vector3(-0.55, 0.45, 0),
          new THREE.Vector3(-0.3, 0.8, 0),
          new THREE.Vector3(-0.15, 1.05, 0), // horn tip left
          new THREE.Vector3(0, 0.85, 0),     // center dip
          new THREE.Vector3(0.15, 1.05, 0),  // horn tip right
          new THREE.Vector3(0.3, 0.8, 0),
          new THREE.Vector3(0.55, 0.45, 0),
          new THREE.Vector3(0.4, 0, 0),
          new THREE.Vector3(-0.4, 0, 0)
        ];
        const crestGeo = new THREE.BufferGeometry().setFromPoints(crestPoints);
        group.add(new THREE.Line(crestGeo, lineMat));

        // Spiked spine for ultimate
        if (isUltimate) {
          const spinePoints = [
            new THREE.Vector3(0, 0, -0.4),
            new THREE.Vector3(0, 0.5, -0.6),
            new THREE.Vector3(0, 1.1, -0.3),
            new THREE.Vector3(0, 0, -0.4)
          ];
          group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spinePoints), lineMat));
        }
        break;
      }
      case 2: {
        // Echo Echo: Sound wave rings / silicon amplifier speaker cone
        for (let r = 0.2; r <= 0.65; r += 0.15) {
          const ringGeo = new THREE.BufferGeometry();
          const pts: THREE.Vector3[] = [];
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 16) {
            pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r + 0.5, 0));
          }
          ringGeo.setFromPoints(pts);
          group.add(new THREE.Line(ringGeo, lineMat));
        }
        break;
      }
      case 3: {
        // Big Chill: Spectral moth wings and hooded face
        const wingPoints = [
          new THREE.Vector3(0, 0.2, 0),
          new THREE.Vector3(-0.7, 0.85, 0),
          new THREE.Vector3(-0.5, 1.15, 0),
          new THREE.Vector3(0, 0.7, 0),
          new THREE.Vector3(0.5, 1.15, 0),
          new THREE.Vector3(0.7, 0.85, 0),
          new THREE.Vector3(0, 0.2, 0)
        ];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wingPoints), lineMat));
        break;
      }
      case 4: {
        // Cannonbolt: Segmented spherical armored ball plates
        for (let lat = -45; lat <= 45; lat += 30) {
          const pts: THREE.Vector3[] = [];
          const phi = (lat * Math.PI) / 180;
          const r = Math.cos(phi) * 0.45;
          const y = Math.sin(phi) * 0.45 + 0.55;
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 16) {
            pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
          }
          group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
        }
        break;
      }
      default: {
        // Spidermonkey: 4-pointed spider arachnid insignia
        const spiderPoints = [
          new THREE.Vector3(0, 0.1, 0),
          new THREE.Vector3(-0.5, 0.35, 0),
          new THREE.Vector3(-0.35, 0.6, 0),
          new THREE.Vector3(-0.6, 0.85, 0),
          new THREE.Vector3(0, 0.7, 0),
          new THREE.Vector3(0.6, 0.85, 0),
          new THREE.Vector3(0.35, 0.6, 0),
          new THREE.Vector3(0.5, 0.35, 0),
          new THREE.Vector3(0, 0.1, 0)
        ];
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiderPoints), lineMat));
        break;
      }
    }

    return group;
  }

  public update(delta: number): void {
    if (!this.group.visible) return;

    // Gentle floating and rotation of hologram elements
    this.wireframeGroup.rotation.y += delta * 1.2;
    this.ringMesh.rotation.z += delta * 0.8;
    this.particleSystem.rotation.y += delta * 0.5;

    // Scanline pulse
    const scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.04;
    this.wireframeGroup.scale.set(scale, scale, scale);
  }
}

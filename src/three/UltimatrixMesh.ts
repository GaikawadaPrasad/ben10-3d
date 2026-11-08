import * as THREE from 'three';
import { createUltimatrixMaterials, type UltimatrixMaterials } from './materials';
import { HologramDisplay } from './HologramDisplay';
import { AlienSilhouetteTexture } from './AlienSilhouetteTexture';

export class UltimatrixMesh {
  public group: THREE.Group;
  public materials: UltimatrixMaterials;
  public hologram: HologramDisplay;
  public silhouetteTexture: AlienSilhouetteTexture;

  // Movable / animatable parts
  public coreGroup: THREE.Group;
  public dialRing!: THREE.Group;
  public hourglassGroup!: THREE.Group;
  public dialDisplayMesh!: THREE.Mesh;
  public spikes: THREE.Mesh[] = [];
  public corePointLight: THREE.PointLight;

  // Animation values
  private currentElevation: number = 0;
  private targetElevation: number = 0;
  private currentDialRotation: number = 0;
  private targetDialRotation: number = 0;
  private currentSpikeExtension: number = 0;
  private targetSpikeExtension: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.materials = createUltimatrixMaterials();
    this.hologram = new HologramDisplay(this.materials);
    this.silhouetteTexture = new AlienSilhouetteTexture();

    // 1. Forearm Gauntlet Body
    this.buildGauntletBody();

    // 2. Central Housing Unit
    this.buildHousingUnit();

    // 3. Elevating Pop-up Core
    this.coreGroup = new THREE.Group();
    this.buildCoreDial();
    this.group.add(this.coreGroup);

    // 4. Retractable Evolutionary Spikes (4 around the dial)
    this.buildUltimateSpikes();

    // 5. Dynamic Core Point Light
    this.corePointLight = new THREE.PointLight(0x00ff66, 3, 4);
    this.corePointLight.position.set(0, 0.8, 0);
    this.group.add(this.corePointLight);

    // 6. Hologram projection attached to elevating core
    this.coreGroup.add(this.hologram.group);
  }

  private buildGauntletBody(): void {
    // Forearm main sleeve (tapered ergonomic rounded box)
    const sleeveLength = 4.8;
    const sleeveWidth = 2.4;
    const sleeveHeight = 1.6;

    const sleeveGeo = new THREE.BoxGeometry(sleeveWidth, sleeveHeight, sleeveLength, 12, 8, 24);
    // Ergonomically curve and taper the sleeve (larger at forearm back z=-2, smaller at wrist z=+2)
    const pos = sleeveGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const taper = 1.0 - (z / sleeveLength) * 0.22; // tapered towards wrist
      pos.setX(i, pos.getX(i) * taper);
      pos.setY(i, pos.getY(i) * (taper * 0.95) - 0.2); // slight downward wrist curve
    }
    sleeveGeo.computeVertexNormals();

    const sleeveMesh = new THREE.Mesh(sleeveGeo, this.materials.gauntletDark);
    sleeveMesh.position.set(0, -0.65, 0);
    this.group.add(sleeveMesh);

    // Green Galvan Armor Top Plates
    const plateGeo = new THREE.BoxGeometry(2.1, 0.25, 3.8);
    const plateMesh = new THREE.Mesh(plateGeo, this.materials.gauntletGreen);
    plateMesh.position.set(0, 0.15, -0.2);
    this.group.add(plateMesh);

    // Silver Accent Bands & Wrist Clasp
    const claspGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.35, 32, 1, true);
    claspGeo.rotateX(Math.PI / 2);
    const claspMesh = new THREE.Mesh(claspGeo, this.materials.accentSilver);
    claspMesh.position.set(0, -0.6, 1.8);
    this.group.add(claspMesh);

    // Glowing Circuitry Grooves along the gauntlet sides
    const circuitGeoL = new THREE.BoxGeometry(0.08, 0.1, 3.4);
    const circuitMeshL = new THREE.Mesh(circuitGeoL, this.materials.circuitLine);
    circuitMeshL.position.set(-1.08, 0.18, -0.2);
    this.group.add(circuitMeshL);

    const circuitMeshR = circuitMeshL.clone();
    circuitMeshR.position.x = 1.08;
    this.group.add(circuitMeshR);
  }

  private buildHousingUnit(): void {
    // Raised circular bevel collar around the dial
    const collarGeo = new THREE.CylinderGeometry(1.4, 1.55, 0.45, 48);
    const collarMesh = new THREE.Mesh(collarGeo, this.materials.coreHousing);
    collarMesh.position.set(0, 0.3, 0);
    this.group.add(collarMesh);

    // Outer Silver Trim Ring
    const silverRingGeo = new THREE.TorusGeometry(1.42, 0.08, 16, 48);
    silverRingGeo.rotateX(Math.PI / 2);
    const silverRing = new THREE.Mesh(silverRingGeo, this.materials.accentSilver);
    silverRing.position.set(0, 0.5, 0);
    this.group.add(silverRing);

    // 4 Green Corner Nodes on the collar
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const nodeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
      const nodeMesh = new THREE.Mesh(nodeGeo, this.materials.circuitLine);
      nodeMesh.position.set(Math.cos(angle) * 1.35, 0.5, Math.sin(angle) * 1.35);
      this.group.add(nodeMesh);
    }
  }

  private buildCoreDial(): void {
    // Elevating core group starts at base height
    this.coreGroup.position.set(0, 0.45, 0);

    // Core cylinder barrel
    const barrelGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.4, 48);
    const barrelMesh = new THREE.Mesh(barrelGeo, this.materials.dialRing);
    this.coreGroup.add(barrelMesh);

    // Dial Rotator Group (rotates when user selects alien)
    this.dialRing = new THREE.Group();
    this.coreGroup.add(this.dialRing);

    // Dial Top Bezel Face
    const faceGeo = new THREE.CylinderGeometry(1.08, 1.08, 0.08, 48);
    const faceMesh = new THREE.Mesh(faceGeo, this.materials.dialFace);
    faceMesh.position.set(0, 0.22, 0);
    this.dialRing.add(faceMesh);

    // Dial Display Screen Mesh (shows alien silhouette / dynamic dial face)
    const displayGeo = new THREE.CircleGeometry(0.96, 48);
    displayGeo.rotateX(-Math.PI / 2);
    const displayMat = new THREE.MeshStandardMaterial({
      map: this.silhouetteTexture.texture,
      emissiveMap: this.silhouetteTexture.texture,
      emissive: 0xffffff,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true
    });
    this.dialDisplayMesh = new THREE.Mesh(displayGeo, displayMat);
    this.dialDisplayMesh.position.set(0, 0.265, 0);
    this.dialRing.add(this.dialDisplayMesh);

    // Invisible hit collider encompassing dial and hologram for responsive clicking
    const hitGeo = new THREE.CylinderGeometry(1.35, 1.35, 2.0, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const clickProxy = new THREE.Mesh(hitGeo, hitMat);
    clickProxy.position.set(0, 0.9, 0);
    this.coreGroup.add(clickProxy);

    // Hourglass / Interlocked Triangles 3D Emblem Group
    this.hourglassGroup = new THREE.Group();
    this.dialRing.add(this.hourglassGroup);
    this.buildHourglassEmblem(this.hourglassGroup);
  }

  private buildHourglassEmblem(parent: THREE.Group): void {
    // The iconic Omnitrix/Ultimatrix interlocked triangles
    const triangleShape1 = new THREE.Shape();
    triangleShape1.moveTo(-0.55, 0.5);
    triangleShape1.lineTo(0.55, 0.5);
    triangleShape1.lineTo(0, 0.02);
    triangleShape1.closePath();

    const triangleShape2 = new THREE.Shape();
    triangleShape2.moveTo(-0.55, -0.5);
    triangleShape2.lineTo(0.55, -0.5);
    triangleShape2.lineTo(0, -0.02);
    triangleShape2.closePath();

    const extrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03
    };

    const triGeo1 = new THREE.ExtrudeGeometry(triangleShape1, extrudeSettings);
    triGeo1.rotateX(Math.PI / 2);
    const triMesh1 = new THREE.Mesh(triGeo1, this.materials.hourglassSymbol);
    triMesh1.position.set(0, 0.26, 0);
    parent.add(triMesh1);

    const triGeo2 = new THREE.ExtrudeGeometry(triangleShape2, extrudeSettings);
    triGeo2.rotateX(Math.PI / 2);
    const triMesh2 = new THREE.Mesh(triGeo2, this.materials.hourglassSymbol);
    triMesh2.position.set(0, 0.26, 0);
    parent.add(triMesh2);

    // Darker complementary triangles completing the circular emblem
    const compShape1 = new THREE.Shape();
    compShape1.moveTo(-0.58, 0.45);
    compShape1.lineTo(-0.04, 0);
    compShape1.lineTo(-0.58, -0.45);
    compShape1.closePath();

    const compGeo1 = new THREE.ExtrudeGeometry(compShape1, extrudeSettings);
    compGeo1.rotateX(Math.PI / 2);
    const compMesh1 = new THREE.Mesh(compGeo1, this.materials.dialFace);
    compMesh1.position.set(0, 0.25, 0);
    parent.add(compMesh1);

    const compShape2 = new THREE.Shape();
    compShape2.moveTo(0.58, 0.45);
    compShape2.lineTo(0.04, 0);
    compShape2.lineTo(0.58, -0.45);
    compShape2.closePath();

    const compGeo2 = new THREE.ExtrudeGeometry(compShape2, extrudeSettings);
    compGeo2.rotateX(Math.PI / 2);
    const compMesh2 = new THREE.Mesh(compGeo2, this.materials.dialFace);
    compMesh2.position.set(0, 0.25, 0);
    parent.add(compMesh2);
  }

  private buildUltimateSpikes(): void {
    // 4 Retractable angled spikes around the housing perimeter
    const spikeGeo = new THREE.ConeGeometry(0.18, 0.9, 4);
    spikeGeo.rotateX(Math.PI / 2); // Pointing outward

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const spike = new THREE.Mesh(spikeGeo, this.materials.ultimateSpike);
      
      // Orient spike outwards from center
      spike.rotation.y = -angle + Math.PI / 2;
      spike.position.set(Math.cos(angle) * 1.35, 0.45, Math.sin(angle) * 1.35);

      this.spikes.push(spike);
      this.group.add(spike);
    }
  }

  // Animation setters
  public setElevationTarget(target: number): void {
    this.targetElevation = target; // 0 = flush, 1 = elevated
  }

  public setRotationTarget(angleRad: number): void {
    this.targetDialRotation = angleRad;
  }

  public setSpikeTarget(target: number): void {
    this.targetSpikeExtension = target; // 0 = retracted, 1 = extended
  }

  public setModeVisuals(mode: string, isUltimate: boolean, alienIndex: number = 0): void {
    // Update dynamic dial face canvas texture
    this.silhouetteTexture.render(mode, alienIndex, isUltimate);

    if (mode === 'COOLDOWN') {
      this.hourglassGroup.visible = true;
      this.materials.hourglassSymbol.color.setHex(0xff2200);
      this.materials.hourglassSymbol.emissive.setHex(0xff2200);
      this.materials.circuitLine.emissive.setHex(0xff2200);
      this.corePointLight.color.setHex(0xff2200);
      this.setElevationTarget(0);
      this.setSpikeTarget(0);
      this.hologram.setVisible(false);
    } else if (isUltimate || mode === 'ULTIMATE_MODE') {
      this.hourglassGroup.visible = false; // Show ultimate alien silhouette on dial
      this.materials.hourglassSymbol.color.setHex(0xff1122);
      this.materials.hourglassSymbol.emissive.setHex(0xff1122);
      this.materials.circuitLine.emissive.setHex(0xff4400);
      this.corePointLight.color.setHex(0xff1122);
      this.setElevationTarget(1);
      this.setSpikeTarget(1);
      this.hologram.setColor(0xff2233);
      this.hologram.setVisible(true);
    } else if (mode === 'ACTIVE_SELECTION') {
      // IN ACTIVE SELECTION: Hide 3D hourglass so the alien silhouette shines through the dial!
      this.hourglassGroup.visible = false;
      this.materials.circuitLine.emissive.setHex(0x00ff66);
      this.corePointLight.color.setHex(0x00ff66);
      this.setElevationTarget(1);
      this.setSpikeTarget(0);
      this.hologram.setColor(0x00ff88);
      this.hologram.setVisible(true);
    } else if (mode === 'TRANSFORMED') {
      this.hourglassGroup.visible = true;
      this.materials.hourglassSymbol.color.setHex(0x00ff66);
      this.materials.hourglassSymbol.emissive.setHex(0x00ff66);
      this.corePointLight.color.setHex(0x00ff66);
      this.setElevationTarget(0.3);
      this.setSpikeTarget(0);
      this.hologram.setVisible(false);
    } else {
      // STANDBY
      this.hourglassGroup.visible = true;
      this.materials.hourglassSymbol.color.setHex(0x00ff66);
      this.materials.hourglassSymbol.emissive.setHex(0x00ff66);
      this.materials.circuitLine.emissive.setHex(0x00ff66);
      this.corePointLight.color.setHex(0x00ff66);
      this.setElevationTarget(0);
      this.setSpikeTarget(0);
      this.hologram.setVisible(false);
    }
  }

  public update(delta: number): void {
    // 1. Smooth interpolation for elevation (spring pop-up)
    const elevSpeed = 10.0;
    this.currentElevation += (this.targetElevation - this.currentElevation) * Math.min(1, delta * elevSpeed);
    this.coreGroup.position.y = 0.45 + this.currentElevation * 0.65;

    // 2. Smooth dial rotation
    const rotSpeed = 12.0;
    this.currentDialRotation += (this.targetDialRotation - this.currentDialRotation) * Math.min(1, delta * rotSpeed);
    this.dialRing.rotation.y = this.currentDialRotation;

    // 3. Smooth spike extension
    const spikeSpeed = 8.0;
    this.currentSpikeExtension += (this.targetSpikeExtension - this.currentSpikeExtension) * Math.min(1, delta * spikeSpeed);
    for (let i = 0; i < this.spikes.length; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const dist = 1.35 + this.currentSpikeExtension * 0.55;
      this.spikes[i].position.set(Math.cos(angle) * dist, 0.45, Math.sin(angle) * dist);
    }

    // 4. Update core point light position to match elevated core
    this.corePointLight.position.y = this.coreGroup.position.y + 0.35;

    // 5. Update hologram
    this.hologram.update(delta);
  }
}

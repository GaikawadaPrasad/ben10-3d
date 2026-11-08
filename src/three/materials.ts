import * as THREE from 'three';

export interface UltimatrixMaterials {
  gauntletDark: THREE.MeshStandardMaterial;
  gauntletGreen: THREE.MeshStandardMaterial;
  accentSilver: THREE.MeshStandardMaterial;
  coreHousing: THREE.MeshStandardMaterial;
  dialRing: THREE.MeshStandardMaterial;
  dialFace: THREE.MeshStandardMaterial;
  hourglassSymbol: THREE.MeshStandardMaterial;
  circuitLine: THREE.MeshStandardMaterial;
  ultimateSpike: THREE.MeshStandardMaterial;
  hologramWireframe: THREE.LineBasicMaterial;
  hologramParticle: THREE.PointsMaterial;
}

export function createUltimatrixMaterials(): UltimatrixMaterials {
  return {
    gauntletDark: new THREE.MeshStandardMaterial({
      color: 0x141816,
      metalness: 0.85,
      roughness: 0.35,
      envMapIntensity: 1.2
    }),
    gauntletGreen: new THREE.MeshStandardMaterial({
      color: 0x184224,
      metalness: 0.65,
      roughness: 0.28,
      envMapIntensity: 1.0
    }),
    accentSilver: new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.8
    }),
    coreHousing: new THREE.MeshStandardMaterial({
      color: 0x0d1210,
      metalness: 0.9,
      roughness: 0.25
    }),
    dialRing: new THREE.MeshStandardMaterial({
      color: 0x8a9296,
      metalness: 0.85,
      roughness: 0.2
    }),
    dialFace: new THREE.MeshStandardMaterial({
      color: 0x050806,
      metalness: 0.5,
      roughness: 0.2
    }),
    hourglassSymbol: new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    }),
    circuitLine: new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00ff66,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.1
    }),
    ultimateSpike: new THREE.MeshStandardMaterial({
      color: 0x3a3d40,
      metalness: 0.92,
      roughness: 0.18
    }),
    hologramWireframe: new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    }),
    hologramParticle: new THREE.PointsMaterial({
      color: 0x00ffaa,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    })
  };
}

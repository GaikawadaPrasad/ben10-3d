import { describe, it, expect, beforeEach } from 'vitest';
import { UltimatrixMesh } from '../src/three/UltimatrixMesh';

describe('UltimatrixMesh 3D Procedural Model', () => {
  let ultimatrixMesh: UltimatrixMesh;

  beforeEach(() => {
    ultimatrixMesh = new UltimatrixMesh();
  });

  it('builds the complete gauntlet hierarchy with core, dial, and 4 ultimate spikes', () => {
    expect(ultimatrixMesh.group).toBeDefined();
    expect(ultimatrixMesh.coreGroup).toBeDefined();
    expect(ultimatrixMesh.dialRing).toBeDefined();
    expect(ultimatrixMesh.spikes.length).toBe(4);
    expect(ultimatrixMesh.hologram).toBeDefined();
    expect(ultimatrixMesh.corePointLight).toBeDefined();
  });

  it('starts with core in flush standby position and spikes retracted', () => {
    ultimatrixMesh.update(0.016);
    expect(ultimatrixMesh.coreGroup.position.y).toBeCloseTo(0.45, 1);
    expect(ultimatrixMesh.hologram.group.visible).toBe(false);
  });

  it('elevates core when setElevationTarget(1) is updated', () => {
    ultimatrixMesh.setElevationTarget(1);
    // Simulate several frames
    for (let i = 0; i < 20; i++) {
      ultimatrixMesh.update(0.033);
    }
    expect(ultimatrixMesh.coreGroup.position.y).toBeGreaterThan(0.9);
  });

  it('extends 4 ultimate spikes outward when setSpikeTarget(1) is updated', () => {
    ultimatrixMesh.setSpikeTarget(1);
    for (let i = 0; i < 20; i++) {
      ultimatrixMesh.update(0.033);
    }
    // Check spike 0 distance from origin
    const spike0 = ultimatrixMesh.spikes[0];
    const dist = Math.sqrt(spike0.position.x * spike0.position.x + spike0.position.z * spike0.position.z);
    expect(dist).toBeGreaterThan(1.7);
  });

  it('switches visuals and colors appropriately for ULTIMATE_MODE and ACTIVE_SELECTION', () => {
    ultimatrixMesh.setModeVisuals('ACTIVE_SELECTION', false);
    expect(ultimatrixMesh.hologram.group.visible).toBe(true);

    ultimatrixMesh.setModeVisuals('ULTIMATE_MODE', true);
    expect(ultimatrixMesh.hologram.group.visible).toBe(true);
    expect(ultimatrixMesh.materials.hourglassSymbol.emissive.getHexString()).toBe('ff1122');
  });
});

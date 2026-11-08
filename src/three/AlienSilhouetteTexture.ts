import * as THREE from 'three';

export class AlienSilhouetteTexture {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  public texture: THREE.CanvasTexture | THREE.Texture;

  constructor() {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 512;
      this.canvas.height = 512;
      this.ctx = this.canvas.getContext('2d');
      this.texture = new THREE.CanvasTexture(this.canvas);
      this.texture.colorSpace = THREE.SRGBColorSpace;
      this.render('STANDBY', 0, false);
    } else {
      this.texture = new THREE.Texture();
    }
  }

  public render(mode: string, alienIndex: number, isUltimate: boolean): void {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = 512;
    const h = 512;
    const cx = w / 2;
    const cy = h / 2;

    // Background: deep dark Galvan carbon dial
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#060b08';
    ctx.beginPath();
    ctx.arc(cx, cy, 250, 0, Math.PI * 2);
    ctx.fill();

    const glowColor = isUltimate ? '#ff1122' : mode === 'COOLDOWN' ? '#ff3300' : '#00ff66';
    const dimGlow = isUltimate ? 'rgba(255, 17, 34, 0.25)' : 'rgba(0, 255, 102, 0.25)';

    // Outer decorative Galvan dial ring
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 6;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Dial tick notches
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const r1 = 220;
      const r2 = i % 3 === 0 ? 195 : 208;
      ctx.lineWidth = i % 3 === 0 ? 6 : 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.stroke();
    }

    if (mode === 'STANDBY' || mode === 'TRANSFORMED') {
      // Classic Hourglass / Interlocked Triangles
      ctx.fillStyle = glowColor;
      ctx.shadowBlur = 24;

      // Top triangle
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy - 130);
      ctx.lineTo(cx + 100, cy - 130);
      ctx.lineTo(cx, cy - 10);
      ctx.closePath();
      ctx.fill();

      // Bottom triangle
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy + 130);
      ctx.lineTo(cx + 100, cy + 130);
      ctx.lineTo(cx, cy + 10);
      ctx.closePath();
      ctx.fill();

      // Complementary black inner wedges
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#060b08';
      ctx.beginPath();
      ctx.moveTo(cx - 110, cy - 110);
      ctx.lineTo(cx - 12, cy);
      ctx.lineTo(cx - 110, cy + 110);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 110, cy - 110);
      ctx.lineTo(cx + 12, cy);
      ctx.lineTo(cx + 110, cy + 110);
      ctx.closePath();
      ctx.fill();
    } else {
      // ACTIVE SELECTION or ULTIMATE MODE:
      // Show glowing circular holographic display with ALIEN SILHOUETTE
      ctx.fillStyle = dimGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw vector alien silhouette
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 20;
      ctx.fillStyle = glowColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      this.drawAlienSilhouette(ctx, cx, cy, alienIndex, isUltimate);
    }

    this.texture.needsUpdate = true;
  }

  private drawAlienSilhouette(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    index: number,
    isUltimate: boolean
  ): void {
    ctx.save();
    ctx.translate(cx, cy);

    switch (index) {
      case 0:
        // Swampfire: Flame crested head with thorny vines
        ctx.beginPath();
        ctx.moveTo(0, -110);
        ctx.bezierCurveTo(40, -80, 50, -40, 30, -10);
        ctx.bezierCurveTo(70, -20, 85, 30, 50, 70);
        ctx.bezierCurveTo(40, 100, 15, 110, 0, 115);
        ctx.bezierCurveTo(-15, 110, -40, 100, -50, 70);
        ctx.bezierCurveTo(-85, 30, -70, -20, -30, -10);
        ctx.bezierCurveTo(-50, -40, -40, -80, 0, -110);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 1:
        // Humungousaur: Massive armored dinosaur skull crest with horns
        ctx.beginPath();
        ctx.moveTo(0, -90);
        ctx.lineTo(25, -120); // right horn
        ctx.lineTo(45, -80);
        ctx.lineTo(85, -40);
        ctx.lineTo(95, 20);
        ctx.lineTo(60, 95);
        ctx.lineTo(0, 115);
        ctx.lineTo(-60, 95);
        ctx.lineTo(-95, 20);
        ctx.lineTo(-85, -40);
        ctx.lineTo(-45, -80);
        ctx.lineTo(-25, -120); // left horn
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (isUltimate) {
          // Extra spikes
          ctx.beginPath();
          ctx.moveTo(-110, -10);
          ctx.lineTo(-70, 20);
          ctx.lineTo(-100, 50);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(110, -10);
          ctx.lineTo(70, 20);
          ctx.lineTo(100, 50);
          ctx.fill();
        }
        break;

      case 2:
        // Echo Echo: Silicon sound amplifier with speaker headphones
        ctx.beginPath();
        // Head
        ctx.arc(0, -15, 55, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Left Ear Speaker
        ctx.beginPath();
        ctx.arc(-70, -15, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Right Ear Speaker
        ctx.beginPath();
        ctx.arc(70, -15, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Sonic mouth cone
        ctx.beginPath();
        ctx.arc(0, 55, 35, 0, Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case 3:
        // Big Chill: Hooded ghost with spectral moth wings
        ctx.beginPath();
        ctx.moveTo(0, -115);
        ctx.lineTo(95, -50);
        ctx.lineTo(110, 40);
        ctx.lineTo(45, 95);
        ctx.lineTo(0, 75);
        ctx.lineTo(-45, 95);
        ctx.lineTo(-110, 40);
        ctx.lineTo(-95, -50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Eyes
        ctx.fillStyle = '#060b08';
        ctx.beginPath();
        ctx.ellipse(-25, -20, 12, 22, -0.2, 0, Math.PI * 2);
        ctx.ellipse(25, -20, 12, 22, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 4:
        // Cannonbolt: Segmented spherical rolling armor shell
        ctx.beginPath();
        ctx.arc(0, 0, 85, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Shell segments
        ctx.fillStyle = '#060b08';
        ctx.beginPath();
        ctx.arc(-35, -25, 28, 0, Math.PI * 2);
        ctx.arc(35, -25, 28, 0, Math.PI * 2);
        ctx.fill();
        break;

      default:
        // Spidermonkey: 4-eyed arachnid mask with fangs
        ctx.beginPath();
        ctx.moveTo(0, -95);
        ctx.lineTo(45, -60);
        ctx.lineTo(80, -20);
        ctx.lineTo(75, 45);
        ctx.lineTo(35, 95);
        ctx.lineTo(0, 80);
        ctx.lineTo(-35, 95);
        ctx.lineTo(-75, 45);
        ctx.lineTo(-80, -20);
        ctx.lineTo(-45, -60);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // 4 Eyes
        ctx.fillStyle = '#060b08';
        ctx.beginPath();
        ctx.arc(-22, -25, 10, 0, Math.PI * 2);
        ctx.arc(22, -25, 10, 0, Math.PI * 2);
        ctx.arc(-16, 5, 8, 0, Math.PI * 2);
        ctx.arc(16, 5, 8, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}

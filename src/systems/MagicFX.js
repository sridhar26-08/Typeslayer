import { PALETTE } from '../config.js';

/** Lightweight procedural effects. Objects are tweened then destroyed; no texture sheets required. */
export class MagicFX {
  constructor(scene) { this.scene = scene; }

  burst(x, y, color = PALETTE.cyan, count = 12, scale = 1) {
    for (let i = 0; i < count; i++) {
      const particle = this.scene.add.circle(x, y, Phaser.Math.Between(2, 5) * scale, color, Phaser.Math.FloatBetween(0.55, 1)).setDepth(10);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(32, 115) * scale;
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance,
        alpha: 0, scale: 0.15, rotation: Phaser.Math.FloatBetween(-4, 4),
        duration: Phaser.Math.Between(220, 460), ease: 'Cubic.out', onComplete: () => particle.destroy(),
      });
    }
  }

  beam(fromX, fromY, toX, toY, color = PALETTE.cyan) {
    const bolt = this.scene.add.graphics().setDepth(9);
    bolt.lineStyle(10, color, 0.15).lineBetween(fromX, fromY, toX, toY);
    bolt.lineStyle(4, color, 0.9).lineBetween(fromX, fromY, toX, toY);
    bolt.lineStyle(1, 0xffffff, 0.95).lineBetween(fromX, fromY, toX, toY);
    this.scene.tweens.add({ targets: bolt, alpha: 0, duration: 135, ease: 'Quad.out', onComplete: () => bolt.destroy() });
  }

  ring(x, y, color = PALETTE.cyan, size = 1) {
    const ring = this.scene.add.circle(x, y, 16 * size).setStrokeStyle(3, color, 0.9).setFillStyle(color, 0.13).setDepth(10);
    this.scene.tweens.add({ targets: ring, scale: 5.3, alpha: 0, duration: 240, ease: 'Quad.out', onComplete: () => ring.destroy() });
  }

  floatingText(x, y, label, color = '#ffffff') {
    const text = this.scene.add.text(x, y, label, { fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', color, stroke: '#0a0610', strokeThickness: 4 }).setOrigin(0.5).setDepth(12);
    this.scene.tweens.add({ targets: text, y: y - 44, alpha: 0, duration: 620, ease: 'Cubic.out', onComplete: () => text.destroy() });
  }
}

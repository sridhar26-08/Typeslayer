import { ARENA, POWERUPS } from '../config.js';

export class Powerup {
  constructor(scene, x, y, kind) {
    this.scene = scene;
    this.kind = kind ?? Phaser.Utils.Array.GetRandom(POWERUPS);
    this.alive = true;
    this.age = 0;
    const glow = scene.add.circle(0, 0, 28, this.kind.color, 0.12);
    const rim = scene.add.circle(0, 0, 13).setStrokeStyle(2, this.kind.color, 0.95).setFillStyle(this.kind.color, 0.24);
    const glyph = scene.add.text(0, -1, this.kind.id === 'freeze' ? '❄' : this.kind.id === 'nova' ? '✦' : '✚', { fontSize: '17px', color: '#ffffff' }).setOrigin(0.5);
    const label = scene.add.text(0, 27, this.kind.label, { fontFamily: 'monospace', fontSize: '8px', color: '#e9e2fa' }).setOrigin(0.5);
    this.container = scene.add.container(x, y, [glow, rim, glyph, label]).setDepth(7);
  }

  update(time, delta) {
    if (!this.alive) return;
    this.age += delta;
    this.container.y += Math.sin(time / 260) * 0.18;
    this.container.rotation += delta / 2400;
    const distance = Phaser.Math.Distance.Between(this.container.x, this.container.y, ARENA.centerX, ARENA.centerY);
    if (distance < 52) this.collect();
    if (this.age > 10000) this.destroy();
  }

  collect() {
    if (!this.alive) return;
    this.alive = false;
    this.scene.activatePowerup(this.kind);
    this.scene.tweens.add({ targets: this.container, alpha: 0, scale: 1.8, duration: 150, onComplete: () => this.container.destroy() });
  }

  destroy() { if (this.alive) { this.alive = false; this.container.destroy(); } }
}

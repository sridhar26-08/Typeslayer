import { ARENA, PALETTE } from '../config.js';

/** A short-lived reward pickup that visibly travels into the Spellwarden. */
export class ArcaneCoin {
  constructor(scene, x, y) {
    this.scene = scene;
    this.age = 0;
    this.alive = true;
    const glow = scene.add.circle(0, 0, 14, PALETTE.gold, 0.12);
    const rim = scene.add.circle(0, 0, 7, PALETTE.gold, 0.95);
    const mark = scene.add.text(0, -1, '✦', { fontFamily: 'Georgia', fontSize: '11px', color: '#fff2bd' }).setOrigin(0.5);
    this.container = scene.add.container(x, y, [glow, rim, mark]).setDepth(7);
    this.velocity = new Phaser.Math.Vector2(Phaser.Math.Between(-38, 38), Phaser.Math.Between(-52, -12));
  }

  update(delta) {
    if (!this.alive) return;
    this.age += delta;
    const dt = delta / 1000;
    const dx = ARENA.centerX - this.container.x;
    const dy = ARENA.centerY - this.container.y;
    const distance = Math.max(1, Math.hypot(dx, dy));

    if (this.age > 240) {
      const pull = Math.min(780, 30000 / distance);
      this.velocity.x += (dx / distance) * pull * dt;
      this.velocity.y += (dy / distance) * pull * dt;
    } else {
      this.velocity.y += 95 * dt;
    }
    this.container.x += this.velocity.x * dt;
    this.container.y += this.velocity.y * dt;
    this.container.rotation += 3.5 * dt;

    if (distance < 45 && this.age > 240) this.collect();
  }

  collect() {
    if (!this.alive) return;
    this.alive = false;
    this.scene.events.emit('coin-collected');
    this.scene.tweens.add({
      targets: this.container, alpha: 0, scale: 1.8, duration: 110, ease: 'Sine.out', onComplete: () => this.container.destroy(),
    });
  }
}

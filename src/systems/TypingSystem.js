import { ARENA } from '../config.js';

/**
 * Owns keyboard input and the target lock. Combat consequences are deliberately
 * emitted as events so this system remains independent of how enemies are killed.
 */
export class TypingSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeTarget = null;
    this.progress = 0;
    this.enabled = true;
    this.onKeyDown = this.onKeyDown.bind(this);
    scene.input.keyboard.on('keydown', this.onKeyDown);
  }

  onKeyDown(event) {
    if (!this.enabled) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    const letter = event.key.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;
    event.preventDefault();

    if (!this.isValidTarget(this.activeTarget)) this.clearTarget();
    if (!this.activeTarget) {
      this.acquireTarget(letter);
      return;
    }

    const expected = this.activeTarget.spell[this.progress];
    if (letter !== expected) {
      this.activeTarget.flashMistake();
      this.scene.events.emit('typing-error');
      return;
    }

    this.progress += 1;
    this.activeTarget.setProgress(this.progress);
    this.scene.events.emit('letter-correct', this.activeTarget, this.progress);

    if (this.progress === this.activeTarget.spell.length) {
      const completed = this.activeTarget;
      completed.markSpellComplete();
      this.clearTarget();
      this.scene.events.emit('spell-complete', completed);
    }
  }

  acquireTarget(letter) {
    const candidates = this.scene.enemies.filter((enemy) => (
      this.isValidTarget(enemy) && enemy.spell[0] === letter
    ));
    candidates.sort((a, b) => this.distanceToCore(a) - this.distanceToCore(b));
    if (!candidates.length) {
      this.scene.events.emit('typing-error');
      return;
    }

    this.activeTarget = candidates[0];
    this.progress = 0;
    this.activeTarget.setTargeted(true);
    // The selection key is also the first correct character.
    this.onKeyDown({ key: letter, ctrlKey: false, metaKey: false, altKey: false, preventDefault() {} });
  }

  distanceToCore(enemy) {
    return Phaser.Math.Distance.Between(enemy.container.x, enemy.container.y, ARENA.centerX, ARENA.centerY);
  }

  isValidTarget(enemy) { return Boolean(enemy?.alive && !enemy.spellComplete); }

  clearTarget() {
    if (this.activeTarget?.alive) this.activeTarget.setTargeted(false);
    this.activeTarget = null;
    this.progress = 0;
  }

  destroy() { this.scene.input.keyboard.off('keydown', this.onKeyDown); }
}

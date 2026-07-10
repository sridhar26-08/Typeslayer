import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from '../config.js';

export class LoadingScene extends Phaser.Scene {
  constructor() { super('loading'); }

  create() {
    this.cameras.main.setBackgroundColor(PALETTE.ink);
    this.add.circle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 48, 62, PALETTE.violet, 0.12).setStrokeStyle(2, PALETTE.cyan, 0.75);
    const mark = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 48, '✦', { fontSize: '42px', color: '#e9ddff' }).setOrigin(0.5);
    this.tweens.add({ targets: mark, rotation: Math.PI * 2, duration: 1300, repeat: -1, ease: 'Linear' });
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 65, 'AWAKENING THE GRIMOIRE', { fontFamily: 'Georgia', fontSize: '19px', fontStyle: 'bold', color: '#e9ddff', letterSpacing: 3 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, 'THE KEYBOARD IS YOUR WEAPON', { fontFamily: 'monospace', fontSize: '10px', color: '#8bf3dc', letterSpacing: 2 }).setOrigin(0.5);
    this.time.delayedCall(850, () => this.scene.start('menu'));
  }
}

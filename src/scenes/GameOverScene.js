import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from '../config.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('game-over'); }
  init(data) { this.result = data; }

  create() {
    this.cameras.main.setBackgroundColor(0x080711);
    const g = this.add.graphics();
    g.fillStyle(0x080711, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x21102a, 0.84).fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 360);
    g.lineStyle(2, PALETTE.red, 0.38).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 240).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 400);
    this.add.text(GAME_WIDTH / 2, 225, 'THE WARD HAS FALLEN', { fontFamily: 'Georgia', fontSize: '47px', fontStyle: 'bold', color: '#ffd7e1', letterSpacing: 4 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 290, 'THE VOID REMEMBERS YOUR NAME', { fontFamily: 'monospace', fontSize: '11px', color: '#d3a1ae', letterSpacing: 2 }).setOrigin(0.5);
    this.add.rectangle(GAME_WIDTH / 2, 428, 515, 172, 0x171129, 0.96).setStrokeStyle(1.5, PALETTE.violet, 0.78);
    this.add.text(GAME_WIDTH / 2, 364, `FINAL SCORE\n${String(this.result.score).padStart(6, '0')}`, { fontFamily: 'Georgia', fontSize: '24px', fontStyle: 'bold', color: '#f3eaff', align: 'center', lineSpacing: 9 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 478, `WAVE ${this.result.wave}     ·     ${this.result.slayed} SLAIN`, { fontFamily: 'monospace', fontSize: '12px', color: '#8bf3dc', letterSpacing: 2 }).setOrigin(0.5);
    this.button(592, 'CAST AGAIN', () => this.scene.start('arena'), true);
    this.button(657, 'RETURN TO GRIMOIRE', () => this.scene.start('menu'));
    this.input.keyboard.once('keydown-R', () => this.scene.start('arena'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('arena'));
  }

  button(y, label, action, accent = false) {
    const box = this.add.rectangle(GAME_WIDTH / 2, y, 332, 50, accent ? PALETTE.violet : 0x171129, 0.96).setStrokeStyle(1.5, accent ? PALETTE.cyan : PALETTE.violet, 0.86).setInteractive({ useHandCursor: true });
    const text = this.add.text(GAME_WIDTH / 2, y, label, { fontFamily: 'monospace', fontSize: '13px', color: '#f6f0ff', letterSpacing: 2 }).setOrigin(0.5);
    box.on('pointerover', () => box.setFillStyle(0x2c2050)); box.on('pointerout', () => box.setFillStyle(accent ? PALETTE.violet : 0x171129)); box.on('pointerdown', action);
    return text;
  }
}

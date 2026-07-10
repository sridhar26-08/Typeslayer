import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from '../config.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }

  create() { this.showMain(); }

  clearScreen() { this.children.removeAll(true); }

  drawBackdrop() {
    this.cameras.main.setBackgroundColor(PALETTE.ink);
    const g = this.add.graphics();
    g.fillStyle(PALETTE.ink, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(0x15102b, 1).fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 430);
    g.lineStyle(2, PALETTE.violet, 0.32).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 180).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 330).strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 510);
    for (let i = 0; i < 100; i++) g.fillStyle(i % 4 ? 0xbfb0e8 : PALETTE.cyan, Phaser.Math.FloatBetween(0.08, 0.36)).fillCircle(Phaser.Math.Between(0, GAME_WIDTH), Phaser.Math.Between(0, GAME_HEIGHT), Phaser.Math.FloatBetween(0.5, 1.7));
  }

  button(y, text, action, accent = false) {
    const box = this.add.rectangle(GAME_WIDTH / 2, y, 332, 50, accent ? PALETTE.violet : 0x171129, 0.96).setStrokeStyle(1.5, accent ? PALETTE.cyan : PALETTE.violet, 0.86).setInteractive({ useHandCursor: true });
    const label = this.add.text(GAME_WIDTH / 2, y, text, { fontFamily: 'monospace', fontSize: '13px', color: accent ? '#ffffff' : '#d7c9ed', letterSpacing: 2 }).setOrigin(0.5);
    box.on('pointerover', () => { box.setFillStyle(0x2c2050); label.setColor('#ffffff'); });
    box.on('pointerout', () => { box.setFillStyle(accent ? PALETTE.violet : 0x171129); label.setColor(accent ? '#ffffff' : '#d7c9ed'); });
    box.on('pointerdown', action);
  }

  showMain() {
    this.clearScreen(); this.drawBackdrop();
    this.add.text(GAME_WIDTH / 2, 202, 'TYPE', { fontFamily: 'Georgia', fontSize: '76px', fontStyle: 'bold', color: '#f3ebff', letterSpacing: 9 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 282, 'SLAYER', { fontFamily: 'Georgia', fontSize: '76px', fontStyle: 'bold', color: '#a988ff', letterSpacing: 9 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 342, 'THE KEYBOARD IS YOUR WEAPON', { fontFamily: 'monospace', fontSize: '12px', color: '#8bf3dc', letterSpacing: 3 }).setOrigin(0.5);
    this.button(447, 'BEGIN INCANTATION', () => this.scene.start('arena'), true);
    this.button(512, 'LEADERBOARD', () => this.showLeaderboard());
    this.button(577, 'SETTINGS', () => this.showSettings());
    this.add.text(GAME_WIDTH / 2, 706, 'TYPE TO CAST  ·  SURVIVE THE WAVES  ·  BANISH THE VOID', { fontFamily: 'monospace', fontSize: '10px', color: '#8d7fa5', letterSpacing: 1.6 }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('arena'));
  }

  showLeaderboard() {
    this.clearScreen(); this.drawBackdrop();
    this.add.text(GAME_WIDTH / 2, 166, 'CHRONICLE OF WARDENS', { fontFamily: 'Georgia', fontSize: '37px', fontStyle: 'bold', color: '#f1e9ff', letterSpacing: 3 }).setOrigin(0.5);
    let scores = [];
    try { scores = JSON.parse(localStorage.getItem('spellstrike-scores') || '[]'); } catch (_) { /* optional storage */ }
    const rows = scores.length ? scores.map((score, index) => `${String(index + 1).padStart(2, '0')}    ${String(score.score).padStart(6, '0')}    WAVE ${String(score.wave).padStart(2, '0')}    ${score.date}`).join('\n\n') : 'NO CHRONICLES YET\n\nBEGIN A RUN TO INSCRIBE YOUR NAME.';
    this.add.rectangle(GAME_WIDTH / 2, 424, 760, 395, 0x171129, 0.94).setStrokeStyle(1.5, PALETTE.violet, 0.72);
    this.add.text(GAME_WIDTH / 2, 266, 'RANK    SCORE      WAVE      DATE', { fontFamily: 'monospace', fontSize: '12px', color: '#8bf3dc', letterSpacing: 1.4 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 337, rows, { fontFamily: 'monospace', fontSize: '14px', color: '#ded2f2', align: 'center', lineSpacing: 6 }).setOrigin(0.5, 0);
    this.button(682, 'RETURN TO GRIMOIRE', () => this.showMain());
  }

  showSettings() {
    this.clearScreen(); this.drawBackdrop();
    let muted = false;
    try { muted = localStorage.getItem('spellstrike-muted') === 'true'; } catch (_) { /* optional storage */ }
    this.add.text(GAME_WIDTH / 2, 210, 'SETTINGS', { fontFamily: 'Georgia', fontSize: '42px', fontStyle: 'bold', color: '#f1e9ff', letterSpacing: 4 }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 290, 'SYNTHESIZED ARCANE SOUND', { fontFamily: 'monospace', fontSize: '12px', color: '#bfb0d7', letterSpacing: 2 }).setOrigin(0.5);
    this.button(360, muted ? 'SOUND  ·  OFF' : 'SOUND  ·  ON', () => {
      try { localStorage.setItem('spellstrike-muted', String(!muted)); } catch (_) { /* optional storage */ }
      this.showSettings();
    }, !muted);
    this.add.text(GAME_WIDTH / 2, 465, 'Sound is generated in-browser; no audio assets are downloaded.\nThe game uses keyboard input and is optimized for desktop browsers.', { fontFamily: 'monospace', fontSize: '12px', color: '#8d7fa5', align: 'center', lineSpacing: 8 }).setOrigin(0.5);
    this.button(650, 'RETURN TO GRIMOIRE', () => this.showMain());
  }
}

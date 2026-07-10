import { ARENA, ENEMY_TYPES, GAME_HEIGHT, GAME_WIDTH, PALETTE, POWERUPS, SPELL_BOOK, UPGRADE_POOL } from '../config.js';
import { ArenaEnemy } from '../entities/ArenaEnemy.js';
import { ArcaneCoin } from '../entities/ArcaneCoin.js';
import { Powerup } from '../entities/Powerup.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { MagicFX } from '../systems/MagicFX.js';
import { TypingSystem } from '../systems/TypingSystem.js';

export class ArenaScene extends Phaser.Scene {
  constructor() { super('arena'); }

  create() {
    this.enemies = [];
    this.coins = [];
    this.powerups = [];
    this.state = 'playing';
    this.wave = 0;
    this.waveSpawned = 0;
    this.waveTotal = 0;
    this.coreIntegrity = 100;
    this.score = 0;
    this.killCount = 0;
    this.coinCount = 0;
    this.combo = 0;
    this.freezeUntil = 0;
    this.mods = { novaRadius: 0, slow: 1, coinMultiplier: 1, scoreMultiplier: 1, shieldHits: 0 };
    this.audioSystem = new AudioSystem(this);
    this.fx = new MagicFX(this);

    this.drawBackdrop();
    this.createPlayer();
    this.createHud();
    this.typing = new TypingSystem(this);
    this.bindEvents();
    this.startWave();
  }

  bindEvents() {
    this.events.on('enemy-reached-core', this.damageCore, this);
    this.events.on('typing-error', this.showTypingError, this);
    this.events.on('letter-correct', this.showTypingSuccess, this);
    this.events.on('spell-complete', this.showSpellComplete, this);
    this.events.on('coin-collected', this.collectCoin, this);
    this.input.keyboard.on('keydown-ESC', this.togglePause, this);
  }

  drawBackdrop() {
    this.cameras.main.setBackgroundColor(PALETTE.ink);
    const bg = this.add.graphics().setDepth(0);
    bg.fillStyle(PALETTE.floor, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const cx = ARENA.centerX; const cy = ARENA.centerY;
    bg.lineStyle(2, PALETTE.floorLine, 0.72);
    [110, 220, 360, 540, 730].forEach((radius) => bg.strokeCircle(cx, cy, radius));
    bg.lineStyle(1, PALETTE.violetSoft, 0.35);
    for (let angle = 0; angle < 360; angle += 30) {
      const point = Phaser.Math.RotateAround({ x: cx + 740, y: cy }, cx, cy, Phaser.Math.DegToRad(angle));
      bg.lineBetween(cx, cy, point.x, point.y);
    }
    bg.lineStyle(3, PALETTE.violet, 0.42).strokeCircle(cx, cy, 114);
    for (let i = 0; i < 145; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH); const y = Phaser.Math.Between(0, GAME_HEIGHT);
      bg.fillStyle(i % 5 === 0 ? PALETTE.violet : 0xd8c8ff, Phaser.Math.FloatBetween(0.08, 0.34));
      bg.fillCircle(x, y, Phaser.Math.FloatBetween(0.35, 1.5));
    }
  }

  createPlayer() {
    const g = this.add.graphics().setDepth(5);
    g.fillStyle(PALETTE.violet, 0.12).fillCircle(0, 0, 75);
    g.lineStyle(2, PALETTE.cyan, 0.8).strokeCircle(0, 0, 45);
    g.fillStyle(0x211846, 1).fillCircle(0, 0, 31);
    g.fillStyle(PALETTE.violet, 0.92).fillCircle(0, -4, 22);
    g.fillStyle(0xf5ecff, 1).fillCircle(-7, -11, 8);
    g.fillStyle(PALETTE.cyan, 1).fillCircle(0, 2, 8);
    this.player = this.add.container(ARENA.centerX, ARENA.centerY, [g]);
    this.tweens.add({ targets: this.player, scale: 1.055, duration: 1040, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.tweens.add({ targets: g, rotation: Math.PI * 2, duration: 7000, repeat: -1, ease: 'Linear' });
  }

  createHud() {
    const title = this.add.text(ARENA.centerX, 58, 'THE LAST SPELLWARDEN', { fontFamily: 'Georgia', fontSize: '19px', fontStyle: 'bold', color: '#d9ceee', letterSpacing: 4 }).setOrigin(0.5).setDepth(6).setAlpha(0.84);
    this.waveText = this.add.text(ARENA.centerX, 87, 'WAVE I', { fontFamily: 'monospace', fontSize: '11px', color: '#8bf3dc', letterSpacing: 3 }).setOrigin(0.5).setDepth(6);
    this.castStatus = this.add.text(ARENA.centerX, GAME_HEIGHT - 122, 'TYPE A SPELL TO LOCK A TARGET', { fontFamily: 'monospace', fontSize: '11px', color: '#8d7fa5', letterSpacing: 2 }).setOrigin(0.5).setDepth(6);
    this.wardText = this.add.text(ARENA.centerX, GAME_HEIGHT - 86, 'WARD INTEGRITY  100%', { fontFamily: 'monospace', fontSize: '13px', color: '#c9badf', letterSpacing: 2 }).setOrigin(0.5).setDepth(6);
    this.runText = this.add.text(GAME_WIDTH - 68, 54, '', { fontFamily: 'monospace', fontSize: '12px', color: '#d8c9ee', lineSpacing: 4, align: 'right', letterSpacing: 1.5 }).setOrigin(1, 0).setDepth(6).setAlpha(0.9);
    this.buffText = this.add.text(68, GAME_HEIGHT - 58, '', { fontFamily: 'monospace', fontSize: '10px', color: '#aef4e4', letterSpacing: 1.5 }).setDepth(6).setAlpha(0.85);
    this.add.text(68, 54, 'ESC  PAUSE', { fontFamily: 'monospace', fontSize: '10px', color: '#8d7fa5', letterSpacing: 1.5 }).setDepth(6);
    this.tweens.add({ targets: title, alpha: 0.5, duration: 1800, yoyo: true, repeat: -1 });
    this.refreshHud();
  }

  startWave() {
    this.waveTransitioning = false;
    this.wave += 1;
    this.waveSpawned = 0;
    this.waveTotal = this.wave % 5 === 0 ? 1 : 6 + this.wave * 2;
    if (this.wave % 5 === 0) this.audioSystem.boss();
    this.waveText.setText(this.wave % 5 === 0 ? `WAVE ${this.wave}  ·  TITAN APPROACHES` : `WAVE ${this.wave}`);
    this.fx.floatingText(ARENA.centerX, 210, this.wave % 5 === 0 ? 'A VOID TITAN ANSWERS' : `WAVE ${this.wave}`, this.wave % 5 === 0 ? '#ffd36a' : '#8bf3dc');
    this.time.delayedCall(750, () => {
      if (this.state !== 'playing') return;
      this.spawnEvent?.remove(false);
      this.spawnEvent = this.time.addEvent({ delay: Math.max(310, 820 - this.wave * 36), callback: this.spawnNext, callbackScope: this, loop: true });
    });
  }

  spawnNext() {
    if (this.state !== 'playing' || this.waveSpawned >= this.waveTotal) { this.spawnEvent?.remove(false); return; }
    this.waveSpawned += 1;
    const type = this.wave % 5 === 0 ? 'titan' : this.pickEnemyType();
    this.spawnEnemy(type);
    if (this.waveSpawned >= this.waveTotal) this.spawnEvent?.remove(false);
  }

  pickEnemyType() {
    const options = ['slime', 'goblin'];
    if (this.wave >= 2) options.push('ghost');
    if (this.wave >= 3) options.push('bat');
    if (this.wave >= 4) options.push('knight');
    if (this.wave >= 6) options.push('necromancer');
    return Phaser.Utils.Array.GetRandom(options);
  }

  spawnEnemy(type = 'slime', x, y) {
    if (this.enemies.filter((enemy) => enemy.alive).length >= ARENA.maxEnemies) return;
    const padding = 74; const edge = Phaser.Math.Between(0, 3);
    if (x === undefined) {
      if (edge === 0) { x = Phaser.Math.Between(0, GAME_WIDTH); y = -padding; }
      if (edge === 1) { x = GAME_WIDTH + padding; y = Phaser.Math.Between(0, GAME_HEIGHT); }
      if (edge === 2) { x = Phaser.Math.Between(0, GAME_WIDTH); y = GAME_HEIGHT + padding; }
      if (edge === 3) { x = -padding; y = Phaser.Math.Between(0, GAME_HEIGHT); }
    }
    this.enemies.push(new ArenaEnemy(this, x, y, type));
  }

  summonSkeletons(x, y) {
    if (this.state !== 'playing') return;
    this.showStatus('THE DEAD RISE', '#ffb6ff');
    this.fx.burst(x, y, 0xffb6ff, 16);
    for (let i = 0; i < 3; i++) this.spawnEnemy('skeleton', x + Phaser.Math.Between(-35, 35), y + Phaser.Math.Between(-35, 35));
  }

  showTypingSuccess(enemy, progress) {
    this.audioSystem.correct();
    this.castStatus.setText(`${enemy.spell.slice(0, progress)}${'·'.repeat(enemy.spell.length - progress)}`);
    this.castStatus.setColor('#8bf3dc');
  }

  showTypingError() {
    this.audioSystem.error();
    this.combo = 0;
    this.castStatus.setText('INCANTATION FALTERED');
    this.castStatus.setColor('#ff819a');
    this.cameras.main.shake(55, 0.0016);
    this.refreshHud();
  }

  showSpellComplete(enemy) {
    this.castStatus.setText('ARCANE STRIKE');
    this.castStatus.setColor('#ffd36a');
    this.castSpell(enemy);
  }

  castSpell(enemy) {
    if (!enemy.alive || this.state !== 'playing') return;
    const { x, y } = enemy.container;
    this.audioSystem.cast();
    this.fx.beam(ARENA.centerX, ARENA.centerY, x, y);
    this.fx.ring(x, y, PALETTE.cyan, enemy.data.boss ? 1.8 : 1);
    this.fx.burst(x, y, PALETTE.cyan, enemy.data.boss ? 24 : 13, enemy.data.boss ? 1.5 : 1);
    this.cameras.main.shake(enemy.data.boss ? 150 : 80, enemy.data.boss ? 0.0035 : 0.0016);
    this.hitStop(70);
    this.combo += 1;
    if (enemy.takeHit()) this.slayEnemy(enemy, x, y);
    else {
      this.audioSystem.hit();
      this.showStatus(enemy.data.boss ? `TITAN PHASE ${enemy.maxHealth - enemy.health + 1}` : 'WARD BROKEN — CAST AGAIN', '#ffd36a');
      this.fx.floatingText(x, y - enemy.data.radius - 24, 'FRACTURE!', '#ffd36a');
    }
    this.refreshHud();
  }

  slayEnemy(enemy, x = enemy.container.x, y = enemy.container.y, isNova = false) {
    if (!enemy.alive) return;
    enemy.destroy();
    const baseScore = enemy.data.score;
    this.killCount += 1;
    this.score += Math.round((baseScore + this.combo * 14) * this.mods.scoreMultiplier);
    this.fx.burst(x, y, enemy.data.boss ? PALETTE.gold : enemy.data.color, enemy.data.boss ? 42 : 18, enemy.data.boss ? 2.1 : 1);
    this.fx.ring(x, y, enemy.data.boss ? PALETTE.gold : PALETTE.cyan, enemy.data.boss ? 2.3 : 1);
    this.fx.floatingText(x, y - 16, `+${baseScore}`, '#ffd36a');
    if (!isNova) this.coins.push(new ArcaneCoin(this, x, y));
    if (!enemy.data.boss && Math.random() < 0.15) this.powerups.push(new Powerup(this, x, y));
    if (enemy.data.boss) {
      this.coreIntegrity = Math.min(100, this.coreIntegrity + 30);
      this.showStatus('THE VOID TITAN IS BANISHED', '#ffd36a');
      for (let i = 0; i < 7; i++) this.coins.push(new ArcaneCoin(this, x + Phaser.Math.Between(-60, 60), y + Phaser.Math.Between(-60, 60)));
    }
    if (this.mods.novaRadius > 0) this.arcaneNova(x, y);
  }

  arcaneNova(x, y) {
    const radius = this.mods.novaRadius;
    this.fx.ring(x, y, PALETTE.gold, radius / 95);
    this.enemies.filter((enemy) => enemy.alive && Phaser.Math.Distance.Between(x, y, enemy.container.x, enemy.container.y) < radius).forEach((enemy) => {
      if (enemy.takeHit()) this.slayEnemy(enemy, enemy.container.x, enemy.container.y, true);
    });
  }

  activatePowerup(powerup) {
    this.audioSystem.choice();
    this.fx.burst(ARENA.centerX, ARENA.centerY, powerup.color, 20, 1.2);
    if (powerup.id === 'freeze') { this.freezeUntil = this.time.now + 5000; this.showStatus('TIME FROST · 5 SECONDS', '#8bf3dc'); }
    if (powerup.id === 'nova') { this.showStatus('FIRE NOVA', '#ffb25e'); this.enemies.filter((enemy) => enemy.alive && !enemy.data.boss).forEach((enemy) => this.slayEnemy(enemy, enemy.container.x, enemy.container.y, true)); }
    if (powerup.id === 'heal') { this.coreIntegrity = Math.min(100, this.coreIntegrity + 22); this.showStatus('WARD RESTORED', '#85f2a2'); }
    this.refreshHud();
  }

  collectCoin() {
    this.audioSystem.coin();
    this.coinCount += 1;
    this.score += Math.round(25 * this.mods.coinMultiplier);
    this.refreshHud();
  }

  damageCore(amount = 5) {
    if (this.state !== 'playing') return;
    if (this.mods.shieldHits > 0) {
      this.mods.shieldHits -= 1;
      this.showStatus('MANA SHIELD ABSORBED THE HIT', '#8bf3dc');
      this.fx.ring(ARENA.centerX, ARENA.centerY, PALETTE.cyan, 1.1);
    } else {
      this.coreIntegrity = Math.max(0, this.coreIntegrity - amount);
      this.combo = 0;
      this.audioSystem.hit();
      this.wardText.setColor('#ffb0c1');
      this.cameras.main.shake(100, 0.003);
      this.time.delayedCall(180, () => this.wardText?.setColor('#c9badf'));
    }
    this.refreshHud();
    if (this.coreIntegrity === 0) this.endRun();
  }

  openUpgrade() {
    if (this.state !== 'playing') return;
    this.state = 'upgrade';
    this.typing.enabled = false;
    this.spawnEvent?.remove(false);
    this.audioSystem.choice();
    const choices = Phaser.Utils.Array.Shuffle([...UPGRADE_POOL]).slice(0, 3);
    this.upgradeObjects = [];
    const shade = this.add.rectangle(ARENA.centerX, ARENA.centerY, GAME_WIDTH, GAME_HEIGHT, 0x05040a, 0.76).setDepth(30);
    const heading = this.add.text(ARENA.centerX, 165, 'CHOOSE ONE INCANTATION', { fontFamily: 'Georgia', fontSize: '31px', fontStyle: 'bold', color: '#f1e9ff', letterSpacing: 3 }).setOrigin(0.5).setDepth(31);
    const hint = this.add.text(ARENA.centerX, 205, 'PRESS 1 · 2 · OR 3', { fontFamily: 'monospace', fontSize: '11px', color: '#8bf3dc', letterSpacing: 2 }).setOrigin(0.5).setDepth(31);
    this.upgradeObjects.push(shade, heading, hint);
    choices.forEach((upgrade, index) => {
      const x = 405 + index * 395;
      const card = this.add.rectangle(x, 450, 350, 325, 0x171129, 0.98).setStrokeStyle(2, PALETTE.violet, 0.75).setDepth(31).setInteractive({ useHandCursor: true });
      const number = this.add.text(x - 138, 326, String(index + 1), { fontFamily: 'monospace', fontSize: '12px', color: '#8bf3dc' }).setDepth(32);
      const icon = this.add.text(x, 393, upgrade.icon, { fontSize: '42px', color: '#cbb7ff' }).setOrigin(0.5).setDepth(32);
      const name = this.add.text(x, 453, upgrade.title, { fontFamily: 'Georgia', fontSize: '19px', fontStyle: 'bold', color: '#f4eaff', align: 'center', wordWrap: { width: 300 } }).setOrigin(0.5).setDepth(32);
      const body = this.add.text(x, 520, upgrade.body, { fontFamily: 'monospace', fontSize: '12px', color: '#b9aacd', align: 'center', lineSpacing: 7, wordWrap: { width: 275 } }).setOrigin(0.5).setDepth(32);
      card.on('pointerover', () => card.setFillStyle(0x261b45));
      card.on('pointerout', () => card.setFillStyle(0x171129));
      card.on('pointerdown', () => this.chooseUpgrade(upgrade));
      this.upgradeObjects.push(card, number, icon, name, body);
    });
    this.input.keyboard.once('keydown', (event) => {
      const choice = Number(event.key);
      if (choice >= 1 && choice <= 3 && this.state === 'upgrade') this.chooseUpgrade(choices[choice - 1]);
    });
  }

  chooseUpgrade(upgrade) {
    if (this.state !== 'upgrade') return;
    if (upgrade.id === 'nova') this.mods.novaRadius += 115;
    if (upgrade.id === 'ward') this.coreIntegrity = Math.min(100, this.coreIntegrity + 24);
    if (upgrade.id === 'frost') this.mods.slow *= 0.86;
    if (upgrade.id === 'fortune') this.mods.coinMultiplier += 0.65;
    if (upgrade.id === 'haste') this.mods.scoreMultiplier += 0.35;
    if (upgrade.id === 'shield') this.mods.shieldHits += 3;
    this.upgradeObjects.forEach((object) => object.destroy());
    this.upgradeObjects = [];
    this.state = 'playing';
    this.typing.enabled = true;
    this.showStatus(upgrade.title, '#8bf3dc');
    this.audioSystem.choice();
    this.refreshHud();
    this.time.delayedCall(460, () => this.startWave());
  }

  togglePause() {
    if (this.state !== 'playing' && this.state !== 'paused') return;
    if (this.state === 'playing') {
      this.state = 'paused'; this.typing.enabled = false;
      this.pauseObjects = [
        this.add.rectangle(ARENA.centerX, ARENA.centerY, GAME_WIDTH, GAME_HEIGHT, 0x05040a, 0.7).setDepth(30),
        this.add.text(ARENA.centerX, ARENA.centerY - 25, 'THE GRIMOIRE WAITS', { fontFamily: 'Georgia', fontSize: '36px', color: '#f1e9ff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(31),
        this.add.text(ARENA.centerX, ARENA.centerY + 28, 'PRESS ESC TO RETURN TO THE BATTLE', { fontFamily: 'monospace', fontSize: '12px', color: '#8bf3dc', letterSpacing: 2 }).setOrigin(0.5).setDepth(31),
      ];
    } else {
      this.pauseObjects.forEach((object) => object.destroy()); this.pauseObjects = [];
      this.state = 'playing'; this.typing.enabled = true;
    }
  }

  hitStop(duration) {
    this.motionFrozenUntil = Math.max(this.motionFrozenUntil ?? 0, this.time.now + duration);
  }

  showStatus(text, color = '#ffffff') { this.castStatus.setText(text); this.castStatus.setColor(color); }

  refreshHud() {
    this.wardText.setText(`WARD INTEGRITY  ${String(this.coreIntegrity).padStart(3, ' ')}%`);
    this.runText.setText(`RUN 01\n\nSCORE ${String(this.score).padStart(6, '0')}\n\nSLAYED ${String(this.killCount).padStart(3, '0')}\n\nARCANA ${String(this.coinCount).padStart(3, '0')}\n\nCOMBO ×${this.combo}`);
    const buffs = [];
    if (this.mods.novaRadius) buffs.push('✦ NOVA');
    if (this.mods.shieldHits) buffs.push(`◌ SHIELD ×${this.mods.shieldHits}`);
    if (this.time.now < this.freezeUntil) buffs.push('❄ TIME FROST');
    this.buffText.setText(buffs.join('   '));
  }

  endRun() {
    if (this.state === 'over') return;
    this.state = 'over'; this.typing.destroy(); this.spawnEvent?.remove(false);
    this.cameras.main.shake(300, 0.008);
    const entry = { score: this.score, wave: this.wave, slayed: this.killCount, date: new Date().toLocaleDateString() };
    try {
      const board = JSON.parse(localStorage.getItem('spellstrike-scores') || '[]');
      board.push(entry); board.sort((a, b) => b.score - a.score);
      localStorage.setItem('spellstrike-scores', JSON.stringify(board.slice(0, 5)));
    } catch (_) { /* Storage is optional. */ }
    this.time.delayedCall(350, () => this.scene.start('game-over', entry));
  }

  update(time, delta) {
    if (this.state !== 'playing') return;
    const frozen = time < (this.motionFrozenUntil ?? 0);
    const freeze = time < this.freezeUntil;
    if (!frozen) {
      const speed = (freeze ? 0.16 : 1) * this.mods.slow;
      this.enemies = this.enemies.filter((enemy) => enemy.alive);
      this.enemies.forEach((enemy) => enemy.update(time, delta, speed));
      this.coins = this.coins.filter((coin) => coin.alive);
      this.coins.forEach((coin) => coin.update(delta));
      this.powerups = this.powerups.filter((powerup) => powerup.alive);
      this.powerups.forEach((powerup) => powerup.update(time, delta));
    }
    if (this.waveSpawned >= this.waveTotal && this.enemies.length === 0 && !this.waveTransitioning) {
      this.waveTransitioning = true;
      this.time.delayedCall(700, () => this.openUpgrade());
    }
    this.refreshHud();
  }

  shutdown() {
    this.typing?.destroy();
    this.audioSystem?.destroy();
    this.input.keyboard.off('keydown-ESC', this.togglePause, this);
  }
}

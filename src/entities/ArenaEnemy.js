import { ARENA, ENEMY_TYPES, PALETTE, SPELL_BOOK, BOSS_SPELLS } from '../config.js';

/** Renderable enemy with self-contained movement, spell display, and special traits. */
export class ArenaEnemy {
  constructor(scene, x, y, type = 'slime', spell) {
    this.scene = scene;
    this.type = type;
    this.data = ENEMY_TYPES[type];
    this.spell = spell ?? this.nextSpell();
    this.health = this.data.health;
    this.maxHealth = this.data.health;
    this.alive = true;
    this.spellComplete = false;
    this.progress = 0;
    this.phase = Math.random() * Math.PI * 2;
    this.summonAt = this.data.summoner ? Phaser.Math.Between(4800, 6200) : null;
    this.age = 0;

    const r = this.data.radius;
    this.aura = scene.add.circle(0, 0, r * 2.3, this.data.color, this.data.boss ? 0.14 : 0.08);
    this.ring = scene.add.circle(0, 0, r + 4).setStrokeStyle(this.data.boss ? 3 : 1, this.data.color, 0.62).setFillStyle(0, 0);
    this.body = scene.add.circle(0, 0, r, this.data.color, 0.94);
    this.core = scene.add.circle(-r * 0.22, -r * 0.25, Math.max(4, r * 0.34), this.data.core, 0.94);
    this.detail = this.createTypeDetail(r);
    this.healthBar = this.createHealthBar(r);
    this.spellGlyphs = this.createSpellGlyphs(r);
    this.nameText = this.data.boss
      ? scene.add.text(0, -r - 82, this.data.name, { fontFamily: 'Georgia', fontSize: '15px', fontStyle: 'bold', color: '#f1ceff', stroke: '#10051c', strokeThickness: 5 }).setOrigin(0.5)
      : null;
    const children = [this.aura, this.ring, this.body, this.core, this.detail, this.healthBar, this.spellGlyphs];
    if (this.nameText) children.push(this.nameText);
    this.container = scene.add.container(x, y, children).setDepth(this.data.boss ? 5 : 4);
    if (this.data.ghost) this.container.setAlpha(0.72);
  }

  nextSpell() { return Phaser.Utils.Array.GetRandom(this.data.boss ? BOSS_SPELLS : SPELL_BOOK); }

  createTypeDetail(r) {
    const g = this.scene.add.graphics();
    if (this.data.bat) {
      g.fillStyle(this.data.color, 0.9).fillTriangle(-r - 8, 0, -r + 2, -r + 4, -2, -2);
      g.fillStyle(this.data.color, 0.9).fillTriangle(r + 8, 0, r - 2, -r + 4, 2, -2);
    } else if (this.data.shield) {
      g.lineStyle(3, 0xdce9ff, 0.92).strokeCircle(0, 0, r - 5);
    } else if (this.data.summoner) {
      g.lineStyle(2, 0xffb6ff, 0.7).strokeTriangle(-r + 4, r - 3, 0, -r - 9, r - 4, r - 3);
    } else if (this.data.boss) {
      g.lineStyle(4, 0xe2a7ff, 0.9).strokeCircle(0, 0, r - 8);
      g.lineStyle(2, 0xffd9ff, 0.62).strokeCircle(0, 0, r + 13);
    }
    return g;
  }

  createHealthBar(r) {
    const bar = this.scene.add.graphics();
    if (this.maxHealth > 1) {
      bar.fillStyle(0x05050b, 0.75).fillRoundedRect(-r, r + 13, r * 2, 5, 2);
      bar.fillStyle(this.data.boss ? PALETTE.gold : PALETTE.cyan, 0.9).fillRoundedRect(-r + 1, r + 14, (r * 2 - 2), 3, 1);
    }
    return bar;
  }

  refreshHealthBar() {
    if (this.maxHealth <= 1) return;
    const r = this.data.radius;
    this.healthBar.clear();
    this.healthBar.fillStyle(0x05050b, 0.75).fillRoundedRect(-r, r + 13, r * 2, 5, 2);
    this.healthBar.fillStyle(this.data.boss ? PALETTE.gold : PALETTE.cyan, 0.9)
      .fillRoundedRect(-r + 1, r + 14, (r * 2 - 2) * (this.health / this.maxHealth), 3, 1);
  }

  createSpellGlyphs(radius) {
    const glyphs = this.scene.add.container(0, -radius - (this.data.boss ? 44 : 31));
    const spacing = this.data.boss ? 17 : 16;
    const fontSize = this.data.boss ? '21px' : '18px';
    const start = -((this.spell.length - 1) * spacing) / 2;
    this.letters = [...this.spell].map((letter, index) => {
      const glyph = this.scene.add.text(start + index * spacing, 0, letter, {
        fontFamily: 'Georgia', fontSize, fontStyle: 'bold', color: '#e8ddff', stroke: '#090611', strokeThickness: 4,
      }).setOrigin(0.5);
      glyphs.add(glyph);
      return glyph;
    });
    return glyphs;
  }

  update(time, delta, speedMultiplier = 1) {
    if (!this.alive || this.spellComplete) return;
    this.age += delta;
    const angle = Phaser.Math.Angle.Between(this.container.x, this.container.y, ARENA.centerX, ARENA.centerY);
    const step = this.data.speed * speedMultiplier * (delta / 1000);
    this.container.x += Math.cos(angle) * step;
    this.container.y += Math.sin(angle) * step;
    this.container.y += Math.sin(time / (this.data.bat ? 115 : 340) + this.phase) * (this.data.bat ? 0.95 : 0.18);
    this.container.rotation = Math.sin(time / 520 + this.phase) * (this.data.bat ? 0.18 : 0.07);
    if (this.data.ghost) this.container.alpha = 0.45 + Math.sin(time / 300 + this.phase) * 0.22;
    if (this.data.boss) this.aura.alpha = 0.12 + Math.sin(time / 370) * 0.08;

    if (this.summonAt && this.age >= this.summonAt) {
      this.summonAt = null;
      this.scene.summonSkeletons(this.container.x, this.container.y);
    }
    if (Phaser.Math.Distance.Between(this.container.x, this.container.y, ARENA.centerX, ARENA.centerY) < (this.data.boss ? 96 : 62)) {
      this.destroy();
      this.scene.events.emit('enemy-reached-core', this.data.boss ? 18 : 5);
    }
  }

  setTargeted(targeted) {
    if (!this.alive) return;
    this.ring.setStrokeStyle(targeted ? 3 : (this.data.boss ? 3 : 1), targeted ? PALETTE.cyan : this.data.color, targeted ? 1 : 0.62);
    this.aura.setFillStyle(targeted ? PALETTE.cyan : this.data.color, targeted ? 0.17 : (this.data.boss ? 0.14 : 0.08));
    this.spellGlyphs.setScale(targeted ? 1.14 : 1);
  }

  setProgress(progress) {
    this.progress = progress;
    this.letters.forEach((glyph, index) => {
      glyph.setColor(index < progress ? '#8bf3dc' : '#e8ddff');
      glyph.setShadow(0, 0, index < progress ? '#8bf3dc' : '#000000', index < progress ? 12 : 0);
    });
    this.scene.tweens.add({ targets: this.spellGlyphs, scale: 1.23, duration: 52, yoyo: true, ease: 'Quad.out' });
  }

  flashMistake() {
    this.scene.tweens.add({ targets: this.spellGlyphs, x: 8, duration: 35, yoyo: true, repeat: 2, ease: 'Sine.inOut' });
    this.letters.forEach((glyph) => glyph.setColor('#ff819a'));
    this.scene.time.delayedCall(145, () => this.letters.forEach((glyph, index) => glyph.setColor(index < this.progress ? '#8bf3dc' : '#e8ddff')));
  }

  markSpellComplete() { this.spellComplete = true; this.setTargeted(false); this.letters.forEach((glyph) => glyph.setColor('#ffd36a')); }

  takeHit() {
    this.health -= 1;
    if (this.health <= 0) return true;
    this.refreshHealthBar();
    this.resetSpell();
    this.scene.tweens.add({ targets: this.container, x: this.container.x + 12, duration: 70, yoyo: true, repeat: 1 });
    return false;
  }

  resetSpell(spell = this.nextSpell()) {
    this.spell = spell;
    this.spellComplete = false;
    this.progress = 0;
    this.letters.forEach((glyph) => glyph.destroy());
    this.spellGlyphs.destroy();
    this.spellGlyphs = this.createSpellGlyphs(this.data.radius);
    this.container.add(this.spellGlyphs);
  }

  destroy() {
    if (!this.alive) return;
    this.alive = false;
    this.scene.tweens.add({ targets: this.container, alpha: 0, scale: 1.8, duration: 170, ease: 'Sine.out', onComplete: () => this.container.destroy() });
  }
}

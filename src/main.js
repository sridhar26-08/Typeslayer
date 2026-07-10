import { GAME_HEIGHT, GAME_WIDTH } from './config.js';
import { ArenaScene } from './scenes/ArenaScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { LoadingScene } from './scenes/LoadingScene.js';
import { MenuScene } from './scenes/MenuScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#080711',
  render: { antialias: true, roundPixels: false },
  scale: {
    // Keep the 1600×900 game world intact, then scale it as one centered surface.
    // RESIZE expands the canvas without moving fixed-coordinate scene elements.
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [LoadingScene, MenuScene, ArenaScene, GameOverScene],
};

window.spellStrike = new Phaser.Game(config);

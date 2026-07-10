export const GAME_WIDTH = 1600;
export const GAME_HEIGHT = 900;

export const PALETTE = {
  ink: 0x080711,
  floor: 0x110e22,
  floorLine: 0x25203c,
  violet: 0x9b6cff,
  violetSoft: 0x59438b,
  cyan: 0x8bf3dc,
  enemy: 0xff668b,
  enemyCore: 0xffb3c3,
  gold: 0xffd36a,
  red: 0xff637f,
};

export const ARENA = {
  centerX: GAME_WIDTH / 2,
  centerY: GAME_HEIGHT / 2,
  maxEnemies: 28,
};

export const SPELL_BOOK = [
  'LUX', 'NOX', 'IGNIS', 'FROST', 'UMBRA', 'VITA', 'AURA', 'RUNE',
  'AETHER', 'TEMPEST', 'ARCANE', 'ECLIPSE', 'CELESTIA', 'OBLIVION',
];

export const BOSS_SPELLS = ['OBLIVION', 'CATACLYSM', 'NETHERFALL', 'ECLIPSE'];

export const ENEMY_TYPES = {
  slime: { name: 'SLIME', speed: 29, radius: 15, health: 1, color: 0x79e3a0, core: 0xd4ffca, weight: 42, score: 90 },
  goblin: { name: 'GOBLIN', speed: 38, radius: 17, health: 1, color: 0xff9d61, core: 0xffe3bd, weight: 31, score: 120 },
  ghost: { name: 'GHOST', speed: 48, radius: 17, health: 1, color: 0x9db6ff, core: 0xe9e7ff, weight: 15, score: 150, ghost: true },
  bat: { name: 'DUSK BAT', speed: 70, radius: 11, health: 1, color: 0xd57cff, core: 0xf3c3ff, weight: 16, score: 170, bat: true },
  knight: { name: 'SHIELD KNIGHT', speed: 27, radius: 23, health: 2, color: 0x9aa9c6, core: 0xffffff, weight: 10, score: 300, shield: true },
  necromancer: { name: 'NECROMANCER', speed: 25, radius: 23, health: 2, color: 0x7c61b7, core: 0xffbdff, weight: 7, score: 380, summoner: true },
  skeleton: { name: 'SKELETON', speed: 53, radius: 12, health: 1, color: 0xe7dfcb, core: 0xffffff, weight: 0, score: 80 },
  titan: { name: 'ANCIENT VOID TITAN', speed: 20, radius: 62, health: 5, color: 0x6b42aa, core: 0xf2ccff, weight: 0, score: 2500, boss: true },
};

export const UPGRADE_POOL = [
  { id: 'nova', title: 'RUNE NOVA', body: 'Spell kills damage nearby enemies.', icon: '✦' },
  { id: 'ward', title: 'MEND THE WARD', body: 'Restore 24 ward integrity.', icon: '✚' },
  { id: 'frost', title: 'FROST SCRIPT', body: 'Enemies move 14% slower.', icon: '❄' },
  { id: 'fortune', title: 'GILDED INK', body: '+65% Arcana coin value.', icon: '◈' },
  { id: 'haste', title: 'RAPID CASTING', body: 'Spell strikes score +35%.', icon: '↯' },
  { id: 'shield', title: 'MANA SHIELD', body: 'Block the next 3 ward hits.', icon: '◌' },
];

export const POWERUPS = [
  { id: 'freeze', label: 'TIME FROST', color: 0x8bf3dc },
  { id: 'nova', label: 'FIRE NOVA', color: 0xffb25e },
  { id: 'heal', label: 'WARD MEND', color: 0x85f2a2 },
];

# TYPE SLAYER

> **The keyboard is your weapon.**

TYPE SLAYER is an original dark-fantasy typing survival game built for the Parsewave Game Jam. The Last Spellwarden stands alone while monsters close in from every edge of a cursed arena. Type the spell above a creature to lock on, cast, chain kills, and survive the waves.

## How to play

- Press the first letter of an enemy spell to lock the nearest matching target.
- Type the rest of its spell correctly to cast an Arcane Strike.
- Collect Arcana coins and powerups that fly toward the Spellwarden.
- Finish each wave to choose one permanent run upgrade.
- Press `Esc` to pause. In the game-over screen, press `R` or `Enter` to begin another run.

## What is included

- Responsive browser-first Phaser game with procedural dark-fantasy vector art.
- Polished typing feedback: target lock, individual letter states, mistakes, camera shake, hit-stop, beams, rings, and particle bursts.
- Slimes, goblins, ghosts, bats, shield knights, necromancers that summon skeletons, and multi-phase Void Titans.
- Wave progression, upgrade choice screens, Arcana coin pickups, Time Frost, Fire Nova, and Ward Mend powerups.
- Loading, menu, settings, pause, upgrade, game-over, and persistent local leaderboard screens.
- Original synthesized typing, error, casting, impact, coin, menu, and ambient sound palette. Sound can be toggled in Settings.

## Run locally

Serve this folder with any static web server, then open `index.html`. For example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. Phaser is loaded from the jsDelivr CDN, so the first load requires internet access.

## Technology and structure

- HTML, CSS, JavaScript, Phaser 3
- `src/scenes/` — loading, menu, arena, and game-over screens
- `src/entities/` — enemies, Arcana coins, and powerups
- `src/systems/` — typing input, synthesized sound, and procedural effects
- `src/config.js` — balance, spell pools, enemy tuning, powerups, and upgrades

## Credits and disclosure

- [Phaser 3](https://phaser.io/) is used under its MIT license and loaded from jsDelivr.
- Google Fonts requests Cinzel and DM Mono.
- No third-party visual or audio asset files are used: artwork, particles, and sound are generated procedurally in the browser.
- The game’s source, procedural visuals, and game design were authored during the jam with AI-assisted development. Include the required AI-agent trace archive with the final Parsewave submission.

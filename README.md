# TYPE SLAYER

**The keyboard is your weapon.**

TYPE SLAYER is an original dark-fantasy typing survival game built for the **Parsewave Game Jam**. The Last Spellwarden stands alone while monsters close in from every edge of a cursed arena. Type the spell above a creature to lock on, cast, chain kills, and survive the waves.

▶️ **[Play the live build](https://typeslayer.netlify.app/)**

---

## How to Play

| Action | Key |
|---|---|
| Lock onto the nearest matching enemy | Press the first letter of its spell |
| Cast an Arcane Strike | Type the rest of the spell correctly |
| Pause / Resume | `Esc` |
| Restart after Game Over | `R` or `Enter` |

Collect **Arcana coins** and powerups that fly toward the Spellwarden as you fight. Finish each wave to pick one permanent run upgrade — the arena only gets harder from there.

---

## What's Included

- Responsive, browser-first **Phaser 3** game with procedural dark-fantasy vector art — no external art assets.
- Polished typing feedback: target lock, per-letter states, mistake flashes, camera shake, hit-stop, beams, rings, and particle bursts.
- A full enemy roster: slimes, goblins, ghosts, bats, shield knights, skeleton-summoning necromancers, and multi-phase Void Titans.
- Wave progression with upgrade-choice screens, Arcana coin pickups, and three powerups — Time Frost, Fire Nova, and Ward Mend.
- Complete screen flow: loading, menu, settings, pause, upgrade, game-over, and a persistent local leaderboard.
- An original synthesized sound palette (typing, errors, casting, impact, coins, menu, ambience) — fully toggleable in Settings.

---

## Design & Technical Highlights

**Spatial targeting, not just typing.** Most typing games are a flat word list — type the word, it disappears. TYPE SLAYER adds a spatial layer: pressing a letter locks the *nearest* enemy that matches, so positioning and threat prioritization matter as much as raw typing accuracy. A slow player who tracks the arena well can out-survive a fast typist who doesn't.

**Everything is generated, nothing is loaded.** There are no sprite sheets, no audio files, no external asset pipeline. Every enemy, particle, beam, ring, and sound effect is built procedurally at runtime in Phaser and the Web Audio API. This keeps the entire game under a tiny footprint and means the visual/audio style is defined entirely in code — a deliberate constraint chosen for the jam rather than a shortcut.

**Feedback stacked on feedback.** Casting a spell correctly doesn't just remove an enemy — it triggers camera shake, hit-stop (a brief freeze-frame on impact), particle bursts, and per-letter color states as you type, so the game *feels* responsive even though the core input is a keyboard, not a mouse or joystick.

**Escalating enemy design, not just harder numbers.** Enemies aren't reskins with bigger health bars — shield knights force a different approach to targeting, necromancers add pressure by summoning skeletons mid-fight, and multi-phase Void Titans change their spell patterns as they take damage, so late-wave fights require adapting strategy, not just typing faster.

**Permanent build variety.** The upgrade-choice screen after each wave means no two runs play identically — by wave 5, two players could have meaningfully different builds shaping how they approach the same enemy patterns.

---

## Run Locally

This project is built with **Vite**. To run it locally:

```bash
npm install
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) — open that in your browser.

Other available scripts:

```bash
npm run build     # Production build
npm run preview   # Preview the production build locally
```

> Phaser is installed as a dependency (`phaser ^3.90.0`) via npm, and fonts (Cinzel, Inter) are loaded from Google Fonts, so an internet connection is needed for the first load.

---

## Technology & Structure

Built with **HTML, CSS, JavaScript, Vite, and Phaser 3 (^3.90.0)**.

```
src/
├── scenes/    # Loading, menu, arena, and game-over screens
├── entities/  # Enemies, Arcana coins, and powerups
├── systems/   # Typing input, synthesized sound, procedural effects
├── config.js  # Balance, spell pools, enemy tuning, powerups, upgrades
└── main.js    # Entry point
```

---

## Credits & Disclosure

- [Phaser 3](https://phaser.io/) — used under its MIT license, installed via npm.
- Google Fonts — Cinzel and Inter.
- **No third-party visual or audio assets.** All artwork, particles, and sound are generated procedurally in the browser.
- This game's source, procedural visuals, and design were authored during the jam with AI-assisted development. The required AI-agent trace archive is included with the final Parsewave submission.

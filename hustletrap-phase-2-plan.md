
# HustleTrap Phase 2 Development Plan

## Goal:
Deepen gameplay systems including mission arcs, NPC progression, crafting upgrades, and simulation depth.

---

## SYSTEM 1: Mission Arc Expansion
**Purpose:** Bring story and branching gameplay to each NPC

### Tasks:
- [ ] Add 3–5 missions per NPC (with dependencies)
- [ ] Include choices in missions (rob, lie, help)
- [ ] Link NPC loyalty and reputation to outcomes
- [ ] Unlock new locations or recipes via missions

**Files:**
- `missions-v2.html`
- `profile-{npc}-missions.json`

---

## SYSTEM 2: Crafting & Drug Simulation
**Purpose:** Build deeper drug economy with recipes and effects

### Tasks:
- [ ] Tiered crafting: basic, experimental, risky
- [ ] Add rarity, potency to crafted drugs
- [ ] Implement bad batches (low rep, high heat)
- [ ] Daily craft limits by XP or mission unlocks

**Files:**
- `chem-lab-v2.html`
- `recipes.js`, `effects.js`
- `npc-v2.1.js` crafting response logic

---

## SYSTEM 3: NPC Progression & Autonomy
**Purpose:** Make NPCs grow dynamically and influence game

### Tasks:
- [ ] Loyalty-based NPC upgrades
- [ ] NPCs can become rivals or allies based on actions
- [ ] NPCs unlock perks or side storylines
- [ ] Track mood, loyalty, behavior flags

**Files:**
- `npc-v2.1.js` or `npc-v3.0.js`
- `logic-v1.1.js`

---

## SYSTEM 4: Player Reputation System
**Purpose:** Tie player reputation to consequences and perks

### Tasks:
- [ ] High heat triggers raids or street events
- [ ] High rep unlocks rare items or events
- [ ] Add visible perks based on rep/XP
- [ ] Create event triggers for situational changes

**Files:**
- `reputation.js`, `events.js`
- Updated `burner-os.html` or `log.html`

---

## SYSTEM 5: UI & Game Feedback
**Purpose:** Improve player experience and feedback systems

### Tasks:
- [ ] Log mission fails, trades, events
- [ ] NPC profile summaries (mood, rep, stock)
- [ ] Optional sound FX or visual highlights
- [ ] Icon set for drugs, tools, perks

**Files:**
- `log.html`, `audio.js`
- `npc profiles/`, `ui-icons/`

---

## Stretch Goals
- [ ] Global economy to simulate price shifts
- [ ] Online leaderboard or code sharing
- [ ] Rival AI dealer factions

---

**Version Target:** `v2.1+`  
**Format:** Blogger + GitHub Hosted  
**Lead:** SGGregory76  

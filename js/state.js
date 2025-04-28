const State = {
  stats: { xp:0, rep:0, cash:0, heat:0, rp:0, level:1 },
  inventory: [],
  missionsDone: [],
  npcs: {},           // keyed by NPC id with mood & inventory
  settings: { autosave:true },
  load() { /* pull from localStorage (or Base64 code) */ },
  save() { /* write to localStorage (and update export code) */ },
  updateStats(changes) { Object.assign(this.stats, changes); this.save(); },
  addMission(id) { this.missionsDone.push(id); this.save(); },
  …
};
window.GameState = State;
State.load();

// game-engine.js
// HustleTrap Game Engine
// Load this via <script src="https://cdn.jsdelivr.net/gh/SGGregory76/Hustletrap@main/game-engine.js"></script>

(function(){
  // 1) Inject global CSS
  const css = `
    /* Global panel & button styles */
    #mission-container, .puzzle-card {
      margin: 16px 0;
      padding: 16px;
      background: #111;
      border: 2px solid #444;
      border-radius: 8px;
      font-family: Roboto, sans-serif;
      color: #fff;
      box-sizing: border-box;
    }
    #mission-container #mission-title, .puzzle-card .puzzle-header {
      background: rgba(0,0,0,0.75);
      padding: 0.5em;
      border-radius: 4px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }
    #mission-container #mission-options > button,
    .puzzle-card .puzzle-options button {
      flex: 1;
      margin: 0 8px;
      padding: 10px;
      background: #222;
      border: 2px solid #555;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    #mission-container #mission-options > button:hover,
    .puzzle-card .puzzle-options button:hover {
      background: #333;
      border-color: #777;
    }
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // 2) Storage keys
  const STORAGE_KEYS = {
    stats: 'ht_stats',
    inventory: 'ht_inventory',
    crafting: 'ht_crafting',
    npcs: 'ht_npcs',
    missions: 'ht_missions'
  };

  // 3) Stats Manager
  class StatsManager {
    constructor() {
      this.data = { xp:0, rep:0, cash:0, heat:0 };
    }
    load() {
      const raw = localStorage.getItem(STORAGE_KEYS.stats);
      if (raw) this.data = JSON.parse(raw);
    }
    save() {
      localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(this.data));
    }
    update(delta) {
      Object.assign(this.data, Object.keys(delta).reduce((o,k)=>(o[k]= (this.data[k]||0) + delta[k], o), {}));
      this.save();
      this.render();
    }
    render() {
      if (window.renderHUD) window.renderHUD(this.data);
    }
  }

  // 4) Inventory Manager
  class InventoryManager {
    constructor() { this.items = []; }
    load() {
      const raw = localStorage.getItem(STORAGE_KEYS.inventory);
      if (raw) this.items = JSON.parse(raw);
    }
    save() {
      localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(this.items));
    }
    add(item) {
      this.items.push(item);
      this.save();
      if (window.renderInventory) window.renderInventory(this.items);
    }
    remove(item) {
      this.items = this.items.filter(i=>i!==item);
      this.save();
      if (window.renderInventory) window.renderInventory(this.items);
    }
  }

  // 5) Crafting System (skeleton)
  class CraftingSystem {
    constructor() { this.recipes = {}; }
    register(id, recipe) { this.recipes[id] = recipe; }
    craft(id, inv) {
      // Check recipe and adjust inventory
      const r = this.recipes[id];
      if (!r) throw new Error('No recipe: '+id);
      // simple check
      if (r.ingredients.every(ing=>inv.items.includes(ing))) {
        r.ingredients.forEach(ing=>inv.remove(ing));
        inv.add(r.result);
        return true;
      }
      return false;
    }
  }

  // 6) NPC Manager (skeleton)
  class NPCManager {
    constructor() { this.npcs = {}; }
    register(id, data) { this.npcs[id] = data; }
    get(id) { return this.npcs[id]; }
  }

  // 7) Mission Manager (skeleton)
  class MissionManager {
    constructor() { this.missions = {}; }
    register(id, def) { this.missions[id] = def; }
    start(id) {
      const m = this.missions[id];
      if (!m) return console.error('No mission',id);
      m.run();
    }
  }

  // 8) Expose
  window.HT = {
    stats: new StatsManager(),
    inventory: new InventoryManager(),
    crafting: new CraftingSystem(),
    npcs: new NPCManager(),
    missions: new MissionManager()
  };

  // 9) Init
  document.addEventListener('DOMContentLoaded', ()=>{
    HT.stats.load(); HT.inventory.load();
    if (window.renderHUD) HT.stats.render();
    if (window.renderInventory) HT.inventory.render();
  });
})();

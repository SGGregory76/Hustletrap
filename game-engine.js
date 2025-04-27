// game-engine.js
// HustleTrap Game Engine with Contacts System
(function(){
  // 1) Inject global CSS (panels, buttons)
  const css = `
    #mission-container, .puzzle-card {
      margin:16px 0; padding:16px;
      background:#111; border:2px solid #444;
      border-radius:8px; font-family:Roboto,sans-serif;
      color:#fff; box-sizing:border-box;
    }
    #mission-container #mission-title, .puzzle-card .puzzle-header {
      background:rgba(0,0,0,0.75); padding:0.5em;
      border-radius:4px; text-shadow:1px 1px 2px rgba(0,0,0,0.8);
    }
    #mission-container #mission-options>button,
    .puzzle-card .puzzle-options button {
      flex:1; margin:0 8px;
      padding:10px; background:#222; border:2px solid #555;
      border-radius:6px; cursor:pointer;
      transition:background .2s,border-color .2s;
      color:#fff;
    }
    #mission-container #mission-options>button:hover,
    .puzzle-card .puzzle-options button:hover {
      background:#333; border-color:#777;
    }
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // 2) Storage keys
  const STORAGE = {
    stats: 'ht_stats',
    inventory: 'ht_inventory',
    crafting: 'ht_crafting',
    npcs: 'ht_npcs',
    missions: 'ht_missions',
    contacts: 'ht_contacts'
  };

  // 3) Stats Manager
  class StatsManager { load() { this.data = JSON.parse(localStorage.getItem(STORAGE.stats)||'{}'); } 
    save() { localStorage.setItem(STORAGE.stats,JSON.stringify(this.data)); }
    update(delta) { Object.keys(delta).forEach(k=>this.data[k]=(this.data[k]||0)+delta[k]); this.save(); window.renderHUD && window.renderHUD(this.data); }
  }

  // 4) Inventory Manager
  class InventoryManager { load(){this.items=JSON.parse(localStorage.getItem(STORAGE.inventory)||'[]');} save(){localStorage.setItem(STORAGE.inventory,JSON.stringify(this.items));} 
    add(item){if(!this.items.includes(item)){this.items.push(item);this.save();window.renderInventory&&window.renderInventory(this.items);} }
    remove(item){this.items=this.items.filter(i=>i!==item);this.save();window.renderInventory&&window.renderInventory(this.items);} }

  // 5) Contact Manager
  class ContactManager {
    load() {
      this.contacts = JSON.parse(localStorage.getItem(STORAGE.contacts)||'[]');
      if (this.contacts.length===0) {
        this.contacts = ['Blaze'];
        this.save();
      }
    }
    save() { localStorage.setItem(STORAGE.contacts,JSON.stringify(this.contacts)); }
    add(name) {
      if (!this.contacts.includes(name)) {
        this.contacts.push(name);
        this.save();
        window.renderContacts && window.renderContacts(this.contacts);
      }
    }
  }

  // 6) Mission Manager
  class MissionManager {
    constructor(){this.defs={};}
    register(id,def){this.defs[id]=def;}
    start(id){const m=this.defs[id]; if(!m)return; m.run();}
  }

  // 7) Expose managers
  window.HT = {
    stats: new StatsManager(),
    inventory: new InventoryManager(),
    contacts: new ContactManager(),
    crafting: {}, // fill later
    npcs: {},     // fill later
    missions: new MissionManager()
  };

  // 8) Initialize on load
  document.addEventListener('DOMContentLoaded',()=>{
    HT.stats.data = JSON.parse(localStorage.getItem(STORAGE.stats)||'{"xp":0,"rep":0,"cash":0,"heat":0}');
    window.renderHUD && window.renderHUD(HT.stats.data);
    HT.inventory.load();
    window.renderInventory && window.renderInventory(HT.inventory.items);
    HT.contacts.load();
    window.renderContacts && window.renderContacts(HT.contacts.contacts);
  });
})();

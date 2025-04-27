// os-engine.js
// Include after game-engine.js on your OS page

(function(){
  class OSEngine {
    constructor() {
      this.menuItems = [
        { id: 'contacts', label: 'Contacts',    action: () => renderContacts(HT.contacts.contacts) },
        { id: 'inventory',label: 'Inventory',   action: () => renderInventory(HT.inventory.items) },
        { id: 'missions', label: 'Missions',    action: () => HT.missions.startNextMission() },
        { id: 'crafting', label: 'Crafting',    action: () => renderCrafting(HT.crafting.recipes) },
        { id: 'map',      label: 'Map',         action: () => renderMap(HT.mapData) }
      ];
    }
    init() {
      this.renderMenu();
      // load the first view
      this.menuItems[0].action();
    }
    renderMenu() {
      const nav = document.getElementById('os-nav');
      nav.innerHTML = '';
      this.menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item.label;
        btn.onclick = item.action;
        btn.style.margin = '0 8px';
        nav.appendChild(btn);
      });
    }
  }

  // Helper to go to the next mission in sequence
  HT.missions.startNextMission = function() {
    const flow = window.missionFlow;              // from your existing game-engine
    const done = JSON.parse(localStorage.getItem('completedMissions')||'[]');
    const nextId = flow.find(id => !done.includes(id));
    if (nextId) HT.missions.start(nextId);
    else alert('All missions complete!');
  };

  // Expose and auto-init
  window.HT.OS = new OSEngine();
  document.addEventListener('DOMContentLoaded', () => HT.OS.init());
})();

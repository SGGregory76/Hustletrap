// os-engine.js
// HustleTrap OS Shell Integration (Updated Stats Hook)
// Load after game-engine.js to render the OS menu and content pane.

(function(){
  class OSEngine {
    constructor() {
      this.menuItems = [
        { id: 'hud',      label: 'Dashboard', action: () => this.showHUD() },
        { id: 'contacts', label: 'Contacts',  action: () => this.showContacts() },
        { id: 'inventory',label: 'Inventory', action: () => this.showInventory() },
        { id: 'missions', label: 'Missions',  action: () => this.launchMission() },
        { id: 'crafting', label: 'Crafting',  action: () => this.showCrafting() },
        { id: 'map',      label: 'Map',       action: () => this.showMap() }
      ];
    }

    init() {
      this.renderMenu();
      // Hook into stats.update to refresh HUD automatically
      if (window.HT && HT.stats) {
        const originalUpdate = HT.stats.update.bind(HT.stats);
        HT.stats.update = (delta) => {
          originalUpdate(delta);
          this.showHUD();
        };
      }
      // default view: dashboard
      this.showHUD();
    }

    renderMenu() {
      const nav = document.getElementById('os-nav');
      nav.innerHTML = '';
      this.menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item.label;
        btn.style.cssText = 'background:#222;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;margin-right:8px;font-family:Roboto,sans-serif;';
        btn.onclick = item.action;
        nav.appendChild(btn);
      });
    }

    showHUD() {
      if (window.renderHUD) {
        window.renderHUD(HT.stats.data);
      }
    }

    showContacts() {
      if (window.renderContacts) {
        window.renderContacts(HT.contacts.contacts);
      }
    }

    showInventory() {
      if (window.renderInventory) {
        window.renderInventory(HT.inventory.items);
      }
    }

    launchMission() {
      // start next incomplete mission
      if (window.HT && HT.missions && HT.missions.startNextMission) {
        HT.missions.startNextMission();
      } else {
        alert('No missions available.');
      }
    }

    showCrafting() {
      if (window.renderCrafting) {
        window.renderCrafting(HT.crafting.recipes);
      }
    }

    showMap() {
      if (window.renderMap) {
        window.renderMap(HT.mapData);
      }
    }
  }

  // Expose and auto-init after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if (window.HT && document.getElementById('os-nav')) {
      window.HT.OS = new OSEngine();
      window.HT.OS.init();
    } else {
      console.error('OS Engine: Missing HT or os-nav container');
    }
  });
})();

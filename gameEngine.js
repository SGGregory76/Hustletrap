// game-engine.js
// Core HustleTrap game engine integration with existing Burner OS shell
(function(window) {
  // Ensure global namespace
  window.HT = window.HT || {};

  /**
   * HT.stats: load, save, render player stats
   */
  HT.stats = {
    data: { xp: 0, rep: 0, cash: 0, heat: 0, rp: 0 },
    load() {
      const s = JSON.parse(localStorage.getItem('stats') || '{}');
      Object.assign(this.data, s);
    },
    save() {
      localStorage.setItem('stats', JSON.stringify(this.data));
      // notify shell to re-render HUD
      localStorage.setItem('statsUpdated', Date.now());
    },
    update(changes) {
      Object.assign(this.data, changes);
      this.save();
    },
    render() {
      if (window.renderHUD) window.renderHUD(this.data);
    }
  };

  // Initialize stats on load
  HT.stats.load();

  /**
   * HT.loadPage: wrapper around shell's loadPage()
   * @param {string} url - full URL to load in iframe
   */
  HT.loadPage = function(url) {
    if (window.loadPage) {
      window.loadPage(url);
    }
  };

  /**
   * HT.contacts: data stub, and renderContacts to load contacts page
   */
  HT.contacts = { contacts: [] };
  window.renderContacts = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/contacts.html?m=1');
  };

  /**
   * HT.inventory: data stub, and renderInventory to load inventory page
   */
  HT.inventory = { items: [] };
  window.renderInventory = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/inventory.html?m=1');
  };

  /**
   * HT.missions: start missions by loading mission list
   */
  HT.missions = {
    startNextMission() {
      HT.loadPage('https://hustletrap.blogspot.com/p/missions.html?m=1');
    }
  };

  /**
   * Crafting and Map renderers
   */
  window.renderCrafting = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/craft.html?m=1');
  };
  window.renderMap = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/map.html?m=1');
  };

  // Listen for storage events to update HUD automatically
  window.addEventListener('storage', function(e) {
    if (e.key === 'statsUpdated') {
      HT.stats.render();
    }
  });

  // After DOM ready, render initial HUD
  document.addEventListener('DOMContentLoaded', function() {
    HT.stats.render();
  });

})(window);

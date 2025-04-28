// game-engine.js
// Core HustleTrap game engine: stats, page loading, and modules
(function(window, document){
  // Ensure global HT namespace
  window.HT = window.HT || {};

  /**
   * HT.stats: load, save, render player stats
   */
  HT.stats = {
    data: { xp:0, rep:0, cash:0, heat:0, rp:0 },
    load() {
      try {
        const s = JSON.parse(localStorage.getItem('stats')|| '{}');
        Object.assign(this.data, s);
      } catch(e) { console.warn('Failed to load stats:', e); }
    },
    save() {
      localStorage.setItem('stats', JSON.stringify(this.data));
      // trigger external HUD update listener
      localStorage.setItem('statsUpdated', Date.now());
    },
    render() {
      if (typeof window.renderHUD === 'function') {
        window.renderHUD(this.data);
      }
    },
    update(changes) {
      Object.assign(this.data, changes);
      this.save();
      this.render();
    }
  };

  /**
   * HT.loadPage: load URL into the main iframe
   */
  HT.loadPage = function(url) {
    const iframe = document.getElementById('appFrame');
    if (iframe) iframe.src = url;
  };

  /**
   * HT.missions: simple launcher for mission listing
   */
  HT.missions = {
    startNextMission() {
      // Default: load missions list page
      HT.loadPage('https://hustletrap.blogspot.com/p/missions.html?m=1');
    }
  };

  /**
   * HT.contacts: placeholder for contacts data
   */
  HT.contacts = {
    // data can be loaded/extended by your pages
    contacts: []
  };

  /**
   * HT.inventory: placeholder for inventory items
   */
  HT.inventory = {
    items: [],
    save() {
      localStorage.setItem('inventory', JSON.stringify(this.items));
    },
    load() {
      try { this.items = JSON.parse(localStorage.getItem('inventory')|| '[]'); }
      catch(e){ console.warn('Failed to load inventory:', e); }
    }
  };

  /**
   * HT.crafting: placeholder for crafting recipes
   */
  HT.crafting = { recipes: [] };

  /**
   * HT.mapData: placeholder for map events
   */
  HT.mapData = {};

  // Expose rendering helpers for OS engine
  window.renderContacts = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/contacts.html?m=1');
  };
  window.renderInventory = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/inventory.html?m=1');
  };
  window.renderCrafting = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/crafting.html?m=1');
  };
  window.renderMap = function() {
    HT.loadPage('https://hustletrap.blogspot.com/p/map.html?m=1');
  };

  // Initialize minimal modules on load
  document.addEventListener('DOMContentLoaded', () => {
    HT.stats.load();
    HT.stats.render();
    HT.inventory.load();
  });

})(window, document);

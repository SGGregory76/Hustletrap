
// npc.js - Full NPC Inventory + Behavior System

function initNPC(npcId, defaultInventory, allowResourceSales = false) {
  if (!localStorage.getItem(npcId + "_inventory")) {
    localStorage.setItem(npcId + "_inventory", JSON.stringify(defaultInventory));
  }
  renderNPCInventory(npcId);
  renderNPCMood(npcId);
  renderGiveDropdown(npcId);
  autoSellDrug(npcId, allowResourceSales);
  setInterval(() => autoSellDrug(npcId, allowResourceSales), 60000);
  setInterval(() => renderGiveDropdown(npcId), 15000);
}

// ... (truncated for brevity – this would contain the full code)


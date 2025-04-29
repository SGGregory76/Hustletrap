function autoSellFromNpc(npcId) {
  const npc = npcs[npcId];
  
  for (const itemName in npc.inventory) {
    if (npc.inventory[itemName] > 0) {
      npc.inventory[itemName]--;
      playerStats.cash += calculatePrice(npcId, itemName);
      console.log(`${npc.name} auto-sold 1x ${itemName}`);
      break;
    }
  }

  saveAll();
}

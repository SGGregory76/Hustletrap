function calculatePrice(npcId, itemName) {
  const npc = npcs[npcId];
  const item = itemCatalog[itemName];
  const loyaltyTier = getLoyaltyTier(npc.loyalty);

  return Math.floor(item.basePrice * (1 + loyaltyTiers[loyaltyTier].tradeBonus));
}

function getLoyaltyTier(loyalty) {
  if (loyalty >= 71) return 'trusted';
  if (loyalty >= 30) return 'neutral';
  return 'suspicious';
}

function tradeItem(npcId, mode, itemName) {
  const npc = npcs[npcId];
  const price = calculatePrice(npcId, itemName);

  if (mode === "buy") {
    if (playerStats.cash >= price) {
      playerStats.cash -= price;
      playerInventory[itemName] = (playerInventory[itemName] || 0) + 1;
      console.log(`Bought ${itemName} from ${npc.name}`);
    } else {
      console.log("Not enough cash to buy!");
    }
  }
  
  if (mode === "sell") {
    if (playerInventory[itemName] && playerInventory[itemName] > 0) {
      playerInventory[itemName]--;
      playerStats.cash += price;
      console.log(`Sold ${itemName} to ${npc.name}`);
    } else {
      console.log("Nothing to sell!");
    }
  }
  
  if (mode === "give") {
    if (playerInventory[itemName] && playerInventory[itemName] > 0) {
      playerInventory[itemName]--;
      npc.inventory[itemName] = (npc.inventory[itemName] || 0) + 1;
      console.log(`Gave ${itemName} to ${npc.name}`);
    } else {
      console.log("Nothing to give!");
    }
  }

  saveAll();
}

// trade-engine.js

const DRUGS = {
  weed: { icon: "🍁", basePrice: 50, class: "organic" },
  pills: { icon: "💊", basePrice: 100, class: "synthetic" },
  synths: { icon: "🌀", basePrice: 200, class: "designer" },
  cigs: { icon: "🚬", basePrice: 10, class: "street" }
};

function calculatePrice(drug, npcId, direction = "sell") {
  const npc = getNPC(npcId);
  const base = DRUGS[drug].basePrice;
  let mod = 1;

  if (npc.preferredDrugs.includes(drug)) mod += 0.2;
  if (npc.loyalty === "Trusted") mod += 0.1;
  if (npc.loyalty === "Suspicious") mod -= 0.2;

  if (direction === "buy") mod += 0.3;

  return Math.floor(base * mod);
}

function sellToNPC(drug, npcId) {
  const npc = getNPC(npcId);
  if (!npc || !DRUGS[drug]) return;

  if (!playerInventory.includes(drug)) {
    alert("You don’t have that item.");
    return;
  }

  const price = calculatePrice(drug, npcId, "sell");

  // Remove from player inventory
  const index = playerInventory.indexOf(drug);
  if (index !== -1) playerInventory.splice(index, 1);

  // Add to NPC storage
  for (let i = 0; i < npc.storage.length; i++) {
    if (!npc.storage[i]) {
      npc.storage[i] = drug;
      break;
    }
  }

  // Adjust player stats
  playerCash += price;
  updateNPCTrust(npcId, +1);
  logEvent(`Sold ${DRUGS[drug].icon} to ${npc.name} for $${price}`);
  updateUI();
}

function buyFromNPC(drug, npcId) {
  const npc = getNPC(npcId);
  if (!npc || !DRUGS[drug]) return;

  if (!npc.storage.includes(drug)) {
    alert("That item isn’t available.");
    return;
  }

  const price = calculatePrice(drug, npcId, "buy");
  if (playerCash < price) {
    alert("Not enough cash.");
    return;
  }

  // Deduct and add
  playerCash -= price;
  playerInventory.push(drug);
  npc.storage[npc.storage.indexOf(drug)] = null;

  updateNPCTrust(npcId, +1);
  logEvent(`Bought ${DRUGS[drug].icon} from ${npc.name} for $${price}`);
  updateUI();
}

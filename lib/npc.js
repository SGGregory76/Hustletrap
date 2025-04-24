
// npc.js - Reusable NPC logic

function initNPC(npcId, defaultInventory) {
  if (!localStorage.getItem(npcId + "_inventory")) {
    localStorage.setItem(npcId + "_inventory", JSON.stringify(defaultInventory));
  }
  renderNPCInventory(npcId);
  renderNPCMood(npcId);
  renderGiveDropdown(npcId);
  autoSellDrug(npcId);
  setInterval(() => autoSellDrug(npcId), 60000);
  setInterval(() => renderGiveDropdown(npcId), 15000);
}

function getPlayerInventory() {
  return JSON.parse(localStorage.getItem("inventory") || "[]");
}

function removeFromPlayerInventory(name) {
  let inv = getPlayerInventory();
  const index = inv.findIndex(item => item.name === name);
  if (index !== -1) inv.splice(index, 1);
  localStorage.setItem("inventory", JSON.stringify(inv));
}

function giveDrug(npcId) {
  const selected = document.getElementById("giveSelect").value;
  if (!selected) return;

  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  for (let i = 0; i < npcInventory.length; i++) {
    if (!npcInventory[i]) {
      const parts = selected.split("|");
      npcInventory[i] = { name: parts[0], icon: parts[1], qty: 1, price: 40 };
      removeFromPlayerInventory(parts[0]);
      localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
      document.getElementById("logMsg").textContent = `Gave ${parts[1]} ${parts[0]} to ${npcId}`;
      renderNPCInventory(npcId);
      renderGiveDropdown(npcId);
      maybeUseDrug(npcId, i);
      return;
    }
  }

  document.getElementById("logMsg").textContent = `${npcId}'s inventory is full.`;
}

function maybeUseDrug(npcId, index) {
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  const item = npcInventory[index];
  const useChance = Math.random();
  if (useChance > 0.6) {
    const moods = {
      "Adderall": "Hyperactive",
      "LSD": "Unpredictable",
      "Marijuana": "Chill",
      "Oxytocin": "Affectionate",
      "Unknown Compound": "Unstable"
    };
    localStorage.setItem(npcId + "_onDrug", item.name);
    localStorage.setItem(npcId + "_mood", moods[item.name] || "Affected");
    
  
  const item = npcInventory[index];
  npcInventory[index].consumed = true;

  // Pay the player when the drug is used
  const xpGain = 2;
  const repGain = 1;
  const heatGain = 1;
  const levelBefore = Math.floor((stats.xp || 0) / 10);

  stats.cash = (stats.cash || 0) + item.price;
  stats.xp = (stats.xp || 0) + xpGain;
  stats.rep = (stats.rep || 0) + repGain;
  stats.heat = (stats.heat || 0) + heatGain;

  const levelAfter = Math.floor(stats.xp / 10);
  const leveledUp = levelAfter > levelBefore;

  const stats = JSON.parse(localStorage.getItem("stats") || "{}");
  stats.cash = (stats.cash || 0) + item.price;
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem("statsUpdated", Date.now());

  // Log the usage and payment
  if (leveledUp) {
    logs.unshift({ time: new Date().toLocaleString(), message: `You leveled up! Now Level ${levelAfter}` });
  }
  logs.unshift({ time: new Date().toLocaleString(), message: `${npcId} used ${item.icon} ${item.name}. Paid you $${item.price}, XP +${xpGain}, REP +${repGain}, Heat +${heatGain}` });

  const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
  logs.unshift({ time: new Date().toLocaleString(), message: `${npcId} used ${item.icon} ${item.name}. Paid you $${item.price}` });
  localStorage.setItem("gameLog", JSON.stringify(logs));

  localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));

    localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
    renderNPCInventory(npcId);
    renderNPCMood(npcId);
  }
}

function renderNPCInventory(npcId) {
  const container = document.getElementById("npcInventory");
  const npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  container.innerHTML = "";
  npcInventory.forEach(item => {
    if (item) {
      container.innerHTML += `
        <div class="inventory-slot">
          <span>${item.icon} <strong>${item.name}</strong> x${item.qty} - $${item.price}</span>
        </div>
      `;
    } else {
      container.innerHTML += `<div class="inventory-slot"><span class='used'>Empty Slot</span></div>`;
    }
  });
}

function renderNPCMood(npcId) {
  document.getElementById("moodText").textContent = localStorage.getItem(npcId + "_mood") || "Neutral";
  document.getElementById("drugEffect").textContent = localStorage.getItem(npcId + "_onDrug") || "None";
}

function renderGiveDropdown(npcId) {
  const sel = document.getElementById("giveSelect");
  const inv = getPlayerInventory().filter(i => i.name && i.icon);
  if (inv.length === 0) {
    sel.innerHTML = "<option disabled>No items to give</option>";
    return;
  }
  sel.innerHTML = inv.map(i => `<option value="${i.name}|${i.icon}">${i.icon} ${i.name}</option>`).join("");
}

function autoSellDrug(npcId) {
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  const lastSale = parseInt(localStorage.getItem(npcId + "_lastSale") || "0");
  const now = Date.now();
  if (now - lastSale > 1000 * 60 * 3) {
    for (let i = 0; i < npcInventory.length; i++) {
      if (npcInventory[i] && !npcInventory[i].consumed && npcInventory[i].qty > 0) {
        const item = npcInventory[i];
        item.qty -= 1;
        if (item.qty <= 0) npcInventory[i] = null;
        localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
        localStorage.setItem(npcId + "_lastSale", now.toString());

        const stats = JSON.parse(localStorage.getItem("stats") || "{}");
        stats.cash = (stats.cash || 0) + item.price;
        localStorage.setItem("stats", JSON.stringify(stats));
        localStorage.setItem("statsUpdated", Date.now());

        const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
        logs.unshift({ time: new Date().toLocaleString(), message: `${npcId} sold ${item.icon} ${item.name} for $${item.price}` });
        localStorage.setItem("gameLog", JSON.stringify(logs));

        document.getElementById("logMsg").textContent = `${npcId} sold ${item.icon} ${item.name} for $${item.price}`;
        renderNPCInventory(npcId);
        return;
      }
    }
  }
}

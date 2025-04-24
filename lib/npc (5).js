
// npc.js - Full working version (identical to npc-v2.0.js)

function initNPC(npcId, defaultInventory, allowResourceSales = false) {
  if (!localStorage.getItem(npcId + "_inventory")) {
    localStorage.setItem(npcId + "_inventory", JSON.stringify(defaultInventory));
  }
  renderNPCInventory(npcId);
  renderGiveDropdown(npcId);
  renderNPCMood(npcId);
  autoSellDrug(npcId, allowResourceSales);
  setInterval(() => autoSellDrug(npcId, allowResourceSales), 60000);
  setInterval(() => renderGiveDropdown(npcId), 15000);
}

function renderNPCInventory(npcId) {
  const container = document.getElementById("npcInventory");
  if (!container) return;
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory") || "[]");
  container.innerHTML = "";
  npcInventory.forEach((item, i) => {
    if (item) {
      container.innerHTML += `
        <div class="inventory-slot">
          <span>${item.icon} <strong>${item.name}</strong> x${item.qty} - $${item.price}</span>
          ${!item.consumed ? `<button onclick="buyFromNPC('${npcId}', ${i})">Buy</button>` : ''}
        </div>
      `;
    } else {
      container.innerHTML += `<div class="inventory-slot"><span class='used'>Empty Slot</span></div>`;
    }
  });
}

function renderNPCMood(npcId) {
  const mood = localStorage.getItem(npcId + "_mood") || "Neutral";
  const drug = localStorage.getItem(npcId + "_onDrug") || "None";
  const moodEl = document.getElementById("moodText");
  const drugEl = document.getElementById("drugEffect");
  if (moodEl) moodEl.textContent = mood;
  if (drugEl) drugEl.textContent = drug;
}

function renderGiveDropdown(npcId) {
  const sel = document.getElementById("giveSelect");
  if (!sel) return;
  const inv = JSON.parse(localStorage.getItem("inventory") || "[]").filter(i => i.name && i.icon);
  if (inv.length === 0) {
    sel.innerHTML = "<option disabled>No items to give</option>";
    return;
  }
  sel.innerHTML = inv.map(i => `<option value="${i.name}|${i.icon}">${i.icon} ${i.name}</option>`).join("");
}

function giveDrug(npcId) {
  const selected = document.getElementById("giveSelect").value;
  if (!selected) return;
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  for (let i = 0; i < npcInventory.length; i++) {
    if (!npcInventory[i]) {
      const parts = selected.split("|");
      npcInventory[i] = { name: parts[0], icon: parts[1], qty: 1, price: 40, type: "drug" };
      removeFromPlayerInventory(parts[0]);
      localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
      const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
      logs.unshift({ time: new Date().toLocaleString(), message: `You gave ${npcId} ${parts[1]} ${parts[0]} from your inventory.` });
      localStorage.setItem("gameLog", JSON.stringify(logs));
      renderNPCInventory(npcId);
      renderGiveDropdown(npcId);
      maybeUseDrug(npcId, i);
      return;
    }
  }
}

function removeFromPlayerInventory(name) {
  let inv = JSON.parse(localStorage.getItem("inventory") || "[]");
  const index = inv.findIndex(item => item.name === name);
  if (index !== -1) inv.splice(index, 1);
  localStorage.setItem("inventory", JSON.stringify(inv));
}

function maybeUseDrug(npcId, index) {
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory"));
  const item = npcInventory[index];
  if (Math.random() > 0.6) {
    const moods = { "Adderall": "Hyperactive", "LSD": "Unpredictable", "Marijuana": "Chill", "Oxytocin": "Affectionate" };
    localStorage.setItem(npcId + "_onDrug", item.name);
    localStorage.setItem(npcId + "_mood", moods[item.name] || "Affected");
    item.consumed = true;
    const stats = JSON.parse(localStorage.getItem("stats") || "{}");
    const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
    const xpGain = 2, repGain = 1, heatGain = 1;
    const levelBefore = Math.floor((stats.xp || 0) / 10);
    stats.cash = (stats.cash || 0) + item.price;
    stats.xp = (stats.xp || 0) + xpGain;
    stats.rep = (stats.rep || 0) + repGain;
    stats.heat = (stats.heat || 0) + heatGain;
    const levelAfter = Math.floor(stats.xp / 10);
    if (levelAfter > levelBefore) logs.unshift({ time: new Date().toLocaleString(), message: `You leveled up! Now Level ${levelAfter}` });
    logs.unshift({ time: new Date().toLocaleString(), message: `${npcId} used ${item.icon} ${item.name}. Paid you $${item.price}, XP +${xpGain}, REP +${repGain}, Heat +${heatGain}` });
    localStorage.setItem("gameLog", JSON.stringify(logs));
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("statsUpdated", Date.now());
    localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
    renderNPCMood(npcId);
  }
}

function autoSellDrug(npcId, allowResourceSales = false) {
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory") || "[]");
  const now = Date.now();
  const lastSale = parseInt(localStorage.getItem(npcId + "_lastSale") || "0");
  if (now - lastSale < 1000 * 60 * 3) return;
  const stats = JSON.parse(localStorage.getItem("stats") || "{}");
  const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
  let sold = false;
  for (let i = 0; i < npcInventory.length; i++) {
    const item = npcInventory[i];
    if (!item || item.consumed || item.qty <= 0) continue;
    if (item.type !== "drug" && !allowResourceSales) continue;
    const xpGain = 2, repGain = 1, heatGain = 1;
    const levelBefore = Math.floor((stats.xp || 0) / 10);
    stats.cash = (stats.cash || 0) + item.price;
    stats.xp = (stats.xp || 0) + xpGain;
    stats.rep = (stats.rep || 0) + repGain;
    stats.heat = (stats.heat || 0) + heatGain;
    const levelAfter = Math.floor(stats.xp / 10);
    if (levelAfter > levelBefore) logs.unshift({ time: new Date().toLocaleString(), message: `You leveled up! Now Level ${levelAfter}` });
    logs.unshift({ time: new Date().toLocaleString(), message: `${npcId} sold ${item.icon} ${item.name} for $${item.price}, XP +${xpGain}, REP +${repGain}, Heat +${heatGain}` });
    item.qty -= 1;
    if (item.qty <= 0) npcInventory[i] = null;
    sold = true;
  }
  if (sold) {
    localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
    localStorage.setItem(npcId + "_lastSale", now.toString());
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("statsUpdated", Date.now());
    localStorage.setItem("gameLog", JSON.stringify(logs));
    renderNPCInventory(npcId);
  }
}

function buyFromNPC(npcId, index) {
  let npcInventory = JSON.parse(localStorage.getItem(npcId + "_inventory") || "[]");
  const item = npcInventory[index];
  if (!item || item.qty <= 0) return;
  let stats = JSON.parse(localStorage.getItem("stats") || "{}");
  if ((stats.cash || 0) < item.price) {
    alert("Not enough cash.");
    return;
  }
  stats.cash -= item.price;
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem("statsUpdated", Date.now());
  let inv = JSON.parse(localStorage.getItem("inventory") || "[]");
  inv.push({ name: item.name, icon: item.icon, desc: "Bought from " + npcId });
  localStorage.setItem("inventory", JSON.stringify(inv));
  const logs = JSON.parse(localStorage.getItem("gameLog") || "[]");
  logs.unshift({ time: new Date().toLocaleString(), message: `You bought ${item.icon} ${item.name} from ${npcId} for $${item.price}` });
  localStorage.setItem("gameLog", JSON.stringify(logs));
  item.qty -= 1;
  if (item.qty <= 0) npcInventory[index] = null;
  localStorage.setItem(npcId + "_inventory", JSON.stringify(npcInventory));
  renderNPCInventory(npcId);
}

console.log("npc.js loaded");

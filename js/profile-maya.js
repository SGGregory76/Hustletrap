<script>
// === INITIALIZE STORAGE ===
let currentTradeMode = null;

let mayaStorage = JSON.parse(localStorage.getItem('mayaStorage')) || {
  "Weed Bag": 0,
  "Pill Pack": 0,
  "Mystery Item": 0
};

let playerInventory = JSON.parse(localStorage.getItem('playerInventory')) || {
  "Weed Bag": 2,
  "Pill Pack": 1,
  "Mystery Item": 0
};

let playerStats = JSON.parse(localStorage.getItem('playerStats')) || {
  cash: 500,
  xp: 0,
  rep: 0,
  rp: 0,
  heat: 0
};

let mayaLoyalty = parseInt(localStorage.getItem('mayaLoyalty')) || 70;
let mayaSalesCounter = 0;

// Save changes
function saveAll() {
  localStorage.setItem('mayaStorage', JSON.stringify(mayaStorage));
  localStorage.setItem('playerInventory', JSON.stringify(playerInventory));
  localStorage.setItem('playerStats', JSON.stringify(playerStats));
  localStorage.setItem('mayaLoyalty', mayaLoyalty);
}

// === UPDATE MAYA PROFILE INVENTORY ===
function updateMayaProfileInventory() {
  const profileGrid = document.getElementById('mayaProfileInventory');
  if (!profileGrid) return;
  profileGrid.innerHTML = `
    <div class="inventory-item">🌿 Weed Bag: ${mayaStorage["Weed Bag"] || 0}</div>
    <div class="inventory-item">💊 Pill Pack: ${mayaStorage["Pill Pack"] || 0}</div>
    <div class="inventory-item">❓ Mystery Item: ${mayaStorage["Mystery Item"] || 0}</div>
  `;
}

// === PANEL SYSTEM ===
function showPanel(type) {
  const panel = document.getElementById('npcPanel');

  if (type === 'trade') {
    panel.innerHTML = `
      <div id="modeMessage" style="margin-bottom:10px;color:lightblue;">Select a Mode:</div>
      <div class="trade-buttons">
        <button class="trade-button" onclick="setTradeMode('buy')">🛒 Buy</button>
        <button class="trade-button" onclick="setTradeMode('sell')">💵 Sell</button>
        <button class="trade-button" onclick="setTradeMode('give')">🎁 Give</button>
      </div>
      <div style="background:#191919;padding:10px;border-radius:10px;margin-bottom:10px;">
        <strong>Your Inventory:</strong>
        <div id="playerInventoryGrid" class="inventory-grid"></div>
      </div>
      <div style="background:#1e1e1e;padding:10px;border-radius:10px;">
        <strong>Maya's Sales Inventory:</strong>
        <div id="mayaInventoryGrid" class="inventory-grid"></div>
      </div>
    `;
    populateTradeInventory();
    log("Viewing Trade Options.");
  }
}


// === INVENTORY RENDERING ===
function renderPlayerInventory() {
  return `
    <div class="inventory-item">🌿 Weed Bag: ${playerInventory["Weed Bag"] || 0}</div>
    <div class="inventory-item">💊 Pill Pack: ${playerInventory["Pill Pack"] || 0}</div>
    <div class="inventory-item">❓ Mystery Item: ${playerInventory["Mystery Item"] || 0}</div>
  `;
}

function populateTradeInventory() {
  const playerGrid = document.getElementById('playerInventoryGrid');
  const mayaGrid = document.getElementById('mayaInventoryGrid');

  if (playerGrid) {
    playerGrid.innerHTML = `
      <div class="inventory-item" onclick="tradeAction('Weed Bag')">🌿 Weed Bag (${playerInventory["Weed Bag"]})</div>
      <div class="inventory-item" onclick="tradeAction('Pill Pack')">💊 Pill Pack (${playerInventory["Pill Pack"]})</div>
      <div class="inventory-item" onclick="tradeAction('Mystery Item')">❓ Mystery Item (${playerInventory["Mystery Item"]})</div>
    `;
  }
  
  if (mayaGrid) {
    mayaGrid.innerHTML = `
      <div class="inventory-item">🌿 Weed Bag (${mayaStorage["Weed Bag"]})</div>
      <div class="inventory-item">💊 Pill Pack (${mayaStorage["Pill Pack"]})</div>
      <div class="inventory-item">❓ Mystery Item (${mayaStorage["Mystery Item"]})</div>
    `;
  }
}

// === TRADE FUNCTIONS ===
function setTradeMode(mode) {
  currentTradeMode = mode;
  const modeMsg = document.getElementById('modeMessage');
  if (modeMsg) modeMsg.innerHTML = `Current Mode: <strong>${mode.toUpperCase()}</strong>`;
  populateTradeInventory();
}

function setTradeMode(mode) {
  currentTradeMode = mode;
  const modeMsg = document.getElementById('modeMessage');
  if (modeMsg) {
    modeMsg.innerHTML = `Current Mode: <strong>${mode.toUpperCase()}</strong>`;
  }
  populateTradeInventory();
}

function populateTradeInventory() {
  const playerGrid = document.getElementById('playerInventoryGrid');
  const mayaGrid = document.getElementById('mayaInventoryGrid');

  if (playerGrid) {
    playerGrid.innerHTML = `
      <div class="inventory-item" onclick="tradeAction('Weed Bag')">🌿 Weed Bag (${playerInventory["Weed Bag"] || 0})</div>
      <div class="inventory-item" onclick="tradeAction('Pill Pack')">💊 Pill Pack (${playerInventory["Pill Pack"] || 0})</div>
      <div class="inventory-item" onclick="tradeAction('Mystery Item')">❓ Mystery Item (${playerInventory["Mystery Item"] || 0})</div>
    `;
  }

  if (mayaGrid) {
    mayaGrid.innerHTML = `
      <div class="inventory-item">🌿 Weed Bag (${mayaStorage["Weed Bag"] || 0})</div>
      <div class="inventory-item">💊 Pill Pack (${mayaStorage["Pill Pack"] || 0})</div>
      <div class="inventory-item">❓ Mystery Item (${mayaStorage["Mystery Item"] || 0})</div>
    `;
  }
}

function tradeAction(itemName) {
  if (!currentTradeMode) {
    alert("Select Buy, Sell, or Give first!");
    log("<span style='color:red;'>No trade mode selected!</span>");
    return;
  }
  if (currentTradeMode === 'buy') buyFromMaya(itemName);
  else if (currentTradeMode === 'sell') sellToMaya(itemName);
  else if (currentTradeMode === 'give') giveToMaya(itemName);
}


// === AUTO SELL ===
function mayaSellItem() {
  for (const item in mayaStorage) {
    if (mayaStorage[item] > 0) {
      mayaStorage[item]--;
      playerStats.cash += getPayout(item);
      mayaSalesCounter++;
      saveAll();
      updateMayaProfileInventory();
      log(`Maya sold 1x ${item}. You earned cash.`);
      if (mayaSalesCounter >= 5) {
        playerStats.heat++;
        mayaSalesCounter = 0;
        log(`<span style="color:orange;">Heat increased by 1!</span>`);
      }
      if (playerStats.heat >= 10) offerBribeOrBust();
      break;
    }
  }
}

function startDynamicSelling() {
  setTimeout(function loop() {
    mayaSellItem();
    setTimeout(loop, getSellInterval());
  }, getSellInterval());
}

function getSellInterval() {
  if (mayaLoyalty > 70) return 45000;
  if (mayaLoyalty >= 30) return 60000;
  return 90000;
}

// === SYSTEM HELPERS ===
function log(msg) {
  const logBox = document.getElementById('npcLog');
  logBox.innerHTML += msg + "<br>";
  logBox.scrollTop = logBox.scrollHeight;
}

function startMission(name) {
  log(`Started mission: ${name}`);
}

function offerBribeOrBust() {
  if (playerStats.cash >= 300) {
    const confirmBribe = confirm("Heat too high! Pay $300 to reduce it?");
    if (confirmBribe) {
      playerStats.cash -= 300;
      playerStats.heat = Math.max(playerStats.heat - 5, 0);
      mayaLoyalty = Math.min(mayaLoyalty + 5, 100);
      log(`<span style="color:lightgreen;">Bribe paid. Heat reduced. Loyalty boosted.</span>`);
    } else {
      log(`<span style="color:red;">Bribe refused. Risk of bust increased.</span>`);
    }
    saveAll();
  } else {
    log(`<span style="color:red;">Not enough cash for bribe!</span>`);
  }
}

function updateMood() {
  const mood = document.querySelector('.npc-mood');
  if (mayaLoyalty > 70) mood.innerHTML = "Mood: Loyal";
  else if (mayaLoyalty >= 30) mood.innerHTML = "Mood: Neutral";
  else mood.innerHTML = "Mood: Suspicious";
}

// === START EVERYTHING ===
updateMood();
updateMayaProfileInventory();
startDynamicSelling();
setInterval(() => {
  if (playerStats.heat > 0) {
    playerStats.heat--;
    saveAll();
    log(`Heat reduced by 1.`);
  }
}, 300000);

</script>

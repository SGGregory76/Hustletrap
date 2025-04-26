// mission-engine.js
// Self-contained mission engine with CSS injection, persistent stats, and mission completion sync across pages

// 1. Log engine load
console.log("✅ MissionEngine loaded with stats persistence");

// 2. Inject scoped CSS (panel, icons, lists, flex buttons)
(function() {
  const css = `
    /* Panel container */
    #mission-container {
      margin: 16px 0;
      padding: 16px;
      background: #111;
      border: 2px solid #444;
      border-radius: 8px;
      font-family: Roboto, sans-serif;
      box-sizing: border-box;
    }
    /* Force white text and remove link underlines */
    #mission-container, #mission-container * {
      color: #fff !important;
      text-decoration: none !important;
    }
    /* Title + icon */
    #mission-container #mission-title {
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px; font-size: 1.4rem; font-weight: bold;
      position: relative;
    }
    #mission-container #mission-title::before {
      content: "";
      display: inline-block;
      width: 28px; height: 28px;
      margin-right: 10px;
      background-size: contain;
      background-repeat: no-repeat;
      vertical-align: middle;
    }
    /* Mission icons */
    #mission-container[data-mission="find-burner-os"]    #mission-title::before { background-image: url('https://yourcdn.com/icons/phone.svg'); }
    #mission-container[data-mission="street-purity-test"] #mission-title::before { background-image: url('https://yourcdn.com/icons/bag.svg'); }
    #mission-container[data-mission="delivery-route-test"]#mission-title::before { background-image: url('https://yourcdn.com/icons/map.svg'); }

    /* Description lists & paragraphs */
    #mission-container #mission-desc { margin-bottom: 12px; line-height: 1.6; }
    #mission-container #mission-desc p { margin-bottom: 10px; }
    #mission-container #mission-desc ul { margin: 0 0 12px 20px; padding: 0; list-style: disc; }
    #mission-container #mission-desc li { margin-bottom: 8px; }

    /* Timer */
    #mission-container #mission-timer {
      text-align: right; font-size: 0.9rem; margin-bottom: 12px;
    }

    /* Flex‑distributed buttons */
    #mission-container #mission-options { display: flex; gap: 12px; }
    #mission-container #mission-options > button {
      flex: 1; margin: 0; padding: 10px;
      background: #222 !important;
      border: 2px solid #555 !important;
      border-radius: 6px;
      cursor: pointer;
      box-sizing: border-box;
      transition: background 0.2s, border-color 0.2s;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      font-size: 1rem; line-height: 1.2;
      color: #fff !important;
    }
    #mission-container #mission-options > button:hover {
      background: #333 !important; border-color: #777 !important;
    }

    /* Outcome box */
    #mission-container #mission-outcome {
      margin-top: 12px; padding: 8px;
      border-radius: 6px; text-align: center;
      box-sizing: border-box; font-size: 1rem;
    }
    #mission-container #mission-outcome.success { background: #0b3 !important; }
    #mission-container #mission-outcome.mixed   { background: #a60 !important; }
    #mission-container #mission-outcome.failure { background: #a00 !important; }
    #mission-container #mission-outcome.info    { background: #0066cc !important; }
    #mission-container #mission-outcome.info::before { content: "ℹ️ "; vertical-align: middle; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// 3. Persistent storage helpers
let completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
function hasCompleted(id) { return completedMissions.includes(id); }
function markCompleted(id) {
  if (!hasCompleted(id)) {
    completedMissions.push(id);
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }
}

// Stats persistence
let playerStats = JSON.parse(localStorage.getItem('playerStats') || '{"xp":0,"rep":0,"cash":0,"heat":0}');
function saveStats() { localStorage.setItem('playerStats', JSON.stringify(playerStats)); }

// 4. Mission definitions
const Missions = {
  "find-burner-os": {
    title: "Something in the Alley",
    description: `
      <p>You wake up cold, alone, and hungry on a backstreet bench.</p>
      <p>Your head’s pounding and your pockets are empty—until you spot something half-buried in rain-soaked trash.</p>
    `,
    options: [
      { key: "A", label: "Pick it up and power it on", outcome: "success" },
      { key: "B", label: "Leave it—you don’t want trouble", outcome: "failure" }
    ],
    onSuccess() {
      markCompleted("find-burner-os");
      updateStats({ xp: 0 });
      showOutcome("The screen flickers alive… Redirecting to Burner OS!", "success");
      setTimeout(() => location.href = "/p/burner-os.html?m=1", 1500);
    },
    onFailure() {
      showOutcome("You walk on… but you’ll regret not grabbing that.", "failure");
    }
  },
  "street-purity-test": {
    title: "Guess the Purest Bag",
    description: `
      <ul>
        <li>Bag A: cloudy green with seedy bits</li>
        <li>Bag B: deep emerald, crystal-coated</li>
        <li>Bag C: pale with sticky residue</li>
      </ul>
      <p>Only one is <strong>100% pure</strong>—pick it to earn full rep. Pick wrong and you’ll raise Heat.</p>
    `,
    timerSeconds: 20,
    options: [
      { key: "A", label: "Bag A", outcome: "failure" },
      { key: "B", label: "Bag B", outcome: "success" },
      { key: "C", label: "Bag C", outcome: "failure" }
    ],
    onSuccess() {
      markCompleted("street-purity-test");
      updateStats({ xp: 10, rep: 5, cash: 50 });
      showOutcome("Correct! Maya’s impressed.", "success");
    },
    onFailure() {
      updateStats({ heat: 10, rep: -2 });
      showOutcome("Wrong bag—alarm raised! Heat +10.", "failure");
    }
  },
  "delivery-route-test": {
    title: "Route the Stash Safely",
    description: `
      <ul>
        <li>Route A: skirts the docks (slow, low heat)</li>
        <li>Route B: cuts through the badlands (fast, medium heat)</li>
        <li>Route C: goes via the interstate (fastest, high heat)</li>
      </ul>
      <p>Choose wisely before time runs out.</p>
    `,
    timerSeconds: 15,
    options: [
      { key: "A", label: "Route A", outcome: "mixed" },
      { key: "B", label: "Route B", outcome: "success" },
      { key: "C", label: "Route C", outcome: "failure" }
    ],
    onSuccess() {
      markCompleted("delivery-route-test");
      updateStats({ xp: 20, rep: 10, cash: 100 });
      showOutcome("Smooth delivery! 🎉", "success");
    },
    onMixed() {
      updateStats({ xp: 10, rep: 5, heat: 5, cash: 50 });
      showOutcome("Slow but safe—+small reward.", "mixed");
    },
    onFailure() {
      updateStats({ heat: 15, rep: -5 });
      showOutcome("Ambushed! Heat +10.", "failure");
    }
  }
};

// 5. Engine core
const MissionEngine = {
  current: null,
  timerId: null,
  start(id) {
    if (hasCompleted(id)) { showOutcome("You’ve already completed this mission.", "info"); return; }
    const m = Missions[id];
    if (!m) return console.error(`No mission: ${id}`);
    this.current = m;
    this.render();
    if (m.timerSeconds) this.runTimer(m.timerSeconds);
  },
  render() {
    const m = this.current;
    document.getElementById("mission-title").innerText = m.title;
    document.getElementById("mission-desc").innerHTML = m.description;
    document.getElementById("mission-timer").innerText = "";
    const opts = document.getElementById("mission-options");
    opts.innerHTML = "";
    m.options.forEach(o => {
      const btn = document.createElement("button");
      btn.innerText = o.label;
      btn.onclick = () => this.choose(o.key);
      opts.appendChild(btn);
    });
    document.getElementById("mission-outcome").innerText = "";
  },
  choose(key) {
    clearInterval(this.timerId);
    const o = this.current.options.find(x => x.key === key);
    if (o.outcome === "success") this.current.onSuccess();
    else if (o.outcome === "mixed") this.current.onMixed();
    else this.current.onFailure();
  },
  runTimer(sec) {
    let t = sec;
    const disp = document.getElementById("mission-timer");
    disp.innerText = `Time: ${t}s`;
    this.timerId = setInterval(() => {
      t--;
      disp.innerText = `Time: ${t}s`;
      if (t <= 0) { clearInterval(this.timerId); this.current.onFailure(); }
    }, 1000);
  }
};

// 6. Stats updater & showOutcome
function updateStats(delta) {
  if (delta.xp) playerStats.xp += delta.xp;
  if (delta.rep) playerStats.rep += delta.rep;
  if (delta.cash) playerStats.cash += delta.cash;
  if (delta.heat) playerStats.heat += delta.heat;
  saveStats();
  if (typeof renderHUD === "function") renderHUD();
}
function showOutcome(msg, status) {
  const el = document.getElementById("mission-outcome");
  el.innerText = msg;
  el.className = status;
}

// 7. Expose globally
window.MissionEngine = MissionEngine;
window.playerStats = playerStats;

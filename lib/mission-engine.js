// mission-engine.js

console.log("✅ MissionEngine loaded");

// 0. Mission completion log (prevent replay farming)
let completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
function hasCompleted(id) {
  return completedMissions.includes(id);
}
function markCompleted(id) {
  if (!hasCompleted(id)) {
    completedMissions.push(id);
    localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
  }
}

// 1. Optional title icons (if you want icons before each title)
const MissionIcons = {
  "find-burner-os":      "https://yourcdn.com/icons/phone.svg",
  "street-purity-test":  "https://yourcdn.com/icons/bag.svg",
  "delivery-route-test": "https://yourcdn.com/icons/map.svg"
};

// 2. Define your missions
const Missions = {
  "find-burner-os": {
    id: "find-burner-os",
    title: "Something in the Alley",
    description: `
      You’re creeping down a dark backstreet when you spot a cracked smartphone half-buried in trash.
      It looks battered but… it might still work.
      What do you do?
    `,
    options: [
      { key: "A", label: "Pick it up and power it on", outcome: "success" },
      { key: "B", label: "Leave it—you don’t want trouble", outcome: "failure" }
    ],
    onSuccess: () => {
      markCompleted("find-burner-os");
      showOutcome("The screen flickers alive… Redirecting to your Burner OS!", "success");
      setTimeout(() => {
        window.location.href = "https://hustletrap.blogspot.com/p/burner-os.html?m=1";
      }, 1500);
    },
    onFailure: () => {
      showOutcome("You walk on… but you’ll regret not grabbing that.", "failure");
      setTimeout(() => MissionEngine.start("find-burner-os"), 3000);
    }
  },

  "street-purity-test": {
    id: "street-purity-test",
    title: "Guess the Purest Bag",
    description: `
      Maya slides you three nondescript bags.
      “One is pure, two are cut with filler.
      Pick the pure one if you want full rep.”
    `,
    options: [
      { key: "A", label: "Bag A", outcome: "failure" },
      { key: "B", label: "Bag B", outcome: "success" },
      { key: "C", label: "Bag C", outcome: "failure" }
    ],
    timerSeconds: 20,
    onSuccess: () => {
      markCompleted("street-purity-test");
      updateStats({ xp: 10, rep: 5, cash: 50 });
      renderHUD();
      showOutcome("Correct! Maya’s impressed.", "success");
    },
    onFailure: () => {
      updateStats({ heat: 10, rep: -2 });
      renderHUD();
      showOutcome("Wrong bag—alarm’s raised! Heat +10.", "failure");
    }
  },

  "delivery-route-test": {
    id: "delivery-route-test",
    title: "Route the Stash Safely",
    description: `
      You’ve got three routes to move product across town.
      Route A skirts the docks (slow, low heat).
      Route B cuts through the badlands (fast, medium heat).
      Route C goes via the interstate (fastest, high heat).
      Choose wisely before time runs out.
    `,
    options: [
      { key: "A", label: "Route A", outcome: "mixed" },
      { key: "B", label: "Route B", outcome: "success" },
      { key: "C", label: "Route C", outcome: "failure" }
    ],
    timerSeconds: 15,
    onSuccess: () => {
      markCompleted("delivery-route-test");
      updateStats({ xp: 20, rep: 10, cash: 100 });
      renderHUD();
      showOutcome("You slipped past patrols—smooth delivery!", "success");
    },
    onMixed: () => {
      updateStats({ xp: 10, rep: 5, heat: 5, cash: 50 });
      renderHUD();
      showOutcome("Route A was slow but safe-ish—smaller haul.", "mixed");
    },
    onFailure: () => {
      updateStats({ heat: 15, rep: -5 });
      renderHUD();
      showOutcome("Cops swarmed Route C—package seized!", "failure");
    }
  }
};

// 3. Core engine
const MissionEngine = {
  currentMission: null,
  timerId: null,

  start(missionId) {
    if (hasCompleted(missionId)) {
      showOutcome("You’ve already completed this mission.", "info");
      return;
    }
    const m = Missions[missionId];
    if (!m) return console.error(`No mission: ${missionId}`);
    this.currentMission = m;
    renderSituation(m);
    if (m.timerSeconds) this.startTimer(m.timerSeconds);
  },

  choose(optionKey) {
    const { options, onSuccess, onMixed, onFailure } = this.currentMission;
    const choice = options.find(o => o.key === optionKey);
    if (this.timerId) clearInterval(this.timerId);

    switch (choice.outcome) {
      case "success": onSuccess(); break;
      case "mixed":   onMixed   && onMixed();   break;
      default:        onFailure(); break;
    }

    this.currentMission = null;
  },

  startTimer(sec) {
    let t = sec;
    const display = document.getElementById("mission-timer");
    display.textContent = `Time: ${t}s`;
    this.timerId = setInterval(() => {
      t--;
      display.textContent = `Time: ${t}s`;
      if (t <= 0) {
        clearInterval(this.timerId);
        this.currentMission.onFailure();
        this.currentMission = null;
      }
    }, 1000);
  }
};

// 4. Rendering helpers
function renderSituation(m) {
  const container = document.getElementById("mission-container");
  container.setAttribute("data-mission", m.id);

  // Title + icon if defined
  const titleEl = document.getElementById("mission-title");
  titleEl.innerHTML = "";
  const iconUrl = MissionIcons[m.id];
  if (iconUrl) {
    const img = document.createElement("img");
    img.src = iconUrl;
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.verticalAlign = "middle";
    img.style.marginRight = "8px";
    img.alt = m.title + " icon";
    titleEl.appendChild(img);
  }
  titleEl.appendChild(document.createTextNode(m.title));

  // Description
  document.getElementById("mission-desc").innerHTML = m.description;

  // Options
  const opts = document.getElementById("mission-options");
  opts.innerHTML = "";
  m.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.label;
    btn.onclick = () => MissionEngine.choose(opt.key);
    opts.appendChild(btn);
  });
}

// 5. Outcome display
function showOutcome(message, status) {
  const out = document.getElementById("mission-outcome");
  out.innerText = message;
  out.className = status;
}

// 6. Stats helper (calls your game’s functions)
function updateStats(delta) {
  if (delta.xp)   playerStats.xp   += delta.xp;
  if (delta.rep)  playerStats.rep  += delta.rep;
  if (delta.cash) playerStats.cash += delta.cash;
  if (delta.heat) playerStats.heat += delta.heat;
  saveStats();
  renderHUD();
}

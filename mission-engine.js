console.log("✅ MissionEngine loaded");

// 1. Define your missions
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
      showOutcome("The screen flickers alive… You’ve got your Burner OS!", "success");
      setTimeout(() => MissionEngine.start("street-purity-test"), 2000);
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
      updateStats({ xp: +10, rep: +5, cash: +50 });
      showOutcome("Correct! Maya’s impressed.", "success");
    },
    onFailure: () => {
      updateStats({ heat: +10, rep: -2 });
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
      updateStats({ xp: +20, rep: +10, cash: +100 });
      showOutcome("You slipped past patrols—smooth delivery!", "success");
    },
    onMixed: () => {
      updateStats({ xp: +10, rep: +5, heat: +5, cash: +50 });
      showOutcome("Route A was slow but safe-ish—smaller haul.", "mixed");
    },
    onFailure: () => {
      updateStats({ heat: +15, rep: -5 });
      showOutcome("Cops swarmed Route C—package seized!", "failure");
    }
  }
};

// 2. Core engine
const MissionEngine = {
  currentMission: null,
  timerId: null,

  start(missionId) {
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
      case "mixed":   onMixed();   break;
      default:          onFailure(); break;
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

// 3. Helper functions
function renderSituation(m) {
  const container = document.getElementById("mission-container");
  container.setAttribute("data-mission", m.id);

  document.getElementById("mission-title").innerText = m.title;
  document.getElementById("mission-desc").innerHTML = m.description;
  const opts = document.getElementById("mission-options");
  opts.innerHTML = "";
  m.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.label;
    btn.onclick = () => MissionEngine.choose(opt.key);
    opts.appendChild(btn);
  });
}

function showOutcome(message, status) {
  const out = document.getElementById("mission-outcome");
  out.innerText = message;
  out.className = status;
}

function updateStats(delta) {
  if (delta.xp)   playerStats.xp   += delta.xp;
  if (delta.rep)  playerStats.rep  += delta.rep;
  if (delta.cash) playerStats.cash += delta.cash;
  if (delta.heat) playerStats.heat += delta.heat;
  saveStats();
  renderHUD();
}

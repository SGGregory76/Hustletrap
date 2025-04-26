console.log("✅ MissionEngine loaded with CSS and Icons");

// Inject mission panel CSS and mission-specific title icons
(function(){
  const css = `
  #mission-container {
    margin: 16px 0;
    padding: 16px;
    background: #111;
    border: 2px solid #444;
    border-radius: 8px;
    color: #fff;
    font-family: Roboto, sans-serif;
    box-sizing: border-box;
  }
  #mission-container #mission-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 1.3rem;
  }
  #mission-container #mission-title::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
  /* Title icons per mission */
  #mission-container[data-mission="find-burner-os"] #mission-title::before {
    background-image: url('https://yourcdn.com/icons/phone.svg');
  }
  #mission-container[data-mission="street-purity-test"] #mission-title::before {
    background-image: url('https://yourcdn.com/icons/bag.svg');
  }
  #mission-container[data-mission="delivery-route-test"] #mission-title::before {
    background-image: url('https://yourcdn.com/icons/map.svg');
  }
  #mission-container #mission-desc {
    color: #ddd;
    margin-bottom: 12px;
    line-height: 1.5;
  }
  #mission-container #mission-timer {
    text-align: right;
    font-size: 0.9rem;
    color: #eee;
    margin-bottom: 12px;
  }
  #mission-container #mission-options > button {
    display: block;
    width: 100%;
    margin: 12px 0 !important;
    padding: 12px 16px;
    background: #222 !important;
    border: 2px solid #555 !important;
    border-radius: 6px;
    color: #fff !important;
    cursor: pointer;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    box-sizing: border-box;
    transition: background 0.2s, border-color 0.2s;
  }
  #mission-container #mission-options > button:hover {
    background: #333 !important;
    border-color: #777 !important;
  }
  #mission-container #mission-outcome {
    margin-top: 12px;
    padding: 8px;
    border-radius: 6px;
    text-align: center;
    color: #fff;
    box-sizing: border-box;
  }
  #mission-container #mission-outcome.success { background: #0b3; }
  #mission-container #mission-outcome.mixed   { background: #a60; }
  #mission-container #mission-outcome.failure { background: #a00; }
  #mission-container #mission-outcome.info    { background: #0066cc; }
  #mission-container #mission-outcome.info::before {
    content: "ℹ️ ";
    vertical-align: middle;
  }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// Mission completion log (prevent replay farming)
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

// Optional title icons mapping (for reference)
const MissionIcons = {
  "find-burner-os":      "https://yourcdn.com/icons/phone.svg",
  "street-purity-test":  "https://yourcdn.com/icons/bag.svg",
  "delivery-route-test": "https://yourcdn.com/icons/map.svg"
};

// Mission definitions
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
      { key: "A", label: "Pick it up and power it on",   outcome: "success" },
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

// Core engine
const MissionEngine = {
  currentMission: null,
  timerId: null,

  start(missionId) {
    if (hasCompleted(missionId)) {
      showOutcome("You’ve already completed this mission.", "info");
      return;
    }
    const m = Missions[missionId];
    if (!m) return console.error(`

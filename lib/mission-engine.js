// mission-engine.js

console.log("✅ MissionEngine loaded with full styling");

// 0. Inject mission panel CSS (scoped, high-contrast, icons)
(() => {
  const css = `
    /* Base panel */
    #mission-container {
      margin: 16px 0;
      padding: 16px;
      background: #111;
      border: 2px solid #444;
      border-radius: 8px;
      font-family: Roboto, sans-serif;
      box-sizing: border-box;
    }
    /* Force all text & links white */
    #mission-container,
    #mission-container * {
      color: #fff !important;
    }
    /* Title styling with icons */
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
    /* Mission-specific icons */
    #mission-container[data-mission="find-burner-os"] #mission-title::before {
      background-image: url('https://yourcdn.com/icons/phone.svg');
    }
    #mission-container[data-mission="street-purity-test"] #mission-title::before {
      background-image: url('https://yourcdn.com/icons/bag.svg');
    }
    #mission-container[data-mission="delivery-route-test"] #mission-title::before {
      background-image: url('https://yourcdn.com/icons/map.svg');
    }
    /* Description */
    #mission-container #mission-desc {
      margin-bottom: 12px;
      line-height: 1.5;
    }
    /* Timer */
    #mission-container #mission-timer {
      text-align: right;
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
    /* Buttons */
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
    /* Outcome box */
    #mission-container #mission-outcome {
      margin-top: 12px;
      padding: 8px;
      border-radius: 6px;
      text-align: center;
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

// 1. Mission completion log (prevent replay farming)
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

// 2. Title icons mapping
const MissionIcons = {
  "find-burner-os":      "https://yourcdn.com/icons/phone.svg",
  "street-purity-test":  "https://yourcdn.com/icons/bag.svg",
  "delivery-route-test": "https://yourcdn.com/icons/map.svg"
};

// 3. Mission definitions
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
      showOutcome("The screen flickers alive… Redirecting to Burner OS!", "success");
      setTimeout(() => window.location.href = "https://hustletrap.blogspot.com/p/burner-os.html?m=1", 1500);
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

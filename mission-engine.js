console.log("✅ MissionEngine loaded");

// 1. Define your missions
const Missions = {

  // Opening prologue before Burner OS
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

  // Your “guess the purest bag” street-dealer test
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

  // Existing delivery-route-test
  "delivery-route-test": {
    /* … your existing code … */
  }
};

// …rest of your engine (MissionEngine, renderSituation, etc.)…



// logic-v1.0.js — NPC Personality and Game Behavior Extensions

console.log("logic-v1.0.js loaded");

// Future NPC logic hooks go here
const npcLogic = {
  maya: {
    moodTriggers: {
      heatHigh: "Paranoid",
      cashLow: "Frustrated",
    },
    perks: {
      loyaltyBonus: 2,
      discountOnWeed: true,
    },
    isAlly: true
  },
  rico: {
    moodTriggers: {
      repHigh: "Dominant",
      xpLow: "Dismissive"
    },
    perks: {
      strongArms: true
    },
    isAlly: false
  }
};

// Example dynamic reaction system
function updateNPCLogic(npcId) {
  const stats = JSON.parse(localStorage.getItem("stats") || "{}");
  const profile = npcLogic[npcId];
  if (!profile) return;

  const mood = (stats.heat > 20 && profile.moodTriggers.heatHigh) ? profile.moodTriggers.heatHigh :
               (stats.cash < 100 && profile.moodTriggers.cashLow) ? profile.moodTriggers.cashLow :
               (stats.rep > 25 && profile.moodTriggers.repHigh) ? profile.moodTriggers.repHigh :
               (stats.xp < 10 && profile.moodTriggers.xpLow) ? profile.moodTriggers.xpLow : "Neutral";

  localStorage.setItem(npcId + "_mood", mood);
  document.getElementById("moodText")?.textContent = mood;
}

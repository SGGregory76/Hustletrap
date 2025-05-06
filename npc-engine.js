// npc-engine.js

const NPCS = {
  blaze: {
    name: "Blaze",
    archetype: "Hustler",
    personality: "Aggressive",
    loyalty: "Neutral", // Trusted, Neutral, Suspicious
    trust: 5,
    preferredDrugs: ["weed"],
    preferredResources: ["streetgear"],
    storage: ["weed", "cigs", null],
    maxSlots: 3
  },
  // Add more NPCs like Maya, Rico, etc.
};

function getNPC(id) {
  return NPCS[id] || null;
}

function updateNPCTrust(npcId, amount) {
  const npc = getNPC(npcId);
  if (!npc) return;
  npc.trust += amount;
  if (npc.trust >= 10) npc.loyalty = "Trusted";
  else if (npc.trust <= 0) npc.loyalty = "Suspicious";
  else npc.loyalty = "Neutral";
}

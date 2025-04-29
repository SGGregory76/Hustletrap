const itemCatalog = {
  "Weed Bag": { type: "drug", basePrice: 100, potency: 1, heatGenerated: 1, stockLimit: 50 },
  "Pill Pack": { type: "drug", basePrice: 150, potency: 2, heatGenerated: 2, stockLimit: 30 },
  "Mystery Item": { type: "drug", basePrice: 250, potency: 3, heatGenerated: 3, stockLimit: 20 }
};

const loyaltyTiers = {
  trusted: { tradeBonus: -0.15, bribeEffectiveness: 1.2, unlockSpecialMissions: true },
  neutral: { tradeBonus: 0.0, bribeEffectiveness: 1.0, unlockSpecialMissions: false },
  suspicious: { tradeBonus: 0.25, bribeEffectiveness: 0.7, unlockSpecialMissions: false }
};

const heatSystem = {
  maxHeat: 10,
  heatDecayRate: 1,
  bribeCost: 300,
  bustPenalty: { cashLoss: 500, inventoryLossPercent: 50, repLoss: 5 }
};

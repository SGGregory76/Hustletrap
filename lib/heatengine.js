function checkHeat() {
  if (playerStats.heat >= heatSystem.maxHeat) {
    bustPlayer();
  }
}

function bustPlayer() {
  playerStats.cash = Math.max(playerStats.cash - heatSystem.bustPenalty.cashLoss, 0);
  playerStats.rep = Math.max(playerStats.rep - heatSystem.bustPenalty.repLoss, 0);
  console.log("Busted by police!");
  playerStats.heat = 0;
  saveAll();
}

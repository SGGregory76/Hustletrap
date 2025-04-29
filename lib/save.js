function saveAll() {
  localStorage.setItem('playerStats', JSON.stringify(playerStats));
  localStorage.setItem('npcs', JSON.stringify(npcs));
  localStorage.setItem('playerInventory', JSON.stringify(playerInventory));
}

GameState.updateStats(mission.rewards);
if (mission.id==='prologue') {
  localStorage.setItem('prologueDone','true');
}
GameState.addMission(mission.id);
location.hash = '#/' + mission.next;

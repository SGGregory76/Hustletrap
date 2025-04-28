(function(){
  let missions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
  let status = missions.includes('find-burner-os') 
    ? "✅ Prologue Complete" 
    : "🔓 Find your Burner OS";

  document.getElementById('hud-missions').innerHTML = `
    <div class="hud-title">Missions</div>
    ${status}
  `;
})();

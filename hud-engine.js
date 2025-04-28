(function(){
  const SK = 'playerStats';
  let stats = JSON.parse(localStorage.getItem(SK) || '{}');

  stats.xp   = stats.xp   || 0;
  stats.rep  = stats.rep  || 0;
  stats.rp   = stats.rp   || 0;
  stats.heat = stats.heat || 0;
  stats.cash = stats.cash || 0;

  localStorage.setItem(SK, JSON.stringify(stats));

  document.getElementById('hud-stats').innerHTML = `
    <div class="hud-title">Player Stats</div>
    ⭐ XP: ${stats.xp} | 🧢 REP: ${stats.rep}<br>
    ⚡ RP: ${stats.rp} | 🔥 Heat: ${stats.heat}<br>
    💵 Cash: $${stats.cash}
  `;
})();

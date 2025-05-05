(function() {
  const SK = 'gameData';
  let stats = JSON.parse(localStorage.getItem(SK) || '{}');
  ['xp', 'rep', 'rp', 'heat', 'cash'].forEach(k => stats[k] = stats[k] || 0);
  localStorage.setItem(SK, JSON.stringify(stats));

  // Live banner (outside iframe only)
  if (window === window.top) {
    const banner = document.createElement('div');
    banner.style = "background:#222; color:#8cf; font-size:13px; padding:6px; text-align:center; border-bottom:1px solid #444;";
    banner.innerHTML = `
      HustleTrap — 
      EXP: ${stats.xp} | 
      REP: ${stats.rep} | 
      HEAT: ${stats.heat} | 
      RP: ${stats.rp} | 
      CASH: $${stats.cash}
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // Log page visit
  const logKey = "gameLog";
  const log = JSON.parse(localStorage.getItem(logKey) || "[]");
  log.push({
    type: "visit",
    page: location.pathname,
    time: new Date().toISOString()
  });
  localStorage.setItem(logKey, JSON.stringify(log));
})();

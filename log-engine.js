(function(){
  let logs = JSON.parse(localStorage.getItem('playerLog') || '[]');
  if (logs.length === 0) {
    logs.push("🌃 You woke up under neon haze...");
    localStorage.setItem('playerLog', JSON.stringify(logs));
  }

  document.getElementById('hud-log').innerHTML = `
    <div class="hud-title">Event Log</div>
    ${logs.slice(-5).reverse().map(e=>`• ${e}`).join('<br>')}
  `;
})();


// profile-blaze.js — Blaze’s Profile Introduction (with Completed Check)
;(function(){
  const PAGE_ID   = 'profile-blaze.html';
  const OS_URL    = 'https://hustletrap.blogspot.com/p/burner-os.html?m=1';
  const SK        = 'playerStats';
  const CK        = 'completedMissions';

  // Only run on this page
  if (!location.href.includes(PAGE_ID)) return;

  // Load or init storage
  let stats     = JSON.parse(localStorage.getItem(SK) || '{"xp":0,"rep":0,"rp":0,"heat":0,"cash":0}');
  let completed = JSON.parse(localStorage.getItem(CK)  || '[]');
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function log(m){ console.log('[Profile-Blaze]', m); }

  // DOM references
  const descEl = document.getElementById('pb-desc');
  const optsEl = document.getElementById('pb-options');
  const outEl  = document.getElementById('pb-outcome');

  // If already completed, show the final screen
  if (completed.includes('profile-blaze')) {
    descEl.innerHTML = `<p>🔥 You’ve already completed the Prologue with Blaze.</p>`;
    optsEl.innerHTML = '';
    outEl.innerHTML = `
      <p><strong>Your Final Stats</strong><br>
         XP: ${stats.xp} | Rep: ${stats.rep} | RP: ${stats.rp}<br>
         Cash: $${stats.cash} | Heat: ${stats.heat}
      </p>
      <p><a href="${OS_URL}" style="color:#0af;">→ Open Burner OS</a></p>
    `;
    return;
  }

  // Otherwise, run the original 5-question flow...
  // Seed Blaze as first contact
  HT.contacts.add('Blaze');
  log('Seeded contact: Blaze');

  const questions = [
    { text:"What motivates you most?", choices:[
        {icon:"🔥", label:"Power & respect",       delta:{rep:5, rp:1}},
        {icon:"💰", label:"Money & profit",         delta:{cash:10}},
        {icon:"🕵️", label:"Information & secrets", delta:{xp:5}}
    ]},
    { text:"Your first deal goes sideways—do you...", choices:[
        {icon:"🚔", label:"Fight the law",     delta:{heat:5, rep:2}},
        {icon:"💵", label:"Pay it off",        delta:{cash:-5, rep:1}},
        {icon:"📝", label:"Lay low & learn",   delta:{xp:3, rp:2}}
    ]},
    { text:"A rival offers an alliance—your move?", choices:[
        {icon:"🤝", label:"Join forces",      delta:{rep:3, rp:3}},
        {icon:"⚔️", label:"Eliminate them",   delta:{heat:3, xp:2}},
        {icon:"🎭", label:"Play both sides",  delta:{rp:5}}
    ]},
    { text:"You need new contacts—where to look?", choices:[
        {icon:"🌃", label:"Nightclub backroom", delta:{rp:2, cash:5}},
        {icon:"🏭", label:"Abandoned warehouse", delta:{heat:2, xp:3}},
        {icon:"💻", label:"Darknet forums",     delta:{xp:4, rep:1}}
    ]},
    { text:"Blaze asks: “What’s your code name?”", choices:[
        {icon:"💀", label:"Reaper",           delta:{rep:2, rp:2}},
        {icon:"🦅", label:"Hawkeye",          delta:{xp:2, rp:1}},
        {icon:"🕶️", label:"Ghost",            delta:{heat:1}}
    ]}
  ];

  function ask(i) {
    const q = questions[i];
    descEl.innerHTML = `<p>${q.text}</p>`;
    optsEl.innerHTML = '';
    outEl.innerText = '';

    q.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.innerHTML = `<span style="font-size:1.5rem; margin-right:6px;">${ch.icon}</span>${ch.label}`;
      btn.onclick = () => {
        // Apply stats delta
        Object.entries(ch.delta).forEach(([k,v]) => stats[k] = (stats[k]||0) + v);
        save(SK, stats);
        log(`Q${i+1}: ${ch.label}`);
        // Next or finish
        i+1 < questions.length ? ask(i+1) : finish();
      };
      optsEl.appendChild(btn);
    });
  }

  function finish() {
    // Disable further choices
    optsEl.querySelectorAll('button').forEach(b => b.disabled = true);

    // Flag mission complete
    completed.push('profile-blaze');
    save(CK, completed);
    log('Mission complete: profile-blaze');

    // Seed Jax
    HT.contacts.add('Jax');
    log('Seeded contact: Jax');

    // Flat mission bonus
    const bonus = { xp:5, rep:1, rp:2, heat:0, cash:0 };
    Object.entries(bonus).forEach(([k,v]) => stats[k] = (stats[k]||0) + v);
    save(SK, stats);
    log(`Bonus awarded: +${bonus.xp} XP, +${bonus.rep} Rep, +${bonus.rp} RP`);

    // Update HUD
    HT.stats.update(stats);
    log(`Final stats: ${JSON.stringify(stats)}`);

    // Show final and link into Burner OS
    outEl.className = 'info';
    outEl.innerHTML = `
      <p><strong>Your Starting Stats</strong><br>
         XP: ${stats.xp} | Rep: ${stats.rep} | RP: ${stats.rp}<br>
         Cash: $${stats.cash} | Heat: ${stats.heat}
      </p>
      <p><a href="${OS_URL}" style="color:#0af;">→ Open Burner OS</a></p>
    `;
  }

  // Kick off the quiz
  ask(0);
})();

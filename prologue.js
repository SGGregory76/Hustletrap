// prologue.js — Blaze’s Prologue: Find Burner OS
(function() {
  const PROLOGUE_URL = 'prologue-something-in-alley-you-wake-up.html';
  if (!location.href.includes(PROLOGUE_URL)) return;

  const OS_URL    = 'https://hustletrap.blogspot.com/p/burner-os.html?m=1';
  const STATS_KEY = 'playerStats';
  const COMP_KEY  = 'completedMissions';

  // Load or init
  let stats     = JSON.parse(localStorage.getItem(STATS_KEY) || '{"xp":0,"rep":0,"rp":0,"heat":0,"cash":0}');
  let completed = JSON.parse(localStorage.getItem(COMP_KEY)  || '[]');
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function log(m){ console.log('[Prologue]',m); }

  // Seed Blaze
  if (!completed.includes('find-burner-os')) {
    HT.contacts.add('Blaze');
    log('Seeded contact: Blaze');
  }

  // Quiz data
  const questions = [
    { q:"What’s your vice?",          c:[
        {i:"🔥",t:"Chaos over calm",   d:{xp:10, rp:2}},
        {i:"💼",t:"Business first",     d:{rep:5, cash:5}},
        {i:"🌪️",t:"Chase the thrill",   d:{rp:8, heat:3}}
    ]},
    { q:"Speed or stealth?",           c:[
        {i:"💨",t:"Full throttle",      d:{rp:10,heat:5}},
        {i:"🌑",t:"Through shadows",     d:{rep:5, xp:3}},
        {i:"⚖️",t:"Depends on job",      d:{xp:3, rep:3, rp:3}}
    ]},
    { q:"Street cred or zero heat?",   c:[
        {i:"🏆",t:"Cred’s king",        d:{rep:5, heat:5}},
        {i:"☂️",t:"Stay clean",         d:{cash:5, xp:2}},
        {i:"☯️",t:"Balance is all",     d:{xp:4, rep:4, cash:4}}
    ]},
    { q:"Favorite late-night snack?",  c:[
        {i:"🍕",t:"Greasy pizza",       d:{rp:5, heat:2}},
        {i:"🍫",t:"Chocolate bars",     d:{xp:2, rp:2}},
        {i:"🌮",t:"Tacos on the go",    d:{cash:3, rep:1}}
    ]},
    { q:"Your motto in one word?",     c:[
        {i:"🚀",t:"Go!",                d:{xp:5, rp:5}},
        {i:"💀",t:"Fearless",           d:{heat:5, rep:3}},
        {i:"🧠",t:"Calculated",         d:{rep:4, xp:2}}
    ]}
  ];

  // DOM refs
  const descEl = document.getElementById('desc');
  const optsEl = document.getElementById('options');
  const outEl  = document.getElementById('outcome');

  // Recursive quiz
  function ask(i) {
    const step = questions[i];
    descEl.innerHTML = `<p>${step.q}</p>`;
    optsEl.innerHTML = '';
    outEl.innerText = '';
    step.c.forEach(ch => {
      const btn = document.createElement('button');
      btn.innerHTML = `<span style="font-size:1.5rem;">${ch.i}</span>${ch.t}`;
      btn.onclick = () => {
        Object.entries(ch.d).forEach(([k,v]) => stats[k] = (stats[k]||0)+v);
        save(STATS_KEY, stats);
        log(`Q${i+1}: ${ch.t}`);
        if (i+1 < questions.length) ask(i+1);
        else finish();
      };
      optsEl.appendChild(btn);
    });
  }

  // Finish logic
  function finish() {
    Array.from(optsEl.children).forEach(b=>b.disabled=true);

    if (!completed.includes('find-burner-os')) {
      completed.push('find-burner-os');
      save(COMP_KEY, completed);
      log('Mission complete: find-burner-os');
    }

    HT.contacts.add('Jax');
    log('Seeded contact: Jax');

    const bonus = {xp:5, rep:1, rp:2, heat:0, cash:0};
    Object.entries(bonus).forEach(([k,v]) => stats[k] = (stats[k]||0)+v);
    save(STATS_KEY, stats);
    log(`Bonus: +${bonus.xp}XP +${bonus.rep}Rep +${bonus.rp}RP`);

    HT.stats.update(stats);
    log(`Final stats: ${JSON.stringify(stats)}`);

    outEl.className = 'info';
    outEl.innerHTML = `
      <p><strong>Final Stats</strong><br>
         XP:${stats.xp} Rep:${stats.rep} RP:${stats.rp}<br>
         Heat:${stats.heat} Cash:$${stats.cash}
      </p>
      <p>Redirecting to Burner OS…</p>
      <p><a href="${OS_URL}">Click here if not redirected</a></p>
    `;
    setTimeout(() => location.replace(OS_URL), 1800);
  }

  // Kick off
  ask(0);
})();

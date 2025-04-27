// mission-engine.js
// Mission engine with CSS injection, stats persistence, and locked option selection

// 1. Engine load log
console.log("✅ MissionEngine loaded with option lock");

// 2. Scoped CSS for mission panel and icons
(function() {
  const css = `
    /* Panel container */
    #mission-container { margin:16px 0; padding:16px; background:#111; border:2px solid #444; border-radius:8px; font-family:Roboto,sans-serif; box-sizing:border-box; }
    /* White text & no underlines */
    #mission-container, #mission-container * { color:#fff!important; text-decoration:none!important; }
    /* Title + icon */
    #mission-container #mission-title { display:flex; align-items:center; justify-content:center; margin-bottom:12px; font-size:1.4rem; font-weight:bold; position:relative; }
    #mission-container #mission-title::before { content:""; display:inline-block; width:28px; height:28px; margin-right:10px; background-size:contain; background-repeat:no-repeat; vertical-align:middle; }
    #mission-container[data-mission="find-burner-os"]    #mission-title::before { background-image:url('https://yourcdn.com/icons/phone.svg'); }
    #mission-container[data-mission="street-purity-test"] #mission-title::before { background-image:url('https://yourcdn.com/icons/bag.svg'); }
    #mission-container[data-mission="delivery-route-test"]#mission-title::before { background-image:url('https://yourcdn.com/icons/map.svg'); }
    /* Description */
    #mission-container #mission-desc { margin-bottom:12px; line-height:1.6; }
    #mission-container #mission-desc p { margin-bottom:10px; }
    #mission-container #mission-desc ul { margin:0 0 12px 20px; padding:0; list-style:disc; }
    #mission-container #mission-desc li { margin-bottom:8px; }
    /* Timer */
    #mission-container #mission-timer { text-align:right; font-size:.9rem; margin-bottom:12px; }
    /* Flex buttons */
    #mission-container #mission-options { display:flex; gap:12px; }
    #mission-container #mission-options > button {
      flex:1; margin:0; padding:10px; background:#222!important; border:2px solid #555!important; border-radius:6px;
      cursor:pointer; box-sizing:border-box; transition:background .2s,border-color .2s; text-shadow:0 1px 2px rgba(0,0,0,0.8);
      font-size:1rem; line-height:1.2; color:#fff!important;
    }
    #mission-container #mission-options > button:disabled { opacity:0.6; cursor:default; }
    #mission-container #mission-options > button:hover:enabled { background:#333!important; border-color:#777!important; }
    /* Outcome */
    #mission-container #mission-outcome { margin-top:12px; padding:8px; border-radius:6px; text-align:center; box-sizing:border-box; font-size:1rem; }
    #mission-container #mission-outcome.success { background:#0b3!important; }
    #mission-container #mission-outcome.mixed   { background:#a60!important; }
    #mission-container #mission-outcome.failure { background:#a00!important; }
    #mission-container #mission-outcome.info    { background:#0066cc!important; }
    #mission-container #mission-outcome.info::before { content:"ℹ️ "; vertical-align:middle; }
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
})();

// 3. Persistence helpers
let completedMissions = JSON.parse(localStorage.getItem('completedMissions') || '[]');
function hasCompleted(id) { return completedMissions.includes(id); }
function markCompleted(id) { if (!hasCompleted(id)) { completedMissions.push(id); localStorage.setItem('completedMissions', JSON.stringify(completedMissions)); }}

let playerStats = JSON.parse(localStorage.getItem('playerStats') || '{"xp":0,"rep":0,"cash":0,"heat":0}');
function saveStats() { localStorage.setItem('playerStats', JSON.stringify(playerStats)); }

// 4. Mission definitions
const Missions = {
  "find-burner-os": {
    title: "Something in the Alley",
    description: `<p>You wake up cold... you spot a cracked smartphone.</p>`,
    options: [ { key:"A",label:"Pick it up and power it on",outcome:"success" }, { key:"B",label:"Leave it—you don’t want trouble",outcome:"failure" } ],
    onSuccess() { markCompleted("find-burner-os"); updateStats({}); showOutcome("Redirecting to OS...","success"); setTimeout(()=>location.href="/p/burner-os.html?m=1",1500); },
    onFailure() { showOutcome("You walk on...","failure"); }
  },
  "street-purity-test": {
    title: "Guess the Purest Bag",
    description: `<ul><li>Bag A</li><li>Bag B</li><li>Bag C</li></ul><p>Pick the pure one.</p>`,
    timerSeconds:20,
    options:[ {key:"A",label:"Bag A",outcome:"failure"},{key:"B",label:"Bag B",outcome:"success"},{key:"C",label:"Bag C",outcome:"failure"} ],
    onSuccess(){ markCompleted("street-purity-test"); updateStats({xp:10,rep:5}); showOutcome("Correct!","success"); },
    onFailure(){ updateStats({heat:10}); showOutcome("Wrong!","failure"); }
  },
  "delivery-route-test": {
    title: "Route the Stash Safely",
    description: `<ul><li>Route A</li><li>Route B</li><li>Route C</li></ul><p>Choose wisely.</p>`,
    timerSeconds:15,
    options:[ {key:"A",label:"Route A",outcome:"mixed"},{key:"B",label:"Route B",outcome:"success"},{key:"C",label:"Route C",outcome:"failure"} ],
    onSuccess(){ markCompleted("delivery-route-test"); updateStats({cash:100}); showOutcome("Smooth!","success"); },
    onMixed(){ updateStats({cash:50,heat:5}); showOutcome("Mixed.","mixed"); },
    onFailure(){ updateStats({heat:15}); showOutcome("Ambushed!","failure"); }
  }
};

// 5. Engine core with option lock
const MissionEngine = {
  current:null,
  timerId:null,
  start(id){
    if(hasCompleted(id)) { showOutcome("Already completed.","info"); return; }
    this.current = Missions[id]; if(!this.current) return;
    this.render(); if(this.current.timerSeconds) this.runTimer(this.current.timerSeconds);
  },
  render(){
    const m=this.current;
    document.getElementById("mission-title").innerText=m.title;
    document.getElementById("mission-desc").innerHTML=m.description;
    document.getElementById("mission-timer").innerText="";
    const opts=document.getElementById("mission-options"); opts.innerHTML="";
    m.options.forEach(o=>{
      const btn=document.createElement("button"); btn.innerText=o.label; btn.onclick=()=>this.choose(o.key); opts.appendChild(btn);
    });
    document.getElementById("mission-outcome").innerText="";
  },
  disableOptions(){
    document.querySelectorAll('#mission-options button').forEach(b=>{ b.disabled=true; });
  },
  choose(key){
    this.disableOptions();
    clearInterval(this.timerId);
    const o=this.current.options.find(x=>x.key===key);
    if(o.outcome==="success") this.current.onSuccess();
    else if(o.outcome==="mixed") this.current.onMixed();
    else this.current.onFailure();
    this.current=null;
  },
  runTimer(sec){
    let t=sec; const d=document.getElementById("mission-timer"); d.innerText=`Time: ${t}s`;
    this.timerId=setInterval(()=>{ t--; d.innerText=`Time: ${t}s`; if(t<=0){ clearInterval(this.timerId); this.current.onFailure(); this.current=null; } },1000);
  }
};

// 6. Stats update & outcome
function updateStats(d){ if(d.xp)playerStats.xp+=d.xp; if(d.rep)playerStats.rep+=d.rep; if(d.cash)playerStats.cash+=d.cash; if(d.heat)playerStats.heat+=d.heat; saveStats(); }
function showOutcome(msg,status){ const e=document.getElementById("mission-outcome"); e.innerText=msg; e.className=status; }

// 7. Expose
window.MissionEngine=MissionEngine; window.playerStats=playerStats;

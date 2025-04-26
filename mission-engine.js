// mission-engine.js
// Fully self-contained mission engine with CSS injection, icons, completion log, and stats updates

// 1. Log engine load
console.log("✅ MissionEngine loaded with full styling");

// 2. Inject scoped CSS for mission panel and icons
(function() {
  const css = `
    /* Panel base */
    #mission-container {
      margin:16px 0;
      padding:16px;
      background:#111;
      border:2px solid #444;
      border-radius:8px;
      font-family:Roboto,sans-serif;
      box-sizing:border-box;
    }
    /* Force all text and links white */
    #mission-container, #mission-container * {
      color:#fff!important;
    }
    #mission-container a {
      text-decoration:none!important;
    }
    /* Title with icon placeholder */
    #mission-container #mission-title {
      display:flex;
      align-items:center;
      justify-content:center;
      margin-bottom:12px;
      font-size:1.3rem;
      position:relative;
    }
    #mission-container #mission-title::before {
      content:"";
      display:inline-block;
      width:24px;
      height:24px;
      margin-right:8px;
      background-size:contain;
      background-repeat:no-repeat;
      vertical-align:middle;
    }
    /* Mission icons */
    #mission-container[data-mission="find-burner-os"]    #mission-title::before { background-image:url('https://yourcdn.com/icons/phone.svg'); }
    #mission-container[data-mission="street-purity-test"] #mission-title::before { background-image:url('https://yourcdn.com/icons/bag.svg'); }
    #mission-container[data-mission="delivery-route-test"]#mission-title::before { background-image:url('https://yourcdn.com/icons/map.svg'); }
    /* Description & timer */
    #mission-container #mission-desc { margin-bottom:12px; line-height:1.5; }
    #mission-container #mission-timer { text-align:right; font-size:0.9rem; margin-bottom:12px; }
    /* Buttons */
    #mission-container #mission-options>button {
      display:block;
      width:100%;
      margin:12px 0!important;
      padding:12px 16px;
      background:#222!important;
      border:2px solid #555!important;
      border-radius:6px;
      cursor:pointer;
      text-shadow:0 1px 2px rgba(0,0,0,0.8);
      box-sizing:border-box;
      transition:background .2s,border-color .2s;
    }
    #mission-container #mission-options>button:hover {
      background:#333!important;
      border-color:#777!important;
    }
    /* Outcome */
    #mission-container #mission-outcome {
      margin-top:12px;
      padding:8px;
      border-radius:6px;
      text-align:center;
      box-sizing:border-box;
    }
    #mission-container #mission-outcome.success { background:#0b3!important; }
    #mission-container #mission-outcome.mixed   { background:#a60!important; }
    #mission-container #mission-outcome.failure { background:#a00!important; }
    #mission-container #mission-outcome.info    { background:#0066cc!important; }
    #mission-container #mission-outcome.info::before {
      content:"ℹ️ "; vertical-align:middle;
    }
  `;
  const style=document.createElement('style');
  style.textContent=css;
  document.head.appendChild(style);
})();

// 3. One-time completion log
let completedMissions=JSON.parse(localStorage.getItem('completedMissions')||'[]');
function hasCompleted(id){return completedMissions.includes(id);}  
function markCompleted(id){if(!hasCompleted(id)){completedMissions.push(id);localStorage.setItem('completedMissions',JSON.stringify(completedMissions));}}

// 4. Missions definitions
const Missions={
  "find-burner-os":{
    id:"find-burner-os",
    title:"Something in the Alley",
    description:`
      You’re creeping down a dark backstreet when you spot a cracked smartphone half-buried in trash.
      It looks battered but… it might still work.
      What do you do?
    `,
    options:[
      {key:"A",label:"Pick it up and power it on",outcome:"success"},
      {key:"B",label:"Leave it—you don’t want trouble",outcome:"failure"}
    ],
    onSuccess:()=>{markCompleted("find-burner-os");showOutcome("The screen flickers alive… Redirecting to Burner OS!","success");setTimeout(()=>window.location.href="https://hustletrap.blogspot.com/p/burner-os.html?m=1",1500);},
    onFailure:()=>{showOutcome("You walk on… but you’ll regret not grabbing that.","failure");setTimeout(()=>MissionEngine.start("find-burner-os"),3000);}
  },
  "street-purity-test":{
    id:"street-purity-test",
    title:"Guess the Purest Bag",
    description:`
      Maya slides you three nondescript bags.
      “One is pure, two are cut with filler.
      Pick the pure one if you want full rep.”
    `,
    timerSeconds:20,
    options:[
      {key:"A",label:"Bag A",outcome:"failure"},
      {key:"B",label:"Bag B",outcome:"success"},
      {key:"C",label:"Bag C",outcome:"failure"}
    ],
    onSuccess:()=>{markCompleted("street-purity-test");updateStats({xp:10,rep:5,cash:50});renderHUD();showOutcome("Correct! Maya’s impressed.","success");},
    onFailure:()=>{updateStats({heat:10,rep:-2});renderHUD();showOutcome("Wrong bag—alarm’s raised! Heat +10.","failure");}
  },
  "delivery-route-test":{
    id:"delivery-route-test",
    title:"Route the Stash Safely",
    description:`
      You’ve got three routes to move product across town.
      Route A skirts the docks (slow, low heat).
      Route B cuts through the badlands (fast, medium heat).
      Route C goes via the interstate (fastest, high heat).
      Choose wisely before time runs out.
    `,
    timerSeconds:15,
    options:[
      {key:"A",label:"Route A",outcome:"mixed"},
      {key:"B",label:"Route B",outcome:"success"},
      {key:"C",label:"Route C",outcome:"failure"}
    ],
    onSuccess:()=>{markCompleted("delivery-route-test");updateStats({xp:20,rep:10,cash:100});renderHUD();showOutcome("You slipped past patrols—smooth delivery!","success");},
    onMixed:()=>{updateStats({xp:10,rep:5,heat:5,cash:50});renderHUD();showOutcome("Route A was slow but safe-ish—smaller haul.","mixed");},
    onFailure:()=>{updateStats({heat:15,rep:-5});renderHUD();showOutcome("Cops swarmed Route C—package seized!","failure");}
  }
};

// 5. Core engine
const MissionEngine={
  currentMission:null,
  timerId:null,
  start(id){
    if(hasCompleted(id)){showOutcome("You’ve already completed this mission.","info");return;}
    const m=Missions[id];if(!m)return console.error(`No mission: ${id}`);
    this.currentMission=m;renderSituation(m);if(m.timerSeconds)this.startTimer(m.timerSeconds);
  },
  choose(key){
    clearInterval(this.timerId);
    const choice=this.currentMission.options.find(o=>o.key===key);
    switch(choice.outcome){case"success":this.currentMission.onSuccess();break;case"mixed":this.currentMission.onMixed&&this.currentMission.onMixed();break;default:this.currentMission.onFailure();}
    this.currentMission=null;
  },
  startTimer(sec){
    let t=sec;const d=document.getElementById("mission-timer");d.textContent=`Time: ${t}s`;
    this.timerId=setInterval(()=>{t--;d.textContent=`Time: ${t}s`;if(t<=0){clearInterval(this.timerId);this.currentMission.onFailure();this.currentMission=null;}},1000);
  }
};

// 6. Rendering
function renderSituation(m){
  const c=document.getElementById("mission-container");c.setAttribute("data-mission",m.id);
  document.getElementById("mission-title").textContent=m.title;
  document.getElementById("mission-desc").innerHTML=m.description;
  const opts=document.getElementById("mission-options");opts.innerHTML="";
  m.options.forEach(o=>{const b=document.createElement("button");b.textContent=o.label;b.onclick=()=>MissionEngine.choose(o.key);opts.appendChild(b);});
  document.getElementById("mission-timer").textContent="";
  document.getElementById("mission-outcome").textContent="";
}

// 7. Outcome
function showOutcome(msg,status){const out=document.getElementById("mission-outcome");out.textContent=msg;out.className=status;}

// 8. Stats helper
function updateStats(delta){if(delta.xp)playerStats.xp+=delta.xp;if(delta.rep)playerStats.rep+=delta.rep;if(delta.cash)playerStats.cash+=delta.cash;if(delta.heat)playerStats.heat+=delta.heat;saveStats();renderHUD();}

// 9. Expose globally
window.MissionEngine=MissionEngine;

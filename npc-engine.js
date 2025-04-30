// npc-missions-engine-v2.js + auto-contact patch
window.initNPCMission = function () {
  const {
    npcId,
    title,
    osUrl,
    questions,
    npcKey = "npcData_" + npcId
  } = window.NPC_MISSION_CONFIG;

  const SK = "playerStats";
  const CK = "completedMissions";

  let stats = JSON.parse(localStorage.getItem(SK) || "{}");
  let completed = JSON.parse(localStorage.getItem(CK) || "[]");
  let npc = JSON.parse(localStorage.getItem(npcKey) || "{}");

  stats.xp = stats.xp || 0;
  stats.rep = stats.rep || 0;
  stats.rp = stats.rp || 0;
  stats.heat = stats.heat || 0;
  stats.cash = stats.cash || 0;
  npc.loyalty = npc.loyalty || 50;
  npc.trust = npc.trust || 0;
  npc.flags = npc.flags || {};

  const wrap    = document.getElementById("npc-mission");
  const titleBox= document.getElementById("mission-title");
  const content = document.getElementById("mission-content");
  const options = document.getElementById("mission-options");
  const result  = document.getElementById("mission-result");
  if (!wrap||!titleBox||!content||!options||!result) return;

  titleBox.innerHTML = `
    <span style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);">
      🧠
    </span> ${title}
  `;

  if (completed.includes(npcId)) {
    content.innerHTML = `<p>You’ve already completed this mission.</p>`;
    options.innerHTML = "";
    result.innerHTML = `
      <p><a href="${osUrl}" style="color:#0af;">→ Return to Burner OS</a></p>
    `;
    return;
  }

  let currentQ   = 0;
  let totalDelta = { xp:0, rep:0, rp:0, heat:0, cash:0 };
  let totalNPC   = { loyalty:0, trust:0 };
  let timerId    = null;

  function renderQuestion() {
    const q = questions[currentQ];
    content.innerHTML = `<p>${q.text}</p>`;
    options.innerHTML = "";

    // handle optional timer
    if (q.timer && q.onTimeout) {
      let timeLeft = q.timer;
      const timerEl = document.createElement("div");
      timerEl.style = "font-size:0.9rem;margin-bottom:6px;color:#aaa;text-align:right;";
      timerEl.textContent = `Time left: ${timeLeft}s`;
      content.appendChild(timerEl);

      timerId = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timerId);
          handleChoice(q.onTimeout);
        }
      }, 1000);
    }

    // render choices
    q.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.style = `
        background:#222;color:#fff;
        border:2px solid #555;border-radius:6px;
        padding:10px;width:100%;font-size:1rem;
        margin-top:8px;cursor:pointer;
      `;
      btn.innerHTML = `<span style="font-size:1.2rem;">${choice.icon}</span> ${choice.text}`;
      btn.onclick = () => handleChoice(choice);
      options.appendChild(btn);
    });
  }

  function handleChoice(choice) {
    if (timerId) clearInterval(timerId);

    // apply player deltas
    for (let k in choice.delta) {
      stats[k] = (stats[k]||0) + choice.delta[k];
      totalDelta[k] = (totalDelta[k]||0) + choice.delta[k];
    }
    // apply NPC deltas and flags
    for (let k in choice.npc) {
      if (k === "flags") {
        for (let f in choice.npc.flags) {
          npc.flags[f] = true;
        }
      } else {
        npc[k] = (npc[k]||0) + choice.npc[k];
        totalNPC[k] = (totalNPC[k]||0) + choice.npc[k];
      }
    }

    currentQ++;
    if (currentQ < questions.length) {
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    // save stats & mission completion
    localStorage.setItem(SK, JSON.stringify(stats));
    localStorage.setItem(npcKey, JSON.stringify(npc));
    completed.push(npcId);
    localStorage.setItem(CK, JSON.stringify(completed));

    // **AUTO-ADD to contacts**
    let unlocked = JSON.parse(localStorage.getItem("contacts_unlocked") || "[]");
    // contactId = part before first dash (e.g. "maya" from "maya-initiation")
    const contactId = npcId.split("-")[0];
    if (!unlocked.includes(contactId)) {
      unlocked.push(contactId);
      localStorage.setItem("contacts_unlocked", JSON.stringify(unlocked));
    }

    // render completion summary
    content.innerHTML = `<p><strong>Mission Complete!</strong></p>`;
    options.innerHTML = "";
    result.innerHTML = `
      <p><strong>Player Gains:</strong><br>
      XP: +${totalDelta.xp} | REP: +${totalDelta.rep} |
      RP: +${totalDelta.rp} | Heat: +${totalDelta.heat} |
      Cash: +$${totalDelta.cash}</p>
      <p><strong>${title.split(" ")[0]} Adjustments:</strong><br>
      Loyalty: ${totalNPC.loyalty} | Trust: ${totalNPC.trust}</p>
      <p><a href="${osUrl}" style="color:#0af;">→ Return to Burner OS</a></p>
    `;
  }

  renderQuestion();
};

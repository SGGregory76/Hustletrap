
// Blaze Initiation Mission (5 Questions with Timers and Rewards)

const blazeMission = {
  step: 0,
  score: {
    rep: 0,
    heat: 0,
    cash: 0,
    loyalty: 0,
    flags: []
  },
  questions: [
    {
      text: "You see a cop walking your way while you’re holding. What do you do?",
      options: [
        { label: "Run.", rep: 0, heat: 5 },
        { label: "Hide it fast.", rep: 2, heat: 1 },
        { label: "Offer him a cut.", rep: 0, heat: 10 }
      ],
      timed: true,
      timeLimit: 8
    },
    {
      text: "How much is a quarter-ounce of good green on the street?",
      options: [
        { label: "$35", rep: 0 },
        { label: "$60", rep: 3 },
        { label: "$90", rep: 0, heat: 1 }
      ]
    },
    {
      text: "You can only afford one. What do you pick?",
      options: [
        { label: "New phone", cash: -10 },
        { label: "Pack of weed", rep: 1 },
        { label: "Knife", rep: 1, heat: 1 }
      ]
    },
    {
      text: "Blaze asks: You cool with fire?",
      options: [
        { label: "I light it up.", rep: 3, loyalty: 1 },
        { label: "Fire’s risky.", rep: 1 },
        { label: "I don’t play with fire.", rep: 0 }
      ],
      timed: true,
      timeLimit: 6
    },
    {
      text: "Final question. Why are you here?",
      options: [
        { label: "To build an empire.", flag: "ambitious", rep: 2 },
        { label: "To survive the day.", flag: "realist", rep: 1 },
        { label: "To burn it all down.", flag: "reckless", rep: 0, heat: 2 }
      ]
    }
  ]
};

function startBlazeMission() {
  blazeMission.step = 0;
  nextBlazeQuestion();
}

function nextBlazeQuestion() {
  const q = blazeMission.questions[blazeMission.step];
  const container = document.getElementById("mission-question");
  const options = document.getElementById("mission-options");
  container.innerText = q.text;
  options.innerHTML = "";

  if (q.timed) {
    setTimeout(() => {
      if (blazeMission.step < blazeMission.questions.length) {
        blazeMission.step++;
        nextBlazeQuestion();
      }
    }, q.timeLimit * 1000);
  }

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.label;
    btn.onclick = () => {
      if (opt.rep) blazeMission.score.rep += opt.rep;
      if (opt.heat) blazeMission.score.heat += opt.heat;
      if (opt.cash) blazeMission.score.cash += opt.cash;
      if (opt.loyalty) blazeMission.score.loyalty += opt.loyalty;
      if (opt.flag) blazeMission.score.flags.push(opt.flag);

      blazeMission.step++;
      if (blazeMission.step < blazeMission.questions.length) {
        nextBlazeQuestion();
      } else {
        completeBlazeMission();
      }
    };
    options.appendChild(btn);
  });
}

function completeBlazeMission() {
  const data = JSON.parse(localStorage.getItem("gameData") || "{}");

  data.rep = (data.rep || 0) + blazeMission.score.rep;
  data.heat = (data.heat || 0) + blazeMission.score.heat;
  data.cash = (data.cash || 0) + blazeMission.score.cash;
  data.loyalty = data.loyalty || {};
  data.loyalty.blaze = (data.loyalty.blaze || 0) + blazeMission.score.loyalty;

  data.flags = data.flags || {};
  blazeMission.score.flags.forEach(f => data.flags[f] = true);

  localStorage.setItem("gameData", JSON.stringify(data));

  document.getElementById("mission-question").innerText = "Blaze nods slowly. 'Alright... you're in.'";
  document.getElementById("mission-options").innerHTML = "";

  setTimeout(() => {
    window.location.href = "/p/burner-os.html";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", startBlazeMission);

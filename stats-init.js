
// Ensure default stats are defined
if (!localStorage.getItem("stats")) {
  localStorage.setItem("stats", JSON.stringify({ xp: 0, rep: 0, cash: 0, heat: 0 }));
}

// Ensure each stat key is defined
let stats = JSON.parse(localStorage.getItem("stats"));
if (stats["xp"] === undefined) stats["xp"] = 0;
if (stats["rep"] === undefined) stats["rep"] = 0;
if (stats["cash"] === undefined) stats["cash"] = 0;
if (stats["heat"] === undefined) stats["heat"] = 0;
localStorage.setItem("stats", JSON.stringify(stats));

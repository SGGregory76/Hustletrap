
document.addEventListener("DOMContentLoaded", function () {
  const flags = JSON.parse(localStorage.getItem("game_flags") || "{}");

  const missionStates = {
    blaze: true,
    maya: !!flags["blaze_done"],
    rico: !!flags["maya_loyal"],
    skye: flags["rep"] >= 30,
    diesel: flags["xp"] >= 100,
    jax: flags["heat"] >= 40
  };

  const completedFlags = {
    blaze: !!flags["blaze_done"],
    maya: !!flags["maya_done"],
    rico: !!flags["rico_done"],
    skye: !!flags["skye_done"],
    diesel: !!flags["diesel_done"],
    jax: !!flags["jax_done"]
  };

  Object.keys(missionStates).forEach(npc => {
    const statusEl = document.getElementById(`status-${npc}`);
    const button = statusEl?.nextElementSibling;

    if (completedFlags[npc]) {
      statusEl.textContent = "Completed";
      if (button) button.disabled = true;
    } else if (missionStates[npc]) {
      statusEl.textContent = "Unlocked";
      if (button) button.disabled = false;
    } else {
      statusEl.textContent = "Locked";
      if (button) button.disabled = true;
    }
  });
});

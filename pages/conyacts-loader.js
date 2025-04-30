// contacts-loader.js
(function () {
  const contacts = {
    maya: {
      icon: "🎒",
      name: "Maya",
      title: "First Contact",
      link: "https://hustletrap.blogspot.com/2025/04/maya.html?m=1"
    },
    rico: {
      icon: "💼",
      name: "Rico",
      title: "Street Ties",
      link: "https://hustletrap.blogspot.com/2025/04/rico.html?m=1"
    },
    blaze: {
      icon: "🔥",
      name: "Blaze",
      title: "Prologue Broker",
      link: "https://hustletrap.blogspot.com/2025/04/blaze.html?m=1"
    },
    skye: {
      icon: "🧬",
      name: "Skye",
      title: "Lab Entry",
      link: "#"
    },
    diesel: {
      icon: "🛠️",
      name: "Diesel",
      title: "Logistics Crew",
      link: "#"
    }
  };

  const unlocked = JSON.parse(localStorage.getItem("contacts_unlocked") || "[]");
  const container = document.getElementById("contacts-list");

  unlocked.forEach(id => {
    const c = contacts[id];
    if (!c) return;

    const card = document.createElement("div");
    card.style = "display:flex;align-items:center;padding:12px;background:#1b1b1b;border:1px solid #444;border-radius:10px;margin-bottom:12px;";

    card.innerHTML = `
      <div style='font-size:2rem;margin-right:12px;'>${c.icon}</div>
      <div>
        <strong>${c.name}</strong><br>
        <span style='font-size:0.85rem;color:#aaa;'>${c.title}</span><br>
        <a href='${c.link}' style='color:#0af;font-size:0.9rem;'>→ View Contact</a>
      </div>
    `;

    container.appendChild(card);
  });
})();

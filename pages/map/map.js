
<!DOCTYPE html>
<html>
<head>
  <title>City Map</title>
  <style>
    body { background: #101010; color: white; font-family: sans-serif; padding: 20px; }
    .area {
      background: #1c1c1c;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 12px;
    }
    .area-name {
      font-weight: bold;
      font-size: 16px;
    }
    .area-desc {
      font-size: 13px;
      color: #aaa;
    }
    .area a {
      color: #66f;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <h2 style="text-align:center;">City Map</h2>
  <div id="mapContainer"></div>

  <script>
    const areas = [
      { name: "Street Corner", icon: "🧍‍♂️", link: "#", desc: "A hotspot for quick hustles and local deals." },
      { name: "Warehouse", icon: "🏭", link: "#", desc: "Bulk storage for your product stash." },
      { name: "Club", icon: "🎶", link: "#", desc: "Where party supplies move fast." },
      { name: "Safehouse", icon: "🏚️", link: "#", desc: "Lay low, recover heat, or plan next moves." },
      { name: "Market", icon: "🛒", link: "#", desc: "Buy gear, ingredients, and supplies." },
      { name: "Chem Lab", icon: "⚗️", link: "#", desc: "Unlocked at higher level. Craft advanced drugs." }
    ];

    function renderMap() {
      const container = document.getElementById("mapContainer");
      container.innerHTML = areas.map(a => `
        <div class="area">
          <div class="area-name">${a.icon} ${a.name}</div>
          <div class="area-desc">${a.desc}</div>
          <a href="${a.link}">Visit</a>
        </div>
      `).join("");
    }

    document.addEventListener("DOMContentLoaded", renderMap);
  </script>
</body>
</html>

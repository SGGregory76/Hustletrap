(function() {
  if (window !== window.top) return; // Skip if inside iframe

  const pages = [
    { name: "Missions", href: "https://hustletrap.blogspot.com/p/missions.html?m=1" },
    { name: "Contacts", href: "https://hustletrap.blogspot.com/p/contacts.html?m=1" },
    { name: "Inventory", href: "https://hustletrap.blogspot.com/p/inventory.html?m=1" },
    { name: "Log", href: "https://hustletrap.blogspot.com/p/log.html?m=1" }
  ];

  const current = window.location.href.split("#")[0];

  const footer = document.createElement("div");
  footer.id = "redundancy-footer";
  footer.style = "margin-top:20px; padding:10px; text-align:center; font-size:14px; color:#aaa; border-top:1px solid #333;";

  const links = pages
    .filter(p => p.href !== current)
    .map(p => `<a href="${p.href}" style="color:#8cf;">${p.name}</a>`)
    .join(" | ");

  footer.innerHTML = `
    <div style="margin-bottom:6px;">
      <button onclick="window.top.location.href='https://hustletrap.blogspot.com/p/burner-os.html?m=1'" 
        style="background:#222; color:#ccc; padding:6px 12px; border:1px solid #444; border-radius:6px; cursor:pointer;">
        Return to Burner OS
      </button>
    </div>
    ${links ? `<div>Quick Access: ${links}</div>` : ""}
  `;

  document.body.appendChild(footer);
})();

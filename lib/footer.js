(function() {
  if (window !== window.top) return; // Skip if inside Burner OS iframe

  const footer = document.createElement("div");
  footer.id = "redundancy-footer";
  footer.style = "margin-top:20px; padding:10px; text-align:center; font-size:14px; color:#aaa; border-top:1px solid #333;";

  footer.innerHTML = `
    <div style="margin-bottom:6px;">
      <button onclick="window.top.location.href='https://hustletrap.blogspot.com/p/burner-os.html?m=1'" 
        style="background:#222; color:#ccc; padding:6px 12px; border:1px solid #444; border-radius:6px; cursor:pointer;">
        Return to Burner OS
      </button>
    </div>
    <div>
      Quick Access:
      <a href="/p/missions.html?m=1" style="color:#8cf;">Missions</a> |
      <a href="/p/contacts.html?m=1" style="color:#8cf;">Contacts</a> |
      <a href="/p/inventory.html?m=1" style="color:#8cf;">Inventory</a> |
      <a href="/p/log.html?m=1" style="color:#8cf;">Log</a>
    </div>
  `;

  document.body.appendChild(footer);
})();

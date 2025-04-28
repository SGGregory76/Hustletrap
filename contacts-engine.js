(function(){
  let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  if (contacts.length === 0) {
    contacts = ["Blaze"];
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  document.getElementById('hud-contacts').innerHTML = `
    <div class="hud-title">Contacts</div>
    ${contacts.map(c=>`📞 ${c}`).join('<br>')}
  `;
})();

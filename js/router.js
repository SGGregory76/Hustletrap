const routes = {
  '':  () => HomeView.render(),
  '#/prologue': () => MissionView.start('prologue'),
  '#/missions': () => MissionView.list(),
  '#/contacts': () => ContactsView.list(),
  '#/profile/:id': params => ProfileView.render(params.id),
  '#/craft': () => CraftView.render(),
  '#/map': () => MapView.render(),
  '#/log': () => LogView.render(),
  '#/settings': () => SettingsView.render(),
};

window.addEventListener('hashchange', () => {
  const hash = location.hash.split('?')[0];
  for (let pattern in routes) {
    const re = new RegExp('^' + pattern.replace(/:\w+/g, '(\\w+)') + '$');
    const match = hash.match(re);
    if (match) {
      const args = match.slice(1);
      routes[pattern](…args);
      return;
    }
  }
  routes['']();
});

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('prologueDone')) location.hash = '#/prologue';
  else if (!location.hash) location.hash = '#/';
});

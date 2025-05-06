// flag-manager.js
const FlagManager = {
  _key: 'missionFlags',

  load() {
    return JSON.parse(localStorage.getItem(this._key) || '{}');
  },

  save(flags) {
    localStorage.setItem(this._key, JSON.stringify(flags));
  },

  get(flag) {
    const flags = this.load();
    return !!flags[flag];
  },

  set(flag, value = true) {
    const flags = this.load();
    flags[flag] = value;
    this.save(flags);
  },

  remove(flag) {
    const flags = this.load();
    delete flags[flag];
    this.save(flags);
  },

  clear() {
    localStorage.removeItem(this._key);
  },

  list() {
    return this.load();
  }
};

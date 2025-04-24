// research.js - Core Research System Logic

const research = (() => {

  const defaultProjects = [
    { id: 'potent_weed', name: 'Potent Weed', cost: 10, effect: '+20% potency', unlocked: false },
    { id: 'synthetic_coke', name: 'Synthetic Coke', cost: 20, effect: 'New drug unlocked', unlocked: false },
    { id: 'fast_crafting', name: 'Fast Crafting', cost: 30, effect: '+25% crafting speed', unlocked: false }
  ];

  function getRP() {
    return parseInt(localStorage.getItem('researchPoints') || '0');
  }

  function addRP(points) {
    const currentRP = getRP();
    localStorage.setItem('researchPoints', currentRP + points);
  }

  function loadProjects() {
    return JSON.parse(localStorage.getItem('researchProgress') || JSON.stringify(defaultProjects));
  }

  function saveProjects(projects) {
    localStorage.setItem('researchProgress', JSON.stringify(projects));
  }

  function unlockProject(projectId) {
    const projects = loadProjects();
    const project = projects.find(p => p.id === projectId);
    if (project && !project.unlocked && getRP() >= project.cost) {
      addRP(-project.cost);
      project.unlocked = true;
      saveProjects(projects);
      return { success: true, effect: project.effect };
    }
    return { success: false, reason: 'Insufficient RP or already unlocked' };
  }

  return {
    getRP,
    addRP,
    loadProjects,
    unlockProject
  };
})();

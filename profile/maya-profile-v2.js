window.NPC_MISSION_CONFIG = {
  npcId: "maya-initiation-v2",
  title: "Maya's First Real Test",
  osUrl: "https://hustletrap.blogspot.com/p/burner-os.html?m=1",
  questions: [
    {
      text: "Maya eyes your backpack. 'You holding?'",
      choices: [
        { icon: "🎒", text: "Only samples.", delta: { rep: 2 }, npc: { loyalty: 1 } },
        { icon: "🧪", text: "Cooked batch this morning.", delta: { xp: 2, rp: 2 }, npc: { trust: 1 } },
        { icon: "🤐", text: "Stay quiet.", delta: { heat: 1 }, npc: { loyalty: -1 } }
      ]
    },
    {
      text: "She checks the corner. 'You got tails?'",
      timer: 8,
      onTimeout: { icon: "😶", text: "Hesitate.", delta: { heat: 2 }, npc: { trust: -2, flags: { hesitated: true } } },
      choices: [
        { icon: "👀", text: "Always check mirrors.", delta: { xp: 2 }, npc: { trust: 1 } },
        { icon: "🚷", text: "I'm clean.", delta: { rep: 2 }, npc: { loyalty: 1 } }
      ]
    },
    {
      text: "'What do you do when heat comes down hard?'",
      choices: [
        { icon: "🧊", text: "Cool off. Go ghost.", delta: { rp: 2 }, npc: { loyalty: 1 } },
        { icon: "💼", text: "Lawyer on speed dial.", delta: { cash: -10 }, npc: { trust: 1 } },
        { icon: "🔥", text: "Double down.", delta: { heat: 2, xp: 2 }, npc: { loyalty: -2 } }
      ]
    },
    {
      text: "She holds a key. 'Warehouse or street corner?'",
      timer: 6,
      onTimeout: { icon: "⏳", text: "Don't choose.", delta: { xp: -1 }, npc: { trust: -1 } },
      choices: [
        { icon: "🏢", text: "Warehouse. Quiet moves.", delta: { rp: 3 }, npc: { loyalty: 2, flags: { picked_warehouse: true } } },
        { icon: "🛣️", text: "Corner. Fast flip.", delta: { rep: 2, cash: 10 }, npc: { trust: 2, flags: { picked_street: true } } }
      ]
    },
    {
      text: "She nods slowly. 'You loyal?'",
      choices: [
        { icon: "🤝", text: "Ride or die.", delta: { rep: 3 }, npc: { loyalty: 3, flags: { maya_loyal: true } } },
        { icon: "🧠", text: "I’m smart. I survive.", delta: { xp: 2 }, npc: { trust: 1 } },
        { icon: "💵", text: "I follow the money.", delta: { cash: 15 }, npc: { loyalty: -2 } }
      ]
    }
  ]
};


# HustleTrap Game Repository Structure

## Root Directory: `Hustletrap/`

```
├── index.html                      # Entry: Burner OS Interface (burner-os-synced.html)
│
├── lib/                           # JavaScript Systems
│   ├── npc-v2.0.js                # Full NPC inventory, mood, trade logic
│   ├── logic-v1.0.js              # NPC personality behavior extension
│   ├── stats.js (optional)        # Stat calculation utility (if separated later)
│   └── npc.js                     # Can mirror npc-v2.0.js for compatibility
│
├── pages/                         # Main Interface Pages
│   ├── missions.html              # NPC missions interface (missions-fixed.html)
│   ├── contacts.html              # Grid of NPCs (contacts-fixed.html)
│   ├── inventory.html             # Player item list (inventory-fixed.html)
│   ├── map.html                   # City area locations (map-fixed.html)
│   ├── log.html                   # Activity timeline (log-fixed.html)
│   └── settings.html              # Base64 save/load/reset (settings-fixed.html)
│
├── profiles/                      # Individual NPC Pages
│   ├── profile-maya.html         # Full logic-patched Maya profile
│   ├── profile-rico.html
│   ├── profile-blaze.html
│   └── profile-skye.html
│
└── README.md                      # Game info, version notes, developer credits
```

## Notes:
- Use `/p/*.html` links in Blogger, not post URLs.
- Keep scripts versioned and consistent.
- Replace `npc.js` with the latest tested copy for compatibility.
- Archive your base64 saves using Settings > Save Game.

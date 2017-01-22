// src/freezer/reactions.js

import schema from 'freezer/schema.js';

export default function reactions(freezer) {
  freezer.on('tab:create', (name, src) => {
    console.log('create triggered');
    const tabs = freezer.get().workspace.tabs.transact();
    tabs.forEach((tab) => {
      if (tab.active) { tab.set({ active: false }); }
    });
    tabs.push(schema.Tab(name, src, true));
    freezer.get().workspace.tabs.run();
  });

  freezer.on('tab:delete', (src) => {
    console.log('delete triggered');
    const tabs = freezer.get().workspace.tabs;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].src === src) { tabs.splice(i, 1); }
    }
  });
}

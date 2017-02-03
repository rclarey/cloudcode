// src/freezer/reactions.js

import schema from 'freezer/schema.js';

export default function reactions(freezer) {
  freezer.on('tab:create', (name, src) => {
    const tabs = freezer.get().workspace.tabs.transact();
    tabs.forEach((tab) => {
      if (tab.active) { tab.set({ active: false }); }
    });
    tabs.push(schema.Tab('untitled', 'yo', true));
    freezer.get().workspace.tabs.run();
  });

  freezer.on('tab:delete', (src) => {
    const tabs = freezer.get().workspace.tabs;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].src === src) { tabs.splice(i, 1); }
    }
  });

  freezer.on('folder:open', (src) => {
    const path = src.split('/');
    let obj = { holds: freezer.get().workspace.tree[path.shift()] };
    path.forEach((name) => {
      obj.holds.forEach((node) => {
        if (node.name === name) {
          obj = node;
        }
      });
    });
    obj.set({ open: !obj.open });
  });
}

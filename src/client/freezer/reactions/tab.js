import schema from 'freezer/schema';

export default function reactions(freezer) {
  freezer.on('tab:create', (name, src) => {
    const tabs = freezer.get().workspace.tabs.transact();

    tabs.forEach(tab => tab.active && tab.set({ active: false }));

    tabs.push(schema.Tab('untitled', src || 'yo', true));
    freezer.get().workspace.tabs.run();
  });

  freezer.on('tab:delete', (index) => {
    // TODO: warning if doc unsaved
    freezer.get().workspace.tabs.splice(index, 1);
  });
}

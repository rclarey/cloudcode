export default function reactions(freezer) {
  freezer.on('tree:resize', (x) => {
    const ws = freezer.get().workspace;
    ws.set({ treeWidth: ws.treeWidth + x }).now();
  });

  freezer.on('tree:resize:clamp', () => {
    const ws = freezer.get().workspace;

    if (ws.treeWidth < 150) {
      ws.set({ treeWidth: 150 }).now();
    } else if (ws.treeWidth > window.innerWidth) {
      ws.set({ treeWidth: window.innerWidth - 10 }).now();
    }
  });
}

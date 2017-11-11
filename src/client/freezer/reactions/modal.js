export default function reactions(freezer) {
  freezer.on('modal:close', () => {
    freezer.get().workspace.set({ modal: null });
  });
}

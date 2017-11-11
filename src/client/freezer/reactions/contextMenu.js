import schema from 'freezer/schema';

export default function reactions(freezer) {
  freezer.on('contextmenu:close', () => {
    freezer.get().workspace.set({ contextMenu: null });
  });

  freezer.on('contextmenu:open', (data) => {
    const { type, src, x, y } = data;
    let folderSrc;
    if (type === 'file') {
      folderSrc = src.slice(0, src.lastIndexOf('/') + 1);
    } else {
      folderSrc = `${src}/`;
    }

    let items = [
      schema.MenuItem(
        'New File',
        () => freezer.trigger('treenode:create', folderSrc, true),
      ),
      schema.MenuItem(
        'New Folder',
        () => freezer.trigger('treenode:create', folderSrc, false),
      ),
    ];

    if (type === 'file' || type === 'folder') {
      items = items.concat([
        schema.MenuItem(
          'Rename',
          () => freezer.trigger('treenode:rename', src),
        ),
        schema.MenuItem(
          'Duplicate',
          () => freezer.trigger('treenode:dupe', src),
        ),
        schema.MenuItem(
          'Delete',
          () => freezer.trigger('treenode:delete', src),
        ),
      ]);
    }

    const menuHeight = (items.length * 25) + 10;
    const clampX = x + 150 > window.innerWidth ? x - 150 : x;
    const clampY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    freezer.get().workspace.set({
      contextMenu: schema.ContextMenu(items, clampX, clampY),
    });
  });
}

export default {
  Workspace(space) {
    return {
      tabs: space.tabs || [],
      tree: {
        own: space.own,
        shared: space.shared,
      },
      treeWidth: space.treeWidth,
      contextMenu: space.contextMenu,
      bar: {
        mode: space.mode,
      },
    };
  },

  Tree(src, holds) {
    if (!src) { throw Error('Tree schema failed'); }
    return {
      src,
      name: src,
      holds: holds || [],
    };
  },

  Tab(src, active) {
    if (!src) { throw Error('Tab schema failed'); }
    return {
      src,
      active: active || false,
      name: src.slice(src.lastIndexOf('/') + 1),
    };
  },

  File(src, holds) {
    if (!src) { throw Error('File schema failed'); }
    return {
      src,
      holds: holds || '',
      name: src.slice(src.lastIndexOf('/') + 1),
      file: true,
      share: false,
    };
  },

  Folder(src, holds) {
    if (!src) { throw Error('Folder schema failed'); }
    return {
      src,
      holds: holds || [],
      name: src.slice(src.lastIndexOf('/') + 1),
      file: false,
      open: false,
    };
  },

  ContextMenu(holds, x, y) {
    if (!holds || !x || !y) { throw Error('ContextMenu schema failed'); }
    return { holds, x, y };
  },

  MenuItem(name, func) {
    if (!name || !func) { throw Error('MenuItem schema failed'); }
    return { name, func };
  },

  Modal(prompt, src, func, doSelect) {
    if (!prompt || !src || !func) { throw Error('Modal schema failed'); }
    return { prompt, src, func, doSelect };
  },

  Settings() {},

  User(name) {
    return {
      name,
    };
  },
};

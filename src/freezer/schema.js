// src/freezer/schema.js

export default {
  Workspace(space) {
    return {
      tabs: space.tabs || [],
      tree: {
        own: space.own || [],
        shared: space.shared || [],
      },
      treeWidth: space.treeWidth,
      bar: {
        mode: space.mode,
      },
    };
  },
  Tab(src, active) {
    if (!src) { throw Error(); }
    return {
      src,
      active: active || false,
      name: src.slice(src.lastIndexOf('/') + 1),
    };
  },
  File(src, holds) {
    if (!src) { throw Error(); }
    return {
      src,
      holds: holds || '',
      name: src.slice(src.lastIndexOf('/') + 1),
      file: true,
      share: false,
    };
  },
  Folder(src, holds) {
    if (!src) { throw Error(); }
    return {
      src,
      holds: holds || [],
      name: src.slice(src.lastIndexOf('/') + 1),
      file: false,
      open: false,
    };
  },
  Settings() {},
  User(name) {
    return {
      name,
    };
  },
};

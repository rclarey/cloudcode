// src/freezer/schema.js

export default {
  Workspace(space = { tabs: [], own: [], shared: [] }) {
    return {
      tabs: space.tabs,
      tree: {
        own: space.own,
        shared: space.shared,
      },
      bar: {
        mode: space.mode,
      },
    };
  },
  Tab(name = undefined, src = undefined, active = false) {
    return {
      name,
      src,
      active,
    };
  },
  File(name, holds = '') {
    if (!name) { throw Error(); }
    return {
      name,
      holds,
      file: true,
      share: false,
    };
  },
  Folder(name, holds = []) {
    if (!name) { throw Error(); }
    return {
      name,
      holds,
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

// src/freezer/reactions.js

import schema from 'freezer/schema.js';
import { createModal, createNode, fetchNode, dupeNode, moveNode, deleteNode } from 'helpers.jsx';

export default function reactions(freezer) {

  // Context Menu
  freezer.on('contextmenu:close', () => {
    freezer.get().workspace.set({ contextMenu: null });
  });

  freezer.on('contextmenu:open', (data) => {
    const { type, src, x, y } = data;
    const folderSrc = type === 'file' ? src.slice(0, src.lastIndexOf('/') + 1) : `${src}/`;
    let items = [
      schema.MenuItem('New File', () => freezer.trigger('treenode:create', folderSrc, true)),
      schema.MenuItem('New Folder', () => freezer.trigger('treenode:create', folderSrc, false)),
    ];
    if (type === 'file' || type === 'folder') {
      items = items.concat([
        schema.MenuItem('Rename', () => freezer.trigger('treenode:rename', src)),
        schema.MenuItem('Duplicate', () => freezer.trigger('treenode:dupe', src)),
        schema.MenuItem('Delete', () => freezer.trigger('treenode:delete', src)),
      ]);
    }
    const menuHeight = (items.length * 25) + 10;
    const clampX = x + 150 > window.innerWidth ? x - 150 : x;
    const clampY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    freezer.get().workspace.set({ contextMenu: schema.ContextMenu(items, clampX, clampY) });
  });

  // TreeNode
  freezer.on('treenode:create', (src, isFile) => {
    createModal(
      'Enter the path to your new file.',
      src.slice(0, src.lastIndexOf('/') + 1),
      val => createNode(val, isFile),
    );
  });

  freezer.on('treenode:dupe', (src) => {
    createModal('Enter the path to your new file.', src, val => dupeNode(src, val), true);
  });

  freezer.on('treenode:rename', (src) => {
    createModal('Enter the new name.', src, val => moveNode(src, val), true);
  });

  freezer.on('treenode:delete', src => deleteNode(src));

  // Folder
  freezer.on('folder:toggle', (src) => {
    const obj = fetchNode(src);
    obj.set({ open: !obj.open });
  });

  // Modal
  freezer.on('modal:close', () => {
    freezer.get().workspace.set({ modal: null });
  });

  // Tab
  freezer.on('tab:create', (name, src) => {
    const tabs = freezer.get().workspace.tabs.transact();
    tabs.forEach((tab) => {
      if (tab.active) { tab.set({ active: false }); }
    });
    tabs.push(schema.Tab('untitled', src || 'yo', true));
    freezer.get().workspace.tabs.run();
  });

  freezer.on('tab:delete', (src) => {
    const tabs = freezer.get().workspace.tabs;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].src === src) { tabs.splice(i, 1); }
    }
  });

  // Tree
  freezer.on('tree:resize', (x) => {
    const ws = freezer.get().workspace;
    ws.set({ treeWidth: ws.treeWidth + x }).now();
  });

  freezer.on('tree:resize:clamp', () => {
    const ws = freezer.get().workspace;
    if (ws.treeWidth < 150) { ws.set({ treeWidth: 150 }).now(); }
    if (ws.treeWidth > window.innerWidth) { ws.set({ treeWidth: window.innerWidth - 10 }).now(); }
  });
}

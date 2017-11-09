import React from 'react';
import File from 'components/workspace/File.jsx';
import Folder from 'components/workspace/Folder.jsx';
import freezer from 'freezer/app/freezer.js';
import schema from 'freezer/app/schema.js';

export function fetchNode(src) {
  const path = src.split('/');
  let obj = freezer.get().workspace.tree[path.shift()];
  for (let i = 0; i < path.length; i++) {
    if (obj.file) { return { failed: 'notfolder', src: obj.src }; }
    const holds = obj.holds;
    const j = holds.findIndex(item => item.name === path[i]);
    if (j === -1) { return { failed: 'intermediate', exists: obj, todo: path.slice(i) }; }
    obj = holds[j];
  }
  return obj;
}

// non exports
function copyNode(node) {
  const holds = node.file ? node.holds : node.holds.map(x => copyNode(x));
  return node.file ? schema.File(node.src, holds) : schema.Folder(node.src, holds);
}

function renameNode(node, dest) {
  let prefix = '';
  let i = 0;
  const src = node.src;
  while (src[i] === dest[i]) {
    prefix += src[i];
    i++;
  }
  const b = src.slice(prefix.length);
  const a = dest.slice(prefix.length);
  const todo = [node];
  const fixSrc = x => `${x.slice(0, prefix.length)}${a}${x.slice(prefix.length + b.length)}`;
  while (todo.length > 0) {
    const cur = todo.shift();
    const fixed = fixSrc(cur.src);
    cur.set({ src: fixed, name: fixed.slice(fixed.lastIndexOf('/') + 1) });
    if (!cur.file) { todo.push(...cur.holds); }
  }
}

function placeInFolder(holds, node) {
  let ind = holds.findIndex(item => item.file === node.file && item.name > node.name);
  if (ind === -1) {
    ind = node.file ? holds.length : holds.findIndex(item => item.file);
  }
  if (holds[ind - 1] && holds[ind - 1].name === node.name) { return false; }
  holds.splice(ind, 0, node);
  return true;
}

function placeInTree(parentPath, node) {
  const fetch = fetchNode(parentPath);
  let innerNode;
  switch (fetch.failed) {
    case 'intermediate':
      innerNode = node;
      for (let i = fetch.todo.length; i > 0; i--) {
        const temp = schema.Folder(`${fetch.exists.src}/${fetch.todo.slice(0, i).join('/')}`);
        temp.holds.push(innerNode);
        innerNode = temp;
      }
      placeInFolder(fetch.exists.holds, innerNode);
      break;
    case 'notfolder':
      break;
    default:
      placeInFolder(fetch.holds, node);
  }
}


// exports
export function normalizePath(path) {
  return path.replace(/[^\w/\-\s.]+/g, '').replace(/(?:\s*?\/+\s*)+/g, '/').replace(/\/\s*$/g, '');
}

export function renderNode(node, hub) {
  if (node.file) {
    return <File {...node} hub={hub} />;
  }
  return <Folder {...node} hub={hub} />;
}

export function createModal(prompt, src, func, doSelect) {
  freezer.get().workspace.set({ modal: schema.Modal(prompt, src, func, doSelect) });
}

export function createNode(src, file) {
  const node = file ? schema.File(src) : schema.Folder(src);
  placeInTree(src.slice(0, src.lastIndexOf('/')), node);
}

export function dupeNode(src, dest) {
  const og = fetchNode(src);
  const copy = copyNode(og);
  renameNode(copy, dest);
  placeInTree(dest.slice(0, dest.lastIndexOf('/')), copy);
}

export function moveNode(src, dest) {
  const node = fetchNode(src);
  renameNode(node, dest);
}

export function deleteNode(src) {
  const parent = fetchNode(src.slice(0, src.lastIndexOf('/')));
  const name = src.slice(src.lastIndexOf('/') + 1);
  const confirmed = confirm(`Are you sure you want to delete ${name}?`); // eslint-disable-line
  if (confirmed) {
    const ind = parent.holds.findIndex(x => x.name === name);
    parent.holds.splice(ind, 1);
  }
}

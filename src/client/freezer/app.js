import Freezer from 'freezer-js';
import schema from 'freezer/schema';
import contextMenu from 'freezer/reactions/contextMenu';
import modal from 'freezer/reactions/modal';
import tab from 'freezer/reactions/tab';
import tree from 'freezer/reactions/tree';
import treeNode from 'freezer/reactions/treeNode';

const freezer = new Freezer({
  user: schema.User('russ'),
  workspace: schema.Workspace({
    tabs: [schema.Tab('own/file.js', true)],
    own: schema.Tree('own'),
    shared: schema.Tree('shared'),
    contextMenu: null,
    modal: null,
    treeWidth: 250,
  }),
});

// setup reactions
contextMenu(freezer);
modal(freezer);
tab(freezer);
tree(freezer);
treeNode(freezer);

export default freezer;

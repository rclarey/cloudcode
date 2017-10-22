import Freezer from 'freezer-js';
import schema from 'freezer/app/schema.js';
import reactions from 'freezer/app/reactions.js';

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

reactions(freezer); // setup reactions

export default freezer;

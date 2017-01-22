// src/freezer/freezer.js

import Freezer from 'freezer-js';
import schema from 'freezer/schema.js';
import reactions from 'freezer/reactions.js';

const freezer = new Freezer({
  user: schema.User('russ'),
  workspace: schema.Workspace({
    tabs: [schema.Tab('file1.js', 'own/file1.js'), schema.Tab('file2.js', 'own/file2.js')],
  }),
});

reactions(freezer); // setup reactions

export default freezer;

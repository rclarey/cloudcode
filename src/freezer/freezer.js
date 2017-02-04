// src/freezer/freezer.js

import Freezer from 'freezer-js';
import schema from 'freezer/schema.js';
import reactions from 'freezer/reactions.js';

const freezer = new Freezer({
  user: schema.User('russ'),
  workspace: schema.Workspace({
    tabs: [schema.Tab('own/file1.js'), schema.Tab('own/file2.js')],
    own: [
      schema.File('owned/file1.js'),
      schema.Folder('owned/src', [
        schema.File('owned/src/server.js'),
        schema.Folder('owned/src/asdf', [
          schema.File('owned/src/asdf/file3.js'),
        ]),
      ]),
      schema.File('owned/file2.js'),
    ],
    treeWidth: 250,
  }),
});

reactions(freezer); // setup reactions

export default freezer;

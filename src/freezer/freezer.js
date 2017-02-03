// src/freezer/freezer.js

import Freezer from 'freezer-js';
import schema from 'freezer/schema.js';
import reactions from 'freezer/reactions.js';

const freezer = new Freezer({
  user: schema.User('russ'),
  workspace: schema.Workspace({
    tabs: [schema.Tab('own/file1.js'), schema.Tab('own/file2.js')],
    own: [
      schema.File('own/file1.js'),
      schema.Folder('own/src', [
        schema.File('own/src/server.js'),
        schema.Folder('own/src/asdf', [
          schema.File('own/src/asdf/file3.js'),
        ]),
      ]),
      schema.File('own/file2.js'),
    ],
  }),
});

reactions(freezer); // setup reactions

export default freezer;

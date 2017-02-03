// src/components/workspace/helpers.js

import React from 'react';
import File from 'components/workspace/File.jsx';
import Folder from 'components/workspace/Folder.jsx';

export default {
  renderNode(node, hub) {
    if (node.file) {
      return <File {...node} hub={hub} />;
    }
    return <Folder {...node} hub={hub} />;
  },
};

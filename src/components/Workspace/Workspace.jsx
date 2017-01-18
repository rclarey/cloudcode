// src/components/Workspace/Workspace.jsx

import React from 'react';

export default Workspace = React.createClass({

  render() {
    <div id="workspace">
      <div id="workspace-main">
        <TreeView id="workspace-treeview" />
        <div id="workspace-main-centre">
          <TabBar id="workspace-tabbar" />
          <Editor id="workspace-editor" />
        </div>
      </div>
      <BottomBar id="workspace-footer" />
    </div>
  }

});

Workspace.propTypes = {};

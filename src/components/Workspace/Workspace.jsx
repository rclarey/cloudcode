// src/components/workspace/Workspace.jsx

import React from 'react';
import BottomBar from 'components/workspace/BottomBar.jsx'
import Editor from 'components/workspace/Editor.jsx';
import TabBar from 'components/workspace/TabBar.jsx';
import TreeView from 'components/workspace/TreeView.jsx';

const Workspace = React.createClass({

  render() {
    return (
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
    );
  }

});

Workspace.propTypes = {};

export default Workspace;

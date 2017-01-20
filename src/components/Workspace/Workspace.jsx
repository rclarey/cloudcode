// src/components/workspace/Workspace.jsx

import React from 'react';
import BottomBar from 'components/workspace/BottomBar.jsx';
import Editor from 'components/workspace/Editor.jsx';
import Tab from 'components/workspace/Tab.jsx';
import TabBar from 'components/workspace/TabBar.jsx';
import TreeView from 'components/workspace/TreeView.jsx';

const Workspace = React.createClass({

  render() {
    return (
      <div id="workspace">
        <div id="workspace-main">
          <TreeView />
          <div id="workspace-main-centre">
            <TabBar>
              <Tab name="Tab1" />
              <Tab name="Tab2" />
            </TabBar>
            <Editor />
          </div>
        </div>
        <BottomBar />
      </div>
    );
  },

});

Workspace.propTypes = {};

export default Workspace;

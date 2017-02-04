// src/components/workspace/Workspace.jsx

import React from 'react';
import BottomBar from 'components/workspace/BottomBar.jsx';
import Editor from 'components/workspace/Editor.jsx';
import TabBar from 'components/workspace/TabBar.jsx';
import TreeView from 'components/workspace/TreeView.jsx';

const Workspace = React.createClass({
  propTypes: {
    store: React.PropTypes.shape({
      workspace: React.PropTypes.shape({
        tabs: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            active: React.PropTypes.bool.isRequired,
          }).isRequired,
        ).isRequired,
        tree: React.PropTypes.arrayOf(
          React.PropTypes.arrayOf(
            React.PropTypes.shape({
              file: React.PropTypes.bool.isRequired,
            }),
          ),
        ).isRequired,
        bar: React.PropTypes.shape({}).isRequired,
        treeWidth: React.PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },
  shouldComponentUpdate(nextProps) {
    return this.props.store.workspace !== nextProps.store.workspace;
  },
  render() {
    const treeProps = {
      tree: this.props.store.workspace.tree,
      hub: this.props.hub,
      width: this.props.store.workspace.treeWidth,
    };
    return (
      <div id="workspace">
        <div id="workspace-main">
          <TreeView {...treeProps} />
          <div id="workspace-main-centre">
            <TabBar tabs={this.props.store.workspace.tabs} hub={this.props.hub} />
            <Editor />
          </div>
        </div>
        <BottomBar />
      </div>
    );
  },
});

export default Workspace;

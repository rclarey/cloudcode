// src/components/workspace/Workspace.jsx

import React from 'react';
import BottomBar from 'components/workspace/BottomBar.jsx';
import ContextMenu from 'components/workspace/ContextMenu.jsx';
import Editor from 'components/workspace/Editor.jsx';
import Modal from 'components/workspace/Modal.jsx';
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
        contextMenu: React.PropTypes.shape({
          holds: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              name: React.PropTypes.string.isRequired,
              func: React.PropTypes.func.isRequired,
            }).isRequired,
          ),
          x: React.PropTypes.number.isRequired,
          y: React.PropTypes.number.isRequired,
        }),
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
    const ws = this.props.store.workspace;
    return (
      <div id="workspace">
        <div id="workspace-main">
          <TreeView tree={ws.tree} width={ws.treeWidth} hub={this.props.hub} />
          <div id="workspace-main-centre">
            <TabBar tabs={ws.tabs} hub={this.props.hub} />
            <Editor />
          </div>
        </div>
        <BottomBar />
        {ws.contextMenu ? <ContextMenu {...ws.contextMenu} hub={this.props.hub} /> : null}
        {ws.modal ? <Modal {...ws.modal} hub={this.props.hub} /> : null}
      </div>
    );
  },
});

export default Workspace;

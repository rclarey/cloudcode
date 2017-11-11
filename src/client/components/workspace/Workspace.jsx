import PropTypes from 'prop-types';
import React from 'react';

import BottomBar from 'components/shared/BottomBar';
import ContextMenu from 'components/workspace/ContextMenu';
import Editor from 'components/shared/Editor';
import Modal from 'components/workspace/Modal';
import TabBar from 'components/workspace/TabBar';
import TreeView from 'components/workspace/TreeView';

class Workspace extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.store.workspace !== nextProps.store.workspace;
  }

  render() {
    const ws = this.props.store.workspace;
    const menuProps = { ...ws.contextMenu, hub: this.props.hub };

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
        {ws.contextMenu ? <ContextMenu {...menuProps} /> : null}
        {ws.modal ? <Modal {...ws.modal} hub={this.props.hub} /> : null}
      </div>
    );
  }
}

Workspace.propTypes = {
  store: PropTypes.shape({
    workspace: PropTypes.shape({
      tabs: PropTypes.arrayOf(PropTypes.shape({
        active: PropTypes.bool.isRequired,
      }).isRequired).isRequired,
      tree: PropTypes.arrayOf(PropTypes.shape({
        file: PropTypes.bool.isRequired,
      })).isRequired,
      bar: PropTypes.shape({}).isRequired,
      treeWidth: PropTypes.number.isRequired,
      contextMenu: PropTypes.shape({
        holds: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string.isRequired,
          func: PropTypes.func.isRequired,
        }).isRequired),
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Workspace;

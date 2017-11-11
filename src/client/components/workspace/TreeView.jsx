import PropTypes from 'prop-types';
import React from 'react';

import Tree from 'components/workspace/Tree';
import ResizeHandle from 'components/workspace/ResizeHandle';

class TreeView extends React.Component {
  shouldComponentUpdate(nextProps) {
    const p = this.props;
    return p.tree !== nextProps.tree || p.width !== nextProps.width;
  }

  render() {
    return (
      <div id="workspace-treeview" style={{ width: `${this.props.width}px` }}>
        <Tree {...this.props.tree.own} hub={this.props.hub} />
        <Tree {...this.props.tree.shared} hub={this.props.hub} />
        <ResizeHandle hub={this.props.hub} />
      </div>
    );
  }
}

TreeView.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.bool.isRequired,
  })).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
};

export default TreeView;

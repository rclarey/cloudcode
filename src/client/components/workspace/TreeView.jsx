import React from 'react';
import Tree from 'components/workspace/Tree.jsx';
import ResizeHandle from 'components/workspace/ResizeHandle.jsx';

const TreeView = React.createClass({
  propTypes: {
    tree: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        file: React.PropTypes.bool.isRequired,
      }),
    ).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
    width: React.PropTypes.number.isRequired,
  },

  shouldComponentUpdate(nextProps) {
    const p = this.props;
    return p.tree !== nextProps.tree || p.width !== nextProps.width;
  },

  render() {
    return (
      <div id="workspace-treeview" style={{ width: `${this.props.width}px` }}>
        <Tree {...this.props.tree.own} hub={this.props.hub} />
        <Tree {...this.props.tree.shared} hub={this.props.hub} />
        <ResizeHandle hub={this.props.hub} />
      </div>
    );
  },

});

export default TreeView;

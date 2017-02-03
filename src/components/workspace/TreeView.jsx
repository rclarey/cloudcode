// src/components/workspace/TreeView.jsx

import React from 'react';
import Tree from 'components/workspace/Tree.jsx';

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
  },

  componentDidMount() {
    $('#workspace-treeview').resizable({
      handles: 'e',
      minWidth: 100,
    });
  },

  shouldComponentUpdate(nextProps) {
    return this.props.tree !== nextProps.tree;
  },

  render() {
    return (
      <div id="workspace-treeview">
        <Tree title="Owned" tree={this.props.tree.own} hub={this.props.hub} />
        <Tree title="Shared" tree={this.props.tree.shared} hub={this.props.hub} />
      </div>
    );
  },

});

export default TreeView;

// src/components/workspace/TreeView.jsx

import React from 'react';

const TreeView = React.createClass({
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
        <Tree title="Owned" />
        <Tree title="Shared" />
      </div>
    );
  },

});

TreeView.propTypes = {};

export default TreeView;

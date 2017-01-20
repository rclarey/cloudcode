// src/components/workspace/TreeView.jsx

import React from 'react';

const TreeView = React.createClass({
  componentDidMount() {
    $('#workspace-treeview').resizable({
      handles: 'e',
      minWidth: 100,
    });
  },

  render() {
    return (<div id="workspace-treeview">TreeView</div>);
  },

});

TreeView.propTypes = {};

export default TreeView;

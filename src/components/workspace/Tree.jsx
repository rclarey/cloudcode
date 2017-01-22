// src/components/workspace/Tree.jsx

import React from 'react';

const TopBar = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.tree !== nextProps.tree;
  },

  render() {
    return (
      <div id="app-topbar">{this.props.name}</div>
    );
  },

});

export default TopBar;

// src/components/shared/TopBar.jsx

import React from 'react';

const TopBar = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  },

  render() {
    return (
      <div id="app-topbar">{this.props.name}</div>
    );
  },

});

export default TopBar;

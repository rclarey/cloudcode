// src/components/workspace/TabBar.jsx

import React from 'react';

const TabBar = React.createClass({

  render() {
    return (
      <div id="workspace-tabbar">
        <ul id="workspace-tabbar-ul">
          {this.props.children}
        </ul>
      </div>
    );
  }

});

TabBar.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default TabBar;

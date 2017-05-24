// src/components/workspace/TabBar.jsx

import React from 'react';
import Tab from 'components/workspace/Tab.jsx';

const TabBar = React.createClass({
  propTypes: {
    tabs: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      src: React.PropTypes.string.isRequired,
      active: React.PropTypes.bool.isRequired,
    })).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.tabs !== nextProps.tabs;
  },

  handleDblClick() {
    this.props.hub.trigger('tab:create');
  },

  render() {
    return (
      <div id="workspace-tabbar" onDoubleClick={this.handleDblClick}>
        <ul id="workspace-tabbar-ul">
          {this.props.tabs.map(tab => <Tab {...tab} hub={this.props.hub} />)}
        </ul>
      </div>
    );
  },
});

export default TabBar;

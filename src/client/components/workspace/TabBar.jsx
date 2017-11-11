import PropTypes from 'prop-types';
import React from 'react';

import Tab from 'components/workspace/Tab';

class TabBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.tabs !== nextProps.tabs;
  }

  handleDblClick() {
    this.props.hub.trigger('tab:create');
  }

  render() {
    return (
      <div id="workspace-tabbar" onDoubleClick={this.handleDblClick}>
        <ul id="workspace-tabbar-ul">
          {this.props.tabs.map((tab, i) => (
            <Tab {...tab} index={i} hub={this.props.hub} />
          ))}
        </ul>
      </div>
    );
  }
}

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
  })).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default TabBar;

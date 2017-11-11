import PropTypes from 'prop-types';
import React from 'react';

class TopBar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  }

  render() {
    return (
      <div id="app-topbar">{this.props.name}</div>
    );
  }
}

TopBar.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TopBar;

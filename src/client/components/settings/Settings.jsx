import PropTypes from 'prop-types';
import React from 'react';

import LeftBar from 'components/settings/LeftBar';

class Settings extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div id="settings">
        <LeftBar />
        <div id="settings-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Settings;

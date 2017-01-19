// src/components/settings/Settings.jsx

import React from 'react';
import LeftBar from 'components/settings/LeftBar.jsx'

const Settings = React.createClass({

  render() {
    return (
      <div id="settings">
        <LeftBar id="settings-leftbar"/>
        <div id="settings-main">
          {this.props.children}
        </div>
      </div>
    );
  }

});

Settings.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Settings;

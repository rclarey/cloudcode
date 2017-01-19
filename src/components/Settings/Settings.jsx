// src/components/settings/Settings.jsx

import React from 'react';

export default Settings = React.createClass({

  render() {
    <div id="settings">
      <LeftBar id="settings-leftbar"/>
      <div id="settings-main">
        {this.props.children}
      </div>
    </div>
  }

});

Settings.propTypes = {
  children: React.PropTypes.element.isRequired,
};

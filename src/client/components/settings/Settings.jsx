import React from 'react';
import LeftBar from 'components/settings/LeftBar.jsx';

const Settings = React.createClass({

  render() {
    return (
      <div id="settings">
        <LeftBar />
        <div id="settings-main">
          {this.props.children}
        </div>
      </div>
    );
  },

});

Settings.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Settings;

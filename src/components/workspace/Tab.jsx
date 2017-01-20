// src/components/workspace/Tab.jsx

import React from 'react';

const Tab = React.createClass({

  render() {
    return (
      <li className="tab">
        <span className="tab-text">{this.props.name}</span>
        <span className="tab-close">x</span>
      </li>
    );
  }

});

Tab.propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default Tab;

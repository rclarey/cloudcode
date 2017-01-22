// src/components/workspace/Tab.jsx

import React from 'react';

const Tab = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    src: React.PropTypes.string.isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  handleDelete() {
    this.props.hub.trigger('tab:delete', this.props.src);
  },

  render() {
    return (
      <li className="tab">
        <span className="tab-text">
          {!this.props.name ? 'untitled' : this.props.name}
        </span>
        <button className="tab-close" onClick={this.handleDelete}>x</button>
      </li>
    );
  },

});

export default Tab;

// src/components/workspace/Tab.jsx

import React from 'react';

const Tab = React.createClass({
  propTypes: {
    active: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    src: React.PropTypes.string.isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate(nextProps) {
    const dName = this.props.name !== nextProps.name;
    const dSrc = this.props.src !== nextProps.src;
    const dActive = this.props.active !== nextProps.active;
    return dName || dSrc || dActive;
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

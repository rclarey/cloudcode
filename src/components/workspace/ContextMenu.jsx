// src/components/workspace/ContextMenu.jsx

import React from 'react';

const ContextMenu = React.createClass({
  propTypes: {
    holds: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        func: React.PropTypes.func.isRequired,
      }).isRequired,
    ).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
  },

  componentDidMount() {
    const func = () => {
      document.body.removeEventListener('click', func);
      this.props.hub.trigger('contextmenu:close');
    };
    document.body.addEventListener('click', func);
  },

  render() {
    return (
      <ul id="workspace-context-menu" style={{ top: `${this.props.y}px`, left: `${this.props.x}px` }}>
        {this.props.holds.map(item => <li className="context-menu-item" onClick={item.func}>{item.name}</li>)}
      </ul>
    );
  },
});

export default ContextMenu;

// src/components/workspace/File.jsx

import React from 'react';

const File = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    // holds: React.PropTypes.string.isRequired,
    // share: React.PropTypes.bool.isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  },

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'file',
      src: this.props.src,
      x: e.clientX,
      y: e.clientY,
    });
    e.stopPropagation();
    e.preventDefault();
  },

  handleClick(e) {
    if (e.which && e.which === 3) {
      this.handleContextMenu(e);
    }
  },

  render() {
    return (
      <li className="tree-file" onContextMenu={this.handleContextMenu}>
        <span className="tree-file-name">{this.props.name}</span>
      </li>
    );
  },
});

export default File;

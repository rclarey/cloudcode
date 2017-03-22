// src/components/workspace/Folder.jsx

import React from 'react';
import { renderNode } from 'helpers.jsx';

const Folder = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    open: React.PropTypes.bool.isRequired,
    holds: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        file: React.PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate(nextProps) {
    const dSrc = this.props.src !== nextProps.src;
    const dHolds = this.props.holds !== nextProps.holds;
    const dName = this.props.name !== nextProps.name;
    const dOpen = this.props.open !== nextProps.open;
    return dSrc || dHolds || dName || dOpen;
  },

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'folder',
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
    } else {
      this.props.hub.trigger('folder:toggle', this.props.src);
    }
  },

  render() {
    let holds;
    if (this.props.open) {
      holds = (
        <ul className="tree-folder-holds">
          {this.props.holds.map(node => renderNode(node, this.props.hub))}
        </ul>
      );
    }
    const innerClass = `tree-folder-inner ${this.props.open ? 'open' : 'closed'}`;
    return (
      <li className="tree-folder" onContextMenu={this.handleContextMenu}>
        <div className={innerClass} onClick={this.handleClick}>
          <span className="tree-folder-name">{this.props.name}</span>
        </div>
        {holds}
      </li>
    );
  },

});

export default Folder;

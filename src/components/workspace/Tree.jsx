// src/components/workspace/Tree.jsx

import React from 'react';
import { renderNode } from 'helpers.jsx';

const Tree = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
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
    return this.props.holds !== nextProps.holds;
  },

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'tree',
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
    const s = this.props.src;
    return (
      <div className="tree" onContextMenu={this.handleContextMenu} onClick={this.handleClick}>
        <span className="tree-title">{`${s[0].toUpperCase()}${s.substr(1)}`}</span>
        <hr className="tree-title-divider" />
        <ul className="tree-folder-holds">
          {this.props.holds.map(node => renderNode(node, this.props.hub))}
        </ul>
      </div>
    );
  },

});

export default Tree;

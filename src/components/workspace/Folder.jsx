// src/components/workspace/Folder.jsx

import React from 'react';
import helpers from 'components/workspace/helpers.jsx';

const Tree = React.createClass({
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

  handleOpen() {
    this.props.hub.trigger('folder:open', this.props.src);
  },

  render() {
    let holds;
    if (this.props.open) {
      holds = (
        <ul className="tree-folder-holds">
          {this.props.holds.map(node => helpers.renderTreeNode(node, this.props.hub))}
        </ul>
      );
    }
    const innerClass = `tree-folder-inner ${this.props.open ? 'open' : 'closed'}`;
    return (
      <li className="tree-folder">
        <div className={innerClass} onClick={this.handleOpen}>
          <span className="tree-folder-name">{this.props.name}</span>
        </div>
        {holds}
      </li>
    );
  },

});

export default Tree;

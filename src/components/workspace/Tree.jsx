// src/components/workspace/Tree.jsx

import React from 'react';
import helpers from 'components/workspace/helpers.jsx';

const Tree = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    tree: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        file: React.PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.tree !== nextProps.tree;
  },

  render() {
    return (
      <div className="tree">
        <span className="tree-title">{this.props.title}</span>
        <hr className="tree-title-divider" />
        <ul className="tree-folder-holds">
          {this.props.tree.map(node => helpers.renderTreeNode(node, this.props.hub))}
        </ul>
      </div>
    );
  },

});

export default Tree;

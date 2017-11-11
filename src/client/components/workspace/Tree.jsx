import PropTypes from 'prop-types';
import React from 'react';

import { renderNode } from 'utils/workspace';

class Tree extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.holds !== nextProps.holds;
  }

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'tree',
      src: this.props.src,
      x: e.clientX,
      y: e.clientY,
    });
    e.stopPropagation();
    e.preventDefault();
  }

  handleClick(e) {
    if (e.which && e.which === 3) {
      this.handleContextMenu(e);
    }
  }

  render() {
    const s = this.props.src;
    const treeProps = {
      className: 'tree',
      onContextMenu: this.handleContextMenu,
      onClick: this.handleClick,
    };

    return (
      <div {...treeProps}>
        <span className="tree-title">
          {`${s[0].toUpperCase()}${s.substr(1)}`}
        </span>
        <hr className="tree-title-divider" />
        <ul className="tree-folder-holds">
          {this.props.holds.map(node => renderNode(node, this.props.hub))}
        </ul>
      </div>
    );
  }
}

Tree.propTypes = {
  src: PropTypes.string.isRequired,
  holds: PropTypes.arrayOf(PropTypes.shape({
    file: PropTypes.bool.isRequired,
  }).isRequired).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Tree;

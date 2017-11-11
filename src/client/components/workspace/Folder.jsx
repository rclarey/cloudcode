import PropTypes from 'prop-types';
import React from 'react';

import { renderNode } from 'utils/workspace';

class Folder extends React.Component {
  shouldComponentUpdate(nextProps) {
    const dSrc = this.props.src !== nextProps.src;
    const dHolds = this.props.holds !== nextProps.holds;
    const dName = this.props.name !== nextProps.name;
    const dOpen = this.props.open !== nextProps.open;
    return dSrc || dHolds || dName || dOpen;
  }

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'folder',
      src: this.props.src,
      x: e.clientX,
      y: e.clientY,
    });
    // prevent the browser's context menu
    e.stopPropagation();
    e.preventDefault();
  }

  handleClick(e) {
    if (e.which && e.which === 3) {
      this.handleContextMenu(e);
    } else {
      this.props.hub.trigger('folder:toggle', this.props.src);
    }
  }

  render() {
    let holds;
    if (this.props.open) {
      holds = (
        <ul className="tree-folder-holds">
          {this.props.holds.map(node => renderNode(node, this.props.hub))}
        </ul>
      );
    }
    const klass = `tree-folder-inner ${this.props.open ? 'open' : 'closed'}`;
    return (
      <li className="tree-folder" onContextMenu={this.handleContextMenu}>
        <div className={klass} onClick={this.handleClick}>
          <span className="tree-folder-name">{this.props.name}</span>
        </div>
        {holds}
      </li>
    );
  }
}

Folder.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  holds: PropTypes.arrayOf(React.PropTypes.shape({
    file: PropTypes.bool.isRequired,
  }).isRequired).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Folder;

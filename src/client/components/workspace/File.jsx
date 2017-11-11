import PropTypes from 'prop-types';
import React from 'react';

class File extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  }

  handleContextMenu(e) {
    this.props.hub.trigger('contextmenu:open', {
      type: 'file',
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
    }
  }

  render() {
    return (
      <li className="tree-file" onContextMenu={this.handleContextMenu}>
        <span className="tree-file-name">{this.props.name}</span>
      </li>
    );
  }
}

File.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // holds: PropTypes.string.isRequired,
  // share: PropTypes.bool.isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default File;

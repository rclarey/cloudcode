import PropTypes from 'prop-types';
import React from 'react';

class ResizeHandle extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  handleResize(event) {
    let start = event.clientX;
    const drag = (e) => {
      this.props.hub.trigger('tree:resize', e.clientX - start);
      start = e.clientX;
    };
    const stop = () => {
      document.documentElement.removeEventListener('mousemove', drag);
      document.documentElement.removeEventListener('mouseup', stop);
      this.props.hub.trigger('tree:resize:clamp');
    };
    document.documentElement.addEventListener('mousemove', drag);
    document.documentElement.addEventListener('mouseup', stop);
  }

  render() {
    return (
      <div className="resize-handle" onMouseDown={this.handleResize} />
    );
  }
}

ResizeHandle.propTypes = {
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default ResizeHandle;

// src/components/workspace/ResizeHandle.jsx

import React from 'react';

const ResizeHandle = React.createClass({
  propTypes: {
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  shouldComponentUpdate() {
    return false;
  },

  resize(event) {
    let start = event.clientX;
    const drag = (e) => {
      this.props.hub.trigger('tree:resize', e.clientX - start);
      start = e.clientX;
    };
    const stop = () => {
      document.documentElement.removeEventListener('mousemove', drag);
      document.documentElement.removeEventListener('mouseup', stop);
    };
    document.documentElement.addEventListener('mousemove', drag);
    document.documentElement.addEventListener('mouseup', stop);
  },

  render() {
    return (
      <div className="resize-handle" onMouseDown={this.resize} />
    );
  },
});

export default ResizeHandle;

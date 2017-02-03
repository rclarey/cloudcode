// src/components/workspace/File.jsx

import React from 'react';

const File = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    holds: React.PropTypes.string.isRequired,
    share: React.PropTypes.bool.isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  },

  render() {
    return (
      <li className="tree-file">
        <span className="tree-file-name">{this.props.name}</span>
      </li>
    );
  },
});

export default File;

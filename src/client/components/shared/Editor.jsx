import PropTypes from 'prop-types';
import React from 'react';

import initSocket from 'utils/socket';

class Editor extends React.Component {
  componentDidMount() {
    const cm = CodeMirror(document.getElementById('editor'), {
      lineNumbers: true,
      scrollbarStyle: 'null',
      autofocus: true,
      pollInterval: 500,
    });

    const id = window.location.pathname.slice(3);
    initSocket(id, cm, this.props.hub);
  }

  render() {
    return (<div id="editor" className="editor" />);
  }
}

Editor.propTypes = {
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Editor;

// src/components/workspace/Editor.jsx

import React from 'react';

const Editor = React.createClass({
  componentDidMount() {
    CodeMirror(document.querySelector('#workspace-editor'), { lineNumbers: true, scrollbarStyle: 'null', autofocus: true });
  },

  render() {
    return (<div id="workspace-editor" />);
  },

});

Editor.propTypes = {};

export default Editor;

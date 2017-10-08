// src/components/workspace/Editor.jsx

import React from 'react';

const Editor = React.createClass({
  componentDidMount() {
    CodeMirror(document.querySelector('#editor'), {
      lineNumbers: true,
      scrollbarStyle: 'null',
      autofocus: true,
    });
  },

  render() {
    return (<div id="editor" className="editor" />);
  },

});

Editor.propTypes = {};

export default Editor;

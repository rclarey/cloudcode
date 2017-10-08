// src/components/App.jsx

import React from 'react';
import TopBar from 'components/shared/TopBar.jsx';
import Editor from 'components/shared/Editor.jsx';
import freezer from 'freezer/app/freezer.js';

const App = React.createClass({

  componentDidMount() {
    freezer.on('update', () => {
      this.forceUpdate();
    });
  },

  render() {
    return (
      <div id="anon">
        <TopBar name="asdf" />
        <Editor mode={freezer.get().mode} />
      </div>
    );
  },
});

export default App;

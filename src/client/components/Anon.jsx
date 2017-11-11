import React from 'react';

import TopBar from 'components/shared/TopBar';
import Editor from 'components/shared/Editor';
import freezer from 'freezer/anon';

class Anon extends React.Component {
  componentDidMount() {
    freezer.on('update', () => this.forceUpdate());
  }

  render() {
    return (
      <div id="anon">
        <TopBar name="asdf" />
        <Editor mode={freezer.get().mode} />
      </div>
    );
  }
}

export default Anon;

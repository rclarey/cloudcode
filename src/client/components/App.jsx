import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router';

import Settings from 'components/settings/Settings';
import Account from 'components/settings/Account';
import Editor from 'components/shared/Editor';
import Workspace from 'components/workspace/Workspace';
import TopBar from 'components/shared/TopBar';
import freezer from 'freezer/app';

const propUp = X => () =>
  <X store={freezer.get()} hub={freezer.getEventHub()} />;

class App extends React.Component {
  componentDidMount() {
    freezer.on('update', () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div id="app">
        <TopBar name={freezer.get().user.name} />
        <div id="app-main">
          <Switch>
            <Route path="/editor" render={propUp(Workspace)} />
            <Route path="/settings" render={propUp(Settings)}>
              <Route path="account" render={propUp(Account)} />
              <Route path="editor" render={propUp(Editor)} />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;

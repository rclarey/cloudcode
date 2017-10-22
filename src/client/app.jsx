import React from 'react';
import ReactDOM from 'react-dom';
import browserHistory from 'react-router/lib/browserHistory';
import IndexRoute from 'react-router/lib/IndexRoute';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';

import App from 'components/App.jsx';
import Settings from 'components/settings/Settings.jsx';
import Account from 'components/settings/Account.jsx';
import Editor from 'components/shared/Editor.jsx';
import Workspace from 'components/workspace/Workspace.jsx';

const routes = (
  <Route path="/editor" component={App}>
    <IndexRoute component={Workspace} />
    <Route path="/settings" component={Settings}>
      <Route path="account" component={Account} />
      <Route path="editor" component={Editor} />
    </Route>
  </Route>
);

ReactDOM.render(
  <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('app'),
);

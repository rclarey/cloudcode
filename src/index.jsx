import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App.jsx';
import Settings from './components/Settings/Settings.jsx'
import Account from './components/Settings/Account.jsx'
import Editor from './components/Settings/Editor.jsx'

import reducer from './redux/reducer.jsx';

const store = createStore(reducer);

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Workspace} />
    <Route path="settings" component={Settings}>
      <Route path="account" component={Account} />
      <Route path="editor" component={Editor} />
    </Route>
  </Route>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app'),
);

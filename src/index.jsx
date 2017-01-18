import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import reducer from './redux/reducer.jsx';

const store = createStore(reducer);

const routes = (
  <Route path="/app" component={App}>
    <Route path="asdf" component={App} />
  </Route>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app'),
);

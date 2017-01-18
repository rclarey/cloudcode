// src/components/App.jsx

import React from 'react';

export default function App(props) {
  return (
    <div id="app">
      <TopBar id="app-topbar" />
      {props.children}
    </div>
  );
}
App.propTypes = {
  children: React.PropTypes.element.isRequired,
};

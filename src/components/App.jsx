// src/components/App.jsx

import React from 'react';

export default function App(props) {
  return (
    <div className="container">{props.location.pathname}</div>
  );
}
App.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
};

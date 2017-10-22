import React from 'react';
import TopBar from 'components/shared/TopBar.jsx';
import freezer from 'freezer/app/freezer.js';

const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },

  componentDidMount() {
    freezer.on('update', () => {
      this.forceUpdate();
    });
  },

  render() {
    return (
      <div id="app">
        <TopBar name={freezer.get().user.name} />
        <div id="app-main">
          {React.Children.map(this.props.children, child => React.cloneElement(child, {
            store: freezer.get(), hub: freezer.getEventHub(),
          }))}
        </div>
      </div>
    );
  },
});

export default App;

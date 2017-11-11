import PropTypes from 'prop-types';
import React from 'react';

class ContextMenu extends React.Component {
  componentDidMount() {
    const func = () => {
      document.body.removeEventListener('click', func);
      this.props.hub.trigger('contextmenu:close');
    };
    document.body.addEventListener('click', func);
  }

  render() {
    const containerProps = {
      id: 'workspace-context-menu',
      style: {
        top: `${this.props.y}px`,
        left: `${this.props.x}px`,
      },
    };
    const menuItems = this.props.holds.map(item => (
      <li className="context-menu-item" onClick={item.func}>
        {item.name}
      </li>
    ));

    return <ul {...containerProps}>{menuItems}</ul>;
  }
}

ContextMenu.propTypes = {
  holds: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }).isRequired).isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default ContextMenu;

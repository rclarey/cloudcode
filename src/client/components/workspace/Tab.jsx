import PropTypes from 'prop-types';
import React from 'react';

class Tab extends React.Component {
  shouldComponentUpdate(nextProps) {
    const dName = this.props.name !== nextProps.name;
    const dSrc = this.props.src !== nextProps.src;
    const dActive = this.props.active !== nextProps.active;
    return dName || dSrc || dActive;
  }

  handleDelete() {
    this.props.hub.trigger('tab:delete', this.props.index);
  }

  render() {
    return (
      <li className="tab">
        <span className="tab-text">
          {!this.props.name ? 'untitled' : this.props.name}
        </span>
        <button className="tab-close" onClick={this.handleDelete}>x</button>
      </li>
    );
  }
}

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Tab;

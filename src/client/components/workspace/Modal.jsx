import PropTypes from 'prop-types';
import React from 'react';

import { fetchNode, normalizePath } from 'utils/workspace';

class Modal extends React.Component {
  getInitialState() {
    return { value: this.props.src };
  }

  componentDidMount() {
    const inp = document.querySelector('#modal input');
    inp.focus();
    document.body.addEventListener('click', this.cleanDeath);
    if (this.props.doSelect) {
      const name = this.props.src.match(/[^/]+?(?=(\.[^/]+|\/|)$)/)[0];
      const i = this.props.src.indexOf(name);
      inp.setSelectionRange(i, i + name.length);
    }
  }

  cleanDeath(e, force) {
    if (force || e.target.id !== 'modal-input') {
      document.body.removeEventListener('click', this.cleanDeath);
      this.props.hub.trigger('modal:close');
    }
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const val = normalizePath(e.target.value);
      if (val.slice(0, val.indexOf('/')) !== 'own') {
        console.log('Incorrect base folder');
        return;
      }

      const fetch = fetchNode(val);
      // TODO: proper error handling
      if (!fetch.failed) {
        console.log('Already exists.');
        return;
      } else if (fetch.failed === 'notfolder') {
        console.log('Not a folder');
        return;
      }

      this.props.func(val);
      this.cleanDeath(null, true);
    }
  }

  render() {
    const inputProps = {
      id: 'modal-input',
      type: 'text',
      value: this.state.value,
      onKeyPress: this.handleKeyPress,
      onChange: this.handleChange,
    };

    return (
      <div id="modal">
        <div id="modal-prompt">{this.props.prompt}</div>
        <input {...inputProps} />
      </div>
    );
  }
}

Modal.propTypes = {
  func: PropTypes.func.isRequired,
  prompt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  doSelect: PropTypes.bool.isRequired,
  hub: PropTypes.shape({
    trigger: PropTypes.func.isRequired,
  }).isRequired,
};

export default Modal;

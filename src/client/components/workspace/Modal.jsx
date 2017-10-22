import React from 'react';
import { fetchNode, normalizePath } from 'helpers.jsx';

const Modal = React.createClass({
  propTypes: {
    func: React.PropTypes.func.isRequired,
    prompt: React.PropTypes.string.isRequired,
    src: React.PropTypes.string.isRequired,
    doSelect: React.PropTypes.bool.isRequired,
    hub: React.PropTypes.shape({
      trigger: React.PropTypes.func.isRequired,
    }).isRequired,
  },

  getInitialState() {
    return { value: this.props.src };
  },

  componentDidMount() {
    const inp = document.querySelector('#modal input');
    inp.focus();
    document.body.addEventListener('click', this.cleanDeath);
    if (this.props.doSelect) {
      const name = this.props.src.match(/[^/]+?(?=(\.[^/]+|\/|)$)/)[0];
      const i = this.props.src.indexOf(name);
      inp.setSelectionRange(i, i + name.length);
    }
  },

  cleanDeath(e, force) {
    if (force || e.target.id !== 'modal-input') {
      document.body.removeEventListener('click', this.cleanDeath);
      this.props.hub.trigger('modal:close');
    }
  },

  handleChange(e) {
    this.setState({ value: e.target.value });
  },

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const val = normalizePath(e.target.value);
      if (val.slice(0, val.indexOf('/')) !== 'own') {
        console.log('Incorrect base folder');
        return;
      }
      const fetch = fetchNode(val);
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
  },

  render() {
    return (
      <div id="modal">
        <div id="modal-prompt">{this.props.prompt}</div>
        <input id="modal-input" type="text" value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
      </div>
    );
  },
});

export default Modal;

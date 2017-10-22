import React from 'react';

const stripUpdate = ({ from, text, to }) => ({
  text,
  from: { ch: from.ch, line: from.line },
  to: { ch: to.ch, line: to.line },
});

const mergeUpdate = (og, nu) => {
  // note that both of these changes are single line AND they are both on the same line
  const ogEnd = og.from.ch + og.text[0].length;
  const nuEnd = nu.from.ch + nu.text[0].length;

  if (nu.from.ch <= og.from.ch && (nuEnd >= og.from.ch || nu.to.ch >= og.from.ch)) {
    return {
      from: nu.from,
      to: {
        line: og.to.line,
        ch: nu.to.ch > ogEnd ? og.to.ch + (nu.to.ch - ogEnd) : og.to.ch,
      },
      text: [`${nu.text[0]}${og.text[0].slice(og.to.ch - nu.from.ch)}`],
    };
  } else if (nu.from.ch > og.from.ch && nu.from.ch <= ogEnd) {
    return {
      from: og.from,
      to: {
        line: og.to.line,
        ch: nu.to.ch > ogEnd ? og.to.ch + (nu.to.ch - ogEnd) : og.to.ch,
      },
      text: [`${og.text[0].slice(0, nu.from.ch - og.from.ch)}${nu.text[0]}${og.text[0].slice(nuEnd)}`],
    };
  }
  // cannot merge
  return null;
};

const changeThrottler = (socket) => {
  let change = null;
  let timeout = null;
  const startChangeTimeout = () => {
    timeout = setTimeout(() => {
      socket.emit('update', change);
      change = null;
    }, 200);
  };

  return (_, obj) => {
    // if change recieved via websocket from another client
    if (obj.origin === 'ws') { return; }
    if (obj.text.length > 1 || obj.removed.length > 1) {
      // change is multilined, send right away
      if (change) {
        clearTimeout(timeout);
        socket.emit('update', change);
        change = null;
      }
      socket.emit('update', stripUpdate(obj));
    } else if (!change) {
      // start building a local change obj && set timeout
      change = stripUpdate(obj);
      startChangeTimeout();
    } else if (obj.from.line !== change.from.line) {
      // new change is on a different line, so send what we have and start over
      clearTimeout(timeout);
      socket.emit('update', change);
      change = stripUpdate(obj);
      startChangeTimeout();
    } else {
      const merge = mergeUpdate(change, obj);
      if (merge) {
        // set merged update as our change object
        change = merge;
      } else {
        // new change is incompatible with out existing change object, so send what we have and start over
        clearTimeout(timeout);
        socket.emit('update', change);
        change = stripUpdate(obj);
        startChangeTimeout();
      }
    }
  };
};

const updateHandler = doc => (change) => {
  console.log(change);
  doc.replaceRange(change.text.join('\n'), change.from, change.to, 'ws');
};

const Editor = React.createClass({
  componentDidMount() {
    const cm = CodeMirror(document.getElementById('editor'), {
      lineNumbers: true,
      scrollbarStyle: 'null',
      autofocus: true,
      pollInterval: 500,
    });

    const id = window.location.pathname.slice(3);
    const socket = io(`/?room=${id}`);
    const doc = cm.getDoc();
    const handleChange = changeThrottler(socket);
    const handleUpdate = updateHandler(doc);

    doc.on('change', handleChange);
    socket.on('update', handleUpdate);
  },

  render() {
    return (<div id="editor" className="editor" />);
  },

});

Editor.propTypes = {};

export default Editor;

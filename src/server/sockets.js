const TreeNode = require('./models/treeNode.js');

const applyChange = (arr, change) => {
  // removal and extraction of pre and post text
  const n = change.from.line;
  const m = change.to.line;
  const pre = arr[n].text.slice(0, change.from.ch);
  const post = arr[m].text.slice(change.to.ch);
  arr.splice(n, (m - n) + 1);
  // addition
  const lines = change.text.slice();
  lines[0] = `${pre}${lines[0]}`;
  lines[lines.length - 1] += post;
  const decorated = lines.map(text => ({ text, hash: 0 }));
  arr.splice(n, lines.length, ...decorated);
  return arr;
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    // join room & send contents of document
    socket.join(socket.handshake.query.room);
    TreeNode.findOne({ shareId: socket.handshake.query.room }).exec()
      .then((node) => {
        const change = {
          from: { line: 0, ch: 0 },
          to: { line: 0, ch: 0 },
          text: node.contents.map(line => line.text),
        };
        socket.emit('update', change);
      })
      .catch((error) => {
        throw error;
      });

    socket.on('update', (change) => {
      TreeNode.findOne({ shareId: socket.handshake.query.room }).exec()
        .then((node) => {
          const contents = applyChange(node.contents, change);
          node.set({ contents });
          return node.save();
        })
        .then(() => {
          socket.to(socket.handshake.query.room).emit('update', change);
        })
        .catch((error) => {
          throw error;
        });
    });
  });
};

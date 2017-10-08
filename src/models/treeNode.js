// src/models/treeNode.js

const mongoose = require('mongoose');
const shortid = require('shortid');

const treeNode = mongoose.Schema({
  src: { type: String },
  name: { type: String },
  shareId: { type: String },
  contents: { type: String },
  isFile: { type: Boolean, required: true },
  isShared: { type: Boolean, default: false },
  children: {
    type: [mongoose.Schema.objectId],
    default: undefined,
  },
});

// Methods
treeNode.methods = {
  addChild(name, isFile) {
    if (this.isFile) { throw new Error('Cannot add a child to a file!'); }
    return this.model('TreeNode')
      .insertOne({ name, isFile, src: `${this.src}/${name}` })
      .then(node => this.model('TreeNode').updateOne(
          { _id: this._id },
          { $addToSet: { children: [node._id] } } // eslint-disable-line comma-dangle
        ));
  },
  removeChild() {},
  gatherChildren() {},
  setShared(isShared) {
    this.isShared = isShared;
    if (isShared && !this.shareId) { this.shareId = shortid.generate(); }
    return this.save();
  },
};

const TreeNode = mongoose.model('TreeNode', treeNode);

module.exports = TreeNode;

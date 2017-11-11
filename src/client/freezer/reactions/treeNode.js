import {
  createModal,
  createNode,
  dupeNode,
  moveNode,
  deleteNode,
} from 'utils/workspace';

export default function reactions(freezer) {
  freezer.on('treenode:create', (src, isFile) => {
    createModal(
      'Enter the path to your new file.',
      src.slice(0, src.lastIndexOf('/') + 1),
      val => createNode(val, isFile),
    );
  });

  freezer.on('treenode:dupe', (src) => {
    createModal(
      'Enter the path to your new file.',
      src,
      val => dupeNode(src, val),
      true,
    );
  });

  freezer.on('treenode:rename', (src) => {
    createModal(
      'Enter the new name.',
      src,
      val => moveNode(src, val),
      true,
    );
  });

  freezer.on('treenode:delete', (src) => {
    // TODO: close tab if open
    deleteNode(src);
  });
}

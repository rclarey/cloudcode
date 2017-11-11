import Freezer from 'freezer-js';
import contextMenu from 'freezer/reactions/contextMenu';

const freezer = new Freezer({
  mode: 'js',
});

contextMenu(freezer);

export default freezer;

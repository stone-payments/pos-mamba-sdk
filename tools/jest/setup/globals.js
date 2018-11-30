import Root from '../mocks/Root.html';

let lastRoot;

/* Create a new app root for testing */
global.newTestRoot = ({ unique = true } = {}) => {
  if (unique && lastRoot) lastRoot.destroy();

  lastRoot = new Root({ target: document.body });

  lastRoot.target = lastRoot.options.target;

  return lastRoot;
};

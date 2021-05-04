import KEY_ACTION from './const.js';

let lastActive;

const unActiveLeast = items => {
  let hasActive;

  if (typeof lastActive === 'object' && lastActive.get) {
    hasActive = lastActive;
  }

  if (!hasActive) {
    lastActive = undefined;
    hasActive = items.find(el => el.element.get().isActive);
  }

  if (hasActive) {
    (hasActive.element || hasActive).set({
      isActive: false,
    });
  }
};

export const toggleActive = (items, index) => {
  unActiveLeast(items);

  const item = items[index].element;

  lastActive = item;

  item.set({
    isActive: true,
  });
};

const scrollTo = (yaxis, item) => {
  const { element } = item.element.refs;
  if (!element) {
    if (__DEV__) {
      console.warn('Refresh the page to reset <FlatList /> references');
    }
    return;
  }

  const { top } = element.getBoundingClientRect();
  if (top + yaxis >= window.innerHeight) {
    window.scrollTo(0, top + yaxis);
  } else {
    window.scrollTo(0, 0);
  }
};

const getPosition = (index, keyAction) => {
  if (keyAction === KEY_ACTION.UP) {
    return index !== null && index > 0 ? index - 1 : index;
  }
  return index !== null ? index + 1 : 0;
};

export const selectRowItem = (
  nodeList,
  index,
  yaxis,
  keyAction = KEY_ACTION.DOWN,
) => {
  const selectIndex = getPosition(index, keyAction);

  if (nodeList[selectIndex]) {
    scrollTo(yaxis, nodeList[selectIndex]);
    toggleActive(nodeList, selectIndex);
    return selectIndex;
  }

  return index;
};

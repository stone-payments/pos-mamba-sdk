const toggleActive = (items, index, action) => {
  const hasActive = items.find(el => el.element.get().isActive);
  if (hasActive) {
    hasActive.element.set({
      isActive: false,
    });
  }

  const item = items[index].element;

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

const getPosition = (index, event) => {
  if (event === 'up') {
    return index !== null && index > 0 ? index - 1 : index;
  }
  return index !== null ? index + 1 : 0;
};

export const selectRowItem = (nodeList, index, yaxis, event = 'down') => {
  const selectIndex = getPosition(index, event);

  if (nodeList[selectIndex]) {
    scrollTo(yaxis, nodeList[selectIndex]);
    toggleActive(nodeList, selectIndex, 'up');
    return selectIndex;
  }

  return index;
};

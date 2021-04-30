const toglleActive = (items, index, action) => {

  const hasActive = items.find(el => el.element.get().isActive);
  if(hasActive) {
    hasActive.element.set({
      isActive: false
    })
  }

  const item = items[index].element

  item.set({
    isActive: true
  });
}

const scrollTo = (yaxis, item) => {
  const { top } = item.element.refs.element.getBoundingClientRect();
  if (top + yaxis >= window.innerHeight) {
    window.scrollTo(0, top + yaxis);
  } else {
    window.scrollTo(0, 0);
  }
};

const getPosition = (index, event) => {

  if(event === 'up') {
    return index !== null && index > 0 ? index - 1 : index
  }
  return index !== null ? index + 1 : 0;

}

export const selectRowItem = (nodeList, index, yaxis, event = 'down') => {

  const selectIndex = getPosition(index, event);

  scrollTo(yaxis, nodeList[selectIndex]);
  toglleActive(nodeList, selectIndex, 'up');

  return selectIndex;


  //if (nodeList.length - 1 > index) {
    // if (event === 'up') {
    //   const newIndex = index !== null && index > 0 ? index - 1 : index;
    //   scrollTo(yaxis, nodeList[newIndex]);
    //   toglleActive(nodeList, newIndex, 'up');

    //   console.log(newIndex);

    //   return newIndex;
    // }

    // const selectIndex = index !== null ? index + 1 : 0;

    // scrollTo(yaxis, nodeList[selectIndex]);

    // toglleActive(nodeList, selectIndex, 'down');

    // return selectIndex;
  // }
  // return index <= 0 ? index ;
  // return index <= 0
  //   ? index
  //   : nodeList.length - 1 === index && event === 'up'
  //     ? index - 1
  //     : index;
};

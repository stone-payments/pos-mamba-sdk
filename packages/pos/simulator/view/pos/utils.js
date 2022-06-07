export const onceTransitionEnd = (el, cb) => {
  const onTransitionEnd = (e) => {
    cb(e);
    el.removeEventListener('transitionend', onTransitionEnd);
  };
  el.addEventListener('transitionend', onTransitionEnd);
};

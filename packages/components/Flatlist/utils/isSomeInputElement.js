import { FOCUSABLE_ELEMENTS } from '../const.js';

export default function isSomeInputElement(i) {
  if (!i) return false;
  return FOCUSABLE_ELEMENTS.some((cl) => {
    return i instanceof window[`HTML${cl}Element`];
  });
}

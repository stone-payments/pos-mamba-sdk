import isObject from './isObject.js';

export default function deepMerge(source, target) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, val] of Object.entries(source)) {
    if (isObject(val)) {
      if (target[key] === undefined) {
        // eslint-disable-next-line no-proto
        target[key] = new val.__proto__.constructor();
      }
      deepMerge(val, target[key]);
    } else {
      target[key] = val;
    }
  }
  return target;
}

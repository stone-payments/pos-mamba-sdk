/* eslint-disable no-unused-vars */
export const NAMESPACE = '$Gif';

export function setup(Gif) {
  Gif.show = path => false;
  Gif.show = (path, x, y) => false;
  Gif.setPosition = (path, x, y) => false;
  Gif.cache = path => false;
  Gif.hide = () => undefined;
  Gif.get = path => ({ x: 0, y: 0, w: 0, h: 0 });
}

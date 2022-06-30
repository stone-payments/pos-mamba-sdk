/**
 * Create general porupouse keybaord element
 *
 * @param className The elements's class name. Class string or array of classes
 * @return Keyboard general div element
 */
export function createKeyboardElement(
  className?: string | string[],
  type = 'div',
): HTMLDivElement | HTMLSpanElement {
  const elm = document.createElement(type);
  if (className) {
    elm.className += Array.isArray(className) ? className.join(' ') : className;
  }

  return elm;
}

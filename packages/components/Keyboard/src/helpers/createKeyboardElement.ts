/**
 * Create general porupouse keybaord element
 *
 * @param className The elements's class name
 * @return Keyboard general div element
 */
export function createKeyboardElement(
  className?: string,
  type = 'div',
): HTMLDivElement | HTMLSpanElement {
  const elm = document.createElement(type);
  if (className) elm.className += className;
  return elm;
}

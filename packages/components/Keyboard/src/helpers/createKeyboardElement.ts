/**
 * Create general porupouse keybaord element
 *
 * @param className The elements's class name
 * @return Keyboard general div element
 */
export function createKeyboardElement(className?: string): HTMLDivElement {
  const elm = document.createElement('div');
  if (className) elm.className += className;
  return elm;
}

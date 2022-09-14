/**
 * Detect if element defined the data-keyboard value
 *
 * @param element
 * @returns Return if the given element belongs to `input` element type
 */
export function hasDataKeyboard(element?: HTMLElement): boolean {
  return element ? 'keyboard' in element : false;
}

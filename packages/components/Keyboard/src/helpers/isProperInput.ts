/**
 * Detect if element if INPUT type
 *
 * @param element Any bottom-level `HTMLElement` type
 * @returns Return if the given element belongs to `input` element type
 */
export function isProperInput(element?: HTMLElement | EventTarget): boolean {
  return element instanceof HTMLInputElement;
}

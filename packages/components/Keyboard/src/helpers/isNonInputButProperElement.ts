import { hasDataKeyboard } from './hasDataKeyboard';

/**
 * Detect if element if DIV
 *
 * @param element Any bottom-level `HTMLElement` type
 * @returns Return if the given element belongs to `div` element type
 */
export function isNonInputButProperElement(element?: HTMLElement): boolean {
  return (
    // If it is non DOM Input element, but a `<div>`
    element instanceof HTMLDivElement &&
    // And it have the dataset `keyboard` defined to true;
    hasDataKeyboard(element)
  );
}

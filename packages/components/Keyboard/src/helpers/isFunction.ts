/**
 * Checks if the given `of` param is a function
 * @param of Value to check
 * @return If the value is a function or not
 */
export function isFunction(of?: any): boolean {
  return typeof of === 'function';
}

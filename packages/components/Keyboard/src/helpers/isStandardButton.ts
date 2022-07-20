/**
 * Check whether the button is a standard button
 * @param button Button name
 */
export function isStandardButton(button: string): boolean {
  return !!button && !(button[0] === '{' && button[button.length - 1] === '}');
}

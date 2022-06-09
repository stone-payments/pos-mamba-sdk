/**
 * Labels of know key by default
 * @returns Known keys labels
 */
export function getDefaultLabels() {
  return {
    '{backspace}': ' ',
    '{delete}': '⌫',
    '{check}': '✓',
    '{enter}': 'retorno',
    '{space}': 'espaço',
    '{@}': '@',

    // Key toggles
    '{shift}': '⇧',
    '{alt}': '?123',
    '{altback}': '?123',
    '{symbols}': '#+=',
    '{default}': 'ABC', // default keys shortcut after toggle another

    // May crossrelate with POS arrow keys
    '{keyup}': '↑',
    '{keydown}': '↓',
  };
}

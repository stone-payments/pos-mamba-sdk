import { getButtonType } from './getButtonType';
import { ButtonType } from '../types';
import { anyBraces } from '../common/regExps';
import { prefix, buttonPrefix } from './classPrefix';

/**
 * Adds default classes to a given button
 *
 * @param button The button's layout name
 * @return The classes to be added to the button
 */
export function getButtonClass(button: string): string {
  const buttonTypeClass = getButtonType(button);
  let buttonNormalized = '';

  if (buttonTypeClass !== ButtonType.Standard) {
    const buttonWithoutBraces = button.replace(anyBraces, '');
    buttonNormalized = ` ${buttonPrefix}-${buttonWithoutBraces}`;
  }

  return `${prefix}-${buttonTypeClass}${buttonNormalized}`;
}

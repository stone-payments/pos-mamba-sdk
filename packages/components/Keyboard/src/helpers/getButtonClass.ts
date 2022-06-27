import { getButtonType } from './getButtonType';
import { ButtonType } from '../types';
import { anyBraces } from '../common/regExps';
import { prefix, buttonPrefix } from './classNames';

/**
 * Adds default classes to a given button
 *
 * @param button The button's layout name
 * @return The classes to be added to the button
 */
export function getButtonClass(button: string): string {
  const buttonType = getButtonType(button);
  let buttonNormalized = '';

  if (buttonType !== ButtonType.Standard) {
    const buttonWithoutBraces = button.replace(anyBraces, '');
    buttonNormalized = ` ${buttonPrefix}-${buttonWithoutBraces}`;
  }

  return `${prefix}-${buttonType}${buttonNormalized}`;
}

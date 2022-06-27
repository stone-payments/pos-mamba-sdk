import { ButtonType } from '../types';
import { greddyBraces } from '../common/regExps';

/**
 * Retrieve button type
 * @param button The button's layout name/identifier
 * @return The button type
 */
export function getButtonType(button: string): ButtonType {
  return button !== '{//}' && greddyBraces.test(button) && button !== '{//}'
    ? ButtonType.Function
    : ButtonType.Standard;
}

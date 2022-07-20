import { getDefaultLabels } from './getDefaultLabels';
import type { KeyboardOptions } from '../types';

/**
 * Returns the label name for a given button
 *
 * @param button The button's layout name
 * @param labels The provided labels option
 * @returns Merged button label value
 */
export function getButtonLabelsName(button: string, labels: KeyboardOptions['labels']) {
  labels = { ...getDefaultLabels(), ...labels };
  return labels[button] || button;
}

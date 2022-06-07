/** Based on https://github.com/vuejs-tips/vue-the-mask */
import maskit from './maskit.js';
import dynamicMask from './dynamic-mask.js';

export default function (value, mask, masked = true, tokens = undefined) {
  return (Array.isArray(mask) ? dynamicMask(mask) : maskit)(value, mask, masked, tokens);
}

/**
 * Translation of `keyCode` to 'key' property for special keys only
 */

import KEY from './keyCodes';
import KEY_NAME from './keyNames';

export default Object.freeze({
  [KEY.ENTER]: KEY_NAME.ENTER,
  [KEY.BACK]: KEY_NAME.BACK,
  [KEY.CLOSE]: KEY_NAME.CLOSE,
  [KEY.HELP]: KEY_NAME.HELP,
  [KEY.SHORTCUTS]: KEY_NAME.SHORTCUTS,
  [KEY.F23]: KEY_NAME.F23,
  [KEY.F24]: KEY_NAME.F24,
  [KEY.POWER]: KEY_NAME.POWER,
  [KEY.MENU]: KEY_NAME.MENU,
  [KEY.ARROW_UP]: KEY_NAME.ARROW_UP,
  [KEY.ARROW_DOWN]: KEY_NAME.ARROW_DOWN,
  [KEY.KEY_0]: KEY_NAME.KEY_0,
  [KEY.KEY_1]: KEY_NAME.KEY_1,
  [KEY.KEY_2]: KEY_NAME.KEY_2,
  [KEY.KEY_3]: KEY_NAME.KEY_3,
  [KEY.KEY_4]: KEY_NAME.KEY_4,
  [KEY.KEY_5]: KEY_NAME.KEY_5,
  [KEY.KEY_6]: KEY_NAME.KEY_6,
  [KEY.KEY_7]: KEY_NAME.KEY_7,
  [KEY.KEY_8]: KEY_NAME.KEY_8,
  [KEY.KEY_9]: KEY_NAME.KEY_9,
  [KEY.SPACE]: KEY_NAME.SPACE,

  // These keymaps is specific for virtual keyboard and mamba inputs numpad codes
  96: KEY_NAME.KEY_0,
  97: KEY_NAME.KEY_1,
  98: KEY_NAME.KEY_2,
  99: KEY_NAME.KEY_3,
  100: KEY_NAME.KEY_4,
  101: KEY_NAME.KEY_5,
  102: KEY_NAME.KEY_6,
  103: KEY_NAME.KEY_7,
  104: KEY_NAME.KEY_8,
  105: KEY_NAME.KEY_9,

  /// Comment for reference
  // /**
  //  * @deprecated Use `ARROW_UP`
  //  */
  // [KEY.KEYUP]: KEY_NAME.KEYUP,

  // /**
  //  * @deprecated Use `ARROW_UP`
  //  */
  // [KEY.KEYDOWN]: KEY_NAME.KEYDOWN,
});

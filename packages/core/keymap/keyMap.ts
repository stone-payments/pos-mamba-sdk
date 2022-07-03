/**
 * Translation of `keyCode` to 'key' property for special keys only
 */

import KEY from './keyCodes';
import KEY_NAME from './keyNames';

export default Object.freeze({
  [KEY.ENTER]: KEY_NAME.ENTER,
  [KEY.BACKSPACE]: KEY_NAME.BACKSPACE,
  [KEY.KEYBACK]: KEY_NAME.BACK,
  [KEY.CLOSE]: KEY_NAME.CLOSE,
  [KEY.HELP]: KEY_NAME.HELP,
  [KEY.SHORTCUTS]: KEY_NAME.SHORTCUTS,
  [KEY.F23]: KEY_NAME.F23,
  [KEY.F24]: KEY_NAME.F24,
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

  /**
   * @deprecated Use `ARROW_UP`
   */
  [KEY.KEYUP]: KEY_NAME.KEYUP,

  /**
   * @deprecated Use `ARROW_UP`
   */
  [KEY.KEYDOWN]: KEY_NAME.KEYDOWN,
});

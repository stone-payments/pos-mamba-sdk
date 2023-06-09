/**
 * @typedef {object} MambaKeyboardInterface
 * @property {number} keyCode
 * @property {'TOUCH' | 'KEYBOARD'} telemetryEmitType
 */

/**
 * @typedef {MambaKeyboardInterface & MouseEvent} MambaKeyboardEvent
 */

/**
 * @param {HTMLElement} shortcutEl
 * @param {number} keyCode
 */
export const dispatchEventOn = (shortcutEl, keyCode) => {
  /**
   * Adapted from:
   * https://stackoverflow.com/questions/15739263/phantomjs-click-an-element
   */
  const event = document.createEvent('MouseEvent');
  event.initMouseEvent(
    'click',
    true,
    true,
    window,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
  );

  /**
   * Indicates the telemetry event emit action was the type of KEYBOARD, to app consumes.
   */
  event.telemetryEmitType = 'KEYBOARD';

  try {
    // Extends/hacks/fixes the propagation of physical keys to the emulated click
    // We need to add multiples properties because the simulator/POS compatibility
    event.code = keyCode;
    event.keyCode = keyCode;
    event.charCode = keyCode;
  } catch (error) {
    // Do nothing
  }

  shortcutEl.dispatchEvent(event);
};

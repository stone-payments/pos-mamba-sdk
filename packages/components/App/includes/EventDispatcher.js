export const dispatchEventOn = (shortcutEl) => {
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

  shortcutEl.dispatchEvent(event);
};

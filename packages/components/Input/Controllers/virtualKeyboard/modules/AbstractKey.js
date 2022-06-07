import System from '@mamba/pos/api/system';

class AbstractKey {
  /**
   * @param {string} code
   */
  constructor({ code }) {
    this.code = code;
  }

  /**
   * @description handle for beep sound
   * @private
   */
  _handleBeepSound() {
    System.beep(System.Tones.TONE3, 30);
  }

  /**
   * @description handle for issuing the event to the parent component
   * @param {any} componentScope
   * @param {string} eventName
   * @param {string} input
   */
  _emitEventToParent({ componentScope, eventName, input }) {
    componentScope.fire(eventName, { input });
    this._handleBeepSound();
  }

  /**
   * @description responsible for implementing the concrete logic of each element
   * @param {PointerEvent | TouchEvent} event
   * @param { {scope: any} } controller
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  onClickTemplate(event, controller) {}

  /**
   * @description responsible for performing standard tasks and completing the template method pattern
   * @param {PointerEvent | TouchEvent} event
   * @param { {scope: any} } controller
   */
  onClick(event, controller) {
    event.preventDefault();

    this.onClickTemplate(event, controller);
  }
}

export default AbstractKey;

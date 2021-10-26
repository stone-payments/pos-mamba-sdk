import System from '@mamba/pos/api/system.js';

class VirtualKeyboardController {
  /**
   * @param {any} scope
   */
  constructor(scope) {
    this.scope = scope;
  }

  openKeyboard() {
    this.scope.set({
      isFocused: true,
    });
  }

  closeKeyboard() {
    this.scope.set({
      isFocused: false,
    });
  }

  /**
   *
   * @param {PointerEvent} event
   * @private
   */
  _handleClickOutside(event) {
    const { target } = event;

    const offsetParentClassList = Array.from(
      target.offsetParent ? target.offsetParent.classList : [],
    );

    const hasClickedOutside = offsetParentClassList.every(
      className => className !== 'keyboard',
    );
    const isInputElement = target instanceof HTMLInputElement;

    if (hasClickedOutside && !isInputElement) {
      this.scope.set({ isFocused: false });
    }
  }
}

export default VirtualKeyboardController;

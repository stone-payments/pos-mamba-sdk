import System from '@mamba/pos/api/system.js';

class VirtualKeyboardController {
  /**
   * @param {any} scope
   */
  constructor(scope) {
    this.scope = scope;
  }

  insertKey(code) {
    const inputValue = this.getInputValue();

    const newInputValue = String(inputValue) + String(code);

    this.setInputValue(newInputValue);
    this.keyboardBeep();

    return newInputValue;
  }

  confirmKey() {
    this.scope.set({
      isFocused: false,
    });

    this.scope.fire('submit');

    this.keyboardBeep();
  }

  deleteKey() {
    const inputValue = this.getInputValue();

    if (!inputValue) return;

    this.setInputValue(inputValue.slice(0, -1));
    this.setInputFocus();

    this.keyboardBeep();
  }

  openKeyboard(inputRef) {
    this.scope.set({
      inputRef,
      isFocused: true,
    });
  }

  closeKeyboard() {
    this.scope.set({
      isFocused: false,
    });
  }

  getInputValue() {
    const { inputRef } = this.scope.get();

    const { value } = inputRef.get();

    return value;
  }

  setInputValue(value) {
    const { inputRef } = this.scope.get();

    inputRef.set({ value });

    return value;
  }

  setInputFocus() {
    const { inputRef } = this.scope.get();

    inputRef.focus();
  }

  keyboardBeep() {
    System.beep(System.Tones.TONE3, 30);
  }

  emitKeyToParent(key) {
    this.scope.fire("addInput", { input: key})
  }
}

export default VirtualKeyboardController;

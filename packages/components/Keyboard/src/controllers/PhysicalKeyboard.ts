import {
  KeyboardOptions,
  KeyboardHandlerEvent,
  PhysicalKeyboardParams,
  KeyboardInputOption,
  KeyboardUpdateMode,
  ButtonType,
  KeyboardVisibility,
} from '../types';
import type Keyboard from '../Keyboard';
import { bindMethods, isProperInput } from '../helpers';
import keyMapTable from '../mappings/keyTableMap';
import { anyBraces } from '../common/regExps';

/**
 * Responsible for handle keyboard towards physical device keys directly
 * Handle automatic screen focus
 * Send synthetic events to handle input post-processing (e.g. masks)
 * Keeps inputs synchronized
 */
class PhysicalKeyboard {
  private keyboardInstance!: Keyboard;

  private focusedDOMInput?: HTMLInputElement | null;

  public static beepTone = 'TONE3';

  public static beepTime = 90;

  cachedTargetInput?: HTMLInputElement = undefined;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the PhysicalKeyboard service
   */
  constructor({ getOptions, keyboardInstance }: PhysicalKeyboardParams) {
    /**
     * @type {object} A mamba keyboard instance
     */
    this.getOptions = getOptions;
    this.keyboardInstance = keyboardInstance;

    /**
     * Bindings
     */
    bindMethods(PhysicalKeyboard, this);

    /**
     * Register element focus changes for automatic mode only
     */
    if (this.getOptions().updateMode === KeyboardUpdateMode.Auto) {
      /** Add before focus event */
      document.addEventListener('focusin', this.handleDocumentFocusIn, true);
      /** Compute first interation */
      this.handleFocusIn(document.activeElement);
    }
  }

  /**
   * Handle document global focus in target
   * @param event The Document event
   */
  handleDocumentFocusIn(event: FocusEvent) {
    this.handleFocusIn(event.target || undefined, event);
  }

  /**
   * Handles any focus element
   *
   * @param target The Event target
   * @param e The Focus event
   */
  handleFocusIn(target?: EventTarget | Element | null, e?: FocusEvent) {
    /**
     * Update cached target input for key dispatch event
     */
    this.setCachedTargetInput();

    /**
     * Handle focused target
     */
    if (target && isProperInput(target)) {
      const options = this.getOptions();
      const input = target as HTMLInputElement;

      /**
       * Set keyboard visibility
       */
      this.keyboardInstance.visibility = KeyboardVisibility.Visible;

      /**
       * If the keepVisible option is on and user hit some button without input focus, we need ensure that virtual input do not update its values back to the DOM input on next update.
       */
      if (this.keyboardInstance.getInput() !== input.value && !options.input) {
        this.keyboardInstance.setInput(input.value);
      }

      this.addDOMInputEventListeners(input);
      this.keyboardInstance.handleDOMInputDataset();
      input.focus();
    }
  }

  /**
   * Handles input on blur
   *
   * @param e
   */
  handleDOMInputTargetBlur(e?: FocusEvent) {
    this.keyboardInstance.visibility = KeyboardVisibility.Hidden;
    if (e && e.target && isProperInput(e.target)) {
      const input = e.target as HTMLInputElement;
      this.removeDOMInputEventListeners(input);
    }
  }

  /**
   * Remove input target event listeners
   *
   * @param input
   */
  removeDOMInputEventListeners(input: HTMLInputElement) {
    input.removeEventListener('input', this.handleDOMInputChange);
    input.removeEventListener('click', this.handleDOMInputFocus);
    input.removeEventListener('blur', this.handleDOMInputTargetBlur);
    this.focusedDOMInput = null;
  }

  /**
   * Add input target event listeners
   *
   * @param input
   */
  addDOMInputEventListeners(input: HTMLInputElement) {
    /**
     * If already has last focused input, do not add listener again
     */
    if (this.focusedDOMInput) return;

    input.addEventListener('blur', this.handleDOMInputTargetBlur);
    input.addEventListener('click', this.handleDOMInputFocus);
    input.addEventListener('input', this.handleDOMInputChange);
    this.focusedDOMInput = input;
  }

  /**
   * Remove any input listeners, for life-cycle destroy
   */
  destroy() {
    if (this.focusedDOMInput) {
      this.removeDOMInputEventListeners(this.focusedDOMInput);
    }

    document.removeEventListener('focusin', this.handleDocumentFocusIn, true);
  }

  /**
   * Handle event target input focus
   * @param e
   */
  handleDOMInputFocus(e?: FocusEvent) {
    const options = this.getOptions();

    if (
      // if keyboard need lock cursor
      options.lockCursor === true &&
      // and check if target is input
      e &&
      e.target &&
      isProperInput(e.target)
    ) {
      const input = e.target as HTMLInputElement;

      /**
       * Move cursor to final
       */
      const endPosition = input.value.length;
      this.keyboardInstance.cursorWorker.setCursorPosition(endPosition, endPosition, true);
    }
  }

  /**
   * Update keyboard virtual input if DOM input changed directly
   * @param event
   */
  handleDOMInputChange(event: any) {
    this.keyboardInstance.setInput((event.target as HTMLInputElement).value);
  }

  /**
   * Updates and cache target input from keyboard options to not use document active element.
   * This saves some performance to not compute every key press
   */
  private setCachedTargetInput(): void {
    const options = this.getOptions();

    if (
      // If user setup the input property element compatible with DOM Input element
      isProperInput(options.input) ||
      // Or it is non DOM Input element, but a `<div>`
      this.isNonInputButProperElement(options.input)
    ) {
      /** Define our target element to dispatch events instead use the document active element */
      this.cachedTargetInput = options.input as HTMLInputElement;
      return;
    }

    this.cachedTargetInput = undefined;
  }

  /**
   * Handles beep sound
   */
  public static handleBeepSound(options: KeyboardOptions) {
    try {
      window.$System.beep(
        options.beepTone || PhysicalKeyboard.beepTone,
        options.beepTime || PhysicalKeyboard.beepTime,
      );
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Force define some event properties
   * This is more a hack for POS old browser.
   * May remove later with a modern browser to use KeyEvent constructor
   *
   * @param obj
   * @param prop
   * @param value
   */
  private defineProperty(obj: any, prop: string, value: any) {
    try {
      Object.defineProperty(obj, prop, {
        configurable: true,
        get() {
          if (prop === 'code') {
            return Number.parseInt(value, 10);
          }
          return value;
        },
      });
    } catch (_) {
      // do nothing
    }
  }

  /**
   * Creates synthetic key event
   *
   * @see [keyboardEvent](https://www.w3.org/TR/uievents/#dom-keyboardevent-initkeyboardevent)
   *
   * @param eventType Type of Event to dispatch
   * @param code Key code
   * @param keyName Key name
   * @returns A keyboard event to be dispatched
   */
  private createSyntheticKeyEvent(
    eventType: string,
    code: number,
    keyName: string,
  ): KeyboardHandlerEvent {
    /**
     * Create Keyboard event using old API compatible with POS Browser version
     */
    const event = document.createEvent('KeyboardEvent');

    /**
     * Hack event properties
     */
    this.defineProperty(event, 'key', keyName);
    this.defineProperty(event, 'code', code);

    /**
     * If key index belongs to the second index, infer that is from shift modifier
     */
    let shiftModifier;

    try {
      shiftModifier = keyMapTable[code].indexOf(keyName) > 0;
    } catch (_) {
      // do nothing
    }

    /**
     * initKeyboardEvent: method compatible with POS
     */
    event.initKeyboardEvent(
      eventType,
      true,
      true,
      window,
      keyName,
      0,
      false,
      false,
      shiftModifier,
      false,
    );

    return event;
  }

  /**
   * Detect if element defined the data-keyboard value
   *
   * @param element
   * @returns Return if the given element belongs to `input` element type
   */
  private hasDataKeyboard(element?: HTMLElement): boolean {
    return element ? 'keyboard' in element : false;
  }

  /**
   * Detect if element if DIV
   *
   * @param element Any bottom-level `HTMLElement` type
   * @returns Return if the given element belongs to `div` element type
   */
  private isNonInputButProperElement(element?: HTMLElement): boolean {
    return (
      // If it is non DOM Input element, but a `<div>`
      element instanceof HTMLDivElement &&
      // And it have the dataset `keyboard` defined to true;
      this.hasDataKeyboard(element)
    );
  }

  /**
   * Dispatch keyboard event to custom input or active document element
   */
  dispatchSyntheticKeybaordEvent(
    button: string,
    buttonType: ButtonType,
    allowPass?: boolean,
    e?: KeyboardHandlerEvent,
  ) {
    const options = this.getOptions();

    if (e) {
      /**
       * Calling preventDefault for the mousedown events keeps the focus on the input.
       * Its importante not stop event propagation in this stage.
       */
      e.preventDefault();
    }

    const targetElement =
      (document.activeElement as KeyboardInputOption) ||
      this.focusedDOMInput ||
      this.cachedTargetInput;

    /**
     * Our target element can be undefined on both sides, or not a valid element
     */
    if (
      !targetElement ||
      !(targetElement instanceof HTMLInputElement || targetElement instanceof HTMLDivElement)
    ) {
      return;
    }

    /** Determine if target element is focused */
    const isElementFocused = document.activeElement
      ? document.activeElement.contains(targetElement)
      : false;

    /**
     * Remove function button placeholder to keyName
     */
    if (buttonType === ButtonType.Function) {
      button = button.replace(anyBraces, '');
      button = `${button[0].toUpperCase()}${button.slice(1)}`;
    }

    /** Get the alpha code of a key of keyboard */
    const keyCode = Number(
      this.keyboardInstance.generalKeyboard.getTableKeyCode(
        button,
        buttonType === ButtonType.Standard,
      ),
    );

    /**
     * Make beep sound for the key press
     */
    if (options.soundEnabled === true) {
      PhysicalKeyboard.handleBeepSound(options);
    }

    /**
     * Update the element with the keyboard value
     */
    if (isElementFocused) {
      const input = this.keyboardInstance.getInput();
      /**
       * Check if the computed element is a different element than `input`, so we update using innerText
       */
      if (this.isNonInputButProperElement(targetElement)) {
        targetElement.innerText = input;
      } else if (isProperInput(targetElement)) {
        /**
         * Otherwise set the input value
         */
        (targetElement as HTMLInputElement).value = input;
      }
    }

    /**
     * Key code not found, abort send the event
     */
    if (!allowPass && (!keyCode || Number.isNaN(keyCode))) {
      if (options.debug) {
        console.log(`\u001b[1;31mCannot map "${button}" key name to its code\u001b[0m`);
      }
      return;
    }

    /**
     * Dispatch key and input events
     */
    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keydown', keyCode, button));
    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keypress', keyCode, button));

    if (isElementFocused) {
      /**
       * POS old browser do not support DOM InputEvent, so we send the same KeyEvent.
       */
      targetElement.dispatchEvent(this.createSyntheticKeyEvent('input', keyCode, button));
    }

    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keyup', keyCode, button));

    if (options.debug) {
      // Compact key event log
      console.log(
        `\x1B[36mKeyEvent ${JSON.stringify({
          eventType: ['keydown', 'keypress', 'input', 'keyup'],
          code: keyCode,
          key: button,
        })}\x1B[0m`,
      );
    }
  }
}

export default PhysicalKeyboard;

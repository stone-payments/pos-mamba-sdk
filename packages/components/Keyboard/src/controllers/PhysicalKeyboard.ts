import { KEYBOARD } from '@mamba/core';
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
import { bindMethods, isProperInput, isNonInputButProperElement } from '../helpers';
import keyMapTable from '../mappings/keyTableMap';
import { anyBraces } from '../common/regExps';
import { UIGeneralKeyboard } from './GeneralKeyboard';

/**
 * Responsible for handle keyboard towards physical device keys directly
 * Handle automatic screen focus
 * Send synthetic events to handle input post-processing (e.g. masks)
 * Keeps inputs synchronized
 */
class PhysicalKeyboard {
  private keyboardInstance!: Keyboard;

  /**
   * Cache target input from keyboard options to not use document active element.
   * This saves some performance to not compute every key press
   */
  private focusedDOMInput?: HTMLInputElement | null;

  public static beepTone = 'TONE3';

  public static beepTime = 90;

  private dispatchingEvent = false;

  svelteListener?: any;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the PhysicalKeyboard service
   */
  constructor({ getOptions, keyboardInstance }: PhysicalKeyboardParams) {
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
      document.addEventListener('focusin', this.handleDocumentFocusIn);
      /** Compute first interation. We need wait svelte render the active element, again... */
      setTimeout(() => {
        this.handleFocusIn(document.activeElement);
        this.shouldOnFocusUpdateCursorPosition(document.activeElement);
      });
    }
  }

  /**
   * Updates cursor worker cursor position when a event target input element gets its focus
   * @param event Event target
   */
  onFocusUpdateCursorPosition(event: FocusEvent): void {
    const { target } = event;
    setTimeout(() => {
      this.shouldOnFocusUpdateCursorPosition(target);
    }, 1);
  }

  /**
   * Try update cursor worker cursor position when a supposed input element gets its focus
   * @param element target focused element
   */
  shouldOnFocusUpdateCursorPosition(element?: any): void {
    // Set cursor worker cursor position of the early input focus cursor positions.
    if (element && isProperInput(element)) {
      const input = element as HTMLInputElement;

      this.keyboardInstance.cursorWorker?.setCursorPosition(
        input.selectionStart,
        input.selectionEnd,
        false,
        input,
      );

      if (this.getOptions().debug) {
        console.log(
          `Updating cursor position for the new focus element with ${input.selectionStart} ${input.selectionEnd}`,
        );
      }
    }
  }

  /**
   * Handle document global focus in target
   * @param event The Document event
   */
  handleDocumentFocusIn(event: FocusEvent) {
    this.handleFocusIn(document.activeElement || event.target || undefined, event);
  }

  /**
   * Handles any focus element
   *
   * @param target The Event target
   * @param e The Focus event
   */
  handleFocusIn(target?: EventTarget | Element | null, e?: FocusEvent): void {
    if (e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }

    if (!__POS__ && e) {
      let avoidExternals = false;
      try {
        const path = e.composedPath();
        /** We need avoid other inputs on the simulator page, like panel inputs */
        avoidExternals = !path.some(
          (id: EventTarget) =>
            (id as Element).className && (id as Element).className.includes('mamba-app'),
        );
      } catch (_) {
        console.error(
          'Failed to get composedPath() from mamba simulator. Update you browser to newer version.',
          e,
        );
      }

      if (avoidExternals) return;
    }

    /**
     * Handle focused target
     */
    if (target && isProperInput(target)) {
      const input = target as HTMLInputElement;

      /**
       * Set keyboard visibility
       */
      if (this.keyboardInstance.isRenderAllowed === true) {
        this.keyboardInstance.visibility = KeyboardVisibility.Visible;

        /**
         * If the keepVisible option is on and user hit some button without input focus, we need ensure that virtual input do not update its values back to the DOM input on next update.
         */
        this.updateVirtualInputfromDOMValue(input);

        /**
         * Add listeners on focused input
         */
        this.addDOMInputEventListeners(input);

        /**
         * Update cursor of focused input if the cursor
         */
        this.shouldOnFocusUpdateCursorPosition(input);

        /**
         * Handle focused input data set
         */
        this.keyboardInstance.handleDOMInputDataset();

        return;
      }

      this.removeDOMInputEventListeners();
    }
  }

  /**
   * Update virtual value from real one.
   * @param input HTML <input> focused
   */
  updateVirtualInputfromDOMValue(input: HTMLInputElement) {
    if (this.dispatchingEvent) return;
    const options = this.getOptions();
    if (this.keyboardInstance.getInput() !== input.value && !options.input) {
      const { value } = input;
      /**
       * Get and set value from input component...
       */
      this.keyboardInstance.setInput(value);
    }
  }

  /**
   * Handles input on blur
   *
   * @param e
   */
  handleDOMInputTargetBlur(e?: FocusEvent) {
    if (this.dispatchingEvent) return;
    this.keyboardInstance.visibility = KeyboardVisibility.Hidden;
    if (e && e.target && isProperInput(e.target)) {
      const input = e.target as HTMLInputElement;
      this.updateVirtualInputfromDOMValue(input);
      this.removeDOMInputEventListeners();
    }
  }

  /**
   * Remove input target event listeners.
   */
  removeDOMInputEventListeners() {
    if (!this.focusedDOMInput) return;

    this.focusedDOMInput.removeEventListener('input', this.handleDOMInputChange);
    this.focusedDOMInput.removeEventListener('click', this.handleDOMInputFocus);
    this.focusedDOMInput.removeEventListener('blur', this.handleDOMInputTargetBlur);
    this.focusedDOMInput.removeEventListener('focus', this.onFocusUpdateCursorPosition);

    /**
     * Cancel svelte component listener. https://v2.svelte.dev/guide#component-on-eventname-callback-
     */
    try {
      this.svelteListener.cancel();
    } catch (_) {
      // do nothing
    }

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
    input.addEventListener('focus', this.onFocusUpdateCursorPosition);

    this.focusedDOMInput = input;

    /**
     * Hack svelte component `on:destroy` for routless flow(e.g. payment state)
     */
    setTimeout(() => {
      try {
        // The `input.instance` have only on @mamba/input components
        this.svelteListener = input.instance.on('destroy', this.removeDOMInputEventListeners);
      } catch (_) {
        // do nothing
      }
    });
  }

  /**
   * Clear input listeners for keyboard route reset.
   */
  clearInputListeners() {
    this.removeDOMInputEventListeners();
  }

  /**
   * Remove any input listeners, for life-cycle destroy
   */
  destroy() {
    document.removeEventListener('focusin', this.handleDocumentFocusIn);
    this.clearInputListeners();
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
    setTimeout(() => {
      const target = event.target || undefined;
      if (target && isProperInput(target)) {
        const input = target as HTMLInputElement;
        this.updateVirtualInputfromDOMValue(input);
      }
    });
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
   * Dispatch keyboard event to custom input or active document element
   * @param button The button key value
   * @param buttonType The button type
   * @param allowPass If the key is allowed to trigger the synthetic event
   * @param e Keyboard event if any
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
       * Its importante not stop event default behavior in this stage.
       */
      e.preventDefault();
    }

    const targetElement = (document.activeElement as KeyboardInputOption) || this.focusedDOMInput;

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
      UIGeneralKeyboard.getTableKeyCode(button, buttonType === ButtonType.Standard),
    );

    this.dispatchingEvent = true;

    /**
     * Update the element with the keyboard value
     */
    if (isElementFocused && keyCode !== KEYBOARD.ENTER) {
      const input = this.keyboardInstance.getInput();
      /**
       * Check if the computed element is a different element than `input`, so we update using innerText
       */
      if (isNonInputButProperElement(targetElement)) {
        targetElement.innerText = input;
      } else if (isProperInput(targetElement)) {
        /**
         * Otherwise set the input value
         */
        const targetDOMInput = targetElement as HTMLInputElement;

        targetDOMInput.value = input;

        if (!options.lockCursor) {
          // Modifying input value, make its cursor moves to the end,
          // so we need to update to the last value it was.
          this.keyboardInstance.cursorWorker.updateCursorPos(0, false, true, targetDOMInput);
        }
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

    if (isElementFocused) {
      /**
       * POS old browser do not support DOM InputEvent, so we send the same KeyEvent.
       */
      targetElement.dispatchEvent(this.createSyntheticKeyEvent('input', keyCode, button));
    }

    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keyup', keyCode, button));
    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keypress', keyCode, button));

    this.dispatchingEvent = false;

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

import {
  KeyboardOptions,
  KeyboardHandlerEvent,
  PhysicalKeyboardParams,
  KeyboardInputOption,
  KeyboardUpdateMode,
  ButtonType,
  KeyboardVisibility,
} from '../types';
import type Keyboard from '../components/Keyboard';
import type { UIGeneralKeyboard } from './GeneralKeyboard';
import GeneralKeyboard from './GeneralKeyboard';
import { bindMethods } from '../helpers';
import alphabetKeyMap from '../mappings/alphabetKeyMap';
import { anyBraces } from '../common/regExps';

/**
 * Responsible for handle alphabet keyboard on physical device keys directly
 */
class UIPhysicalKeyboard {
  private generalKeyboard!: UIGeneralKeyboard;

  private keyboardInstance!: Keyboard;

  public static instance: UIPhysicalKeyboard;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the UIPhysicalKeyboard service
   */
  private constructor({ getOptions, keyboardInstance }: PhysicalKeyboardParams) {
    this.generalKeyboard = GeneralKeyboard;
    /**
     * @type {object} A mamba-keyboard instance
     */

    this.getOptions = getOptions;
    this.keyboardInstance = keyboardInstance;

    /**
     * Bindings
     */
    bindMethods(UIPhysicalKeyboard, this);

    /**
     * Register element focus changes for automatic mode only
     */
    if (this.getOptions().updateMode === KeyboardUpdateMode.Auto) {
      /** Add before focus event */
      document.addEventListener('focusin', (e) => this.handleFocusIn(e.target || undefined), true);
      /** Compute first interation */
      this.handleFocusIn(document.activeElement);
    }
  }

  /**
   * Handles input on blur
   *
   * @param e
   */
  handleInputTargetBlur(e?: any) {
    this.keyboardInstance.visibility = KeyboardVisibility.Hidden;
    if (e && e.target && this.isProperInput(e.target)) {
      e.target.removeEventListener('input', this.handleDOMInputChange);
      e.target.removeEventListener('blur', this.handleInputTargetBlur);
    }
  }

  /**
   * Handles any focus element
   *
   * @param e
   */
  handleFocusIn(target?: EventTarget | Element | null) {
    if (target && this.isProperInput(target)) {
      this.keyboardInstance.visibility = KeyboardVisibility.Visible;
      target.addEventListener('input', this.handleDOMInputChange);
      target.addEventListener('blur', this.handleInputTargetBlur);
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
   * Get physical keyboard instance
   * @param params Keyboard options. Same of {@link KeyboardOptions}
   * @param params.getOptions Function that instance call to retrieve keyboard properties
   * @returns `UIPhysicalKeyboard` instance
   */
  public static getInstance({
    getOptions,
    keyboardInstance,
  }: PhysicalKeyboardParams): UIPhysicalKeyboard {
    if (!UIPhysicalKeyboard.instance) {
      UIPhysicalKeyboard.instance = new UIPhysicalKeyboard({ getOptions, keyboardInstance });
    }

    return UIPhysicalKeyboard.instance;
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
   * @param event Native/origina event pointer
   * @param code Key code
   * @param keyName Key name
   * @returns A keyboard event to be dispatched
   */
  private createSyntheticKeyEvent(
    eventType: string,
    code: number,
    keyName: string,
  ): KeyboardHandlerEvent {
    const options = this.getOptions();
    /**
     * Create Keyboard event using old API compatible with POS Browser version
     */
    const event = document.createEvent('KeyboardEvent');

    /**
     * Hack event properties
     */
    this.defineProperty(event, 'key', keyName);
    this.defineProperty(event, 'code', code);

    const shiftModifier = alphabetKeyMap[code].indexOf(keyName) > 0;

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

    if (options.debug) {
      console.log(
        `KeyEvent ${JSON.stringify({
          eventType,
          code,
          key: keyName,
        })}`,
        event,
      );
    }

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
   * Detect if element if INPUT type
   *
   * @param element Any bottom-level `HTMLElement` type
   * @returns Return if the given element belongs to `input` element type
   */
  private isProperInput(element?: HTMLElement | EventTarget): boolean {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
  }

  /**
   * Dispatch keyboard event to custom input or active document element
   */
  dispatchSyntheticKeybaordEvent(button: string, buttonType: ButtonType, e?: KeyboardHandlerEvent) {
    const options = this.getOptions();

    if (e) {
      /**
       *  Calling preventDefault for the mousedown events keeps the focus on the input.
       * Its importante not stop event propagation in this stage.
       */
      e.preventDefault();
    }

    let targetElement = document.activeElement as KeyboardInputOption;

    if (
      // If user setup the input property element compatible with DOM Input element
      this.isProperInput(options.input) ||
      // Or it is non DOM Input element, but a `<div>`
      this.isNonInputButProperElement(options.input)
    ) {
      /** Define our target element to dispatch events instead use the document active element */
      targetElement = options.input;
    }

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
     * Convert layout button to keyName
     */
    if (buttonType === ButtonType.Function) {
      button = button.replace(anyBraces, '');
      button = `${button[0].toUpperCase()}${button.slice(1)}`;
    }

    /** Get the alpha code of a key of keyboard */
    const keyCode = this.generalKeyboard.getAlphabetKeyCode(button);

    /**
     * Some key cannot be mapped
     */
    if (!keyCode) {
      if (options.debug) {
        console.log(`Cannot map "${keyCode}" from getAlphabetKeyCode("${button}")`);
      }
      return;
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
      } else if (this.isProperInput(targetElement)) {
        /**
         * Otherwise set the input value
         */
        (targetElement as HTMLInputElement).value = input;
      }
    }

    /**
     * Dispatch key and input events
     */
    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keydown', keyCode, button));
    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keypress', keyCode, button));

    if (isElementFocused) {
      targetElement.dispatchEvent(this.createSyntheticKeyEvent('input', keyCode, button));
    }

    targetElement.dispatchEvent(this.createSyntheticKeyEvent('keyup', keyCode, button));
  }
}

/**
 * Export only type
 */
export type { UIPhysicalKeyboard };

/**
 * Create or get Physical Keyboard instance
 */
const CreatePhysicalKeyboard = ({
  getOptions,
  keyboardInstance,
}: PhysicalKeyboardParams): UIPhysicalKeyboard => {
  return UIPhysicalKeyboard.getInstance({ getOptions, keyboardInstance });
};

export default CreatePhysicalKeyboard;

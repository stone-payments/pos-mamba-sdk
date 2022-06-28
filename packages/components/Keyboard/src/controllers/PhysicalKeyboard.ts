import {
  KeyboardOptions,
  KeyboardHandlerEvent,
  PhysicalKeyboardParams,
  KeyboardInputOption,
  KeyboardUpdateMode,
} from '../types';
import type Keyboard from '../components/Keyboard';
import type { UIGeneralKeyboard } from './GeneralKeyboard';
import GeneralKeyboard from './GeneralKeyboard';
import { bindMethods } from '../helpers';
import alphabetKeyModifiers from '../mappings/alphabetKeyModifiers';
import SyntheticKeyEvent from './SyntheticKeyEvent';

/**
 * Responsible for the output of physical keys
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
      document.addEventListener('focusin', (e) => this.handleFocusIn(e), true);
    }
  }

  /**
   * Handles any focus element
   *
   * @param e
   */
  handleFocusIn(e?: FocusEvent) {
    if (e) {
      if (e.target && this.isProperInput(e.target)) {
        e.target.addEventListener('input', this.handleDOMInputChange);
      }
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

  private defineProperty(obj: any, prop: string, value: any) {
    try {
      Object.defineProperty(obj, prop, {
        configurable: true,
        get() {
          return value;
        },
      });
    } catch (_) {
      if (__DEV__) console.log(`defineProperty failed on ${prop}`);
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
    code?: number | undefined,
    keyName?: string,
  ): KeyboardHandlerEvent {
    const options = this.getOptions();

    let event;

    const { shift = false } = alphabetKeyModifiers[keyName || ''] || {};

    // try {
    // eslint-disable-next-line prefer-const
    event = document.createEvent('KeyboardEvent');

    event.initKeyboardEvent(eventType, true, true, window, keyName, 0, false, false, shift, false);

    // if (__SIMULATOR__) {
    this.defineProperty(event, 'keyCode', code);
    this.defineProperty(event, 'which', code);
    this.defineProperty(event, 'charCode', code);
    this.defineProperty(event, 'key', keyName);
    // }

    const syntheticEvent = new SyntheticKeyEvent();
    console.log(syntheticEvent);

    /* } catch (_) {
      event = new KeyboardEvent(eventType, {
        bubbles: true,
        cancelable: true,
        key: keyName,
        charCode: code,
        keyCode: code,
        which: code,
      });
    } */

    if (options.debug) {
      console.log(
        `SyntheticKeyEvent created ${JSON.stringify({
          eventType,
          options: {
            bubbles: true,
            cancelable: true,
            key: keyName,
            charCode: code,
            keyCode: code,
            which: code,
          },
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
  dispatchSyntheticKeybaordEvent(button: string, e?: KeyboardHandlerEvent) {
    const options = this.getOptions();

    if (e) {
      /**
       *  Calling preventDefault for the mousedown events keeps the focus on the input.
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

/* eslint-disable no-unused-vars */
import type Keyboard from './components/Keyboard';

export interface KeyboardLayoutObject {
  [key: string]: string[];
}

export type KeyboardButtonTheme = {
  class: string;
  buttons: string;
} | null;

export interface KeyboardInput {
  default: string;
}

export type CaretPosition = number | null;

export type KeyboardElement = HTMLDivElement | HTMLButtonElement | HTMLSpanElement;
export type KeyboardInputOption = HTMLInputElement | HTMLDivElement | HTMLElement | undefined;
export type KeyboardHandlerEvent = KeyboardEvent | MouseEvent | PointerEvent | UIEvent | Event;

export interface KeyboardButtonElements {
  [key: string]: KeyboardElement[];
}

export enum KeyboardUpdateMode {
  Auto = 'auto',
  Manual = 'manual',
}

export enum ButtonType {
  Standard = 'standard-btn',
  Function = 'function-btn',
}

export enum KeyboardType {
  Default = 'default',
  Numeric = 'numeric',
  Email = 'email',
  Phone = 'phone',
  Custom = 'custom',
}

export interface KeyboardTypeEvents {
  /**
   * Executes the callback function every time mamba keyboard is rendered (e.g: when you change layouts).
   */
  onRender?: (instance: Keyboard) => void;

  /**
   * Executes the callback function once mamba keyboard is rendered for the first time (on initialization).
   */
  onInit?: (instance: Keyboard) => void;

  /**
   * Retrieves the current input
   */
  onChange?: (input: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Executes the callback function on any key press. Returns button layout name (i.e.: “{enter}”, "b", "c", "2" ).
   */
  onKeyPress?: (button: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Execute the callback function on keypress of non-standard type only (functionality type i.e.: “{alt}”).
   */
  onFunctionKeyPress?: (button: string, instance: Keyboard, e?: KeyboardHandlerEvent) => void;
}

export interface KeyboardTypeOptions {
  /**
   * Specifies which keyboard type should be used out of the box. Default `KeyboardType.Default`
   */
  keyboardType?: KeyboardType;

  /**
   * Specifies a custom keyboard layout to be used. This should be used in addition to `keyboardType` setted to 'KeyboardType.Custom'
   */
  layout?: KeyboardLayoutObject;

  /**
   * Specifies which layout should be used inside the "layout" option, useful to handle function keys (e.g. "{shift}")". This should be used in addition to `keyboardType` setted to 'KeyboardType.Custom'. Initial layout also can be defined here.
   */
  layoutName?: string;

  /**
   * A prop to add your own css classes to the keyboard wrapper.
   * You can add multiple classes separated by a space.
   */
  theme?: string;
}

type FunctionKeyPressType = Pick<KeyboardTypeEvents, 'onFunctionKeyPress'>;

export type KeyboardTypesPredefinedOptions = Readonly<
  NonNullable<Required<KeyboardTypeOptions>> & FunctionKeyPressType
>;

export interface KeyboardOptions extends KeyboardTypeOptions, KeyboardTypeEvents {
  /**
   * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
   */
  labels?: { [button: string]: string };

  /**
   * Change the CSS class to add to the button when it gets active by click.
   */
  activeButtonClass?: string;

  /**
   * Runs a `console.log` every time a key is pressed. Shows the buttons pressed and the current input.
   */
  debug?: boolean;

  /**
   * `number`: Restrains mamba keyboard input to a certain length.
   */
  maxLength?: any;

  /**
   * A prop to ensure characters are always be added/removed at the end of the string.
   */
  disableCaretPositioning?: boolean;

  /**
   * Restrains input(s) change to the defined regular expression pattern.
   */
  inputPattern?: any;

  /**
   * Exclude specific buttons from layout
   */
  excludeFromLayout?: { [key: string]: string[] };

  /**
   * Points key events to a customizable input element, instead of using document active element.
   * You can type and directly display the value in a `div` element setted with `data-keyboard="true" property`, so keyboard will insert its value to the element `innerText`.
   */
  input?: KeyboardInputOption;

  /**
   * Specifies if keyboard should operate automatic or manually.
   * - In automatic(`auto`) mode, it will try handle input key press value on focused elements. (Default)
   * - In manually(`manual`) mode, it will leave the changes to you handle outside, using {@link KeyboardTypeEvents.onChange} event along with `oninput` DOM event.
   * @example
   * ```js
   * function onChange(input, e) {
   *   inputComponent.set({ value: input });
   * }
   *
   * const keyboard = new Keyboard({
   *  onChange: input => this.onChange(input),
   * });
   * // Update virtual keyboard input when the real one updates directly
   * inputDOMElement.addEventListener('input', event => {
   *   keyboard.setInput(event.target.value);
   * });
   *
   * ```
   */
  updateMode?: KeyboardUpdateMode;

  /**
   * Other options created privately
   */
  [name: string]: any;
}

export interface KeyboardControllerParams {
  getOptions: () => KeyboardOptions;
  keyboardInstance: Keyboard;
}

export type CaretWorkerParams = KeyboardControllerParams;
export type PhysicalKeyboardParams = KeyboardControllerParams;
export type TouchKeyboardParams = KeyboardControllerParams;

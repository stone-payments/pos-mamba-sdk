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

/**
 * Keyboard update mode
 * @enum
 */
export enum KeyboardUpdateMode {
  Auto = 'auto',
  Manual = 'manual',
}

/**
 * Layout button type
 * @enum
 */
export enum ButtonType {
  Standard = 'standard-btn',
  Function = 'function-btn',
}

/**
 * Keyboard visibility
 * @enum
 */
export enum KeyboardVisibility {
  Hidden = 'hidden',
  Visible = 'visible',
}

/**
 * Layout row direction
 * @enum
 */
export enum LayoutDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/**
 * Keyboard type
 * @enum
 */
export enum KeyboardType {
  Default = 'default',
  Numeric = 'numeric',
  Email = 'email',
  Phone = 'phone',
  Math = 'math',
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
   * Specifies which keyboard type should be used out of the box.
   * @defaultValue {@link KeyboardType.Default}
   */
  keyboardType?: KeyboardType;

  /**
   * Specifies a custom keyboard layout to be used. This should be used in addition to {@link KeyboardType} setted to {@link KeyboardType.Custom}
   */
  layout?: KeyboardLayoutObject;

  /**
   * Specifies which layout should be used inside the "layout" option, useful to handle function keys (e.g. "{shift}")". This should be used in addition to {@link KeyboardType} setted to {@link KeyboardType.Custom}. Initial layout also can be defined here.
   */
  layoutName?: string;

  /**
   * Specifies which direction layout should render. Horizontaly or Verticaly.
   * @defaultValue {@link LayoutDirection.Horizontal}
   */
  layoutDirection?: LayoutDirection;

  /**
   * A prop to add your own css classes to the keyboard wrapper.
   * You can add multiple classes separated by a space.
   */
  theme?: string;
}

export interface KeyboardOptions extends KeyboardTypeOptions, KeyboardTypeEvents {
  /**
   * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
   */
  labels?: { [button: string]: string };

  /**
   * Converts button output value (such as `{check}`) to standard keyboard output (e.g.: `enter`).
   */
  outputs?: { [button: string]: string };

  /**
   * Change the CSS class to add to the button when it gets active by click.
   */
  activeButtonClass?: string;

  /**
   * Customize the CSS class to handle keyboard hidden events.
   *
   */
  hiddenKeyboardClass?: string;

  /**
   * Shows aditional debug information.
   * Runs a `console.log` every time a key is pressed.
   * Shows the buttons pressed and the current input.
   * Add `debug` class to main keyboard wrapper
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
  inputPattern?: RegExp;

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
   * - In automatic({@link KeyboardUpdateMode.Auto}) mode, it will try handle input key press value on focused elements.
   *
   * - In manually({@link KeyboardUpdateMode.Manual}) mode, it will leave the changes to you handle outside, using {@link KeyboardTypeEvents.onChange} event along with `oninput` DOM event.
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
   *
   * @defaultValue {@link KeyboardUpdateMode.Auto}
   */
  updateMode?: KeyboardUpdateMode;

  /**
   * Keep keyboard visible (dont hide when input loose focus)
   *
   * @defaultValue `false`
   */
  keepVisible?: boolean;

  /**
   * Keep input cursor at its ends
   *
   * @defaultValue `false`
   */
  lockCursor?: boolean;

  /**
   * Other options can exist
   */
  [name: string]: any;
}

type FunctionKeyPressType = Pick<KeyboardTypeEvents, 'onFunctionKeyPress'>;
type LabelsOptionType = Pick<KeyboardOptions, 'labels' | 'outputs'>;

export type KeyboardTypesPredefinedOptions = Readonly<
  NonNullable<Required<KeyboardTypeOptions>> & FunctionKeyPressType & LabelsOptionType
>;

export interface KeyboardControllerParams {
  getOptions: () => KeyboardOptions;
  keyboardInstance: Keyboard;
}

export type CaretWorkerParams = KeyboardControllerParams;
export type PhysicalKeyboardParams = KeyboardControllerParams;
export type TouchKeyboardParams = KeyboardControllerParams;

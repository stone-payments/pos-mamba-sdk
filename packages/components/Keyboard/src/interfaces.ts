/* eslint-disable no-unused-vars */
import MambaKeyboard from './components/Keyboard';

export interface KeyboardLayoutObject {
  [key: string]: string[];
}

export type KeyboardButtonTheme = {
  class: string;
  buttons: string;
} | null;

export interface KeyboardInput {
  [key: string]: string;
}

export type KeyboardElement = HTMLDivElement | HTMLButtonElement;
export type KeyboardHandlerEvent = any;

export interface KeyboardButtonElements {
  [key: string]: KeyboardElement[];
}

export interface KeyboardOptions {
  /**
   * Modify the keyboard layout.
   */
  layout?: KeyboardLayoutObject;

  /**
   * Specifies which layout should be used.
   */
  layoutName?: string;

  /**
   * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
   */
  labels?: { [button: string]: string };

  /**
   * A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
   */
  theme?: string;

  /**
   * A prop to add your own css classes to one or several buttons.
   */
  buttonTheme?: KeyboardButtonTheme[];

  /**
   * Runs a `console.log` every time a key is pressed. Shows the buttons pressed and the current input.
   */
  debug?: boolean;

  /**
   * Allows you to use a single mamba-keyboard instance for several inputs.
   */
  inputName?: string;

  /**
   * `number`: Restrains all of mamba-keyboard inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
   *
   * `{ [inputName: string]: number }`: Restrains mamba-keyboard’s individual inputs to a certain length. This should be used in addition to the input element’s maxlengthattribute.
   */
  maxLength?: any;

  /**
   * Calling preventDefault for the mousedown events keeps the focus on the input.
   */
  preventMouseDownDefault?: boolean;

  /**
   * Calling preventDefault for the mouseup events.
   */
  preventMouseUpDefault?: boolean;

  /**
   * Stops pointer down events on mamba-keyboard buttons from bubbling to parent elements.
   */
  stopMouseDownPropagation?: boolean;

  /**
   * Stops pointer up events on mamba-keyboard buttons from bubbling to parent elements.
   */
  stopMouseUpPropagation?: boolean;

  /**
   * A prop to ensure characters are always be added/removed at the end of the string.
   */
  disableCaretPositioning?: boolean;

  /**
   * Restrains input(s) change to the defined regular expression pattern.
   */
  inputPattern?: any;

  /**
   * Disable button hold action.
   */
  disableButtonHold?: boolean;

  /**
   * Exclude buttons from layout
   */
  excludeFromLayout?: { [key: string]: string[] };

  /**
   * Executes the callback function every time mamba-keyboard is rendered (e.g: when you change layouts).
   */
  onRender?: (instance?: MambaKeyboard) => void;

  /**
   * Executes the callback function once mamba-keyboard is rendered for the first time (on initialization).
   */
  onCreate?: (instance?: MambaKeyboard) => void;

  /**
   * Retrieves the current input
   */
  onChange?: (input: string, e?: MouseEvent) => any;

  /**
   * Retrieves all inputs
   */
  onChangeAll?: (inputObj: KeyboardInput, e?: MouseEvent) => any;

  /**
   * Other options created privately
   */
  [name: string]: any;
}

export interface UtilitiesParams {
  getOptions: () => KeyboardOptions;
  getCaretPosition: () => number | null;
  getCaretPositionEnd: () => number | null;
  dispatch: any;
}

export interface PhysicalKeyboardParams {
  getOptions: () => KeyboardOptions;
  dispatch: any;
}

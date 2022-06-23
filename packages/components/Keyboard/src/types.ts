/* eslint-disable no-unused-vars */
import Keyboard from './components/Keyboard';

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

export type KeyboardElement = HTMLDivElement | HTMLButtonElement;
export type KeyboardHandlerEvent = any;

export interface KeyboardButtonElements {
  [key: string]: KeyboardElement[];
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
}

export interface KeyboardOptions {
  /**
   * Modify the keyboard layout.
   */
  layout?: KeyboardLayoutObject;

  /**
   * Specifies which keyboard type should be used out of the box.
   */
  keyboardType?: KeyboardType;

  /**
   * Specifies which keyboard type should be used. This should be used in addition to `keyboardType` setted to 'custom'
   */
  layoutName?: string;

  /**
   * Replaces variable buttons (such as `{bksp}`) with a human-friendly name (e.g.: `backspace`).
   */
  labels?: { [button: string]: string };

  /**
   * A prop to add your own css classes to the keyboard wrapper.
   * You can add multiple classes separated by a space.
   */
  theme?: string;

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
   * Executes the callback function every time mamba-keyboard is rendered (e.g: when you change layouts).
   */
  onRender?: (instance: Keyboard) => void;

  /**
   * Executes the callback function once mamba-keyboard is rendered for the first time (on initialization).
   */
  onCreate?: (instance: Keyboard) => void;

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

export interface CaretWorkerParams {
  getOptions: () => KeyboardOptions;
  keyboardInstance: Keyboard;
}

export type CaretPosition = number | null;

export interface PhysicalKeyboardParams {
  getOptions: () => KeyboardOptions;
}

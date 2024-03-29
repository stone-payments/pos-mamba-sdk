/* eslint-disable no-unused-vars */
import type Keyboard from './Keyboard';

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

export type CursorPosition = number | null;
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
 * Layout button enum
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
  Fixed = 'fixed',
}

/**
 * Keyboard enum
 * @enum
 */
export enum KeyboardType {
  Default = 'default',
  Numeric = 'numeric',
  Phone = 'phone',
  Math = 'math',
  Custom = 'custom',
}

/**
 * Keyboard theme variation
 * @enum
 */
export enum KeyboardThemeVariation {
  Large = 'large', // For large screens and high DPI without zoom
  Default = 'default', // Default variation for general purpose
  Compact = 'compact', // Reduced spaces and height
  UltraSmall = 'ultra-small', // For very small screens
}

/**
 * Beep tone enum
 * @enum
 */
export enum BeepTone {
  TONE_1 = 'TONE1',
  TONE_2 = 'TONE2',
  TONE_3 = 'TONE3',
  TONE_4 = 'TONE4',
  TONE_5 = 'TONE5',
  TONE_6 = 'TONE6',
  TONE_7 = 'TONE7',
}
type FunctionKeyPressCallback = (
  button: string,
  instance: Keyboard,
  e?: KeyboardHandlerEvent,
) => void;

/**
 * KeyboardTypeEvents
 */
export interface KeyboardTypeEvents {
  /**
   * Executes thae callback function when virtual keyboard rendered by the first time.
   * @event
   */
  beforeFirstRender?: (instance: Keyboard) => void;

  /**
   * Executes a callback function before a virtual keyboard render.
   * @event
   */
  beforeRender?: (beforeRender: Keyboard) => void;

  /**
   * Executes a callback function every time virtual keyboard is rendered (e.g: when you change layouts).
   * @event
   */
  onRender?: (instance: Keyboard) => void;

  /**
   * Executes a callback function once virtual keyboard is rendered for the first time (on initialization).
   * @event
   */
  onInit?: (instance: Keyboard) => void;

  /**
   * Retrieves the current input
   * @event
   */
  onChange?: (input: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Executes a callback function on any key press of virtual keyboard. Returns button layout name (i.e.: “{enter}”, "b", "c", "2" ).
   * @event
   */
  onKeyPress?: (button: string, e?: KeyboardHandlerEvent) => void;

  /**
   * Execute a callback function on keypress of non-standard type only (functionality type i.e.: “{alt}”) of virtual keyboard.
   * @event
   */
  onFunctionKeyPress?: FunctionKeyPressCallback;

  /**
   * Execute a callback function on keypress of standard type only (type i.e.: “a”, “k”, “5”) of virtual keyboard.
   * @event
   */
  onStandardKeyPress?: FunctionKeyPressCallback;
}

export interface PrefabKeyboardEvents {
  /**
   * Execute the callback function on keypress of non-standard type only (functionality type i.e.: “{alt}”).
   * @event
   */
  internalOnFunctionKeyPress?: FunctionKeyPressCallback;
}

/**
 * Keyboard layout options
 */
export interface KeyboardTypeOptions {
  /**
   * Specifies which keyboard type should be used out of the box.
   * Also can enforce by define dataset `<input data-keyboard-type="<type>" />`
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
   * Specifies which direction layout should render. Horizontaly, Verticaly or Fixed.
   * - {@link LayoutDirection.Horizontal}, layout will render from left to right axis (row flow)
   * - {@link LayoutDirection.Vertical}, layout will render from top to bottom axis (column flow)
   * - {@link LayoutDirection.Fixed}, layout will render in fixed grid mode. This mode helps draw layout like `space-evenly` on POS. But not support flexible arrange.
   * @defaultValue {@link LayoutDirection.Horizontal}
   */
  layoutDirection?: LayoutDirection;

  /**
   * A prop to add your own css classes to the keyboard wrapper.
   * You can add multiple classes separated by a space.
   * Prefab keyboards have their own themes... set this property will remove its theme.
   */
  theme?: string;
}

/**
 * Keyboard options
 */
export interface KeyboardOptions extends KeyboardTypeOptions, KeyboardTypeEvents {
  /**
   * Defines a class modifier to work with theme variations.
   * You can use some pre-variations of {@link KeyboardThemeVariation} or add your own css class, that can have multiple classes separated by space. Strings will be transformed to kebab-case automatically.
   *
   * The class its self will be the concatenation of keyboard slug with two dashes. eg.: `mb-variation--compact`, `mb-variation--my-class`
   */
  themeVariation?: KeyboardThemeVariation | string;

  /**
   * Replaces variable buttons (such as `{backspace}`) with a human-friendly name (e.g.: `backspace`).
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
   * If input is readonly(or static `div` element as input), keyboard will disable cursor event handlers since it won't be necessary.
   *
   * This property do not change or include <input> readonly attribute
   */
  readonly?: boolean;

  /**
   * Tells keyboard which value it should use at input start position after key press input change. Like a currency placeholder.
   * Only works if the {@link updateMode} are on mode {@link KeyboardUpdateMode.Auto}.
   */
  lastValue?: string;

  /**
   * Tells keyboard if it should get or set number values only.
   * If some cases you dont want capture formatted values to internal keyboard virtual input, this props cleans the input work to number, to able to be formatted back again.
   * Useful for fields with formatting that happen after key events.
   */
  filtersNumbersOnly?: boolean;

  /**
   * Optionally set a condition for the virtual keyboard to render or work.
   * Its instance will be destroyed if exist.
   * Can be a Boolean or a function that do something and return a boolean.
   * This property change keybpard visibility and stop its events and actions too.
   */
  renderCondition?: boolean | (() => boolean);

  /**
   * Enabled or disables keyboard events and actions.
   * This property do not change keybpard visibility.
   */
  disabled?: boolean;

  /**
   * A prop to ensure characters are always be added/removed at the end of the string.
   */
  disableCursorPositioning?: boolean;

  /**
   * Restrains input(s) change to the defined regular expression pattern.
   */
  inputPattern?: RegExp;

  /**
   * Exclude specific buttons from each layout
   * @example
   *
   * ```js
   * excludeFromLayout: {
   *   default: ['a'],
   *   shift: ['B'],
   * }
   * ```
   */
  excludeFromLayout?: { [layoutName: string]: string[] };

  /**
   * Include specific function buttons to go through synthetic event dispatch.
   * This is useful to send key press of function keys to the input event handler, like math keys.
   *
   * The key code will be resolved by String.charcode if it's not already mapped. (only for single char)
   * @example
   * ```js
   * {
   *   ...
   *   // These keys will not display on input but send input events without braces
   *   // (e.g. KeyboardEvent({ key: "+", code: 107 }))
   *   allowKeySyntheticEvent: ['{+}', '{-}', '{*}', '{≠}'],
   * }
   * ```
   */
  allowKeySyntheticEvent?: string[];

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
   * If  should render keyboard when it's instance creates
   * Call `render()` method to show the keyboard
   * @defaultValue `true`
   */
  autoRender?: boolean;

  /**
   * Make beep sound for every key press.
   * ! This do not disable POS sound entirely. Only for this Keyboard instance
   * @defaultValue System preference depending of the app, otherwise `false`
   */
  soundEnabled?: boolean;

  /**
   * Define keyboard beep tone
   *
   * @defaultValue {@link BeepTone.TONE_3}
   */
  beepTone?: BeepTone;

  /**
   * Define keyboard beep time
   *
   * @defaultValue `90`
   */
  beepTime?: number;

  /**
   * Enable or disables key suggestions
   * @defaultValue `true`
   */
  enableLayoutSuggestions?: boolean;

  /**
   * Character suggestions for especial and exotic keys
   * Define it was tuple it max of four optional words
   * Some prefab keyboard already have some latin words
   * @see [Default Suggestions](./mappings/defaultSuggestions.ts)
   */
  layoutSuggestions?: { [key: string]: [string?, string?, string?, string?] };

  /**
   * Other options can exist
   */
  [name: string]: any;
}

type LabelsOptionType = Pick<
  KeyboardOptions,
  'labels' | 'outputs' | 'layoutSuggestions' | 'enableLayoutSuggestions' | 'allowKeySyntheticEvent'
>;

export type KeyboardTypesPredefinedOptions = Readonly<
  (NonNullable<Required<KeyboardTypeOptions>> & LabelsOptionType) & PrefabKeyboardEvents
>;

export interface KeyboardControllerParams {
  getOptions: () => KeyboardOptions;
  keyboardInstance: Keyboard;
}

export type onSuggestionSelect = (
  button: string,
  candidate: string,
  e?: KeyboardHandlerEvent,
) => void;

export type CursorWorkerParams = KeyboardControllerParams;
export type PhysicalKeyboardParams = KeyboardControllerParams;
export interface SuggestionBoxParams extends KeyboardControllerParams {
  onSelect: onSuggestionSelect;
}

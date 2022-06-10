/* eslint-disable no-unused-vars */
import SimpleKeyboard from './components/Keyboard';
import Utilities from './common/Utilities';

export interface KeyboardLayoutObject {
  [key: string]: string[];
}

export type KeyboardButtonTheme = {
  class: string;
  buttons: string;
} | null;

export interface KeyboardButtonAttributes {
  attribute: string;
  value: string;
  buttons: string;
}

export interface KeyboardInput {
  [key: string]: string;
}

export type CandidateBoxParams = {
  utilities: Utilities;
};

export type KeyboardElement = HTMLDivElement | HTMLButtonElement;
export type KeyboardHandlerEvent = any;

export type CandidateBoxShowParams = {
  candidateValue: string;
  targetElement: KeyboardElement;
  // eslint-disable-next-line no-unused-vars
  onSelect: (selectedCandidate: string, e: MouseEvent) => void;
};

export type CandidateBoxRenderParams = {
  candidateListPages: string[][];
  targetElement: KeyboardElement;
  pageIndex: number;
  nbPages: number;
  // eslint-disable-next-line no-unused-vars
  onItemSelected: (selectedCandidate: string, e: MouseEvent) => void;
};

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
   * By default, when you set the labels property, you replace the default one. This setting merges them instead.
   */
  mergeLabels?: boolean;

  /**
   * A prop to add your own css classes to the keyboard wrapper. You can add multiple classes separated by a space.
   */
  theme?: string;

  /**
   * A prop to add your own css classes to one or several buttons.
   */
  buttonTheme?: KeyboardButtonTheme[];

  /**
   * A prop to add your own attributes to one or several buttons.
   */
  buttonAttributes?: KeyboardButtonAttributes[];

  /**
   * Runs a `console.log` every time a key is pressed. Shows the buttons pressed and the current input.
   */
  debug?: boolean;

  /**
   * Specifies whether clicking the "ENTER" button will input a newline (`\n`) or not.
   */
  newLineOnEnter?: boolean;

  /**
   * Specifies whether clicking the "TAB" button will input a tab character (`\t`) or not.
   */
  tabCharOnTab?: boolean;

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
   * When set to true, this option synchronizes the internal input of every mamba-keyboard instance.
   */
  syncInstanceInputs?: boolean;

  /**
   * Enable highlighting of keys pressed on physical keyboard.
   */
  physicalKeyboardHighlight?: boolean;

  /**
   * Calls handler for a button highlighted by physicalKeyboardHighlight
   * In other words, this calls keyboard.handleButtonClicked(buttonName) on the highlighted button
   */
  physicalKeyboardHighlightPress?: boolean;

  /**
   * Trigger click on a button's element when using physicalKeyboardHighlightPress
   * In other words, this calls button.click() on the highlighted button
   */
  physicalKeyboardHighlightPressUseClick?: boolean;

  /**
   * Whether physicalKeyboardHighlightPress should use pointer events to trigger buttons.
   */
  physicalKeyboardHighlightPressUsePointerEvents?: boolean;

  /**
   * Define the text color that the physical keyboard highlighted key should have.
   */
  physicalKeyboardHighlightTextColor?: string;

  /**
   * Define the background color that the physical keyboard highlighted key should have.
   */
  physicalKeyboardHighlightBgColor?: string;

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
   * Render buttons as a button element instead of a div element.
   */
  useButtonTag?: boolean;

  /**
   * A prop to ensure characters are always be added/removed at the end of the string.
   */
  disableCaretPositioning?: boolean;

  /**
   * Restrains input(s) change to the defined regular expression pattern.
   */
  inputPattern?: any;

  /**
   * Instructs mamba-keyboard to use touch events instead of click events.
   */
  useTouchEvents?: boolean;

  /**
   * Enable useTouchEvents automatically when touch device is detected.
   */
  autoUseTouchEvents?: boolean;

  /**
   * Opt out of PointerEvents handling, falling back to the prior mouse event logic.
   */
  useMouseEvents?: boolean;

  /**
   * Disable button hold action.
   */
  disableButtonHold?: boolean;

  /**
   * Enable input method editor candidate list support.
   */
  enableLayoutCandidates?: boolean;

  /**
   * Character suggestions to be shown on certain key presses
   */
  layoutCandidates?: { [key: string]: string };

  /**
   * Exclude buttons from layout
   */
  excludeFromLayout?: { [key: string]: string[] };

  /**
   * Determines size of layout candidate list
   */
  layoutCandidatesPageSize?: number;

  /**
   * Determines whether layout candidate match should be case sensitive.
   */
  layoutCandidatesCaseSensitiveMatch?: boolean;

  /**
   * Executes the callback function every time mamba-keyboard is rendered (e.g: when you change layouts).
   */
  onRender?: (instance?: SimpleKeyboard) => void;

  /**
   * Executes the callback function once mamba-keyboard is rendered for the first time (on initialization).
   */
  onInit?: (instance?: SimpleKeyboard) => void;

  /**
   * Retrieves the current input
   */
  onChange?: (input: string, e?: MouseEvent) => any;

  /**
   * Retrieves all inputs
   */
  onChangeAll?: (inputObj: KeyboardInput, e?: MouseEvent) => any;

  /**
   * Module options can have any format
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

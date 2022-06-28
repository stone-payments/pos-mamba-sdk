/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */

import CreatePhysicalKeyboard from '../controllers/PhysicalKeyboard';
import type { UIPhysicalKeyboard } from '../controllers/PhysicalKeyboard';
import CaretWorker from '../common/CaretWorker';
import {
  getButtonClass,
  camelCase,
  getButtonLabelsName,
  getButtonType,
  ClassNames,
  createKeyboardElement,
} from '../helpers';
import {
  KeyboardOptions,
  KeyboardInput,
  KeyboardButtonElements,
  KeyboardHandlerEvent,
  KeyboardElement,
  ButtonType,
  KeyboardType,
  KeyboardUpdateMode,
  KeyboardTypesPredefinedOptions,
} from '../types';
import keyboardTypesMap from '../keyboards/keyboardTypesMap';

/**
 * Root class for @mamba/keyboard
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
class Keyboard {
  input!: KeyboardInput;

  options!: KeyboardOptions;

  caretWorker: any;

  keyboardDOM!: KeyboardElement;

  keyboardPluginClasses!: string;

  keyboardDOMClass!: string;

  buttonElements!: KeyboardButtonElements;

  currentInstanceName!: string;

  keyboardInstanceNames!: string[];

  physicalKeyboard?: UIPhysicalKeyboard;

  touchKeyboard!: UIPhysicalKeyboard;

  activeButtonClass: string = ClassNames.activeButtonClassDefault;

  initialized!: boolean;

  keyboardRowsDOM!: KeyboardElement;

  activeInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

  keyboardType: KeyboardType = KeyboardType.Default;

  defaultLayoutAndName = 'default';

  internalOnFunctionKeyPress?: (
    button: string,
    instance: Keyboard,
    e?: KeyboardHandlerEvent,
  ) => void;

  /**
   * Creates an instance of MambaKeyboard
   * @param params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
   */
  constructor(element?: HTMLDivElement, keyboardOptions?: KeyboardOptions) {
    if (typeof window === 'undefined') return;

    const {
      keyboardDOMClass,
      keyboardDOM,
      options = {},
    } = this.handleParams(element, keyboardOptions);

    /**
     * Initializing CaretWorker
     */
    this.caretWorker = new CaretWorker({
      getOptions: this.getOptions,
      keyboardInstance: this,
    });

    /**
     * Processing options
     */
    this.keyboardDOM = keyboardDOM;

    /**
     * @type {KeyboardOptions}
     */
    this.options = {
      excludeFromLayout: {},
      /**
       * Parse keyboard type
       */
      ...this.parseKeyboardTypeOptions(keyboardOptions),
      /**
       * Parse the rest of the options
       */
      ...options,
    };

    console.log(
      `${JSON.stringify(options, null, 2)}\n<--->\n${JSON.stringify(this.options, null, 2)}`,
    );

    /**
     * @type {object} Classes identifying loaded plugins
     */
    this.keyboardPluginClasses = '';

    /**
     * mamba-keyboard uses a non-persistent virtual input to keep track of the entered string (the variable `keyboard.input`).
     * This removes any dependency to input DOM elements. You can type and directly display the value in a div element, for example.
     * @example
     * // To get entered input
     * const input = keyboard.getInput();
     *
     * // To clear entered input.
     * keyboard.clearInput();
     *
     * @type {object}
     * @property {object} default Default Keyboard virtual input.
     */
    this.input = {
      default: '',
    };

    /**
     * @type {string} DOM class of the keyboard wrapper, normally "mamba-keyboard" by default.
     */
    this.keyboardDOMClass = keyboardDOMClass;

    /**
     * @type {object} Contains the DOM elements of every rendered button, the key being the button's layout name (e.g.: "{enter}").
     */
    this.buttonElements = {};

    /**
     * Mamba keyboard Instance
     * This enables bridge external integrations
     */
    if (!window.MambaKeyboardInstance) window.MambaKeyboardInstance = {};

    window.MambaKeyboardInstance[camelCase(this.keyboardDOMClass)] = this;

    /**
     * Physical Keyboard support
     */
    if (this.options.updateMode === KeyboardUpdateMode.Auto) {
      this.physicalKeyboard = CreatePhysicalKeyboard({
        getOptions: this.getOptions,
        keyboardInstance: this,
      });
    }

    /**
     * Rendering keyboard
     */
    if (this.keyboardDOM) this.render();
    else {
      console.warn(`".${keyboardDOMClass}" was not found in the DOM.`);
      throw new Error('KEYBOARD_DOM_ERROR');
    }
  }

  /**
   * Parse params
   */
  private handleParams = (
    element?: HTMLDivElement,
    keyboardOptions?: KeyboardOptions,
  ): {
    keyboardDOM: KeyboardElement;
    keyboardDOMClass: string;
    options: Partial<KeyboardOptions | undefined>;
  } => {
    let keyboardDOM = null;
    let keyboardDOMClass;
    const options = keyboardOptions;

    /**
     * If first parameter is an HTMLDivElement
     * Consider it as the keyboard DOM element
     */
    if (element instanceof HTMLDivElement) {
      /**
       * This element must have a class, otherwise throw
       */
      if (!element.className) {
        console.warn('DOM Div element passed as parameter must have a class.');
        throw new Error('KEYBOARD_DOM_CLASS_ERROR');
      }

      keyboardDOMClass = element.className.split(' ')[0];
      keyboardDOM = element;
    } else {
      console.error('Keyboard without a DOM element for render.');
      throw new Error('KEYBOARD_DOM_ELEMENT_ERROR');
    }

    if (typeof options === 'object') {
      /**
       * Define button class
       */
      if (typeof options.activeButtonClass === 'string') {
        this.activeButtonClass = options.activeButtonClass;
      }

      if (!options.updateMode) {
        options.updateMode = KeyboardUpdateMode.Auto;
      }
    }

    return {
      keyboardDOMClass,
      keyboardDOM,
      options,
    };
  };

  parseKeyboardTypeOptions(keyboardOptions?: KeyboardOptions) {
    const keyboardType: KeyboardType = keyboardOptions?.keyboardType || KeyboardType.Default;
    const keyboardSelected: KeyboardTypesPredefinedOptions = keyboardTypesMap[keyboardType]();

    if (
      keyboardType !== KeyboardType.Custom &&
      typeof keyboardSelected.onFunctionKeyPress === 'function'
    ) {
      this.internalOnFunctionKeyPress = keyboardSelected.onFunctionKeyPress;
    } else {
      this.internalOnFunctionKeyPress = undefined;
    }

    return {
      keyboardType: keyboardSelected.keyboardType || keyboardType,
      theme: keyboardSelected.theme || keyboardSelected.theme,
      layoutName: keyboardSelected.layoutName || this.defaultLayoutAndName,
      layout: keyboardSelected.layout,
    };
  }

  /**
   * ! Methods
   */

  /**
   * Retrieve instance options
   * @returns Parsed options
   */
  public getOptions = (): KeyboardOptions => this.options;

  /**
   * Clear the keyboard’s input.
   */
  public clearInput(): void {
    this.input.default = '';

    /**
     * Reset caretPosition
     */
    this.caretWorker.setCaretPosition(0);
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   */
  public getInput(): string {
    return this.input.default;
  }

  /**
   * Set the keyboard’s input.
   * @param input the input value
   */
  public setInput(input: string): void {
    this.input.default = input;
  }

  /**
   * Replace the input object (`keyboard.input`)
   * @param keyboardInput The input object
   */
  public replaceInput(keyboardInput: KeyboardInput): void {
    this.input = keyboardInput;
  }

  /**
   * Set new option or modify existing ones after initialization.
   * @param options The options to set
   */
  public setOptions(options = {}): void {
    const changedOptions = this.changedOptions(options);
    this.options = Object.assign(this.options, options);

    if (changedOptions.length) {
      if (this.options.debug) {
        console.log('changedOptions', changedOptions);
      }

      /**
       * Updating keyboard
       */
      this.render();
    }
  }

  /**
   * Detecting changes to non-function options
   * This allows us to ascertain whether a button re-render is needed
   */
  private changedOptions(newOptions: Partial<KeyboardOptions>): string[] {
    return Object.keys(newOptions).filter(
      (optionName) =>
        JSON.stringify(newOptions[optionName]) !== JSON.stringify(this.options[optionName]),
    );
  }

  /**
   * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
   * @param button The button layout name to select
   */
  public getButtonElement(button: string): KeyboardElement | KeyboardElement[] | undefined {
    let output;

    const buttonArr = this.buttonElements[button];
    if (buttonArr) {
      if (buttonArr.length > 1) {
        output = buttonArr;
      } else {
        output = buttonArr[0];
      }
    }

    return output;
  }

  /**
   * This handles the "inputPattern" option by checking if the provided inputPattern passes
   */
  public inputPatternIsValid(inputVal: string): boolean {
    const { inputPattern } = this.options;

    /**
     * Check if input pattern is global or targeted to individual inputs
     */
    if (inputPattern instanceof RegExp && inputVal) {
      const didInputMatch = inputPattern.test(inputVal);

      if (this.options.debug) {
        console.log(
          `inputPattern ("${inputPattern}"): ${didInputMatch ? 'passed' : 'did not pass!'}`,
        );
      }

      return didInputMatch;
    }
    /**
     * inputPattern doesn't seem to be set for the current input, or input is empty. Pass.
     */
    return true;
  }

  /**
   * ! Internal methods
   */

  /**
   * Handles clicks made to keyboard buttons
   * @param button The button's layout name.
   */
  private handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
    const { debug } = this.options;
    /**
     * Ignoring placeholder buttons
     */
    if (button === '{//}') return;

    /**
     * Creating virtual input if it doesn't exist
     */
    if (!this.input.default) this.input.default = '';

    /**
     * Calculating new input
     */
    const updatedInput = this.caretWorker.getUpdatedInput(button, this.input.default);

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === 'function') this.options.onKeyPress(button, e);

    /**
     * If key is a function key lie "{alt}". Calling function key press eventd
     */
    if (getButtonType(button) === ButtonType.Function) {
      /**
       * Calling onFunctionKeyPress
       */
      if (typeof this.options.onFunctionKeyPress === 'function') {
        this.options.onFunctionKeyPress(button, this, e);
      }

      /**
       * Calling internalOnFunctionKeyPress of prefab keyboard type
       */
      if (typeof this.internalOnFunctionKeyPress === 'function') {
        this.internalOnFunctionKeyPress(button, this, e);
      }
    }

    if (
      // If input will change as a result of this button press
      this.input.default !== updatedInput &&
      // This pertains to the "inputPattern" option:
      // If inputPattern isn't set
      (!this.options.inputPattern ||
        // Or, if it is set and if the pattern is valid - we proceed.
        (this.options.inputPattern && this.inputPatternIsValid(updatedInput)))
    ) {
      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if (this.options.maxLength && this.caretWorker.handleMaxLength(this.input, updatedInput)) {
        return;
      }

      /**
       * Updating input
       */
      const newInputValue = this.caretWorker.getUpdatedInput(button, this.input.default, true);

      this.setInput(newInputValue);

      if (debug) console.log('Input changed:', this.getInput());

      if (this.options.debug) {
        console.log(
          'Caret at: ',
          this.caretWorker.getCaretPosition(),
          this.caretWorker.getCaretPositionEnd(),
          `(${this.keyboardDOMClass})`,
        );
      }

      /**
       * Directly updates the active input, if any
       */
      if (
        /** on automatic mode only */
        this.options.updateMode === KeyboardUpdateMode.Auto &&
        this.physicalKeyboard
      ) {
        this.physicalKeyboard.dispatchSyntheticKeybaordEvent(button, e);
      }

      /**
       * Calling onChange
       */
      if (typeof this.options.onChange === 'function') this.options.onChange(this.getInput(), e);
    }

    /**
     * Call active class handler
     */
    this.handleActiveButton(e);

    if (debug) {
      console.log('Key pressed:', button);
    }
  }

  /**
   * Handles key active class
   */
  private handleActiveButton(e?: KeyboardHandlerEvent): void {
    if (e) {
      const target = e.target as Element;
      /**
       * Add active class
       */
      if (target) target.classList.add(this.activeButtonClass);

      /**
       * Remove active class after 100 ms
       */
      window.setTimeout(() => {
        if (e && target) target.classList.remove(this.activeButtonClass);
      }, 100);
    }
  }

  /**
   * Handles button mousedown
   */
  private handleButtonMouseDown(button: string, e: KeyboardHandlerEvent): void {
    if (e) {
      /**
       *  Calling preventDefault for the mousedown events keeps the focus on the input.
       */
      e.preventDefault();
    }
  }

  /**
   * Remove all keyboard rows and reset keyboard values.
   * Used internally between re-renders.
   */
  private resetRows(): void {
    if (this.keyboardRowsDOM) {
      const { parentNode } = this.keyboardRowsDOM;
      if (parentNode) parentNode.removeChild(this.keyboardRowsDOM);
    }

    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
  }

  /**
   * Executes the callback function once mamba-keyboard is rendered for the first time (on initialization).
   */
  private onInit() {
    if (this.options.debug) {
      console.log(`${this.keyboardDOMClass} Initialized`);
    }

    /**
     * setEventListeners
     */
    this.caretWorker.setupCaretEventsControl();

    if (typeof this.options.onInit === 'function') this.options.onInit(this);
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  private beforeFirstRender() {
    if (typeof this.options.beforeFirstRender === 'function') this.options.beforeFirstRender(this);
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  private beforeRender() {
    if (typeof this.options.beforeRender === 'function') this.options.beforeRender(this);
  }

  /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */
  private onRender() {
    if (typeof this.options.onRender === 'function') this.options.onRender(this);
  }

  /**
   * Parse Row DOM containers
   */
  private parseRowDOMContainers(
    rowDOM: HTMLDivElement,
    rowIndex: number,
    containerStartIndexes: number[],
    containerEndIndexes: number[],
  ) {
    const rowDOMArray = Array.from(rowDOM.children);
    let removedElements = 0;

    if (rowDOMArray.length) {
      containerStartIndexes.forEach((startIndex, arrIndex) => {
        const endIndex = containerEndIndexes[arrIndex];

        /**
         * If there exists a respective end index
         * if end index comes after start index
         */
        if (!endIndex || !(endIndex > startIndex)) {
          return false;
        }

        /**
         * Updated startIndex, endIndex
         * This is since the removal of buttons to place a single button container
         * results in a modified array size
         */
        const updated_startIndex = startIndex - removedElements;
        const updated_endIndex = endIndex - removedElements;

        /**
         * Taking elements due to be inserted into container
         */
        const containedElements = rowDOMArray.splice(
          updated_startIndex,
          updated_endIndex - updated_startIndex + 1,
        );
        removedElements = updated_endIndex - updated_startIndex;

        /**
         * Clearing old rowDOM children structure
         */
        rowDOM.innerHTML = '';

        /**
         * Appending rowDOM new children list
         */
        rowDOMArray.forEach((element) => rowDOM.appendChild(element));

        if (this.options.debug) {
          console.log(
            'rowDOMContainer',
            containedElements,
            updated_startIndex,
            updated_endIndex,
            removedElements + 1,
          );
        }
      });
    }

    return rowDOM;
  }

  /**
   * getKeyboardClassString
   */
  private getKeyboardClassString = (...baseDOMClasses: any[]) => {
    const keyboardClasses = [this.keyboardDOMClass, ...baseDOMClasses].filter(
      (DOMClass) => !!DOMClass,
    );

    return keyboardClasses.join(' ');
  };

  /**
   * Render the keyboard buttons
   */
  private render() {
    /**
     * Clear keyboard
     */
    this.resetRows();

    /**
     * Calling beforeFirstRender
     */
    if (!this.initialized) {
      this.beforeFirstRender();
    }

    /**
     * Calling beforeRender
     */
    this.beforeRender();

    const layout = this.options.layout;

    if (!layout) {
      console.warn(`"layout" was not found in the options.`);
      throw new Error('KEYBOARD_LAYOUT_ERROR');
    }

    const layoutName = this.options.layoutName || this.defaultLayoutAndName;
    const layoutClass = `${ClassNames.layoutPrefix}-${layoutName}`;

    /**
     * Adding themeClass, layoutClass to keyboardDOM
     */
    this.keyboardDOM.className = this.getKeyboardClassString(
      this.options.theme,
      layoutClass,
      this.keyboardPluginClasses,
    );

    /**
     * Create row wrapper
     */
    this.keyboardRowsDOM = createKeyboardElement(ClassNames.rowsPrefix) as HTMLDivElement;

    /**
     * Iterating through each row
     */
    layout[layoutName].forEach((row: any, rIndex: any) => {
      let rowArray = row.split(' ');

      /**
       * Enforce excludeFromLayout
       */
      if (this.options.excludeFromLayout && this.options.excludeFromLayout[layoutName]) {
        rowArray = rowArray.filter(
          (buttonName: any) =>
            this.options.excludeFromLayout &&
            !this.options.excludeFromLayout[layoutName].includes(buttonName),
        );
      }

      /**
       * Creating empty row
       */
      let rowDOM = createKeyboardElement(ClassNames.rowPrefix) as HTMLDivElement;

      /**
       * Tracking container indicators in rows
       */
      const containerStartIndexes: number[] = [];
      const containerEndIndexes: number[] = [];

      /**
       * Iterating through each button in row
       */
      rowArray.forEach((button: any, bIndex: any) => {
        /**
         * Check if button has a container indicator
         */
        const buttonHasContainerStart =
          !this.options.disableRowButtonContainers &&
          typeof button === 'string' &&
          button.length > 1 &&
          button.indexOf('[') === 0;

        const buttonHasContainerEnd =
          !this.options.disableRowButtonContainers &&
          typeof button === 'string' &&
          button.length > 1 &&
          button.indexOf(']') === button.length - 1;

        /**
         * Save container start index, if applicable
         */
        if (buttonHasContainerStart) {
          containerStartIndexes.push(bIndex);

          /**
           * Removing indicator
           */
          button = button.replace(/\[/g, '');
        }

        if (buttonHasContainerEnd) {
          containerEndIndexes.push(bIndex);

          /**
           * Removing indicator
           */
          button = button.replace(/\]/g, '');
        }

        /**
         * Processing button options
         */
        const fctBtnClass = getButtonClass(button);
        const buttonLabelsName = getButtonLabelsName(button, this.options.labels);

        /**
         * Creating button
         */
        const buttonDOM = createKeyboardElement(`${ClassNames.buttonPrefix} ${fctBtnClass}`);

        /**
         * Handle mouse events
         */
        buttonDOM.onclick = (e: KeyboardHandlerEvent) => {
          this.handleButtonClicked(button, e);
        };
        buttonDOM.onmousedown = (e: KeyboardHandlerEvent) => {
          this.handleButtonMouseDown(button, e);
        };

        /**
         * Adding identifier
         */
        buttonDOM.setAttribute(`data-${ClassNames.prefix}-key`, button);

        /**
         * Adding button label to button
         */
        const buttonSpanDOM = createKeyboardElement(undefined, 'span') as HTMLSpanElement;
        buttonSpanDOM.innerHTML = buttonLabelsName;
        buttonDOM.appendChild(buttonSpanDOM);

        /**
         * Adding to buttonElements
         */
        if (!this.buttonElements[button]) this.buttonElements[button] = [];

        this.buttonElements[button].push(buttonDOM);

        /**
         * Appending button to row
         */
        rowDOM.appendChild(buttonDOM);
      });

      /**
       * Parse containers in row
       */
      rowDOM = this.parseRowDOMContainers(
        rowDOM,
        rIndex,
        containerStartIndexes,
        containerEndIndexes,
      );

      /**
       * Appending row to mb-rows
       */
      this.keyboardRowsDOM.appendChild(rowDOM);
    });

    /**
     * Appending row to keyboard
     */
    this.keyboardDOM.appendChild(this.keyboardRowsDOM);

    /**
     * Calling onRender
     */
    this.onRender();

    if (!this.initialized) {
      /**
       * Ensures that onInit and beforeFirstRender are only called once per instantiation
       */
      this.initialized = true;

      /**
       * Calling onInit
       */
      this.onInit();
    }
  }
}

export default Keyboard;

/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */

import CreatePhysicalKeyboard from '../controllers/PhysicalKeyboard';
import type { UIPhysicalKeyboard } from '../controllers/PhysicalKeyboard';
import CaretWorker from '../common/CaretWorker';
import {
  getButtonClass,
  camelCase,
  getButtonLabelsName,
  getDefaultLayout,
  ClassNames,
  createKeyboardElement,
} from '../helpers';
import {
  KeyboardOptions,
  KeyboardInput,
  KeyboardButtonElements,
  KeyboardHandlerEvent,
  KeyboardElement,
} from '../types';

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

  physicalKeyboard!: UIPhysicalKeyboard;

  touchKeyboard!: UIPhysicalKeyboard;

  modules!: { [key: string]: any };

  activeButtonClass: string = ClassNames.activeButtonClassDefault;

  initialized!: boolean;

  keyboardRowsDOM!: KeyboardElement;

  activeInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

  defaultLayout = 'default';

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
      layoutName: 'default',
      theme: ClassNames.themeDefault,
      excludeFromLayout: {},
      ...options,
    };

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
    this.physicalKeyboard = CreatePhysicalKeyboard({
      getOptions: this.getOptions,
    });

    /**
     * Rendering keyboard
     */
    if (this.keyboardDOM) this.render();
    else {
      console.warn(`".${keyboardDOMClass}" was not found in the DOM.`);
      throw new Error('KEYBOARD_DOM_ERROR');
    }

    /**
     * Modules
     */
    this.modules = {};
    this.loadModules();
  }

  /**
   * Parse params
   */
  handleParams = (
    element?: HTMLDivElement,
    keyboardOptions?: KeyboardOptions,
  ): {
    keyboardDOM: KeyboardElement;
    keyboardDOMClass: string;
    options: Partial<KeyboardOptions | undefined>;
  } => {
    let keyboardDOM = null;
    let keyboardDOMClass;

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

    /**
     * Define button class
     */
    if (typeof keyboardOptions?.activeButtonClass === 'string') {
      this.activeButtonClass = keyboardOptions.activeButtonClass;
    }

    return {
      keyboardDOMClass,
      keyboardDOM,
      options: keyboardOptions,
    };
  };

  /**
   * Getters
   */
  getOptions = (): KeyboardOptions => this.options;

  /**
   * Handles clicks made to keyboard buttons
   * @param button The button's layout name.
   */
  handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
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
  handleActiveButton(e?: KeyboardHandlerEvent): void {
    if (e) {
      /**
       * Add active class
       */
      e.target.classList.add(this.activeButtonClass);

      /**
       * Remove active class after 100 ms
       */
      window.setTimeout(() => {
        if (e) e.target.classList.remove(this.activeButtonClass);
      }, 100);
    }
  }

  /**
   * Handles button mousedown
   */
  handleButtonMouseDown(button: string, e: KeyboardHandlerEvent): void {
    if (e) {
      /**
       *  Calling preventDefault for the mousedown events keeps the focus on the input.
       */
      e.preventDefault();
    }
  }

  /**
   * Clear the keyboard’s input.
   */
  clearInput(): void {
    this.input.default = '';

    /**
     * Reset caretPosition
     */
    this.caretWorker.setCaretPosition(0);
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   */
  getInput(): string {
    return this.input.default;
  }

  /**
   * Set the keyboard’s input.
   * @param input the input value
   */
  setInput(input: string): void {
    this.input.default = input;
  }

  /**
   * Replace the input object (`keyboard.input`)
   * @param keyboardInput The input object
   */
  replaceInput(keyboardInput: KeyboardInput): void {
    this.input = keyboardInput;
  }

  /**
   * Set new option or modify existing ones after initialization.
   * @param options The options to set
   */
  setOptions(options = {}): void {
    const changedOptions = this.changedOptions(options);
    this.options = Object.assign(this.options, options);

    if (changedOptions.length) {
      if (this.options.debug) {
        console.log('changedOptions', changedOptions);
      }

      /**
       * Some option changes require adjustments before re-render
       */
      this.onSetOptions(changedOptions);

      /**
       * Rendering
       */
      this.render();
    }
  }

  /**
   * Detecting changes to non-function options
   * This allows us to ascertain whether a button re-render is needed
   */
  changedOptions(newOptions: Partial<KeyboardOptions>): string[] {
    return Object.keys(newOptions).filter(
      (optionName) =>
        JSON.stringify(newOptions[optionName]) !== JSON.stringify(this.options[optionName]),
    );
  }

  /**
   * Executing actions depending on changed options
   * @param options The options to set
   */
  onSetOptions(changedOptions: string[] = []): void {
    /**
     * Changed: layoutName
     */
    // if (changedOptions.includes('layoutName')) {
    // }
  }

  /**
   * Remove all keyboard rows and reset keyboard values.
   * Used internally between re-renders.
   */
  resetRows(): void {
    if (this.keyboardRowsDOM) {
      const { parentNode } = this.keyboardRowsDOM;
      if (parentNode) parentNode.removeChild(this.keyboardRowsDOM);
    }

    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
  }

  /**
   * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
   * @param button The button layout name to select
   */
  getButtonElement(button: string): KeyboardElement | KeyboardElement[] | undefined {
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
  inputPatternIsValid(inputVal: string): boolean {
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
   * Executes the callback function once mamba-keyboard is rendered for the first time (on initialization).
   */
  onCreate() {
    if (this.options.debug) {
      console.log(`${this.keyboardDOMClass} Initialized`);
    }

    /**
     * setEventListeners
     */
    this.caretWorker.setupCaretEventsControl();

    if (typeof this.options.onCreate === 'function') this.options.onCreate(this);
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  beforeFirstRender() {
    if (typeof this.options.beforeFirstRender === 'function') this.options.beforeFirstRender(this);
  }

  /**
   * Executes the callback function before a simple-keyboard render.
   */
  beforeRender() {
    if (typeof this.options.beforeRender === 'function') this.options.beforeRender(this);
  }

  /**
   * Executes the callback function every time simple-keyboard is rendered (e.g: when you change layouts).
   */
  onRender() {
    if (typeof this.options.onRender === 'function') this.options.onRender(this);
  }

  /**
   * Executes the callback function once all modules have been loaded
   */
  onModulesLoaded() {
    if (typeof this.options.onModulesLoaded === 'function') this.options.onModulesLoaded(this);
  }

  /**
   * Register module
   */
  registerModule = (name: string, initCallback: any) => {
    if (!this.modules[name]) this.modules[name] = {};

    initCallback(this.modules[name]);
  };

  /**
   * Load modules
   */
  loadModules() {
    if (Array.isArray(this.options.modules)) {
      this.options.modules.forEach((KeyboardModule: any) => {
        const keyboardModule = new KeyboardModule(this);
        // eslint-disable-next-line no-unused-expressions
        keyboardModule.init && keyboardModule.init(this);
      });

      this.keyboardPluginClasses = 'modules-loaded';

      this.render();
      this.onModulesLoaded();
    }
  }

  /**
   * Get module prop
   */
  getModuleProp(name: string, prop: string) {
    if (!this.modules[name]) return false;

    return this.modules[name][prop];
  }

  /**
   * getModulesList
   */
  getModulesList() {
    return Object.keys(this.modules);
  }

  /**
   * Parse Row DOM containers
   */
  parseRowDOMContainers(
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
         * Create button container
         */
        // const containerDOM = document.createElement('div');
        // containerDOM.className += 'mb-button-container';

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
  getKeyboardClassString = (...baseDOMClasses: any[]) => {
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

    const layoutClass = `${ClassNames.layoutPrefix}-${this.options.layoutName}`;
    const layout = this.options.keyboardType || getDefaultLayout();
    const { disableRowButtonContainers } = this.options;

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
    this.keyboardRowsDOM = createKeyboardElement(ClassNames.rowsPrefix);

    /**
     * Iterating through each row
     */
    layout[this.options.layoutName || this.defaultLayout].forEach((row: any, rIndex: any) => {
      let rowArray = row.split(' ');

      /**
       * Enforce excludeFromLayout
       */
      if (
        this.options.excludeFromLayout &&
        this.options.excludeFromLayout[this.options.layoutName || this.defaultLayout]
      ) {
        rowArray = rowArray.filter(
          (buttonName: any) =>
            this.options.excludeFromLayout &&
            !this.options.excludeFromLayout[this.options.layoutName || this.defaultLayout].includes(
              buttonName,
            ),
        );
      }

      /**
       * Creating empty row
       */
      let rowDOM = createKeyboardElement(ClassNames.rowPrefix);

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
          !disableRowButtonContainers &&
          typeof button === 'string' &&
          button.length > 1 &&
          button.indexOf('[') === 0;

        const buttonHasContainerEnd =
          !disableRowButtonContainers &&
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
        buttonDOM.setAttribute('data-mb-key', button);

        /**
         * Adding button label to button
         */
        const buttonSpanDOM = document.createElement('span');
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
       * Ensures that onCreate and beforeFirstRender are only called once per instantiation
       */
      this.initialized = true;

      /**
       * Calling onCreate
       */
      this.onCreate();
    }
  }
}

export default Keyboard;

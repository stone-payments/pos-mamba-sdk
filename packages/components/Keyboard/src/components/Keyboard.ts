/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */

import CreatePhysicalKeyboard from '../controllers/PhysicalKeyboard';
import type { UIPhysicalKeyboard } from '../controllers/PhysicalKeyboard';
import Utilities from '../common/Utilities';
import {
  getButtonClass,
  camelCase,
  getButtonLabelsName,
  getDefaultLayout,
  ClassPrefix,
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
 * Root class for simple-keyboard.
 * This class:
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
class MambaKeyboard {
  input!: KeyboardInput;

  options!: KeyboardOptions;

  utilities: any;

  caretPosition!: number | null;

  caretPositionEnd!: number | null;

  keyboardDOM!: KeyboardElement;

  keyboardPluginClasses!: string;

  keyboardDOMClass!: string;

  buttonElements!: KeyboardButtonElements;

  currentInstanceName!: string;

  keyboardInstanceNames!: string[];

  physicalKeyboard!: UIPhysicalKeyboard;

  touchKeyboard!: UIPhysicalKeyboard;

  modules!: { [key: string]: any };

  activeClass!: string;

  initialized!: boolean;

  keyboardRowsDOM!: KeyboardElement;

  defaultName = 'default';

  activeInputElement: HTMLInputElement | HTMLTextAreaElement | null = null;

  /**
   * Creates an instance of MambaKeyboard
   * @param {Array} params If first parameter is a string, it is considered the container class. The second parameter is then considered the options object. If first parameter is an object, it is considered the options object.
   */
  constructor(
    selectorOrOptions?: string | HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions,
  ) {
    if (typeof window === 'undefined') return;

    const {
      keyboardDOMClass,
      keyboardDOM,
      options = {},
    } = this.handleParams(selectorOrOptions, keyboardOptions);

    /**
     * Initializing Utilities
     */
    this.utilities = new Utilities({
      getOptions: this.getOptions,
      getCaretPosition: this.getCaretPosition,
      getCaretPositionEnd: this.getCaretPositionEnd,
      dispatch: this.dispatch,
    });

    /**
     * Caret position
     */
    this.caretPosition = null;

    /**
     * Caret position end
     */
    this.caretPositionEnd = null;

    /**
     * Processing options
     */
    this.keyboardDOM = keyboardDOM;

    /**
     * @type {KeyboardOptions}
     */
    this.options = {
      layoutName: 'default',
      theme: 'mb-keyboard-default',
      inputName: 'default',
      excludeFromLayout: {},
      ...options,
    };

    /**
     * @type {object} Classes identifying loaded plugins
     */
    this.keyboardPluginClasses = '';

    /**
     * simple-keyboard uses a non-persistent internal input to keep track of the entered string (the variable `keyboard.input`).
     * This removes any dependency to input DOM elements. You can type and directly display the value in a div element, for example.
     * @example
     * // To get entered input
     * const input = keyboard.getInput();
     *
     * // To clear entered input.
     * keyboard.clearInput();
     *
     * @type {object}
     * @property {object} default Default MambaKeyboard internal input.
     * @property {object} myInputName Example input that can be set through `options.inputName:"myInputName"`.
     */
    const { inputName = this.defaultName } = this.options;
    this.input = {};
    this.input[inputName] = '';

    /**
     * @type {string} DOM class of the keyboard wrapper, normally "simple-keyboard" by default.
     */
    this.keyboardDOMClass = keyboardDOMClass;

    /**
     * @type {object} Contains the DOM elements of every rendered button, the key being the button's layout name (e.g.: "{enter}").
     */
    this.buttonElements = {};

    /**
     * Mamba-keyboard Instances
     * This enables multiple simple-keyboard support with easier management
     */
    if (!window.MambaKeyboardInstance) window.MambaKeyboardInstance = {};

    window.MambaKeyboardInstance[camelCase(this.keyboardDOMClass)] = this;

    /**
     * Physical Keyboard support
     */
    this.physicalKeyboard = CreatePhysicalKeyboard({
      dispatch: this.dispatch,
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
   * parseParams
   */
  handleParams = (
    selectorOrOptions?: string | HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions,
  ): {
    keyboardDOMClass: string;
    keyboardDOM: KeyboardElement;
    options: Partial<KeyboardOptions | undefined>;
  } => {
    let keyboardDOMClass;
    let keyboardDOM;
    let options;

    /**
     * If first parameter is a string:
     * Consider it as an element's class
     */
    if (typeof selectorOrOptions === 'string') {
      keyboardDOMClass = selectorOrOptions.split('.').join('');
      keyboardDOM = document.querySelector(`.${keyboardDOMClass}`) as KeyboardElement;
      options = keyboardOptions;

      /**
       * If first parameter is an KeyboardElement
       * Consider it as the keyboard DOM element
       */
    } else if (selectorOrOptions instanceof HTMLDivElement) {
      /**
       * This element must have a class, otherwise throw
       */
      if (!selectorOrOptions.className) {
        console.warn('Any DOM element passed as parameter must have a class.');
        throw new Error('KEYBOARD_DOM_CLASS_ERROR');
      }

      keyboardDOMClass = selectorOrOptions.className.split(' ')[0];
      keyboardDOM = selectorOrOptions;
      options = keyboardOptions;

      /**
       * Otherwise, search for .simple-keyboard DOM element
       */
    } else {
      keyboardDOMClass = 'simple-keyboard';
      keyboardDOM = document.querySelector(`.${keyboardDOMClass}`) as KeyboardElement;
      options = selectorOrOptions;
    }

    return {
      keyboardDOMClass,
      keyboardDOM,
      options,
    };
  };

  /**
   * Getters
   */
  getOptions = (): KeyboardOptions => this.options;

  getCaretPosition = (): number | null => this.caretPosition;

  getCaretPositionEnd = (): number | null => this.caretPositionEnd;

  /**
   * Changes the internal caret position
   * @param {number} position The caret's start position
   * @param {number} positionEnd The caret's end position
   */
  setCaretPosition(position: number | null, endPosition = position): void {
    this.caretPosition = position;
    this.caretPositionEnd = endPosition;
  }

  /**
   * Handles clicks made to keyboard buttons
   * @param  {string} button The button's layout name.
   */
  handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
    const { inputName = this.defaultName, debug } = this.options;
    /**
     * Ignoring placeholder buttons
     */
    if (button === '{//}') return;

    /**
     * Creating inputName if it doesn't exist
     */
    if (!this.input[inputName]) this.input[inputName] = '';

    /**
     * Calculating new input
     */
    const updatedInput = this.utilities.getUpdatedInput(
      button,
      this.input[inputName],
      this.caretPosition,
      this.caretPositionEnd,
    );

    /**
     * Complex case: Check for whole input selection changes that will yield same updatedInput
     */
    if (this.utilities.isStandardButton(button) && this.activeInputElement) {
      const isEntireInputSelection =
        this.input[inputName] &&
        this.input[inputName] === updatedInput &&
        this.caretPosition === 0 &&
        this.caretPositionEnd === updatedInput.length;

      if (isEntireInputSelection) {
        this.setInput('', this.options.inputName, true);
        this.setCaretPosition(0);
        this.activeInputElement.value = '';
        this.activeInputElement.setSelectionRange(0, 0);
        this.handleButtonClicked(button, e);
        return;
      }
    }

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === 'function') this.options.onKeyPress(button, e);

    if (
      // If input will change as a result of this button press
      this.input[inputName] !== updatedInput &&
      // This pertains to the "inputPattern" option:
      // If inputPattern isn't set
      (!this.options.inputPattern ||
        // Or, if it is set and if the pattern is valid - we proceed.
        (this.options.inputPattern && this.inputPatternIsValid(updatedInput)))
    ) {
      /**
       * If maxLength and handleMaxLength yield true, halting
       */
      if (this.options.maxLength && this.utilities.handleMaxLength(this.input, updatedInput)) {
        return;
      }

      /**
       * Updating input
       */
      const newInputValue = this.utilities.getUpdatedInput(
        button,
        this.input[inputName],
        this.caretPosition,
        this.caretPositionEnd,
        true,
      );

      this.setInput(newInputValue, this.options.inputName, true);

      if (debug) console.log('Input changed:', this.getAllInputs());

      if (this.options.debug) {
        console.log(
          'Caret at: ',
          this.getCaretPosition(),
          this.getCaretPositionEnd(),
          `(${this.keyboardDOMClass})`,
        );
      }

      /**
       * Calling onChange
       */
      if (typeof this.options.onChange === 'function')
        this.options.onChange(this.getInput(this.options.inputName, true), e);

      /**
       * Calling onChangeAll
       */
      if (typeof this.options.onChangeAll === 'function') {
        this.options.onChangeAll(this.getAllInputs(), e);
      }
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
      e.target.classList.add(this.activeClass);

      /**
       * Remove active class after 100 ms
       */
      window.setTimeout(() => {
        if (e) e.target.classList.remove(this.activeClass);
      }, 100);
    }
  }

  /**
   * Clear the keyboard’s input.
   * @param {string} [inputName] optional - the internal input to select
   */
  clearInput(inputName: string = this.options.inputName || this.defaultName): void {
    this.input[inputName] = '';

    /**
     * Reset caretPosition
     */
    this.setCaretPosition(0);
  }

  /**
   * Get the keyboard’s input (You can also get it from the onChange prop).
   * @param  {string} [inputName] optional - the internal input to select
   */
  getInput(
    inputName: string = this.options.inputName || this.defaultName,
    skipSync = false,
  ): string {
    return this.input[inputName];
  }

  /**
   * Get all simple-keyboard inputs
   */
  getAllInputs(): KeyboardInput {
    const output = {};
    const inputNames = Object.keys(this.input);

    inputNames.forEach((inputName) => {
      output[inputName] = this.getInput(inputName, true);
    });

    return output;
  }

  /**
   * Set the keyboard’s input.
   * @param  {string} input the input value
   * @param  {string} inputName optional - the internal input to select
   */
  setInput(
    input: string,
    // eslint-disable-next-line default-param-last
    inputName: string = this.options.inputName || this.defaultName,
    skipSync?: boolean,
  ): void {
    this.input[inputName] = input;
  }

  /**
   * Replace the input object (`keyboard.input`)
   * @param  {object} inputObj The input object
   */
  replaceInput(inputObj: KeyboardInput): void {
    this.input = inputObj;
  }

  /**
   * Set new option or modify existing ones after initialization.
   * @param  {object} options The options to set
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
   * @param  {object} options The options to set
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
   * Send a command to all simple-keyboard instance
   * @param  {function(instance: object, key: string)} callback Function to run on instance
   */
  // eslint-disable-next-line no-unused-vars
  dispatch(callback: (instance: MambaKeyboard | null, key?: string) => void): void {
    if (!window.MambaKeyboardInstance) {
      console.warn(`MambaKeyboardInstance is not defined. Dispatch cannot be called.`);
      throw new Error('MAMBA_KEYBOARD_INSTANCE_ERROR');
    }

    return Object.keys(window.MambaKeyboardInstance).forEach((key) => {
      callback(window.MambaKeyboardInstance[key], key);
    });
  }

  /**
   * Get the DOM Element of a button. If there are several buttons with the same name, an array of the DOM Elements is returned.
   * @param  {string} button The button layout name to select
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
   * This handles the "inputPattern" option
   * by checking if the provided inputPattern passes
   */
  inputPatternIsValid(inputVal: string): boolean {
    const inputPatternRaw = this.options.inputPattern;
    let inputPattern;

    /**
     * Check if input pattern is global or targeted to individual inputs
     */
    if (inputPatternRaw instanceof RegExp) {
      inputPattern = inputPatternRaw;
    } else {
      inputPattern = inputPatternRaw[this.options.inputName || this.defaultName];
    }

    if (inputPattern && inputVal) {
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
   * Handles simple-keyboard event listeners
   */
  setEventListeners(): void {
    /**
     * Only first instance should set the event listeners
     */

    if (this.options.debug) {
      console.log(`Caret handling started (${this.keyboardDOMClass})`);
    }

    /**
     * Event Listeners
     */
    /* document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('select', this.handleSelect);
    document.addEventListener('selectionchange', this.handleSelectionChange); */
  }

  /**
   * Event Handler: KeyUp
   */
  /* handleKeyUp(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  } */

  /**
   * Event Handler: KeyDown
   */
  /* handleKeyDown(event: KeyboardHandlerEvent): void {
    // TODO fire
  } */

  /**
   * Event Handler: MouseUp
   */
  /* handleMouseUp(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  } */

  /**
   * Event Handler: Select
   */
  /* istanbul ignore next */
  /* handleSelect(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  } */

  /**
   * Event Handler: SelectionChange
   */
  /* istanbul ignore next */
  /* handleSelectionChange(event: KeyboardHandlerEvent): void {
    this.caretEventHandler(event);
  } */

  /**
   * Called by {@link setEventListeners} when an event that warrants a cursor position update is triggered
   */
  // caretEventHandler(event: KeyboardHandlerEvent): void {
  //   let targetTagName: string;
  //   if (event.target.tagName) {
  //     targetTagName = event.target.tagName.toLowerCase();
  //   }

  //   this.dispatch((instance) => {
  //     if (!instance) return;
  //     const isKeyboard =
  //       event.target === instance.keyboardDOM ||
  //       (event.target && instance.keyboardDOM.contains(event.target));

  //     if (
  //       (targetTagName === 'textarea' ||
  //         (targetTagName === 'input' &&
  //           ['text', 'search', 'url', 'tel', 'password'].includes(event.target.type))) &&
  //       !instance.options.disableCaretPositioning
  //     ) {
  //       /**
  //        * Tracks current cursor position
  //        * As keys are pressed, text will be added/removed at that position within the input.
  //        */
  //       instance.setCaretPosition(event.target.selectionStart, event.target.selectionEnd);

  //       /**
  //        * Tracking current input in order to handle caret positioning edge cases
  //        */
  //       this.activeInputElement = event.target;

  //       if (instance.options.debug) {
  //         console.log(
  //           'Caret at: ',
  //           instance.getCaretPosition(),
  //           instance.getCaretPositionEnd(),
  //           event && event.target.tagName.toLowerCase(),
  //           `(${instance.keyboardDOMClass})`,
  //         );
  //       }
  //     } else if (
  //       (instance.options.disableCaretPositioning || !isKeyboard) &&
  //       event?.type !== 'selectionchange'
  //     ) {
  //       /**
  //        * If we toggled off disableCaretPositioning, we must ensure caretPosition doesn't persist once reactivated.
  //        */
  //       instance.setCaretPosition(null);

  //       /**
  //        * Resetting activeInputElement
  //        */
  //       this.activeInputElement = null;

  //       if (instance.options.debug) {
  //         console.log(`Caret position reset due to "${event?.type}" event`, event);
  //       }
  //     }
  //   });
  // }

  /**
   * Process buttonTheme option
   */
  // getButtonThemeClasses(button: string): string[] {
  //   const { buttonTheme } = this.options;
  //   let buttonClasses: string[] = [];

  //   if (Array.isArray(buttonTheme)) {
  //     buttonTheme.forEach((themeObj) => {
  //       if (
  //         themeObj &&
  //         themeObj.class &&
  //         typeof themeObj.class === 'string' &&
  //         themeObj.buttons &&
  //         typeof themeObj.buttons === 'string'
  //       ) {
  //         const themeObjClasses = themeObj.class.split(' ');
  //         const themeObjButtons = themeObj.buttons.split(' ');

  //         if (themeObjButtons.includes(button)) {
  //           buttonClasses = [...buttonClasses, ...themeObjClasses];
  //         }
  //       } else {
  //         console.warn(`Incorrect "buttonTheme". Please check the documentation.`, themeObj);
  //       }
  //     });
  //   }

  //   return buttonClasses;
  // }

  /**
   * Executes the callback function once simple-keyboard is rendered for the first time (on initialization).
   */
  onCreate() {
    if (this.options.debug) {
      console.log(`${this.keyboardDOMClass} Initialized`);
    }

    /**
     * setEventListeners
     */
    this.setEventListeners();

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
        const containerDOM = document.createElement('div');
        containerDOM.className += 'mb-button-container';

        /**
         * Taking elements due to be inserted into container
         */
        const containedElements = rowDOMArray.splice(
          updated_startIndex,
          updated_endIndex - updated_startIndex + 1,
        );
        removedElements = updated_endIndex - updated_startIndex;

        /**
         * Inserting elements to container
         */
        containedElements.forEach((element) => containerDOM.appendChild(element));

        /**
         * Adding container at correct position within rowDOMArray
         */
        rowDOMArray.splice(updated_startIndex, 0, containerDOM);

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

    const layoutClass = `mb-layout-${this.options.layoutName}`;
    const layout = this.options.layout || getDefaultLayout();
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
    this.keyboardRowsDOM = createKeyboardElement(ClassPrefix.rowsPrefix);

    /**
     * Iterating through each row
     */
    layout[this.options.layoutName || this.defaultName].forEach((row: any, rIndex: any) => {
      let rowArray = row.split(' ');

      /**
       * Enforce excludeFromLayout
       */
      if (
        this.options.excludeFromLayout &&
        this.options.excludeFromLayout[this.options.layoutName || this.defaultName]
      ) {
        rowArray = rowArray.filter(
          (buttonName: any) =>
            this.options.excludeFromLayout &&
            !this.options.excludeFromLayout[this.options.layoutName || this.defaultName].includes(
              buttonName,
            ),
        );
      }

      /**
       * Creating empty row
       */
      let rowDOM = document.createElement('div');
      rowDOM.className += 'mb-row';

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
        const buttonDOM = document.createElement('div');
        buttonDOM.className += `mb-button ${fctBtnClass}`;

        /**
         * Adding buttonTheme
         */
        // buttonDOM.classList.add(...this.getButtonThemeClasses(button));

        this.activeClass = 'mb-active';

        /**
         * Handle mouse events
         */
        buttonDOM.onclick = (e: KeyboardHandlerEvent) => {
          this.handleButtonClicked(button, e);
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

export default MambaKeyboard;

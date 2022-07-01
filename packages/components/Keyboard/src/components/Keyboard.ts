/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */

import CreatePhysicalKeyboard from '../controllers/PhysicalKeyboard';
import type { UIPhysicalKeyboard } from '../controllers/PhysicalKeyboard';
import CaretWorker from '../common/CaretWorker';
import {
  getButtonClass,
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
  KeyboardVisibility,
  LayoutDirection,
} from '../types';
import keyboardTypesMap from '../keyboards/keyboardTypesMap';
import '../../css/Keyboard.css';

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

  caretWorker!: CaretWorker;

  keyboardDOM!: KeyboardElement;

  keyboardDOMClass!: string;

  buttonElements!: KeyboardButtonElements;

  currentInstanceName!: string;

  keyboardInstanceNames!: string[];

  physicalKeyboard?: UIPhysicalKeyboard;

  activeButtonClass: string = ClassNames.activeButtonClassDefault;

  hiddenKeyboardClass: string = ClassNames.hiddenKeyboardClassDefault;

  initialized!: boolean;

  keyboardRowsDOM!: KeyboardElement;

  keyboardType: KeyboardType = KeyboardType.Default;

  keyboardVisible: KeyboardVisibility = KeyboardVisibility.Hidden;

  defaultLayoutAndName = 'default';

  activeTime = 100;

  defaultLayoutDirection = LayoutDirection.Horizontal;

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
      ...this.parseKeyboardTypeOptions(options),
      /**
       * Parse the rest of the options
       */
      ...options,
    };

    console.log(
      `${JSON.stringify(options, null, 2)}\n<--->\n${JSON.stringify(this.options, null, 2)}`,
    );

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

    window.MambaKeyboardInstance.instance = this;

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
   * Parse keyboard params
   *
   * @param elementOrOptions Pass keyboard root container or leaving argument to be the keyboard options. If no element passed, keyboard will try to add in top level(body or app root).
   * @param keyboardOptions Keyboard options if you use first argument as DOM element
   *
   * @throws DOM_CLASS_ERROR - DOM element have no class
   * @throws SIMULATOR_POS_SCREEN_NOT_FOUND - Simulator DOM container not found
   * @throws APP_ROOT_ERROR - Svelte `app-rot` not found
   */
  private handleParams = (
    elementOrOptions?: HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions,
  ): {
    keyboardDOM: KeyboardElement;
    keyboardDOMClass: string;
    options: Partial<KeyboardOptions | undefined>;
  } => {
    let keyboardDOM = null;
    let keyboardDOMClass;
    let options = keyboardOptions;

    /**
     * If first parameter is an HTMLDivElement
     * Consider it as the keyboard DOM element
     */
    if (elementOrOptions instanceof HTMLDivElement) {
      /**
       * This element must have a class, otherwise throw
       */
      if (!elementOrOptions.className) {
        console.warn('DOM Div element passed as parameter must have a class.');
        throw new Error('DOM_CLASS_ERROR');
      }

      keyboardDOMClass = elementOrOptions.className.split(' ')[0];
      keyboardDOM = elementOrOptions;
      /**
       * Otherwise, add it to the bottom of the window bounds. (Default)
       */
    } else {
      /**
       * Create a generic keyboard wrapper
       */
      keyboardDOM = createKeyboardElement(
        `${ClassNames.keyBoardPrefix}-generic-wrapper`,
      ) as HTMLDivElement;
      keyboardDOMClass = keyboardDOM.className;
      options = elementOrOptions;

      /**
       * Let's query the pos simulator app window to add there
       */
      if (__SIMULATOR__) {
        const simulatorWindow = document.querySelector(
          '#apps-container > div:first-child',
        ) as KeyboardElement;

        if (!simulatorWindow) throw new Error('SIMULATOR_POS_SCREEN_NOT_FOUND');
        simulatorWindow.appendChild(keyboardDOM);
      } else {
        /**
         * Get Svelte app root and add keyboard there
         */
        const appRoot = document.getElementById('app-root');

        if (!appRoot) {
          console.log('app-root not found');
          throw new Error('APP_ROOT_ERROR');
        }

        appRoot.appendChild(keyboardDOM);
      }
    }

    /**
     * Parse some options that need be checked first
     */
    this.parseOptionsUpdated(options);

    /** Prevent mistouch lose input focus */
    keyboardDOM.onmousedown = (event) => {
      event.preventDefault();
    };

    return {
      keyboardDOMClass,
      keyboardDOM,
      options,
    };
  };

  /**
   * Parse some options that need be checked first
   *
   * @param keyboardOptions
   * @returns Some options that need be parsed
   */
  private parseOptionsUpdated(options?: KeyboardOptions): void {
    if (!options) return;

    if (typeof options === 'object') {
      /**
       * Define button class
       */
      if (typeof options.activeButtonClass === 'string') {
        this.activeButtonClass = options.activeButtonClass;
      }

      /**
       * Define visibility class
       */
      if (typeof options.hiddenKeyboardClass === 'string') {
        this.hiddenKeyboardClass = options.hiddenKeyboardClass;
        this.handleKeyboardVisibility();
      }

      if (!options.updateMode) {
        options.updateMode = KeyboardUpdateMode.Auto;
      }

      if (!options.soundEnabled && window.Sound) {
        options.soundEnabled = window.Sound.isEnabled();
      } else {
        options.soundEnabled = false;
      }

      /**
       * Redirect input DOM pattern attribute value to pattern mechanism here
       */
      if (options.input) {
        const pattern = options.input.getAttribute('pattern');
        if (pattern) {
          options.inputPattern = new RegExp(pattern);
        }
      }
    }
  }

  /**
   * Define keyboard type and its properties
   *
   * @param keyboardOptions
   * @returns Parsed properties or defaults ones
   */
  private parseKeyboardTypeOptions(
    keyboardOptions?: KeyboardOptions,
  ): KeyboardTypesPredefinedOptions {
    const keyboardType: KeyboardType = keyboardOptions?.keyboardType || KeyboardType.Default;
    const keyboardSelected: KeyboardTypesPredefinedOptions = keyboardTypesMap[keyboardType]();

    /**
     * Handle keyboard function key event of not custom keyboard type, for layout changes out-of-box
     */
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
      layoutName: keyboardSelected.layoutName || this.defaultLayoutAndName,
      layoutDirection: keyboardSelected.layoutDirection || this.defaultLayoutDirection,
      layout: keyboardSelected.layout,
      labels: keyboardSelected.labels,
      outputs: keyboardSelected.outputs,
      theme: keyboardSelected.theme || keyboardSelected.theme,
    };
  }

  /**
   * ! Methods
   */

  /**
   * Controls keyboard visibility, to handle effects
   */
  public set visibility(value: KeyboardVisibility) {
    if (this.options.keepVisible === true) {
      value = KeyboardVisibility.Visible;
    }

    this.keyboardVisible = value;
    this.handleKeyboardVisibility();
  }

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

    /**
     * Parse some options that need be checked first
     */
    this.parseOptionsUpdated(options);

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
   * Handles clicks made to keyboard buttons
   * @param button The button's layout name.
   */
  private handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
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
     * Defining button type {@link ButtonType}
     */
    const buttonType: ButtonType = getButtonType(button);

    /**
     * If key is a function key lie "{alt}". Calling function key press eventd
     */
    if (buttonType === ButtonType.Function) {
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

    /**
     * Define is pattern and value is valid
     */
    const isValidInputPattern = this.options.inputPattern && this.inputPatternIsValid(updatedInput);

    if (
      // If input will change as a result of this button press
      this.input.default !== updatedInput &&
      // This pertains to the "inputPattern" option:
      // If inputPattern isn't set
      (!this.options.inputPattern ||
        // Or, if it is set and if the pattern is valid - we proceed.
        isValidInputPattern)
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

      if (this.options.debug) {
        console.log('Input changed:', this.getInput());

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
     * Directly updates the active input, if any
     * This events need call always to dispatch synthetic function/action keys
     */
    if (
      /** Check for pattern again in order to avoid unnecessary calls */
      (!this.options.inputPattern || isValidInputPattern) &&
      /** on automatic mode only */
      this.options.updateMode === KeyboardUpdateMode.Auto &&
      this.physicalKeyboard
    ) {
      this.physicalKeyboard.dispatchSyntheticKeybaordEvent(button, buttonType, e);
    }

    /**
     * Call active class handler
     */
    this.handleActiveButton(e);

    if (this.options.debug) {
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
       * Remove active class after configured time
       */
      window.setTimeout(() => {
        if (e && target) target.classList.remove(this.activeButtonClass);
      }, this.activeTime);
    }
  }

  /**
   * Handles keyboard visibility class
   */
  private handleKeyboardVisibility() {
    if (!this.keyboardDOM) return;

    /**
     * Add or remove active class
     */
    if (this.keyboardVisible === KeyboardVisibility.Hidden) {
      this.keyboardDOM.classList.add(this.hiddenKeyboardClass);
      return;
    }
    this.keyboardDOM.classList.remove(this.hiddenKeyboardClass);
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
     * set EventListeners
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
   * getKeyboardClassString
   */
  private getKeyboardClassString = (...baseDOMClasses: any[]) => {
    const keyboardClasses = [
      ClassNames.keyBoardPrefix,
      this.keyboardDOMClass,
      this.options.debug && 'debug',
      ...baseDOMClasses,
    ].filter(Boolean);

    return keyboardClasses.join(' ');
  };

  /**
   * Render the keyboard buttons
   * @throws LAYOUT_NOT_FOUND_ERROR - layout layout not found
   * @throws LAYOUT_NAME_NOT_FOUND_ERROR - layout name not found in layout object
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
      throw new Error('LAYOUT_NOT_FOUND_ERROR');
    }

    const layoutDirection = this.options.layoutDirection || this.defaultLayoutDirection;
    const layoutName = this.options.layoutName || this.defaultLayoutAndName;
    const layoutClass = `${ClassNames.layoutNamePrefix}-${layoutName}`;
    const layoutDirectionClass = `${ClassNames.layoutPrefix}-${layoutDirection}`;

    /**
     * Adding themeClass, layoutClass to keyboardDOM
     */
    this.keyboardDOM.className = this.getKeyboardClassString(
      layoutClass,
      layoutDirectionClass,
      this.options.theme,
    );

    /**
     * Create row wrapper
     */
    this.keyboardRowsDOM = createKeyboardElement(
      layoutDirection === LayoutDirection.Vertical
        ? ClassNames.columnsPrefix
        : ClassNames.rowsPrefix,
    ) as HTMLDivElement;

    /**
     * Throws error if layout name not found in layouts
     */
    if (!layout[layoutName]) {
      console.error(`Layout name "${layoutName}" not found in ${JSON.stringify(layout)}`);
      throw new Error('LAYOUT_NAME_NOT_FOUND_ERROR');
    }

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
      const rowDOM = createKeyboardElement(
        layoutDirection === LayoutDirection.Vertical
          ? ClassNames.columnPrefix
          : ClassNames.rowPrefix,
      ) as HTMLDivElement;

      /** Prevent mistouch lose input focus */
      rowDOM.onmousedown = (event) => {
        event.preventDefault();
      };

      /**
       * Iterating through each button in row
       */
      rowArray.forEach((button: any, bIndex: any) => {
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

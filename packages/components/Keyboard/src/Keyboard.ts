/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */

import { merge, kebabCase } from 'lodash';
import PhysicalKeyboard from './controllers/PhysicalKeyboard';
import GeneralKeyboard, { UIGeneralKeyboard } from './controllers/GeneralKeyboard';
import CursorWorker from './common/CursorWorker';
import SuggestionBox from './components/SuggestionBox';
import {
  getButtonClass,
  getButtonLabelsName,
  getButtonType,
  ClassNames,
  isProperInput,
  createKeyboardElement,
  isNonInputButProperElement,
} from './helpers';
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
  KeyboardThemeVariation,
} from './types';
import keyboardTypesMap from './keyboards/keyboardTypesMap';

/**
 * Root class for @mamba/keyboard
 * - Parses the options
 * - Renders the rows and buttons
 * - Handles button functionality
 */
class Keyboard {
  private input!: KeyboardInput;

  private initialOptions!: KeyboardOptions;

  options!: KeyboardOptions;

  cursorWorker!: CursorWorker;

  keyboardDOM!: KeyboardElement;

  keyboardDOMClass!: string;

  buttonElements!: KeyboardButtonElements;

  physicalKeyboard?: PhysicalKeyboard;

  generalKeyboard!: UIGeneralKeyboard;

  suggestionsBox?: SuggestionBox;

  activeButtonClass: string = ClassNames.activeButtonClassDefault;

  hiddenKeyboardClass: string = ClassNames.hiddenKeyboardClassDefault;

  initialized!: boolean;

  keyboardRowsDOM!: KeyboardElement;

  keyboardType: KeyboardType = KeyboardType.Default;

  keyboardVisible: KeyboardVisibility = KeyboardVisibility.Hidden;

  defaultLayoutDirection = LayoutDirection.Horizontal;

  defaultLayoutAndName = 'default';

  activeTime = 100;

  driverBinded = false;

  defaultAllowKeySyntheticEvent = ['{backspace}', '{enter}', '{check}'];

  internalOnFunctionKeyPress?: (
    button: string,
    instance: Keyboard,
    e?: KeyboardHandlerEvent,
  ) => void;

  /**
   * Creates an instance of MambaKeyboard
   * @param params If first parameter is a HTMLDivElement, it is considered as element to mount the keybaord, otherwise it will create a generic one on app-root, and the second parameter is then considered the options object. If first parameter is an object, it is considered as {@link KeyboardOptions} object.
   * @remarks
   */
  constructor(
    elementOrOptions?: HTMLDivElement | KeyboardOptions,
    keyboardOptions?: KeyboardOptions,
  ) {
    if (typeof window === 'undefined') return;
    if (UIGeneralKeyboard.hasKeyboardInstance()) {
      throw new Error('INSTANCE_ALREADY_EXIST');
      return;
    }

    this.generalKeyboard = GeneralKeyboard;

    const {
      keyboardDOMClass,
      keyboardDOM,
      options = {},
    } = this.handleParams(elementOrOptions, keyboardOptions);

    /**
     * Initializing CursorWorker
     */
    this.cursorWorker = new CursorWorker({
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
    this.options = merge(
      {
        excludeFromLayout: {},
        theme: ClassNames.themeDefault,
      },
      /**
       * Parse keyboard type
       */
      this.parseKeyboardTypeOptions(options),
      /**
       * Parse the rest of the options
       */
      options,
    );

    /**
     * Keep keyboard initial props for reset work
     */
    this.initialOptions = { ...this.options };

    /**
     * Mamba virtual keyboard uses a non-persistent virtual input to keep track of the entered string (the variable `keyboard.input`).
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
     * @type {string} DOM class of the keyboard wrapper, normally "mb-keyboard" by default.
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
     * Bind methods to the Keyboard warapper API
     */
    Keyboard.bindToDriver(window.$Keyboard, window.MambaKeyboardInstance.instance);

    /**
     * Physical Keyboard support
     */
    if (this.options.updateMode === KeyboardUpdateMode.Auto) {
      this.physicalKeyboard = new PhysicalKeyboard({
        getOptions: this.getOptions,
        keyboardInstance: this,
      });
    }

    /**
     * Rendering keyboard
     */
    if (this.keyboardDOM) {
      if (!(this.options.autoRender === false) || this.options.keepVisible) {
        setTimeout(() => {
          this.render();
        }, 1);
      }
    } else {
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
  ): KeyboardTypesPredefinedOptions | undefined {
    if (!keyboardOptions || typeof keyboardOptions !== 'object') return undefined;

    const keyboardType: KeyboardType = keyboardOptions.keyboardType || KeyboardType.Default;

    /**
     * Reset last properties
     */
    if (this.options) {
      delete this.options.layoutName;
      delete this.options.layoutDirection;
      delete this.options.theme;
      delete this.options.layout;
      delete this.options.outputs;
      delete this.options.labels;
      delete this.options.internalOnFunctionKeyPress;
    }

    if (keyboardType === KeyboardType.Custom) {
      return undefined;
    }

    /**
     * Handle suggestions box
     */
    if (!this.suggestionsBox && keyboardType === KeyboardType.Default) {
      this.suggestionsBox = new SuggestionBox({
        getOptions: this.getOptions,
        keyboardInstance: this,
        onSelect: (button: string, e?: KeyboardHandlerEvent) => {
          this.handleButtonClicked(button, e);
        },
      });
    } else if (this.suggestionsBox) {
      this.suggestionsBox.destroy();
      this.suggestionsBox = undefined;
    }

    /**
     * Get keyboard ready
     */
    try {
      const keyboardSelected: KeyboardTypesPredefinedOptions = keyboardTypesMap[keyboardType]();

      /**
       * Handle keyboard function key event of not custom keyboard type, for layout changes out-of-box
       */
      if (typeof keyboardSelected.internalOnFunctionKeyPress === 'function') {
        this.internalOnFunctionKeyPress = keyboardSelected.internalOnFunctionKeyPress;
      } else {
        this.internalOnFunctionKeyPress = undefined;
      }

      return {
        ...keyboardSelected,
      };
    } catch (e) {
      console.log(
        `the given keyboard ${keyboardType} not found. The valid values are Default, Math, Numeric, Phone or Custom`,
      );

      throw new Error('KEYBOARD_TYPE_NOT_FOUND');
    }
  }

  /**
   * ! Methods
   */

  /**
   * Handles dataset of HTML input and parse its options
   */
  public handleDOMInputDataset() {
    const input = document.activeElement as HTMLInputElement;
    const isInput = isProperInput(input);

    if (
      isInput &&
      'keyboardOptions' in input.dataset &&
      typeof input.dataset.keyboardOptions === 'string'
    ) {
      try {
        const keyboardOptions = JSON.parse(input.dataset.keyboardOptions);
        if (keyboardOptions) {
          this.setOptions(keyboardOptions);
        }
      } catch (e) {
        console.warn(
          `Invalid 'data-keyboard-options' declared on <input>. Must be JSON compatible. ${e}`,
        );
      }
    }
  }

  /**
   * Controls keyboard visibility, to handle effects
   */
  public set visibility(value: KeyboardVisibility) {
    const allowed = this.isRenderAllowed;
    if (this.options.debug) {
      if (value === KeyboardVisibility.Visible && !allowed) {
        console.info(`Set visibility to "${value}" has no effect with renderCondition \`false\``);
      }
    }

    if (!allowed) return;

    if (this.options.keepVisible === true) {
      value = KeyboardVisibility.Visible;
    }

    this.handleDOMInputDataset();

    this.handleKeyboardVisibility(value);
  }

  public get visibility() {
    return this.keyboardVisible;
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
     * Resets cursorPosition
     */
    this.cursorWorker.setCursorPosition(0);
  }

  /**
   * Gets the keyboard’s input (You can also get it from the onChange prop).
   */
  public getInput(): string {
    const value = this.input.default;
    if (typeof this.options.lastValue === 'string' && value.length <= 1) {
      return this.options.lastValue;
    }
    return this.input.default;
  }

  /**
   * Sets the keyboard’s input.
   * @param input the input value
   */
  public setInput(input: string): void {
    this.input.default = this.cursorWorker.shouldFilterNumericValue(input);

    if (this.options.debug) {
      if (window.MambaKeyboardInstance && window.MambaKeyboardInstance.instance) {
        console.log('Input changed:', window.MambaKeyboardInstance.instance.input);
      }
    }
  }

  /**
   * Replaces the input object (`keyboard.input`)
   * @param keyboardInput The input object
   */
  public replaceInput(keyboardInput: KeyboardInput): void {
    this.input = keyboardInput;
  }

  /**
   * Sets new option or modify existing ones after initialization.
   * @param options The options to set
   */
  public setOptions(options: KeyboardOptions = {}): void {
    const changedOptions = this.changedOptions(options);

    /**
     * Parse some options that need be checked first.
     */
    this.parseOptionsUpdated(options);

    /**
     * Cease ou setup cursor events again
     */
    if (options.readonly === true) {
      this.cursorWorker.ceaseCursorEventsControl();
    } else {
      this.cursorWorker.setupCursorEventsControl();
    }

    this.options = merge(this.options, this.parseKeyboardTypeOptions(options), options);

    /**
     * Recreates or destroy physical keyboard handler
     */
    if (this.options.updateMode === KeyboardUpdateMode.Manual && this.physicalKeyboard) {
      this.physicalKeyboard.destroy();
      this.physicalKeyboard = undefined;
    } else if (this.options.updateMode === KeyboardUpdateMode.Auto && !this.physicalKeyboard) {
      this.physicalKeyboard = new PhysicalKeyboard({
        getOptions: this.getOptions,
        keyboardInstance: this,
      });
    }

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
   * This handles the "inputPattern" option by checking if the provided inputPattern passes.
   */
  private inputPatternIsValid(inputVal: string): boolean {
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
   * Returns if the current input is valid within current pattern option.
   */
  public currentInputPatternIsValid(): boolean {
    const insputStr = this.getInput();
    return this.inputPatternIsValid(insputStr);
  }

  /**
   * Change the keyboard type.
   * @param type The keyboard type
   */
  public setKeyboardType(type: KeyboardType): void {
    // update after route change
    setTimeout(() => {
      this.setOptions({
        keyboardType: type,
      });
    });
  }

  /**
   * Set keyboard as default type.
   */
  public setKeyboardAsDefaultType() {
    this.setOptions({
      keyboardType: KeyboardType.Default,
    });
  }

  /**
   * Set keyboard as math type.
   */
  public setKeyboardAsMathType() {
    this.setOptions({
      keyboardType: KeyboardType.Math,
    });
  }

  /**
   * Set keyboard as numeric type.
   */
  public setKeyboardAsNumericType() {
    this.setOptions({
      keyboardType: KeyboardType.Numeric,
    });
  }

  /**
   * Set keyboard as phone type.
   */
  public setKeyboardAsPhoneType() {
    this.setOptions({
      keyboardType: KeyboardType.Phone,
    });
  }

  /**
   * Set keyboard as custom type.
   */
  public setKeyboardAsCustomType(options: KeyboardOptions = {}) {
    if (this.options.debug) {
      console.log(`keyboard.setKeyboardAsCustomType() called`);
    }
    this.setOptions({
      keyboardType: KeyboardType.Custom,
      ...options,
    });
  }

  /**
   * Shows keyboard and mount it if already not.
   */
  public show() {
    if (this.options.debug) {
      console.log(`keyboard.show() called`);
    }
    setTimeout(() => {
      this.render();
      this.handleKeyboardVisibility(KeyboardVisibility.Visible);
    });
  }

  /**
   * Hides keyboard.
   * This method do less things than {@link visibility}.
   */
  public hide() {
    if (this.options.debug) {
      console.log(`keyboard.hide() called`);
    }
    setTimeout(() => {
      this.handleKeyboardVisibility(KeyboardVisibility.Hidden);
    });
  }

  /**
   * Resets keyboard properties.
   */
  public resetOptions() {
    if (this.options.debug) {
      console.log(`keyboard.resetOptions() called`);
    }
    this.options = { ...this.initialOptions };

    /**
     * Reset cursor positions
     */
    if (this.cursorWorker) {
      this.cursorWorker.cursorPosition = null;
      this.cursorWorker.cursorPositionEnd = null;
    }

    /**
     *  Clear input listeners for keyboard route reset
     */
    if (this.physicalKeyboard) {
      this.physicalKeyboard.clearInputListeners();
    }

    /**
     * Reset input value
     */
    this.setInput('');
  }

  /**
   * Removes all keyboard rows and set visibility to hidden.
   */
  public unmount() {
    if (this.options.debug) {
      console.log(`keyboard.unmount() called`);
    }
    this.handleKeyboardVisibility(KeyboardVisibility.Hidden);
    this.clearRows();
  }

  /**
   * Resets keyboard properties and keyboard elements.
   */
  public reset() {
    if (this.options.debug) {
      console.log(`keyboard.reset() called`);
    }
    this.resetOptions();
    this.clearRows();
  }

  /**
   * Destroy keyboard, remove listeners and DOM elements.
   * This method should called by svelte component on:destroy
   */
  public destroy() {
    if (this.options.debug) {
      console.log(`keyboard.destroy() called`);
    }
    if (this.options.debug) {
      console.log(
        'Destroying Keyboard ans its events. This method should called by svelte component.',
      );
    }

    /**
     * Destroy physical keyboard and its listeners
     */
    if (this.physicalKeyboard) {
      this.physicalKeyboard.destroy();
      this.physicalKeyboard = undefined;
    }

    /**
     * Cleans cursor events
     */
    if (this.cursorWorker) {
      this.cursorWorker.ceaseCursorEventsControl();
    }

    /**
     * Destroy suggestion box if any
     */
    if (this.suggestionsBox) {
      this.suggestionsBox.destroy();
    }

    /**
     * Removes wrappers mouse down event
     */
    this.keyboardDOM.onmousedown = null;

    const layoutDirection = this.options.layoutDirection || this.defaultLayoutDirection;

    const rowDOM = this.keyboardRowsDOM.querySelector(
      layoutDirection === LayoutDirection.Vertical ? ClassNames.columnPrefix : ClassNames.rowPrefix,
    ) as HTMLDivElement;

    if (rowDOM) rowDOM.onmousedown = null;

    /**
     * Removes buttons callback
     */
    const removeButton = (buttonElement: KeyboardElement | null) => {
      if (buttonElement) {
        buttonElement.onmousedown = null;
        buttonElement.onclick = null;

        buttonElement.parentElement?.removeChild(buttonElement);
        buttonElement = null;
      }
    };

    /**
     * Remove buttons
     */
    Object.keys(this.buttonElements).forEach((buttonName) =>
      this.buttonElements[buttonName].forEach(removeButton),
    );

    this.keyboardDOM.innerHTML = '';
    this.keyboardDOM.parentElement?.removeChild(this.keyboardDOM);

    /**
     * Removes instance
     */
    window.MambaKeyboardInstance.instance = null;

    /**
     * Resets initialized flag
     */
    this.initialized = false;
  }

  /**
   * Bind public methods to the window.$Keyboard wrapper.
   * So you can call Keyboard methods grouped with Kernel methods.
   * e.g `window.$Keyboard.show();`
   *
   * @param driver driver wrapper
   */
  public static bindToDriver(driver: any, instance: Keyboard) {
    if (!driver || instance.driverBinded) return;
    const accessibleMethods = [
      'setKeyboardType',
      'setOptions',
      'setInput',
      'getInput',
      'clearInput',
      'replaceInput',
      'render',
      'show',
      'hide',
      'unmount',
      'resetOptions',
      'reset',
      'currentInputPatternIsValid',
      'getButtonElement',
      'setKeyboardAsDefaultType',
      'setKeyboardAsMathType',
      'setKeyboardAsNumericType',
      'setKeyboardAsPhoneType',
      'setKeyboardAsCustomType',
      'destroy',
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const method of Object.getOwnPropertyNames(Keyboard.prototype)) {
      if (accessibleMethods.includes(method)) {
        driver[method] = UIGeneralKeyboard.bindWrapper(instance[method].bind(instance));
      }
    }

    /**
     * Rewrite driver get/set of keyboard visibility
     */
    Object.defineProperty(driver, 'visibility', {
      configurable: true,
      get() {
        return instance.visibility;
      },
      set(value: KeyboardVisibility) {
        instance.visibility = value;
      },
    });

    instance.driverBinded = true;
  }

  /**
   * ! Internal methods
   */

  /**
   * Detecting changes to non-function options.
   * This allows us to ascertain whether a button re-render is needed.
   */
  private changedOptions(newOptions: Partial<KeyboardOptions>): string[] {
    return Object.keys(newOptions).filter(
      (optionName) =>
        JSON.stringify(newOptions[optionName]) !== JSON.stringify(this.options[optionName]),
    );
  }

  /**
   * Handles clicks made to keyboard buttons.
   * @param button The button's layout name.
   */
  private handleButtonClicked(button: string, e?: KeyboardHandlerEvent): void {
    if (this.isRenderAllowed !== true) return;
    if (this.options.disabled === true) return;

    const focusedInput = document.activeElement as HTMLInputElement;

    /**
     * Ignoring placeholder buttons
     */
    if (button === '{//}' || (focusedInput && focusedInput.disabled)) return;

    let buttonOutput = button;

    /**
     * Converts button from configured {@link KeyboardOptions.outputs} option if any
     */
    if (this.options.outputs && this.options.outputs[button]) {
      buttonOutput = this.options.outputs[button];
    }

    /**
     * Creating virtual input if it doesn't exist
     */
    if (!this.input.default) this.input.default = '';

    /**
     * Calculating new input
     */
    const updatedInput = this.cursorWorker.getUpdatedInput(button, this.input.default);

    /**
     * Calling onKeyPress
     */
    if (typeof this.options.onKeyPress === 'function') this.options.onKeyPress(buttonOutput, e);

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
        this.options.onFunctionKeyPress(buttonOutput, this, e);
      }

      /**
       * Calling internalOnFunctionKeyPress of prefab keyboard type
       */
      if (typeof this.internalOnFunctionKeyPress === 'function') {
        this.internalOnFunctionKeyPress(buttonOutput, this, e);
      }
    } else if (typeof this.options.onStandardKeyPress === 'function') {
      /**
       * Calling onStandardKeyPress
       */
      this.options.onStandardKeyPress(buttonOutput, this, e);
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
      if (this.options.maxLength && this.cursorWorker.handleMaxLength(this.input, updatedInput)) {
        return;
      }

      /**
       * Updating input
       */
      const newInputValue = this.cursorWorker.getUpdatedInput(button, this.input.default, true);

      this.setInput(newInputValue);

      if (this.options.debug) {
        console.log(
          'Cursor at: ',
          this.cursorWorker.getCursorPosition(),
          this.cursorWorker.getCursorPositionEnd(),
          `(${this.keyboardDOMClass})`,
          `New input value: "${newInputValue}"`,
        );
      }

      /**
       * Calling onChange
       */
      if (typeof this.options.onChange === 'function') this.options.onChange(this.getInput(), e);
    }

    /**
     * Call synthetic event handler
     */
    this.shouldDispatchSyntheticKeyEvent(button, buttonOutput, buttonType, isValidInputPattern, e);

    /**
     * Call suggestion box update if exist
     */
    if (
      this.suggestionsBox &&
      // Suggestions to work only when Standard button pressed
      buttonType !== ButtonType.Function &&
      // If user setup the input property element compatible with DOM Input element
      (isProperInput(this.options.input || focusedInput) ||
        // Or it is non DOM Input element, but a `<div>`
        isNonInputButProperElement(this.options.input || focusedInput))
    ) {
      this.suggestionsBox.shouldUpdateOrCease();
    }

    /**
     * Call active class handler
     */
    this.handleActiveButton(e);

    if (this.options.debug) {
      console.log('Key pressed:', { button, buttonOutput });
    }
  }

  /**
   * Handles key dispatcher
   */
  private shouldDispatchSyntheticKeyEvent(
    button: string,
    buttonOutput: string,
    buttonType: ButtonType,
    isValidInputPattern?: boolean,
    e?: KeyboardHandlerEvent,
  ) {
    if (this.isRenderAllowed !== true) return;
    if (this.options.disabled === true) return;
    const allowKeyPass =
      Array.isArray(this.options.allowKeySyntheticEvent) &&
      this.options.allowKeySyntheticEvent.includes(button);

    /**
     * Directly updates the active input, if any
     * This events need call always to dispatch synthetic function/action keys
     */
    if (this.physicalKeyboard) {
      if (
        // If button is obligatory key dispatcher
        this.defaultAllowKeySyntheticEvent.includes(button) ||
        // Check if key type is standard
        (buttonType === ButtonType.Standard &&
          // and for pattern again in order to avoid unnecessary calls
          (!this.options.inputPattern || isValidInputPattern) &&
          // on automatic mode only
          this.options.updateMode === KeyboardUpdateMode.Auto) ||
        // or if the button key can pass through configured `allowKeySyntheticEvent` option
        allowKeyPass
      ) {
        this.physicalKeyboard.dispatchSyntheticKeybaordEvent(
          buttonOutput,
          buttonType,
          allowKeyPass,
          e,
        );
      }
    } else if (this.options.soundEnabled === true) {
      /**
       * Pontually handle beep sound on key press for manual update mode
       */
      PhysicalKeyboard.handleBeepSound(this.options);
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
   * @param visibility
   */
  private handleKeyboardVisibility(visibility = KeyboardVisibility.Visible) {
    if (!this.isRenderAllowed) return;
    /**
     * Set the instance visibility
     */
    this.keyboardVisible = visibility;

    /**
     * Ignore if keyboard not exist yet
     */
    if (!this.keyboardDOM) return;

    /**
     * Add or remove active class
     */
    if (this.keyboardVisible === KeyboardVisibility.Hidden) {
      this.keyboardDOM.classList.add(this.hiddenKeyboardClass);
      return;
    }
    this.keyboardDOM.classList.remove(this.hiddenKeyboardClass);

    /**
     * Check if keyboard isn't rendered yet to call render.
     */
    if (Object.keys(this.buttonElements).length === 0) {
      this.render();
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
   * Remove all keyboard rows to reset keyboard elements.
   * Used internally between re-renders.
   */
  private clearRows(): void {
    if (this.keyboardRowsDOM) {
      const { parentNode } = this.keyboardRowsDOM;
      if (parentNode) parentNode.removeChild(this.keyboardRowsDOM);
    }

    this.keyboardDOM.className = this.keyboardDOMClass;
    this.buttonElements = {};
  }

  /**
   * Executes the callback function once virtual keyboard is rendered for the first time (on initialization).
   */
  private onInit() {
    if (this.options.debug) {
      console.log(`${this.keyboardDOMClass} Initialized`);
    }

    /**
     * Set cursor event listeners
     */
    this.cursorWorker.setupCursorEventsControl();

    if (typeof this.options.onInit === 'function') this.options.onInit(this);
  }

  /**
   * Executes the callback function before a virtual keyboard render.
   */
  private beforeFirstRender() {
    if (typeof this.options.beforeFirstRender === 'function') this.options.beforeFirstRender(this);
  }

  /**
   * Executes the callback function before a virtual keyboard render.
   */
  private beforeRender() {
    if (typeof this.options.beforeRender === 'function') this.options.beforeRender(this);
  }

  /**
   * Executes the callback function every time virtual keyboard is rendered (e.g: when you change layouts).
   */
  private onRender() {
    if (typeof this.options.onRender === 'function') this.options.onRender(this);
  }

  /**
   * getKeyboardClassString
   */
  private getKeyboardClassString = (...baseDOMClasses: any[]) => {
    let { themeVariation: variation } = this.options;
    const getVariationClass = (value: string) => `${ClassNames.variationPrefix}--${value}`;

    /**
     * Determine the theme variation, string or `KeyboardThemeVariation`
     */
    if (typeof variation === 'string') {
      const fromType = KeyboardThemeVariation[variation];
      if (fromType) {
        variation = fromType;
      } else {
        variation = kebabCase(variation);
      }
    } else {
      variation = KeyboardThemeVariation.Default;
    }

    const keyboardClasses = [
      ClassNames.keyBoardPrefix,
      this.keyboardDOMClass,
      this.options.debug && 'debug',
      variation && getVariationClass(variation),
      ...baseDOMClasses,
    ].filter(Boolean);

    return keyboardClasses.join(' ');
  };

  /**
   * Parse render condition
   * @returns If keyboard can work or not
   */
  public get isRenderAllowed(): boolean {
    if (typeof this.options.renderCondition === 'function') {
      return Boolean(this.options.renderCondition());
    }

    if (typeof this.options.renderCondition === 'undefined') {
      return true;
    }

    return Boolean(this.options.renderCondition);
  }

  /**
   * Renders or update the keyboard buttons
   * Can be called direct if `autoRender` is off
   * @throws LAYOUT_NOT_FOUND_ERROR - layout not found
   * @throws LAYOUT_NAME_NOT_FOUND_ERROR - layout name not found in layout object
   */
  public render() {
    /**
     * Clear keyboard
     */
    this.clearRows();

    /**
     * Stops if not allowed to render by condition
     */
    if (!this.isRenderAllowed) {
      this.cursorWorker.ceaseCursorEventsControl();
      return;
    }

    this.cursorWorker.setupCursorEventsControl();

    if (this.options.debug) {
      console.log(`Rendering/Updating keyboard`);
    }

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
     * Change keyboard positon to handle mamba <Button /> sticky at the bottom
     */
    const bottomButton = document.querySelector('.button.at-bottom') as HTMLButtonElement;
    if (bottomButton) {
      this.keyboardDOM.style.marginBottom = `${bottomButton.offsetHeight}px`;
    } else {
      this.keyboardDOM.style.marginBottom = '';
    }

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
      let rowArray = row.trim().split(' ');

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
        const buttonClass = getButtonClass(button);
        const buttonLabelsName = getButtonLabelsName(button, this.options.labels);

        /**
         * Creating button
         */
        const buttonDOM = createKeyboardElement(`${ClassNames.buttonPrefix} ${buttonClass}`);

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
         * Creating button cell for fixed layout
         */
        if (layoutDirection === LayoutDirection.Fixed) {
          const buttonDOMCell = createKeyboardElement(`${ClassNames.cellPrefix}`);

          buttonDOMCell.appendChild(buttonDOM);
          /**
           * Appending button to row
           */
          rowDOM.appendChild(buttonDOMCell);
        } else {
          /**
           * Appending button to row
           */
          rowDOM.appendChild(buttonDOM);
        }
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

export type { Keyboard };

export default Keyboard;

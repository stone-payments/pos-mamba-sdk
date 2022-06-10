import { KeyboardOptions, PhysicalKeyboardParams } from '../interfaces';
import Utilities from '../common/Utilities';
import GeneralKeyboard from './GeneralKeyboard';

/**
 * Responsible for the output of physical keys
 */
class UIPhysicalKeyboard extends GeneralKeyboard {
  public static instance;

  dispatch: any;

  /**
   * Define if backspace button should be enabled
   */
  backspaceEnabled = true;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the UIPhysicalKeyboard service
   */
  private constructor({ dispatch, getOptions }: PhysicalKeyboardParams) {
    super();
    /**
     * @type {object} A mamba-keyboard instance
     */
    this.dispatch = dispatch;
    this.getOptions = getOptions;

    /**
     * Bindings
     */
    Utilities.bindMethods(UIPhysicalKeyboard, this);
  }

  public static getInstance({ dispatch, getOptions }: PhysicalKeyboardParams): UIPhysicalKeyboard {
    if (!UIPhysicalKeyboard.instance) {
      UIPhysicalKeyboard.instance = new UIPhysicalKeyboard({ dispatch, getOptions });
    }

    return Singleton.instance;
  }

  handleHighlightKeyDown(event: KeyboardEvent) {
    const options = this.getOptions();
    const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

    this.dispatch((instance: any) => {
      const standardButtonPressed = instance.getButtonElement(buttonPressed);
      const functionButtonPressed = instance.getButtonElement(`{${buttonPressed}}`);
      let buttonDOM;
      let buttonName;

      if (standardButtonPressed) {
        buttonDOM = standardButtonPressed;
        buttonName = buttonPressed;
      } else if (functionButtonPressed) {
        buttonDOM = functionButtonPressed;
        buttonName = `{${buttonPressed}}`;
      } else {
        return;
      }

      if (buttonDOM) {
        buttonDOM.style.backgroundColor = options.physicalKeyboardHighlightBgColor || '#dadce4';
        buttonDOM.style.color = options.physicalKeyboardHighlightTextColor || 'black';

        if (options.physicalKeyboardHighlightPress) {
          if (options.physicalKeyboardHighlightPressUsePointerEvents) {
            buttonDOM.onpointerdown();
          } else if (options.physicalKeyboardHighlightPressUseClick) {
            buttonDOM.click();
          } else {
            instance.handleButtonClicked(buttonName, event);
          }
        }
      }
    });
  }

  handleHighlightKeyUp(event: KeyboardEvent) {
    const options = this.getOptions();
    const buttonPressed = this.getSimpleKeyboardLayoutKey(event);

    this.dispatch((instance: any) => {
      const buttonDOM =
        instance.getButtonElement(buttonPressed) || instance.getButtonElement(`{${buttonPressed}}`);

      if (buttonDOM && buttonDOM.removeAttribute) {
        buttonDOM.removeAttribute('style');
        if (options.physicalKeyboardHighlightPressUsePointerEvents) {
          buttonDOM.onpointerup();
        }
      }
    });
  }

  /**
   * Transforms a KeyboardEvent's "key.code" string into a mamba-keyboard layout format
   * @param  {object} event The KeyboardEvent
   */
  getSimpleKeyboardLayoutKey(event: KeyboardEvent) {
    let output = '';
    const keyId = event.code || event.key || this.keyCodeToKey(event?.keyCode);

    if (
      keyId?.includes('Numpad') ||
      keyId?.includes('Shift') ||
      keyId?.includes('Space') ||
      keyId?.includes('Backspace') ||
      keyId?.includes('Control') ||
      keyId?.includes('Alt') ||
      keyId?.includes('Symbols') ||
      keyId?.includes('Meta')
    ) {
      output = event.code || '';
    } else {
      output = event.key || this.keyCodeToKey(event?.keyCode) || '';
    }

    return output.length > 1 ? output?.toLowerCase() : output;
  }
}

const PhysicalKeyboard = ({ dispatch, getOptions }: PhysicalKeyboardParams) => {
  return UIPhysicalKeyboard.getInstance({ dispatch, getOptions });
};

export default PhysicalKeyboard;

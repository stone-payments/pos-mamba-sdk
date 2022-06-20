import { KeyboardOptions, PhysicalKeyboardParams } from '../types';
import GeneralKeyboard from './GeneralKeyboard';
import type { UIGeneralKeyboard } from './GeneralKeyboard';

/**
 * Responsible for the output of physical keys
 */
class UIPhysicalKeyboard {
  private generalKeyboard!: UIGeneralKeyboard;

  public static instance: UIPhysicalKeyboard;

  dispatch: any;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the UIPhysicalKeyboard service
   */
  private constructor({ dispatch, getOptions }: PhysicalKeyboardParams) {
    this.generalKeyboard = GeneralKeyboard;
    /**
     * @type {object} A mamba-keyboard instance
     */
    this.dispatch = dispatch;
    this.getOptions = getOptions;
  }

  public static getInstance({ dispatch, getOptions }: PhysicalKeyboardParams): UIPhysicalKeyboard {
    if (!UIPhysicalKeyboard.instance) {
      UIPhysicalKeyboard.instance = new UIPhysicalKeyboard({ dispatch, getOptions });
    }

    return UIPhysicalKeyboard.instance;
  }
}

export type { UIPhysicalKeyboard };

const CreatePhysicalKeyboard = ({
  dispatch,
  getOptions,
}: PhysicalKeyboardParams): UIPhysicalKeyboard => {
  return UIPhysicalKeyboard.getInstance({ dispatch, getOptions });
};

export default CreatePhysicalKeyboard;

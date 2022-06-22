import { KeyboardOptions, PhysicalKeyboardParams } from '../types';
import GeneralKeyboard from './GeneralKeyboard';
import type { UIGeneralKeyboard } from './GeneralKeyboard';

/**
 * Responsible for the output of physical keys
 */
class UIPhysicalKeyboard {
  private generalKeyboard!: UIGeneralKeyboard;

  public static instance: UIPhysicalKeyboard;

  getOptions: () => KeyboardOptions;

  /**
   * Creates an instance of the UIPhysicalKeyboard service
   */
  private constructor({ getOptions }: PhysicalKeyboardParams) {
    this.generalKeyboard = GeneralKeyboard;
    /**
     * @type {object} A mamba-keyboard instance
     */

    this.getOptions = getOptions;
  }

  public static getInstance({ getOptions }: PhysicalKeyboardParams): UIPhysicalKeyboard {
    if (!UIPhysicalKeyboard.instance) {
      UIPhysicalKeyboard.instance = new UIPhysicalKeyboard({ getOptions });
    }

    return UIPhysicalKeyboard.instance;
  }
}

export type { UIPhysicalKeyboard };

const CreatePhysicalKeyboard = ({ getOptions }: PhysicalKeyboardParams): UIPhysicalKeyboard => {
  return UIPhysicalKeyboard.getInstance({ getOptions });
};

export default CreatePhysicalKeyboard;

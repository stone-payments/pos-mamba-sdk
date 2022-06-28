import GeneralKeyboard from './GeneralKeyboard';
import type { UIGeneralKeyboard } from './GeneralKeyboard';

/**
 * Touch Keyboard controller, responsible for the output of touch keys
 */
class UITouchKeyboard {
  private generalKeyboard!: UIGeneralKeyboard;

  public static instance: UITouchKeyboard;

  private constructor() {
    this.generalKeyboard = GeneralKeyboard;
  }

  /**
   * Get virtual keyboard instance
   * @param params Keyboard options. Same of {@link KeyboardOptions}
   * @param params.getOptions Function that instance call to retrieve keyboard properties
   * @returns `UIPhysicalKeyboard` instance
   */
  public static getInstance(): UITouchKeyboard {
    if (!UITouchKeyboard.instance) {
      UITouchKeyboard.instance = new UITouchKeyboard();
    }

    return UITouchKeyboard.instance;
  }
}

/**
 * Export only type
 */
export type { UITouchKeyboard };

/**
 * Create or get Touch Keyboard instance
 */
const CreateTouchKeyboard = (): UITouchKeyboard => {
  return UITouchKeyboard.getInstance();
};

export default CreateTouchKeyboard;

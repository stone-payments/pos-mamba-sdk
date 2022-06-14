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

  public static getInstance(): UITouchKeyboard {
    if (!UITouchKeyboard.instance) {
      UITouchKeyboard.instance = new UITouchKeyboard();
    }

    return UITouchKeyboard.instance;
  }
}

export type { UITouchKeyboard };

const CreateTouchKeyboard = (): UITouchKeyboard => {
  return UITouchKeyboard.getInstance();
};

export default CreateTouchKeyboard;

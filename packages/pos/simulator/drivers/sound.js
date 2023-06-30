import { Registry } from '../index.js';

export const NAMESPACE = 'Sound';

export const PERSISTENT_SETTINGS = {
  isEnabled: false,
};

export function setup(Sound) {
  /**
   * Enable sound
   * @param {string} key Key name
   * @param {string} value Value
   * @memberof Storage
   */
  Sound.enable = () => {
    Registry.persistent.set((draft) => {
      draft.Sound.isEnabled = true;
    });
  };

  /**
   * Disable sound
   * @memberof Sound
   */
  Sound.disable = () => {
    Registry.persistent.set((draft) => {
      draft.Sound.isEnabled = false;
    });
  };

  /**
   * Check if sound is enabled
   * @memberof Sound
   */
  Sound.isEnabled = () => Registry.persistent.get().Sound.isEnabled;
}

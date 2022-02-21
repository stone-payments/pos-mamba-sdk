const ThisStore = {
  _storedModel: undefined,
};

/**
 * All models available
 * @returns {Object} All models.
 */
export const MODELS = Object.freeze({
  S920: 'S920',
  Q92: 'Q92',
  MP35P: 'Gertec MP35P',
  MP35: 'Gertec MP35',
  V240M: 'Verifone V240M',
  D195: 'D195',
  Q60: 'Q60',
  D230: 'D230',
  D199: 'D199',
});

/**
 * Default mamba model
 * @returns {string} Default mamba model
 */
export const DEFAULT_MODEL = MODELS.S920;

/**
 * List Model slugs
 * @returns {array} return a list os model slugs
 */
export const MODELS_SLUGS = Object.keys(MODELS);

/**
 * Model slugs key pair
 * @returns {object} return Pos Model available slugs key pair
 */
const _slugs = MODELS_SLUGS.reduce((result, model) => {
  result[MODELS[model]] = model;
  return result;
}, {});

export const AVAILABLE_SLUGS = _slugs;

/**
 * Checks if the method exists
 * @returns {String} return Pos Model
 */
export const getPosModel = () => {
  const { _storedModel } = ThisStore;
  // Return cached value on POS. Just need run once.
  if (__POS__ && typeof _storedModel === 'string') {
    return _storedModel;
  }

  let _model = DEFAULT_MODEL;

  try {
    /* Necessary because the circular dependency with simulator */
    const _system = window.$System || window.System;
    _model = _system.getPosModel();
  } catch (error) {
    if (__DEV__) console.error(error);
  }

  ThisStore._storedModel = _model;

  return ThisStore._storedModel;
};

/**
 * Get POS checks
 * @returns {object} return IS_ object key relative to the running pos
 */
export const getPOSChecksObject = () => {
  const model = getPosModel();
  return {
    IS_S920: model === MODELS.S920,
    IS_Q92: model === MODELS.Q92,
    IS_V240M: model === MODELS.V240M,
    IS_MP35: model === MODELS.MP35,
    IS_MP35P: model === MODELS.MP35P,
    IS_D195: model === MODELS.D195,
    IS_Q60: model === MODELS.Q60,
    IS_D230: model === MODELS.D230,
    IS_D199: model === MODELS.D199,
  };
};

/**
 * Get POS model slug
 * @returns {String} return Pos Model Slug
 */
export const getPosModelSlug = currentModel => {
  let activeModel = currentModel;
  if (!activeModel) {
    activeModel = getPosModel();
  }
  return AVAILABLE_SLUGS[activeModel] || DEFAULT_MODEL;
};

/**
 * Models categorization
 */

const _hasModelAtList = (list = []) => {
  return list.indexOf(getPosModel()) !== -1;
};

/**
 * Standard mamba devices
 * @returns {array} A list of standard devices
 */
export const STANDARD_MAMBA_DEVICES = [MODELS.S920, MODELS.Q92, MODELS.V240M];

/**
 * @returns {boolean} If current model is standard
 */
export function isStandardModel() {
  return _hasModelAtList(STANDARD_MAMBA_DEVICES);
}

/**
 * Small screen devices
 * @returns {array} A list of small screen devices
 */
export const SMALL_SCREEN_DEVICES = [
  MODELS.MP35P,
  MODELS.MP35,
  MODELS.D195,
  MODELS.D230,
  MODELS.Q60,
];

/**
 * @returns {boolean} If current model have a small screen
 */
export function hasSmallScreen() {
  return _hasModelAtList(SMALL_SCREEN_DEVICES);
}

/**
 * Arrow keys devices
 * @returns {array} A list of devices that can navigate by arrow keys
 */
export const ARROW_NAVIGATION_DEVICES = [
  MODELS.MP35P,
  MODELS.MP35,
  MODELS.D195,
  MODELS.D230,
  MODELS.Q60,
];

/**
 * @returns {boolean} If current model can navigate by arrows
 */
export function hasArrowNavigation() {
  return _hasModelAtList(ARROW_NAVIGATION_DEVICES);
}

/**
 * High DPI devices
 * @returns {array} A list of devices with high dpi
 */
export const HIGH_DPI_DEVICES = [MODELS.Q92, MODELS.D199];

/**
 * @returns {boolean} If current model have a high DPI screen
 */
export function hasHighDPI() {
  return _hasModelAtList(HIGH_DPI_DEVICES);
}

/**
 * Devices with Function Keys
 * @returns {array} A list of devices that have function keys
 */
export const FUNCTION_KEYS_DEVICES = [MODELS.MP35P, MODELS.MP35];

/**
 * @returns {boolean} If current model have function keys
 */
export function hasFunctionKeys() {
  return _hasModelAtList(FUNCTION_KEYS_DEVICES);
}

/**
 * Devices with only touch, like smartphone
 * @returns {array} A list of devices that is smartphone like screen, no keyboard.
 */
export const ONLY_TOUCH = [MODELS.D199];

/**
 * @returns {boolean} If current model have only touch screen(no keyboard)
 */
export function hasOnlyTouch() {
  return _hasModelAtList(ONLY_TOUCH);
}

/**
 * Devices with no touch capability
 * @returns {array} A list of devices that doesn't have touch screen
 */
export const NO_TOUCH = [MODELS.D195, MODELS.Q60, MODELS.D230];

/**
 * @returns {boolean} If current model have no touch screen
 */
export function hasNoTouch() {
  return _hasModelAtList(NO_TOUCH);
}

/**
 * Devices with no touch capability
 * @returns {array} A list of devices that have touch screen
 */
export const WITH_TOUCH = [
  MODELS.S920,
  MODELS.Q92,
  MODELS.MP35P,
  MODELS.MP35,
  MODELS.V240M,
  MODELS.D199,
];

/**
 * @returns {boolean} If current model has touch screen
 */
export function hasTouch() {
  return _hasModelAtList(WITH_TOUCH);
}

/**
 * Devices with no printer
 * @returns {array} A list of devices that doesn't have printer
 */
export const NO_PRINTER = [MODELS.MP35, MODELS.D199, MODELS.D195];

/**
 * @returns {boolean} If current model have no printer
 */
export function hasNoPrinter() {
  return _hasModelAtList(NO_PRINTER);
}

/**
 * PAX Devices
 * @returns {array} A list of devices from the manufacturer PAX
 */
export const PAX_DEVICES = [
  MODELS.S920,
  MODELS.Q92,
  MODELS.D195,
  MODELS.Q60,
  MODELS.D199,
  MODELS.D230,
];

/**
 * @returns {boolean} If the current model is from the PAX manufacturer
 */
export function isPAXDevices() {
  return _hasModelAtList(PAX_DEVICES);
}

/**
 * Verifone Devices
 * @returns {array} A list of devices from the manufacturer Verifone
 */
export const VERIFONE_DEVICES = [MODELS.V240M];

/**
 * @returns {boolean} If the current model is from the Verifone manufacturer
 */
export function isVerifoneDevices() {
  return _hasModelAtList(VERIFONE_DEVICES);
}

/**
 * Gertec Devices
 * @returns {array} A list of devices from the manufacturer Gertec
 */
export const GERTEC_DEVICES = [MODELS.MP35, MODELS.MP35P];

/**
 * @returns {boolean} If the current model is from the Gertec manufacturer
 */
export function isGertecDevices() {
  return _hasModelAtList(GERTEC_DEVICES);
}

export function getDeviceCapabilitiesClassList() {
  return [
    hasNoPrinter() && 'has-no-printer',
    hasTouch() && 'has-touch',
    hasNoTouch() && 'has-no-touch',
    hasOnlyTouch() && 'has-only-touch',
    hasFunctionKeys() && 'has-function-keys',
    hasHighDPI() && 'has-high-dpi',
    hasArrowNavigation() && 'has-arrow-navigation',
    hasSmallScreen() && 'has-small-screen',
    isStandardModel() && 'is-standard-model',
    isPAXDevices() && 'is-pax',
    isVerifoneDevices() && 'is-verifone',
    isGertecDevices() && 'is-gertec',
  ].filter(Boolean);
}

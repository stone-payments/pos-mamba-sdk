import _kebabCase from 'lodash/fp/kebabCase';

const ThisStore = {
  _storedModel: undefined,
};

/**
 * @description Check if method is available via Mamba
 * @returns {boolean}
 */
function VerifyMethodOnSystemWrapper(method) {
  if (!__POS__) return undefined;

  try {
    /* Necessary because the circular dependency with simulator */
    const _system = window.$System || window.System;

    // if it finds method, run it
    if (typeof _system[method] === 'function') return _system[method]();
  } catch (_) {
    // code not needed here, created just to don't crash app
  }

  return undefined;
}

/**
 * #####################
 * ###### MODELS #######
 * #####################
 */

/**
 * @description All models available
 * @returns {Object} All models.
 */
export const MODELS = Object.freeze({
  GENERIC: 'GENERIC',
  S920: 'S920',
  Q92: 'Q92',
  Q92S: 'Q92S',
  MP35P: 'Gertec MP35P',
  MP35: 'Gertec MP35',
  V240M: 'Verifone V240M',
  D195: 'D195',
  Q60: 'Q60',
  D230: 'D230',
  D199: 'D199',
});

/**
 * @description Default mamba model
 * @returns {string} Default mamba model
 */
export const DEFAULT_MODEL = MODELS.S920;

/**
 * @description List Model slugs
 * @returns {array} return a list os model slugs
 */
export const MODELS_SLUGS = Object.keys(MODELS);

/**
 * @description Model slugs key pair
 * @returns {object} return Pos Model available slugs key pair
 */
const _slugs = MODELS_SLUGS.reduce((result, model) => {
  result[MODELS[model]] = model;
  return result;
}, {});

export const AVAILABLE_SLUGS = _slugs;

/**
 * @description Checks if the method exists
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
 * @description Return a sanitized version of pos model, compatible for class names.
 * @param {String} model other model to sanitize
 * @returns {String} return sanitized Pos Model
 */
export const getSanitizedPosModel = (model = undefined) => {
  return _kebabCase(String(model || getPosModel()))
    .toUpperCase()
    .replace(/-/g, '');
};

/**
 * @description Get POS checks
 * @returns {object} return IS_ object key relative to the running pos
 */
export const getPOSChecksObject = () => {
  const model = getPosModel();
  return {
    IS_S920: model === MODELS.S920,
    IS_Q92: model === MODELS.Q92,
    IS_Q92S: model === MODELS.Q92S,
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
 * @description Get POS model slug
 * @returns {String} return Pos Model Slug
 */
export const getPosModelSlug = (currentModel) => {
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
 * @description A list of devices from the manufacturer PAX
 * @returns {array}
 */
export const PAX_DEVICES = [
  MODELS.S920,
  MODELS.Q92,
  MODELS.Q92S,
  MODELS.D195,
  MODELS.Q60,
  MODELS.D199,
  MODELS.D230,
];

/**
 * Standard mamba devices
 * @deprecated
 * @returns {array} A list of standard devices
 */
export const STANDARD_MAMBA_DEVICES = [MODELS.S920, MODELS.Q92, MODELS.V240M];

/**
 * @deprecated
 * @returns {boolean} If current model is standard
 */
export function isStandardModel() {
  return _hasModelAtList(STANDARD_MAMBA_DEVICES);
}

/**
 * DON'T DELETE THIS METHOD! Used on Simulator
 * @deprecated
 * @returns {boolean} If the current model is from the PAX manufacturer
 */
export function isPAXDevices() {
  let value = VerifyMethodOnSystemWrapper('getPosBrand');

  if (typeof value === 'undefined') {
    value = _hasModelAtList(PAX_DEVICES);
    return value;
  }

  return value.toUpperCase() === 'PAX';
}

/**
 * Verifone Devices
 * @deprecated
 * @returns {array} A list of devices from the manufacturer Verifone
 */
export const VERIFONE_DEVICES = [MODELS.V240M];

/**
 * DON'T DELETE THIS METHOD! Used on Simulator
 * @deprecated
 * @returns {boolean} If the current model is from the Verifone manufacturer
 */
export function isVerifoneDevices() {
  let value = VerifyMethodOnSystemWrapper('getPosBrand');

  if (typeof value === 'undefined') {
    value = _hasModelAtList(VERIFONE_DEVICES);
    return value;
  }

  return value.toUpperCase() === 'VERIFONE';
}

/**
 * DON'T DELETE THIS METHOD! Used on Simulator
 * @description A list of devices from the manufacturer GERTEC
 * @deprecated
 * @returns {array}
 */
export const GERTEC_DEVICES = [MODELS.MP35, MODELS.MP35P];

/**
 * @deprecated
 * @returns {boolean} If the current model is from the Gertec manufacturer
 */
export function isGertecDevices() {
  let value = VerifyMethodOnSystemWrapper('getPosBrand');

  if (typeof value === 'undefined') {
    value = _hasModelAtList(GERTEC_DEVICES);
    return value;
  }

  return value.toUpperCase() === 'GERTEC';
}

/**
 * #####################
 * ###### SCREEN #######
 * #####################
 */

/**
 * @description Small screen devices
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
 * #####################
 * ### CAPABILITIES ####
 * #####################
 */

/**
 * @description If current model have a small screen
 * @returns {boolean}
 */
export function hasSmallScreen() {
  let value = VerifyMethodOnSystemWrapper('hasSmallScreen');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = _hasModelAtList(SMALL_SCREEN_DEVICES);
  }

  return value;
}

/**
 * @description Arrow keys devices
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
 * @description If current model can navigate by arrows
 * @returns {boolean}
 */
export function hasArrowNavigation() {
  let value = VerifyMethodOnSystemWrapper('hasArrowNavigation');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = _hasModelAtList(ARROW_NAVIGATION_DEVICES);
  }

  return value;
}

export const HAS_KEYBOARD = [
  MODELS.S920,
  MODELS.Q92,
  MODELS.Q92S,
  MODELS.MP35P,
  MODELS.MP35,
  MODELS.V240M,
  MODELS.D195,
  MODELS.Q60,
  MODELS.D230,
];

/**
 * @description If current model has physical keyboard
 * @returns {boolean} If current model has physical keyboard
 */
export function hasKeyboard() {
  let value = VerifyMethodOnSystemWrapper('hasKeyboard');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = _hasModelAtList(HAS_KEYBOARD);
  }

  return value;
}

/**
 * @description Devices with keyboard light
 * @returns {array} A list of devices that has keyboard light
 */
export const HAS_KEYBOARD_LIGHT = [MODELS.MP35P, MODELS.D230, MODELS.S920, MODELS.Q92, MODELS.Q92S];

/**
 * @description If current model have keyboard light
 * @returns {boolean} If current model has keyboard light
 */
export function hasKeyboardLight() {
  let value = VerifyMethodOnSystemWrapper('hasKeyboardLight');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = _hasModelAtList(HAS_KEYBOARD_LIGHT);
  }

  return value;
}

/**
 * @description Devices with no touch capability
 * @returns {array} A list of devices that have touch screen
 */
export const WITH_TOUCH = [
  MODELS.S920,
  MODELS.Q92,
  MODELS.Q92S,
  // MP35(P) no longer have touch, but this static declaration may be used only on simulator.
  // MODELS.MP35P,
  // MODELS.MP35,
  MODELS.V240M,
  MODELS.D199,
  MODELS.D230,
];

/**
 * @description If current model has touch screen
 * @returns {boolean}
 */
export function hasTouch() {
  let value = VerifyMethodOnSystemWrapper('hasTouch');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = _hasModelAtList(WITH_TOUCH);
  }

  return value;
}

/**
 * @description If current model have only touch screen (no physical keyboard)
 * @returns {boolean}
 */
export function hasOnlyTouch() {
  return !hasKeyboard();
}

/**
 * @description If current model have no touch screen
 * @returns {boolean}
 */
export function hasNoTouch() {
  return !hasTouch();
}

/**
 * @description Devices with no printer
 * @returns {array} A list of devices that doesn't have printer
 */
export const NO_PRINTER = [MODELS.MP35, MODELS.D199, MODELS.D195];

/**
 * @description If current model have printer
 * @returns {boolean}
 */
export function hasPrinter() {
  let value = VerifyMethodOnSystemWrapper('hasPrinter');

  /** negation explained on hasNoTouch() */
  if (typeof value === 'undefined') {
    value = !_hasModelAtList(NO_PRINTER);
  }

  return value;
}

/**
 * @description If current model have no printer
 * @returns {boolean}
 */
export function hasNoPrinter() {
  return !hasPrinter();
}

/**
 * #####################
 * ###### NETWORK ######
 * #####################
 */

/**
 * @description If POS has an Ethernet adapter
 * @returns {boolean}
 */
export function hasEthernet() {
  return VerifyMethodOnSystemWrapper('hasEthernet');
}
/**
 * @description If POS has a WiFi adapter
 * @returns {boolean}
 */
export function hasWifi() {
  return VerifyMethodOnSystemWrapper('hasWifi');
}
/**
 * @description If POS has a GPRS adapter
 * @returns {boolean}
 */
export function hasGprs() {
  return VerifyMethodOnSystemWrapper('hasGprs');
}

/**
 * #####################
 * #### DEPRECATED ####
 * #####################
 *
 * @description deprecated methods since @mamba/utils v6.0.0
 *
 */

/**
 * High DPI devices
 *
 * @DEPRECATED since @mamba/utils v6.0.0
 *
 * @description A list of devices with high dpi
 * @returns {array}
 */
export const HIGH_DPI_DEVICES = [MODELS.Q92, MODELS.D199];

/**
 * @DEPRECATED since @mamba/utils v6.0.0
 *
 * @description If current model have a high DPI screen
 * @returns {boolean}
 */
export function hasHighDPI() {
  return _hasModelAtList(HIGH_DPI_DEVICES);
}

/**
 * Devices with Function Keys
 *
 * @DEPRECATED since @mamba/utils v6.0.0
 *
 * @description A list of devices that have function keys
 * @returns {array}
 */
export const FUNCTION_KEYS_DEVICES = [MODELS.MP35P, MODELS.MP35];

/**
 * @DEPRECATED since @mamba/utils v6.0.0
 *
 * @description If current model have function keys
 * @returns {boolean}
 */
export function hasFunctionKeys() {
  return _hasModelAtList(FUNCTION_KEYS_DEVICES);
}

export function getDeviceCapabilitiesClassList() {
  return [
    // SCREEN
    hasSmallScreen() && 'has-small-screen',
    // CAPABILITY
    hasNoPrinter() && 'has-no-printer',
    hasTouch() && 'has-touch',
    hasNoTouch() && 'has-no-touch',
    hasOnlyTouch() && 'has-only-touch',
    hasPrinter() && 'has-printer',
    hasKeyboard() && 'has-keyboard',
    hasArrowNavigation() && 'has-arrow-navigation',
    hasKeyboardLight() && 'has-keyboard-light',
    // NETWORK
    hasEthernet() && 'has-ethernet',
    hasWifi() && 'has-wifi',
    hasGprs() && 'has-gprs',
    // DEPRECATED
    hasFunctionKeys() && 'has-function-keys',
    hasHighDPI() && 'has-high-dpi',
    isStandardModel() && 'is-standard-model',
    isPAXDevices() && 'is-pax',
    isVerifoneDevices() && 'is-verifone',
    isGertecDevices() && 'is-gertec',
  ].filter(Boolean);
}

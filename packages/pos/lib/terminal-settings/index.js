const types = ['string', 'object', 'boolean', 'number'];
const binary = ['1', '0', 1, 0];
let _settings;
let _flagList = [];

const isUndefined = v => typeof v === 'undefined';
const isString = v => typeof v === 'string';
const isObject = x => {
  return x !== null && typeof x === 'object';
};

const hasBoB = s => {
  if (!isString(s)) return s;
  return s.indexOf('[') !== -1 || s.indexOf('{') !== -1;
};

const hasType = t => {
  return t !== null && types.indexOf(typeof t) !== -1;
};

const decodeTrimString = s => {
  if (!isString(s)) return s;
  try {
    return decodeURIComponent(escape(s.trim()));
  } catch (_) {
    return s;
  }
};

/**
 * @return {String} Properly formatted
 */
const normal = s => (typeof s === 'string' && s.toUpperCase()) || s;

/**
 * @return {Boolean} Cast prop to boolean
 */
const tryBoolean = b => {
  if (['TRUE', 'FALSE', 'true', 'false'].concat(binary).indexOf(b) === -1) {
    return undefined;
  }

  if (binary.indexOf(b) !== -1) {
    return b === '1' || b === 1;
  }
  const final = normal(b).toLowerCase();
  return final === 'true';
};

/**
 * @return {Number} Cast prop to number
 */
const tryNumber = n => {
  if (typeof n === 'number') return n;
  if (!isString(n)) return undefined;
  if (n[0] === '0') return undefined;
  const number = Number(n);
  if (Number.isNaN(number)) return undefined;
  return number;
};

/**
 * @return {Object} Cast prop to Object
 */
const tryObject = o => {
  if (isObject(o)) return o;
  if (!isString(o)) return undefined;
  if (!hasBoB(o)) return o;
  try {
    return JSON.parse(o, (_, value) =>
      isString(value) ? decodeTrimString(value) : value,
    );
  } catch (_) {
    return null;
  }
};

/**
 * @return {string} Cast prop to string
 */
const tryString = s => {
  if (isString(s)) return decodeTrimString(s);
  return undefined;
};

const castValue = value => {
  const primitive = [tryBoolean, tryNumber, tryString, tryObject].reduce(
    (result, fn) => {
      const res = fn(result && hasBoB(result) ? result : value);
      if ((isUndefined(result) && !isUndefined(res)) || isObject(res)) {
        result = res;
      } else if (res === null) {
        // tryed parse object/array and fail, set null
        result = null;
      }
      return result;
    },
    undefined,
  );
  return primitive;
};

const parseSetting = (flag, list) => {
  const hasFlag = _flagList.some(f => flag === f);
  if (hasFlag) {
    const settingValue = castValue(list[flag]);
    /* if (__DEV__ || __DEBUG_LVL__ >= 2) {
      Log(
        `[TerminalSettings] \x1b[35m${flag}\x1b[0m \x1B[33m${typeof settingValue}\x1B[0m`,
        settingValue,
      );
    } */
    return settingValue;
  }
  return undefined;
};

const parseSettings = (flags, list) => {
  return flags.reduce((result, flag) => {
    const value = parseSetting(flag, list);
    if (!isUndefined(value)) {
      result[flag] = value;
    }
    return result;
  }, {});
};

const setParsedSettings = settings => {
  if (isObject(settings)) {
    _settings = settings;
    _flagList = Object.getOwnPropertyNames(_settings);
    const parsedSettings = parseSettings(_flagList, _settings);
    if (__DEV__ || __DEBUG_LVL__ >= 2) {
      // Log('[TerminalSettings parsed settings]');
      if (!__POS__) console.table(parsedSettings, ['flag', 'value']);
    }

    return parsedSettings;
  }
  return {};
};

export default {
  _parsedSettings: undefined,
  _updated: false,
  _updateNext: false,

  /**
   * Should force update next time
   */
  mustUpdate() {
    this._updateNext = true;
  },

  /**
   * Update feature flags
   *
   * @return {Object} Object contains valid feature flags value
   */
  update() {
    if (
      !this._updateNext &&
      this._updated === true &&
      isObject(this._parsedSettings)
    ) {
      return this._parsedSettings;
    }

    /* Necessary because the circular dependency with simulator */
    if (
      window.$System &&
      typeof window.$System.getUserSettings !== 'function'
    ) {
      console.error('System.getUserSettings not present');
      return {};
    }
    const current = window.$System.getUserSettings();
    this._parsedSettings = setParsedSettings(current);
    if ((__DEV__ || __DEBUG_LVL__ >= 2) && __POS__) {
      console.log(
        `\x1b[37m[TerminalSettings System.getUserSettings] ${JSON.stringify(
          this._parsedSettings,
          null,
          2,
        )}`,
      );
    }
    this._updated = true;
    return this._parsedSettings;
  },

  /**
   * Get all cached valid feature flags values
   *
   * @return {Object} Object contains valid feature flags
   */
  getSettings() {
    if (isObject(this._parsedSettings) === false) {
      return this.update();
    }
    return this._parsedSettings;
  },

  /**
   * Get property valid value
   *
   * @param {string} flag
   * @param {any} _default
   * @return {any} Feature Flag value
   */
  getSetting(flag, _default) {
    if (!flag) {
      const err = new Error(`[TerminalSettings] flag cannot be null`);
      console.log(
        `\u001b[1;31m[TerminalSettings.getSetting] ${JSON.stringify(
          err,
        )}\u001b[0m`,
      );
      throw err;
    }

    /* Necessary because the circular dependency with simulator */
    if (window.$System && typeof window.$System.getUserSetting !== 'function') {
      console.error('System.getUserSetting not present');
      return undefined;
    }

    const rawSetting = window.$System.getUserSetting(String(flag));
    const parsedSetting = castValue(rawSetting);

    const setting = hasType(parsedSetting) ? parsedSetting : _default;

    if (__DEV__ || __DEBUG_LVL__ >= 2) {
      const sstring = JSON.stringify(setting, null, 2);
      console.log(
        `📘 \x1b[36m[TerminalSettings getSetting]\n\t\x1b[33mFlag: \x1b[39m${typeof rawSetting} ${flag}\n\t\x1b[33mRaw: \x1b[39m${rawSetting}\n\t\x1b[33mFinal: \x1b[39m${sstring}\x1B[0m`,
      );
    }
    return setting;
  },
};

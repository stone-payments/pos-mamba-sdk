function isObject(obj) {
  return obj && obj.constructor === Object;
}

function isSameType(value, newValue) {
  return typeof value === typeof newValue;
}

function replaceValue(value, newValue) {
  if (isSameType(value, newValue) === false) {
    return value;
  }

  if (isObject(value) && isObject(newValue)) {
    // eslint-disable-next-line no-use-before-define
    return mergeJSON(value, newValue);
  }

  return newValue;
}

function mergeJSON(obj, source) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(key)) {
      obj[key] = replaceValue(obj[key], source[key]);
    }
  }
  return obj;
}

export function getAppOrgParams(defaultAppOrgParams) {
  try {
    const orgFileContents = window.Org.getOrganizationFile(__APP_MANIFEST__.id);
    return mergeJSON(defaultAppOrgParams, JSON.parse(orgFileContents));
  } catch (_) {
    return defaultAppOrgParams;
  }
}

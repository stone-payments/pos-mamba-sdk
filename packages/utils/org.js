export function getAppOrgParams(defaultAppOrgParams) {
  try {
    const xhr = new XMLHttpRequest();

    xhr.overrideMimeType('application/json; charset=utf-8');
    xhr.open('GET', window.Org.getOrgConfigFilePath(), false);
    xhr.send(null);

    // status should be 200 but when running in POS it always returns 0.
    if (xhr.status === 0 || xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    }
  } catch (_) {
    return defaultAppOrgParams;
  }
}

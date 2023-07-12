/**
 * @param {string} path
 * @returns {string}
 */
function shouldAddVirtualPath(path) {
  if (!path.includes(__VIRTUAL_POS_PATH__)) {
    path = `${__VIRTUAL_POS_PATH__}/${path}`;
  }

  return path;
}

/**
 *
 * @param {string} fileName
 * @returns
 */
export async function loadVirtualPosJson(fileName) {
  if (!fileName) throw new Error('invalid file name');
  const jsonFile = await fetch(shouldAddVirtualPath(fileName)).then((res) => res.json());

  return jsonFile;
}

/**
 *
 * @param {string} fileName
 * @returns
 */
export function loadVirtualPosFileSync(fileName) {
  if (!fileName) throw new Error('invalid file name');
  const request = new XMLHttpRequest();
  request.open('GET', shouldAddVirtualPath(fileName), false);
  request.send(null);

  if (request.status !== 200) {
    return undefined;
  }

  return request.responseText;
}

export default loadVirtualPosJson;

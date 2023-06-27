/**
 *
 * @param {string} fileName
 * @returns
 */
export async function loadVirtualPosJson(fileName) {
  if (!fileName) throw new Error('invalid file name');
  const jsonFile = await fetch(`${__VIRTUAL_POS_PATH__}/${fileName}`).then((res) => res.json());

  return jsonFile;
}

export default loadVirtualPosJson;

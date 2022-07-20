exports.removeDiacritics = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** From: https://gist.github.com/vaiorabbit/5657561 */
exports.hashString = (str) => {
  /* eslint-disable */
  const FNV1_32A_INIT = 0x811c9dc5;
  let hval = FNV1_32A_INIT;
  for (let i = 0; i < str.length; ++i) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return hval >>> 0;
  /* eslint-enable */
};

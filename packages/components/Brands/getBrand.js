import { BRANDS, BLANK } from './constants.js';

const getBrand = brandName => {
  if (typeof brandName === 'string') {
    const brand = brandName.toUpperCase();
    const file = typeof BRANDS[brand] === 'undefined' ? BLANK : BRANDS[brand];
    return file;
  }

  return BLANK;
};

export default getBrand;

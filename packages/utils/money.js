/** Format a number to XXX.XXX,XX format */
export const format = (n) => {
  if (typeof n !== 'number') {
    throw new Error('format() only accepts a number as a parameter');
  }

  return n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/* Add a leading zero to a number/string if needed */
export const padZero = (n) => {
  if (typeof n === 'number') {
    return (n < 10 ? '0' : '') + n;
  }

  if (typeof n === 'string' && n.length === 1) {
    return `0${n}`;
  }

  throw new Error(`padZero() only accepts numbers and strings. A "${typeof n}" was passed `);
};

/**
 * Methods to approximate rounding with currency values.
 * Uses exponential to prevent js calculation errors
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * */
export const floor = (value, decimals = 2) =>
  Number(`${Math.floor(`${parseFloat(value)}e${decimals}`)}e-${decimals}`);

export const round = (value, decimals = 2) =>
  Number(`${Math.round(`${parseFloat(value)}e${decimals}`)}e-${decimals}`);

export const ceil = (value, decimals = 2) =>
  Number(`${Math.ceil(`${parseFloat(value)}e${decimals}`)}e-${decimals}`);

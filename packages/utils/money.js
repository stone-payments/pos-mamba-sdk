/** Format a number to XXX.XXX,XX format */
export const format = n => {
  if (typeof n === 'number') {
    n = n.toFixed(2);
  }

  return n
    .toString()
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/* Add a leading zero to a number/string if needed */
export const padZero = n => {
  if (typeof n === 'number') {
    return (n < 10 ? '0' : '') + n;
  }

  if (typeof n === 'string' && n.length === 1) {
    return `0${n}`;
  }

  throw new Error(
    `padZero() only accepts numbers and strings. A was ${typeof n} passed `,
  );
};

/**
 * Uses exponential to prevent js calculation errors
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * */
export const floor = (value, decimals = 2) =>
  Number(`${Math.floor(`${parseFloat(value)}e${decimals}`)}e-${decimals}`);

export const round = (value, decimals = 2) =>
  Number(`${Math.round(`${parseFloat(value)}e${decimals}`)}e-${decimals}`);

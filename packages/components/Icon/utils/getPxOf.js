export default function getPxOf(prop = '', value = undefined) {
  if (typeof value === 'string') {
    if (/^[0-9]+(px|em|rem)$/g.test(value)) {
      return `${prop}: ${value}`;
    }
    return getPx(Number(value));
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return `${prop}: ${value}px`;
  }
}

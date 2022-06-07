export default function getPxOf(prop = '', value = undefined) {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return `${prop}: ${value}px`;
  }

  return `${prop}: ${value}`;
}

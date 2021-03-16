export default function getNumberWithDefault(
  value = undefined,
  _default = undefined,
) {
  if (typeof value === 'string') {
    return getNumberWithDefault(Number(value));
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  return _default;
}

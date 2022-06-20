/**
 * Transforms an arbitrary string to camelCase
 *
 * @param str The string to transform.
 */
export function camelCase(str: string): string {
  if (!str) return '';

  return (
    str
      .toLowerCase()
      .trim()
      .split(/[.\-_\s]/g)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .reduce((str, word) => (word.length ? str + word[0].toUpperCase() + word.slice(1) : str))
  );
}

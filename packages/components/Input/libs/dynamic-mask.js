import maskit from './maskit.js';

export default function dynamicMask(masks) {
  masks = masks.sort((a, b) => a.length - b.length);

  return (value, mask, masked = true, tokens) => {
    let i = 0;
    while (i < masks.length) {
      const currentMask = masks[i];
      const nextMask = masks[++i];

      if (
        !(
          nextMask &&
          maskit(value, nextMask, true, tokens).length > currentMask.length
        )
      ) {
        return maskit(value, currentMask, masked, tokens);
      }
    }
    return ''; // empty masks
  };
}

export default function maskit(value = '', mask = '', masked = true, tokens = undefined) {
  let iMask = 0;
  let iValue = 0;
  let output = '';

  while (iMask < mask.length && iValue < value.length) {
    let cMask = mask[iMask];

    const masker = tokens[cMask];
    const cValue = value[iValue];

    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue;
        iMask++;
      }
      iValue++;
    } else {
      if (masker && masker.escape) {
        iMask++; // take the next mask char and treat it as char
        cMask = mask[iMask];
      }
      if (masked) output += cMask;
      if (cValue === cMask) iValue++; // user typed the same char
      iMask++;
    }
  }

  // fix mask that ends with a char: (#)
  let restOutput = '';

  while (iMask < mask.length && masked) {
    const cMask = mask[iMask];
    if (tokens[cMask]) {
      restOutput = '';
      break;
    }
    restOutput += cMask;
    iMask++;
  }

  return output + restOutput;
}

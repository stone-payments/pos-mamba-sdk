export default function isSomeInputElement(i) {
  [
    'Input',
    'Label',
    'Select',
    'TextArea',
    'Button',
    'FieldSet',
    'Legend',
    'Output',
    'Option',
    'OptGroup',
  ].some(cl => {
    try {
      return i instanceof window[`HTML${cl}Element`];
    } catch (_) {
      return false;
    }
  });
}

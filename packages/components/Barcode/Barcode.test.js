import Barcode from './Barcode.html';

const { newTestApp } = global;

let root;

beforeEach(() => {
  root = newTestApp();
});

it('should hide barcode value.', () => {
  root.createComponent(Barcode, { displayValue: false });
  expect(root.query('label')).toBe(null);
});

it('should show barcode value.', () => {
  root.createComponent(Barcode);
  expect(root.query('.label')).not.toBeNull();
});

it('should have src attribute in barcode img', () => {
  root.createComponent(Barcode, { data: { data: 'testing' } });
  expect(root.query('.barcode').hasAttribute('src'));
});

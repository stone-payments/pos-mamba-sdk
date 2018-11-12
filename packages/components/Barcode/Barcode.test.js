import Barcode from './Barcode.html';

const target = document.body;
let barcodeComponent;

const newBarcode = data => {
  barcodeComponent = new Barcode({
    target,
    data,
  });
  return barcodeComponent;
};

beforeEach(() => {
  document.body.innerHTML = '';
});

it('should hide barcode value.', () => {
  newBarcode({
    displayValue: false,
  });
  expect(document.querySelector('label')).toBe(null);
});

it('should show barcode value.', () => {
  newBarcode();
  expect(document.querySelector('.label')).not.toBeNull();
});

it('should have src attribute in barcode img', () => {
  newBarcode({
    data: 'testing',
  });
  expect(document.querySelector('.barcode').hasAttribute('src'));
});

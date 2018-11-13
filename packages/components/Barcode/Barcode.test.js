import Barcode from './Barcode.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Barcode({ target, data });
  return component;
};

it('should hide barcode value.', () => {
  newInstance({ displayValue: false });
  expect(target.querySelector('label')).toBe(null);
});

it('should show barcode value.', () => {
  newInstance();
  expect(target.querySelector('.label')).not.toBeNull();
});

it('should have src attribute in barcode img', () => {
  newInstance({ data: 'testing' });
  expect(target.querySelector('.barcode').hasAttribute('src'));
});

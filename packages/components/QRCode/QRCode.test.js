import QRCode from './QRCode.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new QRCode({ target, data });
  return component;
};

it('should hide logo image without logo', () => {
  newInstance();

  expect(target.querySelector('.logo')).toBe(null);
});

it('should show logo image.', () => {
  newInstance({ logo: './example/static/logo.png' });

  expect(target.querySelector('.logo')).not.toBeNull();
});

it('should hide logo image with small size.', () => {
  newInstance({
    size: 'small',
    logo: './example/static/logo.png',
  });

  expect(target.querySelector('.logo')).toBe(null);
});

it('should hide logo image with small size and without logo.', () => {
  newInstance({ size: 'small' });

  expect(target.querySelector('.logo')).toBe(null);
});

it('should create new QRCode image when Component updates', () => {
  newInstance({
    level: 'M',
    color: 'black',
    value: 'testing',
    logo: './example/static/logo.png',
  });

  expect(component.refs.qrImg.hasAttribute('src')).toBe(true);
});

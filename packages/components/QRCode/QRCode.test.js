import QRCode from './QRCode.html';

const target = document.body;
let qrCodeComponent;

const newQRCode = data => {
  qrCodeComponent = new QRCode({
    target,
    data,
  });
  return qrCodeComponent;
};

beforeEach(() => {
  document.body.innerHTML = '';
});

it('should hide logo image without logo', () => {
  newQRCode({
    size: 'medium',
    logo: undefined,
  });
  expect(document.querySelector('.logo')).toBe(null);
});

it('should show logo image.', () => {
  newQRCode({
    size: 'medium',
    logo: './example/static/logo.png',
  });
  expect(document.querySelector('.logo')).not.toBeNull();
});

it('should hide logo image with small size.', () => {
  newQRCode({
    size: 'small',
    logo: './example/static/logo.png',
  });
  expect(document.querySelector('.logo')).toBe(null);
});

it('should hide logo image with small size and without logo.', () => {
  newQRCode({
    size: 'small',
    logo: undefined,
  });
  expect(document.querySelector('.logo')).toBe(null);
});

it('should hide logo image when size is small.', () => {
  newQRCode({
    size: 'small',
  });
  expect(document.querySelector('.logo')).toBe(null);
});

it('should create new QRCode image when Component updates', () => {
  newQRCode({
    size: 'medium',
    level: 'M',
    color: 'black',
    value: 'testing',
    logo: './example/static/logo.png',
  });
  expect(qrCodeComponent.refs.qrImg.hasAttribute('src')).toBe(true);
});

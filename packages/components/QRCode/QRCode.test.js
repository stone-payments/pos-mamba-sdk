import QRCode from './QRCode.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newQRCode = data => root.createComponent(QRCode, { unique: true, data });

it('should hide logo image without logo', () => {
  newQRCode();

  expect(root.query('.logo')).toBe(null);
});

it('should show logo image.', () => {
  newQRCode({ logo: './example/static/logo.png' });

  expect(root.query('.logo')).not.toBeNull();
});

it('should hide logo image with small size.', () => {
  newQRCode({
    size: 'small',
    logo: './example/static/logo.png',
  });

  expect(root.query('.logo')).toBe(null);
});

it('should hide logo image with small size and without logo.', () => {
  newQRCode({ size: 'small' });

  expect(root.query('.logo')).toBe(null);
});

it('should create new QRCode image when Component updates', () => {
  const qr = newQRCode({
    level: 'M',
    color: 'black',
    value: 'testing',
    logo: './example/static/logo.png',
  });

  expect(qr.refs.qrImg.hasAttribute('src')).toBe(true);
});

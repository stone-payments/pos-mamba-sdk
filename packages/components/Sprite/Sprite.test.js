import Sprite from './Sprite.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) component.destroy();
  component = new Sprite({ target, data });
  return component;
};

Object.defineProperty(Image.prototype, 'src', {
  set() {
    this.onload();
  },
});

beforeEach(() => {
  component = newInstance({ src: './example/static/stone.png' });
});

it('should automatically start after image loading', () => {
  expect(typeof component.get()._interval).toBe('number');
});

it('should stop the sprite animation interval', () => {
  expect(typeof component.stop).toBe('function');

  component.stop();

  expect(component.get()._interval).toBe(null);
});

it('should start the sprite animation interval', () => {
  expect(typeof component.start).toBe('function');

  component.start();

  expect(typeof component.get()._interval).toBe('number');
});

import Sprite from './Sprite.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newSprite = data => root.createComponent(Sprite, { unique: true, data });

let sprite;

Object.defineProperty(Image.prototype, 'src', {
  set() {
    this.onload();
  },
});

beforeEach(() => {
  sprite = newSprite({ src: './example/static/stone.png' });
});

it('should automatically start after image loading', () => {
  expect(typeof sprite.get()._interval).toBe('number');
});

it('should stop the sprite animation interval', () => {
  expect(typeof sprite.stop).toBe('function');

  sprite.stop();

  expect(sprite.get()._interval).toBe(null);
});

it('should start the sprite animation interval', () => {
  expect(typeof sprite.start).toBe('function');

  sprite.start();

  expect(typeof sprite.get()._interval).toBe('number');
});

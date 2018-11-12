import Sprite from './Sprite.html';

const target = document.body;
let spriteComponent;

const newSprite = data => {
  spriteComponent = new Sprite({ target, data });
  return spriteComponent;
};

newSprite({ src: './example/static/stone.png' });

beforeAll(() => {
  Object.defineProperty(Image.prototype, 'src', {
    set() {
      this.onload();
    },
  });
});

describe('behavior', () => {
  beforeAll(() => {
    newSprite({ src: './example/static/stone.png' });
  });

  it('should automatically start after image loading', () => {
    expect(typeof spriteComponent.get()._interval).toBe('number');
  });
});

describe('methods', () => {
  beforeAll(() => {
    newSprite({ src: './example/static/stone.png' });
  });

  it('should stop the sprite animation interval', () => {
    expect(typeof spriteComponent.stop).toBe('function');
    spriteComponent.stop();
    expect(spriteComponent.get()._interval).toBe(null);
  });

  it('should start the sprite animation interval', () => {
    expect(typeof spriteComponent.start).toBe('function');
    spriteComponent.start();
    expect(typeof spriteComponent.get()._interval).toBe('number');
  });
});

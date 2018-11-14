import Circular from './Circular.html';

const wrapper = document.body;

const newTestable = data => {
  const {
    refs: { canvas },
  } = new Circular({
    target: wrapper,
    data,
  });
  return { canvas, ctx: canvas.getContext('2d') };
};

describe('Circular', () => {
  it('should create the default canvas', () => {
    const { canvas, ctx } = newTestable();
    expect(canvas).not.toBeUndefined();
    expect(typeof ctx).toEqual('object');
  });

  // Must do bar size specific test
  describe('size', () => {
    it('should render spinner with radius', () => {
      const { canvas } = newTestable({ height: '60px' });
      expect(canvas.width).toBe('60px');
      expect(canvas.height).toBe('60px');
    });
  });
});

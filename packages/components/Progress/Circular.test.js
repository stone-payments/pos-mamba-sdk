import Circular from './Circular.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }

  component = new Circular({ target, data });

  return component;
};

it('should create the default canvas', () => {
  newInstance();

  expect(component.refs.canvas).not.toBeUndefined();
});

it('should render spinner with specified size', () => {
  newInstance({ height: '60px' });

  expect(component.refs.canvas.width).toBe('60px');
  expect(component.refs.canvas.height).toBe('60px');
});

it('should NOT auto .start() when progress is  defined', () => {
  newInstance({ progress: 10 });
  expect(component.get()._interval).toBeNull();
});

it('should .stop() the spinner', () => {
  newInstance();

  component.stop();

  expect(component.get()._interval).toBeNull();
});

it('should .start() the spinner', () => {
  newInstance();

  component.stop();
  component.start();

  expect(component.get()._interval).not.toBeNull();
});

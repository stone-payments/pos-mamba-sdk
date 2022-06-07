import Circular from './Circular.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newCircularProgress = (data) => root.createComponent(Circular, { data });

let circular;

it('should create the default canvas', () => {
  circular = newCircularProgress();

  expect(circular.refs.canvas).not.toBeUndefined();
});

it('should render spinner with specified size', () => {
  circular = newCircularProgress({ height: '60px' });

  expect(circular.refs.canvas.width).toBe('60px');
  expect(circular.refs.canvas.height).toBe('60px');
});

it('should NOT auto .start() when progress is  defined', () => {
  circular = newCircularProgress({ progress: 10 });
  expect(circular.get()._interval).toBeNull();
});

it('should .stop() the spinner', () => {
  circular = newCircularProgress();

  circular.stop();

  expect(circular.get()._interval).toBeNull();
});

it('should .start() the spinner', () => {
  circular = newCircularProgress();

  circular.stop();
  circular.start();

  expect(circular.get()._interval).not.toBeNull();
});

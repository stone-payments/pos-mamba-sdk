import ProgressBar from './ProgressBar.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newProgressBar = data =>
  root.createComponent(ProgressBar, { unique: true, data });

it('should create the default component', () => {
  newProgressBar();

  expect(root.query('.progress-bar')).toBeTruthy();
  expect(root.query('.progress-bar.is-infinite')).not.toBeNull();
});

it('should match all params', () => {
  newProgressBar({
    progress: '30',
    height: '2px',
    color: 'blue',
  });

  const barEl = root.query('.progress-bar');

  expect(root.target.children[0]).not.toBeUndefined();

  expect(barEl).not.toBeUndefined();
  expect(barEl.children[0].style.width).toBe('30%');
  expect(barEl.style.height).toBe('2px');
  expect(barEl.style.backgroundColor).toBe('blue');
});

// Must do color/theme specific tests
describe('colors/theme', () => {
  it('should render bar with color', () => {
    newProgressBar({ color: 'red' });

    expect(root.query('.progress-bar').style.backgroundColor).toBe('red');
  });
});

// Must do bar size specific test
describe('sizes', () => {
  it('should render bar with height', () => {
    newProgressBar({ height: '12px' });

    expect(root.query('.progress-bar').style.height).toBe('12px');
  });
});

// Must do bar behavior specific tests
describe('custom progress', () => {
  it('should set bar progress', () => {
    newProgressBar({ progress: '85' });

    expect(root.query('.progress-bar').children[0].style.width).toBe('85%');
  });
});

describe('infinite bar', () => {
  it('infinite progress bar animation should start at -100%', () => {
    newProgressBar();

    const barEl = root.query('.progress-bar.is-infinite');

    expect(getComputedStyle(barEl.children[0]).transform).toBe(
      'translateX(-100%)',
    );
  });

  it('infinite progress bar width should have less than 100%', () => {
    newProgressBar();

    const barEl = root.query('.progress-bar.is-infinite');

    expect(getComputedStyle(barEl.children[0]).width).not.toBe('100%');
  });
});

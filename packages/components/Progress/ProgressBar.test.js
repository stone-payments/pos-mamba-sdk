import ProgressBar from './ProgressBar.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }

  component = new ProgressBar({ target, data });

  return component;
};

const getComputedStyle = node => window.getComputedStyle(node);

it('should create the default component', () => {
  newInstance();

  expect(target.children[0].classList.contains('progress-bar')).toBeTruthy();
  expect(target.querySelector('.progress-bar.is-infinite')).not.toBeNull();
});

it('should match all params', () => {
  newInstance({
    progress: '30',
    height: '2px',
    color: 'blue',
  });

  const barEl = target.querySelector('.progress-bar');

  expect(target.children[0]).not.toBeUndefined();

  expect(barEl).not.toBeUndefined();
  expect(barEl.children[0].style.width).toBe('30%');
  expect(barEl.style.height).toBe('2px');
  expect(barEl.style.backgroundColor).toBe('blue');
});

// Must do color/theme specific tests
describe('colors/theme', () => {
  it('should render bar with color', () => {
    newInstance({ color: 'red' });

    expect(target.children[0]).not.toBeUndefined();
    expect(target.children[0].style.backgroundColor).toBe('red');
  });
});

// Must do bar size specific test
describe('sizes', () => {
  it('should render bar with height', () => {
    newInstance({ height: '12px' });

    expect(target.children[0].style.height).toBe('12px');
  });
});

// Must do bar behavior specific tests
describe('custom progress', () => {
  it('should set bar progress', () => {
    newInstance({ progress: '85' });

    expect(target.querySelector('.progress-bar').children[0].style.width).toBe(
      '85%',
    );
  });
});

describe('infinite bar', () => {
  it('infinite progress bar animation should start at -100%', () => {
    newInstance();

    const barEl = target.querySelector('.progress-bar.is-infinite');

    expect(getComputedStyle(barEl.children[0]).transform).toBe(
      'translateX(-100%)',
    );
  });

  it('infinite progress bar width should have less than 100%', () => {
    newInstance();

    const barEl = target.querySelector('.progress-bar.is-infinite');

    expect(getComputedStyle(barEl.children[0]).width).not.toBe('100%');
  });
});

import Range from './Range.html';

const { newTestRoot, clickOn } = global;
let root;
let range;

const newRange = (data) => {
  root = newTestRoot();
  return root.createComponent(Range, { unique: true, data });
};

describe('Test Styles', () => {
  beforeAll(() => {
    range = newRange({
      icon: './example/static/brightness.png',
      min: 0,
      max: 100,
      step: 10,
      value: 0,
      unit: '%',
      mainColor: 'red',
      textColor: 'green',
      barColor: 'blue',
    });
  });

  it('should apply inline styles.', () => {
    expect(root.query('.track').style.backgroundColor).toBe('blue');
    expect(root.query('.indicator').style.color).toBe('green');
    expect(root.query('.bar').style.backgroundColor).toBe('red');

    root.queryAll('button').forEach((btn) => {
      expect(btn.style.backgroundColor).toBe('red');
    });
  });

  it('should display icon when icon is defined', () => {
    expect(root.query('.icon')).not.toBeNull();
  });

  it('should hide icon when icon is not defined', () => {
    range.set({ icon: undefined });
    expect(root.query('.icon')).toBeNull();
  });

  it('should display unit', () => {
    expect(root.query('.value').textContent).toContain('%');
  });

  it('should have correct width with % unit', () => {
    expect(parseInt('10', root.query('.value').textContent)).toBeLessThan(101);
    expect(parseInt('10', root.query('.value').textContent)).toBeGreaterThanOrEqual(0);
    expect(root.query('.value').textContent).toContain('%');
  });

  it('should have correct width with specific unit', () => {
    range = newRange({
      icon: './example/static/brightness.png',
      min: 0,
      max: 125,
      step: 10,
      value: 25,
      unit: 'm',
      mainColor: '#3da10f',
      textColor: '#494949',
      barColor: '#000',
    });
    range.set({ max: 125 });
    expect(root.query('.bar').style.width).toBe('20%');
  });

  it('should display actual value', () => {
    expect(root.query('.value').textContent).toBe('25m');
  });

  it('should set value as half when value is undefined', () => {
    range = newRange({
      icon: './example/static/brightness.png',
      min: 0,
      max: 100,
      step: 10,
      value: undefined,
      unit: '%',
      mainColor: '#3da10f',
      textColor: '#494949',
      barColor: '#000',
    });
    expect(root.query('.value').textContent).toBe('50%');
  });
});

describe('Test action buttons', () => {
  beforeAll(() => {
    range = newRange({
      icon: './example/static/brightness.png',
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      unit: '%',
      mainColor: '#3da10f',
      textColor: '#494949',
      barColor: '#000',
    });
  });

  it('should increment range value', () => {
    const btn = root.queryAll('button')[0];

    clickOn(btn);

    expect(range.get().value).toBe(40);
  });

  it('should decrement range value', () => {
    const btn = root.queryAll('button')[1];

    clickOn(btn);

    expect(range.get().value).toBe(50);
  });
});

describe('validation', () => {
  beforeAll(() => {
    range = newRange({
      icon: './example/static/brightness.png',
      min: 0,
      max: 100,
      step: 10,
      value: 50,
      unit: '%',
      validation: jest.fn(() => false),
    });
  });

  it('should prevent increment/decrement based on the validation method passed as prop', () => {
    range.increment();
    expect(range.get().value).toBe(50);

    range.decrement();
    expect(range.get().value).toBe(50);
  });

  it('should pass an { action, value, newValue } object to the validation method', () => {
    const { validation } = range.get();

    range.increment();
    expect(validation).toHaveBeenCalledWith(60);

    validation.mockClear();

    range.decrement();
    expect(validation).toHaveBeenCalledWith(40);
  });
});

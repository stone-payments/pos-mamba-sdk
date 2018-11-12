import Collection from './Collection.html';

const target = document.body;
let component;

const newInstance = data => {
  component = new Collection({
    target,
    data,
  });
  return component;
};

beforeEach(() => {
  component.destroy();
});

it('should show title', () => {
  newInstance({
    title: 'Hello tests',
  });
  expect(document.querySelector('title')).not.toBeNull();
});

it('should hide title', () => {
  newInstance();
  expect(document.querySelector('title')).toBe(null);
});

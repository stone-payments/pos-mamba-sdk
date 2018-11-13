import Collection from './Collection.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Collection({ target, data });

  return component;
};

it('should show title', () => {
  newInstance({
    title: 'Hello tests',
  });
  expect(target.querySelector('.title')).not.toBeNull();
});

it('should hide title', () => {
  newInstance();
  expect(target.querySelector('.title')).toBe(null);
});

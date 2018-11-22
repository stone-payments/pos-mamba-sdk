import Collection from './Collection.html';

const { newTestApp } = global;

const root = newTestApp();
const collection = root.createComponent(Collection);

it('should hide title', () => {
  expect(root.query('.title')).toBe(null);
});

it('should show title', () => {
  collection.set({ title: 'Hello tests' });
  expect(root.query('.title')).not.toBeNull();
});

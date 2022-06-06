import Collection from './Collection.html';

const { newTestRoot } = global;

const root = newTestRoot();
const newCollection = (data) => root.createComponent(Collection, { data });

it('should hide title', () => {
  newCollection();
  expect(root.query('.title')).toBe(null);
});

it('should show title', () => {
  newCollection({ title: 'Hello tests' });
  expect(root.query('.title')).not.toBeNull();
});

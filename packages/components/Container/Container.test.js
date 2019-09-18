import Container from './Container.html';

const { newTestRoot } = global;

const root = newTestRoot();

// eslint-disable-next-line
let containerComp;

const newContainer = () => root.createComponent(Container);

const getContainer = () => root.queryAll('.container');

it('should be object', () => {
  containerComp = newContainer();
  expect(typeof getContainer()).toBe('object');
});

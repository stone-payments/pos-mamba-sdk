import PromisedDialog from './Promised.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new PromisedDialog({ target, data });
  return component;
};

it('should accept a `promise` prop which opens the dialog', () => {
  newInstance({
    promise: new Promise(res => setTimeout(res, 100)),
  });
  expect(component.get().isOpen).toBe(true);
});

it('should accept a `delay` prop which delays closing the dialog', () => {
  newInstance({
    promise: new Promise(res => setTimeout(res, 100)),
    delay: 1000,
  });

  return Promise.all([
    new Promise(res =>
      setTimeout(
        () => component.get().isOpen && res(),
        component.get().delay / 2,
      ),
    ),
    new Promise(res =>
      setTimeout(
        () => !component.get().isOpen && res(),
        component.get().delay + 100,
      ),
    ),
  ]);
});

it('should automatically close the dialog along with promise resolvement', () => {
  newInstance({
    promise: new Promise(res => setTimeout(res, 100)),
    delay: 100,
  });

  return new Promise(res =>
    setTimeout(() => {
      if (!component.get().isOpen) res();
    }, component.get().delay + 200),
  );
});

it('should fire a "success" event if promise resolves', () => {
  newInstance({
    promise: new Promise(res => setTimeout(res, 100)),
  });
  return new Promise(res => component.on('success', res));
});

it('should fire a "failure" event if promise rejects', () => {
  newInstance({
    promise: new Promise((res, rej) => setTimeout(rej, 100)),
  });
  return new Promise(res => component.on('failure', res));
});

import PromisedDialog from './Promised.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newPromisedDialog = data =>
  root.createComponent(PromisedDialog, { unique: true, data });

it('should accept a `promise` prop which opens the dialog', () => {
  const dialog = newPromisedDialog({
    promise: new Promise(res => setTimeout(res, 100)),
  });
  expect(dialog.get().isOpen).toBe(true);
});

it('should accept a `delay` prop which delays closing the dialog', () => {
  const dialog = newPromisedDialog({
    promise: new Promise(res => setTimeout(res, 100)),
    delay: 1200,
  });

  return Promise.all([
    new Promise(res =>
      setTimeout(() => dialog.get().isOpen && res(), dialog.get().delay / 3),
    ),
    new Promise(res =>
      setTimeout(() => !dialog.get().isOpen && res(), dialog.get().delay + 300),
    ),
  ]);
});

it('should automatically close the dialog along with promise resolvement', () => {
  const dialog = newPromisedDialog({
    promise: new Promise(res => setTimeout(res, 100)),
    delay: 100,
  });

  return new Promise(res =>
    setTimeout(() => {
      if (!dialog.get().isOpen) res();
    }, dialog.get().delay + 200),
  );
});

it('should fire a "success" event if promise resolves', () => {
  const dialog = newPromisedDialog({
    promise: new Promise(res => setTimeout(res, 100)),
  });
  return new Promise(res => dialog.on('success', res));
});

it('should fire a "failure" event if promise rejects', () => {
  const dialog = newPromisedDialog({
    promise: new Promise((res, rej) => setTimeout(rej, 100)),
  });
  return new Promise(res => dialog.on('failure', res));
});

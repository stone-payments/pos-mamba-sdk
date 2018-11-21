import Dialog from './Dialog.html';

const { newComponent } = global;

let component;

it('should create a opened dialog with markup if `isOpen: true`', () => {
  component = newComponent(Dialog, { data: { isOpen: true } });

  expect(component.root.options.target.querySelector('.dialog')).not.toBeNull();

  return component.close();
});

it('should permanently open a dialog', () =>
  Promise.all([
    new Promise(res => component.on('open', res)),
    new Promise(res => setTimeout(() => component.get().isOpen && res(), 300)),
    component.open(),
  ]));

it('should close a dialog', () =>
  Promise.all([
    new Promise(res => component.on('close', res)),
    new Promise(res => setTimeout(() => !component.get().isOpen && res(), 300)),
    component.close(),
  ]));

it('should open a dialog and close after the specified time', () =>
  Promise.all([
    new Promise(res => component.on('close', res)),
    component.open(200),
  ]));

it('should close a opened dialog after the specified time', () => {
  component.open();
  return Promise.all([
    new Promise(res => component.on('close', res), component.close(200)),
  ]);
});

it('should make the app unscrollable when it opens and scrollable when it closes', () => {
  component = newComponent(Dialog);

  return component.open().then(() => {
    expect(component.root.meta.get().scrollable).toBe(false);
    return component.close().then(() => {
      expect(component.root.meta.get().scrollable).toBe(true);
    });
  });
});

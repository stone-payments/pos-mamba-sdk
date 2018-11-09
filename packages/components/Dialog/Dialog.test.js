import Dialog from './Dialog.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new Dialog({ target, data });
  return component;
};

const mockMeta = metaObj => {
  if (component) {
    component.root.meta = {
      set(o) {
        metaObj = { ...metaObj, ...o };
      },
      get() {
        return metaObj;
      },
    };
  }
};

it('should create a opened dialog with markup if `isOpen: true`', () => {
  newInstance({ isOpen: true });
  expect(target.querySelector('.dialog')).not.toBeNull();

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
  newInstance();
  mockMeta({ scrollable: true });

  return component.open().then(() => {
    expect(component.root.meta.get().scrollable).toBe(false);
    return component.close().then(() => {
      expect(component.root.meta.get().scrollable).toBe(true);
    });
  });
});

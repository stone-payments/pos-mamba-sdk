import Dialog from './Dialog.html';

const { newTestRoot } = global;

const root = newTestRoot();
root.meta = root.createDummy({
  data: {
    scrollable: false,
  },
  methods: {
    setNavigable(o) {
      this.set({ navigable: o });
    },
  },
});

let dialog;

const newDialog = data => root.createComponent(Dialog, { unique: true, data });

it('should create a opened dialog with markup if `isOpen: true`', () => {
  dialog = newDialog({ isOpen: true });

  expect(root.query('.dialog')).not.toBeNull();
  expect(root.meta.get().navigable).toBe(false);

  return dialog.close();
});

it('should permanently open a dialog', () =>
  Promise.all([
    new Promise(res => dialog.on('open', res)),
    new Promise(res => setTimeout(() => dialog.get().isOpen && res(), 300)),
    dialog.open(),
  ]));

it('should close a dialog', () =>
  Promise.all([
    new Promise(res => dialog.on('close', res)),
    new Promise(res => setTimeout(() => !dialog.get().isOpen && res(), 300)),
    dialog.close(),
  ]));

it('should open a dialog and close after the specified time', () =>
  Promise.all([new Promise(res => dialog.on('close', res)), dialog.open(200)]));

it('should close a opened dialog after the specified time', () => {
  dialog.open();
  return Promise.all([
    new Promise(res => dialog.on('close', res), dialog.close(200)),
  ]);
});

it('should make the app unscrollable when it opens and scrollable when it closes', () => {
  dialog = newDialog();

  return dialog.open().then(() => {
    expect(root.meta.get().scrollable).toBe(false);
    return dialog.close().then(() => {
      expect(root.meta.get().scrollable).toBe(true);
    });
  });
});

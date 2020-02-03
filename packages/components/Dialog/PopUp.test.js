import Popup from './Popup.html';

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
    setShortcuts(isEnabled) {
      this.set({ shortcuts: isEnabled });
    },
  },
});

let popUp;

const newDialog = data => root.createComponent(Popup, { unique: true, data });

it('should create a opened popUp with markup if `isOpen: true`', () => {
  popUp = newDialog({ isOpen: true });

  expect(root.query('.popup')).not.toBeNull();
  expect(root.meta.get().navigable).toBe(false);

  return popUp.close();
});

it("should close the popUp if `isOpen: false` and emit a 'close' event", () => {
  popUp = newDialog({ isOpen: true });

  return new Promise(res => {
    popUp.on('close', res);
    popUp.set({ isOpen: false });
  });
});

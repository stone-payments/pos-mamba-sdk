import ConfirmationDialog from './Confirmation.html';

const { newTestRoot } = global;

const root = newTestRoot();

const newDialog = data =>
  root.createComponent(ConfirmationDialog, { unique: true, data });

let dialog = newDialog();

it('should open a confirmation dialog', () =>
  Promise.all([
    new Promise(res => dialog.on('open', res)),
    new Promise(res => setTimeout(() => dialog.get().isOpen && res(), 300)),
    dialog.open(),
  ]));

it('should close a confirmation dialog', () =>
  Promise.all([
    new Promise(res => dialog.on('close', res)),
    new Promise(res => setTimeout(() => !dialog.get().isOpen && res(), 300)),
    dialog.close(),
  ]));

it('should close and dispatch a "negative" event when negative button clicked', () =>
  Promise.all([
    new Promise(res => dialog.on('close', res)),
    new Promise(res => dialog.on('negative', res)),
    dialog.open().then(() => {
      root.query('[shortcut="close"]').click();
    }),
  ]));

it('should close and dispatch a "negative" event when negative button clicked', () =>
  Promise.all([
    new Promise(res => dialog.on('close', res)),
    new Promise(res => dialog.on('positive', res)),
    dialog.open().then(() => {
      root.query('[shortcut="enter"]').click();
    }),
  ]));

it('should accept button labels', () => {
  dialog = newDialog({ positiveLabel: 'Confirmar', negativeLabel: 'Negar' });

  return dialog.open().then(() => {
    expect(root.query('[shortcut="close"]').innerHTML).toContain('Negar');
    expect(root.query('[shortcut="enter"]').innerHTML).toContain('Confirmar');
  });
});

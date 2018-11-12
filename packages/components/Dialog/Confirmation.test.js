import ConfirmationDialog from './Confirmation.html';

const target = document.body;
let component;

const newInstance = data => {
  if (component) {
    component.destroy();
  }
  component = new ConfirmationDialog({ target, data });

  return component;
};

newInstance();

it('should open a confirmation dialog', () =>
  Promise.all([
    new Promise(res => component.on('open', res)),
    new Promise(res => setTimeout(() => component.get().isOpen && res(), 300)),
    component.open(),
  ]));

it('should close a confirmation dialog', () =>
  Promise.all([
    new Promise(res => component.on('close', res)),
    new Promise(res => setTimeout(() => !component.get().isOpen && res(), 300)),
    component.close(),
  ]));

it('should close and dispatch a "negative" event when negative button clicked', () =>
  Promise.all([
    new Promise(res => component.on('close', res)),
    new Promise(res => component.on('negative', res)),
    component.open().then(() => {
      target.querySelector('[shortcut="close"]').click();
    }),
  ]));

it('should close and dispatch a "negative" event when negative button clicked', () =>
  Promise.all([
    new Promise(res => component.on('close', res)),
    new Promise(res => component.on('positive', res)),
    component.open().then(() => {
      target.querySelector('[shortcut="enter"]').click();
    }),
  ]));

it('should accept button labels', () => {
  newInstance({ positiveLabel: 'Confirmar', negativeLabel: 'Negar' });

  return component.open().then(() => {
    expect(target.querySelector('[shortcut="close"]').innerHTML).toContain(
      'Negar',
    );
    expect(target.querySelector('[shortcut="enter"]').innerHTML).toContain(
      'Confirmar',
    );
  });
});

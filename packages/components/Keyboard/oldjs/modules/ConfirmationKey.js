import AbstractKey from './AbstractKey.js';

class ConfirmationKey extends AbstractKey {
  onClickTemplate(event, controller) {
    this._emitEventToParent({
      componentScope: controller.scope,
      eventName: 'submit',
      input: 'submit',
    });
  }
}

export default ConfirmationKey;

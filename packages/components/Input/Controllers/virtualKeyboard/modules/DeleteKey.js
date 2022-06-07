import AbstractKey from './AbstractKey.js';

class DeleteKey extends AbstractKey {
  onClickTemplate(event, controller) {
    this._emitEventToParent({
      componentScope: controller.scope,
      eventName: 'backspace',
      input: 'backspace',
    });
  }
}

export default DeleteKey;

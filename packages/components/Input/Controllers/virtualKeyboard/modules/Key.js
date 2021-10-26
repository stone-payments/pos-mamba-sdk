import AbstractKey from './AbstractKey';

class Key extends AbstractKey {
  onClickTemplate(event, controller) {
    this._emitEventToParent({
      componentScope: controller.scope,
      eventName: 'keypress',
      input: this.code,
    });
  }
}

export default Key;

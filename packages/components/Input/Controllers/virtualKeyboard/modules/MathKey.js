import AbstractKey from './AbstractKey';

class MathKey extends AbstractKey {
  onClickTemplate(event, controller) {
    this._emitEventToParent({
      componentScope: controller.scope,
      eventName: 'mathKeypress',
      input: this.code,
    });
  }
}

export default MathKey;

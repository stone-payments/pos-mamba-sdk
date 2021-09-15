import AbstractKey from './AbstractKey';

class MathKey extends AbstractKey {

  onClick(controller) {
    controller.emitKeyToParent(this.code);
  }
}

export default MathKey;

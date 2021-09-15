import AbstractKey from './AbstractKey';

class Key extends AbstractKey {

  onClick(controller) {

    const inputValue = controller.insertKey(this.code);

    return inputValue;
  }
}

export default Key;

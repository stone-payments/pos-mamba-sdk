import AbstractKey from './AbstractKey';

class ConfirmationKey extends AbstractKey {

  onClick(controller) {
    controller.confirmKey();
  }
}

export default ConfirmationKey;

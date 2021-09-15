import AbstractKey from './AbstractKey';

class DeleteKey extends AbstractKey {

  onClick(controller) {
    controller.deleteKey();
  }
}

export default DeleteKey;

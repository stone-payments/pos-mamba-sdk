<div class="container">
  <h1>Default Dialog (closes after 2 secs)</h1>
  <div class="row">
    <button on:click="openDialog('defaultDialog')">
      Open dialog
    </button>
  </div>

  <Dialog ref:defaultDialog>
    Conectando...
  </Dialog>

  <h1>Dialog with custom duration</h1>
  <div class="row">
    <button on:click="openDialog('customTimeout')">
      Open dialog
    </button>
  </div>

  <Dialog ref:customTimeout duration="1000">
    Conectando...
  </Dialog>

  <h1>Dialog with image</h1>
  <div class="row">
    <button on:click="openDialog('imageDialog')">
      Open dialog
    </button>
  </div>

  <Dialog ref:imageDialog>
    <div slot="image">
      <img src="./assets/images/success.png" alt="">
    </div>

    Conectando...
  </Dialog>

  <h1>Dialog with sprite</h1>
  <div class="row">
    <button on:click="openDialog('spriteDialog')">
      Open dialog
    </button>
  </div>

  <Dialog ref:spriteDialog>
    <div slot="image">
      <Sprite src="./assets/images/loading-sprite.png" width="70px"/>
    </div>
    Conectando...
  </Dialog>

  <h1>Dialog with custom colors</h1>
  <div class="row">
    <button on:click="openDialog('bgDialog')">
      Open dialog
    </button>
  </div>

  <Dialog
    ref:bgDialog
    bgColor="rgba(0,0,0,.95)"
    textColor="white"
  >
    <div slot="image">
      <img src="./assets/images/success.png" alt="">
    </div>
    Conectando...
  </Dialog>

  <h1>Dialog with actions</h1>
  <div class="row">
    <button on:click="openDialog('actionsDialog')">
      Open Dialog
    </button>
  </div>

  <Dialog
    ref:actionsDialog
    bgColor="rgba(0,0,0,.95)"
    textColor="white"
    actions={[{
      label: 'Cancelar',
      event: 'cancel',
      props: {
        bgColor: 'white',
        textColor: 'black',
        borderColor: '#4ebf1a'
      }
    },
    {
      label: 'Ok',
      event: 'ok'
    }]}
    on:ok="console.log('ok')"
    on:cancel="console.log('cancel')"
  >
    <div slot="image">
      <img src="./assets/images/success.png" alt="">
    </div>
    Conectando...
  </Dialog>

  <h1>Dialog based on a Promise</h1>
  <div class="row">
    <button on:click="refreshPromise()">
      Open Dialog
    </button>
  </div>

  <Dialog
    {promise}
    on:success="console.log('promise success', event)"
    on:failure="console.log(event)"
  >
    {#await promise}
      Loading....
    {:then }
      Success!!!
    {:catch }
      Something went wrong...
    {/await}
  </Dialog>


  <h1>Default Modal</h1>
  <div class="row">
    <button on:click="openModal('defaultModal')">
      Open Default Modal
    </button>
  </div>

  <div class="row">
    <button on:click="openModal('negativeModal')">
      Open modal with no negative action
    </button>
  </div>

  <div class="row">
    <button on:click="openModal('disabledNegative')">
      Open modal with negative disabled
    </button>
  </div>

  <div class="row">
    <button on:click="openModal('disabledPositive')">
      Open modal with positive disabled
    </button>
  </div>

  <Modal
    ref:defaultModal
    title="Modal Title"
    on:close="console.log(event)"
  >
    Modal
  </Modal>

  <Modal
    ref:negativeModal
    title="Modal Title"
    on:close="console.log(event)"
    hideNegativeAction
  >
    Modal 2
  </Modal>

  <Modal
    ref:disabledNegative
    title="Modal Title"
    on:close="console.log(event)"
    disableNegativeAction
  >
    Modal 3
  </Modal>

  <Modal
    ref:disabledPositive
    title="Modal Title"
    on:close="console.log(event)"
    disablePositiveAction
  >
    Modal 3
  </Modal>
</div>

<script>
  import { Modal, Dialog } from '../src'
  export default {
    components: {
      Modal,
      Dialog,
      Sprite: '@mamba/sprite',
    },
    methods: {
      refreshPromise() {
        this.set({
          promise: new Promise((resolve, reject) =>
            setTimeout(() => resolve(), 2000),
          ),
        })
      },
      openDialog(dialog) {
        this.refs[dialog].open()
      },
      openModal(modal) {
        this.refs[modal].open()
      },
    },
  }
</script>

<style>
  :global(body) {
    background-color: #ddd;
  }

  h1 span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    font-family: monospace;
  }

  .container {
    max-width: 80%;
    width: 700px;
    margin: 80px auto;
  }

  .row {
    margin-bottom: 50px;
  }
</style>

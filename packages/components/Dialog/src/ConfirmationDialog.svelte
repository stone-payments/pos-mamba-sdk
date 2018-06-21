<Dialog ref:dialog {..._dialogProps}>
  <slot></slot>
  <div slot="extra">
    <div class="actions">
      <div class="action" on:click="fire('negative')" shortcut="close">
        <RoundIcon symbol="close" size="giant" borderRadius="15px" bgColor="#ff1a1a" />
      </div>
      <div class="action" on:click="fire('positive')" shortcut="enter">
        <RoundIcon symbol="check" size="giant" borderRadius="15px" bgColor="#4ebf1a" />
      </div>
    </div>
  </div>
</Dialog>

<script>
  import Keyboard from '@mamba/native/keyboard'
  import { RoundIcon } from '@mamba/icon'

  const preventClosing = e => {
    if (Keyboard.getKeyName(e.keyCode) === 'close') {
      e.preventDefault()
      return false
    }
  }

  export default {
    components: {
      RoundIcon,
      Dialog: './Dialog.svelte',
    },
    data() {
      return {
        negativeLabel: 'Cancelar',
        positiveLabel: 'Confirmar',
      }
    },
    computed: {
      _dialogProps(props) {
        const tmp = Object.assign({}, props)
        delete tmp.negativeLabel
        delete tmp.positiveLabel
        return tmp
      },
    },
    methods: {
      open() {
        if (this.refs.dialog) {
          this.refs.dialog.open()
        }
      },
      close() {
        if (this.refs.dialog) {
          this.refs.dialog.close()
        }
      },
    },
    oncreate() {
      /** When the dialog opens, prevent 'closing' the app with the 'close' key */
      this.refs.dialog.on('open', () => {
        console.log('dialog open')
        if (document.activeElement) {
          document.activeElement.blur()
        }
        document.onkeyup = preventClosing
      })

      /** When the dialog closes or is destroyed, allow to close the app again */
      this.refs.dialog.on('close', () => {
        console.log('dialog close')
        document.onkeyup = null
      })
      this.refs.dialog.on('destroy', () => {
        console.log('dialog destroy')
        document.onkeyup = null
      })

      /** Close the confirmation dialog when a positive/negative action is clicked */
      this.on('negative', () => {
        console.log('negative')
        this.close()
      })
      this.on('positive', () => this.close())
    },
  }
</script>

<style>
  .actions {
    margin-top: 25px;
    text-align: center;
    font-size: 0;
  }

  .action {
    display: inline-block;
  }

  .action + .action {
    margin-left: 20px;
  }
</style>

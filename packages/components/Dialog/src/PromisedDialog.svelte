<Dialog ref:dialog {..._dialogProps}>
  <slot></slot>
</Dialog>

<script>
  export default {
    components: {
      Dialog: './Dialog.svelte',
    },
    data() {
      return {
        promise: null,
        delay: 2000,
      }
    },
    computed: {
      _dialogProps(props) {
        const tmp = Object.assign({}, props)
        delete tmp.promise
        delete tmp.delay
        return tmp
      },
    },
    onstate({ changed, current: { promise, delay } }) {
      if (changed.promise && promise && typeof promise.then === 'function') {
        promise
          .then(() => {
            this.fire('success')
            this.refs.dialog.close(delay)
          })
          .catch(e => {
            this.fire('failure', e)
            this.refs.dialog.close(delay)
          })
        this.refs.dialog.open()
      }
    },
  }
</script>

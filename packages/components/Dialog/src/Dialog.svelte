{#if isOpen}
  <div class="dialog" {style}>
    <div class="content">
      <div class="message">
        <slot></slot>
      </div>
    </div>
    {#if actions}
      <div class="actions">
        {#each actions as { label, event: eventName, props }}
          <Button width="{100/actions.length}%" on:click="handleAction(eventName, event)" {...props}>
            {label}
          </Button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<script>
  export default {
    components: {
      Button: '@mamba/button',
    },
    data() {
      return {
        isOpen: false,
        duration: 2000,
        actions: null,
        bgColor: '#eee',
        textColor: '#4a4a4a',
      }
    },
    computed: {
      style({ bgColor, textColor }) {
        return [
          `background-color:${bgColor}`,
          `color:${textColor}`,
        ].join(';')
      },
    },
    onstate({ changed, current: { actions, isOpen, duration, promise } }) {
      if(changed.promise && promise && typeof promise.then === 'function') {
        promise
          .then(() => {
            this.fire('success')
            this.close(duration)
          })
          .catch((e) => {
            this.fire('failure', e)
            this.close(duration)
          })
        this.open()
        return
      }

      /** If the dialog is open and there's no actions, close it after {duration} msecs */
      if(changed.isOpen && isOpen === true && !promise && (!actions || !actions.length)) {
        this.close(duration)
      }
    },
    methods: {
      handleAction(eventName, data) {
        this.close()
        this.fire(eventName, data)
      },
      open() {
        this.set({ isOpen: true })
        this.fire('open')
      },
      close(delay) {
        if(typeof delay !== 'undefined') {
          return setTimeout(() => this.close(), delay)
        }
        this.set({ isOpen: false })
        this.fire('close')
      },
    },
  }
</script>

<style>
  .dialog {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    width: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .image {
    margin: 0 auto 15px;
  }

  .message {
    font-size: 20px;
  }

  .actions {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding: 15px;
  }

  .actions > :global(.button + .button) {
    margin-left: 5px
  }

</style>

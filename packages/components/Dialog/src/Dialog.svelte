{#if isOpen}
  <div class="dialog" {style}>

    <div class="content">

      {#if hasImage}
        <div class="image">
          <slot name="image"/>
        </div>
      {/if}

      <div class="message">
        <slot></slot>
      </div>
    </div>

    {#if actions}
      <div class="actions">
        {#each actions as { label, event: eventName, props }}
          <Button width="{100/actions.length}%" on:click="handleAction(eventName)" {...props}>
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
        duration: 3000,
        actions: null,
        bgColor: 'rgba(255, 255, 255, .95)',
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
    oncreate() {
      this.set({
        hasImage: !!(this.options.slots && this.options.slots.image),
      })
    },
    onstate({ changed, current: { actions, isOpen, duration } }) {
      if(changed.isOpen && Promise.resolve(isOpen) === isOpen) {
        isOpen
          .then(() => this.close(1500))
          .catch(() => this.close(1500))
        this.open()
        return
      }

      /** If the dialog is open and there's no actions, close it after {duration} msecs */
      if(changed.isOpen && isOpen === true && (!actions || !actions.length)) {
        duration = parseInt(duration)
        const closeTimeout = setTimeout(() => {
          this.close()
        }, parseInt(duration));
        this.set({ closeTimeout })
      }
    },
    methods: {
      handleAction(eventName) {
        this.fire(eventName)
        this.close()
      },
      open() {
        this.set({ isOpen: true })
        this.fire('open')
      },
      close(delay = 0) {
        const { closeTimeout } = this.get()

        setTimeout(() => {
          if(closeTimeout) clearTimeout(closeTimeout)
          this.set({ isOpen: false })
          this.fire('close')
        }, delay)
      },
    },
  }
</script>

<style>
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
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

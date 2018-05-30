<div class="dialog {isOpen ? 'is-open' : ''}" {style}>

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

<script>
  export default {
    components: {
      Button: '@mamba/button',
    },
    data() {
      return {
        message: '',
        timeout: 3000,
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
    onstate({ changed, current: { actions, isOpen, timeout } }) {
      /** If the dialog is open and there's no actions, close it after {timeout} msecs */
      if(changed.isOpen && isOpen && (!actions || !actions.length)) {
        setTimeout(() => {
          this.close()
        }, parseInt(timeout));
      }
    },
    methods: {
      handleAction(eventName) {
        this.fire(eventName)
        this.close()
      },
      open() {
        this.fire('open')
        this.set({ isOpen: true })
      },
      close() {
        this.fire('close')
        this.set({ isOpen: false })
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

  .dialog:not(.is-open) {
    display: none;
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

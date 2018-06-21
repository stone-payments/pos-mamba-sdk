{#if _isOpen}
  <div class="dialog" {style}>
    <div class="content -align-{align}">
      <div class="message">
        {#if title}
          <div class="title">{title}</div>
        {/if}
        <slot></slot>
      </div>
      <div class="extra">
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
{/if}

<script>
  export default {
    data() {
      return {
        _isOpen: false,
        actions: null,
        bgColor: '#e3e3e3',
        textColor: '#4a4a4a',
        align: 'center',
        type: 'timed',
      }
    },
    computed: {
      style({ bgColor, textColor }) {
        return `background-color:${bgColor};color:${textColor}`
      },
    },
    methods: {
      open(duration) {
        this.set({ _isOpen: true })
        this.fire('open')

        /** If there's a existant store, let's lock the app */
        if (this.store) {
          this.store.fire('meta:lock', true)
        }

        if (typeof duration !== 'undefined') {
          this.close(duration)
        }
      },
      close(delay) {
        if (typeof delay !== 'undefined') {
          return setTimeout(() => this.close(), parseFloat(delay))
        }
        this.set({ _isOpen: false })
        this.fire('close')

        /** If there's a existant store, let's unlock the app */
        if (this.store) {
          this.store.fire('meta:lock', false)
        }
      },
    },
    ondestroy() {
      /** If the component is being destroyed and the dialog is still opened, let's unlock the app */
      if (this.get()._isOpen && this.store && this.store.get().__meta__.locked) {
        this.store.fire('meta:lock', false)
      }
    },
  }
</script>

<style>
  .dialog {
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .content {
    width: 90%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .content.-align-top {
    margin-top: 15px;
  }

  .content.-align-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .message {
    font-size: 18px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }
</style>

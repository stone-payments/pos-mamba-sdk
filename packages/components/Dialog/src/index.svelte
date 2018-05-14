<div class="mb-dialog-container {isOpen ? 'mb-active' : ''}">
  <div class="mb-dialog">

  {#if title && title.length}
    <h5 class="mb-dialog-title">{title}</h5>
  {/if}

    <p class="mb-dialog-message">
      <slot></slot>
    </p>

    <div class="mb-dialog-actions">
      {#if negativeAction && !hideNegativeAction}
        <button
          class="mb-dialog-action-negative"
          on:click="close(negativeAction)"
          disabled={disableNegativeAction}
        >
          {negativeAction}
        </button>
      {/if}

      {#if positiveAction}
        <button
          class="mb-dialog-action-positive"
          on:click="close(positiveAction)"
          disabled={disablePositiveAction}
        >
          {positiveAction}
        </button>
      {/if}

    </div>
  </div>

  <div class="mb-black-screen" />
</div>

<script>
  export default {
    data() {
      return {
        positiveAction: 'Ok',
        negativeAction: 'Cancel',
        hideNegativeAction: false,
        disableNegativeAction: false,
        disablePositiveAction: false,
        isOpen: false,
      }
    },
    methods: {
      open() {
        this.set({ isOpen: true })
        document.body.classList.add('no-scroll')
      },
      close(action) {
        this.set({ isOpen: false })
        document.body.classList.remove('no-scroll')
        this.fire('close', { action })
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/index.scss';

  .mb-dialog-container {
    display: none;

    &.mb-active {
      display: block;
    }
  }

  .mb-black-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: $dialog-z-index - 1;
  }

  .mb-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80%;
    padding: 15px;
    padding-bottom: 0;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: $dialog-z-index;
  }

  .mb-dialog-title {
    font-size: 1.3em;
    line-height: 1.4em;
  }

  .mb-dialog-message {
    color: color('grey', 'darken-1');
  }

  .mb-dialog-actions {
    text-align: right;
  }

  .mb-dialog-action-negative,
  .mb-dialog-action-positive {
    -webkit-appearance: none;
    border: none;
    background: transparent;
    display: inline-block;
    min-width: 3em;
    margin: 0;
    padding: 0.3em;
    padding-top: 1em;
    padding-bottom: 1em;
    color: $primary-color;
    text-align: right;
    text-transform: uppercase;
    cursor: pointer;

    &[disabled] {
      color: $grey;
    }
  }

  .mb-dialog-action-negative {
    margin-right: 0.2em;
  }
</style>

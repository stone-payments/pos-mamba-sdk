<div class="container {isOpen ? 'active' : ''}">
  <div class="dialog">

  {#if title && title.length}
    <h5 class="title">{title}</h5>
  {/if}

    <p class="message">
      <slot></slot>
    </p>

    <div class="actions">
      {#if negativeAction && !hideNegativeAction}
        <button
          class="action-negative"
          on:click="close(negativeAction)"
          disabled={disableNegativeAction}
        >
          {negativeAction}
        </button>
      {/if}

      {#if positiveAction}
        <button
          class="action-positive"
          on:click="close(positiveAction)"
          disabled={disablePositiveAction}
        >
          {positiveAction}
        </button>
      {/if}

    </div>
  </div>

  <div class="black-screen" />
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

  .container {
    display: none;

    &.active {
      display: block;
    }
  }

  .black-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: $dialog-z-index - 1;
  }

  .dialog {
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

  .title {
    font-size: 1.3em;
    line-height: 1.4em;
  }

  .message {
    color: color('grey', 'darken-1');
  }

  .actions {
    text-align: right;
  }

  .action-negative,
  .action-positive {
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

  .action-negative {
    margin-right: 0.2em;
  }
</style>

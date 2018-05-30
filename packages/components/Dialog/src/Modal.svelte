<div class="container {isOpen ? 'is-active' : ''}">

  <div class="modal">
    <div class="content">
      {#if title && title.length}
        <h5 class="title">{title}</h5>
      {/if}

      <p class="message">
        <slot></slot>
      </p>
    </div>

    <div class="actions {hideNegativeAction ? 'is-alert' : ''}">
      {#if negativeAction && !hideNegativeAction}
        <button
          class="action -negative"
          on:click="close(negativeAction)"
          disabled={disableNegativeAction}
        >
          {negativeAction}
        </button>
      {/if}

      {#if positiveAction}
        <button
          class="action -positive"
          on:click="close(positiveAction)"
          disabled={disablePositiveAction}
        >
          {positiveAction}
        </button>
      {/if}

    </div>
  </div>
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    &:not(.is-active) {
      display: none;
    }
  }

  .modal {
    max-width: 210px;
    width: 80%;
    position: fixed;
    top: 50%;
    left: 50%;
    padding-bottom: 0;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: $dialog-z-index;
  }

  .content {
    padding: 10px 15px 15px;
  }

  .title {
    font-size: 1.3em;
    font-weight: bold;
    line-height: 1.4em;
  }

  .message {
    color: $grey-dark;
  }

  .actions {
    display: flex;
    text-align: center;
    border-top: 1px solid $grey-lighter;
  }

  .action {
    display: block;
    width: 50%;
    min-width: 3em;
    padding: 1em;
    border: none;
    color: $primary-color;
    background: transparent;
    font-weight: bold;
    text-transform: uppercase;
    appearance: none;

    .actions.is-alert & {
      width: 100%;
    }

    &.-positive {
      background-color: $green;
      color: $white;
    }

    &[disabled] {
      color: $grey;
      background-color: $grey-lighter;
    }
  }

</style>

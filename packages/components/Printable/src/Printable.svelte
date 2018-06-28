<div class="printable">
  <div ref:printableContent>
    <slot></slot>
  </div>
</div>

{#if state === STATES.PRINTING}
  <PromisedDialog
    promise={printingPromise}
    bgColor="#fff"
    on:success="set({ state: STATES.SUCCESS })"
    on:failure="set({ state: STATES.FAILURE })"
  >
    <div class="printing-sprite"></div>
    <div style="margin-top: 16px;">
      Imprimindo
    </div>
  </PromisedDialog>
{/if}

{#if state === STATES.FAILURE}
  <ConfirmationDialog
    ref:failureDialog
    title="IMPRESSORA SEM PAPEL"
    on:positive="print()"
    on:negative="reset()"
  >
    Tentar imprimir novamente?
  </ConfirmationDialog>
{/if}


<script>
  import Printer from '@mamba/native/printer'
  import { PromisedDialog, ConfirmationDialog } from '@mamba/dialog'

  const STATES = Object.freeze({
    IDLE: 0,
    PRINTING: 1,
    FAILURE: 2,
    SUCCESS: 3,
  })

  export default {
    data() {
      return {
        STATES,
        state: STATES.IDLE,
        printingPromise: undefined,
        options: undefined,
      }
    },
    components: {
      PromisedDialog,
      ConfirmationDialog,
    },
    onupdate({ changed, current }) {
      if (changed.state) {
        if (current.state === STATES.FAILURE) {
          this.fire('failure')
          this.refs.failureDialog.open()
        } else if (current.state === STATES.SUCCESS) {
          this.fire('success')
        }
      }
    },
    methods: {
      reset() {
        this.set({ state: STATES.IDLE, printingPromise: undefined })
      },
      print() {
        const printingPromise = Printer.print(
          this.refs.printableContent,
          this.get().options,
        )

        this.set({
          state: STATES.PRINTING,
          printingPromise,
        })
      },
    },
  }
</script>

<style>
  .printable {
    max-width: 384px;
    overflow: hidden;
    height: 0;
    visibility: hidden;
  }

  .printing-sprite {
    background-image: url(./assets/images/printing-sprite.png);
    display: block;
    width: 110px;
    height: 110px;
    margin: auto;
    animation: printingAnimation 2s steps(65) infinite;
  }

  @keyframes printingAnimation {
    0% {
      background-position-x: 7150px;
    }

    100% {
      background-position-x: 0;
    }
  }
</style>

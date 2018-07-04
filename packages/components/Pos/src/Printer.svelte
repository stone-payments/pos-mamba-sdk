<div ref:printer class="printer {printerClass}" on:click="shred()">
  <div ref:paper class="paper">
    <div class="content">{@html content}</div>
  </div>

  <!-- SVG filter for removing colors from the paper -->
  <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: block;">
      <defs>
          <filter id="remove-colors-alpha" x="0%" y="0%" width="100%" height="100%">
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0.0 0.1"></feFuncR>
                <feFuncG type="discrete" tableValues="0.0 1.0"></feFuncG>
                <feFuncB type="discrete" tableValues="0.0 1.0"></feFuncB>
              </feComponentTransfer>
              <feColorMatrix result="original" id="svgcolormatrix" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1 -1 -1 1 -0.04"></feColorMatrix>
          </filter>
      </defs>
  </svg>
</div>

<script>
  const onceTransitionEnd = (el, cb) => {
    const onTransitionEnd = e => {
      cb(e)
      el.removeEventListener('transitionend', onTransitionEnd)
    }
    el.addEventListener('transitionend', onTransitionEnd)
  }

  const STATES = Object.freeze({
    IDLE: 'idle',
    PRINTED: 'printed',
    SHREDDING: 'shredding',
    WAITING: 'waiting',
  })

  export default {
    data() {
      return {
        content: '',
        printed: false,
        state: STATES.IDLE,
      }
    },
    computed: {
      printerClass({ state }) {
        return `is-${state}`
      },
    },
    oncreate() {
      if (this.store) {
        this.store.on('pos:print', ({ content, options }) =>
          this.print(content, options),
        )
      }
    },
    methods: {
      print(content, options) {
        const { state } = this.get()
        /** If there's already printed paper, shred it */
        const shouldShredFirst = state === STATES.PRINTED
        const getPrintPromise = () =>
          new Promise((resolve, reject) => {
            this.set({
              state: STATES.PRINTED,
              content: content.innerHTML,
            })
            /** Once it finishes printing animation */
            onceTransitionEnd(this.refs.paper, () => {
              this.set({ state: STATES.PRINTED })
              /** Once it finishes the printed state animation */
              onceTransitionEnd(this.refs.paper, resolve)
            })
          })

        if (shouldShredFirst) {
          return this.shred().then(getPrintPromise)
        }

        return getPrintPromise()
      },
      /** Shred a already printed paper */
      shred() {
        const { state } = this.get()
        /** Does the printer has any printed paper? */
        const doesntHasPaper = state !== STATES.PRINTED

        /** If not, do nothing */
        if (doesntHasPaper) {
          return
        }

        /** If there's already printed paper, shred it */
        return new Promise((resolve, reject) => {
          this.set({ state: STATES.SHREDDING })
          /** Once it finishes shredding animation */
          onceTransitionEnd(this.refs.paper, () => {
            this.set({ state: STATES.WAITING, content: '' })
            /** Once it finishes the "reset" animation */
            setTimeout(resolve)
          })
        })
      },
    },
  }
</script>

<style type="text/postcss">
  $paper-color: #add8e6;

  .printer {
    display: none;
  }

  @media all and (min-width: 481px) {
    .printer {
      display: block;
      width: 250px;
      position: absolute;
      left: 42px;
      bottom: 584px;

      &:not(.is-printed) {
        pointer-events: none;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        max-height: 10px;
        background-color: $paper-color;
        border-top: 1px dashed transparent;
        transition: border-top-color 0.3s ease, max-height 0.3s ease;
      }

      &.is-printed:hover {
        &::after {
          border-top-color: rgba(0, 0, 0, 0.6);
        }
      }

      &.is-shredding,
      &.is-waiting {
        &::after {
          box-shadow: 2px 0px 2px 1px rgba(0, 0, 0, 0.4);
        }
      }

      &.is-idle {
        &::after {
          max-height: 0;
          background-color: transparent;
        }
      }
    }

    .paper {
      position: relative;
      overflow: hidden;
      height: 270px;
      background-color: $paper-color;
      cursor: pointer;
      border-top-right-radius: 2px;
      border-top-left-radius: 2px;
      transition: transform 0.2s 0.3s ease, max-height 2s ease-in-out;
      transform-origin: 0 100%;

      .printer.is-idle & {
        max-height: 0;
      }

      .printer.is-waiting & {
        transition: none;
        max-height: 10px;
      }

      .printer.is-printed & {
        max-height: 270px;
        box-shadow: 2px 0px 2px 1px rgba(0, 0, 0, 0.4);
      }

      .printer.is-shredding & {
        border-bottom: none;
        transition: transform 1s ease;
        transform: rotateZ(-8deg) translateY(-700px);
      }
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: -20px;
      overflow-y: scroll;
      z-index: 1;
      padding: 20px 21px 15px 20px;
      filter: contrast(300%) grayscale(100%) url('#remove-colors-alpha');

      &,
      :global(p) {
        font-size: 11px;
        font-family: 'Roboto', Arial, sans-serif;
        line-height: 1.1;
        -webkit-font-smoothing: none;
      }

      :global(p) {
        margin-bottom: 10px;
      }

      :global(img) {
        display: block;
        max-width: 100%;
        height: auto;
      }
    }
  }
</style>

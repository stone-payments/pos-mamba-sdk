<div ref:printer class="printer {printerClass}" on:click="shred()">
  <div ref:paper class="paper">
    <div class="content">{@html content}</div>
  </div>
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
    PRINTING: 'printed',
    SHREDDING: 'shredded',
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
        this.store.on('pos:print', ({ content, options }) => {
          this.set({
            state: STATES.PRINTING,
            content: content.innerHTML,
          })
        })
      }
    },
    methods: {
      shred() {
        this.set({ state: STATES.SHREDDING })
        onceTransitionEnd(this.refs.paper, () =>
          this.set({ state: STATES.WAITING }),
        )
      },
    },
  }
</script>

<style type="text/postcss">
  $paper-color: #add8e6;

  @media all and (min-width: 481px) {
    .printer {
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
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background: $paper-color;
        border-top: 1px dashed transparent;
        transition: border-top-color 0.3s ease;
      }

      &:hover {
        .paper {
          transform: translateY(-25px);
          border-bottom: 1px dashed rgba(0, 0, 0, 0.6);
        }

        &::after {
          border-top-color: rgba(0, 0, 0, 0.6);
        }
      }

      &.is-idle {
        &::after {
          display: none;
        }
      }
    }

    .paper {
      position: relative;
      overflow: hidden;
      background-color: $paper-color;
      cursor: pointer;
      transition: transform 0.2s 0.3s ease, max-height 2s ease-in-out,
        border-bottom-color 0.3s ease;
      border-top-right-radius: 2px;
      border-top-left-radius: 2px;

      .printer.is-idle &,
      .printer.is-waiting & {
        max-height: 0;
      }

      .printer.is-printed & {
        max-height: 500px;
        box-shadow: 2px 0px 2px 1px rgba(0, 0, 0, 0.4);
      }

      .printer.is-shredded & {
        border-bottom: none;
        transition: transform 0.6s ease;
        transform: translateY(-1000px);
      }
    }

    .content {
      width: 100%;
      padding: 20px;
    }
  }
</style>

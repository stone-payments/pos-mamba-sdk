<svelte:window on:keyup="handleKeyUp(event)" />

<div class="wrapper">
  <div class="pos">
    <div class="brightness" style="opacity: {brightnessOpacity};"></div>
    <div class="screen">
      <slot></slot>
    </div>
    <div class="actions">
      <button class="key-1" on:mousedown="dispatchKey({ event, keyName: '1'})">1</button>
      <button class="key-2" on:mousedown="dispatchKey({ event, keyName: '2'})">2</button>
      <button class="key-3" on:mousedown="dispatchKey({ event, keyName: '3'})">3</button>
      <button class="key-4" on:mousedown="dispatchKey({ event, keyName: '4'})">4</button>
      <button class="key-5" on:mousedown="dispatchKey({ event, keyName: '5'})">5</button>
      <button class="key-6" on:mousedown="dispatchKey({ event, keyName: '6'})">6</button>
      <button class="key-7" on:mousedown="dispatchKey({ event, keyName: '7'})">7</button>
      <button class="key-8" on:mousedown="dispatchKey({ event, keyName: '8'})">8</button>
      <button class="key-9" on:mousedown="dispatchKey({ event, keyName: '9'})">9</button>
      <button class="key-0" on:mousedown="dispatchKey({ event, keyName: '0'})">0</button>
      <button class="back" on:mousedown="dispatchKey({ event, keyName: 'back'})">back</button>
      <button class="close" on:mousedown="dispatchKey({ event, keyName: 'close'})">close</button>
      <button class="enter" on:mousedown="dispatchKey({ event, keyName: 'enter'})">enter</button>
      <button class="shortcuts" on:mousedown="dispatchKey({ event, keyName: 'shortcuts'})">shortcuts</button>
      <button class="help" on:mousedown="dispatchKey({ event, keyName: 'help'})">help</button>
    </div>
  </div>
</div>

<script>
  import Keyboard from '@mamba/native/keyboard'

  export default {
    data() {
      return {
        brightnessLevel: 10,
      }
    },
    computed: {
      brightnessOpacity: ({ brightnessLevel }) => 1 - (brightnessLevel / 10),
    },
    oncreate() {
      if(this.store) {
        /** Listen for brightness changes */
        this.store.on('change:brightness', ({ brightnessLevel }) => {
          this.set({ brightnessLevel })
        })
      }
    },
    methods: {
      /** Treat backspace as the 'back button' */
      handleKeyUp({ keyCode }) {
        if (
          Keyboard.getKeyName(keyCode) === 'back' &&
          document.activeElement.tagName !== 'INPUT' &&
          (!this.store || (this.store && !this.store.get().locked))
        ) {
          this.goBack()
        }
      },
      async goBack() {
        try {
          const { getHistory } = await import('svelte-routing')
          getHistory().goBack()
        } catch (e) {
          console.log(
            '[@mamba/POS] Missing "svelte-routing" package. Cannot goBack(). ',
          ) // eslint-disable-line
        }
      },
      dispatchKey({ event, keyName }) {
        /** Prevent the button from being focused */
        event.preventDefault()
        const focusedEl = document.activeElement
        const isFocusedInput = focusedEl && focusedEl.tagName === 'INPUT'

        const code = Keyboard.getKeyCode(keyName)

        /** If action button clicked */
        if (Keyboard.isActionKey(code)) {
          /** The actual 'back' is handled by that 'handleKeyUp' method */
          if (keyName === 'back') {
            /** If we're focusing on a <input> erase the last character */
            if (isFocusedInput) {
              focusedEl.value = focusedEl.value.slice(0, -1)
              focusedEl.dispatchEvent(new Event('input'))
            }
          }
        } else {
          /** If numeric button clicked */
          if (isFocusedInput) {
            focusedEl.value += keyName
            focusedEl.dispatchEvent(new Event('input'))
          }
        }

        window.dispatchEvent(
          new KeyboardEvent('keyup', {
            key: keyName,
            keyCode: code,
          }),
        )
      },
    },
  }
</script>

<style>
  @media all and (max-width: 480px) {
    .actions {
      display: none;
    }
  }

  @media all and (min-width: 481px) {
    .wrapper {
      display: flex;
      height: 100vh;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    .pos {
      position: relative;
      z-index: 0;
      margin: 0 auto;
      width: 342px;
      height: 751px;
      background-image: url(./assets/POS.png);
      background-size: cover;
    }

    .screen,
    .brightness {
      position: absolute;
      top: 225px;
      left: 47.99px;
      width: 240px;
      height: 320px;
    }

    .screen {
      overflow-y: auto;
    }

    .brightness {
      background-color: #000;
      z-index: 100000;
      pointer-events: none;
      transition: opacity .3s ease;
    }

    /**
     * Override the position: fixed to display content in the POS mockup.
     * This may eventually brake.
     */
    .screen :global(.button.is-fixed),
    .screen :global(.dialog) {
      position: absolute !important;
    }

    button {
      position: absolute;
      width: 60px;
      height: 29px;
      border: 0;
      -webkit-appearance: none;
      cursor: pointer;
      background: none;
      border-radius: 8px;
      color: transparent;
      font-size: 10px;
      font-weight: bold;
    }

    button:hover {
      opacity: 1;
      color: white;
      background-color: rgba(22, 22, 22, 0.8);
      border: 2px solid white;
      font-size: 18px;
    }

    .close {
      bottom: 136px;
      right: 49px;
    }

    .back {
      bottom: 101px;
      right: 49px;
    }

    .enter {
      height: 60px;
      bottom: 34px;
      right: 49px;
    }

    .key-1,
    .key-4,
    .key-7,
    .help {
      right: 251px;
    }

    .key-1 {
      bottom: 136px;
    }

    .key-4 {
      bottom: 101px;
    }

    .key-7 {
      bottom: 66px;
    }

    .help {
      bottom: 32px;
    }

    .key-2,
    .key-5,
    .key-8,
    .key-0 {
      right: 184px;
    }

    .key-2 {
      bottom: 136px;
    }

    .key-5 {
      bottom: 101px;
    }

    .key-8 {
      bottom: 66px;
    }

    .key-0 {
      bottom: 32px;
    }

    .key-3,
    .key-6,
    .key-9,
    .shortcuts {
      right: 117px;
    }

    .key-3 {
      bottom: 136px;
    }

    .key-6 {
      bottom: 101px;
    }

    .key-9 {
      bottom: 66px;
    }

    .shortcuts {
      bottom: 32px;
    }

    .shortcuts:hover {
      font-size: 10px;
    }
  }
</style>

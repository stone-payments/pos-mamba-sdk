<svelte:window on:keyup="handleKeyUp(event)" />

<div class="wrapper">
  <div class="shadow"></div>
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
      brightnessOpacity: ({ brightnessLevel }) => 1 - brightnessLevel / 10,
    },
    oncreate() {
      if (this.store) {
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
          (!this.store || (this.store && !this.store.get().__meta__.locked))
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
      background-image: url(./assets/wood.jpg);
      background-size: cover;
    }

    .pos,
    .shadow {
      position: relative;
      z-index: 0;
      margin: 0 auto;
      width: 347px;
      height: 761px;
      background-image: url(./assets/POS.png);
      background-size: cover;
    }

    .shadow {
      display: none;
    }

    @supports (filter: brightness(0)) {
      .shadow {
        display: block;
        position: absolute;
        z-index: 0;
        filter: brightness(0) blur(2px);
        opacity: 0.4;
        animation: shadow .8s ease-out forwards;
      }

      @keyframes shadow {
        from {
          transform: translate(0, 0);
        }
        to {
          transform: translate(15px, 15px);
        }
      }
    }

    .screen,
    .brightness {
      position: absolute;
      top: 231px;
      left: 50px;
      width: 240px;
      height: 320px;
    }

    .screen {
      background-color: #fff;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .screen::-webkit-scrollbar {
      display: none;
    }

    .brightness {
      background-color: #000;
      z-index: 100000;
      pointer-events: none;
      transition: opacity 0.3s ease;
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
      height: 30px;
      border: 0;
      -webkit-appearance: none;
      cursor: pointer;
      background: none;
      border-radius: 8px;
      color: transparent;
      font-weight: bold;
      font-size: 18px;
    }

    button:hover {
      opacity: 1;
      color: white;
      background-color: rgba(22, 22, 22, 0.8);
      border: 2px solid white;
    }

    .shortcuts {
      font-size: 10px;
    }

    .close {
      right: 50px;
    }

    .back {
      bottom: 101px;
      right: 50px;
    }

    .enter {
      height: 64px;
      right: 50px;
    }

    .key-1,
    .key-4,
    .key-7,
    .help {
      right: 255px;
    }

    .key-2,
    .key-5,
    .key-8,
    .key-0 {
      right: 187px;
    }

    .key-3,
    .key-6,
    .key-9,
    .shortcuts {
      right: 119px;
    }

    .key-1,
    .key-2,
    .key-3,
    .close {
      bottom: 138px;
    }

    .key-4,
    .key-5,
    .key-6 {
      bottom: 102px;
    }

    .key-7,
    .key-8,
    .key-9 {
      bottom: 67px;
    }

    .key-0,
    .shortcuts,
    .help,
    .enter {
      bottom: 32px;
    }
  }
</style>

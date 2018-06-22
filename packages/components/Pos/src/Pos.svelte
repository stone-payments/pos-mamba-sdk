<svelte:window on:keyup="handleKeyUp(event)" />

<div class="wrapper">
  <div class="shadow"></div>
  <div class="pos">
    <Screen>
      <slot></slot>
    </Screen>
    <Keypad />
  </div>
</div>

<script>
  import Keyboard from '@mamba/native/keyboard'

  export default {
    components: {
      Keypad: './Keypad.svelte',
      Screen: './Screen.svelte',
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
    },
  }
</script>

<style>
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
        animation: shadow 0.8s ease-out forwards;
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
  }
</style>

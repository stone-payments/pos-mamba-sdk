<script lang="ts">
  import Printer from './hardware/Printer.svelte';
  import Screen from './hardware/Screen.svelte';
  import Keypad from './hardware/Keypad/index.svelte';
  import { store } from './store';

  let printer = null;
  let screen = null;
  let keypad = null;
</script>

<div class="pos-wrapper">
  <div class="shadow shadow-{$store.ACTIVE_MODEL}" />
  <div class="pos {$store.ACTIVE_MODEL}">
    <Printer bind:this={printer} />
    <Screen bind:this={screen}>
      <slot />
    </Screen>
    <Keypad bind:this={keypad} />
  </div>
</div>

<style>
  @media (max-width: 400px) {
    .pos-wrapper,
    .pos {
      height: 100%;
    }
  }

  :global(.simulator-wrapper:not(.force-remove-simulator-pos)) {
    & .pos-wrapper,
    & .pos {
      height: 100%;
    }

    @media (min-width: 401px) {
      .pos-wrapper {
        position: relative;
      }

      .pos,
      .shadow {
        position: relative;
        z-index: 2;
        margin: 0 auto;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .S920,
      .shadow-S920 {
        width: 347px;
        height: 761px;
        background-image: url(./assets/POS.png);
      }

      .Q92,
      .shadow-Q92 {
        width: 365px;
        height: 745px;
        background-image: url(./assets/Q92.png);
      }

      .MP35P,
      .shadow-MP35P {
        width: 507px;
        height: 814px;
        background-image: url(./assets/MP35P.png);
      }

      .MP35,
      .shadow-MP35 {
        width: 440px;
        height: 810px;
        background-image: url(./assets/MP35.png);
      }

      .D195,
      .shadow-D195 {
        width: 496px;
        height: 880px;
        background-image: url(./assets/D195.png);
      }

      .D199,
      .shadow-D199 {
        width: 316px;
        height: 600px;
        background-image: url(./assets/D199.png);
      }

      .D230,
      .shadow-D230 {
        width: 367px;
        height: 600px;
        background-image: url(./assets/D230.png);
      }

      .Q60,
      .shadow-Q60 {
        width: 430px;
        height: 750px;
        background-image: url(./assets/Q60.png);
      }

      .pos {
        user-select: none;
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
          transform: translate(15px, 15px);
        }
      }
    }
  }
</style>

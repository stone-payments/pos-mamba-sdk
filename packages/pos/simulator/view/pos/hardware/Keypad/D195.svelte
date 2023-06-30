<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { KEYBOARD } from '@mamba/core';

  const dispatch = createEventDispatcher<{ key: { event: Event, keyName: string } }>();
  const keyPress = (event: Event, keyName: string) => dispatch('key', { event, keyName });
  const KEY = KEYBOARD.KEY_NAMES;
</script>

<div class="keypad">
  <!-- Column One -->
  <div class="column">
    <button class="key-1" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_1)}>1</button>
    <button class="key-4" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_4)}>4</button>
    <button class="key-7" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_7)}>7</button>
    <button class="close" on:mousedown|preventDefault={(e) => keyPress(e, KEY.CLOSE)}>close</button>
  </div>

  <!-- Column Thow -->
  <div class="column">
    <button class="key-2" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_2)}>2</button>
    <button class="key-5" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_5)}>5</button>
    <button class="key-8" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_8)}>8</button>
    <button class="key-0" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_0)}>0</button>
  </div>

  <!-- Column Three -->
  <div class="column">
    <button class="key-3" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_3)}>3</button>
    <button class="key-6" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_6)}>6</button>
    <button class="key-9" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_9)}>9</button>
    <button class="back" on:mousedown|preventDefault={(e) => keyPress(e, KEY.BACK)}>back</button>
  </div>

  <!-- Column Four -->
  <div class="column">
    <button class="key-up" on:mousedown|preventDefault={(e) => keyPress(e, KEY.ARROW_UP)}>&#x2303;</button>
    <button class="key-down" on:mousedown|preventDefault={(e) => keyPress(e, KEY.ARROW_DOWN)}>&#x2304;</button>
    <button class="enter" on:mousedown|preventDefault={(e) => keyPress(e, KEY.ENTER)}>enter</button>
  </div>
</div>

<style>
  .keypad {
    position: absolute;
    bottom: 95px;
    left: 75px;
    display: flex;

    @media (max-width: 400px) {
      display: none;
    }
  }

  .column {
    width: 73px;

    & + .column {
      margin-left: 20px;
    }

    button + button {
      margin-top: 35px;
    }
  }

  button {
    width: 100%;
    height: 43px;
    border: 0;
    appearance: none;
    cursor: pointer;
    background: none;
    border-radius: 5px;
    color: transparent;
    font-weight: bold;
    font-size: 18px;
    transition: 0.2s ease;
  }

  button:hover {
    color: white;
    background-color: rgba(22, 22, 22, 90%);
    border: 2px solid white;
  }

  button:active {
    transform: scale(0.95);
  }

  .enter {
    height: 120px;
    width: 65px;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { KEYBOARD } from '@mamba/core';
  const dispatch = createEventDispatcher<{ key: { event: Event; keyName: string } }>();
  const keyPress = (event: Event, keyName: string) => dispatch('key', { event, keyName });
  const KEY = KEYBOARD.KEY_NAMES;
</script>

<div class="keypad">
  <button class="key-1" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_1)}>1</button>
  <button class="key-2" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_2)}>2</button>
  <button class="key-3" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_3)}>3</button>
  <button class="key-4" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_4)}>4</button>
  <button class="key-5" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_5)}>5</button>
  <button class="key-6" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_6)}>6</button>
  <button class="key-7" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_7)}>7</button>
  <button class="key-8" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_8)}>8</button>
  <button class="key-9" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_9)}>9</button>
  <button class="key-0" on:mousedown|preventDefault={(e) => keyPress(e, KEY.KEY_0)}>0</button>
  <button class="back" on:mousedown|preventDefault={(e) => keyPress(e, KEY.BACK)}>back</button>
  <button class="close" on:mousedown|preventDefault={(e) => keyPress(e, KEY.CLOSE)}>close</button>
  <button class="enter" on:mousedown|preventDefault={(e) => keyPress(e, KEY.ENTER)}>enter</button>
  <button class="shortcuts" on:mousedown|preventDefault={(e) => keyPress(e, KEY.SHORTCUTS)}>shortcuts</button>
  <button class="help" on:mousedown|preventDefault={(e) => keyPress(e, KEY.HELP)}>help</button>
</div>

<style>
  .keypad {
    position: absolute;
    width: 292px;
    height: 158px;
    bottom: 20px;
    left: 18px;

    @media (max-width: 400px) {
      display: none;
    }
  }

  button {
    position: absolute;
    width: 62px;
    height: 30px;
    border: 0;
    appearance: none;
    cursor: pointer;
    background: none;
    border-radius: 8px;
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

  .shortcuts {
    font-size: 10px;
  }

  .help {
    border-bottom-left-radius: 35px;
  }

  .close,
  .back,
  .enter {
    left: 219px;
  }

  .enter {
    height: 64px;
    border-bottom-right-radius: 30px;
  }

  .key-1,
  .key-4,
  .key-7,
  .help {
    left: 14px;
  }

  .key-2,
  .key-5,
  .key-8,
  .key-0 {
    left: 82px;
  }

  .key-3,
  .key-6,
  .key-9,
  .shortcuts {
    left: 150px;
  }

  .key-1,
  .key-2,
  .key-3,
  .close {
    bottom: 118px;
  }

  .key-4,
  .key-5,
  .key-6,
  .back {
    bottom: 82px;
  }

  .key-7,
  .key-8,
  .key-9 {
    bottom: 47px;
  }

  .key-0,
  .shortcuts,
  .help,
  .enter {
    bottom: 12px;
  }
</style>

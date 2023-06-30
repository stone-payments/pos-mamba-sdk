<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { KEYBOARD } from '@mamba/core';

  const dispatch = createEventDispatcher<{ key: { event: Event; keyName: string } }>();
  const keyPress = (event: Event, keyName: string) => dispatch('key', { event, keyName });
  const KEY = KEYBOARD.KEY_NAMES;
</script>

<div class="keypad">
  <!-- Column One -->
  <div class="column">
    <button class="close" on:mousedown|preventDefault={(e) => keyPress(e, KEY.CLOSE)}>X</button>
  </div>

  <!-- Column Thow -->
  <div class="column">
    <button class="key-0" on:mousedown|preventDefault={(e) => keyPress(e, KEY.BACK)}>&lt;</button>
  </div>

  <!-- Column Three -->
  <div class="column">
    <button class="enter" on:mousedown|preventDefault={(e) => keyPress(e, KEY.ENTER)}>O</button>
  </div>
</div>

<style>
  .keypad {
    position: absolute;
    bottom: 35px;
    left: 60px;
    display: flex;

    @media (max-width: 400px) {
      display: none;
    }
  }

  .column {
    width: 40px;

    & + .column {
      margin-left: 37px;
    }
  }

  button {
    width: 100%;
    height: 35px;
    border: 0;
    appearance: none;
    cursor: pointer;
    background: none;
    border-radius: 5px;
    color: transparent;
    font-weight: bold;
    font-size: 18px;
    transition: 0.2s ease;

    &:hover {
      color: white;
      background-color: rgba(22, 22, 22, 90%);
      border: 2px solid white;
    }

    &:active {
      transform: scale(0.95);
    }
  }
</style>

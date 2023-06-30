<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let disabled = false;
  export let checked = false;

  const dispatch = createEventDispatcher<{ change: { value: boolean } }>();

  function toggle(value) {
    if (typeof value === 'undefined') {
      checked = !checked;
    } else {
      checked = value;
    }
  }
</script>

<label class="switch" {checked} {disabled}>
  <input
    type="checkbox"
    {disabled}
    bind:checked
    data-trigger="click"
    on:change={() => dispatch('change', { value: checked })}
  />
</label>

<style type="text/postcss">
  :global(.has-small-screen) {
    .switch {
      width: 35px;
      height: 13px;
    }
  }

  input {
    display: none;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 27px;
    height: 12px;
    vertical-align: middle;
    border-radius: 8px;
    background-color: $switch-unchecked-bg;

    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: -2px;
      left: -3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: none;
      background-color: $switch-unchecked-color;
      box-shadow: 0 0 1px 0 #e0e0e0, 0 1px 1px 0 #c1c1c1;
    }

    /** Checked switch style */
    &[checked='true'] {
      background-color: $switch-checked-bg;

      &::after {
        left: auto;
        right: -3px;
        background-color: $switch-checked-color;
      }
    }

    /** Disabled switch style */
    &[disabled='true'] {
      background-color: $switch-disabled-bg;

      &::after {
        background-color: $switch-disabled-color;
      }
    }
  }
</style>

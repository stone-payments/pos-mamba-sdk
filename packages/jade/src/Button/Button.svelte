<script lang="ts">
  // import type { Ref } from '@/types';
  import { onMount } from 'svelte';

  export let label = '';
  export let size: 'small' | 'normal' | 'fill' | 'full' = 'normal';
  export let disabled = false;
  export let secondary = false;
  export let bottom = false;
  export let bgColor: string | undefined = undefined;
  export let textColor: string | undefined = undefined;
  export let width: string | undefined = undefined;
  export let shortcut = '';

  export let ref = null;

  onMount(() => {
    if (shortcut && typeof shortcut !== 'undefined') {
      ref.setAttribute('shortcut', shortcut);
    }
  });
</script>

<button
  bind:this={ref}
  class={`button size-${size}`}
  class:at-bottom={bottom}
  class:is-secondary={secondary}
  style:color={textColor || bgColor}
  style:background-color={!secondary ? bgColor : ''}
  style:width
  on:click
  {disabled}
>
  <slot>{label}</slot>
</button>

<style type="scss">
  button {
    min-height: 34px;
    padding: 0 16px;
    vertical-align: middle;
    /* $button-text-color */
    color: #ffffff;
    /* $button-primary-color */
    background-color: #00a868;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    appearance: none;
    border: 1px solid transparent;
    border-radius: 3px;

    &.is-secondary {
      background-color: transparent;
      /* $button-primary-color */
      border-color: #00a868;
      /* $button-primary-color */
      color: #00a868;
    }

    &.size-small {
      width: 103px;
    }

    &.size-normal {
      max-width: 216px;
      width: 90%;
    }

    &.size-fill {
      width: 100%;
    }

    &.size-full {
      width: 100%;
      border-radius: 0;
    }

    &[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.at-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
    }
  }

  :global(.has-small-screen) {
    button {
      &.size-normal,
      &.size-fill,
      &.size-full {
        font-size: 20px;
      }
    }
  }
</style>

<script lang="ts">
  export let name = '';
  export let checked = false;
  export let ref = null;

  const toggle = (value: boolean) => (checked = value);
</script>

<label>
  <input bind:this={ref} type="radio" {name} {checked} on:change on:click />
  <div class="radio" />
</label>

<style>
  input {
    display: none;
  }

  .radio {
    position: relative;
    display: inline-block;
    width: 24px;
    height: 24px;
    vertical-align: middle;
    border-radius: 100%;
    border: 2px solid $neutral500;
  }

  input + div::after {
    content: '';
    display: inline-block;
    position: absolute;
    left: 3px;
    top: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: none;
    background-color: transparent;
  }

  input:checked + div {
    background-color: transparent;
    border-color: $green500;

    &::after {
      background-color: $green500;
    }
  }
</style>

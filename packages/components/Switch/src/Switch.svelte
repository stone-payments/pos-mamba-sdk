<label class="switch" {checked} {disabled}>
  <input type="checkbox" {disabled} bind:checked on:change="fire('change', { value: checked })"/>
</label>

<script>
  export default {
    data() {
      return {
        disabled: false,
        checked: false,
      }
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/index.scss';

  input { display: none; }

  .switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 16px;
    vertical-align: middle;
    border-radius: 8px;
    background-color: $mb-switch-unchecked-bar-bg;

    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: -2px;
      left: -3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    &::after {
      border: 0.2rem solid $mb-switch-unchecked-icon-border;
      background-color: $mb-switch-unchecked-icon-bg;
    }

    /** Checked switch style */
    &[checked="true"] {
      background-color: $mb-switch-checked-bar-bg;

      &::after {
        left: auto;
        right: -3px;
        border-color: $mb-switch-checked-icon-border;
      }
    }

    /** Disabled switch style */
    &[disabled="true"] {
      background-color: $mb-switch-disabled-bar-bg;
      &::after {
        border-color: $mb-switch-disabled-icon-border;
      }
    }
  }
</style>

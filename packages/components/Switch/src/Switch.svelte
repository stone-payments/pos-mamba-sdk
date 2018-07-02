<label class="switch" {checked} {disabled} >
  <input
    type="checkbox"
    {disabled}
    bind:checked
    on:change="fire('change', { value: checked })"
    data-controller-trigger="click"
  />
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

<style>
  @import '@mamba/styles/colors.pcss';

  $checked-icon-border: $green;
  $checked-bar-bg: $green;
  $unchecked-icon-bg: $white;
  $unchecked-icon-border: $blue-grey-dark;
  $unchecked-bar-bg: $blue-grey-dark;
  $disabled-icon-border: $grey-light;
  $disabled-bar-bg: $grey-lighter;

  input { display: none; }

  .switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 16px;
    vertical-align: middle;
    border-radius: 8px;
    background-color: $unchecked-bar-bg;

    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: -2px;
      left: -3px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 0.2rem solid $unchecked-icon-border;
      background-color: $unchecked-icon-bg;
    }

    /** Checked switch style */
    &[checked="true"] {
      background-color: $checked-bar-bg;

      &::after {
        left: auto;
        right: -3px;
        border-color: $checked-icon-border;
      }
    }

    /** Disabled switch style */
    &[disabled="true"] {
      background-color: $disabled-bar-bg;

      &::after {
        border-color: $disabled-icon-border;
      }
    }
  }
</style>

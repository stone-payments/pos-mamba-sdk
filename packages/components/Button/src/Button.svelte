<button
  class="is-{size} {bottom ? 'is-fixed' : ''}"
  {style}
  {disabled}
  on:click="fire('click', event)"
>
  <slot></slot>
</button>

<script>
  export default {
    components: {
    },
    data() {
      return {
        size: 'regular',
        disabled: false,
        bottom: false,
      }
    },
    computed: {
      style({ textColor, bgColor, width }) {
        return [
          textColor && `color:${textColor}`,
          bgColor && `background-color:${bgColor}`,
          width && `width:${width}`,
        ].filter(Boolean).join(';')
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    background-color: $green;
    color: $white;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 36px;
  }

  button[disabled] {
    cursor: not-allowed;
    background-color: $grey-light !important;
    color: $grey !important;
  }

  button.is-fixed {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  button.is-small {
    font-size: 14px;
    padding: 5px 18px;
  }

  button.is-large {
    font-size: 18px;
    padding: 20px 36px;
  }

  button.is-full {
    width: 100%;
  }
</style>

<button
  ref:button
  class="button is-{size} {bottom ? 'is-fixed' : ''}"
  {style}
  {disabled}
  on:click
>
  <slot></slot>
</button>

<script>
  export default {
    data() {
      return {
        size: 'regular',
        disabled: false,
        bottom: false,
      }
    },
    computed: {
      style({ textColor, bgColor, width, borderColor }) {
        return [
          textColor && `color:${textColor}`,
          bgColor && `background-color:${bgColor}`,
          borderColor && `border: 2px solid ${borderColor}`,
          width && `width:${width}`,
        ]
          .filter(Boolean)
          .join(';')
      },
    },
    methods: {
      focus() {
        this.refs.button.focus()
      },
    },
    oncreate() {
      if (this.options.data) {
        const { shortcut } = this.options.data
        if (typeof shortcut !== 'undefined') {
          this.set({ shortcut })
        }
      }
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    background-color: #4ebf1a;
    color: $white;
    font-size: 16px;
    font-weight: bold;
    padding: 10px 16px;
  }

  button[disabled] {
    cursor: not-allowed;
    background-color: $grey-light !important;
    color: $grey !important;
    border: none !important;
  }

  button.is-fixed {
    position: fixed;
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

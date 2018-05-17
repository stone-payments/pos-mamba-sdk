<div ref:icon class="icon" {...attrs}></div>

<script>
  export default {
    data() {
      return {
        size: 'normal',
        symbol: 'custom',
      }
    },
    onstate({ current: { color, src } }) {
      const iconEl = this.refs.icon

      if(color) {
        iconEl.style.backgroundColor = color
      }

      if(src) {
        iconEl.style.webkitMaskImage = `url(${src})`
      }
    },
    computed: {
      attrs({ symbol, size, level }) {
        return {
          symbol,
          size,
          level,
        }
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/index.scss';

  .icon {
    display: inline-block;
    width: $mb-icon-size;
    height: $mb-icon-size;
    background-color: $mb-icon-color;
    mask-size: cover;
    mask-repeat: no-repeat;
  }

  [size="large"] {
    width: $mb-icon-size-large;
    height: $mb-icon-size-large;
  }

  [size="small"] {
    width: $mb-icon-size-mini;
    height: $mb-icon-size-mini;
  }

  @each $mb-icon in $icon-list {
    [symbol="#{$mb-icon}"] {
      mask-image: url(./assets/icons/#{$mb-icon}.svg);
    }
  }

  [level="0"] {
    background-color: $grey-light;
  }

  [symbol="wifi"] {
    &[level="1"] {
      background: linear-gradient(
        to bottom,
        $grey-light 60%,
        $mb-icon-color 0%
      );
    }

    &[level="2"] {
      background: linear-gradient(
        to bottom,
        $grey-light 37%,
        $mb-icon-color 0%
      );
    }
  }
</style>

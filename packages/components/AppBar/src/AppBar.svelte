<header ref:navbar class="appbar" on:click="goback()">
  <div class="content">
    {#if leftIcon}
      <div class="icon-left" on:click="console.log('left-click')">
        X
      </div>
    {/if}

    {#if title}
      <div class="title">{title}</div>
    {/if}

    {#if rightIcon}
      <div class="icon-right" on:click="console.log('right-click')">
        X
      </div>
    {/if}
  </div>
</header>

<script>
  export default {
    data() {
      return {
        position: 'static',
      }
    },
    oncreate() {
      const { color, position } = this.get()
      const navBar = this.refs.navbar

      navBar.style.position = position
      if (color) {
        navBar.style.backgroundColor = color
      }
    },
    methods: {
      async goback() {
        const { getHistory } = await import('svelte-routing')
        getHistory().goBack()
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';
  @import '@mamba/styles-utils/src/appbar.scss';

  .appbar {
    position: static;
    background-color: $primary-color;
    width: 100%;
    z-index: 1100;
  }

  .title {
    padding: 0;
    margin: 0;
    color: $mb-appbar-font-color;
    font-size: $mb-appbar-font-size;
    font-weight: 600;
    line-height: $mb-appbar-height;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: $mb-appbar-item-horizontal-margin;
    padding-right: $mb-appbar-item-horizontal-margin;
    min-height: $mb-appbar-height;
    color: $mb-appbar-font-color;
  }

  .icon {
    cursor: pointer;
    height: $mb-appbar-height;
    width: 34px;
  }

  .icon-left,
  .icon-right {
    position: absolute;
    background-color: #fff;
    mask-size: 1em;
    mask-position: 0;
  }

  .icon-left {
    left: 0;
    margin-left: $mb-appbar-item-horizontal-margin;
  }

  .icon-right {
    margin-left: initial;
    margin-right: $mb-appbar-item-horizontal-margin;
    right: 0;
    mask-position: right, center;
  }
</style>

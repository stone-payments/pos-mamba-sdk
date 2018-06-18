<header class="appbar" {style}>
  <div class="content">
    {#if showBackBtn}
      <div class="icon-left" on:click="goback()">
        <Icon symbol="chevron-left" color={$locked ? '#dbdbdb' : textColor} />
      </div>
    {/if}

    {#if title}
      <div class="title">{title}</div>
    {/if}

    <!-- {#if rightIcon}
      <div class="icon-right" on:click="console.log('right-click')">
        X
      </div>
    {/if} -->
  </div>
</header>

<script>
  import { getHistory } from 'svelte-routing'

  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        title: null,
        location: undefined,
        position: 'relative',
        textColor: '#fff',
        bgColor: '#4ebf1a',
      }
    },
    computed: {
      style({ bgColor, textColor, position }) {
        return [
          `position:${position}`,
          `color:${textColor}`,
          `background-color:${bgColor}`,
        ].join(';')
      },
      showBackBtn: ({ location }) => location !== '/',
    },
    oncreate() {
      const history = getHistory()

      /** Listen for route changes */
      this.set({ location: history.location.pathname })
      history.listen(location => {
        this.set({ location: location.pathname })
      })

      if (this.store) {
        this.store.on('title', title => {
          this.set({ title })
        })
      }

    },
    methods: {
      goback() {
        if (this.store) {
          const { locked } = this.store.get()
          if (locked) return
        }
        getHistory().goBack()
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';
  @import '@mamba/styles-utils/src/appbar.scss';

  .appbar {
    width: 100%;
    z-index: 1000;
  }

  .title {
    padding: 0;
    margin: 0;
    color: inherit;
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
    padding-left: $mb-appbar-item-horizontal-margin;
    padding-right: $mb-appbar-item-horizontal-margin;
    min-height: $mb-appbar-height;
  }

  .icon {
    cursor: pointer;
    height: $mb-appbar-height;
    width: 34px;
  }

  .icon-left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: none;
    mask-size: 1em;
    mask-position: 0;
    line-height: 1;
  }

  .icon-left {
    left: 0;
    margin-left: $mb-appbar-item-horizontal-margin;
  }

  // .icon-right {
  //   margin-left: initial;
  //   margin-right: $mb-appbar-item-horizontal-margin;
  //   right: 0;
  //   mask-position: right, center;
  // }
</style>

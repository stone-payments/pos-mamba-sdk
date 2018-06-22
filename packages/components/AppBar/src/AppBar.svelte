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
      if (history) {
        this.set({ location: history.location.pathname })
        history.listen(location => {
          this.set({ location: location.pathname })
        })
      }

      if (this.store) {
        this.store.on('meta:title', title => {
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

<style>
  @import '@mamba/styles/colors.pcss';

  $height: 36px;
  $item-horizontal-margin: 8px;

  $background-color: $white;
  $border-color: $grey-light;

  $font-size: 0.9rem;
  $font-color: $white;

  .appbar {
    width: 100%;
    z-index: 1000;
  }

  .title {
    max-width: 154px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
    color: inherit;
    font-size: $font-size;
    font-weight: 600;
    line-height: $height;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .content {
    padding-left: $item-horizontal-margin;
    padding-right: $item-horizontal-margin;
    min-height: $height;
  }

  .icon {
    cursor: pointer;
    height: $height;
    width: 34px;
  }

  .icon-left {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: $item-horizontal-margin;
    padding-right: $item-horizontal-margin;
  }

  /*.icon-right {
      margin-left: initial;
      margin-right: $item-horizontal-margin;
      right: 0;
      mask-position: right, center;
    }*/
</style>

<header class="appbar" {style}>
  <div class="content">
    {#if !isAtHome}
      <div class="icon-left" on:click="goback()">
        <Icon symbol="chevron-left" color={$__meta__.locked ? '#dbdbdb' : textColor} />
      </div>
    {/if}

    {#if title}
      <div class="title">{title}</div>
    {/if}

    <div class="icon-right" on:click="gohome()">
      <Icon symbol={homeIcon} color={textColor}/>
    </div>
  </div>
</header>

<script>
  import App from '@mamba/native/app'
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
      isAtHome: ({ location }) => location === '/',
      homeIcon: ({ isAtHome }) => isAtHome ? 'home' : 'app-home',
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
      gohome() {
        const { isAtHome } = this.get()
        if(isAtHome) {
          App.close()
        } else {
          const history = getHistory()
          history.push('/')
        }
      },
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
    z-index: 1002;
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

  .icon-left,
  .icon-right {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: $item-horizontal-margin;
    padding-right: $item-horizontal-margin;
  }

  .icon-left {
    left: 0;
  }

  .icon-right {
    padding-left: $item-horizontal-margin;
    padding-right: $item-horizontal-margin;
    right: 0;
  }
</style>

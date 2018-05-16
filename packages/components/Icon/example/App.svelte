<div class="icons">
  <h1>Icons</h1>

  <div class="row">
    {#each icons as icon}
      <Icon symbol="{icon}" />
    {/each}
  </div>

  <h1>Small icons <span>{'<Icon size="small" />'}</span></h1>

  <div class="row">
    {#each icons as icon}
      <Icon symbol="{icon}" size="small" />
    {/each}
  </div>

  <h1>Large icons <span>{'<Icon size="large" />'}</span></h1>

  <div class="row">
    {#each icons as icon}
      <Icon symbol="{icon}" size="large" />
    {/each}
  </div>

  <h1>Colored Icons <span>{'<Icon color="..." />'}</span></h1>

  <div class="row">
    {#each icons as icon}
      <Icon symbol="{icon}" color="{getRandomColor()}" />
    {/each}
  </div>

  <h1>Custom Icons <span>{'<Icon src="..." />'}</span></h1>

  <div class="row">
    <Icon src="assets/icons/account.svg" />
  </div>

  <h1>Gradual Icons <span>{'<Icon symbol="..." level="number" />'}</span></h1>

  <div class="row">
    <Icon symbol="wifi" level="0" />
    <Icon symbol="wifi" level="1" />
    <Icon symbol="wifi" level="2" />
    <Icon symbol="wifi" level="3" />
  </div>

</div>

<style>
  h1 span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    font-family: monospace;
  }

  .icons {
    max-width: 80%;
    width: 700px;
    margin: 0 auto;
  }

  .row {
    margin-bottom: 50px
  }
</style>

<script>
  export default {
    components: {
      Icon: '../src',
    },
    computed: {
      getRandomColor(state) {
        return () => `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`
      },
    },
    data() {
      return {
        icons: [
          'account',
          'alert',
          'autorenew',
          'bookmark',
          'calendar',
          'check',
          'chevron-down',
          'chevron-left',
          'chevron-right',
          'chevron-up',
          'close-circle',
          'close',
          'credit-card',
          'delete',
          'eye-off',
          'eye',
          'floppy',
          'heart',
          'help-circle',
          'home',
          'information',
          'lock-open',
          'lock-stn-open',
          'lock-stn',
          'lock',
          'loop',
          'menu',
          'pencil',
          'plus',
          'printer-outline',
          'printer',
          'refresh',
          'settings',
          'signal-2g',
          'signal-3g',
          'signal-4g',
          'signal-hspa-plus',
          'signal-hspa',
          'signal-variant',
          'signal',
          'star-outline',
          'star',
          'wifi',
        ],
      }
    },
  }
</script>

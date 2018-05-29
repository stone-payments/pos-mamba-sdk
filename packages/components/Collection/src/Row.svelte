<!-- If there's a href defined, wrap the row with a link -->
<div class="row" on:click="handleClick({ href })">
  <div class="main">
    <div class="label">{label}</div>
    <div class="controller">
      {#if href && !hasCustomController}
        <Icon symbol="chevron-right"/>
      {:else}
        <slot name="controller"></slot>
      {/if}
    </div>
  </div>
  {#if description}
    <div class="extra">
      <p>{description}</p>
    </div>
  {/if}
</div>

<script>
  import { getHistory } from 'svelte-routing'

  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        href: undefined,
        description: undefined,
        hasCustomController: false,
      }
    },
    oncreate() {
      this.set({
        hasCustomController: !!(this.options.slots && this.options.slots.controller),
      })
    },
    methods: {
      handleClick({ href }) {
        if(!href) return
        getHistory().push(href)
      },
    },
  }
</script>

<style type="text/scss">
  @import '@mamba/styles-utils/src/colors.scss';
  @import './Row.style.scss';

  .main {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .extra {
    color: $grey;

    :global(p) {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  .controller {
    line-height: 1
  }

  .label {
    font-weight: bold;
  }
</style>

<!-- If there's a href defined, wrap the row with a link -->
{#if href}
  <a {href} class="row">
    <div class="main">
      <div class="label">{label}</div>
      <div class="controller">
        <Icon symbol="chevron-right"/>
      </div>
    </div>
    {#if hasExtra}
      <div class="extra">
        <slot name="description"></slot>
      </div>
    {/if}
  </a>
{:else}
  <div class="row">
    <div class="main">
      <div class="label">{label}</div>
      <div class="controller">
        <slot name="controller"></slot>
      </div>
    </div>
    <div class="extra">
      <slot name="description"></slot>
    </div>
  </div>
{/if}

<script>
  import Icon from '@mamba/icon'

  export default {
    components: {
      Icon,
    },
    data() {
      return {
        href: undefined,
        hasExtra: false,
      }
    },
    oncreate() {
      this.set({
        hasExtra: !!(this.options.slots && this.options.slots.description),
      })
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

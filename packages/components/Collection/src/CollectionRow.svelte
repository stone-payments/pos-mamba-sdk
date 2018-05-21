<!-- If there's a href defined, wrap the row with a link -->
{#if href}
  <a {href} class="row">
    <div class="label">{label}</div>
    <div class="controller">
      <Icon symbol="chevron-right"/>
    </div>
  </a>
{:else}
  <div class="row">
    <div class="label">{label}</div>
    <div class="controller">
      <slot name="controller"></slot>
    </div>
  </div>
{/if}

<script>
  export default {
    components: {
      Icon: '@mamba/icon',
    },
    data() {
      return {
        href: undefined,
      }
    },
  }
</script>

<style>
  .controller {
    line-height: 1
  }

  .label {
    font-weight: bold;
  }
</style>

{#if shape === 'circular'}
{:else}
  <div class="progress-bar {progressClass}" {style}>
    {#if typeof progress === undefined}
      <div class="progress"></div>
    {:else}
      <div class="progress" style="width: {progress}"></div>
    {/if}
  </div>
{/if}

<script>
  export default {
    data() {
      return {
        color: '#6ebf1a',
        height: '6px',
        progress: undefined,
        shape: undefined,
      }
    },
    computed: {
      progressClass({ progress }) {
        return typeof progress === 'undefined' ? 'is-infinite' : ''
      },
      style({ color, height }) {
        return [
          `background-color:${color}`,
          `height:${height}`,
        ].join(';')
      },
    },
  }
</script>

<style>
  @import '@mamba/styles/colors.pcss';

  .progress-bar {
    display: block;
    width: 100%;
    overflow: hidden;
    background-color: $green;
  }

  .progress {
    height: inherit;
    background-color: #000;
    opacity: .3;

    .progress-bar.is-infinite & {
      transform: translateX(-100%);
      width: 80%;
      animation: indeterminate 2.1s ease-in-out infinite;
    }
  }

  @keyframes indeterminate {
    to {
      transform: translateX(125%);
    }
  }

</style>

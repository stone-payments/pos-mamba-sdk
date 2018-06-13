<div class="round-icon" {size} style="background-color: {bgColor}; border-radius: {borderRadius};">
  <Icon {...iconAttrs} on:click/>
</div>

<script>
  export default {
    components: {
      Icon: './Icon.svelte',
    },
    data() {
      return {
        borderRadius: '50%',
        bgColor: '#4ebf1a',
        color: '#fff',
        size: 'normal',
      }
    },
    oncreate() {
      const iconAttrs = Object.assign({}, this.get())
      delete iconAttrs.bgColor
      this.set({ iconAttrs })
    },
  }
</script>

<style>
  .round-icon {
    display: inline-block;
    padding: 15px;
    background-color: red;
    text-align: center;
  }

  [size='small'] {
    padding: 5px;
  }

  [size='normal'] {
    padding: 10px;
  }

  [size='large'] {
    padding: 15px;
  }
</style>

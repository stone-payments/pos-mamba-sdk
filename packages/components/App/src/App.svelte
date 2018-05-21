<div use:links>
  <slot></slot>
</div>

<script>
  import links from "svelte-routing/links";
  export default {
    data() {
      return {
        disabled: false,
        checked: false,
      }
    },
    actions: {
      links,
    },
  }
</script>

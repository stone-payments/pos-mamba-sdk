<div use:links>
  <slot></slot>
</div>

<script>
  import { createHashHistory } from 'svelte-routing';
  import links from 'svelte-routing/links';

  createHashHistory()

  export default {
    actions: {
      links,
    },
  }
</script>

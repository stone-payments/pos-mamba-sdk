<svelte:window on:keydown="handleKeyDown(event)"/>

<div use:links>
  <slot></slot>
</div>

<script>
  import { KEYMAP } from '@mamba/native/keyboard'
  import { createHashHistory } from 'svelte-routing'
  import links from 'svelte-routing/links'

  createHashHistory()

  export default {
    actions: {
      links,
    },
    methods: {
      handleKeyDown(e) {
        const key = KEYMAP[e.keyCode] || e.keyCode - 48
        const shortcutEl = document.querySelector(`[shortcut='${key}']`)
        console.log(shortcutEl)
        if (shortcutEl && document.activeElement !== shortcutEl) {
          if(shortcutEl.tagName.toLowerCase() === 'button' || shortcutEl.type === 'button') {
            shortcutEl.click()
          }
        }
      },
    },
  }
</script>

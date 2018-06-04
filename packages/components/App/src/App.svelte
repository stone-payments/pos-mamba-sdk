<svelte:window on:keydown="handleKeyDown(event)"/>

<div use:links>
  <slot></slot>
</div>

<script>
  import Keyboard from '@mamba/native/keyboard'
  import { createHashHistory } from 'svelte-routing'
  import links from 'svelte-routing/links'

  createHashHistory({
    basename: '/',
  })

  export default {
    actions: {
      links,
    },
    methods: {
      handleKeyDown(e) {
        const keyName = Keyboard.KEYMAP[e.keyCode]

        /** If the key is not mapped (for some reason, do nothing) */
        if(!keyName) return

        const shortcutEl = document.querySelector(`[shortcut='${keyName}']`)

        /** If the key is 'enter', check if the shortcut element isn't already focused */
        if (shortcutEl && (keyName !== 'enter' || document.activeElement !== shortcutEl)) {
          // Adapted from
          // https://stackoverflow.com/questions/15739263/phantomjs-click-an-element
          const clickEvent = document.createEvent('MouseEvent')
          clickEvent.initMouseEvent(
            'click',
            true,
            true,
            window,
            null,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null,
          )
          shortcutEl.dispatchEvent(clickEvent)
        }
      },
    },
  }
</script>

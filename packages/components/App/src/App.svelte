<svelte:window on:keydown="onKeyDown(event)"/>

<div class="app" use:links>
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
      onKeyDown(e) {
        const keyName = Keyboard.getKeyName(e.keyCode)

        /** If the key is not mapped or we're inside an input, do nothing */
        if (!keyName || e.target.tagName === 'INPUT') {
          return
        }

        const shortcutEl = document.querySelector(`[shortcut='${keyName}']`)

        /** If the key is 'enter', check if the shortcut element isn't already focused */
        if (
          shortcutEl &&
          (keyName !== 'enter' || document.activeElement !== shortcutEl)
        ) {
          /**
           * If a shortcut key was clicked and is a numeric one, prevent
           * the keypress/input/keyup of being fired on a possible to be .focus() input
           */
          if (Keyboard.isNumericKey(e.keyCode)) {
            e.preventDefault()
          }

          /*
                   * Adapted from:
                   * https://stackoverflow.com/questions/15739263/phantomjs-click-an-element
                  */
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

<style>
  .app {
    height: 100%;
  }
</style>

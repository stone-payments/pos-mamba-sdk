<svelte:window on:keyup="onKeyup(event)" on:keydown="onKeydown(event)"/>

<div class="app" use:links>
  <slot></slot>
</div>

<script>
  import Keyboard from '@mamba/native/keyboard'
  import { createHashHistory, getHistory } from 'svelte-routing'
  import links from 'svelte-routing/links'

  createHashHistory({
    basename: '/',
  })

  const validBackCommand = keyName =>
    keyName === 'back' &&
    document.activeElement &&
    document.activeElement.tagName !== 'INPUT'

  export default {
    actions: {
      links,
    },
    methods: {
      goBack() {
        const history = getHistory()

        if (history.location.pathname !== '/') {
          history.goBack()
        }
      },
      /** Prevent default back button behaviour */
      onKeydown(e) {
        const keyName = Keyboard.getKeyName(e.keyCode)
        if (validBackCommand(keyName)) {
          e.preventDefault()
        }
      },
      onKeyup(e) {
        const keyName = Keyboard.getKeyName(e.keyCode)

        /** Handles back button */
        if (validBackCommand(keyName)) {
          e.preventDefault()
          this.goBack()
        }

        if (this.store) {
          if (this.store.meta.get('shortcuts') === false) {
            return
          }
        }

        /** If the key is not mapped or is the 'close' key or an input is focused */
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
    background-color: #fff;
  }
</style>

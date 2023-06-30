<script lang="ts">
  import { MODELS } from '@mamba/device';
  import Keyboard from '@mamba/jade/src/Keyboard/api/keyboard'
  import store from '../../store';

  import MP35P from './Q60.svelte';
  import MP35 from './MP35.svelte';
  import S920 from './S920.svelte';
  import D195 from './D195.svelte';
  import D199 from './D199.svelte';
  import D230 from './D230.svelte';
  import Q60 from './Q60.svelte';
  import Q92 from './Q92.svelte';

  const getKeyboardEvent = (event, code, keyName) =>
    new KeyboardEvent(event, {
      bubbles: true,
      cancelable: true,
      key: keyName,
      charCode: code,
      keyCode: code,
      which: code,
    });

  const defaultKeyboard = S920;

  const keyboardDevices = [
    {
      title: MODELS.S920,
      component: S920,
    },
    {
      title: MODELS.Q92,
      component: Q92,
    },
    {
      title: MODELS.MP35P,
      component: MP35P,
    },
    {
      title: MODELS.MP35,
      component: MP35,
    },
    {
      title: MODELS.D195,
      component: D195,
    },
    {
      title: MODELS.D199,
      component: D199,
    },
    {
      title: MODELS.D230,
      component: D230,
    },
    {
      title: MODELS.Q60,
      component: Q60,
    },
  ];

  function dispatchKey(e: CustomEvent<{ event: Event, keyName: string }>) {
    /** Prevent the button from being focused */
    e.detail.event.stopImmediatePropagation();
    const el = document.activeElement;
    const isInputOnFocus = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
    const keyCode = Keyboard.getKeyCode(e.detail.keyName);

    /** We have to handle input actions manually */
    if (isInputOnFocus) {
      /** If action button clicked */
      if (Keyboard.isActionKey(keyCode)) {
        /** The actual 'back' is handled by that 'handleKeyUp' method */
        if (e.detail.keyName === 'back') {
          el.value = el.value.slice(0, -1);
        }
        /** If numeric button clicked */
      } else if (el.maxLength < 0 || el.value.length + 1 <= el.maxLength) {
        el.value += e.detail.keyName;
      }
    }

    el.dispatchEvent(getKeyboardEvent('keydown', keyCode, e.detail.keyName));
    el.dispatchEvent(getKeyboardEvent('keypress', keyCode, e.detail.keyName));
    if (isInputOnFocus) {
      el.dispatchEvent(getKeyboardEvent('input', keyCode, e.detail.keyName));
    }
    el.dispatchEvent(getKeyboardEvent('keyup', keyCode, e.detail.keyName));
  }

  const getModel = () => {
    try {
      const { component } = keyboardDevices.find(({ title }) => title === $store.ACTIVE_MODEL);
      return component;
    } catch (error) {
      return defaultKeyboard;
    }
  };
  let activeModel = getModel();
</script>

<slot>
  <svelte:component this={activeModel} on:key={dispatchKey} />
</slot>

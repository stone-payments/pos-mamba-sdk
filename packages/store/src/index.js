import Keyboard from '@mamba/native/keyboard'
import MambaStore from './MambaStore'
import { setDeep } from 'svelte-extras'

export default initialData => {
  const store = new MambaStore(initialData)

  store.on('lock', locked => {
    if (locked) {
      console.log('Locking App')
      Keyboard.disableBackspace()
    } else {
      console.log('Unlocking App')
      Keyboard.enableBackspace()
    }

    setDeep.call(store, '__meta__.locked', locked)
  })
  return store
}

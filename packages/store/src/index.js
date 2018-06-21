import Keyboard from '@mamba/native/keyboard'
import MambaStore from './MambaStore'

export default initialData => {
  const store = new MambaStore(initialData)

  store.on('meta:lock', locked => {
    if (locked) {
      console.log('Locking App')
      Keyboard.disableBackspace()
    } else {
      console.log('Unlocking App')
      Keyboard.enableBackspace()
    }

    store.setDeep('__meta__.locked', locked)
  })
  return store
}

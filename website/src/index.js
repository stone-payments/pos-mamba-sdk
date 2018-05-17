import { createHashHistory } from 'svelte-routing'
import App from './App.html'

createHashHistory()

const app = new App({
  target: document.getElementById('root'),
  data: {
    name: 'world',
  },
})

window.app = app

export default app

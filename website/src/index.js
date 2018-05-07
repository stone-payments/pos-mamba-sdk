import { createHashHistory } from 'svelte-routing'
import App from './components/App'

createHashHistory()

const app = new App({
  target: document.getElementById('root'),
  data: {
    name: 'world',
  },
})

window.app = app

export default app

import { createHashHistory } from 'svelte-routing'
import App from './App.html'

import './styles/reset.scss'
import './styles/app.css'

createHashHistory()

const renderApp = () => {
  const app = new App({
    target: document.getElementById('root'),
    data: {
      name: 'world',
    },
  })
  window.app = app
}

if (module.hot) {
  module.hot.accept()
}

renderApp()

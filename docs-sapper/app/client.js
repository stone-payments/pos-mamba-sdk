import { init } from 'sapper/runtime.js'
import store from '../client/store.js'
import { routes } from './manifest/client.js'
import App from './App.html'
import 'styles/app.css'

const renderApp = () => {
  init({
    target: document.querySelector('#sapper'),
    routes,
    App,
    store: data => {
      store.set(data)

      fetch(`api/guide/contents`)
        .then(r => r.json())
        .then(guideContents => {
          store.set({ guideContents })
        })

      window.store = store
      return store
    },
  })
}

if (navigator.serviceWorker && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.onstatechange = function(e) {
    if (e.target.state === 'redundant') {
      import('./components/Toast.html').then(mod => {
        mod.default.show()
      })
    }
  }
}

renderApp()

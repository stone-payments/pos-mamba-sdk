import App from './App.html'
import createHistory from 'routes/history'
import './styles/reset.scss'
import './styles/app.css'

createHistory()

const renderApp = () => {
  const app = new App({
    target: document.getElementById('root'),
  })
  window.app = app
}

if (module.hot) {
  module.hot.accept()
}

renderApp()

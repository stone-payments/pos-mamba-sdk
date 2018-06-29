import { createBrowserHistory } from 'svelte-routing'
// Implement here Listen for changes to the current location.

const listenAndCreateHistory = listen => {
  const history = createBrowserHistory()

  // Listen for changes to the current location.
  history.listen(() => {
    if (listen && typeof listen === 'function') {
      setTimeout(listen())
    }
  })

  setTimeout(history.listen(), 1000)
}

export default listenAndCreateHistory

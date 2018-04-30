let dialog = { mount () {}, open () {}, close () {} } // Mock element for now

export default function (App) {
  function closeApp () {
    setTimeout(function () {
      App.doClose()
    }, 100)
  }

  App.close = function (showConfirmationDialog = false) {
    if (showConfirmationDialog) {
      dialog.open(action => {
        if (action === dialog.positiveAction) {
          closeApp()
        }
      })
    } else {
      closeApp()
    }
  }
}

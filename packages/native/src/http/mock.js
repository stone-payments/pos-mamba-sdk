function send({ method = 'GET', url = '', data, headers }) {
  return new Promise((resolve, reject) => {
    const xhttp = new window.XMLHttpRequest()

    xhttp.onprogress = function() {
      console.log('Requesting...')
    }

    xhttp.onerror = function() {
      reject(
        new Error({
          status: this.status,
          msg: this.responseText,
        }),
      )
    }

    xhttp.onreadystatechange = function() {
      /** On success state code 4 */
      if (this.readyState === 4) {
        resolve(this.responseText)
      }
    }

    xhttp.open(method, url, false)

    if (headers) {
      for (const key in headers) {
        xhttp.setRequestHeader(key, headers[key])
      }
    }

    xhttp.send(data)
  })
}

export default function(Http) {
  Object.assign(Http, {
    send,
  })
}

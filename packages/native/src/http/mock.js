function send({ method = 'GET', url = '', data, headers }, callback) {
  const xhttp = new window.XMLHttpRequest()

  xhttp.onprogress = function() {
    console.log('Requesting...')
  }

  xhttp.onerror = function() {
    callback(undefined, {
      status: this.status,
      msg: this.responseText,
    })
  }

  xhttp.onreadystatechange = function() {
    /** On success state code 4 */
    if (this.readyState === 4) {
      callback(this.responseText, undefined)
    }
  }

  xhttp.open(method, url)

  if (headers) {
    for (const key in headers) {
      xhttp.setRequestHeader(key, headers[key])
    }
  }

  xhttp.send(data)
}

export default function(Http) {
  console.log('aqui')
  Object.assign(Http, { send })
}

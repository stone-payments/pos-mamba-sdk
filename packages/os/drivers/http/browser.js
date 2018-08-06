export default function(Http) {
  Http.send = function send({ method = 'GET', url = '', data, headers }) {
    return new Promise((resolve, reject) => {
      const xhttp = new window.XMLHttpRequest();

      xhttp.onprogress = function onprogress() {
        console.log('Requesting...');
      };

      xhttp.onerror = function onerror() {
        reject(
          new Error({
            status: this.status,
            msg: this.responseText,
          }),
        );
      };

      xhttp.onreadystatechange = function onreadystatechange() {
        /** On success state code 4 */
        if (this.readyState === 4) {
          resolve(this.responseText);
        }
      };

      xhttp.open(method, url, false);

      if (headers) {
        Object.keys(headers).forEach(key => {
          xhttp.setRequestHeader(key, headers[key]);
        });
      }

      xhttp.send(data);
    });
  };
}

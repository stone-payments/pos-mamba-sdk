import { log } from '../../simulator/libs/utils.js';

export const NAMESPACE = '$Http';

export const SIGNALS = ['requestFinished', 'requestFailed'];

export function setup(Http) {
  let _errorData = null;
  let _data = null;

  Http.getError = () => _errorData;
  Http.getData = () => _data;

  Http.doSend = function send({ method = 'GET', url = '', data, headers }) {
    const xhttp = new XMLHttpRequest();

    if (__DEV__) {
      xhttp.onprogress = function onprogress() {
        log('Requesting...');
      };
    }

    xhttp.onerror = function onerror() {
      _errorData = new Error({
        status: this.status,
        msg: this.responseText,
      });
      Http.requestFailed();
    };

    xhttp.onreadystatechange = function onreadystatechange() {
      /** On success state code 4 */
      if (this.readyState === 4) {
        _data = this.responseText;
        Http.requestFinished();
      }
    };

    xhttp.open(method, url, false);

    if (headers) {
      Object.keys(headers).forEach(key => {
        xhttp.setRequestHeader(key, headers[key]);
      });
    }

    setTimeout(() => xhttp.send(data));
  };
}

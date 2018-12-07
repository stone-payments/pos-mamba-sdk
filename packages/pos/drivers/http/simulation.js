import { log } from '../../simulator/libs/utils.js';

export const NAMESPACE = '$Http';

export const SIGNALS = ['requestFinished', 'requestFailed'];

export function setup(Http) {
  let _errorData = null;
  let _data = null;

  const setError = function onerror() {
    _errorData = new Error({
      status: this.status,
      msg: this.responseText,
    });
    Http.fire('requestFailed');
  };

  Http.getError = () => _errorData;
  Http.getData = () => _data;

  Http.doSend = function send({ method = 'GET', url = '', data, headers }) {
    const xhttp = new XMLHttpRequest();

    if (__DEV__) {
      xhttp.onprogress = function onprogress() {
        log('Requesting...');
      };
    }

    xhttp.onerror = setError;

    xhttp.onloadend = function onloadend() {
      if (this.status === 404) {
        setError.call(this);
      }
    };

    xhttp.onreadystatechange = function onreadystatechange() {
      /** On success state code 4 */
      if (this.readyState === 4 && this.status === 200) {
        _data = this.responseText;
        Http.fire('requestFinished');
      }
    };

    xhttp.open(method, url, false);

    if (headers) {
      Object.keys(headers).forEach(key => {
        xhttp.setRequestHeader(key, headers[key]);
      });
    }

    setTimeout(() => {
      try {
        xhttp.send(data);
      } catch (e) {
        setError.call(xhttp);
      }
    });
  };
}

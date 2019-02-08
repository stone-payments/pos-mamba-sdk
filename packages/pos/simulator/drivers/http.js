import { log } from '../libs/utils.js';
import { Registry } from '../index.js';

export const NAMESPACE = '$Http';

export const SIGNALS = ['requestFinished', 'requestFailed'];

export const SETTINGS = {
  panel: {
    simulateRequest: false,
    requestMsg: '{}',
    requestPayload: '{}',
  },
};

export function setup(Http) {
  let _errorData = null;
  let _data = null;

  const setError = function onerror() {
    _errorData = {
      status: this.status,
      msg: this.responseText,
    };
    Http.fire('requestFailed');
  };

  Http.getError = () => _errorData;
  Http.getData = () => _data;

  Http.doSend = function send({ method = 'GET', url = '', data, headers }, refSignal) {
    const xhttp = new XMLHttpRequest();

    if (__DEBUG_LVL__ >= 1) {
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
        Http.fire('requestFinished', _data, refSignal);
      }
    };

    const { panel } = Registry.get().$Http;

    if (panel.simulateRequest) {
      const requestMsg = JSON.parse(panel.requestMsg);
      const requestPayload = JSON.parse(panel.requestPayload);

      setTimeout(() => {
        if (parseInt(requestMsg.status, 10) > 399) {
          _errorData = requestMsg;
          Http.fire('requestFailed', _errorData, refSignal);
        } else {
          _data = Object.assign({}, requestMsg, requestPayload);
          Http.fire('requestFinished', _data, refSignal);
        }
      }, 1000);

      return;
    }

    xhttp.open(method, url, true);

    if (headers) {
      Object.keys(headers).forEach(key => {
        xhttp.setRequestHeader(key, headers[key]);
      });
    }

    try {
      xhttp.send(data);
    } catch (e) {
      setError.call(xhttp);
    }
  };
}

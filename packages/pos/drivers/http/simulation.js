import { log } from '../../simulator/libs/utils.js';
import Core from '../../simulator/core.js';

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

    const panel = Core.Registry.get('$Http.panel');
    if (panel.simulateRequest) {
      const requestMsg = JSON.parse(panel.requestMsg);
      const requestPayload = JSON.parse(panel.requestPayload);

      setTimeout(() => {
        if (parseInt(requestMsg.status, 10) > 399) {
          _errorData = requestMsg;
          Http.fire('requestFailed');
        } else {
          _data = Object.assign({}, requestMsg, requestPayload);
          Http.fire('requestFinished');
        }
      }, 1000);

      return;
    }

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

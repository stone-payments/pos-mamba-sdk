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

    if (Core.Registry.get('$Http.panel.simulateRequest')) {
      const requestMsg = JSON.parse(
        Core.Registry.get('$Http.panel.requestMsg'),
      );
      const payload = JSON.parse(
        Core.Registry.get('$Http.panel.requestPayload'),
      );
      setTimeout(() => {
        if (parseInt(requestMsg.status, 10) > 399) {
          _errorData = requestMsg;
          Http.requestFailed();
        }
        _data = Object.assign(requestMsg, payload);
        Http.requestFinished();
      }, 1000);
    } else {
      xhttp.open(method, url, false);

      if (headers) {
        Object.keys(headers).forEach(key => {
          xhttp.setRequestHeader(key, headers[key]);
        });
      }

      setTimeout(() => xhttp.send(data));
    }
  };
}

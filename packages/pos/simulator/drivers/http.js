import { log } from '../libs/utils.js';
import { Registry } from '../index.js';

export const NAMESPACE = '$Http';

export const SIGNALS = ['requestRefSinal', 'requestFinished', 'requestFailed'];

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

  const setError = function onerror(refSignal) {
    _errorData = {
      status: this.status,
      msg: this.responseText,
    };
    Http.fire('requestFailed', _errorData, refSignal);
  };

  Http.getError = () => _errorData;
  Http.getData = () => _data;

  Http.doSend = function send(
    { method = 'GET', url = '', data, headers, timeout = 30000 },
    refSignal,
  ) {
    const xhttp = new XMLHttpRequest();

    Http.fire('requestRefSinal', refSignal, refSignal);

    if (__DEBUG_LVL__ >= 1) {
      xhttp.onprogress = function onprogress() {
        log('Requesting...');
      };
    }

    xhttp.onerror = setError;

    xhttp.ontimeout = function ontimeout() {
      _errorData = {
        status: 504,
        msg: 'Gateway Time-Out',
      };
      Http.fire('requestFailed', _errorData, refSignal);
    };

    xhttp.onloadend = function onloadend() {
      if (this.status >= 300) {
        _errorData = {
          status: this.status,
          msg: this.responseText,
        };
        setError.call(this, refSignal);
      }
    };

    xhttp.onreadystatechange = function onreadystatechange() {
      /** On success state code 4 */
      if (this.readyState === 4 && (this.status >= 200 && this.status < 300)) {
        _data = {
          status: this.status,
          body: this.responseText,
        };
        Http.fire('requestFinished', _data, refSignal);
      }
    };

    const { panel } = Registry.get().$Http;

    if (panel.simulateRequest) {
      const requestMsg = JSON.parse(panel.requestMsg);

      if (timeout > 0) {
        setTimeout(() => {
          _errorData = {
            status: 504,
            msg: 'Gateway Time-Out',
          };
          Http.fire('requestFailed', _errorData, refSignal);
        }, panel.timeout);
        return;
      }

      setTimeout(() => {
        if (parseInt(requestMsg.status, 10) !== 200) {
          _errorData = {
            status: requestMsg.status,
            msg: requestMsg.msg,
          };
          Http.fire('requestFailed', _errorData, refSignal);
        } else {
          _data = {
            status: requestMsg.status,
            body: panel.requestPayload,
          };
          Http.fire('requestFinished', _data, refSignal);
        }
      }, 1000);

      return;
    }
    if (panel.activeProxy) {
      url = `https://poiproxy.stone.com.br/v1/proxy?url=${encodeURIComponent(
        url,
      )}`;
      headers['X-Mamba-App'] = panel.appKey;
      headers['X-Mamba-SN'] = Registry.persistent.get().$System.serialNumber;
      headers['X-Stone-Code'] = Registry.persistent.get().$Merchant.stoneCode;
    }

    xhttp.open(method, url, true);

    xhttp.timeout = timeout;

    if (headers) {
      Object.keys(headers).forEach(key => {
        xhttp.setRequestHeader(key, headers[key]);
      });
    }

    try {
      xhttp.send(data);
    } catch (e) {
      setError.call(xhttp, refSignal);
    }
  };
}

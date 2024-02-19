import { log, LOG_PREFIX } from '../libs/utils.js';
import { Registry } from '../index.js';
import { useAddHeaderHook } from '../events/hooks.js';

export const NAMESPACE = '$Http';

export const SIGNALS = ['requestRefSinal', 'requestFinished', 'requestFailed'];

export const DEFAULT_PANEL_SETTINGS = {
  simulateTimeout: 0,
  simulateRequest: false,
  requestMsg: '',
  responseBody: '',
  simulateUrlPattern: '',
  simulateHeaders: '',
  simulateHeadersUrlPattern: '',
  simulateRequestTime: 1000,
};

export const SETTINGS = {
  panel: {
    ...DEFAULT_PANEL_SETTINGS,
  },
};

export const PERSISTENT_SETTINGS = {
  panel: {
    activeProxy: false,
    proxyEnvironment: 'poiproxy-stg',
    persistSimulateConfig: false,
  },
};

/**
 * Create a map of header names to values
 * @param {string} rawHeaders
 * @returns {Object.<string, any>}
 */
function parseRawHeaders(rawHeaders) {
  // Convert the header string into an array
  // of individual headers
  const arr = rawHeaders.trim().split(/[\r\n]+/);
  const map = {};
  arr.forEach((line) => {
    const parts = line.split(': ');
    let header = parts.shift();
    header = header
      .split('-')
      .map((i) => i.slice(0, 1).toUpperCase() + i.slice(1))
      .join('-');
    const value = parts.join(': ');
    map[header] = value;
  });
  return map;
}

export function setup(Http) {
  let _errorData = null;
  let _data = null;

  const headerHook = useAddHeaderHook();

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
    {
      method = 'GET',
      url = '',
      data,
      headers,
      timeout = 30000,
      hmac = false,
      proxy = false,
      connect = undefined,
      encodeURI = false,
      corsProtocol = 'http:',
      corsHost = undefined,
      corsPort = undefined,
    },
    refSignal,
  ) {
    const xhttp = new XMLHttpRequest();
    let stateHedersMap = {};

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

    const { panel } = Registry.get().$Http;

    xhttp.onreadystatechange = function onreadystatechange() {
      if (this.readyState === this.HEADERS_RECEIVED) {
        // Get the raw header string
        const resHeaders = this.getAllResponseHeaders();
        stateHedersMap = parseRawHeaders(resHeaders);
      }

      if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
        /** On success state code 4 */
        _data = {
          status: this.status,
          body: this.responseText,
          headers: { ...stateHedersMap, ...panel.simulateHeaders },
        };
        Http.fire('requestFinished', _data, refSignal);
      }
    };

    if (panel.simulateRequest) {
      const requestMsg = JSON.parse(panel.requestMsg);

      if (panel.timeout > 0) {
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
        let stringfiedBody = panel.responseBody === '{}' ? '' : panel.responseBody;

        try {
          stringfiedBody = JSON.parse(JSON.stringify(stringfiedBody));
        } catch (_) {
          // do nothing
        }

        if (parseInt(requestMsg.status, 10) !== 200) {
          _errorData = {
            status: requestMsg.status,
            msg: requestMsg.msg,
            body: stringfiedBody,
          };
          Http.fire('requestFailed', _errorData, refSignal);
        } else {
          let hasMachtingUrl = typeof panel.simulateHeadersUrlPattern === 'string';
          try {
            hasMachtingUrl = new RegExp(panel.simulateHeadersUrlPattern).test(url);
          } catch (_) {
            // regex failed
          }

          _data = {
            status: requestMsg.status,
            body: stringfiedBody,
            headers:
              panel.simulateHeaders && hasMachtingUrl
                ? parseRawHeaders(panel.simulateHeaders) || {}
                : {},
          };
          Http.fire('requestFinished', _data, refSignal);
        }
      }, panel.simulateRequestTime);

      return;
    }
    const canAddHeaders = typeof headers === 'object' && headers !== null;

    if (hmac === true && canAddHeaders) {
      const requester = headerHook(({ key, value }) => {
        if (typeof key === 'string' && typeof value === 'string') {
          headers[key] = value;
        }
      });
      requester(method, data, url);
    }

    function shouldAddCors(urlFrom) {
      if (typeof corsHost === 'string') {
        // Rewrite endpoint to use CORS server address with simulator.
        // Ex.: `http://localhost:1300/${url}`;

        const corsPortPart = corsPort ? `:${corsPort}` : '';
        return `${corsProtocol}//${corsHost}${corsPortPart}/${urlFrom}`;
      }

      return urlFrom;
    }

    if ((panel.activeProxy && canAddHeaders && proxy === true) || connect === 'NET') {
      const urlParam = encodeURI ? encodeURIComponent(url) : url;

      const { proxyEnvironment } = Registry.persistent.get().$Http.panel;

      url = `https://${proxyEnvironment}.stone.com.br/v1/proxy?url=${urlParam}`;

      url = shouldAddCors(url);

      const isInvalidXheader = (prop) => !prop || prop === '';

      let { appKey } = Registry.persistent.get().$App;
      const { serialNumber } = Registry.persistent.get().$System;
      const { stoneCode } = Registry.persistent.get().$Merchant;

      if (isInvalidXheader(serialNumber)) {
        throw new Error('Proxy enabled but Serial Number on panel is invalid');
      }

      if (isInvalidXheader(stoneCode)) {
        throw new Error('Proxy enabled but Stone Code on panel is invalid');
      }

      if (isInvalidXheader(appKey)) {
        appKey = __APP_MANIFEST__.appKey;
        if (isInvalidXheader(appKey) || appKey === '11-11-11-11') {
          throw new Error('Proxy enabled but appKey on panel or in package.json is invalid');
        }
      }

      headers['X-Mamba-SN'] = serialNumber;
      headers['X-Stone-Code'] = stoneCode;
      headers['X-Mamba-App'] = appKey;
    } else {
      url = shouldAddCors(url);
    }

    xhttp.open(method, url, true);

    xhttp.timeout = timeout;

    if (canAddHeaders) {
      console.groupCollapsed(`${LOG_PREFIX} Adding addon headers`);
      Object.keys(headers).forEach((key) => {
        console.log(`${key}: ${headers[key]}`);
        xhttp.setRequestHeader(key, headers[key]);
      });
      console.log(headers);
      console.groupEnd();
    }

    try {
      setTimeout(() => {
        xhttp.send(data);
      });
    } catch (e) {
      setError.call(xhttp, refSignal);
    }
  };

  Http.doSendRequest = function send(...args) {
    if (args.length > 0 && typeof args[0] === 'object') args[0].encodeURI = true;
    Http.doSend.apply(this, ...args);
  };
}

export default function init(_runTests) {
  function LOGLogger(start = '', level = 'default', ...logs) {
    const applyErrorColor = s => `\u001b[1;31m${s}\u001b[0m`;
    const applyYellow = s => `\x1B[33m${s}\x1B[0m`;
    const applyInfoColor = s => `\x1B[36m${s}\x1B[0m`;
    const isError = level === 'error';
    const isInfo = level === 'info';
    const isWarning = level === 'warn';
    const isDefault = level === 'default';

    try {
      if (__DEV__ || __DEBUG_LVL__ >= 2) {
        const getErrorStr = err => {
          if (!err) return '';
          const { name, message, stack } = err || {};
          return stack ? stack.toString() : `${name} - ${message}}`;
        };

        if (start instanceof Error && __POS__) {
          console.log(applyErrorColor(getErrorStr(start)));
          return;
        }

        if (__POS__) {
          const label =
            typeof start === 'string' ? start : JSON.stringify(start);

          let outputLogs = '';
          if (logs && logs.length > 0) {
            outputLogs = logs
              .map(i => {
                if (i instanceof Error) return getErrorStr(i);
                return JSON.stringify(i, null, 2);
              })
              .join(' ');
          }

          const output = label.concat(' ', outputLogs);
          const sendPrint = logToSend => {
            window.console.log(logToSend);
            if (!DEVHOST_IP) return;
            try {
              const xmlhttp = new XMLHttpRequest();
              xmlhttp.open('POST', `http://${DEVHOST_IP}/POS_LOGGER`);
              xmlhttp.setRequestHeader(
                'Content-Type',
                'application/json;charset=UTF-8',
              );
              xmlhttp.send(
                JSON.stringify({
                  level,
                  text: logToSend,
                }),
              );
            } finally {
              //
            }
          };

          if (isInfo) {
            sendPrint(applyInfoColor(output));
          } else if (isWarning) {
            sendPrint(applyYellow(output));
          } else if (isError) {
            sendPrint(applyErrorColor(output));
          } else if (isDefault) {
            sendPrint(output);
          }
        }

        if (!__POS__) {
          const { info, error } = console;
          if (start instanceof Error) {
            error(start, ...logs);
            return;
          }
          const label = `%c${start}`;

          let color = '#00A868';
          if (!isDefault) color = isError ? '#FF5752' : '#0091D9';

          const style = [
            'font-family: "Fira Code", monospace;',
            `color: ${color};`,
          ].join('');

          if (isError || isInfo) {
            // info(`\x1b[31mLOG ERROR TEST ${(new Error('bla').stack)}\x1b[0m`);
            (isError ? error : info).apply(null, [label, style, ...logs]);
          } else {
            window.console.log.apply(null, [label, style, ...logs]);
          }
        }
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }

  function LOG_INFO(start = '', ...logs) {
    LOGLogger(start, 'info', logs);
  }

  function LOG_WARNING(start = '', ...logs) {
    LOGLogger(start, 'warn', logs);
  }

  function LOG_ERROR(start = '', ...logs) {
    LOGLogger(start, 'error', logs);
  }

  function LOG(start = '', ...logs) {
    LOGLogger(start, 'default', logs);
  }

  function runTests() {
    setTimeout(() => {
      LOG_INFO('LOG INFO TEST');
      LOG_INFO('LOG INFO TEST', [1, 2, 3, 'bla']);
      LOG_INFO('LOG INFO TEST', { key: 'value ' });
      LOG_INFO('LOG INFO TEST', { key: 'value ' }, [1, 2, 3, 'bla'], 'test');

      LOG_WARNING('LOG WARNING TEST');
      LOG_WARNING('LOG WARNING TEST', [1, 2, 3, 'bla']);
      LOG_WARNING('LOG WARNING TEST', { key: 'value ' });
      LOG_WARNING(
        'LOG WARNING TEST',
        { key: 'value ' },
        [1, 2, 3, 'bla'],
        'test',
      );
      LOG_WARNING('LOG WARNING TEST', new Error('This is a error!'));

      LOG_ERROR('LOG ERROR TEST');
      LOG_ERROR('LOG ERROR TEST', [1, 2, 3, 'bla']);
      LOG_ERROR('LOG ERROR TEST', { key: 'value ' });
      LOG_ERROR('LOG ERROR TEST', { key: 'value ' }, [1, 2, 3, 'bla'], 'test');
      LOG_ERROR('LOG ERROR TEST', new Error('This is a error!'));

      LOG('LOG TEST');
      LOG('LOG TEST', [1, 2, 3, 'bla']);
      LOG('LOG TEST', new Error('This is a error!'));
      LOG('LOG TEST', { key: 'value ' });
    }, 1000);
  }

  window.LOG_INFO = LOG_INFO;
  window.LOG_ERROR = LOG_ERROR;
  window.LOG_ERROR = LOG_WARNING;
  window.LOG = LOG;
  window.LOGLogger = LOGLogger;
  if (__POS__) {
    window.console.warn = LOG_WARNING;
    window.console.error = LOG_ERROR;
  }

  if (_runTests) runTests();
  return { LOG, LOG_ERROR, LOG_INFO };
}

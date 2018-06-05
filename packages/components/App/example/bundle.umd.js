(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Bundle = global.Bundle || {}, global.Bundle.Umd = {})));
}(this, (function (exports) { 'use strict';

	function noop() {}

	function assign(tar, src) {
	  for (var k in src) {
	    tar[k] = src[k];
	  }

	  return tar;
	}

	function addLoc(element, file, line, column, char) {
	  element.__svelte_meta = {
	    loc: {
	      file: file,
	      line: line,
	      column: column,
	      char: char
	    }
	  };
	}

	function appendNode(node, target) {
	  target.appendChild(node);
	}

	function insertNode(node, target, anchor) {
	  target.insertBefore(node, anchor);
	}

	function detachNode(node) {
	  node.parentNode.removeChild(node);
	}

	function reinsertChildren(parent, target) {
	  while (parent.firstChild) {
	    target.appendChild(parent.firstChild);
	  }
	}

	function createFragment() {
	  return document.createDocumentFragment();
	}

	function createElement(name) {
	  return document.createElement(name);
	}

	function createText(data) {
	  return document.createTextNode(data);
	}

	function addListener(node, event, handler) {
	  node.addEventListener(event, handler, false);
	}

	function removeListener(node, event, handler) {
	  node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
	  node.setAttribute(attribute, value);
	}

	function blankObject() {
	  return Object.create(null);
	}

	function destroy(detach) {
	  this.destroy = noop;
	  this.fire('destroy');
	  this.set = noop;

	  this._fragment.d(detach !== false);

	  this._fragment = null;
	  this._state = {};
	}

	function destroyDev(detach) {
	  destroy.call(this, detach);

	  this.destroy = function () {
	    console.warn('Component was already destroyed');
	  };
	}

	function _differs(a, b) {
	  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
	}

	function fire(eventName, data) {
	  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

	  if (!handlers) return;

	  for (var i = 0; i < handlers.length; i += 1) {
	    var handler = handlers[i];

	    if (!handler.__calling) {
	      handler.__calling = true;
	      handler.call(this, data);
	      handler.__calling = false;
	    }
	  }
	}

	function get() {
	  return this._state;
	}

	function init(component, options) {
	  component._handlers = blankObject();
	  component._bind = options._bind;
	  component.options = options;
	  component.root = options.root || component;
	  component.store = component.root.store || options.store;
	}

	function on(eventName, handler) {
	  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	  handlers.push(handler);
	  return {
	    cancel: function cancel() {
	      var index = handlers.indexOf(handler);
	      if (~index) handlers.splice(index, 1);
	    }
	  };
	}

	function set(newState) {
	  this._set(assign({}, newState));

	  if (this.root._lock) return;
	  this.root._lock = true;
	  callAll(this.root._beforecreate);
	  callAll(this.root._oncreate);
	  callAll(this.root._aftercreate);
	  this.root._lock = false;
	}

	function _set(newState) {
	  var oldState = this._state,
	      changed = {},
	      dirty = false;

	  for (var key in newState) {
	    if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	  }

	  if (!dirty) return;
	  this._state = assign(assign({}, oldState), newState);

	  this._recompute(changed, this._state);

	  if (this._bind) this._bind(changed, this._state);

	  if (this._fragment) {
	    this.fire("state", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });

	    this._fragment.p(changed, this._state);

	    this.fire("update", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });
	  }
	}

	function setDev(newState) {
	  if (typeof newState !== 'object') {
	    throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
	  }

	  this._checkReadOnly(newState);

	  set.call(this, newState);
	}

	function callAll(fns) {
	  while (fns && fns.length) {
	    fns.shift()();
	  }
	}

	function _mount(target, anchor) {
	  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}
	var protoDev = {
	  destroy: destroyDev,
	  get: get,
	  fire: fire,
	  on: on,
	  set: setDev,
	  _recompute: noop,
	  _set: _set,
	  _mount: _mount,
	  _differs: _differs
	};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var keyboard = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });
	  var lightEnabled = true;
	  var Light = {
	    enable: function enable() {
	      console.log('enabled keyboard light');
	      lightEnabled = true;
	    },
	    disable: function disable() {
	      console.log('disabled keyboard light');
	      lightEnabled = false;
	    },
	    isEnabled: function isEnabled() {
	      return lightEnabled;
	    }
	  };
	  var soundEnabled = true;
	  var Sound = {
	    enable: function enable() {
	      console.log('enabled keyboard sound');
	      soundEnabled = false;
	    },
	    disable: function disable() {
	      console.log('disabled keyboard sound');
	      soundEnabled = false;
	    },
	    isEnabled: function isEnabled() {
	      return soundEnabled;
	    }
	  };
	  /**
	   * KeyPress event handler that bypass only numbers
	   * @ignore
	   * @param  {function} event The KeyPress event
	   */

	  function filterLetters(event) {
	    var char = String.fromCharCode(event.keyCode || event.charCode);

	    if ('1234567890'.indexOf(char) === -1) {
	      event.preventDefault();
	    }
	  }
	  /**
	   * Sets the keyboard to send only numbers. This will affect the whole application
	   * @memberOf Keyboard
	   */


	  function setKeyboardAsNumeric() {
	    console.log('Keyboard is now numeric');
	    document.removeEventListener('keypress', filterLetters);
	    document.addEventListener('keypress', filterLetters);
	  }
	  /**
	   * Sets the keyboard to send numbers, letters and symbols. This will
	   * affect the whole application
	   * @memberOf Keyboard
	   */


	  function setKeyboardAsAlphanumeric() {
	    console.log('Keyboard is now alphanumeric');
	    document.removeEventListener('keypress', filterLetters);
	  }

	  function mock(Keyboard) {
	    Object.assign(Keyboard, {
	      Sound: Sound,
	      Light: Light,
	      setKeyboardAsNumeric: setKeyboardAsNumeric,
	      setKeyboardAsAlphanumeric: setKeyboardAsAlphanumeric
	    });
	  }

	  var isBackspaceEnabled = true;

	  var disableBackspace = function disableBackspace(event) {
	    if (event.keyCode === 8) {
	      event.preventDefault();
	      return false;
	    }
	  };

	  function addSharedTo(Keyboard) {
	    Keyboard.disableBackspace = function () {
	      if (isBackspaceEnabled) {
	        document.addEventListener('keydown', disableBackspace);
	        isBackspaceEnabled = false;
	      }
	    };

	    Keyboard.enableBackspace = function () {
	      if (!isBackspaceEnabled) {
	        document.removeEventListener('keydown', disableBackspace);
	        isBackspaceEnabled = true;
	      }
	    };

	    Keyboard.KEYMAP = Object.freeze({
	      13: 'enter',
	      8: 'back',
	      27: 'close',
	      17: 'help',
	      16: 'shortcuts',
	      48: '0',
	      49: '1',
	      50: '2',
	      51: '3',
	      52: '4',
	      53: '5',
	      54: '6',
	      55: '7',
	      56: '8',
	      57: '9'
	    });
	  }

	  var Keyboard = window.Keyboard;

	  {
	    Keyboard = window.Keyboard = {};
	    mock(Keyboard);
	    addSharedTo(Keyboard);
	  }

	  var Keyboard$1 = Keyboard;
	  exports.default = Keyboard$1;
	});
	var Keyboard = unwrapExports(keyboard);

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var __DEV__ = "development" !== 'production';

	var warning = function warning() {};

	if (__DEV__) {
	  warning = function warning(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);

	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }

	    if (format === undefined) {
	      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }

	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });

	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }

	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    }
	  };
	}

	var warning_1 = warning;

	var addLeadingSlash = function addLeadingSlash(path) {
	  return path.charAt(0) === '/' ? path : '/' + path;
	};
	var stripLeadingSlash = function stripLeadingSlash(path) {
	  return path.charAt(0) === '/' ? path.substr(1) : path;
	};
	var hasBasename = function hasBasename(path, prefix) {
	  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
	};
	var stripBasename = function stripBasename(path, prefix) {
	  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
	};
	var stripTrailingSlash = function stripTrailingSlash(path) {
	  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
	};
	var parsePath = function parsePath(path) {
	  var pathname = path || '/';
	  var search = '';
	  var hash = '';
	  var hashIndex = pathname.indexOf('#');

	  if (hashIndex !== -1) {
	    hash = pathname.substr(hashIndex);
	    pathname = pathname.substr(0, hashIndex);
	  }

	  var searchIndex = pathname.indexOf('?');

	  if (searchIndex !== -1) {
	    search = pathname.substr(searchIndex);
	    pathname = pathname.substr(0, searchIndex);
	  }

	  return {
	    pathname: pathname,
	    search: search === '?' ? '' : search,
	    hash: hash === '#' ? '' : hash
	  };
	};
	var createPath = function createPath(location) {
	  var pathname = location.pathname,
	      search = location.search,
	      hash = location.hash;
	  var path = pathname || '/';
	  if (search && search !== '?') path += search.charAt(0) === '?' ? search : '?' + search;
	  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : '#' + hash;
	  return path;
	};

	function isAbsolute(pathname) {
	  return pathname.charAt(0) === '/';
	} // About 1.5x faster than the two-arg version of Array#splice()


	function spliceOne(list, index) {
	  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
	    list[i] = list[k];
	  }

	  list.pop();
	} // This implementation is based heavily on node's url.parse


	function resolvePathname(to) {
	  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  var toParts = to && to.split('/') || [];
	  var fromParts = from && from.split('/') || [];
	  var isToAbs = to && isAbsolute(to);
	  var isFromAbs = from && isAbsolute(from);
	  var mustEndAbs = isToAbs || isFromAbs;

	  if (to && isAbsolute(to)) {
	    // to is absolute
	    fromParts = toParts;
	  } else if (toParts.length) {
	    // to is relative, drop the filename
	    fromParts.pop();
	    fromParts = fromParts.concat(toParts);
	  }

	  if (!fromParts.length) return '/';
	  var hasTrailingSlash = void 0;

	  if (fromParts.length) {
	    var last = fromParts[fromParts.length - 1];
	    hasTrailingSlash = last === '.' || last === '..' || last === '';
	  } else {
	    hasTrailingSlash = false;
	  }

	  var up = 0;

	  for (var i = fromParts.length; i >= 0; i--) {
	    var part = fromParts[i];

	    if (part === '.') {
	      spliceOne(fromParts, i);
	    } else if (part === '..') {
	      spliceOne(fromParts, i);
	      up++;
	    } else if (up) {
	      spliceOne(fromParts, i);
	      up--;
	    }
	  }

	  if (!mustEndAbs) for (; up--; up) {
	    fromParts.unshift('..');
	  }
	  if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');
	  var result = fromParts.join('/');
	  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';
	  return result;
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	function valueEqual(a, b) {
	  if (a === b) return true;
	  if (a == null || b == null) return false;

	  if (Array.isArray(a)) {
	    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
	      return valueEqual(item, b[index]);
	    });
	  }

	  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
	  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);
	  if (aType !== bType) return false;

	  if (aType === 'object') {
	    var aValue = a.valueOf();
	    var bValue = b.valueOf();
	    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);
	    var aKeys = Object.keys(a);
	    var bKeys = Object.keys(b);
	    if (aKeys.length !== bKeys.length) return false;
	    return aKeys.every(function (key) {
	      return valueEqual(a[key], b[key]);
	    });
	  }

	  return false;
	}

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};
	var createLocation = function createLocation(path, state, key, currentLocation) {
	  var location = void 0;

	  if (typeof path === 'string') {
	    // Two-arg form: push(path, state)
	    location = parsePath(path);
	    location.state = state;
	  } else {
	    // One-arg form: push(location)
	    location = _extends({}, path);
	    if (location.pathname === undefined) location.pathname = '';

	    if (location.search) {
	      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
	    } else {
	      location.search = '';
	    }

	    if (location.hash) {
	      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
	    } else {
	      location.hash = '';
	    }

	    if (state !== undefined && location.state === undefined) location.state = state;
	  }

	  try {
	    location.pathname = decodeURI(location.pathname);
	  } catch (e) {
	    if (e instanceof URIError) {
	      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
	    } else {
	      throw e;
	    }
	  }

	  if (key) location.key = key;

	  if (currentLocation) {
	    // Resolve incomplete/relative pathname relative to current location.
	    if (!location.pathname) {
	      location.pathname = currentLocation.pathname;
	    } else if (location.pathname.charAt(0) !== '/') {
	      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
	    }
	  } else {
	    // When there is no prior location and pathname is empty, set it to /
	    if (!location.pathname) {
	      location.pathname = '/';
	    }
	  }

	  return location;
	};
	var locationsAreEqual = function locationsAreEqual(a, b) {
	  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
	};

	var createTransitionManager = function createTransitionManager() {
	  var prompt = null;

	  var setPrompt = function setPrompt(nextPrompt) {
	    warning_1(prompt == null, 'A history supports only one prompt at a time');
	    prompt = nextPrompt;
	    return function () {
	      if (prompt === nextPrompt) prompt = null;
	    };
	  };

	  var confirmTransitionTo = function confirmTransitionTo(location, action, getUserConfirmation, callback) {
	    // TODO: If another transition starts while we're still confirming
	    // the previous one, we may end up in a weird state. Figure out the
	    // best way to handle this.
	    if (prompt != null) {
	      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

	      if (typeof result === 'string') {
	        if (typeof getUserConfirmation === 'function') {
	          getUserConfirmation(result, callback);
	        } else {
	          warning_1(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
	          callback(true);
	        }
	      } else {
	        // Return false from a transition hook to cancel the transition.
	        callback(result !== false);
	      }
	    } else {
	      callback(true);
	    }
	  };

	  var listeners = [];

	  var appendListener = function appendListener(fn) {
	    var isActive = true;

	    var listener = function listener() {
	      if (isActive) fn.apply(undefined, arguments);
	    };

	    listeners.push(listener);
	    return function () {
	      isActive = false;
	      listeners = listeners.filter(function (item) {
	        return item !== listener;
	      });
	    };
	  };

	  var notifyListeners = function notifyListeners() {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    listeners.forEach(function (listener) {
	      return listener.apply(undefined, args);
	    });
	  };

	  return {
	    setPrompt: setPrompt,
	    confirmTransitionTo: confirmTransitionTo,
	    appendListener: appendListener,
	    notifyListeners: notifyListeners
	  };
	};

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var NODE_ENV = "development";

	var invariant = function invariant(condition, format, a, b, c, d, e, f) {
	  if (NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;

	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame

	    throw error;
	  }
	};

	var invariant_1 = invariant;

	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
	var addEventListener = function addEventListener(node, event, listener) {
	  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
	};
	var removeEventListener = function removeEventListener(node, event, listener) {
	  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
	};
	var getConfirmation = function getConfirmation(message, callback) {
	  return callback(window.confirm(message));
	}; // eslint-disable-line no-alert
	/**
	 * Returns false if using go(n) with hash history causes a full page reload.
	 */

	var supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
	  return window.navigator.userAgent.indexOf('Firefox') === -1;
	};

	var _extends$2 = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};
	var HashChangeEvent = 'hashchange';
	var HashPathCoders = {
	  hashbang: {
	    encodePath: function encodePath(path) {
	      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
	    },
	    decodePath: function decodePath(path) {
	      return path.charAt(0) === '!' ? path.substr(1) : path;
	    }
	  },
	  noslash: {
	    encodePath: stripLeadingSlash,
	    decodePath: addLeadingSlash
	  },
	  slash: {
	    encodePath: addLeadingSlash,
	    decodePath: addLeadingSlash
	  }
	};

	var getHashPath = function getHashPath() {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  var href = window.location.href;
	  var hashIndex = href.indexOf('#');
	  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
	};

	var pushHashPath = function pushHashPath(path) {
	  return window.location.hash = path;
	};

	var replaceHashPath = function replaceHashPath(path) {
	  var hashIndex = window.location.href.indexOf('#');
	  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
	};

	var createHashHistory = function createHashHistory() {
	  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  invariant_1(canUseDOM, 'Hash history needs a DOM');
	  var globalHistory = window.history;
	  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
	  var _props$getUserConfirm = props.getUserConfirmation,
	      getUserConfirmation = _props$getUserConfirm === undefined ? getConfirmation : _props$getUserConfirm,
	      _props$hashType = props.hashType,
	      hashType = _props$hashType === undefined ? 'slash' : _props$hashType;
	  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
	  var _HashPathCoders$hashT = HashPathCoders[hashType],
	      encodePath = _HashPathCoders$hashT.encodePath,
	      decodePath = _HashPathCoders$hashT.decodePath;

	  var getDOMLocation = function getDOMLocation() {
	    var path = decodePath(getHashPath());
	    warning_1(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
	    if (basename) path = stripBasename(path, basename);
	    return createLocation(path);
	  };

	  var transitionManager = createTransitionManager();

	  var setState = function setState(nextState) {
	    _extends$2(history, nextState);

	    history.length = globalHistory.length;
	    transitionManager.notifyListeners(history.location, history.action);
	  };

	  var forceNextPop = false;
	  var ignorePath = null;

	  var handleHashChange = function handleHashChange() {
	    var path = getHashPath();
	    var encodedPath = encodePath(path);

	    if (path !== encodedPath) {
	      // Ensure we always have a properly-encoded hash.
	      replaceHashPath(encodedPath);
	    } else {
	      var location = getDOMLocation();
	      var prevLocation = history.location;
	      if (!forceNextPop && locationsAreEqual(prevLocation, location)) return; // A hashchange doesn't always == location change.

	      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

	      ignorePath = null;
	      handlePop(location);
	    }
	  };

	  var handlePop = function handlePop(location) {
	    if (forceNextPop) {
	      forceNextPop = false;
	      setState();
	    } else {
	      var action = 'POP';
	      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	        if (ok) {
	          setState({
	            action: action,
	            location: location
	          });
	        } else {
	          revertPop(location);
	        }
	      });
	    }
	  };

	  var revertPop = function revertPop(fromLocation) {
	    var toLocation = history.location; // TODO: We could probably make this more reliable by
	    // keeping a list of paths we've seen in sessionStorage.
	    // Instead, we just default to 0 for paths we don't know.

	    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
	    if (toIndex === -1) toIndex = 0;
	    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
	    if (fromIndex === -1) fromIndex = 0;
	    var delta = toIndex - fromIndex;

	    if (delta) {
	      forceNextPop = true;
	      go(delta);
	    }
	  }; // Ensure the hash is encoded properly before doing anything else.


	  var path = getHashPath();
	  var encodedPath = encodePath(path);
	  if (path !== encodedPath) replaceHashPath(encodedPath);
	  var initialLocation = getDOMLocation();
	  var allPaths = [createPath(initialLocation)]; // Public interface

	  var createHref = function createHref(location) {
	    return '#' + encodePath(basename + createPath(location));
	  };

	  var push = function push(path, state) {
	    warning_1(state === undefined, 'Hash history cannot push state; it is ignored');
	    var action = 'PUSH';
	    var location = createLocation(path, undefined, undefined, history.location);
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	      var path = createPath(location);
	      var encodedPath = encodePath(basename + path);
	      var hashChanged = getHashPath() !== encodedPath;

	      if (hashChanged) {
	        // We cannot tell if a hashchange was caused by a PUSH, so we'd
	        // rather setState here and ignore the hashchange. The caveat here
	        // is that other hash histories in the page will consider it a POP.
	        ignorePath = path;
	        pushHashPath(encodedPath);
	        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
	        var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
	        nextPaths.push(path);
	        allPaths = nextPaths;
	        setState({
	          action: action,
	          location: location
	        });
	      } else {
	        warning_1(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
	        setState();
	      }
	    });
	  };

	  var replace = function replace(path, state) {
	    warning_1(state === undefined, 'Hash history cannot replace state; it is ignored');
	    var action = 'REPLACE';
	    var location = createLocation(path, undefined, undefined, history.location);
	    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
	      if (!ok) return;
	      var path = createPath(location);
	      var encodedPath = encodePath(basename + path);
	      var hashChanged = getHashPath() !== encodedPath;

	      if (hashChanged) {
	        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
	        // rather setState here and ignore the hashchange. The caveat here
	        // is that other hash histories in the page will consider it a POP.
	        ignorePath = path;
	        replaceHashPath(encodedPath);
	      }

	      var prevIndex = allPaths.indexOf(createPath(history.location));
	      if (prevIndex !== -1) allPaths[prevIndex] = path;
	      setState({
	        action: action,
	        location: location
	      });
	    });
	  };

	  var go = function go(n) {
	    warning_1(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
	    globalHistory.go(n);
	  };

	  var goBack = function goBack() {
	    return go(-1);
	  };

	  var goForward = function goForward() {
	    return go(1);
	  };

	  var listenerCount = 0;

	  var checkDOMListeners = function checkDOMListeners(delta) {
	    listenerCount += delta;

	    if (listenerCount === 1) {
	      addEventListener(window, HashChangeEvent, handleHashChange);
	    } else if (listenerCount === 0) {
	      removeEventListener(window, HashChangeEvent, handleHashChange);
	    }
	  };

	  var isBlocked = false;

	  var block = function block() {
	    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	    var unblock = transitionManager.setPrompt(prompt);

	    if (!isBlocked) {
	      checkDOMListeners(1);
	      isBlocked = true;
	    }

	    return function () {
	      if (isBlocked) {
	        isBlocked = false;
	        checkDOMListeners(-1);
	      }

	      return unblock();
	    };
	  };

	  var listen = function listen(listener) {
	    var unlisten = transitionManager.appendListener(listener);
	    checkDOMListeners(1);
	    return function () {
	      checkDOMListeners(-1);
	      unlisten();
	    };
	  };

	  var history = {
	    length: globalHistory.length,
	    action: 'POP',
	    location: initialLocation,
	    createHref: createHref,
	    push: push,
	    replace: replace,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    block: block,
	    listen: listen
	  };
	  return history;
	};

	/**
	 * Expose `pathToRegexp`.
	 */

	/**
	 * The MIT License (MIT)
	 * Copyright (c) 2015-present, Ryan Florence, Michael Jackson
	 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
	 */

	var history;

	var createHashHistory$1 = function createHashHistory$$1() {
	  return history = createHashHistory();
	};

	var getHistory = function getHistory() {
	  return history;
	};

	var isModifiedEvent = function isModifiedEvent(event) {
	  return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
	};

	/**
	 * An action to be added at a root element of your application to capture all relative links and push them onto the
	 * history stack. Example:
	 * ```html
	 * <div use:links>
	 *   <Route exact path="/" component={Home} bind:match/>
	 *   <Route exact path="/p/:projectId/:docId?" component={ProjectScreen}/>
	 *
	 *   {#each projects as project}
	 *     <a href="/p/{project.id}">{project.title}</a>
	 *   {/each}
	 * </div>
	 * ```
	 */

	function links(node) {
	  node.addEventListener('click', onClick);
	  return {
	    destroy: function destroy() {
	      node.removeEventListener('click', onClick);
	    }
	  };
	}

	function findClosest(tagName, el) {
	  while (el && el.tagName !== tagName) {
	    el = el.parentNode;
	  }

	  return el;
	}

	function onClick(event) {
	  var anchor = findClosest('A', event.target);

	  if (!anchor || anchor.target || event.button !== 0 || anchor.host !== location.host || isModifiedEvent(event) || anchor.hasAttribute('noroute')) {
	    return;
	  }

	  event.preventDefault();

	  if (anchor.hasAttribute('replace')) {
	    getHistory().replace(anchor.pathname);
	  } else {
	    getHistory().push(anchor.pathname);
	  }
	}

	/* src/App.svelte generated by Svelte v2.7.0 */
	createHashHistory$1({
	  basename: '/'
	});
	var methods = {
	  handleKeyDown: function handleKeyDown(e) {
	    var keyName = Keyboard.KEYMAP[e.keyCode];
	    /** If the key is not mapped (for some reason, do nothing) */

	    if (!keyName) return;
	    var shortcutEl = document.querySelector("[shortcut='" + keyName + "']");
	    /** If the key is 'enter', check if the shortcut element isn't already focused */

	    if (shortcutEl && (keyName !== 'enter' || document.activeElement !== shortcutEl)) {
	      // Adapted from
	      // https://stackoverflow.com/questions/15739263/phantomjs-click-an-element
	      var clickEvent = document.createEvent('MouseEvent');
	      clickEvent.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, false, false, false, false, 0, null);
	      shortcutEl.dispatchEvent(clickEvent);
	    }
	  }
	};
	var file = "src/App.svelte";

	function create_main_fragment(component, ctx) {
	  var div,
	      slot_content_default = component._slotted.default,
	      links_action;

	  function onwindowkeydown(event) {
	    component.handleKeyDown(event);
	  }

	  window.addEventListener("keydown", onwindowkeydown);
	  return {
	    c: function create() {
	      div = createElement("div");
	      links_action = links.call(component, div) || {};
	      addLoc(div, file, 2, 0, 52);
	    },
	    m: function mount(target, anchor) {
	      insertNode(div, target, anchor);

	      if (slot_content_default) {
	        appendNode(slot_content_default, div);
	      }
	    },
	    p: noop,
	    d: function destroy$$1(detach) {
	      window.removeEventListener("keydown", onwindowkeydown);

	      if (detach) {
	        detachNode(div);
	      }

	      if (slot_content_default) {
	        reinsertChildren(div, slot_content_default);
	      }

	      if (typeof links_action.destroy === 'function') links_action.destroy.call(component);
	    }
	  };
	}

	function App(options) {
	  this._debugName = '<App>';
	  if (!options || !options.target && !options.root) throw new Error("'target' is a required option");
	  init(this, options);
	  this._state = assign({}, options.data);
	  this._intro = true;
	  this._slotted = options.slots || {};
	  this.slots = {};
	  this._fragment = create_main_fragment(this, this._state);

	  if (options.target) {
	    if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");

	    this._fragment.c();

	    this._mount(options.target, options.anchor);
	  }
	}

	assign(App.prototype, protoDev);
	assign(App.prototype, methods);

	App.prototype._checkReadOnly = function _checkReadOnly(newState) {};

	/* example/App.svelte generated by Svelte v2.7.0 */

	function data() {
	  return {
	    counter: 0
	  };
	}
	var file$1 = "example/App.svelte";

	function add_css() {
	  var style = createElement("style");
	  style.id = 'svelte-19msqyy-style';
	  style.textContent = "body{background-color:#ddd}.container.svelte-19msqyy{max-width:80%;width:700px;margin:80px auto}.row.svelte-19msqyy{margin-bottom:50px\n  }\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLnN2ZWx0ZSIsInNvdXJjZXMiOlsiQXBwLnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8QXBwPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGgxPkBtYW1iYS9hcHA8L2gxPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxwPkl0IGlzIGEgb2JsaWdhdG9yeSBjb21wb25lbnQgZm9yIGFsbCBTdmVsdGUgTWFtYmEgQXBwczwvcD5cbiAgICAgIDxicj5cbiAgICAgIDx1bD5cbiAgICAgICAgPGxpPkl0IGluaXRpYWxpemVzIHRoZSBhcHBsaWNhdGlvbiByb3V0ZXI8L2xpPlxuICAgICAgICA8bGk+SXQgbGlzdGVucyB0byBrZXlib2FyZCBzdHJva2VzIGFuZCBkaXNwYXRjaGVzIGEgY2xpY2sgZXZlbnQgb24gZWxlbWVudHMgd2l0aCBhIDxiPnNob3J0Y3V0PVwia2V5TmFtZVwiPC9iPiBhdHRyaWJ1dGU8L2xpPlxuICAgICAgPC91bD5cbiAgICA8L2Rpdj5cbiAgICA8YnV0dG9uIHNob3J0Y3V0PVwiZW50ZXJcIiBvbjpjbGljaz1cInNldCh7IGNvdW50ZXI6IGNvdW50ZXIgKyAxIH0pXCI+Y2xpY2sgbWUgb3IgcHJlc3MgZW50ZXIge2NvdW50ZXJ9ITwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvQXBwPlxuXG48c2NyaXB0PlxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgY29tcG9uZW50czoge1xuICAgICAgQXBwOiAnLi4vc3JjJyxcbiAgICB9LFxuICAgIGRhdGEoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb3VudGVyOiAwLFxuICAgICAgfVxuICAgIH0sXG4gIH1cbjwvc2NyaXB0PlxuXG5cbjxzdHlsZT5cbiAgOmdsb2JhbChib2R5KSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbiAgfVxuXG4gIC5jb250YWluZXIge1xuICAgIG1heC13aWR0aDogODAlO1xuICAgIHdpZHRoOiA3MDBweDtcbiAgICBtYXJnaW46IDgwcHggYXV0bztcbiAgfVxuXG4gIC5yb3cge1xuICAgIG1hcmdpbi1ib3R0b206IDUwcHhcbiAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE4QlUsSUFBSSxBQUFFLENBQUMsQUFDYixnQkFBZ0IsQ0FBRSxJQUFJLEFBQ3hCLENBQUMsQUFFRCxVQUFVLGVBQUMsQ0FBQyxBQUNWLFNBQVMsQ0FBRSxHQUFHLENBQ2QsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsSUFBSSxDQUFDLElBQUksQUFDbkIsQ0FBQyxBQUVELElBQUksZUFBQyxDQUFDLEFBQ0osYUFBYSxDQUFFLElBQUk7RUFDckIsQ0FBQyJ9 */";
	  appendNode(style, document.head);
	}

	function create_main_fragment$1(component, ctx) {
	  var text, div, h1, text_1, text_2, div_1, p, text_3, text_4, br, text_5, ul, li, text_6, li_1, text_7, b, text_8, text_9, text_11, button, text_12, text_13, text_14, text_16;

	  function click_handler(event) {
	    component.set({
	      counter: ctx.counter + 1
	    });
	  }

	  var app = new App({
	    root: component.root,
	    slots: {
	      default: createFragment()
	    }
	  });
	  return {
	    c: function create() {
	      text = createText("\n  ");
	      div = createElement("div");
	      h1 = createElement("h1");
	      text_1 = createText("@mamba/app");
	      text_2 = createText("\n    ");
	      div_1 = createElement("div");
	      p = createElement("p");
	      text_3 = createText("It is a obligatory component for all Svelte Mamba Apps");
	      text_4 = createText("\n      ");
	      br = createElement("br");
	      text_5 = createText("\n      ");
	      ul = createElement("ul");
	      li = createElement("li");
	      text_6 = createText("It initializes the application router");
	      li_1 = createElement("li");
	      text_7 = createText("It listens to keyboard strokes and dispatches a click event on elements with a ");
	      b = createElement("b");
	      text_8 = createText("shortcut=\"keyName\"");
	      text_9 = createText(" attribute");
	      text_11 = createText("\n    ");
	      button = createElement("button");
	      text_12 = createText("click me or press enter ");
	      text_13 = createText(ctx.counter);
	      text_14 = createText("!");
	      text_16 = createText("\n");

	      app._fragment.c();

	      addLoc(h1, file$1, 2, 4, 36);
	      addLoc(p, file$1, 4, 6, 84);
	      addLoc(br, file$1, 5, 6, 152);
	      addLoc(li, file$1, 7, 8, 176);
	      addLoc(b, file$1, 8, 91, 314);
	      addLoc(li_1, file$1, 8, 8, 231);
	      addLoc(ul, file$1, 6, 6, 163);
	      div_1.className = "row svelte-19msqyy";
	      addLoc(div_1, file$1, 3, 4, 60);
	      addListener(button, "click", click_handler);
	      setAttribute(button, "shortcut", "enter");
	      addLoc(button, file$1, 11, 4, 382);
	      div.className = "container svelte-19msqyy";
	      addLoc(div, file$1, 1, 2, 8);
	    },
	    m: function mount(target, anchor) {
	      appendNode(text, app._slotted.default);
	      appendNode(div, app._slotted.default);
	      appendNode(h1, div);
	      appendNode(text_1, h1);
	      appendNode(text_2, div);
	      appendNode(div_1, div);
	      appendNode(p, div_1);
	      appendNode(text_3, p);
	      appendNode(text_4, div_1);
	      appendNode(br, div_1);
	      appendNode(text_5, div_1);
	      appendNode(ul, div_1);
	      appendNode(li, ul);
	      appendNode(text_6, li);
	      appendNode(li_1, ul);
	      appendNode(text_7, li_1);
	      appendNode(b, li_1);
	      appendNode(text_8, b);
	      appendNode(text_9, li_1);
	      appendNode(text_11, div);
	      appendNode(button, div);
	      appendNode(text_12, button);
	      appendNode(text_13, button);
	      appendNode(text_14, button);
	      appendNode(text_16, app._slotted.default);

	      app._mount(target, anchor);
	    },
	    p: function update(changed, _ctx) {
	      ctx = _ctx;

	      if (changed.counter) {
	        text_13.data = ctx.counter;
	      }
	    },
	    d: function destroy$$1(detach) {
	      removeListener(button, "click", click_handler);
	      app.destroy(detach);
	    }
	  };
	}

	function App_1(options) {
	  this._debugName = '<App_1>';
	  if (!options || !options.target && !options.root) throw new Error("'target' is a required option");
	  init(this, options);
	  this._state = assign(data(), options.data);
	  if (!('counter' in this._state)) console.warn("<App_1> was created without expected data property 'counter'");
	  this._intro = true;
	  if (!document.getElementById("svelte-19msqyy-style")) add_css();

	  if (!options.root) {
	    this._oncreate = [];
	    this._beforecreate = [];
	    this._aftercreate = [];
	  }

	  this._fragment = create_main_fragment$1(this, this._state);

	  if (options.target) {
	    if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");

	    this._fragment.c();

	    this._mount(options.target, options.anchor);

	    this._lock = true;
	    callAll(this._beforecreate);
	    callAll(this._oncreate);
	    callAll(this._aftercreate);
	    this._lock = false;
	  }
	}

	assign(App_1.prototype, protoDev);

	App_1.prototype._checkReadOnly = function _checkReadOnly(newState) {};

	new App_1({ target: document.getElementById('root') });

	Object.defineProperty(exports, '__esModule', { value: true });

})));

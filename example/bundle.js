(function(l, i, v, e) {
  v = l.createElement(i);
  v.async = 1;
  v.src =
    '//' +
    (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1';
  e = l.getElementsByTagName(i)[0];
  e.parentNode.insertBefore(v, e);
})(document, 'script');
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        require('./Users/jaimecostamarques/Workspace/pos-mamba-sdk/example/Example.html'),
      )
    : typeof define === 'function' && define.amd
    ? define([
        './Users/jaimecostamarques/Workspace/pos-mamba-sdk/example/Example.html',
      ], factory)
    : ((global = global || self), factory(global.App));
})(this, function(App) {
  'use strict';

  App = App && App.hasOwnProperty('default') ? App['default'] : App;

  var EventTarget = function() {
    var eventHandlers = {};

    var fire = function fire(event) {
      for (
        var _len = arguments.length,
          data = new Array(_len > 1 ? _len - 1 : 0),
          _key = 1;
        _key < _len;
        _key++
      ) {
        data[_key - 1] = arguments[_key];
      }

      var handlers = eventHandlers[event];

      if (handlers && handlers.length) {
        handlers.forEach(function(handler) {
          return handler.apply(void 0, data);
        });
      }
    };

    var off = function off(event, handler) {
      var handlers = eventHandlers[event];

      if (handlers && handlers.length && handler) {
        var handlerIndex = handlers.indexOf(handler);

        if (handlerIndex > -1) {
          handlers.splice(handlerIndex, 1);
        }

        if (!handlers.length) {
          delete eventHandlers[event];
        }
      }
    };

    var on = function on(event, handler) {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }

      if (eventHandlers[event].indexOf(handler) === -1) {
        eventHandlers[event].push(handler);
      }

      return {
        cancel: function cancel() {
          return off(event, handler);
        },
      };
    };
    /** The first signal dispatched is executed and automatically cancel all others */

    var race = function race(entries) {
      var wrappedCallbacks = {};
      entries.forEach(function(_ref) {
        var event = _ref[0],
          callback = _ref[1];

        /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
        wrappedCallbacks[event] = function() {
          callback.apply(void 0, arguments);
          Object.keys(wrappedCallbacks).forEach(function(signalName) {
            off(signalName, wrappedCallbacks[signalName]);
          });
        };
        /** Listen to the signal emission */

        on(event, wrappedCallbacks[event]);
      });
    };
    /** Execute once a callback when the signal is dispatched and disconnect from it */

    var once = function once(event, handler) {
      var listener = on(event, function() {
        handler.apply(void 0, arguments);
        listener.cancel();
      });
      return listener;
    };

    return {
      on: on,
      once: once,
      race: race,
      off: off,
      fire: fire,
      events: eventHandlers,
    };
  };

  /** Used to extend a driver with the base driver */
  function extend(o) {
    for (
      var _len = arguments.length,
        modifiers = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      modifiers[_key - 1] = arguments[_key];
    }

    for (var i = modifiers.length; i--; ) {
      var modifier = modifiers[i];

      if (typeof modifier === 'function') {
        modifiers[i](o);
      } else {
        Object.assign(o, modifier);
      }
    }

    return o;
  }

  var initClock = function(System) {
    var initDate = new Date();
    var time = {
      hours: String(initDate.getHours()).padStart(2, '0'),
      minutes: String(initDate.getMinutes()).padStart(2, '0'),
    };

    System.getCurrentTime = function() {
      return time;
    };

    var timer = function timer() {
      var hours = Number.parseInt(time.hours, 10);
      var minutes = Number.parseInt(time.minutes, 10);
      minutes++;

      if (minutes === 60) {
        hours++;

        if (hours === 24) {
          hours = 0;
        }

        minutes = 0;
      }

      time.hours = String(hours).padStart(2, '0');
      time.minutes = String(minutes).padStart(2, '0');
      System.fire('clock', time.hours, time.minutes);
      return timer;
    };

    setTimeout(function() {
      return setInterval(timer(), 60000);
    }, (60 - initDate.getSeconds()) * 1000);
  };

  var System = extend(
    {
      version: '3.0.1',
    },
    initClock,
    EventTarget(),
  );

  System.getVersion = function() {
    return System.version;
  };

  var obj;
  var NOTHING =
    typeof Symbol !== 'undefined'
      ? Symbol('immer-nothing')
      : ((obj = {}), (obj['immer-nothing'] = true), obj);
  var DRAFTABLE =
    typeof Symbol !== 'undefined'
      ? Symbol.for('immer-draftable')
      : '__$immer_draftable';
  var DRAFT_STATE =
    typeof Symbol !== 'undefined'
      ? Symbol.for('immer-state')
      : '__$immer_state';
  function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
  }
  function isDraftable(value) {
    if (!value || typeof value !== 'object') {
      return false;
    }
    if (Array.isArray(value)) {
      return true;
    }
    var proto = Object.getPrototypeOf(value);
    if (!proto || proto === Object.prototype) {
      return true;
    }
    return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
  }
  var assign =
    Object.assign ||
    function assign(target, value) {
      for (var key in value) {
        if (has(value, key)) {
          target[key] = value[key];
        }
      }

      return target;
    };
  var ownKeys =
    typeof Reflect !== 'undefined' && Reflect.ownKeys
      ? Reflect.ownKeys
      : typeof Object.getOwnPropertySymbols !== 'undefined'
      ? function(obj) {
          return Object.getOwnPropertyNames(obj).concat(
            Object.getOwnPropertySymbols(obj),
          );
        }
      : Object.getOwnPropertyNames;
  function shallowCopy(base, invokeGetters) {
    if (invokeGetters === void 0) invokeGetters = false;

    if (Array.isArray(base)) {
      return base.slice();
    }
    var clone = Object.create(Object.getPrototypeOf(base));
    ownKeys(base).forEach(function(key) {
      if (key === DRAFT_STATE) {
        return; // Never copy over draft state.
      }

      var desc = Object.getOwnPropertyDescriptor(base, key);
      var value = desc.value;

      if (desc.get) {
        if (!invokeGetters) {
          throw new Error('Immer drafts cannot have computed properties');
        }

        value = desc.get.call(base);
      }

      if (desc.enumerable) {
        clone[key] = value;
      } else {
        Object.defineProperty(clone, key, {
          value: value,
          writable: true,
          configurable: true,
        });
      }
    });
    return clone;
  }
  function each(value, cb) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        cb(i, value[i], value);
      }
    } else {
      ownKeys(value).forEach(function(key) {
        return cb(key, value[key], value);
      });
    }
  }
  function isEnumerable(base, prop) {
    return Object.getOwnPropertyDescriptor(base, prop).enumerable;
  }
  function has(thing, prop) {
    return Object.prototype.hasOwnProperty.call(thing, prop);
  }
  function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  /** Each scope represents a `produce` call. */

  var ImmerScope = function ImmerScope(parent) {
    this.drafts = [];
    this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.

    this.canAutoFreeze = true; // To avoid prototype lookups:

    this.patches = null;
  };

  ImmerScope.prototype.usePatches = function usePatches(patchListener) {
    if (patchListener) {
      this.patches = [];
      this.inversePatches = [];
      this.patchListener = patchListener;
    }
  };

  ImmerScope.prototype.revoke = function revoke$1() {
    this.leave();
    this.drafts.forEach(revoke);
    this.drafts = null; // Make draft-related methods throw.
  };

  ImmerScope.prototype.leave = function leave() {
    if (this === ImmerScope.current) {
      ImmerScope.current = this.parent;
    }
  };
  ImmerScope.current = null;

  ImmerScope.enter = function() {
    return (this.current = new ImmerScope(this.current));
  };

  function revoke(draft) {
    draft[DRAFT_STATE].revoke();
  }

  // but share them all instead

  var descriptors = {};
  function willFinalize(scope, result, isReplaced) {
    scope.drafts.forEach(function(draft) {
      draft[DRAFT_STATE].finalizing = true;
    });

    if (!isReplaced) {
      if (scope.patches) {
        markChangesRecursively(scope.drafts[0]);
      } // This is faster when we don't care about which attributes changed.

      markChangesSweep(scope.drafts);
    } // When a child draft is returned, look for changes.
    else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
      markChangesSweep(scope.drafts);
    }
  }
  function createProxy(base, parent) {
    var isArray = Array.isArray(base);
    var draft = clonePotentialDraft(base);
    each(draft, function(prop) {
      proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
    }); // See "proxy.js" for property documentation.

    var scope = parent ? parent.scope : ImmerScope.current;
    var state = {
      scope: scope,
      modified: false,
      finalizing: false,
      // es5 only
      finalized: false,
      assigned: {},
      parent: parent,
      base: base,
      draft: draft,
      copy: null,
      revoke: revoke$1,
      revoked: false, // es5 only
    };
    createHiddenProperty(draft, DRAFT_STATE, state);
    scope.drafts.push(draft);
    return draft;
  }

  function revoke$1() {
    this.revoked = true;
  }

  function source(state) {
    return state.copy || state.base;
  } // Access a property without creating an Immer draft.

  function peek(draft, prop) {
    var state = draft[DRAFT_STATE];

    if (state && !state.finalizing) {
      state.finalizing = true;
      var value = draft[prop];
      state.finalizing = false;
      return value;
    }

    return draft[prop];
  }

  function get(state, prop) {
    assertUnrevoked(state);
    var value = peek(source(state), prop);
    if (state.finalizing) {
      return value;
    } // Create a draft if the value is unmodified.

    if (value === peek(state.base, prop) && isDraftable(value)) {
      prepareCopy(state);
      return (state.copy[prop] = createProxy(value, state));
    }

    return value;
  }

  function set(state, prop, value) {
    assertUnrevoked(state);
    state.assigned[prop] = true;

    if (!state.modified) {
      if (is(value, peek(source(state), prop))) {
        return;
      }
      markChanged(state);
      prepareCopy(state);
    }

    state.copy[prop] = value;
  }

  function markChanged(state) {
    if (!state.modified) {
      state.modified = true;
      if (state.parent) {
        markChanged(state.parent);
      }
    }
  }

  function prepareCopy(state) {
    if (!state.copy) {
      state.copy = clonePotentialDraft(state.base);
    }
  }

  function clonePotentialDraft(base) {
    var state = base && base[DRAFT_STATE];

    if (state) {
      state.finalizing = true;
      var draft = shallowCopy(state.draft, true);
      state.finalizing = false;
      return draft;
    }

    return shallowCopy(base);
  }

  function proxyProperty(draft, prop, enumerable) {
    var desc = descriptors[prop];

    if (desc) {
      desc.enumerable = enumerable;
    } else {
      descriptors[prop] = desc = {
        configurable: true,
        enumerable: enumerable,

        get: function get$1() {
          return get(this[DRAFT_STATE], prop);
        },

        set: function set$1(value) {
          set(this[DRAFT_STATE], prop, value);
        },
      };
    }

    Object.defineProperty(draft, prop, desc);
  }

  function assertUnrevoked(state) {
    if (state.revoked === true) {
      throw new Error(
        'Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? ' +
          JSON.stringify(source(state)),
      );
    }
  } // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.

  function markChangesSweep(drafts) {
    // The natural order of drafts in the `scope` array is based on when they
    // were accessed. By processing drafts in reverse natural order, we have a
    // better chance of processing leaf nodes first. When a leaf node is known to
    // have changed, we can avoid any traversal of its ancestor nodes.
    for (var i = drafts.length - 1; i >= 0; i--) {
      var state = drafts[i][DRAFT_STATE];

      if (!state.modified) {
        if (Array.isArray(state.base)) {
          if (hasArrayChanges(state)) {
            markChanged(state);
          }
        } else if (hasObjectChanges(state)) {
          markChanged(state);
        }
      }
    }
  }

  function markChangesRecursively(object) {
    if (!object || typeof object !== 'object') {
      return;
    }
    var state = object[DRAFT_STATE];
    if (!state) {
      return;
    }
    var base = state.base;
    var draft = state.draft;
    var assigned = state.assigned;

    if (!Array.isArray(object)) {
      // Look for added keys.
      Object.keys(draft).forEach(function(key) {
        // The `undefined` check is a fast path for pre-existing keys.
        if (base[key] === undefined && !has(base, key)) {
          assigned[key] = true;
          markChanged(state);
        } else if (!assigned[key]) {
          // Only untouched properties trigger recursion.
          markChangesRecursively(draft[key]);
        }
      }); // Look for removed keys.

      Object.keys(base).forEach(function(key) {
        // The `undefined` check is a fast path for pre-existing keys.
        if (draft[key] === undefined && !has(draft, key)) {
          assigned[key] = false;
          markChanged(state);
        }
      });
    } else if (hasArrayChanges(state)) {
      markChanged(state);
      assigned.length = true;

      if (draft.length < base.length) {
        for (var i = draft.length; i < base.length; i++) {
          assigned[i] = false;
        }
      } else {
        for (var i$1 = base.length; i$1 < draft.length; i$1++) {
          assigned[i$1] = true;
        }
      }

      for (var i$2 = 0; i$2 < draft.length; i$2++) {
        // Only untouched indices trigger recursion.
        if (assigned[i$2] === undefined) {
          markChangesRecursively(draft[i$2]);
        }
      }
    }
  }

  function hasObjectChanges(state) {
    var base = state.base;
    var draft = state.draft; // Search for added keys and changed keys. Start at the back, because
    // non-numeric keys are ordered by time of definition on the object.

    var keys = Object.keys(draft);

    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

      if (baseValue === undefined && !has(base, key)) {
        return true;
      } // Once a base key is deleted, future changes go undetected, because its
      // descriptor is erased. This branch detects any missed changes.
      else {
        var value = draft[key];
        var state$1 = value && value[DRAFT_STATE];

        if (state$1 ? state$1.base !== baseValue : !is(value, baseValue)) {
          return true;
        }
      }
    } // At this point, no keys were added or changed.
    // Compare key count to determine if keys were deleted.

    return keys.length !== Object.keys(base).length;
  }

  function hasArrayChanges(state) {
    var draft = state.draft;
    if (draft.length !== state.base.length) {
      return true;
    } // See #116
    // If we first shorten the length, our array interceptors will be removed.
    // If after that new items are added, result in the same original length,
    // those last items will have no intercepting property.
    // So if there is no own descriptor on the last position, we know that items were removed and added
    // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
    // the last one

    var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

    if (descriptor && !descriptor.get) {
      return true;
    } // For all other cases, we don't have to compare, as they would have been picked up by the index setters

    return false;
  }

  function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
      value: value,
      enumerable: false,
      writable: true,
    });
  }

  var legacyProxy = /*#__PURE__*/ Object.freeze({
    willFinalize: willFinalize,
    createProxy: createProxy,
  });

  function willFinalize$1() {}
  function createProxy$1(base, parent) {
    var scope = parent ? parent.scope : ImmerScope.current;
    var state = {
      // Track which produce call this is associated with.
      scope: scope,
      // True for both shallow and deep changes.
      modified: false,
      // Used during finalization.
      finalized: false,
      // Track which properties have been assigned (true) or deleted (false).
      assigned: {},
      // The parent draft state.
      parent: parent,
      // The base state.
      base: base,
      // The base proxy.
      draft: null,
      // Any property proxies.
      drafts: {},
      // The base copy with any updated values.
      copy: null,
      // Called by the `produce` function.
      revoke: null,
    };
    var ref = Array.isArray(base) // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
      ? // although state itself is an object
        Proxy.revocable([state], arrayTraps)
      : Proxy.revocable(state, objectTraps);
    var revoke = ref.revoke;
    var proxy = ref.proxy;
    state.draft = proxy;
    state.revoke = revoke;
    scope.drafts.push(proxy);
    return proxy;
  }
  var objectTraps = {
    get: get$1,

    has: function has(target, prop) {
      return prop in source$1(target);
    },

    ownKeys: function ownKeys(target) {
      return Reflect.ownKeys(source$1(target));
    },

    set: set$1,
    deleteProperty: deleteProperty,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor,

    defineProperty: function defineProperty() {
      throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
    },

    getPrototypeOf: function getPrototypeOf(target) {
      return Object.getPrototypeOf(target.base);
    },

    setPrototypeOf: function setPrototypeOf() {
      throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
    },
  };
  var arrayTraps = {};
  each(objectTraps, function(key, fn) {
    arrayTraps[key] = function() {
      arguments[0] = arguments[0][0];
      return fn.apply(this, arguments);
    };
  });

  arrayTraps.deleteProperty = function(state, prop) {
    if (isNaN(parseInt(prop))) {
      throw new Error("Immer only supports deleting array indices"); // prettier-ignore
    }

    return objectTraps.deleteProperty.call(this, state[0], prop);
  };

  arrayTraps.set = function(state, prop, value) {
    if (prop !== 'length' && isNaN(parseInt(prop))) {
      throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
    }

    return objectTraps.set.call(this, state[0], prop, value);
  }; // returns the object we should be reading the current value from, which is base, until some change has been made

  function source$1(state) {
    return state.copy || state.base;
  } // Access a property without creating an Immer draft.

  function peek$1(draft, prop) {
    var state = draft[DRAFT_STATE];
    var desc = Reflect.getOwnPropertyDescriptor(
      state ? source$1(state) : draft,
      prop,
    );
    return desc && desc.value;
  }

  function get$1(state, prop) {
    if (prop === DRAFT_STATE) {
      return state;
    }
    var drafts = state.drafts; // Check for existing draft in unmodified state.

    if (!state.modified && has(drafts, prop)) {
      return drafts[prop];
    }

    var value = source$1(state)[prop];

    if (state.finalized || !isDraftable(value)) {
      return value;
    } // Check for existing draft in modified state.

    if (state.modified) {
      // Assigned values are never drafted. This catches any drafts we created, too.
      if (value !== peek$1(state.base, prop)) {
        return value;
      } // Store drafts on the copy (when one exists).

      drafts = state.copy;
    }

    return (drafts[prop] = createProxy$1(value, state));
  }

  function set$1(state, prop, value) {
    if (!state.modified) {
      var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
      // never be undefined, so we can avoid the `in` operator. Lastly, truthy
      // values may be drafts, but falsy values are never drafts.

      var isUnchanged = value
        ? is(baseValue, value) || value === state.drafts[prop]
        : is(baseValue, value) && prop in state.base;
      if (isUnchanged) {
        return true;
      }
      markChanged$1(state);
    }

    state.assigned[prop] = true;
    state.copy[prop] = value;
    return true;
  }

  function deleteProperty(state, prop) {
    // The `undefined` check is a fast path for pre-existing keys.
    if (peek$1(state.base, prop) !== undefined || prop in state.base) {
      state.assigned[prop] = false;
      markChanged$1(state);
    }

    if (state.copy) {
      delete state.copy[prop];
    }
    return true;
  } // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.

  function getOwnPropertyDescriptor(state, prop) {
    var owner = source$1(state);
    var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

    if (desc) {
      desc.writable = true;
      desc.configurable = !Array.isArray(owner) || prop !== 'length';
    }

    return desc;
  }

  function markChanged$1(state) {
    if (!state.modified) {
      state.modified = true;
      state.copy = assign(shallowCopy(state.base), state.drafts);
      state.drafts = null;
      if (state.parent) {
        markChanged$1(state.parent);
      }
    }
  }

  var modernProxy = /*#__PURE__*/ Object.freeze({
    willFinalize: willFinalize$1,
    createProxy: createProxy$1,
  });

  function generatePatches(state, basePath, patches, inversePatches) {
    Array.isArray(state.base)
      ? generateArrayPatches(state, basePath, patches, inversePatches)
      : generateObjectPatches(state, basePath, patches, inversePatches);
  }

  function generateArrayPatches(state, basePath, patches, inversePatches) {
    var assign, assign$1;

    var base = state.base;
    var copy = state.copy;
    var assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

    if (copy.length < base.length) {
      (assign = [copy, base]), (base = assign[0]), (copy = assign[1]);
      (assign$1 = [inversePatches, patches]),
        (patches = assign$1[0]),
        (inversePatches = assign$1[1]);
    }

    var delta = copy.length - base.length; // Find the first replaced index.

    var start = 0;

    while (base[start] === copy[start] && start < base.length) {
      ++start;
    } // Find the last replaced index. Search from the end to optimize splice patches.

    var end = base.length;

    while (end > start && base[end - 1] === copy[end + delta - 1]) {
      --end;
    } // Process replaced indices.

    for (var i = start; i < end; ++i) {
      if (assigned[i] && copy[i] !== base[i]) {
        var path = basePath.concat([i]);
        patches.push({
          op: 'replace',
          path: path,
          value: copy[i],
        });
        inversePatches.push({
          op: 'replace',
          path: path,
          value: base[i],
        });
      }
    }

    var useRemove = end != base.length;
    var replaceCount = patches.length; // Process added indices.

    for (var i$1 = end + delta - 1; i$1 >= end; --i$1) {
      var path$1 = basePath.concat([i$1]);
      patches[replaceCount + i$1 - end] = {
        op: 'add',
        path: path$1,
        value: copy[i$1],
      };

      if (useRemove) {
        inversePatches.push({
          op: 'remove',
          path: path$1,
        });
      }
    } // One "replace" patch reverses all non-splicing "add" patches.

    if (!useRemove) {
      inversePatches.push({
        op: 'replace',
        path: basePath.concat(['length']),
        value: base.length,
      });
    }
  }

  function generateObjectPatches(state, basePath, patches, inversePatches) {
    var base = state.base;
    var copy = state.copy;
    each(state.assigned, function(key, assignedValue) {
      var origValue = base[key];
      var value = copy[key];
      var op = !assignedValue ? 'remove' : key in base ? 'replace' : 'add';
      if (origValue === value && op === 'replace') {
        return;
      }
      var path = basePath.concat(key);
      patches.push(
        op === 'remove'
          ? {
              op: op,
              path: path,
            }
          : {
              op: op,
              path: path,
              value: value,
            },
      );
      inversePatches.push(
        op === 'add'
          ? {
              op: 'remove',
              path: path,
            }
          : op === 'remove'
          ? {
              op: 'add',
              path: path,
              value: origValue,
            }
          : {
              op: 'replace',
              path: path,
              value: origValue,
            },
      );
    });
  }

  function applyPatches(draft, patches) {
    for (var i = 0; i < patches.length; i++) {
      var patch = patches[i];
      var path = patch.path;

      if (path.length === 0 && patch.op === 'replace') {
        draft = patch.value;
      } else {
        var base = draft;

        for (var i$1 = 0; i$1 < path.length - 1; i$1++) {
          base = base[path[i$1]];
          if (!base || typeof base !== "object") { throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); } // prettier-ignore
        }

        var key = path[path.length - 1];

        switch (patch.op) {
          case 'replace':
            base[key] = patch.value;
            break;

          case 'add':
            if (Array.isArray(base)) {
              // TODO: support "foo/-" paths for appending to an array
              base.splice(key, 0, patch.value);
            } else {
              base[key] = patch.value;
            }

            break;

          case 'remove':
            if (Array.isArray(base)) {
              base.splice(key, 1);
            } else {
              delete base[key];
            }

            break;

          default:
            throw new Error('Unsupported patch operation: ' + patch.op);
        }
      }
    }

    return draft;
  }

  function verifyMinified() {}

  var configDefaults = {
    useProxies: typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined',
    autoFreeze:
      typeof process !== 'undefined'
        ? process.env.NODE_ENV !== 'production'
        : verifyMinified.name === 'verifyMinified',
    onAssign: null,
    onDelete: null,
    onCopy: null,
  };
  var Immer = function Immer(config) {
    assign(this, configDefaults, config);
    this.setUseProxies(this.useProxies);
    this.produce = this.produce.bind(this);
  };

  Immer.prototype.produce = function produce(base, recipe, patchListener) {
    var this$1 = this;

    // curried invocation
    if (typeof base === "function" && typeof recipe !== "function") {
      var defaultBase = recipe;
      recipe = base; // prettier-ignore

      return function (base) {
          if ( base === void 0 ) base = defaultBase;
          var args = [], len = arguments.length - 1;
          while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

          return this$1.produce(base, function (draft) { return recipe.call.apply(recipe, [ draft, draft ].concat( args )); });
        };
    } // prettier-ignore

    {
      if (typeof recipe !== 'function') {
        throw new Error(
          'The first or second argument to `produce` must be a function',
        );
      }

      if (patchListener !== undefined && typeof patchListener !== 'function') {
        throw new Error(
          'The third argument to `produce` must be a function or undefined',
        );
      }
    }
    var result; // Only plain objects, arrays, and "immerable classes" are drafted.

    if (isDraftable(base)) {
      var scope = ImmerScope.enter();
      var proxy = this.createProxy(base);
      var hasError = true;

      try {
        result = recipe.call(proxy, proxy);
        hasError = false;
      } finally {
        // finally instead of catch + rethrow better preserves original stack
        if (hasError) {
          scope.revoke();
        } else {
          scope.leave();
        }
      }

      if (result instanceof Promise) {
        return result.then(
          function(result) {
            scope.usePatches(patchListener);
            return this$1.processResult(result, scope);
          },
          function(error) {
            scope.revoke();
            throw error;
          },
        );
      }

      scope.usePatches(patchListener);
      return this.processResult(result, scope);
    } else {
      result = recipe(base);
      if (result === undefined) {
        return base;
      }
      return result !== NOTHING ? result : undefined;
    }
  };

  Immer.prototype.createDraft = function createDraft(base) {
    if (!isDraftable(base)) {
      throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
    }

    var scope = ImmerScope.enter();
    var proxy = this.createProxy(base);
    proxy[DRAFT_STATE].isManual = true;
    scope.leave();
    return proxy;
  };

  Immer.prototype.finishDraft = function finishDraft(draft, patchListener) {
    var state = draft && draft[DRAFT_STATE];

    if (!state || !state.isManual) {
      throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
    }

    if (state.finalized) {
      throw new Error("The given draft is already finalized"); // prettier-ignore
    }

    var scope = state.scope;
    scope.usePatches(patchListener);
    return this.processResult(undefined, scope);
  };

  Immer.prototype.setAutoFreeze = function setAutoFreeze(value) {
    this.autoFreeze = value;
  };

  Immer.prototype.setUseProxies = function setUseProxies(value) {
    this.useProxies = value;
    assign(this, value ? modernProxy : legacyProxy);
  };

  Immer.prototype.applyPatches = function applyPatches$1(base, patches) {
    // Mutate the base state when a draft is passed.
    if (isDraft(base)) {
      return applyPatches(base, patches);
    } // Otherwise, produce a copy of the base state.

    return this.produce(base, function(draft) {
      return applyPatches(draft, patches);
    });
  };
  /** @internal */

  Immer.prototype.processResult = function processResult(result, scope) {
    var baseDraft = scope.drafts[0];
    var isReplaced = result !== undefined && result !== baseDraft;
    this.willFinalize(scope, result, isReplaced);

    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified) {
        scope.revoke();
        throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
      }

      if (isDraftable(result)) {
        // Finalize the result in case it contains (or is) a subset of the draft.
        result = this.finalize(result, null, scope);
      }

      if (scope.patches) {
        scope.patches.push({
          op: 'replace',
          path: [],
          value: result,
        });
        scope.inversePatches.push({
          op: 'replace',
          path: [],
          value: baseDraft[DRAFT_STATE].base,
        });
      }
    } else {
      // Finalize the base draft.
      result = this.finalize(baseDraft, [], scope);
    }

    scope.revoke();

    if (scope.patches) {
      scope.patchListener(scope.patches, scope.inversePatches);
    }

    return result !== NOTHING ? result : undefined;
  };
  /**
   * @internal
   * Finalize a draft, returning either the unmodified base state or a modified
   * copy of the base state.
   */

  Immer.prototype.finalize = function finalize(draft, path, scope) {
    var this$1 = this;

    var state = draft[DRAFT_STATE];

    if (!state) {
      if (Object.isFrozen(draft)) {
        return draft;
      }
      return this.finalizeTree(draft, null, scope);
    } // Never finalize drafts owned by another scope.

    if (state.scope !== scope) {
      return draft;
    }

    if (!state.modified) {
      return state.base;
    }

    if (!state.finalized) {
      state.finalized = true;
      this.finalizeTree(state.draft, path, scope);

      if (this.onDelete) {
        // The `assigned` object is unreliable with ES5 drafts.
        if (this.useProxies) {
          var assigned = state.assigned;

          for (var prop in assigned) {
            if (!assigned[prop]) {
              this.onDelete(state, prop);
            }
          }
        } else {
          var base = state.base;
          var copy = state.copy;
          each(base, function(prop) {
            if (!has(copy, prop)) {
              this$1.onDelete(state, prop);
            }
          });
        }
      }

      if (this.onCopy) {
        this.onCopy(state);
      } // At this point, all descendants of `state.copy` have been finalized,
      // so we can be sure that `scope.canAutoFreeze` is accurate.

      if (this.autoFreeze && scope.canAutoFreeze) {
        Object.freeze(state.copy);
      }

      if (path && scope.patches) {
        generatePatches(state, path, scope.patches, scope.inversePatches);
      }
    }

    return state.copy;
  };
  /**
   * @internal
   * Finalize all drafts in the given state tree.
   */

  Immer.prototype.finalizeTree = function finalizeTree(root, rootPath, scope) {
    var this$1 = this;

    var state = root[DRAFT_STATE];

    if (state) {
      if (!this.useProxies) {
        // Create the final copy, with added keys and without deleted keys.
        state.copy = shallowCopy(state.draft, true);
      }

      root = state.copy;
    }

    var needPatches = !!rootPath && !!scope.patches;

    var finalizeProperty = function(prop, value, parent) {
      if (value === parent) {
        throw Error('Immer forbids circular references');
      } // In the `finalizeTree` method, only the `root` object may be a draft.

      var isDraftProp = !!state && parent === root;

      if (isDraft(value)) {
        var path =
          isDraftProp && needPatches && !state.assigned[prop]
            ? rootPath.concat(prop)
            : null; // Drafts owned by `scope` are finalized here.

        value = this$1.finalize(value, path, scope); // Drafts from another scope must prevent auto-freezing.

        if (isDraft(value)) {
          scope.canAutoFreeze = false;
        } // Preserve non-enumerable properties.

        if (Array.isArray(parent) || isEnumerable(parent, prop)) {
          parent[prop] = value;
        } else {
          Object.defineProperty(parent, prop, {
            value: value,
          });
        } // Unchanged drafts are never passed to the `onAssign` hook.

        if (isDraftProp && value === state.base[prop]) {
          return;
        }
      } // Unchanged draft properties are ignored.
      else if (isDraftProp && is(value, state.base[prop])) {
        return;
      } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
      else if (isDraftable(value) && !Object.isFrozen(value)) {
        each(value, finalizeProperty);
      }

      if (isDraftProp && this$1.onAssign) {
        this$1.onAssign(state, prop, value);
      }
    };

    each(root, finalizeProperty);
    return root;
  };

  var immer = new Immer();
  /**
   * The `produce` function takes a value and a "recipe function" (whose
   * return value often depends on the base state). The recipe function is
   * free to mutate its first argument however it wants. All mutations are
   * only ever applied to a __copy__ of the base state.
   *
   * Pass only a function to create a "curried producer" which relieves you
   * from passing the recipe function every time.
   *
   * Only plain objects and arrays are made mutable. All other objects are
   * considered uncopyable.
   *
   * Note: This function is __bound__ to its `Immer` instance.
   *
   * @param {any} base - the initial state
   * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
   * @param {Function} patchListener - optional function that will be called with all the patches produced here
   * @returns {any} a new state, or the initial state if nothing was modified
   */

  var produce = immer.produce;
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is disabled in production.
   */

  var setAutoFreeze = immer.setAutoFreeze.bind(immer);
  /**
   * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
   * always faster than using ES5 proxies.
   *
   * By default, feature detection is used, so calling this is rarely necessary.
   */

  var setUseProxies = immer.setUseProxies.bind(immer);
  /**
   * Apply an array of Immer patches to the first argument.
   *
   * This function is a producer, which means copy-on-write is in effect.
   */

  var applyPatches$1 = immer.applyPatches.bind(immer);
  /**
   * Create an Immer draft from the given base state, which may be a draft itself.
   * The draft can be modified until you finalize it with the `finishDraft` function.
   */

  var createDraft = immer.createDraft.bind(immer);
  /**
   * Finalize an Immer draft from a `createDraft` call, returning the base state
   * (if no changes were made) or a modified copy. The draft must *not* be
   * mutated afterwards.
   *
   * Pass a function as the 2nd argument to generate Immer patches based on the
   * changes that were made.
   */

  var finishDraft = immer.finishDraft.bind(immer);

  /**
   * This file contain utility methods used by the simulator.
   */
  var LOG_PREFIX = '[Mamba Simulator]';
  function log() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    console.log([LOG_PREFIX].concat(args).join(' '));
  }
  function error() {
    for (
      var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }

    console.error([LOG_PREFIX].concat(args).join(' '));
  }
  function warn() {
    for (
      var _len3 = arguments.length, args = new Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3] = arguments[_key3];
    }

    console.warn([LOG_PREFIX].concat(args).join(' '));
  }
  var deepCopy = function deepCopy(o) {
    return JSON.parse(JSON.stringify(o));
  };

  var initData = function(Registry) {
    Registry._data = Object.freeze({});
    /** Data */

    Registry.get = function(keyPath) {
      if (keyPath === undefined) {
        return Registry._data;
      }

      {
        warn(
          'Registry.get(string) is deprecated. Please use Registry.get().Prop1.Prop2.Prop3...',
        );
      }

      var keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
      var value = Registry._data[keys[0]];

      for (var i = 1; i < keys.length; i++) {
        value = value[keys[i]];
      }

      return value;
    };

    Registry.set = function(keyPath, value) {
      if (keyPath === undefined) {
        return;
      }

      if (typeof keyPath === 'function') {
        var changes = [];
        produce(Registry._data, keyPath, function(patches) {
          changes.push.apply(changes, patches);
        });
        Registry._data = applyPatches$1(Registry._data, changes);
        Registry.fire('dataChanged', changes);
        return;
      }

      {
        warn(
          'Registry.set(string) is deprecated. Please use Registry.set(draft -> newState)',
        );
      }

      var keys = keyPath.replace(/\[(\d+)\]/g, '.$1').split('.');

      if (keys.length === 1) {
        Registry._data[keyPath] = value;
      } else {
        var object = Registry._data[keys[0]];

        for (var i = 1; i < keys.length - 1; i++) {
          object = object[keys[i]];
        }

        object[keys[keys.length - 1]] = value;
      }
    };
  };

  var cachedGet = null;
  var cachedParsed = {};
  var initPersistent = function(Registry) {
    if (!localStorage) {
      {
        warn(
          'Could not load persistent Registry data because "localStorage" was not found',
        );
      }

      Registry.persistent = {
        get: function get() {},
        set: function set() {},
      };
    } else {
      Registry.persistent = {
        get: function get() {
          var persistedData = localStorage.getItem('_mamba_persistent_');

          if (persistedData !== cachedGet) {
            cachedGet = persistedData;
            cachedParsed = JSON.parse(cachedGet);
          }

          return cachedParsed || {};
        },
        set: function set(fn) {
          if (typeof fn === 'function') {
            var changes = [];
            var persistentData = Registry.persistent.get();
            produce(persistentData, fn, function(patches) {
              changes.push.apply(changes, patches);
            });
            localStorage.setItem(
              '_mamba_persistent_',
              JSON.stringify(applyPatches$1(persistentData, changes)),
            );
            Registry.fire('persistentDataChanged', changes);
          }
        },
      };
    }
  };

  /**
   * This file is the boilerplate for the simulator core driver;
   * */
  var Registry = extend({}, initPersistent, initData, EventTarget());

  var HardwareManager = extend({}, EventTarget());

  /**
   * This file is a simulation of the QT Signal & Slot
   * */

  var getSlotsGroup = function getSlotsGroup() {
    var currentApp = AppManager.getCurrentApp();
    return currentApp ? currentApp.manifest.slug : 'default';
  };

  var isSlotGroupSuspended = function isSlotGroupSuspended() {
    var currentApp = AppManager.getCurrentApp();
    return currentApp ? !!currentApp.runtime.suspended : false;
  };

  function Signal() {
    /** map of appSlug -> calback list */
    var slots = {};
    /**
     * When an app closes, remove it's connected signal slots
     * This logic should not be here but it'd be cumbersome to put it elsewhere for now.
     */

    AppManager.on('closed', function(app) {
      if (slots[app.manifest.slug]) {
        delete slots[app.manifest.slug];
      }
    });

    function signal() {
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      var groupName = getSlotsGroup();

      if (slots['default']) {
        slots['default'].forEach(function(slot) {
          return slot.apply(void 0, args);
        });
      }

      if (
        groupName !== 'default' &&
        slots[groupName] &&
        !isSlotGroupSuspended()
      ) {
        slots[groupName].forEach(function(slot) {
          return slot.apply(void 0, args);
        });
      }
    }

    signal.connect = function(callback) {
      var groupName = getSlotsGroup();

      if (!slots[groupName]) {
        slots[groupName] = [];
      }

      slots[groupName].push(callback);
    };

    signal.disconnect = function(callback) {
      var groupName = getSlotsGroup();
      var callbackIndex = slots[groupName].indexOf(callback);

      if (callbackIndex >= 0) {
        slots[groupName].splice(callbackIndex, 1);

        if (slots[groupName].length === 0) {
          delete slots[groupName];
        }
      }
    };

    return signal;
  }

  Signal.register = function(namespace, signals) {
    if (!Array.isArray(signals)) {
      namespace[signals] = Signal();
    } else {
      signals.forEach(function(signalName) {
        namespace[signalName] = Signal();
      });
    }
  };

  function _extends() {
    _extends =
      Object.assign ||
      function(target) {
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
    return _extends.apply(this, arguments);
  }
  var DriverManager = extend({}, EventTarget());
  DriverManager.drivers = Object.freeze({});

  DriverManager.attachDrivers = function(driverModules) {
    driverModules.forEach(function(driverModule) {
      var _extends2;

      var driver = {};
      var driverRef = driverModule.NAMESPACE;
      /** Set the simulator default settings for the driver */

      if (driverModule.DYNAMIC_SETTINGS || driverModule.SETTINGS) {
        var dynamicDefaults =
          driverModule.DYNAMIC_SETTINGS || driverModule.SETTINGS;

        Registry.set(function(draft) {
          draft[driverRef] = deepCopy(dynamicDefaults);
        });
      }

      if (driverModule.PERSISTENT_SETTINGS) {
        var persistentDefaults = deepCopy(driverModule.PERSISTENT_SETTINGS);
        /** Does any persisted data for this driver exist? */

        Registry.persistent.set(function(draft) {
          draft[driverRef] = _extends(
            {},
            persistentDefaults,
            {},
            draft[driverRef] || {},
          );
        });
      }
      /** Register the driver signals */

      if (driverModule.SIGNALS) {
        Signal.register(driver, driverModule.SIGNALS);
      }
      /** Setup the driver methods */

      driverModule.setup(driver);
      /** Export it to the window */

      window[driverRef] = driver;
      /** Export it to the driver manager */

      DriverManager.drivers = Object.freeze(
        _extends(
          {},
          DriverManager.drivers,
          ((_extends2 = {}), (_extends2[driverRef] = driver), _extends2),
        ),
      );
    });
  };

  /**
   * This file overrides the default add/remove event listeners to collect possible loose ones
   * when unlisten them when the current app closes.
   */

  var eventTarget =
    typeof window.EventTarget !== 'undefined'
      ? window.EventTarget
      : window.Node;
  var originalAddEventListener = eventTarget.prototype.addEventListener;
  var originalRemoveEventListener = eventTarget.prototype.removeEventListener;
  /**
   * Register a global event information in the runtime object of an app
   * Map signature: constructorName -> { eventName -> callbackList }
   * */

  var collectEvent = function collectEvent(_ref, _ref2) {
    var runtime = _ref.runtime;
    var node = _ref2[0],
      type = _ref2[1],
      fn = _ref2[2];
    var tName = node.constructor.name;

    if (tName === 'Window' || tName === 'HTMLDocument') {
      var collectedEvents = runtime.collectedEvents;

      if (!collectedEvents[tName]) {
        collectedEvents[tName] = {};
      }

      if (!collectedEvents[tName][type]) {
        collectedEvents[tName][type] = [];
      }

      collectedEvents[tName][type].push(fn);
    }
  };
  /**
   * Remove a global event information from an app's runtime object
   * */

  var removeCollectedEvent = function removeCollectedEvent(_ref3, _ref4) {
    var runtime = _ref3.runtime;
    var node = _ref4[0],
      type = _ref4[1],
      fn = _ref4[2];
    var tName = node.constructor.name;

    if (tName === 'Window' || tName === 'HTMLDocument') {
      var collectedEvents = runtime.collectedEvents;

      if (collectedEvents[tName][type]) {
        var fnIndex = collectedEvents[tName][type].indexOf(fn);

        if (fnIndex > -1) {
          collectedEvents[tName][type].splice(fnIndex, 1);
        }

        if (!collectedEvents[tName][type].length) {
          delete collectedEvents[tName][type];
        }
      }
    }
  };
  /**
   * Helper to get an array of collected events from an app's runtime object
   * */

  var getCollectedEvents = function getCollectedEvents(_ref5) {
    var runtime = _ref5.runtime;
    return Object.keys(runtime.collectedEvents).reduce(function(
      acc,
      targetConstructor,
    ) {
      var node;
      if (targetConstructor === 'Window') node = window;
      else if (targetConstructor === 'HTMLDocument') node = document;
      else return;
      Object.entries(runtime.collectedEvents[targetConstructor]).forEach(
        function(_ref6) {
          var eventType = _ref6[0],
            eventList = _ref6[1];
          eventList.forEach(function(fn) {
            acc.push([node, eventType, fn]);
          });
        },
      );
      return acc;
    },
    []);
  };

  var initCollector = function(AppManager) {
    /**
     * If an app is closing, remove all global event listeners
     * and unregister them from the app's runtime.
     * If an app is being suspended, remove the listeners and
     * don't unregister them from the app's runtime
     */
    AppManager.unbindGlobalEvents = function(_ref7) {
      var runtime = _ref7.runtime;
      getCollectedEvents({
        runtime: runtime,
      }).forEach(function(_ref8) {
        var node = _ref8[0],
          eventType = _ref8[1],
          fn = _ref8[2];
        node.removeEventListener(eventType, fn);

        {
          if (runtime.suspended == null) {
            log('Removing collected DOM event listener: ');
          } else {
            log('Suspending collected DOM event listener: ');
          }

          console.log([node, eventType, fn]);
        }
      });
    };
    /** Re-bind the suspended event listeners from a app being resumed */

    AppManager.resumeGlobalEvents = function(_ref9) {
      var runtime = _ref9.runtime;

      if (!runtime.suspended) {
        throw new Error(
          'Trying to resume global events of a non-suspended app',
        );
      }

      getCollectedEvents({
        runtime: runtime,
      }).forEach(function(_ref10) {
        var node = _ref10[0],
          eventType = _ref10[1],
          fn = _ref10[2];
        node.addEventListener(eventType, fn);

        {
          log('Resuming suspended DOM event listener: ');
          console.log([node, eventType, fn]);
        }
      });
    };
    /** Same as 'unbindGlobalEvents' */

    AppManager.suspendGlobalEvents = function(_ref11) {
      var runtime = _ref11.runtime;

      if (!runtime.suspended) {
        throw new Error(
          "Trying to suspend global events for an app that's not suspended",
        );
      }

      AppManager.unbindGlobalEvents({
        runtime: runtime,
      });
    };
    /**
     * Overrides of native 'addEventListener' and
     * 'removeEventListener' to capture and keep a register of event listeners.
     * */

    eventTarget.prototype.addEventListener = function addEventListener(
      type,
      fn,
      capture,
    ) {
      originalAddEventListener.call(this, type, fn, capture);
      var currentApp = AppManager.getCurrentApp();
      /** Only collect events if there's an app running */

      if (currentApp && currentApp.runtime) {
        collectEvent(currentApp, [this, type, fn]);
      }
    };

    eventTarget.prototype.removeEventListener = function addEventListener(
      type,
      fn,
    ) {
      originalRemoveEventListener.call(this, type, fn);
      var currentApp = AppManager.getCurrentApp();
      /** Only remove collected events if an app is opened */

      if (
        currentApp &&
        currentApp.runtime &&
        /** Only remove the saved event reference if the app is closed and not suspended */
        currentApp.runtime.suspended == null
      ) {
        removeCollectedEvent(currentApp, [this, type, fn]);
      }
    };
  };

  var initSuspension = function(AppManager) {
    AppManager.suspend = function(app) {
      var runtime = app.runtime;
      var lastURL = window.location.href;
      var suspended = {
        lastURL: lastURL,
      };
      runtime.target.classList.add('is-suspended');
      runtime.suspended = suspended;
      AppManager.suspendGlobalEvents({
        runtime: runtime,
      });
      AppManager.fire('appSuspended', app);
    };

    AppManager.resume = function(app) {
      var runtime = app.runtime;
      runtime.target.classList.remove('is-suspended'); // TODO: https://developer.chrome.com/extensions/history#method-deleteAll
      // if (typeof window.history.deleteAll === 'function') {
      //   await window.history.deleteAll();
      // }

      window.history.replaceState(
        '',
        document.title,
        runtime.suspended.lastURL,
      );
      AppManager.resumeGlobalEvents({
        runtime: runtime,
      });
      delete runtime.suspended;
      AppManager.fire('appResumed', app);
    };
  };

  function _extends$1() {
    _extends$1 =
      Object.assign ||
      function(target) {
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
    return _extends$1.apply(this, arguments);
  }
  var AppManager = extend({}, initCollector, initSuspension, EventTarget());
  /** Map of installed appds: app-slug -> app-obj */

  var Apps = {};
  /** Stack of opened apps. The current app is the last one. */

  var openedApps = [];

  AppManager.getApp = function(slug) {
    return Apps[slug];
  };

  AppManager.getInstalledApps = function() {
    return Apps;
  };

  AppManager.getOpenedApps = function() {
    return openedApps;
  };

  AppManager.getCurrentApp = function() {
    return openedApps[openedApps.length - 1];
  };

  var loadApp = function loadApp(appMeta) {
    AppManager.fire('loading');
    return appMeta.loader().then(function(_ref) {
      var App = _ref['default'];
      AppManager.fire('loaded');
      Apps[appMeta.manifest.slug].RootComponent = App;
    });
  };

  AppManager.installApp = function(_ref2) {
    var manifest = _ref2.manifest,
      RootComponent = _ref2.RootComponent,
      loader = _ref2.loader;

    if (!Apps[manifest.slug]) {
      var appMeta = {
        manifest: manifest,
      };
      if (loader != null) appMeta.loader = loader;
      if (RootComponent != null) appMeta.RootComponent = RootComponent;
      Apps[manifest.slug] = appMeta;
      AppManager.fire('appInstalled', appMeta);
    } else {
      warn(
        'Tried to install an already installed app with slug "' +
          manifest.slug +
          '"',
      );
    }

    return Apps[manifest.slug];
  };

  AppManager.open = function _callee(appSlug, options) {
    var appMeta, appsEl, target, currentApp, store, initialState;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            if (options === void 0) {
              options = {};
            }

            /** First time opening an app */
            appMeta = AppManager.getApp(appSlug);

            if (appMeta.RootComponent) {
              _context.next = 5;
              break;
            }

            _context.next = 5;
            return regeneratorRuntime.awrap(loadApp(appMeta));

          case 5:
            AppManager.fire('opening', appMeta, options);
            log('Opening App: ' + appMeta.manifest.appName);
            appsEl =
              document.getElementById('apps-container') ||
              document.getElementById('app-root');

            if (appsEl) {
              _context.next = 10;
              break;
            }

            throw new Error(
              'Apps container element (#apps-container or #app-root) not found.',
            );

          case 10:
            target = appsEl;
            /** We support multiple apps only when the simulator view is loaded */

            if (appsEl.id === 'apps-container') {
              target = document.createElement('DIV');
              appsEl.appendChild(target);
            }

            currentApp = AppManager.getCurrentApp();

            if (!currentApp) {
              _context.next = 16;
              break;
            }

            _context.next = 16;
            return regeneratorRuntime.awrap(AppManager.suspend(currentApp));

          case 16:
            /**
             *  Runtime object must be created before instance initialization
             * because it already binds event listeners on instantiation.
             */
            appMeta.runtime = {
              target: target,
              collectedEvents: {},
            };
            /** Insert the most current app at the first index */

            openedApps.push(appMeta);
            appMeta.runtime.instance = new appMeta.RootComponent({
              target: target,
            });
            /**
             * Since our app store is initialized once inside its module
             * and not along the app's constructor, we need to reset it to a
             * initial state after the app closes.
             *
             * If the app is supposed to be kept in the background, we assume
             * the app itself has some logic to reset its store.
             */

            if (!appMeta.manifest.keepInBackground) {
              store = appMeta.runtime.instance.store;

              if (store) {
                initialState = _extends$1({}, store.get());
                Object.keys(store._computed).forEach(function(computedKey) {
                  delete initialState[computedKey];
                });
                appMeta.runtime.store = {
                  ref: store,
                  initialState: initialState,
                };
              }
            }

            AppManager.fire('opened', appMeta, options);
            DriverManager.drivers.$App.fire('opened');

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    });
  };

  AppManager.close = function _callee2() {
    var currentApp, manifest, _currentApp$runtime, instance, target, store;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            log('Closing App');
            currentApp = AppManager.getCurrentApp();

            if (!currentApp) {
              _context2.next = 20;
              break;
            }

            AppManager.fire('closing', currentApp);
            DriverManager.drivers.$App.fire('closed');
            (manifest = currentApp.manifest),
              (_currentApp$runtime = currentApp.runtime),
              (instance = _currentApp$runtime.instance),
              (target = _currentApp$runtime.target),
              (store = _currentApp$runtime.store);

            if (!instance) {
              _context2.next = 19;
              break;
            }

            AppManager.unbindGlobalEvents(currentApp);
            instance.destroy();
            target.parentNode.removeChild(target);

            if (!manifest.keepInBackground && store) {
              store.ref.set(store.initialState);
            }

            delete currentApp.runtime;
            /** Remove the current app from the opened apps array */

            openedApps.pop();

            if (!openedApps.length) {
              _context2.next = 16;
              break;
            }

            _context2.next = 16;
            return regeneratorRuntime.awrap(
              AppManager.resume(AppManager.getCurrentApp()),
            );

          case 16:
            AppManager.fire('closed', currentApp);
            _context2.next = 20;
            break;

          case 19: {
            warn('App already closed');
          }

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    });
  };

  var NAMESPACE = '$Printer';
  var SETTINGS = {
    panel: {
      shouldFail: false,
    },
    isPrinting: false,
    paperWidth: 384,
  };
  var SIGNALS = ['printerDone'];
  function setup(Printer) {
    Printer.getPaperWidth = function() {
      return Registry.get().$Printer.paperWidth;
    };

    Printer.isPrinting = function() {
      return Registry.get().$Printer.isPrinting;
    };

    Printer.failedPrinting = function() {
      return Registry.get().$Printer.panel.shouldFail;
    };

    Printer.doPrint = function doPrint(content, options) {
      if (options.print_to_paper === false) {
        return Printer.printerDone();
      }

      Registry.set(function(draft) {
        draft.$Printer.isPrinting = true;
      });
      /** Fire the printing signal for the browser mamba simulation */

      if (Printer.failedPrinting()) {
        Registry.set(function(draft) {
          draft.$Printer.isPrinting = false;
        });
        Printer.printerDone();
        return;
      }
      /**
       * Take a snapshot of the element / clone the node for the virtual printer.
       * If we don't clone it, if the <Printable/> is destroyed before the
       * paper is printed, it will print nothing because the content element was
       * destroyed.
       * */

      HardwareManager.fire('startPrinting', content.cloneNode(true), options);
      HardwareManager.once('endPrinting', function() {
        Registry.set(function(draft) {
          draft.$Printer.isPrinting = false;
        });
        Printer.printerDone();
      });
      /** Fire endPrinting if no Virtual POS found */

      if (!View.getInstance() || window.innerWidth <= 400) {
        setTimeout(function() {
          return HardwareManager.fire('endPrinting');
        }, 1000);
      }
    };
  }

  var $Printer = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE,
    SETTINGS: SETTINGS,
    SIGNALS: SIGNALS,
    setup: setup,
  });

  var NAMESPACE$1 = '$App';
  var SIGNALS$1 = ['opened', 'closed'];
  var PERSISTENT_SETTINGS = {
    appKey: '',
    appVersion: '1.0.0',
  };
  function setup$1(App) {
    App.doClose = function() {
      return AppManager.close();
    };

    App.getAppKey = function() {
      return Registry.persistent.get().$App.appKey;
    };

    App.isRunningOnDevice = function() {
      return false;
    };

    App.getVersion = function() {
      return Registry.persistent.get().$App.appVersion;
    };
  }

  var $App = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$1,
    SIGNALS: SIGNALS$1,
    PERSISTENT_SETTINGS: PERSISTENT_SETTINGS,
    setup: setup$1,
  });

  var NAMESPACE$2 = '$Storage';
  function setup$2(Storage) {
    /* eslint-disable no-return-assign */
    var STORAGE = window.localStorage || {
      _data: {},
      setItem: function setItem(id, val) {
        return (STORAGE._data[id] = val.toString());
      },
      getItem: function getItem(id) {
        return STORAGE._data[id];
      },
      // eslint-disable-line
      removeItem: function removeItem(id) {
        return delete STORAGE._data[id];
      },
      clear: function clear() {
        return (STORAGE._data = {});
      }, // eslint-disable-line
    };
    /* eslint-enable no-return-assign */

    /**
     * Stores a key pair value using local storage
     * @param {string} key Key name
     * @param {string} value Value
     * @memberof Storage
     */

    Storage.set = function(key, value) {
      STORAGE.setItem(key, value);
      return true;
    };
    /**
     * Get a value by its key
     * @param {string} key Returns the value associated by its key or an empty string if not found.
     * @memberof Storage
     */

    Storage.get = function(key) {
      return STORAGE.getItem(key) || '';
    };
    /**
     * Clear all the values at the local storage.
     * @memberof Storage
     */

    Storage.clear = function() {
      STORAGE.clear();
      return true;
    };
  }

  var $Storage = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$2,
    setup: setup$2,
  });

  var NAMESPACE$3 = '$Keyboard';
  var SETTINGS$1 = {
    isAlphanumericEnabled: false,
  };
  /**
   * KeyPress event handler that bypass only numbers
   * @ignore
   * @param  {function} e The KeyPress event
   */

  function filterLetters(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      var _char = String.fromCharCode(e.charCode || e.which || e.keyCode);

      if (/[a-zA-z]/.test(_char)) {
        e.preventDefault();
      }
    }
  }

  function setup$3(Keyboard) {
    /**
     * Sets the keyboard to send only numbers. This will affect the whole application
     * @memberof Keyboard
     */
    Keyboard.setKeyboardAsNumeric = function() {
      log('Keyboard is now numeric');
      Registry.set(function(draft) {
        draft.$Keyboard.isAlphanumericEnabled = false;
      });
      var root = document.querySelector('.mamba-app-container') || window;
      root.removeEventListener('keypress', filterLetters);
      root.addEventListener('keypress', filterLetters);
    };
    /**
     * Sets the keyboard to send numbers, letters and symbols. This will
     * affect the whole application
     * @memberof Keyboard
     */

    Keyboard.setKeyboardAsAlphanumeric = function() {
      log('Keyboard is now alphanumeric');
      Registry.set(function(draft) {
        draft.$Keyboard.isAlphanumericEnabled = true;
      });
      var root = document.querySelector('.mamba-app-container') || window;
      root.removeEventListener('keypress', filterLetters);
    };
  }

  var $Keyboard = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$3,
    SETTINGS: SETTINGS$1,
    setup: setup$3,
  });

  var NAMESPACE$4 = '$Merchant';
  var PERSISTENT_SETTINGS$1 = {
    stoneCode: '123123123',
    adminPassword: '1234',
    zipCode: '20040901',
    country: 'Brasil',
    city: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    neighborhood: 'Centro',
    complement: 'Edifício Central',
    street: 'Avenida Rio Branco',
    number: '131',
    displayName: 'Stoninho',
    taxationIdentificationType: 'CNPJ',
    taxationIdentificationNumber: '16.501.555/0001-57',
  };
  function setup$4(Merchant) {
    /**
     * Get the stone code
     * @memberof Merchant
     * @return {string} The stone code
     */
    Merchant.getStoneCode = function() {
      return Registry.persistent.get().$Merchant.stoneCode;
    };
    /**
     * Get the supported brands of this Merchant
     * @memberof Merchant
     * @return {array} Array of supported brands
     */

    Merchant.getSupportedBrands = function() {
      return ['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'ELO', 'SODEXO'];
    };

    Merchant.checkPassword = function(password) {
      return password === Registry.persistent.get().$Merchant.adminPassword;
    };

    Merchant.getInfo = function() {
      var _Registry$persistent$ = Registry.persistent.get(),
        _Registry$persistent$2 = _Registry$persistent$.$Merchant,
        street = _Registry$persistent$2.street,
        number = _Registry$persistent$2.number,
        complement = _Registry$persistent$2.complement,
        zipCode = _Registry$persistent$2.zipCode,
        city = _Registry$persistent$2.city,
        state = _Registry$persistent$2.state,
        country = _Registry$persistent$2.country,
        stoneCode = _Registry$persistent$2.stoneCode,
        displayName = _Registry$persistent$2.displayName,
        taxationIdentificationNumber =
          _Registry$persistent$2.taxationIdentificationNumber;

      return {
        street: street,
        number: number,
        complement: complement,
        zipCode: zipCode,
        city: city,
        state: state,
        country: country,
        displayName: displayName,
        taxationIdentificationNumber: taxationIdentificationNumber,
        acquirerIssuedMerchantId: stoneCode,
      };
    };
  }

  var $Merchant = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$4,
    PERSISTENT_SETTINGS: PERSISTENT_SETTINGS$1,
    setup: setup$4,
  });

  function _extends$2() {
    _extends$2 =
      Object.assign ||
      function(target) {
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
    return _extends$2.apply(this, arguments);
  }
  var NAMESPACE$5 = '$Payment';
  var SETTINGS$2 = {
    panel: {
      shouldFail: false,
    },
    paymentFailed: false,
    isPaying: false,
    installmentCount: 0,
    cardHolderName: 'SPORTELLO/DOC',
    pan: '56497#####41578',
    type: 'CREDITO/DEBITO',
    authCode: '111111111',
    cardBrand: 'bandeiraTeste',
    atk: '11111111111111',
    itk: '11111111111111',
    orderId: '111111111',
    authorizedAmount: 0,
  };
  var SIGNALS$2 = ['cardEvent', 'paymentDone'];
  function setup$5(Payment) {
    var finishPayment = function finishPayment(params) {
      Payment.paymentDone();
      Registry.set(function(draft) {
        draft.$Payment.isPaying = false;
        draft.$Payment.authorizedAmount = params.amount;
      });
    };

    Payment.doPay = function(params) {
      Registry.set(function(draft) {
        draft.$Payment.isPaying = true;
        /** Set failed to true. The payment app will define it as false if it succeeds */

        draft.$Payment.paymentFailed = true;
      });

      if (AppManager.getApp('1-payment')) {
        AppManager.once('closed', function(app) {
          if (app.manifest.slug === '1-payment') {
            finishPayment(params);
          }
        });
        AppManager.open(
          '1-payment',
          _extends$2(
            {
              openMode: 'selection',
            },
            params,
          ),
        );
      } else {
        Registry.set(function(draft) {
          draft.$Payment.paymentFailed = draft.$Payment.panel.shouldFail;
        });
        finishPayment(params);
      }
    };
    /**
     * Returns true if is paying
     * @memberof Payment
     * @return {boolean} True if is paying
     */

    Payment.isPaying = function() {
      return Registry.get().$Payment.isPaying;
    };
    /**
     * Returns true it the last payment job has failed
     * @return {boolean} True if the last payment job has failed
     */

    Payment.failedPaying = function() {
      return Registry.get().$Payment.paymentFailed;
    };
    /**
     * Get card holder name in case of payment success.
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} cardHolderName
     */

    Payment.getCardHolderName = function() {
      return !Payment.failedPaying()
        ? ''
        : Registry.get().$Payment.cardHolderName;
    };
    /**
     * Return the transaction ATK in case of payment success
     * Return mock string with the expected size if payment failed
     * @memberof Payment
     * @return {string} atk
     */

    Payment.getAtk = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.atk;
    };
    /**
     * Return the transaction ITK in case of payment success
     * Return mock string with the expected size if payment failed
     * @memberof Payment
     * @return {string} itk
     */

    Payment.getItk = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.itk;
    };
    /**
     * Return the Authorized Amount in case of success
     * Return 0 if payment failed
     * @memberof Payment
     * @return {number} amount
     */

    Payment.getAmountAuthorized = function() {
      return Payment.failedPaying()
        ? 0
        : Registry.get().$Payment.authorizedAmount;
    };
    /**
     * Return the Authorization Date and Time in case of success
     * Return current Date-Time if payment failed
     * @memberof Payment
     * @return {Date} authorizationDateTime
     */

    Payment.getAuthorizationDateTime = function() {
      return !Payment.failedPaying() ? '' : new Date();
    };
    /**
     * Return the card brand in case of success
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} brand
     */

    Payment.getBrand = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.cardBrand;
    };
    /**
     * Return the order id in case of success
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} orderId
     */

    Payment.getOrderId = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.orderId;
    };
    /**
     * Return the authorization code in case of success
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} authorizationCode
     */

    Payment.getAuthorizationCode = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.authCode;
    };
    /**
     * Return the number of installments selected, in case of success
     * Return 0 if payment failed
     * @memberof Payment
     * @return {int} installmentCount
     */

    Payment.getInstallmentCount = function() {
      return !Payment.failedPaying()
        ? 0
        : Registry.get().$Payment.installmentCount;
    };
    /**
     * Return the pan in case of success
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} pan
     */

    Payment.getPan = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.pan;
    };
    /**
     * Return the type transaction in case of success
     * Return empty string if payment failed
     * @memberof Payment
     * @return {string} type
     */

    Payment.getType = function() {
      return !Payment.failedPaying() ? '' : Registry.get().$Payment.type;
    };
  }

  var $Payment = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$5,
    SETTINGS: SETTINGS$2,
    SIGNALS: SIGNALS$2,
    setup: setup$5,
  });

  var systemEnums = {
    Tones: Object.freeze({
      TONE1: 'TONE1',
      TONE2: 'TONE2',
      TONE3: 'TONE3',
      TONE4: 'TONE4',
      TONE5: 'TONE5',
      TONE6: 'TONE6',
      TONE7: 'TONE7',
    }),
    PowerSupply: Object.freeze({
      ADAPTER: 'ADAPTER',
      BATTERY: 'BATTERY',
      USB: 'USB',
    }),
    BatteryStatus: Object.freeze({
      CHECK_NOT_SUPPORTED: 'CHECK_NOT_SUPPORTED',
      IN_CHARGE: 'IN_CHARGE',
      CHARGE_COMPLETE: 'CHARGE_COMPLETE',
      DISCHARGE: 'DISCHARGE',
      ABSENT: 'ABSENT',
    }),
  };

  var NAMESPACE$6 = '$System';
  var SIGNALS$3 = ['batteryCritical', 'batteryNormal'];
  var SETTINGS$3 = {
    Connections: {
      ethernet: true,
      wifi: true,
      gprs: false,
      currentType: 'wifi',
    },
    Battery: {
      present: true,
      level: 50,
      status: systemEnums.BatteryStatus.DISCHARGE,
      isBatteryCritical: false,
    },
    PowerSupply: systemEnums.PowerSupply.USB,
  };
  var PERSISTENT_SETTINGS$2 = {
    serialNumber: '00000000',
  };
  /**
   * Defines the default beep duration [ms]
   * @ignore
   * @type {number}
   */

  var DEFAULT_BEEP_DURATION = 300;
  /**
   * Audio context for simulating POS beeps.
   * Instantiated once by the {@link doBeep}
   */

  var audioCtx;
  /**
   * Makes a beep sound
   * @param  {number}   duration  Duration of the tone, in milliseconds
   * @param  {number}   frequency Frequency of the tone, in Hz
   */

  function doBeep(duration, frequency) {
    if (typeof audioCtx === 'undefined') {
      audioCtx = new window.AudioContext();
    }

    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 1; // Volume

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    oscillator.start();
    setTimeout(function() {
      return oscillator.stop();
    }, duration);
  }

  function _getToneFrequency(tone, toneMap) {
    if (tone === toneMap.TONE1) return 1700;
    if (tone === toneMap.TONE2) return 1850;
    if (tone === toneMap.TONE3) return 2000;
    if (tone === toneMap.TONE4) return 2100;
    if (tone === toneMap.TONE5) return 2350;
    if (tone === toneMap.TONE6) return 2700;
    if (tone === toneMap.TONE7) return 2800;
    return null;
  }

  function setup$6(System$1) {
    var localConfig = {
      TimeFromBoot: 0,
    };
    /**
     * Sets an interval that updates the {@link config.TimeFromBoot}
     * @returns {object} The interval object
     */

    setInterval(function() {
      localConfig.TimeFromBoot += 1000;
    }, 1000);

    System$1.getVersion = function() {
      return System.getVersion();
    };
    /**
     * Change adapter network wifi or 3g
     * @memberOf System
     * @return {boolean} true or false
     */

    System$1.changeAdapterTo = function(desiredAdapter) {
      if (desiredAdapter !== 'mbb' && desiredAdapter !== 'wifi') {
        return false;
      }

      Registry.set(function(draft) {
        draft.$System.Connections.currentType = desiredAdapter;
      });
      return true;
    };
    /**
     * Returns on which network is connected
     * @memberOf System
     * @return {string} Wifi or 3G
     */

    System$1.getCurrentConnectionType = function() {
      return Registry.get().$System.Connections.currentType;
    };
    /**
     * Checks if the device has ethernet
     * @memberOf System
     * @return {boolean} True if the device has ethernet
     */

    System$1.hasEthernet = function() {
      return Registry.get().$System.Connections.ethernet;
    };
    /**
     * Checks if the device has wifi
     * @memberOf System
     * @return {boolean} True if the device has wifi
     */

    System$1.hasWifi = function() {
      return Registry.get().$System.Connections.wifi;
    };
    /**
     * Checks if the device has gprs
     * @memberOf System
     * @return {boolean} True if the device has gprs
     */

    System$1.hasGprs = function() {
      return Registry.get().$System.Connections.gprs;
    };
    /**
     * Checks if the battery is present
     * @memberOf System
     * @return {boolean} True if the battery is present
     */

    System$1.isBatteryPresent = function() {
      return Registry.get().$System.Battery.present;
    };
    /**
     * Gets the decive current power supply
     * @memberOf System
     * @return {System.PowerSupply} The current power supply of the device
     */

    System$1.getPowerSupply = function() {
      return Registry.get().$System.PowerSupply;
    };
    /**
     * Gets the time from the boot until this moment [ms]
     * @memberOf System
     * @return {number} The time in milliseconds
     */

    System$1.getTimeFromBoot = function() {
      return localConfig.TimeFromBoot;
    };
    /**
     * Gets the serial number of the device
     * @memberOf System
     * @return {string} The serial number
     */

    System$1.getSerialNumber = function() {
      return Registry.persistent.get().$System.serialNumber;
    };
    /**
     * Gets the status of the battery
     * @memberOf System
     * @return {System.BatteryStatus} The status of the battery
     */

    System$1.getBatteryStatus = function() {
      return Registry.get().$System.Battery.status;
    };
    /**
     * Gets the status of the battery critical
     * @memberOf System
     * @return {System.BatteryStatus} The status of the battery
     */

    System$1.isBatteryCritical = function() {
      return Registry.get().$System.Battery.isBatteryCritical;
    };
    /**
     * Gets the level of the battery. Note that the level is discrete and it
     * depends on the {@link System.BatteryStatus}. A list of the possible values
     * is stated below:
     * <pre>
     * {@link System.BatteryStatus.CHECK_NOT_SUPPORTED}: 0
     * {@link System.BatteryStatus.IN_CHARGE}: 0
     * {@link System.BatteryStatus.CHARGE_COMPLETE}: 100
     * {@link System.BatteryStatus.DISCHARGE}: 10, 30, 50, 70, 90
     * {@link System.BatteryStatus.ABSENT}: 0
     * </pre>
     * @memberOf System
     * @return {number} The level of the battery
     */

    System$1.getBatteryLevel = function() {
      return Registry.get().$System.Battery.level;
    };
    /**
     * Gets version system
     * @return {string} The version system
     */

    System$1.getVersion = function() {
      return '3.0.0';
    };
    /**
     * Performs a beep. Note that this function blocks the execution on the real device
     * until it's finished. If {@link tone} and {@link duration} are both undefined, the default beep
     * will be executed. If the {@link duration} is undefined, the default duration will be used
     * @memberOf System
     * @param  {System.Tone} tone         The tone of the beep
     * @param  {number}      [duration=300]     The duration of the tone in milliseconds
     */

    System$1.beep = function(tone, duration) {
      if (tone === void 0) {
        tone = System$1.Tones.TONE1;
      }

      if (duration === void 0) {
        duration = DEFAULT_BEEP_DURATION;
      }

      var toneFrequency = _getToneFrequency(tone, System$1.Tones);

      if (!toneFrequency) {
        error('Beep: Bad Usage');
        return;
      }

      log('Beep: tone = ' + tone + ', duration = ' + duration);

      if (typeof window.AudioContext !== 'undefined') {
        doBeep(duration, toneFrequency);
      }
    };
  }

  var $System = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$6,
    SIGNALS: SIGNALS$3,
    SETTINGS: SETTINGS$3,
    PERSISTENT_SETTINGS: PERSISTENT_SETTINGS$2,
    setup: setup$6,
  });

  var NAMESPACE$7 = '$Cancellation';
  var SETTINGS$4 = {
    cancelledAmount: -1,
    shouldCancellationFail: false,
  };
  var SIGNALS$4 = ['cancellationDone'];
  function setup$7(Cancellation) {
    /**
     * Return if the cancellation failed
     * @memberof Payment
     * @return {boolean} True if cacellation failed.
     */
    Cancellation.failedCancellation = function() {
      return Registry.get().$Cancellation.shouldCancellationFail;
    };
    /**
     * Return the cancelled amount
     * @memberof Payment
     * @return {number} the last cancelled amount transaction
     */

    Cancellation.getAmount = function() {
      return Cancellation.failedCancellation()
        ? 0
        : Registry.get().$Cancellation.cancelledAmount;
    };

    Cancellation.doCancellation = function() {
      Registry.set(function(draft) {
        draft.$Cancellation.cancelledAmount = draft.$Payment.authorizedAmount;
      });
      Cancellation.cancellationDone();
    };
  }

  var $Cancellation = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$7,
    SETTINGS: SETTINGS$4,
    SIGNALS: SIGNALS$4,
    setup: setup$7,
  });

  var NAMESPACE$8 = '$Http';
  var SIGNALS$5 = ['requestRefSinal', 'requestFinished', 'requestFailed'];
  var SETTINGS$5 = {
    panel: {
      simulateRequest: false,
      requestMsg: '{}',
      requestPayload: '{}',
    },
  };
  function setup$8(Http) {
    var _errorData = null;
    var _data = null;

    var setError = function onerror(refSignal) {
      _errorData = {
        status: this.status,
        msg: this.responseText,
      };
      Http.fire('requestFailed', _errorData, refSignal);
    };

    Http.getError = function() {
      return _errorData;
    };

    Http.getData = function() {
      return _data;
    };

    Http.doSend = function send(_ref, refSignal) {
      var _ref$method = _ref.method,
        method = _ref$method === void 0 ? 'GET' : _ref$method,
        _ref$url = _ref.url,
        url = _ref$url === void 0 ? '' : _ref$url,
        data = _ref.data,
        headers = _ref.headers,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 30000 : _ref$timeout;
      var xhttp = new XMLHttpRequest();
      Http.fire('requestRefSinal', refSignal, refSignal);

      {
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
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
          _data = {
            status: this.status,
            body: this.responseText,
          };
          Http.fire('requestFinished', _data, refSignal);
        }
      };

      var panel = Registry.get().$Http.panel;

      if (panel.simulateRequest) {
        var requestMsg = JSON.parse(panel.requestMsg);

        if (timeout > 0) {
          setTimeout(function() {
            _errorData = {
              status: 504,
              msg: 'Gateway Time-Out',
            };
            Http.fire('requestFailed', _errorData, refSignal);
          }, panel.timeout);
          return;
        }

        setTimeout(function() {
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
        url =
          'https://poiproxy.stone.com.br/v1/proxy?url=' +
          encodeURIComponent(url);
        headers['X-Mamba-App'] = panel.appKey;
        headers['X-Mamba-SN'] = Registry.persistent.get().$System.serialNumber;
        headers['X-Stone-Code'] = Registry.persistent.get().$Merchant.stoneCode;
      }

      xhttp.open(method, url, true);
      xhttp.timeout = timeout;

      if (headers) {
        Object.keys(headers).forEach(function(key) {
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

  var $Http = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$8,
    SIGNALS: SIGNALS$5,
    SETTINGS: SETTINGS$5,
    setup: setup$8,
  });

  var NAMESPACE$9 = '$Card';
  var SIGNALS$6 = ['cardInserted', 'cardRemoved'];
  var SETTINGS$6 = {
    isInserted: false,
  };
  function setup$9(Card) {
    Card.isCardInserted = function() {
      return Registry.get().$Card.isInserted;
    };

    HardwareManager.on('cardToggled', function(isInserted) {
      Registry.set(function(draft) {
        draft.$Card.isInserted = isInserted;
      });

      if (isInserted) {
        Card.cardInserted();
      } else {
        Card.cardRemoved();
      }
    });
  }

  var $Card = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NAMESPACE: NAMESPACE$9,
    SIGNALS: SIGNALS$6,
    SETTINGS: SETTINGS$6,
    setup: setup$9,
  });

  DriverManager.attachDrivers([
    $Printer,
    $App,
    $Storage,
    $Keyboard,
    $Merchant,
    $Payment,
    $System,
    $Cancellation,
    $Http,
    $Card,
  ]);

  function noop() {}

  function assign$1(tar, src) {
    for (var k in src) {
      tar[k] = src[k];
    }

    return tar;
  }

  function assignTrue(tar, src) {
    for (var k in src) {
      tar[k] = 1;
    }

    return tar;
  }

  function addLoc(element, file, line, column, _char) {
    element.__svelte_meta = {
      loc: {
        file: file,
        line: line,
        column: column,
        char: _char,
      },
    };
  }

  function append(target, node) {
    target.appendChild(node);
  }

  function insert(target, node, anchor) {
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

  function reinsertAfter(before, target) {
    while (before.nextSibling) {
      target.appendChild(before.nextSibling);
    }
  }

  function destroyEach(iterations, detach) {
    for (var i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detach);
    }
  }

  function createFragment() {
    return document.createDocumentFragment();
  }

  function createElement(name) {
    return document.createElement(name);
  }

  function createSvgElement(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }

  function createText(data) {
    return document.createTextNode(data);
  }

  function createComment() {
    return document.createComment('');
  }

  function addListener(node, event, handler, options) {
    node.addEventListener(event, handler, options);
  }

  function removeListener(node, event, handler, options) {
    node.removeEventListener(event, handler, options);
  }

  function setAttribute(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else node.setAttribute(attribute, value);
  }

  function setData(text, data) {
    text.data = '' + data;
  }

  function setInputType(input, type) {
    try {
      input.type = type;
    } catch (e) {}
  }

  function setStyle(node, key, value) {
    node.style.setProperty(key, value);
  }

  function toggleClass(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
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

    this.destroy = function() {
      console.warn('Component was already destroyed');
    };
  }

  function _differs(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === 'object') || typeof a === 'function';
  }

  function fire(eventName, data) {
    var handlers =
      eventName in this._handlers && this._handlers[eventName].slice();

    if (!handlers) return;

    for (var i = 0; i < handlers.length; i += 1) {
      var handler = handlers[i];

      if (!handler.__calling) {
        try {
          handler.__calling = true;
          handler.call(this, data);
        } finally {
          handler.__calling = false;
        }
      }
    }
  }

  function flush(component) {
    component._lock = true;
    callAll(component._beforecreate);
    callAll(component._oncreate);
    callAll(component._aftercreate);
    component._lock = false;
  }

  function get$2() {
    return this._state;
  }

  function init(component, options) {
    component._handlers = blankObject();
    component._slots = blankObject();
    component._bind = options._bind;
    component._staged = {};
    component.options = options;
    component.root = options.root || component;
    component.store = options.store || component.root.store;

    if (!options.root) {
      component._beforecreate = [];
      component._oncreate = [];
      component._aftercreate = [];
    }
  }

  function on(eventName, handler) {
    var handlers =
      this._handlers[eventName] || (this._handlers[eventName] = []);
    handlers.push(handler);
    return {
      cancel: function cancel() {
        var index = handlers.indexOf(handler);
        if (~index) handlers.splice(index, 1);
      },
    };
  }

  function set$2(newState) {
    this._set(assign$1({}, newState));

    if (this.root._lock) return;
    flush(this.root);
  }

  function _set(newState) {
    var oldState = this._state,
      changed = {},
      dirty = false;
    newState = assign$1(this._staged, newState);
    this._staged = {};

    for (var key in newState) {
      if (this._differs(newState[key], oldState[key]))
        changed[key] = dirty = true;
    }

    if (!dirty) return;
    this._state = assign$1(assign$1({}, oldState), newState);

    this._recompute(changed, this._state);

    if (this._bind) this._bind(changed, this._state);

    if (this._fragment) {
      this.fire('state', {
        changed: changed,
        current: this._state,
        previous: oldState,
      });

      this._fragment.p(changed, this._state);

      this.fire('update', {
        changed: changed,
        current: this._state,
        previous: oldState,
      });
    }
  }

  function _stage(newState) {
    assign$1(this._staged, newState);
  }

  function setDev(newState) {
    if (typeof newState !== 'object') {
      throw new Error(
        this._debugName +
          '.set was called without an object of data key-values to update.',
      );
    }

    this._checkReadOnly(newState);

    set$2.call(this, newState);
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
    get: get$2,
    fire: fire,
    on: on,
    set: setDev,
    _recompute: noop,
    _set: _set,
    _stage: _stage,
    _mount: _mount,
    _differs: _differs,
  };

  var onceTransitionEnd = function onceTransitionEnd(el, cb) {
    var onTransitionEnd = function onTransitionEnd(e) {
      cb(e);
      el.removeEventListener('transitionend', onTransitionEnd);
    };

    el.addEventListener('transitionend', onTransitionEnd);
  };

  /* packages/pos/simulator/view/pos/hardware/Printer.html generated by Svelte v2.16.1 */

  let shreddingPromise = null;

  const STATES = Object.freeze({
    IDLE: 'idle',
    PRINTING: 'printing',
    PRINTED: 'printed',
    SHREDDING: 'shredding',
    WAITING: 'waiting',
  });

  function printerClass({ state }) {
    return `is-${state}`;
  }
  function data() {
    return {
      content: '',
      state: STATES.IDLE,
      usingDithering: false,
    };
  }
  var methods = {
    print(content, options) {
      const { state } = this.get();
      this.set({ usingDithering: !!options.use_dithering });

      const getPrintPromise = () =>
        new Promise(resolve => {
          this.set({
            state: STATES.PRINTED,
            content: content.outerHTML,
          });

          /** Once it finishes printing animation */
          onceTransitionEnd(this.refs.paper, resolve);
        });

      /** If there's already printed paper, shred it */
      if (state === STATES.PRINTED || state === STATES.SHREDDING) {
        return this.shred().then(getPrintPromise);
      }

      return getPrintPromise();
    },
    /** Shred a already printed paper */
    shred() {
      const { state } = this.get();
      /** Does the printer has any printed paper? */
      const doesntHasPaper = state !== STATES.PRINTED;

      /** If already shredding, return the current shredding promise */
      if (state === STATES.SHREDDING) {
        return shreddingPromise;
      }

      if (doesntHasPaper) {
        return Promise.resolve();
      }

      /** If there's already printed paper, shred it */
      shreddingPromise = new Promise(resolve => {
        this.set({ state: STATES.SHREDDING });
        /** Once it finishes shredding animation */
        onceTransitionEnd(this.refs.paper, () => {
          this.set({
            state: STATES.WAITING,
            content: '',
          });

          /** Once it finishes the "reset" animation */
          setTimeout(resolve);
        });
      });

      return shreddingPromise;
    },
  };

  function oncreate() {
    HardwareManager.on('startPrinting', (content, options) => {
      this.print(content, options).then(() =>
        HardwareManager.fire('endPrinting'),
      );
    });
  }
  const file = 'packages/pos/simulator/view/pos/hardware/Printer.html';

  function add_css() {
    var style = createElement('style');
    style.id = 'svelte-yzaep6-style';
    style.textContent =
      ".printer.svelte-yzaep6{width:400px;position:absolute;left:42px;bottom:584px;-webkit-transform:scale(0.59524);transform:scale(0.59524);-webkit-transform-origin:0 100%;transform-origin:0 100%}.printer.svelte-yzaep6:not(.is-printed){pointer-events:none}.printer.svelte-yzaep6::after{content:'';display:block;position:absolute;z-index:0;bottom:0;left:0;width:100%;height:10px;max-height:10px;background-color:#add8e6;border-top:1px dashed transparent;-webkit-transition:border-top-color 0.3s ease, max-height 0.3s ease;transition:border-top-color 0.3s ease, max-height 0.3s ease}.printer.is-printed.svelte-yzaep6:hover::after{border-top-color:rgba(0, 0, 0, 0.6)}.printer.is-shredding.svelte-yzaep6::after,.printer.is-waiting.svelte-yzaep6::after{box-shadow:2px 0px 2px 1px rgba(0, 0, 0, 0.4)}.printer.is-idle.svelte-yzaep6::after{max-height:0;background-color:transparent}.paper.svelte-yzaep6{position:relative;overflow-y:auto;background-color:#add8e6;cursor:pointer;border-top-right-radius:2px;border-top-left-radius:2px;-webkit-transition:max-height 2s ease-in-out, -webkit-transform 0.2s 0.3s ease;transition:max-height 2s ease-in-out, -webkit-transform 0.2s 0.3s ease;transition:transform 0.2s 0.3s ease, max-height 2s ease-in-out;transition:transform 0.2s 0.3s ease, max-height 2s ease-in-out, -webkit-transform 0.2s 0.3s ease;-webkit-transform-origin:0 100%;transform-origin:0 100%;max-height:370px}.printer.is-idle.svelte-yzaep6 .paper.svelte-yzaep6{max-height:0}.printer.is-waiting.svelte-yzaep6 .paper.svelte-yzaep6{-webkit-transition:none;transition:none;max-height:10px}.printer.is-printed.svelte-yzaep6 .paper.svelte-yzaep6{box-shadow:2px 0px 2px 1px rgba(0, 0, 0, 0.4)}.printer.is-shredding.svelte-yzaep6 .paper.svelte-yzaep6{border-bottom:none;-webkit-transition:-webkit-transform 1s ease;transition:-webkit-transform 1s ease;transition:transform 1s ease;transition:transform 1s ease, -webkit-transform 1s ease;-webkit-transform:rotateZ(-8deg) translateY(-700px);transform:rotateZ(-8deg) translateY(-700px)}.content.svelte-yzaep6{position:relative;z-index:1;padding:20px 21px 15px 20px;filter:contrast(300%) grayscale(100%) url(#remove-colors-alpha)}@media(max-width: 400px){.printer.svelte-yzaep6{display:none\n  }}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpbnRlci5odG1sIiwic291cmNlcyI6WyJQcmludGVyLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiPGRpdlxuICBjbGFzcz1cInByaW50ZXIge3ByaW50ZXJDbGFzc30ge3VzaW5nRGl0aGVyaW5nID8gJ2hhcy1kaXRoZXJpbmcnIDogJyd9XCJcbiAgb246Y2xpY2s9XCJzaHJlZCgpXCJcbj5cbiAgPGRpdiByZWY6cGFwZXIgY2xhc3M9XCJwYXBlciBoaWRlLXNjcm9sbGJhclwiPlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+e0BodG1sIGNvbnRlbnR9PC9kaXY+XG4gIDwvZGl2PlxuXG4gIDwhLS0gU1ZHIGZpbHRlciBmb3IgcmVtb3ZpbmcgY29sb3JzIGZyb20gdGhlIHBhcGVyIC0tPlxuICA8c3ZnIHdpZHRoPVwiMFwiIGhlaWdodD1cIjBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCI+XG4gICAgPGRlZnM+XG4gICAgICA8ZmlsdGVyIGlkPVwicmVtb3ZlLWNvbG9ycy1hbHBoYVwiIHg9XCIwJVwiIHk9XCIwJVwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cbiAgICAgICAgeyNpZiAhdXNpbmdEaXRoZXJpbmd9XG4gICAgICAgICAgPGZlQ29tcG9uZW50VHJhbnNmZXI+XG4gICAgICAgICAgICA8ZmVGdW5jUiB0eXBlPVwiZGlzY3JldGVcIiB0YWJsZVZhbHVlcz1cIjAuMCAxLjBcIj48L2ZlRnVuY1I+XG4gICAgICAgICAgICA8ZmVGdW5jRyB0eXBlPVwiZGlzY3JldGVcIiB0YWJsZVZhbHVlcz1cIjAuMCAxLjBcIj48L2ZlRnVuY0c+XG4gICAgICAgICAgICA8ZmVGdW5jQiB0eXBlPVwiZGlzY3JldGVcIiB0YWJsZVZhbHVlcz1cIjAuMCAxLjBcIj48L2ZlRnVuY0I+XG4gICAgICAgICAgPC9mZUNvbXBvbmVudFRyYW5zZmVyPlxuICAgICAgICB7L2lmfVxuICAgICAgICA8IS0tIFJlbW92ZSB3aGl0ZSAtLT5cbiAgICAgICAgPGZlQ29sb3JNYXRyaXggcmVzdWx0PVwib3JpZ2luYWxcIiBpZD1cInN2Z2NvbG9ybWF0cml4XCIgdHlwZT1cIm1hdHJpeFwiIHZhbHVlcz1cIjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIC0xIC0xIC0xIDEgLTAuMDRcIj48L2ZlQ29sb3JNYXRyaXg+XG4gICAgICA8L2ZpbHRlcj5cbiAgICA8L2RlZnM+XG4gIDwvc3ZnPlxuPC9kaXY+XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCB7IEhhcmR3YXJlTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uL2luZGV4LmpzJztcbiAgaW1wb3J0IHsgb25jZVRyYW5zaXRpb25FbmQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbiAgbGV0IHNocmVkZGluZ1Byb21pc2UgPSBudWxsO1xuXG4gIGNvbnN0IFNUQVRFUyA9IE9iamVjdC5mcmVlemUoe1xuICAgIElETEU6ICdpZGxlJyxcbiAgICBQUklOVElORzogJ3ByaW50aW5nJyxcbiAgICBQUklOVEVEOiAncHJpbnRlZCcsXG4gICAgU0hSRURESU5HOiAnc2hyZWRkaW5nJyxcbiAgICBXQUlUSU5HOiAnd2FpdGluZycsXG4gIH0pO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBkYXRhKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29udGVudDogJycsXG4gICAgICAgIHN0YXRlOiBTVEFURVMuSURMRSxcbiAgICAgICAgdXNpbmdEaXRoZXJpbmc6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9LFxuICAgIGNvbXB1dGVkOiB7XG4gICAgICBwcmludGVyQ2xhc3MoeyBzdGF0ZSB9KSB7XG4gICAgICAgIHJldHVybiBgaXMtJHtzdGF0ZX1gO1xuICAgICAgfSxcbiAgICB9LFxuICAgIG9uY3JlYXRlKCkge1xuICAgICAgSGFyZHdhcmVNYW5hZ2VyLm9uKCdzdGFydFByaW50aW5nJywgKGNvbnRlbnQsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgdGhpcy5wcmludChjb250ZW50LCBvcHRpb25zKS50aGVuKCgpID0+XG4gICAgICAgICAgSGFyZHdhcmVNYW5hZ2VyLmZpcmUoJ2VuZFByaW50aW5nJyksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIHByaW50KGNvbnRlbnQsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gdGhpcy5nZXQoKTtcbiAgICAgICAgdGhpcy5zZXQoeyB1c2luZ0RpdGhlcmluZzogISFvcHRpb25zLnVzZV9kaXRoZXJpbmcgfSk7XG5cbiAgICAgICAgY29uc3QgZ2V0UHJpbnRQcm9taXNlID0gKCkgPT5cbiAgICAgICAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHtcbiAgICAgICAgICAgICAgc3RhdGU6IFNUQVRFUy5QUklOVEVELFxuICAgICAgICAgICAgICBjb250ZW50OiBjb250ZW50Lm91dGVySFRNTCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiogT25jZSBpdCBmaW5pc2hlcyBwcmludGluZyBhbmltYXRpb24gKi9cbiAgICAgICAgICAgIG9uY2VUcmFuc2l0aW9uRW5kKHRoaXMucmVmcy5wYXBlciwgcmVzb2x2ZSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqIElmIHRoZXJlJ3MgYWxyZWFkeSBwcmludGVkIHBhcGVyLCBzaHJlZCBpdCAqL1xuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFUy5QUklOVEVEIHx8IHN0YXRlID09PSBTVEFURVMuU0hSRURESU5HKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2hyZWQoKS50aGVuKGdldFByaW50UHJvbWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2V0UHJpbnRQcm9taXNlKCk7XG4gICAgICB9LFxuICAgICAgLyoqIFNocmVkIGEgYWxyZWFkeSBwcmludGVkIHBhcGVyICovXG4gICAgICBzaHJlZCgpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gdGhpcy5nZXQoKTtcbiAgICAgICAgLyoqIERvZXMgdGhlIHByaW50ZXIgaGFzIGFueSBwcmludGVkIHBhcGVyPyAqL1xuICAgICAgICBjb25zdCBkb2VzbnRIYXNQYXBlciA9IHN0YXRlICE9PSBTVEFURVMuUFJJTlRFRDtcblxuICAgICAgICAvKiogSWYgYWxyZWFkeSBzaHJlZGRpbmcsIHJldHVybiB0aGUgY3VycmVudCBzaHJlZGRpbmcgcHJvbWlzZSAqL1xuICAgICAgICBpZiAoc3RhdGUgPT09IFNUQVRFUy5TSFJFRERJTkcpIHtcbiAgICAgICAgICByZXR1cm4gc2hyZWRkaW5nUHJvbWlzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkb2VzbnRIYXNQYXBlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBJZiB0aGVyZSdzIGFscmVhZHkgcHJpbnRlZCBwYXBlciwgc2hyZWQgaXQgKi9cbiAgICAgICAgc2hyZWRkaW5nUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0KHsgc3RhdGU6IFNUQVRFUy5TSFJFRERJTkcgfSk7XG4gICAgICAgICAgLyoqIE9uY2UgaXQgZmluaXNoZXMgc2hyZWRkaW5nIGFuaW1hdGlvbiAqL1xuICAgICAgICAgIG9uY2VUcmFuc2l0aW9uRW5kKHRoaXMucmVmcy5wYXBlciwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXQoe1xuICAgICAgICAgICAgICBzdGF0ZTogU1RBVEVTLldBSVRJTkcsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICcnLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qKiBPbmNlIGl0IGZpbmlzaGVzIHRoZSBcInJlc2V0XCIgYW5pbWF0aW9uICovXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2hyZWRkaW5nUHJvbWlzZTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuLnByaW50ZXIge1xuICAgIHdpZHRoOiA0MDBweDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogNDJweDtcbiAgICBib3R0b206IDU4NHB4O1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjU5NTI0KTtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC41OTUyNCk7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiAwIDEwMCU7XG4gICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiAwIDEwMCU7XG4gIH1cblxuLnByaW50ZXI6bm90KC5pcy1wcmludGVkKSB7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG5cbi5wcmludGVyOjphZnRlciB7XG4gICAgICBjb250ZW50OiAnJztcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgei1pbmRleDogMDtcbiAgICAgIGJvdHRvbTogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTBweDtcbiAgICAgIG1heC1oZWlnaHQ6IDEwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWRkOGU2O1xuICAgICAgYm9yZGVyLXRvcDogMXB4IGRhc2hlZCB0cmFuc3BhcmVudDtcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogYm9yZGVyLXRvcC1jb2xvciAwLjNzIGVhc2UsIG1heC1oZWlnaHQgMC4zcyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLXRvcC1jb2xvciAwLjNzIGVhc2UsIG1heC1oZWlnaHQgMC4zcyBlYXNlO1xuICAgIH1cblxuLnByaW50ZXIuaXMtcHJpbnRlZDpob3Zlcjo6YWZ0ZXIge1xuICAgICAgICBib3JkZXItdG9wLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNik7XG4gICAgICB9XG5cbi5wcmludGVyLmlzLXNocmVkZGluZzo6YWZ0ZXIsIC5wcmludGVyLmlzLXdhaXRpbmc6OmFmdGVyIHtcbiAgICAgICAgYm94LXNoYWRvdzogMnB4IDBweCAycHggMXB4IHJnYmEoMCwgMCwgMCwgMC40KTtcbiAgICAgIH1cblxuLnByaW50ZXIuaXMtaWRsZTo6YWZ0ZXIge1xuICAgICAgICBtYXgtaGVpZ2h0OiAwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIH1cblxuLnBhcGVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWRkOGU2O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMnB4O1xuICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDJweDtcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IG1heC1oZWlnaHQgMnMgZWFzZS1pbi1vdXQsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMgMC4zcyBlYXNlO1xuICAgIHRyYW5zaXRpb246IG1heC1oZWlnaHQgMnMgZWFzZS1pbi1vdXQsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMgMC4zcyBlYXNlO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIDAuM3MgZWFzZSwgbWF4LWhlaWdodCAycyBlYXNlLWluLW91dDtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyAwLjNzIGVhc2UsIG1heC1oZWlnaHQgMnMgZWFzZS1pbi1vdXQsIC13ZWJraXQtdHJhbnNmb3JtIDAuMnMgMC4zcyBlYXNlO1xuICAgIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogMCAxMDAlO1xuICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogMCAxMDAlO1xuICAgIG1heC1oZWlnaHQ6IDM3MHB4O1xuICB9XG5cbi5wcmludGVyLmlzLWlkbGUgLnBhcGVyIHtcbiAgICAgIG1heC1oZWlnaHQ6IDA7XG4gICAgfVxuXG4ucHJpbnRlci5pcy13YWl0aW5nIC5wYXBlciB7XG4gICAgICAtd2Via2l0LXRyYW5zaXRpb246IG5vbmU7XG4gICAgICB0cmFuc2l0aW9uOiBub25lO1xuICAgICAgbWF4LWhlaWdodDogMTBweDtcbiAgICB9XG5cbi5wcmludGVyLmlzLXByaW50ZWQgLnBhcGVyIHtcbiAgICAgIGJveC1zaGFkb3c6IDJweCAwcHggMnB4IDFweCByZ2JhKDAsIDAsIDAsIDAuNCk7XG4gICAgfVxuXG4ucHJpbnRlci5pcy1zaHJlZGRpbmcgLnBhcGVyIHtcbiAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIDFzIGVhc2U7XG4gICAgICB0cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAxcyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDFzIGVhc2U7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMXMgZWFzZSwgLXdlYmtpdC10cmFuc2Zvcm0gMXMgZWFzZTtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVaKC04ZGVnKSB0cmFuc2xhdGVZKC03MDBweCk7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlWigtOGRlZykgdHJhbnNsYXRlWSgtNzAwcHgpO1xuICAgIH1cblxuLmNvbnRlbnQge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIHBhZGRpbmc6IDIwcHggMjFweCAxNXB4IDIwcHg7XG4gICAgZmlsdGVyOiBjb250cmFzdCgzMDAlKSBncmF5c2NhbGUoMTAwJSkgdXJsKCNyZW1vdmUtY29sb3JzLWFscGhhKTtcbiAgfVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDAwcHgpIHtcblxuLnByaW50ZXIge1xuICAgICAgZGlzcGxheTogbm9uZVxuICB9XG4gICAgfVxuXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OUFiV0Z0WW1FdmMzUjViR1Z6TDJOdmJHOXljeTV3WTNOeklpd2libTlrWlY5dGIyUjFiR1Z6TDBCdFlXMWlZUzl6ZEhsc1pYTXZkR2hsYldVdWNHTnpjeUlzSW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZhR0Z5WkhkaGNtVXZVSEpwYm5SbGNpNW9kRzFzSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVhWQ1FTeFJRVUZST3p0QlEyaENVaXh0UWtGQmJVSTdPMEZCVTI1Q0xIRkNRVUZ4UWpzN1FVRk5ja0lzYzBKQlFYTkNPenRCUVUxMFFpeDVRa0ZCZVVJN08wRkJaWHBDTEcxQ1FVRnRRanM3UVVOd1EycENPMGxCUTBVc1dVRkJXVHRKUVVOYUxHdENRVUZyUWp0SlFVTnNRaXhWUVVGVk8wbEJRMVlzWVVGQllUdEpRVU5pTEdsRFFVRTRRanRaUVVFNVFpeDVRa0ZCT0VJN1NVRkRPVUlzWjBOQlFYZENPMWxCUVhoQ0xIZENRVUYzUWp0RlFUUkRNVUk3TzBGQmRFTkZPMDFCUTBVc2IwSkJRVzlDTzBsQlEzUkNPenRCUVVWQk8wMUJRMFVzVjBGQlZ6dE5RVU5ZTEdOQlFXTTdUVUZEWkN4clFrRkJhMEk3VFVGRGJFSXNWVUZCVlR0TlFVTldMRk5CUVZNN1RVRkRWQ3hQUVVGUE8wMUJRMUFzVjBGQlZ6dE5RVU5ZTEZsQlFWazdUVUZEV2l4blFrRkJaMEk3VFVGRGFFSXNlVUpCUVRoQ08wMUJRemxDTEd0RFFVRnJRenROUVVOc1F5eHZSVUZCTkVRN1RVRkJOVVFzTkVSQlFUUkVPMGxCUXpsRU96dEJRVWRGTzFGQlEwVXNiME5CUVc5RE8wMUJRM1JET3p0QlFVdEJPMUZCUTBVc09FTkJRVGhETzAxQlEyaEVPenRCUVVsQk8xRkJRMFVzWVVGQllUdFJRVU5pTERaQ1FVRTJRanROUVVNdlFqczdRVUZKU2p0SlFVTkZMR3RDUVVGclFqdEpRVU5zUWl4blFrRkJaMEk3U1VGRGFFSXNlVUpCUVRoQ08wbEJRemxDTEdWQlFXVTdTVUZEWml3MFFrRkJORUk3U1VGRE5VSXNNa0pCUVRKQ08wbEJRek5DTEN0RlFVRXJSRHRKUVVFdlJDeDFSVUZCSzBRN1NVRkJMMFFzSzBSQlFTdEVPMGxCUVM5RUxHbEhRVUVyUkR0SlFVTXZSQ3huUTBGQmQwSTdXVUZCZUVJc2QwSkJRWGRDTzBsQlEzaENMR2xDUVVFMlFqdEZRVzlDTDBJN08wRkJiRUpGTzAxQlEwVXNZVUZCWVR0SlFVTm1PenRCUVVWQk8wMUJRMFVzZDBKQlFXZENPMDFCUVdoQ0xHZENRVUZuUWp0TlFVTm9RaXhuUWtGQlowSTdTVUZEYkVJN08wRkJSVUU3VFVGRFJTdzRRMEZCT0VNN1NVRkRhRVE3TzBGQlJVRTdUVUZEUlN4dFFrRkJiVUk3VFVGRGJrSXNOa05CUVRaQ08wMUJRVGRDTEhGRFFVRTJRanROUVVFM1FpdzJRa0ZCTmtJN1RVRkJOMElzZDBSQlFUWkNPMDFCUXpkQ0xHOUVRVUUwUXp0alFVRTFReXcwUTBGQk5FTTdTVUZET1VNN08wRkJSMFk3U1VGRFJTeHJRa0ZCYTBJN1NVRkRiRUlzVlVGQlZUdEpRVU5XTERSQ1FVRTBRanRKUVVNMVFpeG5SVUZCWjBVN1JVRkRiRVU3TzBGQmFFWkZPenRCUVZKR08wMUJVMGs3UlVGNVEwbzdTVUY0UTBVaUxDSm1hV3hsSWpvaWNHRmphMkZuWlhNdmNHOXpMM05wYlhWc1lYUnZjaTkyYVdWM0wzQnZjeTlvWVhKa2QyRnlaUzlRY21sdWRHVnlMbWgwYld3aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWtZbXhoWTJzNklDTXdNREE3WEc1Y2JpUjNhR2wwWlRvZ0kyWm1aanRjYmlSelpXRnphR1ZzYkRvZ0kyWXhaakZtTVR0Y2JseHVKSE4wYjI1bExXZHlaV1Z1T2lBak5HWmlNelF4TzF4dUpITjBiMjVsTFdkeVpXVnVMV1JoY21zNklDTXhOVE0xTWpJN1hHNGtjM1J2Ym1VdFozSmxaVzR0YkdsbmFIUTZJQ05oTm1SbU9HTTdYRzVjYmlSbmNtRjVMV1JoY210bGNqb2dJek0xTXpVek5UdGNiaVJuY21GNUxXUmhjbXM2SUNNME1qVTVOak03WEc0a1ozSmhlVG9nSXpkbE4yVTNaVHRjYmlSbmNtRjVMV3hwWjJoME9pQWpZalZpTldJMU8xeHVKR2R5WVhrdGJHbG5hSFJsY2pvZ0kyVXpaVFpsTnp0Y2JpUm5jbUY1TFd4cFoyaDBaWE4wT2lBalpqRm1NbVl6TzF4dVhHNGtjMmxzZG1WeU9pQWpZbUZpT1dJNU8xeHVKSE5wYkhabGNpMXNhV2RvZERvZ0kyUmpaR05rWXp0Y2JseHVKSEpsWkRvZ0kyWm1NV0V4WVR0Y2JpUnlaV1F0WkdGeWF6b2dJMlExTURBd01EdGNiaVJ5WldRdGJHbG5hSFE2SUNObE9EVmlOV0k3WEc1Y2JpOHFJQzB0TFNBcUwxeHVYRzRrWW14MVpUb2dJekl4T1RabU16dGNiaVJpYkhWbExXUmhjbXM2SUNNeE5UWTFZekE3WEc1Y2JpUmliSFZsTFdkeVlYa3RiR2xuYUhRNklDTTVNR0UwWVdVN1hHNGtZbXgxWlMxbmNtRjVPaUFqTmpBM1pEaGlPMXh1SkdKc2RXVXRaM0poZVMxa1lYSnJPaUFqTkRVMVlUWTBPMXh1WEc0a1ozSmxaVzQ2SUNNMFpXSm1NV0U3WEc0a1ozSmxZVzR0YkdsbmFIUTZJQ00wWTJGbU5UQTdYRzRrWjNKbFpXNHRaR0Z5YXpvZ0l6TmtZVEV3Wmp0Y2JpUm5jbVZsYmkxd1lYbHRaVzUwT2lBak5ESTVPRFF4TzF4dVhHNGtjSFZ5Y0d4bE9pQWpZV0kwTjJKak8xeHVKSEIxY25Cc1pTMWtZWEpyT2lBak56a3daVGhpTzF4dUpIQjFjbkJzWlMxc2FXZG9kRG9nSTJSbU56aGxaanRjYmx4dUpIUmxZV3c2SUNNeE9XVXpZakU3WEc0a2RHVmhiQzFrWVhKck9pQWpNREJoWmprNE8xeHVYRzRrZVdWc2JHOTNPaUFqWmpsaE9ESTFPMXh1SkhsbGJHeHZkeTFrWVhKck9pQWpaalUzWmpFM08xeHVJaXdpUUdsdGNHOXlkQ0FuWTI5c2IzSnpMbkJqYzNNbk8xeHVYRzRrWkdWbVlYVnNkQzEwWlhoMExXTnZiRzl5T2lBa1ozSmhlUzFrWVhKclpYSTdYRzRrWkdWbVlYVnNkQzFtYjI1MExYTnBlbVU2SURFemNIZzdYRzVjYmlSaGNIQXRZbWN0WTI5c2IzSTZJQ1JuY21GNUxXeHBaMmgwWlhJN1hHNWNiaThxS2lCU2IzY2dZMjl0Y0c5dVpXNTBJQ292WEc0a2NtOTNMWEJoWkdScGJtYzZJREV5Y0hnZ01UVndlRHRjYmlSeWIzY3RkRzl3TFdobGFXZG9kRG9nWVhWMGJ6dGNiaVJ5YjNjdFltOXlaR1Z5TFdOdmJHOXlPaUFrWjNKaGVTMXNhV2RvZEdWeU8xeHVKSEp2ZHkxaVp5MWpiMnh2Y2pvZ0pIZG9hWFJsTzF4dUpISnZkeTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJaWEk3WEc0a2NtOTNMWE5sWTI5dVpHRnllUzFqYjJ4dmNqb2dKR2R5WVhrN1hHNGtjbTkzTFdadmJuUXRjMmw2WlRvZ01UUndlRHRjYmx4dUx5b3FJRWx1Y0hWMElHTnZiWEJ2Ym1WdWRDQXFMMXh1SkdsdWNIVjBMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUmxjanRjYmlScGJuQjFkQzFtYjJOMWN5MWliM0prWlhJdFkyOXNiM0k2SUNSemRHOXVaUzFuY21WbGJqdGNiaVJwYm5CMWRDMXBiblpoYkdsa0xXSnZjbVJsY2kxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUnBibkIxZEMxbGNuSnZjaTFqYjJ4dmNqb2dKSEpsWkMxc2FXZG9kRHRjYmx4dUx5b3FJRVJwWVd4dlp5QmpiMjF3YjI1bGJuUWdLaTljYmlSa2FXRnNiMmN0Ym1WbllYUnBkbVV0WTI5c2IzSTZJQ1J5WldRdGJHbG5hSFE3WEc0a1pHbGhiRzluTFhCdmMybDBhWFpsTFdOdmJHOXlPaUFrYzNSdmJtVXRaM0psWlc0N1hHNGtaR2xoYkc5bkxXTnZibVpwY20xaGRHbHZiaTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJPMXh1SkdScFlXeHZaeTFqYjI1bWFYSnRZWFJwYjI0dGRHVjRkQzFqYjJ4dmNqb2dKSGRvYVhSbE8xeHVYRzR2S2lvZ1FXUnRhVzVNYjJOcklHTnZiWEJ2Ym1WdWRDQXFMMXh1SkdGa2JXbHViRzlqYXkxdVpXZGhkR2wyWlMxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUmhaRzFwYm14dlkyc3RkR1Y0ZEMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YXp0Y2JpUmhaRzFwYm14dlkyc3RZbUZqYTJkeWIzVnVaQzFqYjJ4dmNqb2dJMll3WmpCbU1EdGNibHh1SkdKMWRIUnZiaTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0psWlc0N1hHNGtZblYwZEc5dUxYUmxlSFF0WTI5c2IzSTZJQ1IzYUdsMFpUdGNibHh1SkhOM2FYUmphQzExYm1Ob1pXTnJaV1F0WW1jNklDUnphV3gyWlhJN1hHNGtjM2RwZEdOb0xYVnVZMmhsWTJ0bFpDMWpiMnh2Y2pvZ0pITmxZWE5vWld4c08xeHVKSE4zYVhSamFDMWphR1ZqYTJWa0xXSm5PaUFrYzNSdmJtVXRaM0psWlc0dGJHbG5hSFE3WEc0a2MzZHBkR05vTFdOb1pXTnJaV1F0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVJ6ZDJsMFkyZ3RaR2x6WVdKc1pXUXRZbWM2SUNSemFXeDJaWEl0YkdsbmFIUTdYRzRrYzNkcGRHTm9MV1JwYzJGaWJHVmtMV052Ykc5eU9pQWtjMmxzZG1WeU8xeHVYRzR2S2lCVVlXSnpJR052YlhCdmJtVnVkQ0FxTDF4dUpIUmhZaTF1WVhacFoyRjBhVzl1TFdKbk9pQWpaakptTW1ZeU8xeHVKSFJoWWkxc1lXSmxiQzFqYjJ4dmNqb2dJelkxTnpjM1pqdGNiaVIwWVdJdGFYUmxiUzFtYjI1MExYTnBlbVU2SURFemNIZzdYRzRrZEdGaUxXeHBibVV0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVIwWVdJdGFHVnBaMmgwT2lBME1IQjRPMXh1SWl3aVhHNGdJQ1J3WVhCbGNpMWpiMnh2Y2pvZ0kyRmtaRGhsTmp0Y2JpQWdKRzFoZUMxd1lYQmxjaTFvWldsbmFIUTZJRE0zTUhCNE8xeHVJQ0FrY21WaGJDMXdZWEJsY2kxM2FXUjBhRG9nWTJGc1l5Z3pPRFFnS3lBek5pazdYRzRnSUNSdGIyTnJkWEF0Y0dGd1pYSXRkMmxrZEdnNklESTFNRHRjYmlBZ0pIQmhjR1Z5TFhOallXeGxPaUJqWVd4aktDUnRiMk5yZFhBdGNHRndaWEl0ZDJsa2RHZ2dMeUFrY21WaGJDMXdZWEJsY2kxM2FXUjBhQ2s3WEc1Y2JpQWdMbkJ5YVc1MFpYSWdlMXh1SUNBZ0lIZHBaSFJvT2lBME1EQndlRHRjYmlBZ0lDQndiM05wZEdsdmJqb2dZV0p6YjJ4MWRHVTdYRzRnSUNBZ2JHVm1kRG9nTkRKd2VEdGNiaUFnSUNCaWIzUjBiMjA2SURVNE5IQjRPMXh1SUNBZ0lIUnlZVzV6Wm05eWJUb2djMk5oYkdVb0pIQmhjR1Z5TFhOallXeGxLVHRjYmlBZ0lDQjBjbUZ1YzJadmNtMHRiM0pwWjJsdU9pQXdJREV3TUNVN1hHNWNiaUFnSUNCQWJXVmthV0VnS0cxaGVDMTNhV1IwYURvZ05EQXdjSGdwSUh0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUc1dmJtVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0pqcHViM1FvTG1sekxYQnlhVzUwWldRcElIdGNiaUFnSUNBZ0lIQnZhVzUwWlhJdFpYWmxiblJ6T2lCdWIyNWxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDWTZPbUZtZEdWeUlIdGNiaUFnSUNBZ0lHTnZiblJsYm5RNklDY25PMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dZbXh2WTJzN1hHNGdJQ0FnSUNCd2IzTnBkR2x2YmpvZ1lXSnpiMngxZEdVN1hHNGdJQ0FnSUNCNkxXbHVaR1Y0T2lBd08xeHVJQ0FnSUNBZ1ltOTBkRzl0T2lBd08xeHVJQ0FnSUNBZ2JHVm1kRG9nTUR0Y2JpQWdJQ0FnSUhkcFpIUm9PaUF4TURBbE8xeHVJQ0FnSUNBZ2FHVnBaMmgwT2lBeE1IQjRPMXh1SUNBZ0lDQWdiV0Y0TFdobGFXZG9kRG9nTVRCd2VEdGNiaUFnSUNBZ0lHSmhZMnRuY205MWJtUXRZMjlzYjNJNklDUndZWEJsY2kxamIyeHZjanRjYmlBZ0lDQWdJR0p2Y21SbGNpMTBiM0E2SURGd2VDQmtZWE5vWldRZ2RISmhibk53WVhKbGJuUTdYRzRnSUNBZ0lDQjBjbUZ1YzJsMGFXOXVPaUJpYjNKa1pYSXRkRzl3TFdOdmJHOXlJREF1TTNNZ1pXRnpaU3dnYldGNExXaGxhV2RvZENBd0xqTnpJR1ZoYzJVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmk1cGN5MXdjbWx1ZEdWa09taHZkbVZ5SUh0Y2JpQWdJQ0FnSUNZNk9tRm1kR1Z5SUh0Y2JpQWdJQ0FnSUNBZ1ltOXlaR1Z5TFhSdmNDMWpiMnh2Y2pvZ2NtZGlZU2d3TENBd0xDQXdMQ0F3TGpZcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUNZdWFYTXRjMmh5WldSa2FXNW5MRnh1SUNBZ0lDWXVhWE10ZDJGcGRHbHVaeUI3WEc0Z0lDQWdJQ0FtT2pwaFpuUmxjaUI3WEc0Z0lDQWdJQ0FnSUdKdmVDMXphR0ZrYjNjNklESndlQ0F3Y0hnZ01uQjRJREZ3ZUNCeVoySmhLREFzSURBc0lEQXNJREF1TkNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmk1cGN5MXBaR3hsSUh0Y2JpQWdJQ0FnSUNZNk9tRm1kR1Z5SUh0Y2JpQWdJQ0FnSUNBZ2JXRjRMV2hsYVdkb2REb2dNRHRjYmlBZ0lDQWdJQ0FnWW1GamEyZHliM1Z1WkMxamIyeHZjam9nZEhKaGJuTndZWEpsYm5RN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0xuQmhjR1Z5SUh0Y2JpQWdJQ0J3YjNOcGRHbHZiam9nY21Wc1lYUnBkbVU3WEc0Z0lDQWdiM1psY21ac2IzY3RlVG9nWVhWMGJ6dGNiaUFnSUNCaVlXTnJaM0p2ZFc1a0xXTnZiRzl5T2lBa2NHRndaWEl0WTI5c2IzSTdYRzRnSUNBZ1kzVnljMjl5T2lCd2IybHVkR1Z5TzF4dUlDQWdJR0p2Y21SbGNpMTBiM0F0Y21sbmFIUXRjbUZrYVhWek9pQXljSGc3WEc0Z0lDQWdZbTl5WkdWeUxYUnZjQzFzWldaMExYSmhaR2wxY3pvZ01uQjRPMXh1SUNBZ0lIUnlZVzV6YVhScGIyNDZJSFJ5WVc1elptOXliU0F3TGpKeklEQXVNM01nWldGelpTd2diV0Y0TFdobGFXZG9kQ0F5Y3lCbFlYTmxMV2x1TFc5MWREdGNiaUFnSUNCMGNtRnVjMlp2Y20wdGIzSnBaMmx1T2lBd0lERXdNQ1U3WEc0Z0lDQWdiV0Y0TFdobGFXZG9kRG9nSkcxaGVDMXdZWEJsY2kxb1pXbG5hSFE3WEc1Y2JpQWdJQ0F1Y0hKcGJuUmxjaTVwY3kxcFpHeGxJQ1lnZTF4dUlDQWdJQ0FnYldGNExXaGxhV2RvZERvZ01EdGNiaUFnSUNCOVhHNWNiaUFnSUNBdWNISnBiblJsY2k1cGN5MTNZV2wwYVc1bklDWWdlMXh1SUNBZ0lDQWdkSEpoYm5OcGRHbHZiam9nYm05dVpUdGNiaUFnSUNBZ0lHMWhlQzFvWldsbmFIUTZJREV3Y0hnN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTG5CeWFXNTBaWEl1YVhNdGNISnBiblJsWkNBbUlIdGNiaUFnSUNBZ0lHSnZlQzF6YUdGa2IzYzZJREp3ZUNBd2NIZ2dNbkI0SURGd2VDQnlaMkpoS0RBc0lEQXNJREFzSURBdU5DazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0xuQnlhVzUwWlhJdWFYTXRjMmh5WldSa2FXNW5JQ1lnZTF4dUlDQWdJQ0FnWW05eVpHVnlMV0p2ZEhSdmJUb2dibTl1WlR0Y2JpQWdJQ0FnSUhSeVlXNXphWFJwYjI0NklIUnlZVzV6Wm05eWJTQXhjeUJsWVhObE8xeHVJQ0FnSUNBZ2RISmhibk5tYjNKdE9pQnliM1JoZEdWYUtDMDRaR1ZuS1NCMGNtRnVjMnhoZEdWWktDMDNNREJ3ZUNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0xtTnZiblJsYm5RZ2UxeHVJQ0FnSUhCdmMybDBhVzl1T2lCeVpXeGhkR2wyWlR0Y2JpQWdJQ0I2TFdsdVpHVjRPaUF4TzF4dUlDQWdJSEJoWkdScGJtYzZJREl3Y0hnZ01qRndlQ0F4TlhCNElESXdjSGc3WEc0Z0lDQWdabWxzZEdWeU9pQmpiMjUwY21GemRDZ3pNREFsS1NCbmNtRjVjMk5oYkdVb01UQXdKU2tnZFhKc0tDTnlaVzF2ZG1VdFkyOXNiM0p6TFdGc2NHaGhLVHRjYmlBZ2ZWeHVJbDE5ICovPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFtSUEsUUFBUSxjQUFDLENBQUMsQUFDTixLQUFLLENBQUUsS0FBSyxDQUNaLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLElBQUksQ0FBRSxJQUFJLENBQ1YsTUFBTSxDQUFFLEtBQUssQ0FDYixpQkFBaUIsQ0FBRSxNQUFNLE9BQU8sQ0FBQyxDQUN6QixTQUFTLENBQUUsTUFBTSxPQUFPLENBQUMsQ0FDakMsd0JBQXdCLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDeEIsZ0JBQWdCLENBQUUsQ0FBQyxDQUFDLElBQUksQUFDbEMsQ0FBQyxBQUVILHNCQUFRLEtBQUssV0FBVyxDQUFDLEFBQUMsQ0FBQyxBQUNyQixjQUFjLENBQUUsSUFBSSxBQUN0QixDQUFDLEFBRUwsc0JBQVEsT0FBTyxBQUFDLENBQUMsQUFDWCxPQUFPLENBQUUsRUFBRSxDQUNYLE9BQU8sQ0FBRSxLQUFLLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLENBQUMsQ0FDVixNQUFNLENBQUUsQ0FBQyxDQUNULElBQUksQ0FBRSxDQUFDLENBQ1AsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsVUFBVSxDQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUNsQyxrQkFBa0IsQ0FBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ3BF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 */";
    append(document.head, style);
  }

  function create_main_fragment(component, ctx) {
    var div2,
      div1,
      div0,
      text,
      svg,
      defs,
      filter,
      feColorMatrix,
      div2_class_value;

    var if_block = !ctx.usingDithering && create_if_block();

    function click_handler(event) {
      component.shred();
    }

    return {
      c: function create() {
        div2 = createElement('div');
        div1 = createElement('div');
        div0 = createElement('div');
        text = createText('\n\n  \n  ');
        svg = createSvgElement('svg');
        defs = createSvgElement('defs');
        filter = createSvgElement('filter');
        if (if_block) if_block.c();
        feColorMatrix = createSvgElement('feColorMatrix');
        div0.className = 'content svelte-yzaep6';
        addLoc(div0, file, 5, 4, 152);
        div1.className = 'paper hide-scrollbar svelte-yzaep6';
        addLoc(div1, file, 4, 2, 103);
        setAttribute(feColorMatrix, 'result', 'original');
        setAttribute(feColorMatrix, 'id', 'svgcolormatrix');
        setAttribute(feColorMatrix, 'type', 'matrix');
        setAttribute(
          feColorMatrix,
          'values',
          '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1 -1 -1 1 -0.04',
        );
        addLoc(feColorMatrix, file, 20, 8, 813);
        setAttribute(filter, 'id', 'remove-colors-alpha');
        setAttribute(filter, 'x', '0%');
        setAttribute(filter, 'y', '0%');
        setAttribute(filter, 'width', '100%');
        setAttribute(filter, 'height', '100%');
        addLoc(filter, file, 11, 6, 381);
        addLoc(defs, file, 10, 4, 368);
        setAttribute(svg, 'width', '0');
        setAttribute(svg, 'height', '0');
        setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
        setAttribute(svg, 'version', '1.1');
        setStyle(svg, 'display', 'block');
        addLoc(svg, file, 9, 2, 264);
        addListener(div2, 'click', click_handler);
        div2.className = div2_class_value =
          'printer ' +
          ctx.printerClass +
          ' ' +
          (ctx.usingDithering ? 'has-dithering' : '') +
          ' svelte-yzaep6';
        addLoc(div2, file, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div1);
        append(div1, div0);
        div0.innerHTML = ctx.content;
        component.refs.paper = div1;
        append(div2, text);
        append(div2, svg);
        append(svg, defs);
        append(defs, filter);
        if (if_block) if_block.m(filter, null);
        append(filter, feColorMatrix);
      },

      p: function update(changed, ctx) {
        if (changed.content) {
          div0.innerHTML = ctx.content;
        }

        if (!ctx.usingDithering) {
          if (!if_block) {
            if_block = create_if_block();
            if_block.c();
            if_block.m(filter, feColorMatrix);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          (changed.printerClass || changed.usingDithering) &&
          div2_class_value !==
            (div2_class_value =
              'printer ' +
              ctx.printerClass +
              ' ' +
              (ctx.usingDithering ? 'has-dithering' : '') +
              ' svelte-yzaep6')
        ) {
          div2.className = div2_class_value;
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div2);
        }

        if (component.refs.paper === div1) component.refs.paper = null;
        if (if_block) if_block.d();
        removeListener(div2, 'click', click_handler);
      },
    };
  }

  // (13:8) {#if !usingDithering}
  function create_if_block(component, ctx) {
    var feComponentTransfer, feFuncR, feFuncG, feFuncB;

    return {
      c: function create() {
        feComponentTransfer = createSvgElement('feComponentTransfer');
        feFuncR = createSvgElement('feFuncR');
        feFuncG = createSvgElement('feFuncG');
        feFuncB = createSvgElement('feFuncB');
        setAttribute(feFuncR, 'type', 'discrete');
        setAttribute(feFuncR, 'tableValues', '0.0 1.0');
        addLoc(feFuncR, file, 14, 12, 530);
        setAttribute(feFuncG, 'type', 'discrete');
        setAttribute(feFuncG, 'tableValues', '0.0 1.0');
        addLoc(feFuncG, file, 15, 12, 600);
        setAttribute(feFuncB, 'type', 'discrete');
        setAttribute(feFuncB, 'tableValues', '0.0 1.0');
        addLoc(feFuncB, file, 16, 12, 670);
        addLoc(feComponentTransfer, file, 13, 10, 496);
      },

      m: function mount(target, anchor) {
        insert(target, feComponentTransfer, anchor);
        append(feComponentTransfer, feFuncR);
        append(feComponentTransfer, feFuncG);
        append(feComponentTransfer, feFuncB);
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(feComponentTransfer);
        }
      },
    };
  }

  function Printer(options) {
    this._debugName = '<Printer>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data(), options.data);

    this._recompute({ state: 1 }, this._state);
    if (!('state' in this._state))
      console.warn(
        "<Printer> was created without expected data property 'state'",
      );

    if (!('usingDithering' in this._state))
      console.warn(
        "<Printer> was created without expected data property 'usingDithering'",
      );
    if (!('content' in this._state))
      console.warn(
        "<Printer> was created without expected data property 'content'",
      );
    this._intro = true;

    if (!document.getElementById('svelte-yzaep6-style')) add_css();

    this._fragment = create_main_fragment(this, this._state);

    this.root._oncreate.push(() => {
      oncreate.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Printer.prototype, protoDev);
  assign$1(Printer.prototype, methods);

  Printer.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('printerClass' in newState && !this._updatingReadonlyProperty)
      throw new Error(
        "<Printer>: Cannot set read-only property 'printerClass'",
      );
  };

  Printer.prototype._recompute = function _recompute(changed, state) {
    if (changed.state) {
      if (
        this._differs(
          state.printerClass,
          (state.printerClass = printerClass(state)),
        )
      )
        changed.printerClass = true;
    }
  };

  var DEFAULT_GROUP_NAME = 'default';
  var getBaseDriver = function() {
    var defaultGroup = {};
    var groups = {
      default: defaultGroup,
    };
    var currentGroupName = DEFAULT_GROUP_NAME;
    var currentGroup = defaultGroup;

    var isSlotFilled = function isSlotFilled(signal, callback) {
      var callbackList = currentGroup[signal];
      return (
        callbackList &&
        callbackList.length &&
        callbackList.indexOf(callback) > -1
      );
    };

    return {
      getGroups: function getGroups() {
        return groups;
      },
      group: function group(groupName) {
        currentGroupName = groupName;

        if (groups[groupName]) {
          currentGroup = groups[groupName];
        } else {
          currentGroup = {};
          groups[groupName] = currentGroup;
        }

        return this;
      },
      endGroup: function endGroup() {
        currentGroup = defaultGroup;
        currentGroupName = DEFAULT_GROUP_NAME;
        return this;
      },
      fire: function fire(signal) {
        for (
          var _len = arguments.length,
            args = new Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        this[signal].apply(this, args);
      },

      /** Connect a callback to a slot */
      on: function on(signal, callback) {
        if (typeof callback === 'function') {
          if (!currentGroup[signal]) {
            currentGroup[signal] = [];
          }

          currentGroup[signal].push(callback);
          this[signal].connect(callback);
        }

        return this;
      },

      /** Disconnect a callback from a slot */
      off: function off(signal, callback) {
        var group = currentGroup;
        /** If no callback passed, disconnect all slots from the signal */

        if (typeof callback === 'undefined') {
          for (var i = group[signal].length; i--; ) {
            this[signal].disconnect(group[signal][i]);
          }

          delete group[signal];
        } else {
          var slotIndex = group[signal].findIndex(function(slotCallback) {
            return slotCallback === callback;
          });

          if (slotIndex > -1) {
            this[signal].disconnect(group[signal][slotIndex]);
            group[signal].splice(slotIndex, 1);
            /** Delete the signal slot list if it's empty */

            if (group[signal].length === 0) {
              delete group[signal];
            }
          } else {
            console.warn(
              '[@mamba/pos/driver] Tried to disconnect from "' +
                signal +
                '" a non-connected slot (group: ' +
                currentGroupName +
                ').',
            );
          }
        }
        /** If the current signal group is empty, let's delete it */

        if (currentGroup !== defaultGroup && Object.keys(group).length === 0) {
          delete groups[currentGroupName];
          this.endGroup();
        }

        return this;
      },

      /** Allow only a unique callback on a specific slot */
      unique: function unique(signal, callback) {
        if (isSlotFilled(signal, callback)) {
          this.off(signal, callback);
        }

        return this.on(signal, callback);
      },

      /** Execute once a callback when the signal is dispatched and disconnect from it */
      once: function once(signal, callback) {
        return this.race([[signal, callback]]);
      },

      /** The first signal dispatched is executed and automatically cancel all others */
      race: function race(entries) {
        var _this = this;

        var wrappedCallbacks = {};
        entries.forEach(function(_ref) {
          var signal = _ref[0],
            callback = _ref[1];

          {
            console.log("Connecting once '" + signal + "'");
          }
          /** If the signal's slot is already filled with a callback, disconnect it */

          if (isSlotFilled(signal, callback)) {
            _this.off(signal, callback);
          }
          /**
           * Wrap the signal callback to disconnect all slots once one of the signals are emitted
           * If the return of a callback is "false", it doesn't unlisten automatically
           */

          wrappedCallbacks[signal] = function() {
            var result = callback.apply(void 0, arguments);

            if (result !== false) {
              Object.keys(wrappedCallbacks).forEach(function(signalName) {
                {
                  console.log("Removing '" + signalName + "'");
                }

                _this.off(signalName, wrappedCallbacks[signalName]);
              });
            }
          };
          /** Listen to the signal emission */

          _this.on(signal, wrappedCallbacks[signal]);
        });
        return this;
      },

      /** Destroy all signal listeners from a specified group */
      destroyGroup: function destroyGroup(groupName) {
        var _this2 = this;

        if (groupName === void 0) {
          groupName = 'default';
        }

        if (!groups[groupName]) {
          console.error(
            "[@mamba/pos/driver] Trying to destroy non existing group: '" +
              groupName +
              "'",
          );
          return;
        }

        this.group(groupName);
        var groupSignals = Object.keys(groups[groupName]);

        {
          console.log(
            'Destroying signal group: "' +
              groupName +
              '".\nDisconnecting slots from: "' +
              groupSignals.join('", "') +
              '"',
          );
        }

        groupSignals.forEach(function(signal) {
          return _this2.off(signal);
        });
        this.endGroup();
      },

      /** Destroy all signal listeners from all groups */
      destroy: function destroy() {
        var _this3 = this;

        Object.keys(groups).forEach(function(group) {
          return _this3.destroyGroup(group);
        });
      },
    };
  };

  /** Used to extend a driver with the base driver */

  function extendDriver(driver) {
    if (typeof driver === 'undefined') {
      throw new Error('[@mamba/pos] Could not find the loaded driver.');
    }

    for (
      var _len = arguments.length,
        modifiers = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      modifiers[_key - 1] = arguments[_key];
    }

    return extend.apply(void 0, [driver].concat(modifiers, [getBaseDriver()]));
  }

  /**
   * KeyCode <-> KeyName dictionary
   */
  var KEYMAP = Object.freeze({
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
    57: '9',
  });
  function wrappers(driver) {
    /**
     * Get the key code relative to a specific key name
     * @memberof Keyboard
     * @param {string} keyName - Key name
     * @returns {number} - Relative key code
     */
    driver.getKeyCode = function(keyName) {
      var keyCode = Object.keys(KEYMAP).find(function(code) {
        return KEYMAP[code] === keyName;
      });
      return keyCode ? Number.parseInt(keyCode, 10) : null;
    };
    /**
     * Get the key name relative to a specific key code
     * @memberof Keyboard
     * @param {number} keyCode - Key code
     * @returns {string} - Relative key name
     */

    driver.getKeyName = function(keyCode) {
      return KEYMAP[keyCode];
    };
    /**
     * Check if a certain key is a numeric key
     * @memberof Keyboard
     * @param {number} keyCode - Key code
     * @returns {boolean}
     */

    driver.isNumericKey = function(keyCode) {
      return !Number.isNaN(parseFloat(KEYMAP[keyCode]));
    };
    /**
     * Check if a certain key is an action key
     * @memberof Keyboard
     * @param {number} keyCode - Key code
     * @returns {boolean}
     */

    driver.isActionKey = function(keyCode) {
      return !driver.isNumericKey(keyCode);
    };
    /**
     * Define if backspace button should be enabled
     */

    var _isBackspaceEnabled = true;
    /**
     * Return if the backspace button is enabled
     * @memberof Keyboard
     * @returns {boolean}
     */

    driver.isBackspaceEnabled = function() {
      return _isBackspaceEnabled;
    };
    /**
     * Switch OFF the `isBackspaceEnabled` flag used by the front-end
     * @memberof Keyboard
     */

    driver.disableBackspace = function() {
      _isBackspaceEnabled = false;
    };
    /**
     * Switch ON the `isBackspaceEnabled` flag used by the front-end
     * @memberof Keyboard
     */

    driver.enableBackspace = function() {
      _isBackspaceEnabled = true;
    };
  }

  var Keyboard = extendDriver(window.$Keyboard, wrappers);

  /* packages/pos/simulator/view/pos/hardware/Keypad.html generated by Svelte v2.16.1 */

  const getKeyboardEvent = (event, code, keyName) =>
    new KeyboardEvent(event, {
      bubbles: true,
      cancelable: true,
      key: keyName,
      charCode: code,
      keyCode: code,
      which: code,
    });

  var methods$1 = {
    dispatchKey({ event, keyName }) {
      /** Prevent the button from being focused */
      event.preventDefault();
      event.stopImmediatePropagation();
      const el = document.activeElement;
      const isInputOnFocus =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
      const keyCode = Keyboard.getKeyCode(keyName);

      /** We have to handle input actions manually */
      if (isInputOnFocus) {
        /** If action button clicked */
        if (Keyboard.isActionKey(keyCode)) {
          /** The actual 'back' is handled by that 'handleKeyUp' method */
          if (keyName === 'back') {
            el.value = el.value.slice(0, -1);
          }
          /** If numeric button clicked */
        } else if (el.maxLength < 0 || el.value.length + 1 <= el.maxLength) {
          el.value += keyName;
        }
      }

      el.dispatchEvent(getKeyboardEvent('keydown', keyCode, keyName));
      el.dispatchEvent(getKeyboardEvent('keypress', keyCode, keyName));
      if (isInputOnFocus) {
        el.dispatchEvent(getKeyboardEvent('input', keyCode, keyName));
      }
      el.dispatchEvent(getKeyboardEvent('keyup', keyCode, keyName));
    },
  };

  const file$1 = 'packages/pos/simulator/view/pos/hardware/Keypad.html';

  function add_css$1() {
    var style = createElement('style');
    style.id = 'svelte-iemscg-style';
    style.textContent =
      '.keypad.svelte-iemscg{position:absolute;width:292px;height:158px;bottom:20px;left:18px}button.svelte-iemscg{position:absolute;width:62px;height:30px;border:0;-webkit-appearance:none;appearance:none;cursor:pointer;background:none;border-radius:8px;color:transparent;font-weight:bold;font-size:18px;-webkit-transition:0.2s ease;transition:0.2s ease}button.svelte-iemscg:hover{color:white;background-color:rgba(22, 22, 22, 0.9);border:2px solid white}button.svelte-iemscg:active{-webkit-transform:scale(0.95);transform:scale(0.95)}.shortcuts.svelte-iemscg{font-size:10px}.help.svelte-iemscg{border-bottom-left-radius:35px}.close.svelte-iemscg,.back.svelte-iemscg,.enter.svelte-iemscg{left:219px}.enter.svelte-iemscg{height:64px;border-bottom-right-radius:30px}.key-1.svelte-iemscg,.key-4.svelte-iemscg,.key-7.svelte-iemscg,.help.svelte-iemscg{left:14px}.key-2.svelte-iemscg,.key-5.svelte-iemscg,.key-8.svelte-iemscg,.key-0.svelte-iemscg{left:82px}.key-3.svelte-iemscg,.key-6.svelte-iemscg,.key-9.svelte-iemscg,.shortcuts.svelte-iemscg{left:150px}.key-1.svelte-iemscg,.key-2.svelte-iemscg,.key-3.svelte-iemscg,.close.svelte-iemscg{bottom:118px}.key-4.svelte-iemscg,.key-5.svelte-iemscg,.key-6.svelte-iemscg,.back.svelte-iemscg{bottom:82px}.key-7.svelte-iemscg,.key-8.svelte-iemscg,.key-9.svelte-iemscg{bottom:47px}.key-0.svelte-iemscg,.shortcuts.svelte-iemscg,.help.svelte-iemscg,.enter.svelte-iemscg{bottom:12px}@media(max-width: 400px){.keypad.svelte-iemscg{display:none\n  }}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5cGFkLmh0bWwiLCJzb3VyY2VzIjpbIktleXBhZC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxkaXYgY2xhc3M9XCJrZXlwYWRcIj5cbiAgPGJ1dHRvbiBjbGFzcz1cImtleS0xXCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJzEnfSlcIj4xPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJrZXktMlwiIG9uOm1vdXNlZG93bj1cImRpc3BhdGNoS2V5KHsgZXZlbnQsIGtleU5hbWU6ICcyJ30pXCI+MjwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwia2V5LTNcIiBvbjptb3VzZWRvd249XCJkaXNwYXRjaEtleSh7IGV2ZW50LCBrZXlOYW1lOiAnMyd9KVwiPjM8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImtleS00XCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJzQnfSlcIj40PC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJrZXktNVwiIG9uOm1vdXNlZG93bj1cImRpc3BhdGNoS2V5KHsgZXZlbnQsIGtleU5hbWU6ICc1J30pXCI+NTwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwia2V5LTZcIiBvbjptb3VzZWRvd249XCJkaXNwYXRjaEtleSh7IGV2ZW50LCBrZXlOYW1lOiAnNid9KVwiPjY8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImtleS03XCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJzcnfSlcIj43PC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJrZXktOFwiIG9uOm1vdXNlZG93bj1cImRpc3BhdGNoS2V5KHsgZXZlbnQsIGtleU5hbWU6ICc4J30pXCI+ODwvYnV0dG9uPlxuICA8YnV0dG9uIGNsYXNzPVwia2V5LTlcIiBvbjptb3VzZWRvd249XCJkaXNwYXRjaEtleSh7IGV2ZW50LCBrZXlOYW1lOiAnOSd9KVwiPjk8L2J1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImtleS0wXCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJzAnfSlcIj4wPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJiYWNrXCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJ2JhY2snfSlcIj5iYWNrPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJjbG9zZVwiIG9uOm1vdXNlZG93bj1cImRpc3BhdGNoS2V5KHsgZXZlbnQsIGtleU5hbWU6ICdjbG9zZSd9KVwiPmNsb3NlPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJlbnRlclwiIG9uOm1vdXNlZG93bj1cImRpc3BhdGNoS2V5KHsgZXZlbnQsIGtleU5hbWU6ICdlbnRlcid9KVwiPmVudGVyPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJzaG9ydGN1dHNcIiBvbjptb3VzZWRvd249XCJkaXNwYXRjaEtleSh7IGV2ZW50LCBrZXlOYW1lOiAnc2hvcnRjdXRzJ30pXCI+c2hvcnRjdXRzPC9idXR0b24+XG4gIDxidXR0b24gY2xhc3M9XCJoZWxwXCIgb246bW91c2Vkb3duPVwiZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZTogJ2hlbHAnfSlcIj5oZWxwPC9idXR0b24+XG48L2Rpdj5cblxuPHNjcmlwdD5cbiAgaW1wb3J0IEtleWJvYXJkIGZyb20gJy4uLy4uLy4uLy4uL2FwaS9rZXlib2FyZC5qcyc7XG5cbiAgY29uc3QgZ2V0S2V5Ym9hcmRFdmVudCA9IChldmVudCwgY29kZSwga2V5TmFtZSkgPT5cbiAgICBuZXcgS2V5Ym9hcmRFdmVudChldmVudCwge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgICBrZXk6IGtleU5hbWUsXG4gICAgICBjaGFyQ29kZTogY29kZSxcbiAgICAgIGtleUNvZGU6IGNvZGUsXG4gICAgICB3aGljaDogY29kZSxcbiAgICB9KTtcblxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbWV0aG9kczoge1xuICAgICAgZGlzcGF0Y2hLZXkoeyBldmVudCwga2V5TmFtZSB9KSB7XG4gICAgICAgIC8qKiBQcmV2ZW50IHRoZSBidXR0b24gZnJvbSBiZWluZyBmb2N1c2VkICovXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGlzSW5wdXRPbkZvY3VzID1cbiAgICAgICAgICBlbCAmJiAoZWwudGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCBlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnKTtcbiAgICAgICAgY29uc3Qga2V5Q29kZSA9IEtleWJvYXJkLmdldEtleUNvZGUoa2V5TmFtZSk7XG5cbiAgICAgICAgLyoqIFdlIGhhdmUgdG8gaGFuZGxlIGlucHV0IGFjdGlvbnMgbWFudWFsbHkgKi9cbiAgICAgICAgaWYgKGlzSW5wdXRPbkZvY3VzKSB7XG4gICAgICAgICAgLyoqIElmIGFjdGlvbiBidXR0b24gY2xpY2tlZCAqL1xuICAgICAgICAgIGlmIChLZXlib2FyZC5pc0FjdGlvbktleShrZXlDb2RlKSkge1xuICAgICAgICAgICAgLyoqIFRoZSBhY3R1YWwgJ2JhY2snIGlzIGhhbmRsZWQgYnkgdGhhdCAnaGFuZGxlS2V5VXAnIG1ldGhvZCAqL1xuICAgICAgICAgICAgaWYgKGtleU5hbWUgPT09ICdiYWNrJykge1xuICAgICAgICAgICAgICBlbC52YWx1ZSA9IGVsLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKiBJZiBudW1lcmljIGJ1dHRvbiBjbGlja2VkICovXG4gICAgICAgICAgfSBlbHNlIGlmIChlbC5tYXhMZW5ndGggPCAwIHx8IGVsLnZhbHVlLmxlbmd0aCArIDEgPD0gZWwubWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICBlbC52YWx1ZSArPSBrZXlOYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQoZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIGtleUNvZGUsIGtleU5hbWUpKTtcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycsIGtleUNvZGUsIGtleU5hbWUpKTtcbiAgICAgICAgaWYgKGlzSW5wdXRPbkZvY3VzKSB7XG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChnZXRLZXlib2FyZEV2ZW50KCdpbnB1dCcsIGtleUNvZGUsIGtleU5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJywga2V5Q29kZSwga2V5TmFtZSkpO1xuICAgICAgfSxcbiAgICB9LFxuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiAtLS0gKi9cblxuLyoqIFJvdyBjb21wb25lbnQgKi9cblxuLyoqIElucHV0IGNvbXBvbmVudCAqL1xuXG4vKiogRGlhbG9nIGNvbXBvbmVudCAqL1xuXG4vKiogQWRtaW5Mb2NrIGNvbXBvbmVudCAqL1xuXG4vKiBUYWJzIGNvbXBvbmVudCAqL1xuXG4ua2V5cGFkIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDI5MnB4O1xuICAgIGhlaWdodDogMTU4cHg7XG4gICAgYm90dG9tOiAyMHB4O1xuICAgIGxlZnQ6IDE4cHg7XG4gIH1cblxuYnV0dG9uIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDYycHg7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICAgIGJvcmRlcjogMDtcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgZm9udC1zaXplOiAxOHB4O1xuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4ycyBlYXNlO1xuICAgIHRyYW5zaXRpb246IDAuMnMgZWFzZTtcbiAgfVxuXG5idXR0b246aG92ZXIge1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDIyLCAyMiwgMjIsIDAuOSk7XG4gICAgYm9yZGVyOiAycHggc29saWQgd2hpdGU7XG4gIH1cblxuYnV0dG9uOmFjdGl2ZSB7XG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDAuOTUpO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KTtcbiAgfVxuXG4uc2hvcnRjdXRzIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cblxuLmhlbHAge1xuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDM1cHg7XG4gIH1cblxuLmNsb3NlLFxuICAuYmFjayxcbiAgLmVudGVyIHtcbiAgICBsZWZ0OiAyMTlweDtcbiAgfVxuXG4uZW50ZXIge1xuICAgIGhlaWdodDogNjRweDtcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMzBweDtcbiAgfVxuXG4ua2V5LTEsXG4gIC5rZXktNCxcbiAgLmtleS03LFxuICAuaGVscCB7XG4gICAgbGVmdDogMTRweDtcbiAgfVxuXG4ua2V5LTIsXG4gIC5rZXktNSxcbiAgLmtleS04LFxuICAua2V5LTAge1xuICAgIGxlZnQ6IDgycHg7XG4gIH1cblxuLmtleS0zLFxuICAua2V5LTYsXG4gIC5rZXktOSxcbiAgLnNob3J0Y3V0cyB7XG4gICAgbGVmdDogMTUwcHg7XG4gIH1cblxuLmtleS0xLFxuICAua2V5LTIsXG4gIC5rZXktMyxcbiAgLmNsb3NlIHtcbiAgICBib3R0b206IDExOHB4O1xuICB9XG5cbi5rZXktNCxcbiAgLmtleS01LFxuICAua2V5LTYsXG4gIC5iYWNrIHtcbiAgICBib3R0b206IDgycHg7XG4gIH1cblxuLmtleS03LFxuICAua2V5LTgsXG4gIC5rZXktOSB7XG4gICAgYm90dG9tOiA0N3B4O1xuICB9XG5cbi5rZXktMCxcbiAgLnNob3J0Y3V0cyxcbiAgLmhlbHAsXG4gIC5lbnRlciB7XG4gICAgYm90dG9tOiAxMnB4O1xuICB9XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0MDBweCkge1xuXG4ua2V5cGFkIHtcbiAgICAgIGRpc3BsYXk6IG5vbmVcbiAgfVxuICAgIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwzQnZjeTl6YVcxMWJHRjBiM0l2ZG1sbGR5OXdiM012YUdGeVpIZGhjbVV2UzJWNWNHRmtMbWgwYld3aVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQmRVSkJMRkZCUVZFN08wRkRhRUpTTEcxQ1FVRnRRanM3UVVGVGJrSXNjVUpCUVhGQ096dEJRVTF5UWl4elFrRkJjMEk3TzBGQlRYUkNMSGxDUVVGNVFqczdRVUZsZWtJc2JVSkJRVzFDT3p0QlF6RkRha0k3U1VGRFJTeHJRa0ZCYTBJN1NVRkRiRUlzV1VGQldUdEpRVU5hTEdGQlFXRTdTVUZEWWl4WlFVRlpPMGxCUTFvc1ZVRkJWVHRGUVV0YU96dEJRVVZCTzBsQlEwVXNhMEpCUVd0Q08wbEJRMnhDTEZkQlFWYzdTVUZEV0N4WlFVRlpPMGxCUTFvc1UwRkJVenRKUVVOVUxIZENRVUZuUWp0WlFVRm9RaXhuUWtGQlowSTdTVUZEYUVJc1pVRkJaVHRKUVVObUxHZENRVUZuUWp0SlFVTm9RaXhyUWtGQmEwSTdTVUZEYkVJc2EwSkJRV3RDTzBsQlEyeENMR2xDUVVGcFFqdEpRVU5xUWl4bFFVRmxPMGxCUTJZc05rSkJRWEZDTzBsQlFYSkNMSEZDUVVGeFFqdEZRVU4yUWpzN1FVRkZRVHRKUVVORkxGbEJRVms3U1VGRFdpeDFRMEZCZFVNN1NVRkRka01zZFVKQlFYVkNPMFZCUTNwQ096dEJRVVZCTzBsQlEwVXNPRUpCUVhOQ08xbEJRWFJDTEhOQ1FVRnpRanRGUVVONFFqczdRVUZGUVR0SlFVTkZMR1ZCUVdVN1JVRkRha0k3TzBGQlJVRTdTVUZEUlN3clFrRkJLMEk3UlVGRGFrTTdPMEZCUlVFN096dEpRVWRGTEZkQlFWYzdSVUZEWWpzN1FVRkZRVHRKUVVORkxGbEJRVms3U1VGRFdpeG5RMEZCWjBNN1JVRkRiRU03TzBGQlJVRTdPenM3U1VGSlJTeFZRVUZWTzBWQlExbzdPMEZCUlVFN096czdTVUZKUlN4VlFVRlZPMFZCUTFvN08wRkJSVUU3T3pzN1NVRkpSU3hYUVVGWE8wVkJRMkk3TzBGQlJVRTdPenM3U1VGSlJTeGhRVUZoTzBWQlEyWTdPMEZCUlVFN096czdTVUZKUlN4WlFVRlpPMFZCUTJRN08wRkJSVUU3T3p0SlFVZEZMRmxCUVZrN1JVRkRaRHM3UVVGRlFUczdPenRKUVVsRkxGbEJRVms3UlVGRFpEczdRVUV2UmtVN08wRkJVRVk3VFVGUlNUdEZRVVZLTzBsQlJFVWlMQ0ptYVd4bElqb2ljR0ZqYTJGblpYTXZjRzl6TDNOcGJYVnNZWFJ2Y2k5MmFXVjNMM0J2Y3k5b1lYSmtkMkZ5WlM5TFpYbHdZV1F1YUhSdGJDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaVJpYkdGamF6b2dJekF3TUR0Y2JseHVKSGRvYVhSbE9pQWpabVptTzF4dUpITmxZWE5vWld4c09pQWpaakZtTVdZeE8xeHVYRzRrYzNSdmJtVXRaM0psWlc0NklDTTBabUl6TkRFN1hHNGtjM1J2Ym1VdFozSmxaVzR0WkdGeWF6b2dJekUxTXpVeU1qdGNiaVJ6ZEc5dVpTMW5jbVZsYmkxc2FXZG9kRG9nSTJFMlpHWTRZenRjYmx4dUpHZHlZWGt0WkdGeWEyVnlPaUFqTXpVek5UTTFPMXh1SkdkeVlYa3RaR0Z5YXpvZ0l6UXlOVGsyTXp0Y2JpUm5jbUY1T2lBak4yVTNaVGRsTzF4dUpHZHlZWGt0YkdsbmFIUTZJQ05pTldJMVlqVTdYRzRrWjNKaGVTMXNhV2RvZEdWeU9pQWpaVE5sTm1VM08xeHVKR2R5WVhrdGJHbG5hSFJsYzNRNklDTm1NV1l5WmpNN1hHNWNiaVJ6YVd4MlpYSTZJQ05pWVdJNVlqazdYRzRrYzJsc2RtVnlMV3hwWjJoME9pQWpaR05rWTJSak8xeHVYRzRrY21Wa09pQWpabVl4WVRGaE8xeHVKSEpsWkMxa1lYSnJPaUFqWkRVd01EQXdPMXh1SkhKbFpDMXNhV2RvZERvZ0kyVTROV0kxWWp0Y2JseHVMeW9nTFMwdElDb3ZYRzVjYmlSaWJIVmxPaUFqTWpFNU5tWXpPMXh1SkdKc2RXVXRaR0Z5YXpvZ0l6RTFOalZqTUR0Y2JseHVKR0pzZFdVdFozSmhlUzFzYVdkb2REb2dJemt3WVRSaFpUdGNiaVJpYkhWbExXZHlZWGs2SUNNMk1EZGtPR0k3WEc0a1lteDFaUzFuY21GNUxXUmhjbXM2SUNNME5UVmhOalE3WEc1Y2JpUm5jbVZsYmpvZ0l6UmxZbVl4WVR0Y2JpUm5jbVZoYmkxc2FXZG9kRG9nSXpSallXWTFNRHRjYmlSbmNtVmxiaTFrWVhKck9pQWpNMlJoTVRCbU8xeHVKR2R5WldWdUxYQmhlVzFsYm5RNklDTTBNams0TkRFN1hHNWNiaVJ3ZFhKd2JHVTZJQ05oWWpRM1ltTTdYRzRrY0hWeWNHeGxMV1JoY21zNklDTTNPVEJsT0dJN1hHNGtjSFZ5Y0d4bExXeHBaMmgwT2lBalpHWTNPR1ZtTzF4dVhHNGtkR1ZoYkRvZ0l6RTVaVE5pTVR0Y2JpUjBaV0ZzTFdSaGNtczZJQ013TUdGbU9UZzdYRzVjYmlSNVpXeHNiM2M2SUNObU9XRTRNalU3WEc0a2VXVnNiRzkzTFdSaGNtczZJQ05tTlRkbU1UYzdYRzRpTENKQWFXMXdiM0owSUNkamIyeHZjbk11Y0dOemN5YzdYRzVjYmlSa1pXWmhkV3gwTFhSbGVIUXRZMjlzYjNJNklDUm5jbUY1TFdSaGNtdGxjanRjYmlSa1pXWmhkV3gwTFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmx4dUpHRndjQzFpWnkxamIyeHZjam9nSkdkeVlYa3RiR2xuYUhSbGNqdGNibHh1THlvcUlGSnZkeUJqYjIxd2IyNWxiblFnS2k5Y2JpUnliM2N0Y0dGa1pHbHVaem9nTVRKd2VDQXhOWEI0TzF4dUpISnZkeTEwYjNBdGFHVnBaMmgwT2lCaGRYUnZPMXh1SkhKdmR5MWliM0prWlhJdFkyOXNiM0k2SUNSbmNtRjVMV3hwWjJoMFpYSTdYRzRrY205M0xXSm5MV052Ykc5eU9pQWtkMmhwZEdVN1hHNGtjbTkzTFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXRsY2p0Y2JpUnliM2N0YzJWamIyNWtZWEo1TFdOdmJHOXlPaUFrWjNKaGVUdGNiaVJ5YjNjdFptOXVkQzF6YVhwbE9pQXhOSEI0TzF4dVhHNHZLaW9nU1c1d2RYUWdZMjl0Y0c5dVpXNTBJQ292WEc0a2FXNXdkWFF0WW05eVpHVnlMV052Ykc5eU9pQWtaM0poZVMxc2FXZG9kR1Z5TzF4dUpHbHVjSFYwTFdadlkzVnpMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pITjBiMjVsTFdkeVpXVnVPMXh1SkdsdWNIVjBMV2x1ZG1Gc2FXUXRZbTl5WkdWeUxXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR2x1Y0hWMExXVnljbTl5TFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dVhHNHZLaW9nUkdsaGJHOW5JR052YlhCdmJtVnVkQ0FxTDF4dUpHUnBZV3h2WnkxdVpXZGhkR2wyWlMxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUmthV0ZzYjJjdGNHOXphWFJwZG1VdFkyOXNiM0k2SUNSemRHOXVaUzFuY21WbGJqdGNiaVJrYVdGc2IyY3RZMjl1Wm1seWJXRjBhVzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXM3WEc0a1pHbGhiRzluTFdOdmJtWnBjbTFoZEdsdmJpMTBaWGgwTFdOdmJHOXlPaUFrZDJocGRHVTdYRzVjYmk4cUtpQkJaRzFwYmt4dlkyc2dZMjl0Y0c5dVpXNTBJQ292WEc0a1lXUnRhVzVzYjJOckxXNWxaMkYwYVhabExXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR0ZrYldsdWJHOWpheTEwWlhoMExXTnZiRzl5T2lBa1ozSmhlUzFrWVhKck8xeHVKR0ZrYldsdWJHOWpheTFpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWmpCbU1HWXdPMXh1WEc0a1luVjBkRzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVJpZFhSMGIyNHRkR1Y0ZEMxamIyeHZjam9nSkhkb2FYUmxPMXh1WEc0a2MzZHBkR05vTFhWdVkyaGxZMnRsWkMxaVp6b2dKSE5wYkhabGNqdGNiaVJ6ZDJsMFkyZ3RkVzVqYUdWamEyVmtMV052Ykc5eU9pQWtjMlZoYzJobGJHdzdYRzRrYzNkcGRHTm9MV05vWldOclpXUXRZbWM2SUNSemRHOXVaUzFuY21WbGJpMXNhV2RvZER0Y2JpUnpkMmwwWTJndFkyaGxZMnRsWkMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhOM2FYUmphQzFrYVhOaFlteGxaQzFpWnpvZ0pITnBiSFpsY2kxc2FXZG9kRHRjYmlSemQybDBZMmd0WkdsellXSnNaV1F0WTI5c2IzSTZJQ1J6YVd4MlpYSTdYRzVjYmk4cUlGUmhZbk1nWTI5dGNHOXVaVzUwSUNvdlhHNGtkR0ZpTFc1aGRtbG5ZWFJwYjI0dFltYzZJQ05tTW1ZeVpqSTdYRzRrZEdGaUxXeGhZbVZzTFdOdmJHOXlPaUFqTmpVM056ZG1PMXh1SkhSaFlpMXBkR1Z0TFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmlSMFlXSXRiR2x1WlMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhSaFlpMW9aV2xuYUhRNklEUXdjSGc3WEc0aUxDSmNiaUFnTG10bGVYQmhaQ0I3WEc0Z0lDQWdjRzl6YVhScGIyNDZJR0ZpYzI5c2RYUmxPMXh1SUNBZ0lIZHBaSFJvT2lBeU9USndlRHRjYmlBZ0lDQm9aV2xuYUhRNklERTFPSEI0TzF4dUlDQWdJR0p2ZEhSdmJUb2dNakJ3ZUR0Y2JpQWdJQ0JzWldaME9pQXhPSEI0TzF4dVhHNGdJQ0FnUUcxbFpHbGhJQ2h0WVhndGQybGtkR2c2SURRd01IQjRLU0I3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUJ1YjI1bE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lHSjFkSFJ2YmlCN1hHNGdJQ0FnY0c5emFYUnBiMjQ2SUdGaWMyOXNkWFJsTzF4dUlDQWdJSGRwWkhSb09pQTJNbkI0TzF4dUlDQWdJR2hsYVdkb2REb2dNekJ3ZUR0Y2JpQWdJQ0JpYjNKa1pYSTZJREE3WEc0Z0lDQWdZWEJ3WldGeVlXNWpaVG9nYm05dVpUdGNiaUFnSUNCamRYSnpiM0k2SUhCdmFXNTBaWEk3WEc0Z0lDQWdZbUZqYTJkeWIzVnVaRG9nYm05dVpUdGNiaUFnSUNCaWIzSmtaWEl0Y21Ga2FYVnpPaUE0Y0hnN1hHNGdJQ0FnWTI5c2IzSTZJSFJ5WVc1emNHRnlaVzUwTzF4dUlDQWdJR1p2Ym5RdGQyVnBaMmgwT2lCaWIyeGtPMXh1SUNBZ0lHWnZiblF0YzJsNlpUb2dNVGh3ZUR0Y2JpQWdJQ0IwY21GdWMybDBhVzl1T2lBd0xqSnpJR1ZoYzJVN1hHNGdJSDFjYmx4dUlDQmlkWFIwYjI0NmFHOTJaWElnZTF4dUlDQWdJR052Ykc5eU9pQjNhR2wwWlR0Y2JpQWdJQ0JpWVdOclozSnZkVzVrTFdOdmJHOXlPaUJ5WjJKaEtESXlMQ0F5TWl3Z01qSXNJREF1T1NrN1hHNGdJQ0FnWW05eVpHVnlPaUF5Y0hnZ2MyOXNhV1FnZDJocGRHVTdYRzRnSUgxY2JseHVJQ0JpZFhSMGIyNDZZV04wYVhabElIdGNiaUFnSUNCMGNtRnVjMlp2Y20wNklITmpZV3hsS0RBdU9UVXBPMXh1SUNCOVhHNWNiaUFnTG5Ob2IzSjBZM1YwY3lCN1hHNGdJQ0FnWm05dWRDMXphWHBsT2lBeE1IQjRPMXh1SUNCOVhHNWNiaUFnTG1obGJIQWdlMXh1SUNBZ0lHSnZjbVJsY2kxaWIzUjBiMjB0YkdWbWRDMXlZV1JwZFhNNklETTFjSGc3WEc0Z0lIMWNibHh1SUNBdVkyeHZjMlVzWEc0Z0lDNWlZV05yTEZ4dUlDQXVaVzUwWlhJZ2UxeHVJQ0FnSUd4bFpuUTZJREl4T1hCNE8xeHVJQ0I5WEc1Y2JpQWdMbVZ1ZEdWeUlIdGNiaUFnSUNCb1pXbG5hSFE2SURZMGNIZzdYRzRnSUNBZ1ltOXlaR1Z5TFdKdmRIUnZiUzF5YVdkb2RDMXlZV1JwZFhNNklETXdjSGc3WEc0Z0lIMWNibHh1SUNBdWEyVjVMVEVzWEc0Z0lDNXJaWGt0TkN4Y2JpQWdMbXRsZVMwM0xGeHVJQ0F1YUdWc2NDQjdYRzRnSUNBZ2JHVm1kRG9nTVRSd2VEdGNiaUFnZlZ4dVhHNGdJQzVyWlhrdE1peGNiaUFnTG10bGVTMDFMRnh1SUNBdWEyVjVMVGdzWEc0Z0lDNXJaWGt0TUNCN1hHNGdJQ0FnYkdWbWREb2dPREp3ZUR0Y2JpQWdmVnh1WEc0Z0lDNXJaWGt0TXl4Y2JpQWdMbXRsZVMwMkxGeHVJQ0F1YTJWNUxUa3NYRzRnSUM1emFHOXlkR04xZEhNZ2UxeHVJQ0FnSUd4bFpuUTZJREUxTUhCNE8xeHVJQ0I5WEc1Y2JpQWdMbXRsZVMweExGeHVJQ0F1YTJWNUxUSXNYRzRnSUM1clpYa3RNeXhjYmlBZ0xtTnNiM05sSUh0Y2JpQWdJQ0JpYjNSMGIyMDZJREV4T0hCNE8xeHVJQ0I5WEc1Y2JpQWdMbXRsZVMwMExGeHVJQ0F1YTJWNUxUVXNYRzRnSUM1clpYa3ROaXhjYmlBZ0xtSmhZMnNnZTF4dUlDQWdJR0p2ZEhSdmJUb2dPREp3ZUR0Y2JpQWdmVnh1WEc0Z0lDNXJaWGt0Tnl4Y2JpQWdMbXRsZVMwNExGeHVJQ0F1YTJWNUxUa2dlMXh1SUNBZ0lHSnZkSFJ2YlRvZ05EZHdlRHRjYmlBZ2ZWeHVYRzRnSUM1clpYa3RNQ3hjYmlBZ0xuTm9iM0owWTNWMGN5eGNiaUFnTG1obGJIQXNYRzRnSUM1bGJuUmxjaUI3WEc0Z0lDQWdZbTkwZEc5dE9pQXhNbkI0TzF4dUlDQjlYRzRpWFgwPSAqLzwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBK0VBLE9BQU8sY0FBQyxDQUFDLEFBQ0wsUUFBUSxDQUFFLFFBQVEsQ0FD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 */';
    append(document.head, style);
  }

  function create_main_fragment$1(component, ctx) {
    var div,
      button0,
      text1,
      button1,
      text3,
      button2,
      text5,
      button3,
      text7,
      button4,
      text9,
      button5,
      text11,
      button6,
      text13,
      button7,
      text15,
      button8,
      text17,
      button9,
      text19,
      button10,
      text21,
      button11,
      text23,
      button12,
      text25,
      button13,
      text27,
      button14;

    function mousedown_handler(event) {
      component.dispatchKey({ event, keyName: '1' });
    }

    function mousedown_handler_1(event) {
      component.dispatchKey({ event, keyName: '2' });
    }

    function mousedown_handler_2(event) {
      component.dispatchKey({ event, keyName: '3' });
    }

    function mousedown_handler_3(event) {
      component.dispatchKey({ event, keyName: '4' });
    }

    function mousedown_handler_4(event) {
      component.dispatchKey({ event, keyName: '5' });
    }

    function mousedown_handler_5(event) {
      component.dispatchKey({ event, keyName: '6' });
    }

    function mousedown_handler_6(event) {
      component.dispatchKey({ event, keyName: '7' });
    }

    function mousedown_handler_7(event) {
      component.dispatchKey({ event, keyName: '8' });
    }

    function mousedown_handler_8(event) {
      component.dispatchKey({ event, keyName: '9' });
    }

    function mousedown_handler_9(event) {
      component.dispatchKey({ event, keyName: '0' });
    }

    function mousedown_handler_10(event) {
      component.dispatchKey({ event, keyName: 'back' });
    }

    function mousedown_handler_11(event) {
      component.dispatchKey({ event, keyName: 'close' });
    }

    function mousedown_handler_12(event) {
      component.dispatchKey({ event, keyName: 'enter' });
    }

    function mousedown_handler_13(event) {
      component.dispatchKey({ event, keyName: 'shortcuts' });
    }

    function mousedown_handler_14(event) {
      component.dispatchKey({ event, keyName: 'help' });
    }

    return {
      c: function create() {
        div = createElement('div');
        button0 = createElement('button');
        button0.textContent = '1';
        text1 = createText('\n  ');
        button1 = createElement('button');
        button1.textContent = '2';
        text3 = createText('\n  ');
        button2 = createElement('button');
        button2.textContent = '3';
        text5 = createText('\n  ');
        button3 = createElement('button');
        button3.textContent = '4';
        text7 = createText('\n  ');
        button4 = createElement('button');
        button4.textContent = '5';
        text9 = createText('\n  ');
        button5 = createElement('button');
        button5.textContent = '6';
        text11 = createText('\n  ');
        button6 = createElement('button');
        button6.textContent = '7';
        text13 = createText('\n  ');
        button7 = createElement('button');
        button7.textContent = '8';
        text15 = createText('\n  ');
        button8 = createElement('button');
        button8.textContent = '9';
        text17 = createText('\n  ');
        button9 = createElement('button');
        button9.textContent = '0';
        text19 = createText('\n  ');
        button10 = createElement('button');
        button10.textContent = 'back';
        text21 = createText('\n  ');
        button11 = createElement('button');
        button11.textContent = 'close';
        text23 = createText('\n  ');
        button12 = createElement('button');
        button12.textContent = 'enter';
        text25 = createText('\n  ');
        button13 = createElement('button');
        button13.textContent = 'shortcuts';
        text27 = createText('\n  ');
        button14 = createElement('button');
        button14.textContent = 'help';
        addListener(button0, 'mousedown', mousedown_handler);
        button0.className = 'key-1 svelte-iemscg';
        addLoc(button0, file$1, 1, 2, 23);
        addListener(button1, 'mousedown', mousedown_handler_1);
        button1.className = 'key-2 svelte-iemscg';
        addLoc(button1, file$1, 2, 2, 109);
        addListener(button2, 'mousedown', mousedown_handler_2);
        button2.className = 'key-3 svelte-iemscg';
        addLoc(button2, file$1, 3, 2, 195);
        addListener(button3, 'mousedown', mousedown_handler_3);
        button3.className = 'key-4 svelte-iemscg';
        addLoc(button3, file$1, 4, 2, 281);
        addListener(button4, 'mousedown', mousedown_handler_4);
        button4.className = 'key-5 svelte-iemscg';
        addLoc(button4, file$1, 5, 2, 367);
        addListener(button5, 'mousedown', mousedown_handler_5);
        button5.className = 'key-6 svelte-iemscg';
        addLoc(button5, file$1, 6, 2, 453);
        addListener(button6, 'mousedown', mousedown_handler_6);
        button6.className = 'key-7 svelte-iemscg';
        addLoc(button6, file$1, 7, 2, 539);
        addListener(button7, 'mousedown', mousedown_handler_7);
        button7.className = 'key-8 svelte-iemscg';
        addLoc(button7, file$1, 8, 2, 625);
        addListener(button8, 'mousedown', mousedown_handler_8);
        button8.className = 'key-9 svelte-iemscg';
        addLoc(button8, file$1, 9, 2, 711);
        addListener(button9, 'mousedown', mousedown_handler_9);
        button9.className = 'key-0 svelte-iemscg';
        addLoc(button9, file$1, 10, 2, 797);
        addListener(button10, 'mousedown', mousedown_handler_10);
        button10.className = 'back svelte-iemscg';
        addLoc(button10, file$1, 11, 2, 883);
        addListener(button11, 'mousedown', mousedown_handler_11);
        button11.className = 'close svelte-iemscg';
        addLoc(button11, file$1, 12, 2, 974);
        addListener(button12, 'mousedown', mousedown_handler_12);
        button12.className = 'enter svelte-iemscg';
        addLoc(button12, file$1, 13, 2, 1068);
        addListener(button13, 'mousedown', mousedown_handler_13);
        button13.className = 'shortcuts svelte-iemscg';
        addLoc(button13, file$1, 14, 2, 1162);
        addListener(button14, 'mousedown', mousedown_handler_14);
        button14.className = 'help svelte-iemscg';
        addLoc(button14, file$1, 15, 2, 1268);
        div.className = 'keypad svelte-iemscg';
        addLoc(div, file$1, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, button0);
        append(div, text1);
        append(div, button1);
        append(div, text3);
        append(div, button2);
        append(div, text5);
        append(div, button3);
        append(div, text7);
        append(div, button4);
        append(div, text9);
        append(div, button5);
        append(div, text11);
        append(div, button6);
        append(div, text13);
        append(div, button7);
        append(div, text15);
        append(div, button8);
        append(div, text17);
        append(div, button9);
        append(div, text19);
        append(div, button10);
        append(div, text21);
        append(div, button11);
        append(div, text23);
        append(div, button12);
        append(div, text25);
        append(div, button13);
        append(div, text27);
        append(div, button14);
      },

      p: noop,

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(button0, 'mousedown', mousedown_handler);
        removeListener(button1, 'mousedown', mousedown_handler_1);
        removeListener(button2, 'mousedown', mousedown_handler_2);
        removeListener(button3, 'mousedown', mousedown_handler_3);
        removeListener(button4, 'mousedown', mousedown_handler_4);
        removeListener(button5, 'mousedown', mousedown_handler_5);
        removeListener(button6, 'mousedown', mousedown_handler_6);
        removeListener(button7, 'mousedown', mousedown_handler_7);
        removeListener(button8, 'mousedown', mousedown_handler_8);
        removeListener(button9, 'mousedown', mousedown_handler_9);
        removeListener(button10, 'mousedown', mousedown_handler_10);
        removeListener(button11, 'mousedown', mousedown_handler_11);
        removeListener(button12, 'mousedown', mousedown_handler_12);
        removeListener(button13, 'mousedown', mousedown_handler_13);
        removeListener(button14, 'mousedown', mousedown_handler_14);
      },
    };
  }

  function Keypad(options) {
    this._debugName = '<Keypad>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1({}, options.data);
    this._intro = true;

    if (!document.getElementById('svelte-iemscg-style')) add_css$1();

    this._fragment = create_main_fragment$1(this, this._state);

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);
    }
  }

  assign$1(Keypad.prototype, protoDev);
  assign$1(Keypad.prototype, methods$1);

  Keypad.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/hardware/Screen.html generated by Svelte v2.16.1 */

  const { hours: initHours, minutes: initMinutes } = System.getCurrentTime();

  const rescale = (val, [minOld, maxOld], [minNew, maxNew]) =>
    ((maxNew - minNew) / (maxOld - minOld)) * (val - maxOld) + maxNew;

  function brightnessOpacity({ brightnessLevel }) {
    return 1 - rescale(brightnessLevel, [1, 10], [0.4, 1]);
  }

  function data$1() {
    return {
      brightnessLevel: 10,
      version: System.getVersion(),
      time: `${initHours}:${initMinutes}`,
    };
  }
  function oncreate$1() {
    if (localStorage) {
      const { ScreenBrightness } = Registry.persistent.get();
      if (ScreenBrightness && typeof ScreenBrightness.level !== 'undefined') {
        this.set({ brightnessLevel: ScreenBrightness.level });
      }
    }

    HardwareManager.on('changeBrightness', brightnessLevel => {
      this.set({ brightnessLevel });
    });

    /** Update the clock after each second */
    System.on('clock', (newHours, newMinutes) => {
      this.set({ time: `${newHours}:${newMinutes}` });
    });
  }
  const file$2 = 'packages/pos/simulator/view/pos/hardware/Screen.html';

  function add_css$2() {
    var style = createElement('style');
    style.id = 'svelte-bsw6by-style';
    style.textContent =
      '.screen.svelte-bsw6by,.content.svelte-bsw6by{height:100%}@media(max-width: 400px){.status-bar.svelte-bsw6by{display:none}body{background-color:#e3e6e7}.screen.svelte-bsw6by{height:100%;filter:url(#pos-color-map)}}@media(min-width: 401px){.screen.svelte-bsw6by{position:absolute;top:231px;left:50px;width:240px;height:320px;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-flow:column;overflow:hidden;filter:url(#pos-color-map)}@supports (-moz-appearance: none){.screen.svelte-bsw6by{filter:none\n    }}.content.svelte-bsw6by{height:100%;-webkit-box-flex:0;flex:0 1 auto;overflow:hidden}@supports (-webkit-appearance: none){.content.svelte-bsw6by{-webkit-transform:translateZ(0);transform:translateZ(0)}}.brightness.svelte-bsw6by{position:absolute;top:0;left:0;width:100%;height:100%;background-color:#000;z-index:100000;pointer-events:none;-webkit-transition:opacity 0.3s ease;transition:opacity 0.3s ease}.status-bar.svelte-bsw6by{position:relative;z-index:1002;width:100%;height:20px;-webkit-box-flex:0;flex:0 0 20px;background-color:#000;display:-webkit-box;display:flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:center;align-items:center;padding:0 4px;color:#fff;font-size:12px;font-weight:bold}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NyZWVuLmh0bWwiLCJzb3VyY2VzIjpbIlNjcmVlbi5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxkaXYgY2xhc3M9XCJzY3JlZW5cIj5cbiAgPGRpdiBjbGFzcz1cImJyaWdodG5lc3NcIiBzdHlsZT1cIm9wYWNpdHk6IHticmlnaHRuZXNzT3BhY2l0eX07XCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzdGF0dXMtYmFyXCI+XG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ2ZXJzaW9uXCI+e3ZlcnNpb259PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+e3RpbWV9PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxuICAgIDxzbG90Pjwvc2xvdD5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPCEtLSBTVkcgZmlsdGVyIGZvciBtYXBwaW5nIHRoZSBjb2xvcnMgc3VwcG9ydGVkIGJ5IHRoZSBQT1MgLS0+XG48c3ZnIHdpZHRoPVwiMFwiIGhlaWdodD1cIjBcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmVyc2lvbj1cIjEuMVwiIHN0eWxlPVwiZGlzcGxheTogYmxvY2s7XCI+XG4gIDxkZWZzPlxuICAgIDxmaWx0ZXIgaWQ9XCJwb3MtY29sb3ItbWFwXCIgeD1cIjAlXCIgeT1cIjAlXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxuICAgICAgPGZlQ29tcG9uZW50VHJhbnNmZXI+XG4gICAgICAgIDxmZUZ1bmNSIHR5cGU9XCJkaXNjcmV0ZVwiIHRhYmxlVmFsdWVzPVwiMC4wMDAwMCAwLjAzMTI1IDAuMDYyNTAgMC4wOTM3NSAwLjEyNTAwIDAuMTU2MjUgMC4xODc1MCAwLjIxODc1IDAuMjUwMDAgMC4yODEyNSAwLjMxMjUwIDAuMzQzNzUgMC4zNzUwMCAwLjQwNjI1IDAuNDM3NTAgMC40Njg3NSAwLjUwMDAwIDAuNTMxMjUgMC41NjI1MCAwLjU5Mzc1IDAuNjI1MDAgMC42NTYyNSAwLjY4NzUwIDAuNzE4NzUgMC43NTAwMCAwLjc4MTI1IDAuODEyNTAgMC44NDM3NSAwLjg3NTAwIDAuOTA2MjUgMC45Mzc1MCAwLjk2ODc1IDEuMDAwMDBcIj48L2ZlRnVuY1I+XG4gICAgICAgIDxmZUZ1bmNHIHR5cGU9XCJkaXNjcmV0ZVwiIHRhYmxlVmFsdWVzPVwiMC4wMDAwMDAgMC4wMTU2MjUgMC4wMzEyNTAgMC4wNDY4NzUgMC4wNjI1MDAgMC4wNzgxMjUgMC4wOTM3NTAgMC4xMDkzNzUgMC4xMjUwMDAgMC4xNDA2MjUgMC4xNTYyNTAgMC4xNzE4NzUgMC4xODc1MDAgMC4yMDMxMjUgMC4yMTg3NTAgMC4yMzQzNzUgMC4yNTAwMDAgMC4yNjU2MjUgMC4yODEyNTAgMC4yOTY4NzUgMC4zMTI1MDAgMC4zMjgxMjUgMC4zNDM3NTAgMC4zNTkzNzUgMC4zNzUwMDAgMC4zOTA2MjUgMC40MDYyNTAgMC40MjE4NzUgMC40Mzc1MDAgMC40NTMxMjUgMC40Njg3NTAgMC40ODQzNzUgMC41MDAwMDAgMC41MTU2MjUgMC41MzEyNTAgMC41NDY4NzUgMC41NjI1MDAgMC41NzgxMjUgMC41OTM3NTAgMC42MDkzNzUgMC42MjUwMDAgMC42NDA2MjUgMC42NTYyNTAgMC42NzE4NzUgMC42ODc1MDAgMC43MDMxMjUgMC43MTg3NTAgMC43MzQzNzUgMC43NTAwMDAgMC43NjU2MjUgMC43ODEyNTAgMC43OTY4NzUgMC44MTI1MDAgMC44MjgxMjUgMC44NDM3NTAgMC44NTkzNzUgMC44NzUwMDAgMC44OTA2MjUgMC45MDYyNTAgMC45MjE4NzUgMC45Mzc1MDAgMC45NTMxMjUgMC45Njg3NTAgMC45ODQzNzUgMS4wMDAwMDBcIj48L2ZlRnVuY0c+XG4gICAgICAgIDxmZUZ1bmNCIHR5cGU9XCJkaXNjcmV0ZVwiIHRhYmxlVmFsdWVzPVwiMC4wMDAwMCAwLjAzMTI1IDAuMDYyNTAgMC4wOTM3NSAwLjEyNTAwIDAuMTU2MjUgMC4xODc1MCAwLjIxODc1IDAuMjUwMDAgMC4yODEyNSAwLjMxMjUwIDAuMzQzNzUgMC4zNzUwMCAwLjQwNjI1IDAuNDM3NTAgMC40Njg3NSAwLjUwMDAwIDAuNTMxMjUgMC41NjI1MCAwLjU5Mzc1IDAuNjI1MDAgMC42NTYyNSAwLjY4NzUwIDAuNzE4NzUgMC43NTAwMCAwLjc4MTI1IDAuODEyNTAgMC44NDM3NSAwLjg3NTAwIDAuOTA2MjUgMC45Mzc1MCAwLjk2ODc1IDEuMDAwMDBcIj48L2ZlRnVuY0I+XG4gICAgICA8L2ZlQ29tcG9uZW50VHJhbnNmZXI+XG4gICAgPC9maWx0ZXI+XG4gIDwvZGVmcz5cbjwvc3ZnPlxuXG48c2NyaXB0PlxuICBpbXBvcnQgeyBTeXN0ZW0sIFJlZ2lzdHJ5LCBIYXJkd2FyZU1hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi9pbmRleC5qcyc7XG5cbiAgY29uc3QgeyBob3VyczogaW5pdEhvdXJzLCBtaW51dGVzOiBpbml0TWludXRlcyB9ID0gU3lzdGVtLmdldEN1cnJlbnRUaW1lKCk7XG5cbiAgY29uc3QgcmVzY2FsZSA9ICh2YWwsIFttaW5PbGQsIG1heE9sZF0sIFttaW5OZXcsIG1heE5ld10pID0+XG4gICAgKChtYXhOZXcgLSBtaW5OZXcpIC8gKG1heE9sZCAtIG1pbk9sZCkpICogKHZhbCAtIG1heE9sZCkgKyBtYXhOZXc7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGRhdGEoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBicmlnaHRuZXNzTGV2ZWw6IDEwLFxuICAgICAgICB2ZXJzaW9uOiBTeXN0ZW0uZ2V0VmVyc2lvbigpLFxuICAgICAgICB0aW1lOiBgJHtpbml0SG91cnN9OiR7aW5pdE1pbnV0ZXN9YCxcbiAgICAgIH07XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgYnJpZ2h0bmVzc09wYWNpdHk6ICh7IGJyaWdodG5lc3NMZXZlbCB9KSA9PlxuICAgICAgICAxIC0gcmVzY2FsZShicmlnaHRuZXNzTGV2ZWwsIFsxLCAxMF0sIFswLjQsIDFdKSxcbiAgICB9LFxuICAgIG9uY3JlYXRlKCkge1xuICAgICAgaWYgKGxvY2FsU3RvcmFnZSkge1xuICAgICAgICBjb25zdCB7IFNjcmVlbkJyaWdodG5lc3MgfSA9IFJlZ2lzdHJ5LnBlcnNpc3RlbnQuZ2V0KCk7XG4gICAgICAgIGlmIChTY3JlZW5CcmlnaHRuZXNzICYmIHR5cGVvZiBTY3JlZW5CcmlnaHRuZXNzLmxldmVsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRoaXMuc2V0KHsgYnJpZ2h0bmVzc0xldmVsOiBTY3JlZW5CcmlnaHRuZXNzLmxldmVsIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIEhhcmR3YXJlTWFuYWdlci5vbignY2hhbmdlQnJpZ2h0bmVzcycsIGJyaWdodG5lc3NMZXZlbCA9PiB7XG4gICAgICAgIHRoaXMuc2V0KHsgYnJpZ2h0bmVzc0xldmVsIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8qKiBVcGRhdGUgdGhlIGNsb2NrIGFmdGVyIGVhY2ggc2Vjb25kICovXG4gICAgICBTeXN0ZW0ub24oJ2Nsb2NrJywgKG5ld0hvdXJzLCBuZXdNaW51dGVzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0KHsgdGltZTogYCR7bmV3SG91cnN9OiR7bmV3TWludXRlc31gIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuLnNjcmVlbixcbiAgLmNvbnRlbnQge1xuICAgIGhlaWdodDogMTAwJTtcbiAgfVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDAwcHgpIHtcbiAgICAuc3RhdHVzLWJhciB7XG4gICAgICBkaXNwbGF5OiBub25lO1xuICAgIH1cblxuICAgIDpnbG9iYWwoYm9keSkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UzZTZlNztcbiAgICB9XG5cbiAgICAuc2NyZWVuIHtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIGZpbHRlcjogdXJsKCNwb3MtY29sb3ItbWFwKTtcbiAgICB9XG4gIH1cblxuQG1lZGlhIChtaW4td2lkdGg6IDQwMXB4KSB7XG4gICAgLnNjcmVlbiB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0b3A6IDIzMXB4O1xuICAgICAgbGVmdDogNTBweDtcbiAgICAgIHdpZHRoOiAyNDBweDtcbiAgICAgIGhlaWdodDogMzIwcHg7XG4gICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xuICAgICAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XG4gICAgICAgICAgICAgIGZsZXgtZmxvdzogY29sdW1uO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIGZpbHRlcjogdXJsKCNwb3MtY29sb3ItbWFwKTtcbiAgICB9XG5cbiAgICAgIC8qKiBGaXJlZm94IGlzIGJlaW5nIGFubm95ZWQgYnkgdHdvIHN0YWNrIGNvbnRleHRzICguc2NyZWVuIGFuZCAuY29udGVudCkgYW5kIGJyZWFraW5nIHRoZSBzY3JvbGwgKi9cbiAgICAgIEBzdXBwb3J0cyAoLW1vei1hcHBlYXJhbmNlOiBub25lKSB7XG4gICAgLnNjcmVlbiB7XG4gICAgICAgIGZpbHRlcjogbm9uZVxuICAgIH1cbiAgICAgIH1cblxuICAgIC5jb250ZW50IHtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIC13ZWJraXQtYm94LWZsZXg6IDA7XG4gICAgICAgICAgICAgIGZsZXg6IDAgMSBhdXRvO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIC8qIHVzZXItc2VsZWN0OiB0ZXh0OyAqL1xuICAgIH1cblxuICAgIC8qKiBNYWtlcywgaW4gY2hyb21lLCBhbGwgZml4ZWQgZWxlbWVudHMgcmVsYXRpdmUgdG8gdGhlIHNjcmVlbiBkaXYgKi9cbiAgICBAc3VwcG9ydHMgKC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZSkge1xuICAgICAgLmNvbnRlbnQge1xuICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLmJyaWdodG5lc3Mge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgICAgIHotaW5kZXg6IDEwMDAwMDtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZTtcbiAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlO1xuICAgIH1cblxuICAgIC5zdGF0dXMtYmFyIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHotaW5kZXg6IDEwMDI7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMjBweDtcbiAgICAgIC13ZWJraXQtYm94LWZsZXg6IDA7XG4gICAgICAgICAgICAgIGZsZXg6IDAgMCAyMHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC13ZWJraXQtYm94LXBhY2s6IGp1c3RpZnk7XG4gICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBwYWRkaW5nOiAwIDRweDtcbiAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuICB9XG5cbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5QWJXRnRZbUV2YzNSNWJHVnpMMk52Ykc5eWN5NXdZM056SWl3aWJtOWtaVjl0YjJSMWJHVnpMMEJ0WVcxaVlTOXpkSGxzWlhNdmRHaGxiV1V1Y0dOemN5SXNJbkJoWTJ0aFoyVnpMM0J2Y3k5emFXMTFiR0YwYjNJdmRtbGxkeTl3YjNNdmFHRnlaSGRoY21VdlUyTnlaV1Z1TG1oMGJXd2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJkVUpCTEZGQlFWRTdPMEZEYUVKU0xHMUNRVUZ0UWpzN1FVRlRia0lzY1VKQlFYRkNPenRCUVUxeVFpeHpRa0ZCYzBJN08wRkJUWFJDTEhsQ1FVRjVRanM3UVVGbGVrSXNiVUpCUVcxQ096dEJRekZEYWtJN08wbEJSVVVzV1VGQldUdEZRVU5rT3p0QlFVVkJPMGxCUTBVN1RVRkRSU3hoUVVGaE8wbEJRMlk3TzBsQlJVRTdUVUZEUlN4NVFrRkJLMEk3U1VGRGFrTTdPMGxCUlVFN1RVRkRSU3haUVVGWk8wMUJRMW9zTWtKQlFUSkNPMGxCUXpkQ08wVkJRMFk3TzBGQlJVRTdTVUZEUlR0TlFVTkZMR3RDUVVGclFqdE5RVU5zUWl4VlFVRlZPMDFCUTFZc1ZVRkJWVHROUVVOV0xGbEJRVms3VFVGRFdpeGhRVUZoTzAxQlEySXNiMEpCUVdFN1RVRkJZaXhoUVVGaE8wMUJRMklzTkVKQlFXbENPMDFCUVdwQ0xEWkNRVUZwUWp0alFVRnFRaXhwUWtGQmFVSTdUVUZEYWtJc1owSkJRV2RDTzAxQlEyaENMREpDUVVFeVFqdEpRVTAzUWpzN1RVRktSU3h0UjBGQmJVYzdUVUZEYmtjN1NVRmFSanRSUVdGSk8wbEJSVW83VFVGRVJUczdTVUZIUmp0TlFVTkZMRmxCUVZrN1RVRkRXaXh0UWtGQll6dGpRVUZrTEdOQlFXTTdUVUZEWkN4blFrRkJaMEk3VFVGRGFFSXNkVUpCUVhWQ08wbEJRM3BDT3p0SlFVVkJMSEZGUVVGeFJUdEpRVU55UlR0TlFVTkZPMUZCUTBVc1owTkJRWGRDTzJkQ1FVRjRRaXgzUWtGQmQwSTdUVUZETVVJN1NVRkRSanM3U1VGRlFUdE5RVU5GTEd0Q1FVRnJRanROUVVOc1FpeE5RVUZOTzAxQlEwNHNUMEZCVHp0TlFVTlFMRmRCUVZjN1RVRkRXQ3haUVVGWk8wMUJRMW9zYzBKQlFYTkNPMDFCUTNSQ0xHVkJRV1U3VFVGRFppeHZRa0ZCYjBJN1RVRkRjRUlzY1VOQlFUWkNPMDFCUVRkQ0xEWkNRVUUyUWp0SlFVTXZRanM3U1VGRlFUdE5RVU5GTEd0Q1FVRnJRanROUVVOc1FpeGhRVUZoTzAxQlEySXNWMEZCVnp0TlFVTllMRmxCUVZrN1RVRkRXaXh0UWtGQll6dGpRVUZrTEdOQlFXTTdUVUZEWkN4elFrRkJjMEk3VFVGRGRFSXNiMEpCUVdFN1RVRkJZaXhoUVVGaE8wMUJRMklzZVVKQlFUaENPMk5CUVRsQ0xEaENRVUU0UWp0TlFVTTVRaXg1UWtGQmJVSTdZMEZCYmtJc2JVSkJRVzFDTzAxQlEyNUNMR05CUVdNN1RVRkRaQ3hYUVVGWE8wMUJRMWdzWlVGQlpUdE5RVU5tTEdsQ1FVRnBRanRKUVVOdVFqdEZRVU5HSWl3aVptbHNaU0k2SW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZhR0Z5WkhkaGNtVXZVMk55WldWdUxtaDBiV3dpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJa1lteGhZMnM2SUNNd01EQTdYRzVjYmlSM2FHbDBaVG9nSTJabVpqdGNiaVJ6WldGemFHVnNiRG9nSTJZeFpqRm1NVHRjYmx4dUpITjBiMjVsTFdkeVpXVnVPaUFqTkdaaU16UXhPMXh1SkhOMGIyNWxMV2R5WldWdUxXUmhjbXM2SUNNeE5UTTFNakk3WEc0a2MzUnZibVV0WjNKbFpXNHRiR2xuYUhRNklDTmhObVJtT0dNN1hHNWNiaVJuY21GNUxXUmhjbXRsY2pvZ0l6TTFNelV6TlR0Y2JpUm5jbUY1TFdSaGNtczZJQ00wTWpVNU5qTTdYRzRrWjNKaGVUb2dJemRsTjJVM1pUdGNiaVJuY21GNUxXeHBaMmgwT2lBallqVmlOV0kxTzF4dUpHZHlZWGt0YkdsbmFIUmxjam9nSTJVelpUWmxOenRjYmlSbmNtRjVMV3hwWjJoMFpYTjBPaUFqWmpGbU1tWXpPMXh1WEc0a2MybHNkbVZ5T2lBalltRmlPV0k1TzF4dUpITnBiSFpsY2kxc2FXZG9kRG9nSTJSalpHTmtZenRjYmx4dUpISmxaRG9nSTJabU1XRXhZVHRjYmlSeVpXUXRaR0Z5YXpvZ0kyUTFNREF3TUR0Y2JpUnlaV1F0YkdsbmFIUTZJQ05sT0RWaU5XSTdYRzVjYmk4cUlDMHRMU0FxTDF4dVhHNGtZbXgxWlRvZ0l6SXhPVFptTXp0Y2JpUmliSFZsTFdSaGNtczZJQ014TlRZMVl6QTdYRzVjYmlSaWJIVmxMV2R5WVhrdGJHbG5hSFE2SUNNNU1HRTBZV1U3WEc0a1lteDFaUzFuY21GNU9pQWpOakEzWkRoaU8xeHVKR0pzZFdVdFozSmhlUzFrWVhKck9pQWpORFUxWVRZME8xeHVYRzRrWjNKbFpXNDZJQ00wWldKbU1XRTdYRzRrWjNKbFlXNHRiR2xuYUhRNklDTTBZMkZtTlRBN1hHNGtaM0psWlc0dFpHRnlhem9nSXpOa1lURXdaanRjYmlSbmNtVmxiaTF3WVhsdFpXNTBPaUFqTkRJNU9EUXhPMXh1WEc0a2NIVnljR3hsT2lBallXSTBOMkpqTzF4dUpIQjFjbkJzWlMxa1lYSnJPaUFqTnprd1pUaGlPMXh1SkhCMWNuQnNaUzFzYVdkb2REb2dJMlJtTnpobFpqdGNibHh1SkhSbFlXdzZJQ014T1dVellqRTdYRzRrZEdWaGJDMWtZWEpyT2lBak1EQmhaams0TzF4dVhHNGtlV1ZzYkc5M09pQWpaamxoT0RJMU8xeHVKSGxsYkd4dmR5MWtZWEpyT2lBalpqVTNaakUzTzF4dUlpd2lRR2x0Y0c5eWRDQW5ZMjlzYjNKekxuQmpjM01uTzF4dVhHNGtaR1ZtWVhWc2RDMTBaWGgwTFdOdmJHOXlPaUFrWjNKaGVTMWtZWEpyWlhJN1hHNGtaR1ZtWVhWc2RDMW1iMjUwTFhOcGVtVTZJREV6Y0hnN1hHNWNiaVJoY0hBdFltY3RZMjlzYjNJNklDUm5jbUY1TFd4cFoyaDBaWEk3WEc1Y2JpOHFLaUJTYjNjZ1kyOXRjRzl1Wlc1MElDb3ZYRzRrY205M0xYQmhaR1JwYm1jNklERXljSGdnTVRWd2VEdGNiaVJ5YjNjdGRHOXdMV2hsYVdkb2REb2dZWFYwYnp0Y2JpUnliM2N0WW05eVpHVnlMV052Ykc5eU9pQWtaM0poZVMxc2FXZG9kR1Z5TzF4dUpISnZkeTFpWnkxamIyeHZjam9nSkhkb2FYUmxPMXh1SkhKdmR5MXdjbWx0WVhKNUxXTnZiRzl5T2lBa1ozSmhlUzFrWVhKclpYSTdYRzRrY205M0xYTmxZMjl1WkdGeWVTMWpiMnh2Y2pvZ0pHZHlZWGs3WEc0a2NtOTNMV1p2Ym5RdGMybDZaVG9nTVRSd2VEdGNibHh1THlvcUlFbHVjSFYwSUdOdmJYQnZibVZ1ZENBcUwxeHVKR2x1Y0hWMExXSnZjbVJsY2kxamIyeHZjam9nSkdkeVlYa3RiR2xuYUhSbGNqdGNiaVJwYm5CMWRDMW1iMk4xY3kxaWIzSmtaWEl0WTI5c2IzSTZJQ1J6ZEc5dVpTMW5jbVZsYmp0Y2JpUnBibkIxZEMxcGJuWmhiR2xrTFdKdmNtUmxjaTFqYjJ4dmNqb2dKSEpsWkMxc2FXZG9kRHRjYmlScGJuQjFkQzFsY25KdmNpMWpiMnh2Y2pvZ0pISmxaQzFzYVdkb2REdGNibHh1THlvcUlFUnBZV3h2WnlCamIyMXdiMjVsYm5RZ0tpOWNiaVJrYVdGc2IyY3RibVZuWVhScGRtVXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzRrWkdsaGJHOW5MWEJ2YzJsMGFYWmxMV052Ykc5eU9pQWtjM1J2Ym1VdFozSmxaVzQ3WEc0a1pHbGhiRzluTFdOdmJtWnBjbTFoZEdsdmJpMXdjbWx0WVhKNUxXTnZiRzl5T2lBa1ozSmhlUzFrWVhKck8xeHVKR1JwWVd4dlp5MWpiMjVtYVhKdFlYUnBiMjR0ZEdWNGRDMWpiMnh2Y2pvZ0pIZG9hWFJsTzF4dVhHNHZLaW9nUVdSdGFXNU1iMk5ySUdOdmJYQnZibVZ1ZENBcUwxeHVKR0ZrYldsdWJHOWpheTF1WldkaGRHbDJaUzFqYjJ4dmNqb2dKSEpsWkMxc2FXZG9kRHRjYmlSaFpHMXBibXh2WTJzdGRHVjRkQzFqYjJ4dmNqb2dKR2R5WVhrdFpHRnlhenRjYmlSaFpHMXBibXh2WTJzdFltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0kyWXdaakJtTUR0Y2JseHVKR0oxZEhSdmJpMXdjbWx0WVhKNUxXTnZiRzl5T2lBa1ozSmxaVzQ3WEc0a1luVjBkRzl1TFhSbGVIUXRZMjlzYjNJNklDUjNhR2wwWlR0Y2JseHVKSE4zYVhSamFDMTFibU5vWldOclpXUXRZbWM2SUNSemFXeDJaWEk3WEc0a2MzZHBkR05vTFhWdVkyaGxZMnRsWkMxamIyeHZjam9nSkhObFlYTm9aV3hzTzF4dUpITjNhWFJqYUMxamFHVmphMlZrTFdKbk9pQWtjM1J2Ym1VdFozSmxaVzR0YkdsbmFIUTdYRzRrYzNkcGRHTm9MV05vWldOclpXUXRZMjlzYjNJNklDUm5jbVZsYmp0Y2JpUnpkMmwwWTJndFpHbHpZV0pzWldRdFltYzZJQ1J6YVd4MlpYSXRiR2xuYUhRN1hHNGtjM2RwZEdOb0xXUnBjMkZpYkdWa0xXTnZiRzl5T2lBa2MybHNkbVZ5TzF4dVhHNHZLaUJVWVdKeklHTnZiWEJ2Ym1WdWRDQXFMMXh1SkhSaFlpMXVZWFpwWjJGMGFXOXVMV0puT2lBalpqSm1NbVl5TzF4dUpIUmhZaTFzWVdKbGJDMWpiMnh2Y2pvZ0l6WTFOemMzWmp0Y2JpUjBZV0l0YVhSbGJTMW1iMjUwTFhOcGVtVTZJREV6Y0hnN1hHNGtkR0ZpTFd4cGJtVXRZMjlzYjNJNklDUm5jbVZsYmp0Y2JpUjBZV0l0YUdWcFoyaDBPaUEwTUhCNE8xeHVJaXdpWEc0Z0lDNXpZM0psWlc0c1hHNGdJQzVqYjI1MFpXNTBJSHRjYmlBZ0lDQm9aV2xuYUhRNklERXdNQ1U3WEc0Z0lIMWNibHh1SUNCQWJXVmthV0VnS0cxaGVDMTNhV1IwYURvZ05EQXdjSGdwSUh0Y2JpQWdJQ0F1YzNSaGRIVnpMV0poY2lCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lCdWIyNWxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lEcG5iRzlpWVd3b1ltOWtlU2tnZTF4dUlDQWdJQ0FnWW1GamEyZHliM1Z1WkMxamIyeHZjam9nSkdGd2NDMWlaeTFqYjJ4dmNqdGNiaUFnSUNCOVhHNWNiaUFnSUNBdWMyTnlaV1Z1SUh0Y2JpQWdJQ0FnSUdobGFXZG9kRG9nTVRBd0pUdGNiaUFnSUNBZ0lHWnBiSFJsY2pvZ2RYSnNLQ053YjNNdFkyOXNiM0l0YldGd0tUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQkFiV1ZrYVdFZ0tHMXBiaTEzYVdSMGFEb2dOREF4Y0hncElIdGNiaUFnSUNBdWMyTnlaV1Z1SUh0Y2JpQWdJQ0FnSUhCdmMybDBhVzl1T2lCaFluTnZiSFYwWlR0Y2JpQWdJQ0FnSUhSdmNEb2dNak14Y0hnN1hHNGdJQ0FnSUNCc1pXWjBPaUExTUhCNE8xeHVJQ0FnSUNBZ2QybGtkR2c2SURJME1IQjRPMXh1SUNBZ0lDQWdhR1ZwWjJoME9pQXpNakJ3ZUR0Y2JpQWdJQ0FnSUdScGMzQnNZWGs2SUdac1pYZzdYRzRnSUNBZ0lDQm1iR1Y0TFdac2IzYzZJR052YkhWdGJqdGNiaUFnSUNBZ0lHOTJaWEptYkc5M09pQm9hV1JrWlc0N1hHNGdJQ0FnSUNCbWFXeDBaWEk2SUhWeWJDZ2pjRzl6TFdOdmJHOXlMVzFoY0NrN1hHNWNiaUFnSUNBZ0lDOHFLaUJHYVhKbFptOTRJR2x6SUdKbGFXNW5JR0Z1Ym05NVpXUWdZbmtnZEhkdklITjBZV05ySUdOdmJuUmxlSFJ6SUNndWMyTnlaV1Z1SUdGdVpDQXVZMjl1ZEdWdWRDa2dZVzVrSUdKeVpXRnJhVzVuSUhSb1pTQnpZM0p2Ykd3Z0tpOWNiaUFnSUNBZ0lFQnpkWEJ3YjNKMGN5QW9MVzF2ZWkxaGNIQmxZWEpoYm1ObE9pQnViMjVsS1NCN1hHNGdJQ0FnSUNBZ0lHWnBiSFJsY2pvZ2JtOXVaVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQXVZMjl1ZEdWdWRDQjdYRzRnSUNBZ0lDQm9aV2xuYUhRNklERXdNQ1U3WEc0Z0lDQWdJQ0JtYkdWNE9pQXdJREVnWVhWMGJ6dGNiaUFnSUNBZ0lHOTJaWEptYkc5M09pQm9hV1JrWlc0N1hHNGdJQ0FnSUNBdktpQjFjMlZ5TFhObGJHVmpkRG9nZEdWNGREc2dLaTljYmlBZ0lDQjlYRzVjYmlBZ0lDQXZLaW9nVFdGclpYTXNJR2x1SUdOb2NtOXRaU3dnWVd4c0lHWnBlR1ZrSUdWc1pXMWxiblJ6SUhKbGJHRjBhWFpsSUhSdklIUm9aU0J6WTNKbFpXNGdaR2wySUNvdlhHNGdJQ0FnUUhOMWNIQnZjblJ6SUNndGQyVmlhMmwwTFdGd2NHVmhjbUZ1WTJVNklHNXZibVVwSUh0Y2JpQWdJQ0FnSUM1amIyNTBaVzUwSUh0Y2JpQWdJQ0FnSUNBZ2RISmhibk5tYjNKdE9pQjBjbUZ1YzJ4aGRHVmFLREFwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzVpY21sbmFIUnVaWE56SUh0Y2JpQWdJQ0FnSUhCdmMybDBhVzl1T2lCaFluTnZiSFYwWlR0Y2JpQWdJQ0FnSUhSdmNEb2dNRHRjYmlBZ0lDQWdJR3hsWm5RNklEQTdYRzRnSUNBZ0lDQjNhV1IwYURvZ01UQXdKVHRjYmlBZ0lDQWdJR2hsYVdkb2REb2dNVEF3SlR0Y2JpQWdJQ0FnSUdKaFkydG5jbTkxYm1RdFkyOXNiM0k2SUNNd01EQTdYRzRnSUNBZ0lDQjZMV2x1WkdWNE9pQXhNREF3TURBN1hHNGdJQ0FnSUNCd2IybHVkR1Z5TFdWMlpXNTBjem9nYm05dVpUdGNiaUFnSUNBZ0lIUnlZVzV6YVhScGIyNDZJRzl3WVdOcGRIa2dNQzR6Y3lCbFlYTmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDNXpkR0YwZFhNdFltRnlJSHRjYmlBZ0lDQWdJSEJ2YzJsMGFXOXVPaUJ5Wld4aGRHbDJaVHRjYmlBZ0lDQWdJSG90YVc1a1pYZzZJREV3TURJN1hHNGdJQ0FnSUNCM2FXUjBhRG9nTVRBd0pUdGNiaUFnSUNBZ0lHaGxhV2RvZERvZ01qQndlRHRjYmlBZ0lDQWdJR1pzWlhnNklEQWdNQ0F5TUhCNE8xeHVJQ0FnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0l6QXdNRHRjYmlBZ0lDQWdJR1JwYzNCc1lYazZJR1pzWlhnN1hHNGdJQ0FnSUNCcWRYTjBhV1o1TFdOdmJuUmxiblE2SUhOd1lXTmxMV0psZEhkbFpXNDdYRzRnSUNBZ0lDQmhiR2xuYmkxcGRHVnRjem9nWTJWdWRHVnlPMXh1SUNBZ0lDQWdjR0ZrWkdsdVp6b2dNQ0EwY0hnN1hHNGdJQ0FnSUNCamIyeHZjam9nSTJabVpqdGNiaUFnSUNBZ0lHWnZiblF0YzJsNlpUb2dNVEp3ZUR0Y2JpQWdJQ0FnSUdadmJuUXRkMlZwWjJoME9pQmliMnhrTzF4dUlDQWdJSDFjYmlBZ2ZWeHVJbDE5ICovPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFnRkEscUJBQU8sQ0FDTCxRQUFRLGNBQUMsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLEFBQ2QsQ0FBQyxBQUVILE1BQU0sQUFBQyxZQUFZLEtBQUssQ0FBQyxBQUFDLENBQUMsQUFDdkIsV0FBVyxjQUFDLENBQUMsQUFDWCxPQUFPLENBQUUsSUFBSSxBQUNmLENBQUMsQUFFTyxJQUFJLEFBQUUsQ0FBQyxBQUNiLGdCQUFnQixDQUFFLE9BQU8sQUFDM0IsQ0FBQyxBQUVELE9BQU8sY0FBQyxDQUFDLEFBQ1AsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsSUFBSSxjQUFjLENBQUMsQUFDN0IsQ0FBQyxBQUNILENBQUMsQUFFSCxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQ3ZCLE9BQU8sY0FBQyxDQUFDLEFBQ1AsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLEtBQUssQ0FDVixJQUFJLENBQUUsSUFBSSxDQUNWLEtBQUssQ0FBRSxLQUFLLENBQ1osTUFBTSxDQUFFLEtBQUssQ0FDYixPQUFPLENBQUUsV0FBVyxDQUNwQixPQUFPLENBQUUsSUFBSSxDQUNiLGtCQUFrQixDQUFFLFFBQVEsQ0FDNUIscUJBQXFCLENBQUUsTUFBTSxDQUNyQixTQUFTLENBQUUsTUFBTSxDQUN6QixRQUFRLENBQUUsTUFBTSxDQUNoQixNQUFNLENBQUUsSUFBSSxjQUFjLENBQUMsQUFDN0IsQ0FBQyxBQUdDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDLEFBQ3JDLE9BQU8sY0FBQyxDQUFDLEFBQ0wsTUFBTSxDQUFFLElBQUk7SUFDaEIsQ0FBQyxBQUNDLENBQUMsQUFFSCxRQUFRLGNBQUMsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLENBQ1osZ0JBQWdCLENBQUUsQ0FBQyxDQUNYLElBQUksQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEIsUUFBUSxDQUFFLE1BQU0sQUFFbEIsQ0FBQyxBQUdELFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDLEFBQ3BDLFFBQVEsY0FBQyxDQUFDLEFBQ1IsaUJBQWlCLENBQUUsV0FBVyxDQUFDLENBQUMsQ0FDeEIsU0FBUyxDQUFFLFdBQVcsQ0FBQyxDQUFDLEFBQ2xDLENBQUMsQUFDSCxDQUFDLEFBRUQsV0FBVyxjQUFDLENBQUMsQUFDWCxRQUFRLENBQUUsUUFBUSxDQUNsQixHQUFHLENBQUUsQ0FBQyxDQUNOLElBQUksQ0FBRSxDQUFDLENBQ1AsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGdCQUFnQixDQUFFLElBQUksQ0FDdEIsT0FBTyxDQUFFLE1BQU0sQ0FDZixjQUFjLENBQUUsSUFBSSxDQUNwQixrQkFBa0IsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDckMsVUFBVSxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxBQUMvQixDQUFDLEFBRUQsV0FBVyxjQUFDLENBQUMsQUFDWCxRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixnQkFBZ0IsQ0FBRSxDQUFDLENBQ1gsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN0QixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLE9BQU8sQ0FBRSxXQUFXLENBQ3BCLE9BQU8sQ0FBRSxJQUFJLENBQ2IsZ0JBQWdCLENBQUUsT0FBTyxDQUNqQixlQUFlLENBQUUsYUFBYSxDQUN0QyxpQkFBaUIsQ0FBRSxNQUFNLENBQ2pCLFdBQVcsQ0FBRSxNQUFNLENBQzNCLE9BQU8sQ0FBRSxDQUFDLENBQUMsR0FBRyxDQUNkLEtBQUssQ0FBRSxJQUFJLENBQ1gsU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxBQUNuQixDQUFDLEFBQ0gsQ0FBQyJ9 */';
    append(document.head, style);
  }

  function create_main_fragment$2(component, ctx) {
    var div7,
      div0,
      text0,
      div5,
      div2,
      div1,
      text1,
      text2,
      div4,
      div3,
      text3,
      text4,
      div6,
      slot_content_default = component._slotted.default,
      text5,
      svg,
      defs,
      filter,
      feComponentTransfer,
      feFuncR,
      feFuncG,
      feFuncB;

    return {
      c: function create() {
        div7 = createElement('div');
        div0 = createElement('div');
        text0 = createText('\n  ');
        div5 = createElement('div');
        div2 = createElement('div');
        div1 = createElement('div');
        text1 = createText(ctx.version);
        text2 = createText('\n    ');
        div4 = createElement('div');
        div3 = createElement('div');
        text3 = createText(ctx.time);
        text4 = createText('\n  ');
        div6 = createElement('div');
        text5 = createText('\n\n\n');
        svg = createSvgElement('svg');
        defs = createSvgElement('defs');
        filter = createSvgElement('filter');
        feComponentTransfer = createSvgElement('feComponentTransfer');
        feFuncR = createSvgElement('feFuncR');
        feFuncG = createSvgElement('feFuncG');
        feFuncB = createSvgElement('feFuncB');
        div0.className = 'brightness svelte-bsw6by';
        setStyle(div0, 'opacity', ctx.brightnessOpacity);
        addLoc(div0, file$2, 1, 2, 23);
        div1.className = 'version';
        addLoc(div1, file$2, 4, 6, 135);
        addLoc(div2, file$2, 3, 4, 123);
        div3.className = 'time';
        addLoc(div3, file$2, 7, 6, 199);
        addLoc(div4, file$2, 6, 4, 187);
        div5.className = 'status-bar svelte-bsw6by';
        addLoc(div5, file$2, 2, 2, 94);
        div6.className = 'content svelte-bsw6by';
        addLoc(div6, file$2, 10, 2, 252);
        div7.className = 'screen svelte-bsw6by';
        addLoc(div7, file$2, 0, 0, 0);
        setAttribute(feFuncR, 'type', 'discrete');
        setAttribute(
          feFuncR,
          'tableValues',
          '0.00000 0.03125 0.06250 0.09375 0.12500 0.15625 0.18750 0.21875 0.25000 0.28125 0.31250 0.34375 0.37500 0.40625 0.43750 0.46875 0.50000 0.53125 0.56250 0.59375 0.62500 0.65625 0.68750 0.71875 0.75000 0.78125 0.81250 0.84375 0.87500 0.90625 0.93750 0.96875 1.00000',
        );
        addLoc(feFuncR, file$2, 20, 8, 591);
        setAttribute(feFuncG, 'type', 'discrete');
        setAttribute(
          feFuncG,
          'tableValues',
          '0.000000 0.015625 0.031250 0.046875 0.062500 0.078125 0.093750 0.109375 0.125000 0.140625 0.156250 0.171875 0.187500 0.203125 0.218750 0.234375 0.250000 0.265625 0.281250 0.296875 0.312500 0.328125 0.343750 0.359375 0.375000 0.390625 0.406250 0.421875 0.437500 0.453125 0.468750 0.484375 0.500000 0.515625 0.531250 0.546875 0.562500 0.578125 0.593750 0.609375 0.625000 0.640625 0.656250 0.671875 0.687500 0.703125 0.718750 0.734375 0.750000 0.765625 0.781250 0.796875 0.812500 0.828125 0.843750 0.859375 0.875000 0.890625 0.906250 0.921875 0.937500 0.953125 0.968750 0.984375 1.000000',
        );
        addLoc(feFuncG, file$2, 21, 8, 913);
        setAttribute(feFuncB, 'type', 'discrete');
        setAttribute(
          feFuncB,
          'tableValues',
          '0.00000 0.03125 0.06250 0.09375 0.12500 0.15625 0.18750 0.21875 0.25000 0.28125 0.31250 0.34375 0.37500 0.40625 0.43750 0.46875 0.50000 0.53125 0.56250 0.59375 0.62500 0.65625 0.68750 0.71875 0.75000 0.78125 0.81250 0.84375 0.87500 0.90625 0.93750 0.96875 1.00000',
        );
        addLoc(feFuncB, file$2, 22, 8, 1556);
        addLoc(feComponentTransfer, file$2, 19, 6, 561);
        setAttribute(filter, 'id', 'pos-color-map');
        setAttribute(filter, 'x', '0%');
        setAttribute(filter, 'y', '0%');
        setAttribute(filter, 'width', '100%');
        setAttribute(filter, 'height', '100%');
        addLoc(filter, file$2, 18, 4, 486);
        addLoc(defs, file$2, 17, 2, 475);
        setAttribute(svg, 'width', '0');
        setAttribute(svg, 'height', '0');
        setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
        setAttribute(svg, 'version', '1.1');
        setStyle(svg, 'display', 'block');
        addLoc(svg, file$2, 16, 0, 373);
      },

      m: function mount(target, anchor) {
        insert(target, div7, anchor);
        append(div7, div0);
        append(div7, text0);
        append(div7, div5);
        append(div5, div2);
        append(div2, div1);
        append(div1, text1);
        append(div5, text2);
        append(div5, div4);
        append(div4, div3);
        append(div3, text3);
        append(div7, text4);
        append(div7, div6);

        if (slot_content_default) {
          append(div6, slot_content_default);
        }

        insert(target, text5, anchor);
        insert(target, svg, anchor);
        append(svg, defs);
        append(defs, filter);
        append(filter, feComponentTransfer);
        append(feComponentTransfer, feFuncR);
        append(feComponentTransfer, feFuncG);
        append(feComponentTransfer, feFuncB);
      },

      p: function update(changed, ctx) {
        if (changed.brightnessOpacity) {
          setStyle(div0, 'opacity', ctx.brightnessOpacity);
        }

        if (changed.version) {
          setData(text1, ctx.version);
        }

        if (changed.time) {
          setData(text3, ctx.time);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div7);
        }

        if (slot_content_default) {
          reinsertChildren(div6, slot_content_default);
        }

        if (detach) {
          detachNode(text5);
          detachNode(svg);
        }
      },
    };
  }

  function Screen(options) {
    this._debugName = '<Screen>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$1(), options.data);

    this._recompute({ brightnessLevel: 1 }, this._state);
    if (!('brightnessLevel' in this._state))
      console.warn(
        "<Screen> was created without expected data property 'brightnessLevel'",
      );

    if (!('version' in this._state))
      console.warn(
        "<Screen> was created without expected data property 'version'",
      );
    if (!('time' in this._state))
      console.warn(
        "<Screen> was created without expected data property 'time'",
      );
    this._intro = true;

    this._slotted = options.slots || {};

    if (!document.getElementById('svelte-bsw6by-style')) add_css$2();

    this._fragment = create_main_fragment$2(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$1.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Screen.prototype, protoDev);

  Screen.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('brightnessOpacity' in newState && !this._updatingReadonlyProperty)
      throw new Error(
        "<Screen>: Cannot set read-only property 'brightnessOpacity'",
      );
  };

  Screen.prototype._recompute = function _recompute(changed, state) {
    if (changed.brightnessLevel) {
      if (
        this._differs(
          state.brightnessOpacity,
          (state.brightnessOpacity = brightnessOpacity(state)),
        )
      )
        changed.brightnessOpacity = true;
    }
  };

  /* packages/pos/simulator/view/pos/POS.html generated by Svelte v2.16.1 */

  const file$3 = 'packages/pos/simulator/view/pos/POS.html';

  function add_css$3() {
    var style = createElement('style');
    style.id = 'svelte-1jjnjgp-style';
    style.textContent =
      '@media(max-width: 400px){.pos-wrapper.svelte-1jjnjgp,.pos.svelte-1jjnjgp{height:100%}}@media(min-width: 401px){.pos-wrapper.svelte-1jjnjgp{position:relative}.pos.svelte-1jjnjgp,.shadow.svelte-1jjnjgp{position:relative;z-index:2;margin:0 auto;width:347px;height:761px;background-image:url(./assets/POS.png);background-size:cover}.pos.svelte-1jjnjgp{-webkit-user-select:none;user-select:none}.shadow.svelte-1jjnjgp{display:none}@supports (filter: brightness(0)){.shadow.svelte-1jjnjgp{display:block;position:absolute;z-index:0;filter:brightness(0) blur(2px);opacity:0.4;-webkit-animation:shadow 0.8s ease-out forwards;animation:shadow 0.8s ease-out forwards;-webkit-transform:translate(15px, 15px);transform:translate(15px, 15px)}}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUE9TLmh0bWwiLCJzb3VyY2VzIjpbIlBPUy5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIlxuPGRpdiBjbGFzcz1cInBvcy13cmFwcGVyXCI+XG4gIDxkaXYgY2xhc3M9XCJzaGFkb3dcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInBvc1wiPlxuICAgIDxQcmludGVyIHJlZjpwcmludGVyIC8+XG4gICAgICA8U2NyZWVuIHJlZjpzY3JlZW4+XG4gICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgIDwvU2NyZWVuPlxuICAgIDxLZXlwYWQgcmVmOmtleXBhZCAvPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48c2NyaXB0PlxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgY29tcG9uZW50czoge1xuICAgICAgUHJpbnRlcjogJy4vaGFyZHdhcmUvUHJpbnRlci5odG1sJyxcbiAgICAgIEtleXBhZDogJy4vaGFyZHdhcmUvS2V5cGFkLmh0bWwnLFxuICAgICAgU2NyZWVuOiAnLi9oYXJkd2FyZS9TY3JlZW4uaHRtbCcsXG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuQG1lZGlhIChtYXgtd2lkdGg6IDQwMHB4KSB7XG4gICAgLnBvcy13cmFwcGVyLFxuICAgIC5wb3Mge1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cbiAgfVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNDAxcHgpIHtcbiAgICAucG9zLXdyYXBwZXIge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIH1cblxuICAgIC5wb3MsXG4gICAgLnNoYWRvdyB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB6LWluZGV4OiAyO1xuICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICB3aWR0aDogMzQ3cHg7XG4gICAgICBoZWlnaHQ6IDc2MXB4O1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL1BPUy5wbmcpO1xuICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICB9XG5cbiAgICAucG9zIHtcbiAgICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIH1cblxuICAgIC5zaGFkb3cge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG5cbiAgICBAc3VwcG9ydHMgKGZpbHRlcjogYnJpZ2h0bmVzcygwKSkge1xuICAgICAgLnNoYWRvdyB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHotaW5kZXg6IDA7XG4gICAgICAgIGZpbHRlcjogYnJpZ2h0bmVzcygwKSBibHVyKDJweCk7XG4gICAgICAgIG9wYWNpdHk6IDAuNDtcbiAgICAgICAgLXdlYmtpdC1hbmltYXRpb246IHNoYWRvdyAwLjhzIGVhc2Utb3V0IGZvcndhcmRzO1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogc2hhZG93IDAuOHMgZWFzZS1vdXQgZm9yd2FyZHM7XG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTVweCwgMTVweCk7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTVweCwgMTVweCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5QWJXRnRZbUV2YzNSNWJHVnpMMk52Ykc5eWN5NXdZM056SWl3aWJtOWtaVjl0YjJSMWJHVnpMMEJ0WVcxaVlTOXpkSGxzWlhNdmRHaGxiV1V1Y0dOemN5SXNJbkJoWTJ0aFoyVnpMM0J2Y3k5emFXMTFiR0YwYjNJdmRtbGxkeTl3YjNNdlVFOVRMbWgwYld3aVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQmRVSkJMRkZCUVZFN08wRkRhRUpTTEcxQ1FVRnRRanM3UVVGVGJrSXNjVUpCUVhGQ096dEJRVTF5UWl4elFrRkJjMEk3TzBGQlRYUkNMSGxDUVVGNVFqczdRVUZsZWtJc2JVSkJRVzFDT3p0QlF6RkRha0k3U1VGRFJUczdUVUZGUlN4WlFVRlpPMGxCUTJRN1JVRkRSanM3UVVGRlFUdEpRVU5GTzAxQlEwVXNhMEpCUVd0Q08wbEJRM0JDT3p0SlFVVkJPenROUVVWRkxHdENRVUZyUWp0TlFVTnNRaXhWUVVGVk8wMUJRMVlzWTBGQll6dE5RVU5rTEZsQlFWazdUVUZEV2l4aFFVRmhPMDFCUTJJc2RVTkJRWFZETzAxQlEzWkRMSE5DUVVGelFqdEpRVU40UWpzN1NVRkZRVHROUVVORkxIbENRVUZwUWp0alFVRnFRaXhwUWtGQmFVSTdTVUZEYmtJN08wbEJSVUU3VFVGRFJTeGhRVUZoTzBsQlEyWTdPMGxCUlVFN1RVRkRSVHRSUVVORkxHTkJRV003VVVGRFpDeHJRa0ZCYTBJN1VVRkRiRUlzVlVGQlZUdFJRVU5XTEN0Q1FVRXJRanRSUVVNdlFpeFpRVUZaTzFGQlExb3NaMFJCUVhkRE8yZENRVUY0UXl4M1EwRkJkME03VVVGRGVFTXNkME5CUVdkRE8yZENRVUZvUXl4blEwRkJaME03VFVGRGJFTTdTVUZEUmp0RlFVTkdJaXdpWm1sc1pTSTZJbkJoWTJ0aFoyVnpMM0J2Y3k5emFXMTFiR0YwYjNJdmRtbGxkeTl3YjNNdlVFOVRMbWgwYld3aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWtZbXhoWTJzNklDTXdNREE3WEc1Y2JpUjNhR2wwWlRvZ0kyWm1aanRjYmlSelpXRnphR1ZzYkRvZ0kyWXhaakZtTVR0Y2JseHVKSE4wYjI1bExXZHlaV1Z1T2lBak5HWmlNelF4TzF4dUpITjBiMjVsTFdkeVpXVnVMV1JoY21zNklDTXhOVE0xTWpJN1hHNGtjM1J2Ym1VdFozSmxaVzR0YkdsbmFIUTZJQ05oTm1SbU9HTTdYRzVjYmlSbmNtRjVMV1JoY210bGNqb2dJek0xTXpVek5UdGNiaVJuY21GNUxXUmhjbXM2SUNNME1qVTVOak03WEc0a1ozSmhlVG9nSXpkbE4yVTNaVHRjYmlSbmNtRjVMV3hwWjJoME9pQWpZalZpTldJMU8xeHVKR2R5WVhrdGJHbG5hSFJsY2pvZ0kyVXpaVFpsTnp0Y2JpUm5jbUY1TFd4cFoyaDBaWE4wT2lBalpqRm1NbVl6TzF4dVhHNGtjMmxzZG1WeU9pQWpZbUZpT1dJNU8xeHVKSE5wYkhabGNpMXNhV2RvZERvZ0kyUmpaR05rWXp0Y2JseHVKSEpsWkRvZ0kyWm1NV0V4WVR0Y2JpUnlaV1F0WkdGeWF6b2dJMlExTURBd01EdGNiaVJ5WldRdGJHbG5hSFE2SUNObE9EVmlOV0k3WEc1Y2JpOHFJQzB0TFNBcUwxeHVYRzRrWW14MVpUb2dJekl4T1RabU16dGNiaVJpYkhWbExXUmhjbXM2SUNNeE5UWTFZekE3WEc1Y2JpUmliSFZsTFdkeVlYa3RiR2xuYUhRNklDTTVNR0UwWVdVN1hHNGtZbXgxWlMxbmNtRjVPaUFqTmpBM1pEaGlPMXh1SkdKc2RXVXRaM0poZVMxa1lYSnJPaUFqTkRVMVlUWTBPMXh1WEc0a1ozSmxaVzQ2SUNNMFpXSm1NV0U3WEc0a1ozSmxZVzR0YkdsbmFIUTZJQ00wWTJGbU5UQTdYRzRrWjNKbFpXNHRaR0Z5YXpvZ0l6TmtZVEV3Wmp0Y2JpUm5jbVZsYmkxd1lYbHRaVzUwT2lBak5ESTVPRFF4TzF4dVhHNGtjSFZ5Y0d4bE9pQWpZV0kwTjJKak8xeHVKSEIxY25Cc1pTMWtZWEpyT2lBak56a3daVGhpTzF4dUpIQjFjbkJzWlMxc2FXZG9kRG9nSTJSbU56aGxaanRjYmx4dUpIUmxZV3c2SUNNeE9XVXpZakU3WEc0a2RHVmhiQzFrWVhKck9pQWpNREJoWmprNE8xeHVYRzRrZVdWc2JHOTNPaUFqWmpsaE9ESTFPMXh1SkhsbGJHeHZkeTFrWVhKck9pQWpaalUzWmpFM08xeHVJaXdpUUdsdGNHOXlkQ0FuWTI5c2IzSnpMbkJqYzNNbk8xeHVYRzRrWkdWbVlYVnNkQzEwWlhoMExXTnZiRzl5T2lBa1ozSmhlUzFrWVhKclpYSTdYRzRrWkdWbVlYVnNkQzFtYjI1MExYTnBlbVU2SURFemNIZzdYRzVjYmlSaGNIQXRZbWN0WTI5c2IzSTZJQ1JuY21GNUxXeHBaMmgwWlhJN1hHNWNiaThxS2lCU2IzY2dZMjl0Y0c5dVpXNTBJQ292WEc0a2NtOTNMWEJoWkdScGJtYzZJREV5Y0hnZ01UVndlRHRjYmlSeWIzY3RkRzl3TFdobGFXZG9kRG9nWVhWMGJ6dGNiaVJ5YjNjdFltOXlaR1Z5TFdOdmJHOXlPaUFrWjNKaGVTMXNhV2RvZEdWeU8xeHVKSEp2ZHkxaVp5MWpiMnh2Y2pvZ0pIZG9hWFJsTzF4dUpISnZkeTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJaWEk3WEc0a2NtOTNMWE5sWTI5dVpHRnllUzFqYjJ4dmNqb2dKR2R5WVhrN1hHNGtjbTkzTFdadmJuUXRjMmw2WlRvZ01UUndlRHRjYmx4dUx5b3FJRWx1Y0hWMElHTnZiWEJ2Ym1WdWRDQXFMMXh1SkdsdWNIVjBMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUmxjanRjYmlScGJuQjFkQzFtYjJOMWN5MWliM0prWlhJdFkyOXNiM0k2SUNSemRHOXVaUzFuY21WbGJqdGNiaVJwYm5CMWRDMXBiblpoYkdsa0xXSnZjbVJsY2kxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUnBibkIxZEMxbGNuSnZjaTFqYjJ4dmNqb2dKSEpsWkMxc2FXZG9kRHRjYmx4dUx5b3FJRVJwWVd4dlp5QmpiMjF3YjI1bGJuUWdLaTljYmlSa2FXRnNiMmN0Ym1WbllYUnBkbVV0WTI5c2IzSTZJQ1J5WldRdGJHbG5hSFE3WEc0a1pHbGhiRzluTFhCdmMybDBhWFpsTFdOdmJHOXlPaUFrYzNSdmJtVXRaM0psWlc0N1hHNGtaR2xoYkc5bkxXTnZibVpwY20xaGRHbHZiaTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJPMXh1SkdScFlXeHZaeTFqYjI1bWFYSnRZWFJwYjI0dGRHVjRkQzFqYjJ4dmNqb2dKSGRvYVhSbE8xeHVYRzR2S2lvZ1FXUnRhVzVNYjJOcklHTnZiWEJ2Ym1WdWRDQXFMMXh1SkdGa2JXbHViRzlqYXkxdVpXZGhkR2wyWlMxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUmhaRzFwYm14dlkyc3RkR1Y0ZEMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YXp0Y2JpUmhaRzFwYm14dlkyc3RZbUZqYTJkeWIzVnVaQzFqYjJ4dmNqb2dJMll3WmpCbU1EdGNibHh1SkdKMWRIUnZiaTF3Y21sdFlYSjVMV052Ykc5eU9pQWtaM0psWlc0N1hHNGtZblYwZEc5dUxYUmxlSFF0WTI5c2IzSTZJQ1IzYUdsMFpUdGNibHh1SkhOM2FYUmphQzExYm1Ob1pXTnJaV1F0WW1jNklDUnphV3gyWlhJN1hHNGtjM2RwZEdOb0xYVnVZMmhsWTJ0bFpDMWpiMnh2Y2pvZ0pITmxZWE5vWld4c08xeHVKSE4zYVhSamFDMWphR1ZqYTJWa0xXSm5PaUFrYzNSdmJtVXRaM0psWlc0dGJHbG5hSFE3WEc0a2MzZHBkR05vTFdOb1pXTnJaV1F0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVJ6ZDJsMFkyZ3RaR2x6WVdKc1pXUXRZbWM2SUNSemFXeDJaWEl0YkdsbmFIUTdYRzRrYzNkcGRHTm9MV1JwYzJGaWJHVmtMV052Ykc5eU9pQWtjMmxzZG1WeU8xeHVYRzR2S2lCVVlXSnpJR052YlhCdmJtVnVkQ0FxTDF4dUpIUmhZaTF1WVhacFoyRjBhVzl1TFdKbk9pQWpaakptTW1ZeU8xeHVKSFJoWWkxc1lXSmxiQzFqYjJ4dmNqb2dJelkxTnpjM1pqdGNiaVIwWVdJdGFYUmxiUzFtYjI1MExYTnBlbVU2SURFemNIZzdYRzRrZEdGaUxXeHBibVV0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVIwWVdJdGFHVnBaMmgwT2lBME1IQjRPMXh1SWl3aVhHNGdJRUJ0WldScFlTQW9iV0Y0TFhkcFpIUm9PaUEwTURCd2VDa2dlMXh1SUNBZ0lDNXdiM010ZDNKaGNIQmxjaXhjYmlBZ0lDQXVjRzl6SUh0Y2JpQWdJQ0FnSUdobGFXZG9kRG9nTVRBd0pUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQkFiV1ZrYVdFZ0tHMXBiaTEzYVdSMGFEb2dOREF4Y0hncElIdGNiaUFnSUNBdWNHOXpMWGR5WVhCd1pYSWdlMXh1SUNBZ0lDQWdjRzl6YVhScGIyNDZJSEpsYkdGMGFYWmxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDNXdiM01zWEc0Z0lDQWdMbk5vWVdSdmR5QjdYRzRnSUNBZ0lDQndiM05wZEdsdmJqb2djbVZzWVhScGRtVTdYRzRnSUNBZ0lDQjZMV2x1WkdWNE9pQXlPMXh1SUNBZ0lDQWdiV0Z5WjJsdU9pQXdJR0YxZEc4N1hHNGdJQ0FnSUNCM2FXUjBhRG9nTXpRM2NIZzdYRzRnSUNBZ0lDQm9aV2xuYUhRNklEYzJNWEI0TzF4dUlDQWdJQ0FnWW1GamEyZHliM1Z1WkMxcGJXRm5aVG9nZFhKc0tDNHZZWE56WlhSekwxQlBVeTV3Ym1jcE8xeHVJQ0FnSUNBZ1ltRmphMmR5YjNWdVpDMXphWHBsT2lCamIzWmxjanRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXVjRzl6SUh0Y2JpQWdJQ0FnSUhWelpYSXRjMlZzWldOME9pQnViMjVsTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzV6YUdGa2IzY2dlMXh1SUNBZ0lDQWdaR2x6Y0d4aGVUb2dibTl1WlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JBYzNWd2NHOXlkSE1nS0dacGJIUmxjam9nWW5KcFoyaDBibVZ6Y3lnd0tTa2dlMXh1SUNBZ0lDQWdMbk5vWVdSdmR5QjdYRzRnSUNBZ0lDQWdJR1JwYzNCc1lYazZJR0pzYjJOck8xeHVJQ0FnSUNBZ0lDQndiM05wZEdsdmJqb2dZV0p6YjJ4MWRHVTdYRzRnSUNBZ0lDQWdJSG90YVc1a1pYZzZJREE3WEc0Z0lDQWdJQ0FnSUdacGJIUmxjam9nWW5KcFoyaDBibVZ6Y3lnd0tTQmliSFZ5S0RKd2VDazdYRzRnSUNBZ0lDQWdJRzl3WVdOcGRIazZJREF1TkR0Y2JpQWdJQ0FnSUNBZ1lXNXBiV0YwYVc5dU9pQnphR0ZrYjNjZ01DNDRjeUJsWVhObExXOTFkQ0JtYjNKM1lYSmtjenRjYmlBZ0lDQWdJQ0FnZEhKaGJuTm1iM0p0T2lCMGNtRnVjMnhoZEdVb01UVndlQ3dnTVRWd2VDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc0aVhYMD0gKi88L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtDQSxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFDLEFBQ3ZCLDJCQUFZLENBQ1osSUFBSSxlQUFDLENBQUMsQUFDSixNQUFNLENBQUUsSUFBSSxBQUNkLENBQUMsQUFDSCxDQUFDLEFBRUgsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUN2QixZQUFZLGVBQUMsQ0FBQyxBQUNaLFFBQVEsQ0FBRSxRQUFRLEFBQ3BCLENBQUMsQUFFRCxtQkFBSSxDQUNKLE9BQU8sZUFBQyxDQUFDLEFBQ1AsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsT0FBTyxDQUFFLENBQUMsQ0FDVixNQUFNLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDZCxLQUFLLENBQUUsS0FBSyxDQUNaLE1BQU0sQ0FBRSxLQUFLLENBQ2IsZ0JBQWdCLENBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxDQUN2QyxlQUFlLENBQUUsS0FBSyxBQUN4QixDQUFDLEFBRUQsSUFBSSxlQUFDLENBQUMsQUFDSixtQkFBbUIsQ0FBRSxJQUFJLENBQ2pCLFdBQVcsQ0FBRSxJQUFJLEFBQzNCLENBQUMsQUFFRCxPQUFPLGVBQUMsQ0FBQyxBQUNQLE9BQU8sQ0FBRSxJQUFJLEFBQ2YsQ0FBQyxBQUVELFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxBQUFDLENBQUMsQUFDakMsT0FBTyxlQUFDLENBQUMsQUFDUCxPQUFPLENBQUUsS0FBSyxDQUNkLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLE9BQU8sQ0FBRSxDQUFDLENBQ1YsTUFBTSxDQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FDL0IsT0FBTyxDQUFFLEdBQUcsQ0FDWixpQkFBaUIsQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ3hDLFNBQVMsQ0FBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQ2hELGlCQUFpQixDQUFFLFVBQVUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2hDLFNBQVMsQ0FBRSxVQUFVLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxBQUMxQyxDQUFDLEFBQ0gsQ0FBQyxBQUNILENBQUMifQ== */';
    append(document.head, style);
  }

  function create_main_fragment$3(component, ctx) {
    var div2,
      div0,
      text0,
      div1,
      text1,
      slot_content_default = component._slotted.default,
      text2;

    var printer = new Printer({
      root: component.root,
      store: component.store,
    });

    component.refs.printer = printer;

    var screen = new Screen({
      root: component.root,
      store: component.store,
      slots: { default: createFragment() },
    });

    component.refs.screen = screen;

    var keypad = new Keypad({
      root: component.root,
      store: component.store,
    });

    component.refs.keypad = keypad;

    return {
      c: function create() {
        div2 = createElement('div');
        div0 = createElement('div');
        text0 = createText('\n  ');
        div1 = createElement('div');
        printer._fragment.c();
        text1 = createText('\n      ');
        screen._fragment.c();
        text2 = createText('\n    ');
        keypad._fragment.c();
        div0.className = 'shadow svelte-1jjnjgp';
        addLoc(div0, file$3, 2, 2, 29);
        div1.className = 'pos svelte-1jjnjgp';
        addLoc(div1, file$3, 3, 2, 58);
        div2.className = 'pos-wrapper svelte-1jjnjgp';
        addLoc(div2, file$3, 1, 0, 1);
      },

      m: function mount(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div2, text0);
        append(div2, div1);
        printer._mount(div1, null);
        append(div1, text1);

        if (slot_content_default) {
          append(screen._slotted.default, slot_content_default);
        }

        screen._mount(div1, null);
        append(div1, text2);
        keypad._mount(div1, null);
      },

      p: noop,

      d: function destroy(detach) {
        if (detach) {
          detachNode(div2);
        }

        printer.destroy();
        if (component.refs.printer === printer) component.refs.printer = null;

        if (slot_content_default) {
          reinsertChildren(screen._slotted.default, slot_content_default);
        }

        screen.destroy();
        if (component.refs.screen === screen) component.refs.screen = null;
        keypad.destroy();
        if (component.refs.keypad === keypad) component.refs.keypad = null;
      },
    };
  }

  function POS(options) {
    this._debugName = '<POS>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1({}, options.data);
    this._intro = true;

    this._slotted = options.slots || {};

    if (!document.getElementById('svelte-1jjnjgp-style')) add_css$3();

    this._fragment = create_main_fragment$3(this, this._state);

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(POS.prototype, protoDev);

  POS.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/Card.html generated by Svelte v2.16.1 */

  function data$2() {
    return {
      isInserted: false,
      isDragging: false,
      isAboveScreen: false,
    };
  }
  var methods$2 = {
    toggleCard() {
      const isInserted = !this.get().isInserted;
      this.set({ isInserted });

      if (isInserted) {
        setTimeout(() => {
          HardwareManager.fire('cardToggled', true);
          HardwareManager.fire('cardInserted');
        }, 500);
      } else {
        HardwareManager.fire('cardToggled', false);
        HardwareManager.fire('cardRemoved');
      }
    },
    _onKeyup(e) {
      const keyCode = e.charCode || e.which || e.keyCode;
      /** If input is focused or a key other than 'spacebar' clicked, do nothing */
      if (document.activeElement.tagName === 'INPUT' || keyCode !== 32) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      this.toggleCard();
    },
  };

  function oncreate$2() {
    const cardEl = this.refs.card;

    let mouseStartPos = null;
    let elPos = null;
    let nfcTimeout;

    const resetDrag = () => {
      clearTimeout(nfcTimeout);
      nfcTimeout = null;

      cardEl.style.top = '';
      cardEl.style.left = '';

      this.set({ isDragging: false, isAboveScreen: false });

      mouseStartPos = null;
      elPos = null;
    };

    const checkAboveScreen = (x, y) =>
      Array.from(document.elementsFromPoint(x, y)).some(n =>
        n.classList.contains('screen'),
      );

    const onMousedown = e => {
      mouseStartPos = { x: e.clientX, y: e.clientY };
      elPos = { x: cardEl.offsetLeft, y: cardEl.offsetTop };
    };

    const onMouseup = e => {
      if (mouseStartPos.x === e.clientX && mouseStartPos.y === e.clientY) {
        this.toggleCard();
      }
      resetDrag();
    };

    const onMousemove = e => {
      const { isInserted, isDragging } = this.get();
      if (!mouseStartPos || isInserted) {
        return;
      }

      if (!isDragging) {
        this.set({ isDragging: true });
      }

      const newPos = {
        x: elPos.x + e.clientX - mouseStartPos.x,
        y: elPos.y + e.clientY - mouseStartPos.y,
      };
      cardEl.style.left = `${newPos.x}px`;
      cardEl.style.top = `${newPos.y}px`;

      const isAboveScreen = checkAboveScreen(e.clientX, e.clientY);

      this.set({ isAboveScreen });

      if (isAboveScreen) {
        if (!nfcTimeout) {
          nfcTimeout = setTimeout(() => {
            HardwareManager.fire('nfcStart');
          }, 1000);
        }
      } else {
        clearTimeout(nfcTimeout);
        nfcTimeout = null;
      }
    };

    cardEl.addEventListener('mousedown', onMousedown);
    cardEl.addEventListener('mouseup', onMouseup);
    document.body.addEventListener('mouseout', resetDrag);
    document.body.addEventListener('mousemove', onMousemove);

    this.on('destroy', () => {
      cardEl.removeEventListener('mousedown', onMousedown);
      cardEl.removeEventListener('mouseup', onMouseup);
      document.body.removeEventListener('mouseout', resetDrag);
      document.body.removeEventListener('mousemove', onMousemove);
    });
  }
  const file$4 = 'packages/pos/simulator/view/pos/Card.html';

  function add_css$4() {
    var style = createElement('style');
    style.id = 'svelte-ud72g5-style';
    style.textContent =
      '.credit-card.svelte-ud72g5{position:absolute;width:240px;height:370px;left:45px;top:780px;z-index:1;background-image:url(./assets/creditcard.png);cursor:pointer;filter:drop-shadow(8px 8px 2px rgba(0, 0, 0, 0.5));-webkit-transition:all 0.3s ease;transition:all 0.3s ease}.credit-card.svelte-ud72g5:hover{-webkit-transform:scale(1.04);transform:scale(1.04)}.credit-card.svelte-ud72g5:not(:hover):not(.is-inserted){filter:drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))}.credit-card.is-dragging.svelte-ud72g5{z-index:999999;cursor:-webkit-grabbing;cursor:grabbing;-webkit-transition:all 0.3s ease, top 0s, left 0s;transition:all 0.3s ease, top 0s, left 0s}.credit-card.is-dragging.svelte-ud72g5:not(.is-above-screen){filter:drop-shadow(18px 18px 6px rgba(0, 0, 0, 0.5))}.credit-card.is-above-screen.svelte-ud72g5{opacity:0.8;-webkit-transform:rotateZ(-25deg);transform:rotateZ(-25deg)}.credit-card.is-inserted.svelte-ud72g5{-webkit-transform:translateY(-180px);transform:translateY(-180px)}@media(max-width: 400px){.credit-card.svelte-ud72g5{display:none\n  }}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyZC5odG1sIiwic291cmNlcyI6WyJDYXJkLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiPHN2ZWx0ZTp3aW5kb3cgb246a2V5dXA9XCJfb25LZXl1cChldmVudClcIiAvPlxuXG48ZGl2XG4gIGNsYXNzPVwiY3JlZGl0LWNhcmRcIlxuICBjbGFzczppcy1pbnNlcnRlZD1cImlzSW5zZXJ0ZWRcIlxuICBjbGFzczppcy1kcmFnZ2luZz1cImlzRHJhZ2dpbmdcIlxuICBjbGFzczppcy1hYm92ZS1zY3JlZW49XCJpc0Fib3ZlU2NyZWVuXCJcbiAgcmVmOmNhcmRcbj48L2Rpdj5cblxuPHNjcmlwdD5cbiAgaW1wb3J0IHsgSGFyZHdhcmVNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vaW5kZXguanMnO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBkYXRhKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNJbnNlcnRlZDogZmFsc2UsXG4gICAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgICBpc0Fib3ZlU2NyZWVuOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfSxcbiAgICBvbmNyZWF0ZSgpIHtcbiAgICAgIGNvbnN0IGNhcmRFbCA9IHRoaXMucmVmcy5jYXJkO1xuXG4gICAgICBsZXQgbW91c2VTdGFydFBvcyA9IG51bGw7XG4gICAgICBsZXQgZWxQb3MgPSBudWxsO1xuICAgICAgbGV0IG5mY1RpbWVvdXQ7XG5cbiAgICAgIGNvbnN0IHJlc2V0RHJhZyA9ICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KG5mY1RpbWVvdXQpO1xuICAgICAgICBuZmNUaW1lb3V0ID0gbnVsbDtcblxuICAgICAgICBjYXJkRWwuc3R5bGUudG9wID0gJyc7XG4gICAgICAgIGNhcmRFbC5zdHlsZS5sZWZ0ID0gJyc7XG5cbiAgICAgICAgdGhpcy5zZXQoeyBpc0RyYWdnaW5nOiBmYWxzZSwgaXNBYm92ZVNjcmVlbjogZmFsc2UgfSk7XG5cbiAgICAgICAgbW91c2VTdGFydFBvcyA9IG51bGw7XG4gICAgICAgIGVsUG9zID0gbnVsbDtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGNoZWNrQWJvdmVTY3JlZW4gPSAoeCwgeSkgPT5cbiAgICAgICAgQXJyYXkuZnJvbShkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCh4LCB5KSkuc29tZShuID0+XG4gICAgICAgICAgbi5jbGFzc0xpc3QuY29udGFpbnMoJ3NjcmVlbicpLFxuICAgICAgICApO1xuXG4gICAgICBjb25zdCBvbk1vdXNlZG93biA9IGUgPT4ge1xuICAgICAgICBtb3VzZVN0YXJ0UG9zID0geyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9O1xuICAgICAgICBlbFBvcyA9IHsgeDogY2FyZEVsLm9mZnNldExlZnQsIHk6IGNhcmRFbC5vZmZzZXRUb3AgfTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG9uTW91c2V1cCA9IGUgPT4ge1xuICAgICAgICBpZiAobW91c2VTdGFydFBvcy54ID09PSBlLmNsaWVudFggJiYgbW91c2VTdGFydFBvcy55ID09PSBlLmNsaWVudFkpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZUNhcmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldERyYWcoKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG9uTW91c2Vtb3ZlID0gZSA9PiB7XG4gICAgICAgIGNvbnN0IHsgaXNJbnNlcnRlZCwgaXNEcmFnZ2luZyB9ID0gdGhpcy5nZXQoKTtcbiAgICAgICAgaWYgKCFtb3VzZVN0YXJ0UG9zIHx8IGlzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICB0aGlzLnNldCh7IGlzRHJhZ2dpbmc6IHRydWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdQb3MgPSB7XG4gICAgICAgICAgeDogZWxQb3MueCArIGUuY2xpZW50WCAtIG1vdXNlU3RhcnRQb3MueCxcbiAgICAgICAgICB5OiBlbFBvcy55ICsgZS5jbGllbnRZIC0gbW91c2VTdGFydFBvcy55LFxuICAgICAgICB9O1xuICAgICAgICBjYXJkRWwuc3R5bGUubGVmdCA9IGAke25ld1Bvcy54fXB4YDtcbiAgICAgICAgY2FyZEVsLnN0eWxlLnRvcCA9IGAke25ld1Bvcy55fXB4YDtcblxuICAgICAgICBjb25zdCBpc0Fib3ZlU2NyZWVuID0gY2hlY2tBYm92ZVNjcmVlbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG5cbiAgICAgICAgdGhpcy5zZXQoeyBpc0Fib3ZlU2NyZWVuIH0pO1xuXG4gICAgICAgIGlmIChpc0Fib3ZlU2NyZWVuKSB7XG4gICAgICAgICAgaWYgKCFuZmNUaW1lb3V0KSB7XG4gICAgICAgICAgICBuZmNUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIEhhcmR3YXJlTWFuYWdlci5maXJlKCduZmNTdGFydCcpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsZWFyVGltZW91dChuZmNUaW1lb3V0KTtcbiAgICAgICAgICBuZmNUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY2FyZEVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2Vkb3duKTtcbiAgICAgIGNhcmRFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZXVwKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCByZXNldERyYWcpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlbW92ZSk7XG5cbiAgICAgIHRoaXMub24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAgIGNhcmRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBvbk1vdXNlZG93bik7XG4gICAgICAgIGNhcmRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25Nb3VzZXVwKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHJlc2V0RHJhZyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZW1vdmUpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBtZXRob2RzOiB7XG4gICAgICB0b2dnbGVDYXJkKCkge1xuICAgICAgICBjb25zdCBpc0luc2VydGVkID0gIXRoaXMuZ2V0KCkuaXNJbnNlcnRlZDtcbiAgICAgICAgdGhpcy5zZXQoeyBpc0luc2VydGVkIH0pO1xuXG4gICAgICAgIGlmIChpc0luc2VydGVkKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBIYXJkd2FyZU1hbmFnZXIuZmlyZSgnY2FyZFRvZ2dsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIEhhcmR3YXJlTWFuYWdlci5maXJlKCdjYXJkSW5zZXJ0ZWQnKTtcbiAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEhhcmR3YXJlTWFuYWdlci5maXJlKCdjYXJkVG9nZ2xlZCcsIGZhbHNlKTtcbiAgICAgICAgICBIYXJkd2FyZU1hbmFnZXIuZmlyZSgnY2FyZFJlbW92ZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9vbktleXVwKGUpIHtcbiAgICAgICAgY29uc3Qga2V5Q29kZSA9IGUuY2hhckNvZGUgfHwgZS53aGljaCB8fCBlLmtleUNvZGU7XG4gICAgICAgIC8qKiBJZiBpbnB1dCBpcyBmb2N1c2VkIG9yIGEga2V5IG90aGVyIHRoYW4gJ3NwYWNlYmFyJyBjbGlja2VkLCBkbyBub3RoaW5nICovXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcgfHwga2V5Q29kZSAhPT0gMzIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLnRvZ2dsZUNhcmQoKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuLmNyZWRpdC1jYXJkIHtcblxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB3aWR0aDogMjQwcHg7XG4gICAgaGVpZ2h0OiAzNzBweDtcbiAgICBsZWZ0OiA0NXB4O1xuICAgIHRvcDogNzgwcHg7XG4gICAgei1pbmRleDogMTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi9hc3NldHMvY3JlZGl0Y2FyZC5wbmcpO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDhweCA4cHggMnB4IHJnYmEoMCwgMCwgMCwgMC41KSk7XG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gIH1cblxuLmNyZWRpdC1jYXJkOmhvdmVyIHtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxLjA0KTtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA0KTtcbiAgICB9XG5cbi5jcmVkaXQtY2FyZDpub3QoOmhvdmVyKTpub3QoLmlzLWluc2VydGVkKSB7XG4gICAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDJweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC41KSk7XG4gICAgfVxuXG4uY3JlZGl0LWNhcmQuaXMtZHJhZ2dpbmcge1xuICAgICAgei1pbmRleDogOTk5OTk5O1xuICAgICAgY3Vyc29yOiAtd2Via2l0LWdyYWJiaW5nO1xuICAgICAgY3Vyc29yOiBncmFiYmluZztcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSwgdG9wIDBzLCBsZWZ0IDBzO1xuICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZSwgdG9wIDBzLCBsZWZ0IDBzO1xuICAgIH1cblxuLmNyZWRpdC1jYXJkLmlzLWRyYWdnaW5nOm5vdCguaXMtYWJvdmUtc2NyZWVuKSB7XG4gICAgICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMThweCAxOHB4IDZweCByZ2JhKDAsIDAsIDAsIDAuNSkpO1xuICAgICAgfVxuXG4uY3JlZGl0LWNhcmQuaXMtYWJvdmUtc2NyZWVuIHtcbiAgICAgIG9wYWNpdHk6IDAuODtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGVaKC0yNWRlZyk7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlWigtMjVkZWcpO1xuICAgIH1cblxuLmNyZWRpdC1jYXJkLmlzLWluc2VydGVkIHtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xODBweCk7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTgwcHgpO1xuICAgIH1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDQwMHB4KSB7XG5cbi5jcmVkaXQtY2FyZCB7XG4gICAgICBkaXNwbGF5OiBub25lXG4gIH1cbiAgICB9XG5cbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5QWJXRnRZbUV2YzNSNWJHVnpMMk52Ykc5eWN5NXdZM056SWl3aWJtOWtaVjl0YjJSMWJHVnpMMEJ0WVcxaVlTOXpkSGxzWlhNdmRHaGxiV1V1Y0dOemN5SXNJbkJoWTJ0aFoyVnpMM0J2Y3k5emFXMTFiR0YwYjNJdmRtbGxkeTl3YjNNdlEyRnlaQzVvZEcxc0lsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFYVkNRU3hSUVVGUk96dEJRMmhDVWl4dFFrRkJiVUk3TzBGQlUyNUNMSEZDUVVGeFFqczdRVUZOY2tJc2MwSkJRWE5DT3p0QlFVMTBRaXg1UWtGQmVVSTdPMEZCWlhwQ0xHMUNRVUZ0UWpzN1FVTXhRMnBDT3p0SlFVdEZMR3RDUVVGclFqdEpRVU5zUWl4WlFVRlpPMGxCUTFvc1lVRkJZVHRKUVVOaUxGVkJRVlU3U1VGRFZpeFZRVUZWTzBsQlExWXNWVUZCVlR0SlFVTldMRGhEUVVFNFF6dEpRVU01UXl4bFFVRmxPMGxCUTJZc2JVUkJRVzFFTzBsQlEyNUVMR2xEUVVGNVFqdEpRVUY2UWl4NVFrRkJlVUk3UlVFMFFqTkNPenRCUVRGQ1JUdE5RVU5GTERoQ1FVRnpRanRqUVVGMFFpeHpRa0ZCYzBJN1NVRkRlRUk3TzBGQlJVRTdUVUZEUlN4dFJFRkJiVVE3U1VGRGNrUTdPMEZCUlVFN1RVRkRSU3hsUVVGbE8wMUJRMllzZDBKQlFXZENPMDFCUVdoQ0xHZENRVUZuUWp0TlFVTm9RaXhyUkVGQk1FTTdUVUZCTVVNc01FTkJRVEJETzBsQlN6VkRPenRCUVVoRk8xRkJRMFVzY1VSQlFYRkVPMDFCUTNaRU96dEJRVWRHTzAxQlEwVXNXVUZCV1R0TlFVTmFMR3REUVVFd1FqdGpRVUV4UWl3d1FrRkJNRUk3U1VGRE5VSTdPMEZCUlVFN1RVRkRSU3h4UTBGQk5rSTdZMEZCTjBJc05rSkJRVFpDTzBsQlF5OUNPenRCUVhoRFFUczdRVUZFUmp0TlFVVkpPMFZCZDBOS08wbEJka05GSWl3aVptbHNaU0k2SW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZRMkZ5WkM1b2RHMXNJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSkdKc1lXTnJPaUFqTURBd08xeHVYRzRrZDJocGRHVTZJQ05tWm1ZN1hHNGtjMlZoYzJobGJHdzZJQ05tTVdZeFpqRTdYRzVjYmlSemRHOXVaUzFuY21WbGJqb2dJelJtWWpNME1UdGNiaVJ6ZEc5dVpTMW5jbVZsYmkxa1lYSnJPaUFqTVRVek5USXlPMXh1SkhOMGIyNWxMV2R5WldWdUxXeHBaMmgwT2lBallUWmtaamhqTzF4dVhHNGtaM0poZVMxa1lYSnJaWEk2SUNNek5UTTFNelU3WEc0a1ozSmhlUzFrWVhKck9pQWpOREkxT1RZek8xeHVKR2R5WVhrNklDTTNaVGRsTjJVN1hHNGtaM0poZVMxc2FXZG9kRG9nSTJJMVlqVmlOVHRjYmlSbmNtRjVMV3hwWjJoMFpYSTZJQ05sTTJVMlpUYzdYRzRrWjNKaGVTMXNhV2RvZEdWemREb2dJMll4WmpKbU16dGNibHh1SkhOcGJIWmxjam9nSTJKaFlqbGlPVHRjYmlSemFXeDJaWEl0YkdsbmFIUTZJQ05rWTJSalpHTTdYRzVjYmlSeVpXUTZJQ05tWmpGaE1XRTdYRzRrY21Wa0xXUmhjbXM2SUNOa05UQXdNREE3WEc0a2NtVmtMV3hwWjJoME9pQWpaVGcxWWpWaU8xeHVYRzR2S2lBdExTMGdLaTljYmx4dUpHSnNkV1U2SUNNeU1UazJaak03WEc0a1lteDFaUzFrWVhKck9pQWpNVFUyTldNd08xeHVYRzRrWW14MVpTMW5jbUY1TFd4cFoyaDBPaUFqT1RCaE5HRmxPMXh1SkdKc2RXVXRaM0poZVRvZ0l6WXdOMlE0WWp0Y2JpUmliSFZsTFdkeVlYa3RaR0Z5YXpvZ0l6UTFOV0UyTkR0Y2JseHVKR2R5WldWdU9pQWpOR1ZpWmpGaE8xeHVKR2R5WldGdUxXeHBaMmgwT2lBak5HTmhaalV3TzF4dUpHZHlaV1Z1TFdSaGNtczZJQ016WkdFeE1HWTdYRzRrWjNKbFpXNHRjR0Y1YldWdWREb2dJelF5T1RnME1UdGNibHh1SkhCMWNuQnNaVG9nSTJGaU5EZGlZenRjYmlSd2RYSndiR1V0WkdGeWF6b2dJemM1TUdVNFlqdGNiaVJ3ZFhKd2JHVXRiR2xuYUhRNklDTmtaamM0WldZN1hHNWNiaVIwWldGc09pQWpNVGxsTTJJeE8xeHVKSFJsWVd3dFpHRnlhem9nSXpBd1lXWTVPRHRjYmx4dUpIbGxiR3h2ZHpvZ0kyWTVZVGd5TlR0Y2JpUjVaV3hzYjNjdFpHRnlhem9nSTJZMU4yWXhOenRjYmlJc0lrQnBiWEJ2Y25RZ0oyTnZiRzl5Y3k1d1kzTnpKenRjYmx4dUpHUmxabUYxYkhRdGRHVjRkQzFqYjJ4dmNqb2dKR2R5WVhrdFpHRnlhMlZ5TzF4dUpHUmxabUYxYkhRdFptOXVkQzF6YVhwbE9pQXhNM0I0TzF4dVhHNGtZWEJ3TFdKbkxXTnZiRzl5T2lBa1ozSmhlUzFzYVdkb2RHVnlPMXh1WEc0dktpb2dVbTkzSUdOdmJYQnZibVZ1ZENBcUwxeHVKSEp2ZHkxd1lXUmthVzVuT2lBeE1uQjRJREUxY0hnN1hHNGtjbTkzTFhSdmNDMW9aV2xuYUhRNklHRjFkRzg3WEc0a2NtOTNMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUmxjanRjYmlSeWIzY3RZbWN0WTI5c2IzSTZJQ1IzYUdsMFpUdGNiaVJ5YjNjdGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YTJWeU8xeHVKSEp2ZHkxelpXTnZibVJoY25rdFkyOXNiM0k2SUNSbmNtRjVPMXh1SkhKdmR5MW1iMjUwTFhOcGVtVTZJREUwY0hnN1hHNWNiaThxS2lCSmJuQjFkQ0JqYjIxd2IyNWxiblFnS2k5Y2JpUnBibkIxZEMxaWIzSmtaWEl0WTI5c2IzSTZJQ1JuY21GNUxXeHBaMmgwWlhJN1hHNGthVzV3ZFhRdFptOWpkWE10WW05eVpHVnlMV052Ykc5eU9pQWtjM1J2Ym1VdFozSmxaVzQ3WEc0a2FXNXdkWFF0YVc1MllXeHBaQzFpYjNKa1pYSXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzRrYVc1d2RYUXRaWEp5YjNJdFkyOXNiM0k2SUNSeVpXUXRiR2xuYUhRN1hHNWNiaThxS2lCRWFXRnNiMmNnWTI5dGNHOXVaVzUwSUNvdlhHNGtaR2xoYkc5bkxXNWxaMkYwYVhabExXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR1JwWVd4dlp5MXdiM05wZEdsMlpTMWpiMnh2Y2pvZ0pITjBiMjVsTFdkeVpXVnVPMXh1SkdScFlXeHZaeTFqYjI1bWFYSnRZWFJwYjI0dGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YXp0Y2JpUmthV0ZzYjJjdFkyOXVabWx5YldGMGFXOXVMWFJsZUhRdFkyOXNiM0k2SUNSM2FHbDBaVHRjYmx4dUx5b3FJRUZrYldsdVRHOWpheUJqYjIxd2IyNWxiblFnS2k5Y2JpUmhaRzFwYm14dlkyc3RibVZuWVhScGRtVXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzRrWVdSdGFXNXNiMk5yTFhSbGVIUXRZMjlzYjNJNklDUm5jbUY1TFdSaGNtczdYRzRrWVdSdGFXNXNiMk5yTFdKaFkydG5jbTkxYm1RdFkyOXNiM0k2SUNObU1HWXdaakE3WEc1Y2JpUmlkWFIwYjI0dGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkdKMWRIUnZiaTEwWlhoMExXTnZiRzl5T2lBa2QyaHBkR1U3WEc1Y2JpUnpkMmwwWTJndGRXNWphR1ZqYTJWa0xXSm5PaUFrYzJsc2RtVnlPMXh1SkhOM2FYUmphQzExYm1Ob1pXTnJaV1F0WTI5c2IzSTZJQ1J6WldGemFHVnNiRHRjYmlSemQybDBZMmd0WTJobFkydGxaQzFpWnpvZ0pITjBiMjVsTFdkeVpXVnVMV3hwWjJoME8xeHVKSE4zYVhSamFDMWphR1ZqYTJWa0xXTnZiRzl5T2lBa1ozSmxaVzQ3WEc0a2MzZHBkR05vTFdScGMyRmliR1ZrTFdKbk9pQWtjMmxzZG1WeUxXeHBaMmgwTzF4dUpITjNhWFJqYUMxa2FYTmhZbXhsWkMxamIyeHZjam9nSkhOcGJIWmxjanRjYmx4dUx5b2dWR0ZpY3lCamIyMXdiMjVsYm5RZ0tpOWNiaVIwWVdJdGJtRjJhV2RoZEdsdmJpMWlaem9nSTJZeVpqSm1NanRjYmlSMFlXSXRiR0ZpWld3dFkyOXNiM0k2SUNNMk5UYzNOMlk3WEc0a2RHRmlMV2wwWlcwdFptOXVkQzF6YVhwbE9pQXhNM0I0TzF4dUpIUmhZaTFzYVc1bExXTnZiRzl5T2lBa1ozSmxaVzQ3WEc0a2RHRmlMV2hsYVdkb2REb2dOREJ3ZUR0Y2JpSXNJbHh1SUNBdVkzSmxaR2wwTFdOaGNtUWdlMXh1SUNBZ0lFQnRaV1JwWVNBb2JXRjRMWGRwWkhSb09pQTBNREJ3ZUNrZ2UxeHVJQ0FnSUNBZ1pHbHpjR3hoZVRvZ2JtOXVaVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQndiM05wZEdsdmJqb2dZV0p6YjJ4MWRHVTdYRzRnSUNBZ2QybGtkR2c2SURJME1IQjRPMXh1SUNBZ0lHaGxhV2RvZERvZ016Y3djSGc3WEc0Z0lDQWdiR1ZtZERvZ05EVndlRHRjYmlBZ0lDQjBiM0E2SURjNE1IQjRPMXh1SUNBZ0lIb3RhVzVrWlhnNklERTdYRzRnSUNBZ1ltRmphMmR5YjNWdVpDMXBiV0ZuWlRvZ2RYSnNLQzR2WVhOelpYUnpMMk55WldScGRHTmhjbVF1Y0c1bktUdGNiaUFnSUNCamRYSnpiM0k2SUhCdmFXNTBaWEk3WEc0Z0lDQWdabWxzZEdWeU9pQmtjbTl3TFhOb1lXUnZkeWc0Y0hnZ09IQjRJREp3ZUNCeVoySmhLREFzSURBc0lEQXNJREF1TlNrcE8xeHVJQ0FnSUhSeVlXNXphWFJwYjI0NklHRnNiQ0F3TGpOeklHVmhjMlU3WEc1Y2JpQWdJQ0FtT21odmRtVnlJSHRjYmlBZ0lDQWdJSFJ5WVc1elptOXliVG9nYzJOaGJHVW9NUzR3TkNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmpwdWIzUW9PbWh2ZG1WeUtUcHViM1FvTG1sekxXbHVjMlZ5ZEdWa0tTQjdYRzRnSUNBZ0lDQm1hV3gwWlhJNklHUnliM0F0YzJoaFpHOTNLREp3ZUNBeWNIZ2dNbkI0SUhKblltRW9NQ3dnTUN3Z01Dd2dNQzQxS1NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmk1cGN5MWtjbUZuWjJsdVp5QjdYRzRnSUNBZ0lDQjZMV2x1WkdWNE9pQTVPVGs1T1RrN1hHNGdJQ0FnSUNCamRYSnpiM0k2SUdkeVlXSmlhVzVuTzF4dUlDQWdJQ0FnZEhKaGJuTnBkR2x2YmpvZ1lXeHNJREF1TTNNZ1pXRnpaU3dnZEc5d0lEQnpMQ0JzWldaMElEQnpPMXh1WEc0Z0lDQWdJQ0FtT201dmRDZ3VhWE10WVdKdmRtVXRjMk55WldWdUtTQjdYRzRnSUNBZ0lDQWdJR1pwYkhSbGNqb2daSEp2Y0MxemFHRmtiM2NvTVRod2VDQXhPSEI0SURad2VDQnlaMkpoS0RBc0lEQXNJREFzSURBdU5Ta3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lDWXVhWE10WVdKdmRtVXRjMk55WldWdUlIdGNiaUFnSUNBZ0lHOXdZV05wZEhrNklEQXVPRHRjYmlBZ0lDQWdJSFJ5WVc1elptOXliVG9nY205MFlYUmxXaWd0TWpWa1pXY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDWXVhWE10YVc1elpYSjBaV1FnZTF4dUlDQWdJQ0FnZEhKaGJuTm1iM0p0T2lCMGNtRnVjMnhoZEdWWktDMHhPREJ3ZUNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzRpWFgwPSAqLzwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBZ0pBLFlBQVksY0FBQyxDQUFDLEFBRVYsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLEtBQUssQ0FDWixNQUFNLENBQUUsS0FBSyxDQUNiLElBQUksQ0FBRSxJQUFJLENBQ1YsR0FBRyxDQUFFLEtBQUssQ0FDVixPQUFPLENBQUUsQ0FBQyxDQUNWLGdCQUFnQixDQUFFLElBQUksdUJBQXVCLENBQUMsQ0FDOUMsTUFBTSxDQUFFLE9BQU8sQ0FDZixNQUFNLENBQUUsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ25ELGtCQUFrQixDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNqQyxVQUFVLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEFBQzNCLENBQUMsQUFFSCwwQkFBWSxNQUFNLEFBQUMsQ0FBQyxBQUNkLGlCQUFpQixDQUFFLE1BQU0sSUFBSSxDQUFDLENBQ3RCLFNBQVMsQ0FBRSxNQUFNLElBQUksQ0FBQyxBQUNoQyxDQUFDLEFBRUwsMEJBQVksS0FBSyxNQUFNLENBQUMsS0FBSyxZQUFZLENBQUMsQUFBQyxDQUFDLEFBQ3RDLE1BQU0sQ0FBRSxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQUFDckQsQ0FBQyxBQUVMLFlBQVksWUFBWSxjQUFDLENBQUMsQUFDcEIsT0FBTyxDQUFFLE1BQU0sQ0FDZixNQUFNLENBQUUsZ0JBQWdCLENBQ3hCLE1BQU0sQ0FBRSxRQUFRLENBQ2hCLGtCQUFrQixDQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ2xELFVBQVUsQ0FBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxBQUM1QyxDQUFDLEFBRUwsWUFBWSwwQkFBWSxLQUFLLGdCQUFnQixDQUFDLEFBQUMsQ0FBQyxBQUN4QyxNQUFNLENBQUUsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEFBQ3ZELENBQUMsQUFFUCxZQUFZLGdCQUFnQixjQUFDLENBQUMsQUFDeEIsT0FBTyxDQUFFLEdBQUcsQ0FDWixpQkFBaUIsQ0FBRSxRQUFRLE1BQU0sQ0FBQyxDQUMxQixTQUFTLENBQUUsUUFBUSxNQUFNLENBQUMsQUFDcEMsQ0FBQyxBQUVMLFlBQVksWUFBWSxjQUFDLENBQUMsQUFDcEIsaUJBQWlCLENBQUUsV0FBVyxNQUFNLENBQUMsQ0FDN0IsU0FBUyxDQUFFLFdBQVcsTUFBTSxDQUFDLEFBQ3ZDLENBQUMsQUFFTCxNQUFNLEFBQUMsWUFBWSxLQUFLLENBQUMsQUFBQyxDQUFDLEFBRTNCLFlBQVksY0FBQyxDQUFDLEFBQ1IsT0FBTyxDQUFFLElBQUk7RUFDakIsQ0FBQyxBQUNDLENBQUMifQ== */';
    append(document.head, style);
  }

  function create_main_fragment$4(component, ctx) {
    var div;

    function onwindowkeyup(event) {
      component._onKeyup(event);
    }
    window.addEventListener('keyup', onwindowkeyup);

    return {
      c: function create() {
        div = createElement('div');
        div.className = 'credit-card svelte-ud72g5';
        toggleClass(div, 'is-inserted', ctx.isInserted);
        toggleClass(div, 'is-dragging', ctx.isDragging);
        toggleClass(div, 'is-above-screen', ctx.isAboveScreen);
        addLoc(div, file$4, 2, 0, 46);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        component.refs.card = div;
      },

      p: function update(changed, ctx) {
        if (changed.isInserted) {
          toggleClass(div, 'is-inserted', ctx.isInserted);
        }

        if (changed.isDragging) {
          toggleClass(div, 'is-dragging', ctx.isDragging);
        }

        if (changed.isAboveScreen) {
          toggleClass(div, 'is-above-screen', ctx.isAboveScreen);
        }
      },

      d: function destroy(detach) {
        window.removeEventListener('keyup', onwindowkeyup);

        if (detach) {
          detachNode(div);
        }

        if (component.refs.card === div) component.refs.card = null;
      },
    };
  }

  function Card(options) {
    this._debugName = '<Card>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$2(), options.data);
    if (!('isInserted' in this._state))
      console.warn(
        "<Card> was created without expected data property 'isInserted'",
      );
    if (!('isDragging' in this._state))
      console.warn(
        "<Card> was created without expected data property 'isDragging'",
      );
    if (!('isAboveScreen' in this._state))
      console.warn(
        "<Card> was created without expected data property 'isAboveScreen'",
      );
    this._intro = true;

    if (!document.getElementById('svelte-ud72g5-style')) add_css$4();

    this._fragment = create_main_fragment$4(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$2.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Card.prototype, protoDev);
  assign$1(Card.prototype, methods$2);

  Card.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/components/Button/Button.html generated by Svelte v2.16.1 */

  function style({ secondary, bgColor, textColor, width }) {
    const style = [];

    if (textColor) {
      style.push(`color:${textColor}`);
    }

    if (bgColor) {
      style.push(`border-color:${bgColor}`);

      if (!secondary) {
        style.push(`background-color:${bgColor}`);
      } else if (!textColor) {
        style.push(`color:${bgColor}`);
      }
    }

    if (width) {
      style.push(`width:${width}`);
    }

    return style.join(';');
  }
  function data$3() {
    return {
      /** Button size: small | normal | fill | full */
      size: 'normal',
      /** Disable the button */
      disabled: false,
      secondary: false,
      /** Make the button fixed at the bottom of the screen */
      bottom: false,
      /** Style */
      bgColor: undefined,
      textColor: undefined,
      width: undefined,
    };
  }
  var methods$3 = {
    click() {
      this.refs.button.click();
    },
    focus() {
      this.refs.button.focus();
    },
  };

  function oncreate$3() {
    if (this.options.data) {
      const { shortcut } = this.options.data;
      if (typeof shortcut !== 'undefined') {
        this.refs.button.setAttribute('shortcut', shortcut);
      }
    }
  }
  const file$5 = 'packages/components/Button/Button.html';

  function add_css$5() {
    var style = createElement('style');
    style.id = 'svelte-1r5zfry-style';
    style.textContent =
      'button.svelte-1r5zfry{min-height:34px;padding:0 16px;vertical-align:middle;color:#fff;background-color:#4ebf1a;font-size:13px;font-weight:bold;cursor:pointer;-webkit-appearance:none;appearance:none;border:1px solid transparent;border-radius:3px}button.is-secondary.svelte-1r5zfry{background-color:transparent;border-color:#4ebf1a;color:#4ebf1a}button.size-small.svelte-1r5zfry{width:103px}button.size-normal.svelte-1r5zfry{max-width:216px;width:90%}button.size-fill.svelte-1r5zfry{width:100%}button.size-full.svelte-1r5zfry{width:100%;border-radius:0}button[disabled].svelte-1r5zfry{cursor:not-allowed;opacity:0.5}button.at-bottom.svelte-1r5zfry{position:fixed;bottom:0;left:0}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnV0dG9uLmh0bWwiLCJzb3VyY2VzIjpbIkJ1dHRvbi5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxidXR0b25cbiAgcmVmOmJ1dHRvblxuICBjbGFzcz1cImJ1dHRvbiBzaXplLXtzaXplfVwiXG4gIGNsYXNzOmF0LWJvdHRvbT1cImJvdHRvbVwiXG4gIGNsYXNzOmlzLXNlY29uZGFyeT1cInNlY29uZGFyeVwiXG4gIHtzdHlsZX1cbiAge2Rpc2FibGVkfVxuICBvbjpjbGlja1xuPlxuICA8c2xvdD48L3Nsb3Q+XG48L2J1dHRvbj5cblxuPHNjcmlwdD5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGRhdGEoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKiogQnV0dG9uIHNpemU6IHNtYWxsIHwgbm9ybWFsIHwgZmlsbCB8IGZ1bGwgKi9cbiAgICAgICAgc2l6ZTogJ25vcm1hbCcsXG4gICAgICAgIC8qKiBEaXNhYmxlIHRoZSBidXR0b24gKi9cbiAgICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgICBzZWNvbmRhcnk6IGZhbHNlLFxuICAgICAgICAvKiogTWFrZSB0aGUgYnV0dG9uIGZpeGVkIGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbiAqL1xuICAgICAgICBib3R0b206IGZhbHNlLFxuICAgICAgICAvKiogU3R5bGUgKi9cbiAgICAgICAgYmdDb2xvcjogdW5kZWZpbmVkLFxuICAgICAgICB0ZXh0Q29sb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgIH07XG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgc3R5bGUoeyBzZWNvbmRhcnksIGJnQ29sb3IsIHRleHRDb2xvciwgd2lkdGggfSkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IFtdO1xuXG4gICAgICAgIGlmICh0ZXh0Q29sb3IpIHtcbiAgICAgICAgICBzdHlsZS5wdXNoKGBjb2xvcjoke3RleHRDb2xvcn1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiZ0NvbG9yKSB7XG4gICAgICAgICAgc3R5bGUucHVzaChgYm9yZGVyLWNvbG9yOiR7YmdDb2xvcn1gKTtcblxuICAgICAgICAgIGlmICghc2Vjb25kYXJ5KSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKGBiYWNrZ3JvdW5kLWNvbG9yOiR7YmdDb2xvcn1gKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0ZXh0Q29sb3IpIHtcbiAgICAgICAgICAgIHN0eWxlLnB1c2goYGNvbG9yOiR7YmdDb2xvcn1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgICBzdHlsZS5wdXNoKGB3aWR0aDoke3dpZHRofWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0eWxlLmpvaW4oJzsnKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvbmNyZWF0ZSgpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGF0YSkge1xuICAgICAgICBjb25zdCB7IHNob3J0Y3V0IH0gPSB0aGlzLm9wdGlvbnMuZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaG9ydGN1dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aGlzLnJlZnMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnc2hvcnRjdXQnLCBzaG9ydGN1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIGNsaWNrKCkge1xuICAgICAgICB0aGlzLnJlZnMuYnV0dG9uLmNsaWNrKCk7XG4gICAgICB9LFxuICAgICAgZm9jdXMoKSB7XG4gICAgICAgIHRoaXMucmVmcy5idXR0b24uZm9jdXMoKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuYnV0dG9uIHtcbiAgICBtaW4taGVpZ2h0OiAzNHB4O1xuICAgIC8qIHBhZGRpbmc6IDEwcHggMTZweDsgKi9cbiAgICBwYWRkaW5nOiAwIDE2cHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNGViZjFhO1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIH1cblxuYnV0dG9uLmlzLXNlY29uZGFyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgIGJvcmRlci1jb2xvcjogIzRlYmYxYTtcbiAgICAgIGNvbG9yOiAjNGViZjFhO1xuICAgIH1cblxuYnV0dG9uLnNpemUtc21hbGwge1xuICAgICAgd2lkdGg6IDEwM3B4O1xuICAgIH1cblxuYnV0dG9uLnNpemUtbm9ybWFsIHtcbiAgICAgIG1heC13aWR0aDogMjE2cHg7XG4gICAgICB3aWR0aDogOTAlO1xuICAgIH1cblxuYnV0dG9uLnNpemUtZmlsbCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbmJ1dHRvbi5zaXplLWZ1bGwge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIH1cblxuYnV0dG9uW2Rpc2FibGVkXSB7XG4gICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cblxuYnV0dG9uLmF0LWJvdHRvbSB7XG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICBib3R0b206IDA7XG4gICAgICBsZWZ0OiAwO1xuICAgIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwyTnZiWEJ2Ym1WdWRITXZRblYwZEc5dUwwSjFkSFJ2Ymk1b2RHMXNJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRWFZDUVN4UlFVRlJPenRCUTJoQ1VpeHRRa0ZCYlVJN08wRkJVMjVDTEhGQ1FVRnhRanM3UVVGTmNrSXNjMEpCUVhOQ096dEJRVTEwUWl4NVFrRkJlVUk3TzBGQlpYcENMRzFDUVVGdFFqczdRVU14UTJwQ08wbEJRMFVzWjBKQlFXZENPMGxCUTJoQ0xIZENRVUYzUWp0SlFVTjRRaXhsUVVGbE8wbEJRMllzYzBKQlFYTkNPMGxCUTNSQ0xGZEJRWGxDTzBsQlEzcENMSGxDUVVGMVF6dEpRVU4yUXl4bFFVRmxPMGxCUTJZc2FVSkJRV2xDTzBsQlEycENMR1ZCUVdVN1NVRkRaaXgzUWtGQlowSTdXVUZCYUVJc1owSkJRV2RDTzBsQlEyaENMRFpDUVVFMlFqdEpRVU0zUWl4clFrRkJhMEk3UlVGdlEzQkNPenRCUVd4RFJUdE5RVU5GTERaQ1FVRTJRanROUVVNM1FpeHhRa0ZCYlVNN1RVRkRia01zWTBGQk5FSTdTVUZET1VJN08wRkJSVUU3VFVGRFJTeFpRVUZaTzBsQlEyUTdPMEZCUlVFN1RVRkRSU3huUWtGQlowSTdUVUZEYUVJc1ZVRkJWVHRKUVVOYU96dEJRVVZCTzAxQlEwVXNWMEZCVnp0SlFVTmlPenRCUVVWQk8wMUJRMFVzVjBGQlZ6dE5RVU5ZTEdkQ1FVRm5RanRKUVVOc1FqczdRVUZGUVR0TlFVTkZMRzFDUVVGdFFqdE5RVU51UWl4WlFVRlpPMGxCUTJRN08wRkJSVUU3VFVGRFJTeGxRVUZsTzAxQlEyWXNVMEZCVXp0TlFVTlVMRTlCUVU4N1NVRkRWQ0lzSW1acGJHVWlPaUp3WVdOcllXZGxjeTlqYjIxd2IyNWxiblJ6TDBKMWRIUnZiaTlDZFhSMGIyNHVhSFJ0YkNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpUmliR0ZqYXpvZ0l6QXdNRHRjYmx4dUpIZG9hWFJsT2lBalptWm1PMXh1SkhObFlYTm9aV3hzT2lBalpqRm1NV1l4TzF4dVhHNGtjM1J2Ym1VdFozSmxaVzQ2SUNNMFptSXpOREU3WEc0a2MzUnZibVV0WjNKbFpXNHRaR0Z5YXpvZ0l6RTFNelV5TWp0Y2JpUnpkRzl1WlMxbmNtVmxiaTFzYVdkb2REb2dJMkUyWkdZNFl6dGNibHh1SkdkeVlYa3RaR0Z5YTJWeU9pQWpNelV6TlRNMU8xeHVKR2R5WVhrdFpHRnlhem9nSXpReU5UazJNenRjYmlSbmNtRjVPaUFqTjJVM1pUZGxPMXh1SkdkeVlYa3RiR2xuYUhRNklDTmlOV0kxWWpVN1hHNGtaM0poZVMxc2FXZG9kR1Z5T2lBalpUTmxObVUzTzF4dUpHZHlZWGt0YkdsbmFIUmxjM1E2SUNObU1XWXlaak03WEc1Y2JpUnphV3gyWlhJNklDTmlZV0k1WWprN1hHNGtjMmxzZG1WeUxXeHBaMmgwT2lBalpHTmtZMlJqTzF4dVhHNGtjbVZrT2lBalptWXhZVEZoTzF4dUpISmxaQzFrWVhKck9pQWpaRFV3TURBd08xeHVKSEpsWkMxc2FXZG9kRG9nSTJVNE5XSTFZanRjYmx4dUx5b2dMUzB0SUNvdlhHNWNiaVJpYkhWbE9pQWpNakU1Tm1Zek8xeHVKR0pzZFdVdFpHRnlhem9nSXpFMU5qVmpNRHRjYmx4dUpHSnNkV1V0WjNKaGVTMXNhV2RvZERvZ0l6a3dZVFJoWlR0Y2JpUmliSFZsTFdkeVlYazZJQ00yTURka09HSTdYRzRrWW14MVpTMW5jbUY1TFdSaGNtczZJQ00wTlRWaE5qUTdYRzVjYmlSbmNtVmxiam9nSXpSbFltWXhZVHRjYmlSbmNtVmhiaTFzYVdkb2REb2dJelJqWVdZMU1EdGNiaVJuY21WbGJpMWtZWEpyT2lBak0yUmhNVEJtTzF4dUpHZHlaV1Z1TFhCaGVXMWxiblE2SUNNME1qazROREU3WEc1Y2JpUndkWEp3YkdVNklDTmhZalEzWW1NN1hHNGtjSFZ5Y0d4bExXUmhjbXM2SUNNM09UQmxPR0k3WEc0a2NIVnljR3hsTFd4cFoyaDBPaUFqWkdZM09HVm1PMXh1WEc0a2RHVmhiRG9nSXpFNVpUTmlNVHRjYmlSMFpXRnNMV1JoY21zNklDTXdNR0ZtT1RnN1hHNWNiaVI1Wld4c2IzYzZJQ05tT1dFNE1qVTdYRzRrZVdWc2JHOTNMV1JoY21zNklDTm1OVGRtTVRjN1hHNGlMQ0pBYVcxd2IzSjBJQ2RqYjJ4dmNuTXVjR056Y3ljN1hHNWNiaVJrWldaaGRXeDBMWFJsZUhRdFkyOXNiM0k2SUNSbmNtRjVMV1JoY210bGNqdGNiaVJrWldaaGRXeDBMV1p2Ym5RdGMybDZaVG9nTVROd2VEdGNibHh1SkdGd2NDMWlaeTFqYjJ4dmNqb2dKR2R5WVhrdGJHbG5hSFJsY2p0Y2JseHVMeW9xSUZKdmR5QmpiMjF3YjI1bGJuUWdLaTljYmlSeWIzY3RjR0ZrWkdsdVp6b2dNVEp3ZUNBeE5YQjRPMXh1SkhKdmR5MTBiM0F0YUdWcFoyaDBPaUJoZFhSdk8xeHVKSEp2ZHkxaWIzSmtaWEl0WTI5c2IzSTZJQ1JuY21GNUxXeHBaMmgwWlhJN1hHNGtjbTkzTFdKbkxXTnZiRzl5T2lBa2QyaHBkR1U3WEc0a2NtOTNMWEJ5YVcxaGNua3RZMjlzYjNJNklDUm5jbUY1TFdSaGNtdGxjanRjYmlSeWIzY3RjMlZqYjI1a1lYSjVMV052Ykc5eU9pQWtaM0poZVR0Y2JpUnliM2N0Wm05dWRDMXphWHBsT2lBeE5IQjRPMXh1WEc0dktpb2dTVzV3ZFhRZ1kyOXRjRzl1Wlc1MElDb3ZYRzRrYVc1d2RYUXRZbTl5WkdWeUxXTnZiRzl5T2lBa1ozSmhlUzFzYVdkb2RHVnlPMXh1SkdsdWNIVjBMV1p2WTNWekxXSnZjbVJsY2kxamIyeHZjam9nSkhOMGIyNWxMV2R5WldWdU8xeHVKR2x1Y0hWMExXbHVkbUZzYVdRdFltOXlaR1Z5TFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dUpHbHVjSFYwTFdWeWNtOXlMV052Ykc5eU9pQWtjbVZrTFd4cFoyaDBPMXh1WEc0dktpb2dSR2xoYkc5bklHTnZiWEJ2Ym1WdWRDQXFMMXh1SkdScFlXeHZaeTF1WldkaGRHbDJaUzFqYjJ4dmNqb2dKSEpsWkMxc2FXZG9kRHRjYmlSa2FXRnNiMmN0Y0c5emFYUnBkbVV0WTI5c2IzSTZJQ1J6ZEc5dVpTMW5jbVZsYmp0Y2JpUmthV0ZzYjJjdFkyOXVabWx5YldGMGFXOXVMWEJ5YVcxaGNua3RZMjlzYjNJNklDUm5jbUY1TFdSaGNtczdYRzRrWkdsaGJHOW5MV052Ym1acGNtMWhkR2x2YmkxMFpYaDBMV052Ykc5eU9pQWtkMmhwZEdVN1hHNWNiaThxS2lCQlpHMXBia3h2WTJzZ1kyOXRjRzl1Wlc1MElDb3ZYRzRrWVdSdGFXNXNiMk5yTFc1bFoyRjBhWFpsTFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dUpHRmtiV2x1Ykc5amF5MTBaWGgwTFdOdmJHOXlPaUFrWjNKaGVTMWtZWEpyTzF4dUpHRmtiV2x1Ykc5amF5MWlZV05yWjNKdmRXNWtMV052Ykc5eU9pQWpaakJtTUdZd08xeHVYRzRrWW5WMGRHOXVMWEJ5YVcxaGNua3RZMjlzYjNJNklDUm5jbVZsYmp0Y2JpUmlkWFIwYjI0dGRHVjRkQzFqYjJ4dmNqb2dKSGRvYVhSbE8xeHVYRzRrYzNkcGRHTm9MWFZ1WTJobFkydGxaQzFpWnpvZ0pITnBiSFpsY2p0Y2JpUnpkMmwwWTJndGRXNWphR1ZqYTJWa0xXTnZiRzl5T2lBa2MyVmhjMmhsYkd3N1hHNGtjM2RwZEdOb0xXTm9aV05yWldRdFltYzZJQ1J6ZEc5dVpTMW5jbVZsYmkxc2FXZG9kRHRjYmlSemQybDBZMmd0WTJobFkydGxaQzFqYjJ4dmNqb2dKR2R5WldWdU8xeHVKSE4zYVhSamFDMWthWE5oWW14bFpDMWlaem9nSkhOcGJIWmxjaTFzYVdkb2REdGNiaVJ6ZDJsMFkyZ3RaR2x6WVdKc1pXUXRZMjlzYjNJNklDUnphV3gyWlhJN1hHNWNiaThxSUZSaFluTWdZMjl0Y0c5dVpXNTBJQ292WEc0a2RHRmlMVzVoZG1sbllYUnBiMjR0WW1jNklDTm1NbVl5WmpJN1hHNGtkR0ZpTFd4aFltVnNMV052Ykc5eU9pQWpOalUzTnpkbU8xeHVKSFJoWWkxcGRHVnRMV1p2Ym5RdGMybDZaVG9nTVROd2VEdGNiaVIwWVdJdGJHbHVaUzFqYjJ4dmNqb2dKR2R5WldWdU8xeHVKSFJoWWkxb1pXbG5hSFE2SURRd2NIZzdYRzRpTENKY2JpQWdZblYwZEc5dUlIdGNiaUFnSUNCdGFXNHRhR1ZwWjJoME9pQXpOSEI0TzF4dUlDQWdJQzhxSUhCaFpHUnBibWM2SURFd2NIZ2dNVFp3ZURzZ0tpOWNiaUFnSUNCd1lXUmthVzVuT2lBd0lERTJjSGc3WEc0Z0lDQWdkbVZ5ZEdsallXd3RZV3hwWjI0NklHMXBaR1JzWlR0Y2JpQWdJQ0JqYjJ4dmNqb2dKR0oxZEhSdmJpMTBaWGgwTFdOdmJHOXlPMXh1SUNBZ0lHSmhZMnRuY205MWJtUXRZMjlzYjNJNklDUmlkWFIwYjI0dGNISnBiV0Z5ZVMxamIyeHZjanRjYmlBZ0lDQm1iMjUwTFhOcGVtVTZJREV6Y0hnN1hHNGdJQ0FnWm05dWRDMTNaV2xuYUhRNklHSnZiR1E3WEc0Z0lDQWdZM1Z5YzI5eU9pQndiMmx1ZEdWeU8xeHVJQ0FnSUdGd2NHVmhjbUZ1WTJVNklHNXZibVU3WEc0Z0lDQWdZbTl5WkdWeU9pQXhjSGdnYzI5c2FXUWdkSEpoYm5Od1lYSmxiblE3WEc0Z0lDQWdZbTl5WkdWeUxYSmhaR2wxY3pvZ00zQjRPMXh1WEc0Z0lDQWdKaTVwY3kxelpXTnZibVJoY25rZ2UxeHVJQ0FnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ2RISmhibk53WVhKbGJuUTdYRzRnSUNBZ0lDQmliM0prWlhJdFkyOXNiM0k2SUNSaWRYUjBiMjR0Y0hKcGJXRnllUzFqYjJ4dmNqdGNiaUFnSUNBZ0lHTnZiRzl5T2lBa1luVjBkRzl1TFhCeWFXMWhjbmt0WTI5c2IzSTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0ppNXphWHBsTFhOdFlXeHNJSHRjYmlBZ0lDQWdJSGRwWkhSb09pQXhNRE53ZUR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0FtTG5OcGVtVXRibTl5YldGc0lIdGNiaUFnSUNBZ0lHMWhlQzEzYVdSMGFEb2dNakUyY0hnN1hHNGdJQ0FnSUNCM2FXUjBhRG9nT1RBbE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUNZdWMybDZaUzFtYVd4c0lIdGNiaUFnSUNBZ0lIZHBaSFJvT2lBeE1EQWxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDWXVjMmw2WlMxbWRXeHNJSHRjYmlBZ0lDQWdJSGRwWkhSb09pQXhNREFsTzF4dUlDQWdJQ0FnWW05eVpHVnlMWEpoWkdsMWN6b2dNRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQW1XMlJwYzJGaWJHVmtYU0I3WEc0Z0lDQWdJQ0JqZFhKemIzSTZJRzV2ZEMxaGJHeHZkMlZrTzF4dUlDQWdJQ0FnYjNCaFkybDBlVG9nTUM0MU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUNZdVlYUXRZbTkwZEc5dElIdGNiaUFnSUNBZ0lIQnZjMmwwYVc5dU9pQm1hWGhsWkR0Y2JpQWdJQ0FnSUdKdmRIUnZiVG9nTUR0Y2JpQWdJQ0FnSUd4bFpuUTZJREE3WEc0Z0lDQWdmVnh1SUNCOVhHNGlYWDA9ICovPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxRkEsTUFBTSxlQUFDLENBQUMsQUFDSixVQUFVLENBQUUsSUFBSSxDQUVoQixPQUFPLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FDZixjQUFjLENBQUUsTUFBTSxDQUN0QixLQUFLLENBQUUsSUFBSSxDQUNYLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxDQUNqQixNQUFNLENBQUUsT0FBTyxDQUNmLGtCQUFrQixDQUFFLElBQUksQ0FDaEIsVUFBVSxDQUFFLElBQUksQ0FDeEIsTUFBTSxDQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUM3QixhQUFhLENBQUUsR0FBRyxBQUNwQixDQUFDLEFBRUgsTUFBTSxhQUFhLGVBQUMsQ0FBQyxBQUNmLGdCQUFnQixDQUFFLFdBQVcsQ0FDN0IsWUFBWSxDQUFFLE9BQU8sQ0FDckIsS0FBSyxDQUFFLE9BQU8sQUFDaEIsQ0FBQyxBQUVMLE1BQU0sV0FBVyxlQUFDLENBQUMsQUFDYixLQUFLLENBQUUsS0FBSyxBQUNkLENBQUMsQUFFTCxNQUFNLFlBQVksZUFBQyxDQUFDLEFBQ2QsU0FBUyxDQUFFLEtBQUssQ0FDaEIsS0FBSyxDQUFFLEdBQUcsQUFDWixDQUFDLEFBRUwsTUFBTSxVQUFVLGVBQUMsQ0FBQyxBQUNaLEtBQUssQ0FBRSxJQUFJLEFBQ2IsQ0FBQyxBQUVMLE1BQU0sVUFBVSxlQUFDLENBQUMsQUFDWixLQUFLLENBQUUsSUFBSSxDQUNYLGFBQWEsQ0FBRSxDQUFDLEFBQ2xCLENBQUMsQUFFTCxNQUFNLENBQUMsUUFBUSxDQUFDLGVBQUMsQ0FBQyxBQUNaLE1BQU0sQ0FBRSxXQUFXLENBQ25CLE9BQU8sQ0FBRSxHQUFHLEFBQ2QsQ0FBQyxBQUVMLE1BQU0sVUFBVSxlQUFDLENBQUMsQUFDWixRQUFRLENBQUUsS0FBSyxDQUNmLE1BQU0sQ0FBRSxDQUFDLENBQ1QsSUFBSSxDQUFFLENBQUMsQUFDVCxDQUFDIn0= */';
    append(document.head, style);
  }

  function create_main_fragment$5(component, ctx) {
    var button,
      slot_content_default = component._slotted.default,
      button_class_value;

    function click_handler(event) {
      component.fire('click', event);
    }

    return {
      c: function create() {
        button = createElement('button');
        addListener(button, 'click', click_handler);
        button.className = button_class_value =
          'button size-' + ctx.size + ' svelte-1r5zfry';
        button.style.cssText = ctx.style;
        button.disabled = ctx.disabled;
        toggleClass(button, 'at-bottom', ctx.bottom);
        toggleClass(button, 'is-secondary', ctx.secondary);
        addLoc(button, file$5, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, button, anchor);

        if (slot_content_default) {
          append(button, slot_content_default);
        }

        component.refs.button = button;
      },

      p: function update(changed, ctx) {
        if (
          changed.size &&
          button_class_value !==
            (button_class_value = 'button size-' + ctx.size + ' svelte-1r5zfry')
        ) {
          button.className = button_class_value;
        }

        if (changed.style) {
          button.style.cssText = ctx.style;
        }

        if (changed.disabled) {
          button.disabled = ctx.disabled;
        }

        if (changed.size || changed.bottom) {
          toggleClass(button, 'at-bottom', ctx.bottom);
        }

        if (changed.size || changed.secondary) {
          toggleClass(button, 'is-secondary', ctx.secondary);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(button);
        }

        if (slot_content_default) {
          reinsertChildren(button, slot_content_default);
        }

        removeListener(button, 'click', click_handler);
        if (component.refs.button === button) component.refs.button = null;
      },
    };
  }

  function Button(options) {
    this._debugName = '<Button>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$3(), options.data);

    this._recompute(
      { secondary: 1, bgColor: 1, textColor: 1, width: 1 },
      this._state,
    );
    if (!('secondary' in this._state))
      console.warn(
        "<Button> was created without expected data property 'secondary'",
      );
    if (!('bgColor' in this._state))
      console.warn(
        "<Button> was created without expected data property 'bgColor'",
      );
    if (!('textColor' in this._state))
      console.warn(
        "<Button> was created without expected data property 'textColor'",
      );
    if (!('width' in this._state))
      console.warn(
        "<Button> was created without expected data property 'width'",
      );
    if (!('size' in this._state))
      console.warn(
        "<Button> was created without expected data property 'size'",
      );
    if (!('bottom' in this._state))
      console.warn(
        "<Button> was created without expected data property 'bottom'",
      );

    if (!('disabled' in this._state))
      console.warn(
        "<Button> was created without expected data property 'disabled'",
      );
    this._intro = true;

    this._slotted = options.slots || {};

    if (!document.getElementById('svelte-1r5zfry-style')) add_css$5();

    this._fragment = create_main_fragment$5(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$3.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Button.prototype, protoDev);
  assign$1(Button.prototype, methods$3);

  Button.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('style' in newState && !this._updatingReadonlyProperty)
      throw new Error("<Button>: Cannot set read-only property 'style'");
  };

  Button.prototype._recompute = function _recompute(changed, state) {
    if (
      changed.secondary ||
      changed.bgColor ||
      changed.textColor ||
      changed.width
    ) {
      if (this._differs(state.style, (state.style = style(state))))
        changed.style = true;
    }
  };

  /* packages/components/Icon/Icon.html generated by Svelte v2.16.1 */

  function iconStyle({ src, color, width, height }) {
    return [
      color && `color:${color}`,
      /* istanbul ignore next */
      src && `-webkit-mask-image: url(${src})`,
      width && `width: ${width}`,
      height && `height: ${height}`,
    ]
      .filter(Boolean)
      .join(';');
  }

  function data$4() {
    return {
      size: 'normal',
      symbol: 'custom',
      src: undefined,
      color: undefined,
      width: undefined,
      height: undefined,
      level: undefined,
    };
  }
  const file$6 = 'packages/components/Icon/Icon.html';

  function add_css$6() {
    var style = createElement('style');
    style.id = 'svelte-se9ah2-style';
    style.textContent =
      "[symbol='account'].svelte-se9ah2{-webkit-mask-image:url(./assets/account.svg);mask-image:url(./assets/account.svg)}[symbol='alert'].svelte-se9ah2{-webkit-mask-image:url(./assets/alert.svg);mask-image:url(./assets/alert.svg)}[symbol='autorenew'].svelte-se9ah2{-webkit-mask-image:url(./assets/autorenew.svg);mask-image:url(./assets/autorenew.svg)}[symbol='bookmark'].svelte-se9ah2{-webkit-mask-image:url(./assets/bookmark.svg);mask-image:url(./assets/bookmark.svg)}[symbol='calendar'].svelte-se9ah2{-webkit-mask-image:url(./assets/calendar.svg);mask-image:url(./assets/calendar.svg)}[symbol='check'].svelte-se9ah2{-webkit-mask-image:url(./assets/check.svg);mask-image:url(./assets/check.svg)}[symbol='chevron-down'].svelte-se9ah2{-webkit-mask-image:url(./assets/chevron-down.svg);mask-image:url(./assets/chevron-down.svg)}[symbol='chevron-left'].svelte-se9ah2{-webkit-mask-image:url(./assets/chevron-left.svg);mask-image:url(./assets/chevron-left.svg)}[symbol='chevron-right'].svelte-se9ah2{-webkit-mask-image:url(./assets/chevron-right.svg);mask-image:url(./assets/chevron-right.svg)}[symbol='chevron-up'].svelte-se9ah2{-webkit-mask-image:url(./assets/chevron-up.svg);mask-image:url(./assets/chevron-up.svg)}[symbol='close-circle'].svelte-se9ah2{-webkit-mask-image:url(./assets/close-circle.svg);mask-image:url(./assets/close-circle.svg)}[symbol='close'].svelte-se9ah2{-webkit-mask-image:url(./assets/close.svg);mask-image:url(./assets/close.svg)}[symbol='credit-card'].svelte-se9ah2{-webkit-mask-image:url(./assets/credit-card.svg);mask-image:url(./assets/credit-card.svg)}[symbol='delete'].svelte-se9ah2{-webkit-mask-image:url(./assets/delete.svg);mask-image:url(./assets/delete.svg)}[symbol='eye-off'].svelte-se9ah2{-webkit-mask-image:url(./assets/eye-off.svg);mask-image:url(./assets/eye-off.svg)}[symbol='eye'].svelte-se9ah2{-webkit-mask-image:url(./assets/eye.svg);mask-image:url(./assets/eye.svg)}[symbol='floppy'].svelte-se9ah2{-webkit-mask-image:url(./assets/floppy.svg);mask-image:url(./assets/floppy.svg)}[symbol='heart'].svelte-se9ah2{-webkit-mask-image:url(./assets/heart.svg);mask-image:url(./assets/heart.svg)}[symbol='help-circle'].svelte-se9ah2{-webkit-mask-image:url(./assets/help-circle.svg);mask-image:url(./assets/help-circle.svg)}[symbol='app-home'].svelte-se9ah2{-webkit-mask-image:url(./assets/app-home.svg);mask-image:url(./assets/app-home.svg)}[symbol='home'].svelte-se9ah2{-webkit-mask-image:url(./assets/home.svg);mask-image:url(./assets/home.svg)}[symbol='information'].svelte-se9ah2{-webkit-mask-image:url(./assets/information.svg);mask-image:url(./assets/information.svg)}[symbol='lock-open'].svelte-se9ah2{-webkit-mask-image:url(./assets/lock-open.svg);mask-image:url(./assets/lock-open.svg)}[symbol='lock-stn-open'].svelte-se9ah2{-webkit-mask-image:url(./assets/lock-stn-open.svg);mask-image:url(./assets/lock-stn-open.svg)}[symbol='lock-stn'].svelte-se9ah2{-webkit-mask-image:url(./assets/lock-stn.svg);mask-image:url(./assets/lock-stn.svg)}[symbol='lock'].svelte-se9ah2{-webkit-mask-image:url(./assets/lock.svg);mask-image:url(./assets/lock.svg)}[symbol='loop'].svelte-se9ah2{-webkit-mask-image:url(./assets/loop.svg);mask-image:url(./assets/loop.svg)}[symbol='menu'].svelte-se9ah2{-webkit-mask-image:url(./assets/menu.svg);mask-image:url(./assets/menu.svg)}[symbol='pencil'].svelte-se9ah2{-webkit-mask-image:url(./assets/pencil.svg);mask-image:url(./assets/pencil.svg)}[symbol='plus'].svelte-se9ah2{-webkit-mask-image:url(./assets/plus.svg);mask-image:url(./assets/plus.svg)}[symbol='printer-outline'].svelte-se9ah2{-webkit-mask-image:url(./assets/printer-outline.svg);mask-image:url(./assets/printer-outline.svg)}[symbol='printer'].svelte-se9ah2{-webkit-mask-image:url(./assets/printer.svg);mask-image:url(./assets/printer.svg)}[symbol='refresh'].svelte-se9ah2{-webkit-mask-image:url(./assets/refresh.svg);mask-image:url(./assets/refresh.svg)}[symbol='settings'].svelte-se9ah2{-webkit-mask-image:url(./assets/settings.svg);mask-image:url(./assets/settings.svg)}[symbol='signal-2g'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-2g.svg);mask-image:url(./assets/signal-2g.svg)}[symbol='signal-3g'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-3g.svg);mask-image:url(./assets/signal-3g.svg)}[symbol='signal-4g'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-4g.svg);mask-image:url(./assets/signal-4g.svg)}[symbol='signal-hspa-plus'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-hspa-plus.svg);mask-image:url(./assets/signal-hspa-plus.svg)}[symbol='signal-hspa'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-hspa.svg);mask-image:url(./assets/signal-hspa.svg)}[symbol='signal-variant'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal-variant.svg);mask-image:url(./assets/signal-variant.svg)}[symbol='signal'].svelte-se9ah2{-webkit-mask-image:url(./assets/signal.svg);mask-image:url(./assets/signal.svg)}[symbol='star-outline'].svelte-se9ah2{-webkit-mask-image:url(./assets/star-outline.svg);mask-image:url(./assets/star-outline.svg)}[symbol='star'].svelte-se9ah2{-webkit-mask-image:url(./assets/star.svg);mask-image:url(./assets/star.svg)}[symbol='wifi'].svelte-se9ah2{-webkit-mask-image:url(./assets/wifi.svg);mask-image:url(./assets/wifi.svg)}.icon.svelte-se9ah2{display:inline-block;vertical-align:middle;width:24px;height:24px;background-color:currentColor;-webkit-mask-size:cover;mask-size:cover;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}[size='large'].svelte-se9ah2{width:36px;height:36px}[size='giant'].svelte-se9ah2{width:56px;height:56px}[symbol='wifi'].svelte-se9ah2{position:relative;background-color:#b5b5b5}[symbol='wifi'].svelte-se9ah2::before{content:'';position:absolute;bottom:0;left:0;right:0;border-radius:50%;background:currentColor}[symbol='wifi'][level='0'].svelte-se9ah2::before{height:0}[symbol='wifi'][level='1'].svelte-se9ah2::before{height:40%}[symbol='wifi'][level='2'].svelte-se9ah2::before{height:54%}[symbol='wifi'][level='3'].svelte-se9ah2::before{height:67%}[symbol='wifi'][level='4'].svelte-se9ah2::before,[symbol='wifi'][level='5'].svelte-se9ah2::before{height:100%}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSWNvbi5odG1sIiwic291cmNlcyI6WyJJY29uLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiPGRpdlxuICByZWY6aWNvblxuICBjbGFzcz1cImljb25cIlxuICBzdHlsZT17aWNvblN0eWxlfVxuICB7c3ltYm9sfVxuICB7c2l6ZX1cbiAge2xldmVsfVxuICBvbjpjbGlja1xuPjwvZGl2PlxuXG48c2NyaXB0PlxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgZGF0YSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNpemU6ICdub3JtYWwnLFxuICAgICAgICBzeW1ib2w6ICdjdXN0b20nLFxuICAgICAgICBzcmM6IHVuZGVmaW5lZCxcbiAgICAgICAgY29sb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIGxldmVsOiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIGljb25TdHlsZTogKHsgc3JjLCBjb2xvciwgd2lkdGgsIGhlaWdodCB9KSA9PlxuICAgICAgICBbXG4gICAgICAgICAgY29sb3IgJiYgYGNvbG9yOiR7Y29sb3J9YCxcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgIHNyYyAmJiBgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoJHtzcmN9KWAsXG4gICAgICAgICAgd2lkdGggJiYgYHdpZHRoOiAke3dpZHRofWAsXG4gICAgICAgICAgaGVpZ2h0ICYmIGBoZWlnaHQ6ICR7aGVpZ2h0fWAsXG4gICAgICAgIF1cbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgLmpvaW4oJzsnKSxcbiAgICB9LFxuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiAtLS0gKi9cblxuLyoqIFJvdyBjb21wb25lbnQgKi9cblxuLyoqIElucHV0IGNvbXBvbmVudCAqL1xuXG4vKiogRGlhbG9nIGNvbXBvbmVudCAqL1xuXG4vKiogQWRtaW5Mb2NrIGNvbXBvbmVudCAqL1xuXG4vKiBUYWJzIGNvbXBvbmVudCAqL1xuXG5bc3ltYm9sPSdhY2NvdW50J10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvYWNjb3VudC5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvYWNjb3VudC5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nYWxlcnQnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9hbGVydC5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvYWxlcnQuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2F1dG9yZW5ldyddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2F1dG9yZW5ldy5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvYXV0b3JlbmV3LnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdib29rbWFyayddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2Jvb2ttYXJrLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9ib29rbWFyay5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nY2FsZW5kYXInXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jYWxlbmRhci5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2FsZW5kYXIuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2NoZWNrJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2hlY2suc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2NoZWNrLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdjaGV2cm9uLWRvd24nXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jaGV2cm9uLWRvd24uc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2NoZXZyb24tZG93bi5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nY2hldnJvbi1sZWZ0J10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2hldnJvbi1sZWZ0LnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jaGV2cm9uLWxlZnQuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2NoZXZyb24tcmlnaHQnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jaGV2cm9uLXJpZ2h0LnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jaGV2cm9uLXJpZ2h0LnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdjaGV2cm9uLXVwJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2hldnJvbi11cC5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2hldnJvbi11cC5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nY2xvc2UtY2lyY2xlJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2xvc2UtY2lyY2xlLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jbG9zZS1jaXJjbGUuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2Nsb3NlJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvY2xvc2Uuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2Nsb3NlLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdjcmVkaXQtY2FyZCddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2NyZWRpdC1jYXJkLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9jcmVkaXQtY2FyZC5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nZGVsZXRlJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvZGVsZXRlLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9kZWxldGUuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2V5ZS1vZmYnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9leWUtb2ZmLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9leWUtb2ZmLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdleWUnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9leWUuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2V5ZS5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nZmxvcHB5J10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvZmxvcHB5LnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9mbG9wcHkuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2hlYXJ0J10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvaGVhcnQuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2hlYXJ0LnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdoZWxwLWNpcmNsZSddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2hlbHAtY2lyY2xlLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9oZWxwLWNpcmNsZS5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nYXBwLWhvbWUnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9hcHAtaG9tZS5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvYXBwLWhvbWUuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2hvbWUnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9ob21lLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9ob21lLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdpbmZvcm1hdGlvbiddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2luZm9ybWF0aW9uLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9pbmZvcm1hdGlvbi5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nbG9jay1vcGVuJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvbG9jay1vcGVuLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb2NrLW9wZW4uc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2xvY2stc3RuLW9wZW4nXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb2NrLXN0bi1vcGVuLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb2NrLXN0bi1vcGVuLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdsb2NrLXN0biddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2xvY2stc3RuLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb2NrLXN0bi5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nbG9jayddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2xvY2suc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL2xvY2suc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J2xvb3AnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb29wLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9sb29wLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdtZW51J10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvbWVudS5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvbWVudS5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0ncGVuY2lsJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvcGVuY2lsLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9wZW5jaWwuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J3BsdXMnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9wbHVzLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9wbHVzLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdwcmludGVyLW91dGxpbmUnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9wcmludGVyLW91dGxpbmUuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3ByaW50ZXItb3V0bGluZS5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0ncHJpbnRlciddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3ByaW50ZXIuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3ByaW50ZXIuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J3JlZnJlc2gnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9yZWZyZXNoLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9yZWZyZXNoLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdzZXR0aW5ncyddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NldHRpbmdzLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9zZXR0aW5ncy5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nc2lnbmFsLTJnJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc2lnbmFsLTJnLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9zaWduYWwtMmcuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J3NpZ25hbC0zZyddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC0zZy5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc2lnbmFsLTNnLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdzaWduYWwtNGcnXSB7XG4gICAgICAtd2Via2l0LW1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9zaWduYWwtNGcuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC00Zy5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nc2lnbmFsLWhzcGEtcGx1cyddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC1oc3BhLXBsdXMuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC1oc3BhLXBsdXMuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J3NpZ25hbC1oc3BhJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc2lnbmFsLWhzcGEuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC1oc3BhLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdzaWduYWwtdmFyaWFudCddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3NpZ25hbC12YXJpYW50LnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9zaWduYWwtdmFyaWFudC5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nc2lnbmFsJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc2lnbmFsLnN2Zyk7XG4gICAgICAgICAgICAgIG1hc2staW1hZ2U6IHVybCguL2Fzc2V0cy9zaWduYWwuc3ZnKTtcbiAgICB9XG5cbltzeW1ib2w9J3N0YXItb3V0bGluZSddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3N0YXItb3V0bGluZS5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc3Rhci1vdXRsaW5lLnN2Zyk7XG4gICAgfVxuXG5bc3ltYm9sPSdzdGFyJ10ge1xuICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc3Rhci5zdmcpO1xuICAgICAgICAgICAgICBtYXNrLWltYWdlOiB1cmwoLi9hc3NldHMvc3Rhci5zdmcpO1xuICAgIH1cblxuW3N5bWJvbD0nd2lmaSddIHtcbiAgICAgIC13ZWJraXQtbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3dpZmkuc3ZnKTtcbiAgICAgICAgICAgICAgbWFzay1pbWFnZTogdXJsKC4vYXNzZXRzL3dpZmkuc3ZnKTtcbiAgICB9XG5cbi5pY29uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICB3aWR0aDogMjRweDtcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogY3VycmVudENvbG9yO1xuICAgIC13ZWJraXQtbWFzay1zaXplOiBjb3ZlcjtcbiAgICAgICAgICAgIG1hc2stc2l6ZTogY292ZXI7XG4gICAgLXdlYmtpdC1tYXNrLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgICAgICAgICAgbWFzay1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICAtd2Via2l0LW1hc2stcG9zaXRpb246IGNlbnRlcjtcbiAgICAgICAgICAgIG1hc2stcG9zaXRpb246IGNlbnRlcjtcbiAgfVxuXG5bc2l6ZT0nbGFyZ2UnXSB7XG4gICAgd2lkdGg6IDM2cHg7XG4gICAgaGVpZ2h0OiAzNnB4O1xuICB9XG5cbltzaXplPSdnaWFudCddIHtcbiAgICB3aWR0aDogNTZweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gIH1cblxuW3N5bWJvbD0nd2lmaSddIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2I1YjViNTtcbiAgfVxuXG5bc3ltYm9sPSd3aWZpJ106OmJlZm9yZSB7XG4gICAgICBjb250ZW50OiAnJztcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJvdHRvbTogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICByaWdodDogMDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIGJhY2tncm91bmQ6IGN1cnJlbnRDb2xvcjtcbiAgICB9XG5cbltzeW1ib2w9J3dpZmknXVtsZXZlbD0nMCddOjpiZWZvcmUge1xuICAgICAgaGVpZ2h0OiAwO1xuICAgIH1cblxuW3N5bWJvbD0nd2lmaSddW2xldmVsPScxJ106OmJlZm9yZSB7XG4gICAgICBoZWlnaHQ6IDQwJTtcbiAgICB9XG5cbltzeW1ib2w9J3dpZmknXVtsZXZlbD0nMiddOjpiZWZvcmUge1xuICAgICAgaGVpZ2h0OiA1NCU7XG4gICAgfVxuXG5bc3ltYm9sPSd3aWZpJ11bbGV2ZWw9JzMnXTo6YmVmb3JlIHtcbiAgICAgIGhlaWdodDogNjclO1xuICAgIH1cblxuW3N5bWJvbD0nd2lmaSddW2xldmVsPSc0J106OmJlZm9yZSxcbiAgICBbc3ltYm9sPSd3aWZpJ11bbGV2ZWw9JzUnXTo6YmVmb3JlIHtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG5cbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5QWJXRnRZbUV2YzNSNWJHVnpMMk52Ykc5eWN5NXdZM056SWl3aWJtOWtaVjl0YjJSMWJHVnpMMEJ0WVcxaVlTOXpkSGxzWlhNdmRHaGxiV1V1Y0dOemN5SXNJbkJoWTJ0aFoyVnpMMk52YlhCdmJtVnVkSE12U1dOdmJpOUpZMjl1TG1oMGJXd2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJkVUpCTEZGQlFWRTdPMEZEYUVKU0xHMUNRVUZ0UWpzN1FVRlRia0lzY1VKQlFYRkNPenRCUVUxeVFpeHpRa0ZCYzBJN08wRkJUWFJDTEhsQ1FVRjVRanM3UVVGbGVrSXNiVUpCUVcxQ096dEJRMDFtTzAxQlEwVXNOa05CUVhsRE8yTkJRWHBETEhGRFFVRjVRenRKUVVNelF6czdRVUZHUVR0TlFVTkZMREpEUVVGNVF6dGpRVUY2UXl4dFEwRkJlVU03U1VGRE0wTTdPMEZCUmtFN1RVRkRSU3dyUTBGQmVVTTdZMEZCZWtNc2RVTkJRWGxETzBsQlF6TkRPenRCUVVaQk8wMUJRMFVzT0VOQlFYbERPMk5CUVhwRExITkRRVUY1UXp0SlFVTXpRenM3UVVGR1FUdE5RVU5GTERoRFFVRjVRenRqUVVGNlF5eHpRMEZCZVVNN1NVRkRNME03TzBGQlJrRTdUVUZEUlN3eVEwRkJlVU03WTBGQmVrTXNiVU5CUVhsRE8wbEJRek5ET3p0QlFVWkJPMDFCUTBVc2EwUkJRWGxETzJOQlFYcERMREJEUVVGNVF6dEpRVU16UXpzN1FVRkdRVHROUVVORkxHdEVRVUY1UXp0alFVRjZReXd3UTBGQmVVTTdTVUZETTBNN08wRkJSa0U3VFVGRFJTeHRSRUZCZVVNN1kwRkJla01zTWtOQlFYbERPMGxCUXpORE96dEJRVVpCTzAxQlEwVXNaMFJCUVhsRE8yTkJRWHBETEhkRFFVRjVRenRKUVVNelF6czdRVUZHUVR0TlFVTkZMR3RFUVVGNVF6dGpRVUY2UXl3d1EwRkJlVU03U1VGRE0wTTdPMEZCUmtFN1RVRkRSU3d5UTBGQmVVTTdZMEZCZWtNc2JVTkJRWGxETzBsQlF6TkRPenRCUVVaQk8wMUJRMFVzYVVSQlFYbERPMk5CUVhwRExIbERRVUY1UXp0SlFVTXpRenM3UVVGR1FUdE5RVU5GTERSRFFVRjVRenRqUVVGNlF5eHZRMEZCZVVNN1NVRkRNME03TzBGQlJrRTdUVUZEUlN3MlEwRkJlVU03WTBGQmVrTXNjVU5CUVhsRE8wbEJRek5ET3p0QlFVWkJPMDFCUTBVc2VVTkJRWGxETzJOQlFYcERMR2xEUVVGNVF6dEpRVU16UXpzN1FVRkdRVHROUVVORkxEUkRRVUY1UXp0alFVRjZReXh2UTBGQmVVTTdTVUZETTBNN08wRkJSa0U3VFVGRFJTd3lRMEZCZVVNN1kwRkJla01zYlVOQlFYbERPMGxCUXpORE96dEJRVVpCTzAxQlEwVXNhVVJCUVhsRE8yTkJRWHBETEhsRFFVRjVRenRKUVVNelF6czdRVUZHUVR0TlFVTkZMRGhEUVVGNVF6dGpRVUY2UXl4elEwRkJlVU03U1VGRE0wTTdPMEZCUmtFN1RVRkRSU3d3UTBGQmVVTTdZMEZCZWtNc2EwTkJRWGxETzBsQlF6TkRPenRCUVVaQk8wMUJRMFVzYVVSQlFYbERPMk5CUVhwRExIbERRVUY1UXp0SlFVTXpRenM3UVVGR1FUdE5RVU5GTEN0RFFVRjVRenRqUVVGNlF5eDFRMEZCZVVNN1NVRkRNME03TzBGQlJrRTdUVUZEUlN4dFJFRkJlVU03WTBGQmVrTXNNa05CUVhsRE8wbEJRek5ET3p0QlFVWkJPMDFCUTBVc09FTkJRWGxETzJOQlFYcERMSE5EUVVGNVF6dEpRVU16UXpzN1FVRkdRVHROUVVORkxEQkRRVUY1UXp0alFVRjZReXhyUTBGQmVVTTdTVUZETTBNN08wRkJSa0U3VFVGRFJTd3dRMEZCZVVNN1kwRkJla01zYTBOQlFYbERPMGxCUXpORE96dEJRVVpCTzAxQlEwVXNNRU5CUVhsRE8yTkJRWHBETEd0RFFVRjVRenRKUVVNelF6czdRVUZHUVR0TlFVTkZMRFJEUVVGNVF6dGpRVUY2UXl4dlEwRkJlVU03U1VGRE0wTTdPMEZCUmtFN1RVRkRSU3d3UTBGQmVVTTdZMEZCZWtNc2EwTkJRWGxETzBsQlF6TkRPenRCUVVaQk8wMUJRMFVzY1VSQlFYbERPMk5CUVhwRExEWkRRVUY1UXp0SlFVTXpRenM3UVVGR1FUdE5RVU5GTERaRFFVRjVRenRqUVVGNlF5eHhRMEZCZVVNN1NVRkRNME03TzBGQlJrRTdUVUZEUlN3MlEwRkJlVU03WTBGQmVrTXNjVU5CUVhsRE8wbEJRek5ET3p0QlFVWkJPMDFCUTBVc09FTkJRWGxETzJOQlFYcERMSE5EUVVGNVF6dEpRVU16UXpzN1FVRkdRVHROUVVORkxDdERRVUY1UXp0alFVRjZReXgxUTBGQmVVTTdTVUZETTBNN08wRkJSa0U3VFVGRFJTd3JRMEZCZVVNN1kwRkJla01zZFVOQlFYbERPMGxCUXpORE96dEJRVVpCTzAxQlEwVXNLME5CUVhsRE8yTkJRWHBETEhWRFFVRjVRenRKUVVNelF6czdRVUZHUVR0TlFVTkZMSE5FUVVGNVF6dGpRVUY2UXl3NFEwRkJlVU03U1VGRE0wTTdPMEZCUmtFN1RVRkRSU3hwUkVGQmVVTTdZMEZCZWtNc2VVTkJRWGxETzBsQlF6TkRPenRCUVVaQk8wMUJRMFVzYjBSQlFYbERPMk5CUVhwRExEUkRRVUY1UXp0SlFVTXpRenM3UVVGR1FUdE5RVU5GTERSRFFVRjVRenRqUVVGNlF5eHZRMEZCZVVNN1NVRkRNME03TzBGQlJrRTdUVUZEUlN4clJFRkJlVU03WTBGQmVrTXNNRU5CUVhsRE8wbEJRek5ET3p0QlFVWkJPMDFCUTBVc01FTkJRWGxETzJOQlFYcERMR3REUVVGNVF6dEpRVU16UXpzN1FVRkdRVHROUVVORkxEQkRRVUY1UXp0alFVRjZReXhyUTBGQmVVTTdTVUZETTBNN08wRkJSMFk3U1VGRFJTeHhRa0ZCY1VJN1NVRkRja0lzYzBKQlFYTkNPMGxCUTNSQ0xGZEJRVmM3U1VGRFdDeFpRVUZaTzBsQlExb3NPRUpCUVRoQ08wbEJRemxDTEhkQ1FVRm5RanRaUVVGb1FpeG5Ra0ZCWjBJN1NVRkRhRUlzT0VKQlFYTkNPMWxCUVhSQ0xITkNRVUZ6UWp0SlFVTjBRaXcyUWtGQmNVSTdXVUZCY2tJc2NVSkJRWEZDTzBWQlEzWkNPenRCUVVWQk8wbEJRMFVzVjBGQlZ6dEpRVU5ZTEZsQlFWazdSVUZEWkRzN1FVRkZRVHRKUVVORkxGZEJRVmM3U1VGRFdDeFpRVUZaTzBWQlEyUTdPMEZCUlVFN1NVRkRSU3hyUWtGQmEwSTdTVUZEYkVJc2VVSkJRVFpDTzBWQlowTXZRanM3UVVFNVFrVTdUVUZEUlN4WFFVRlhPMDFCUTFnc2EwSkJRV3RDTzAxQlEyeENMRk5CUVZNN1RVRkRWQ3hQUVVGUE8wMUJRMUFzVVVGQlVUdE5RVU5TTEd0Q1FVRnJRanROUVVOc1FpeDNRa0ZCZDBJN1NVRkRNVUk3TzBGQlJVRTdUVUZEUlN4VFFVRlRPMGxCUTFnN08wRkJSVUU3VFVGRFJTeFhRVUZYTzBsQlEySTdPMEZCUlVFN1RVRkRSU3hYUVVGWE8wbEJRMkk3TzBGQlJVRTdUVUZEUlN4WFFVRlhPMGxCUTJJN08wRkJSVUU3TzAxQlJVVXNXVUZCV1R0SlFVTmtJaXdpWm1sc1pTSTZJbkJoWTJ0aFoyVnpMMk52YlhCdmJtVnVkSE12U1dOdmJpOUpZMjl1TG1oMGJXd2lMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlrWW14aFkyczZJQ013TURBN1hHNWNiaVIzYUdsMFpUb2dJMlptWmp0Y2JpUnpaV0Z6YUdWc2JEb2dJMll4WmpGbU1UdGNibHh1SkhOMGIyNWxMV2R5WldWdU9pQWpOR1ppTXpReE8xeHVKSE4wYjI1bExXZHlaV1Z1TFdSaGNtczZJQ014TlRNMU1qSTdYRzRrYzNSdmJtVXRaM0psWlc0dGJHbG5hSFE2SUNOaE5tUm1PR003WEc1Y2JpUm5jbUY1TFdSaGNtdGxjam9nSXpNMU16VXpOVHRjYmlSbmNtRjVMV1JoY21zNklDTTBNalU1TmpNN1hHNGtaM0poZVRvZ0l6ZGxOMlUzWlR0Y2JpUm5jbUY1TFd4cFoyaDBPaUFqWWpWaU5XSTFPMXh1SkdkeVlYa3RiR2xuYUhSbGNqb2dJMlV6WlRabE56dGNiaVJuY21GNUxXeHBaMmgwWlhOME9pQWpaakZtTW1Zek8xeHVYRzRrYzJsc2RtVnlPaUFqWW1GaU9XSTVPMXh1SkhOcGJIWmxjaTFzYVdkb2REb2dJMlJqWkdOa1l6dGNibHh1SkhKbFpEb2dJMlptTVdFeFlUdGNiaVJ5WldRdFpHRnlhem9nSTJRMU1EQXdNRHRjYmlSeVpXUXRiR2xuYUhRNklDTmxPRFZpTldJN1hHNWNiaThxSUMwdExTQXFMMXh1WEc0a1lteDFaVG9nSXpJeE9UWm1NenRjYmlSaWJIVmxMV1JoY21zNklDTXhOVFkxWXpBN1hHNWNiaVJpYkhWbExXZHlZWGt0YkdsbmFIUTZJQ001TUdFMFlXVTdYRzRrWW14MVpTMW5jbUY1T2lBak5qQTNaRGhpTzF4dUpHSnNkV1V0WjNKaGVTMWtZWEpyT2lBak5EVTFZVFkwTzF4dVhHNGtaM0psWlc0NklDTTBaV0ptTVdFN1hHNGtaM0psWVc0dGJHbG5hSFE2SUNNMFkyRm1OVEE3WEc0a1ozSmxaVzR0WkdGeWF6b2dJek5rWVRFd1pqdGNiaVJuY21WbGJpMXdZWGx0Wlc1ME9pQWpOREk1T0RReE8xeHVYRzRrY0hWeWNHeGxPaUFqWVdJME4ySmpPMXh1SkhCMWNuQnNaUzFrWVhKck9pQWpOemt3WlRoaU8xeHVKSEIxY25Cc1pTMXNhV2RvZERvZ0kyUm1OemhsWmp0Y2JseHVKSFJsWVd3NklDTXhPV1V6WWpFN1hHNGtkR1ZoYkMxa1lYSnJPaUFqTURCaFpqazRPMXh1WEc0a2VXVnNiRzkzT2lBalpqbGhPREkxTzF4dUpIbGxiR3h2ZHkxa1lYSnJPaUFqWmpVM1pqRTNPMXh1SWl3aVFHbHRjRzl5ZENBblkyOXNiM0p6TG5CamMzTW5PMXh1WEc0a1pHVm1ZWFZzZEMxMFpYaDBMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJaWEk3WEc0a1pHVm1ZWFZzZEMxbWIyNTBMWE5wZW1VNklERXpjSGc3WEc1Y2JpUmhjSEF0WW1jdFkyOXNiM0k2SUNSbmNtRjVMV3hwWjJoMFpYSTdYRzVjYmk4cUtpQlNiM2NnWTI5dGNHOXVaVzUwSUNvdlhHNGtjbTkzTFhCaFpHUnBibWM2SURFeWNIZ2dNVFZ3ZUR0Y2JpUnliM2N0ZEc5d0xXaGxhV2RvZERvZ1lYVjBienRjYmlSeWIzY3RZbTl5WkdWeUxXTnZiRzl5T2lBa1ozSmhlUzFzYVdkb2RHVnlPMXh1SkhKdmR5MWlaeTFqYjJ4dmNqb2dKSGRvYVhSbE8xeHVKSEp2ZHkxd2NtbHRZWEo1TFdOdmJHOXlPaUFrWjNKaGVTMWtZWEpyWlhJN1hHNGtjbTkzTFhObFkyOXVaR0Z5ZVMxamIyeHZjam9nSkdkeVlYazdYRzRrY205M0xXWnZiblF0YzJsNlpUb2dNVFJ3ZUR0Y2JseHVMeW9xSUVsdWNIVjBJR052YlhCdmJtVnVkQ0FxTDF4dUpHbHVjSFYwTFdKdmNtUmxjaTFqYjJ4dmNqb2dKR2R5WVhrdGJHbG5hSFJsY2p0Y2JpUnBibkIxZEMxbWIyTjFjeTFpYjNKa1pYSXRZMjlzYjNJNklDUnpkRzl1WlMxbmNtVmxianRjYmlScGJuQjFkQzFwYm5aaGJHbGtMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pISmxaQzFzYVdkb2REdGNiaVJwYm5CMWRDMWxjbkp2Y2kxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JseHVMeW9xSUVScFlXeHZaeUJqYjIxd2IyNWxiblFnS2k5Y2JpUmthV0ZzYjJjdGJtVm5ZWFJwZG1VdFkyOXNiM0k2SUNSeVpXUXRiR2xuYUhRN1hHNGtaR2xoYkc5bkxYQnZjMmwwYVhabExXTnZiRzl5T2lBa2MzUnZibVV0WjNKbFpXNDdYRzRrWkdsaGJHOW5MV052Ym1acGNtMWhkR2x2Ymkxd2NtbHRZWEo1TFdOdmJHOXlPaUFrWjNKaGVTMWtZWEpyTzF4dUpHUnBZV3h2WnkxamIyNW1hWEp0WVhScGIyNHRkR1Y0ZEMxamIyeHZjam9nSkhkb2FYUmxPMXh1WEc0dktpb2dRV1J0YVc1TWIyTnJJR052YlhCdmJtVnVkQ0FxTDF4dUpHRmtiV2x1Ykc5amF5MXVaV2RoZEdsMlpTMWpiMnh2Y2pvZ0pISmxaQzFzYVdkb2REdGNiaVJoWkcxcGJteHZZMnN0ZEdWNGRDMWpiMnh2Y2pvZ0pHZHlZWGt0WkdGeWF6dGNiaVJoWkcxcGJteHZZMnN0WW1GamEyZHliM1Z1WkMxamIyeHZjam9nSTJZd1pqQm1NRHRjYmx4dUpHSjFkSFJ2Ymkxd2NtbHRZWEo1TFdOdmJHOXlPaUFrWjNKbFpXNDdYRzRrWW5WMGRHOXVMWFJsZUhRdFkyOXNiM0k2SUNSM2FHbDBaVHRjYmx4dUpITjNhWFJqYUMxMWJtTm9aV05yWldRdFltYzZJQ1J6YVd4MlpYSTdYRzRrYzNkcGRHTm9MWFZ1WTJobFkydGxaQzFqYjJ4dmNqb2dKSE5sWVhOb1pXeHNPMXh1SkhOM2FYUmphQzFqYUdWamEyVmtMV0puT2lBa2MzUnZibVV0WjNKbFpXNHRiR2xuYUhRN1hHNGtjM2RwZEdOb0xXTm9aV05yWldRdFkyOXNiM0k2SUNSbmNtVmxianRjYmlSemQybDBZMmd0WkdsellXSnNaV1F0WW1jNklDUnphV3gyWlhJdGJHbG5hSFE3WEc0a2MzZHBkR05vTFdScGMyRmliR1ZrTFdOdmJHOXlPaUFrYzJsc2RtVnlPMXh1WEc0dktpQlVZV0p6SUdOdmJYQnZibVZ1ZENBcUwxeHVKSFJoWWkxdVlYWnBaMkYwYVc5dUxXSm5PaUFqWmpKbU1tWXlPMXh1SkhSaFlpMXNZV0psYkMxamIyeHZjam9nSXpZMU56YzNaanRjYmlSMFlXSXRhWFJsYlMxbWIyNTBMWE5wZW1VNklERXpjSGc3WEc0a2RHRmlMV3hwYm1VdFkyOXNiM0k2SUNSbmNtVmxianRjYmlSMFlXSXRhR1ZwWjJoME9pQTBNSEI0TzF4dUlpd2lYRzRnSUNScFkyOXVMV3hwYzNRNklDaGNiaUFnSUNCaFkyTnZkVzUwTEZ4dUlDQWdJR0ZzWlhKMExGeHVJQ0FnSUdGMWRHOXlaVzVsZHl4Y2JpQWdJQ0JpYjI5cmJXRnlheXhjYmlBZ0lDQmpZV3hsYm1SaGNpeGNiaUFnSUNCamFHVmpheXhjYmlBZ0lDQmphR1YyY205dUxXUnZkMjRzWEc0Z0lDQWdZMmhsZG5KdmJpMXNaV1owTEZ4dUlDQWdJR05vWlhaeWIyNHRjbWxuYUhRc1hHNGdJQ0FnWTJobGRuSnZiaTExY0N4Y2JpQWdJQ0JqYkc5elpTMWphWEpqYkdVc1hHNGdJQ0FnWTJ4dmMyVXNYRzRnSUNBZ1kzSmxaR2wwTFdOaGNtUXNYRzRnSUNBZ1pHVnNaWFJsTEZ4dUlDQWdJR1Y1WlMxdlptWXNYRzRnSUNBZ1pYbGxMRnh1SUNBZ0lHWnNiM0J3ZVN4Y2JpQWdJQ0JvWldGeWRDeGNiaUFnSUNCb1pXeHdMV05wY21Oc1pTeGNiaUFnSUNCaGNIQXRhRzl0WlN4Y2JpQWdJQ0JvYjIxbExGeHVJQ0FnSUdsdVptOXliV0YwYVc5dUxGeHVJQ0FnSUd4dlkyc3RiM0JsYml4Y2JpQWdJQ0JzYjJOckxYTjBiaTF2Y0dWdUxGeHVJQ0FnSUd4dlkyc3RjM1J1TEZ4dUlDQWdJR3h2WTJzc1hHNGdJQ0FnYkc5dmNDeGNiaUFnSUNCdFpXNTFMRnh1SUNBZ0lIQmxibU5wYkN4Y2JpQWdJQ0J3YkhWekxGeHVJQ0FnSUhCeWFXNTBaWEl0YjNWMGJHbHVaU3hjYmlBZ0lDQndjbWx1ZEdWeUxGeHVJQ0FnSUhKbFpuSmxjMmdzWEc0Z0lDQWdjMlYwZEdsdVozTXNYRzRnSUNBZ2MybG5ibUZzTFRKbkxGeHVJQ0FnSUhOcFoyNWhiQzB6Wnl4Y2JpQWdJQ0J6YVdkdVlXd3ROR2NzWEc0Z0lDQWdjMmxuYm1Gc0xXaHpjR0V0Y0d4MWN5eGNiaUFnSUNCemFXZHVZV3d0YUhOd1lTeGNiaUFnSUNCemFXZHVZV3d0ZG1GeWFXRnVkQ3hjYmlBZ0lDQnphV2R1WVd3c1hHNGdJQ0FnYzNSaGNpMXZkWFJzYVc1bExGeHVJQ0FnSUhOMFlYSXNYRzRnSUNBZ2QybG1hVnh1SUNBcE8xeHVYRzRnSUVCbFlXTm9JQ1J0WWkxcFkyOXVJR2x1SUNScFkyOXVMV3hwYzNRZ2UxeHVJQ0FnSUZ0emVXMWliMnc5SnlON0pHMWlMV2xqYjI1OUoxMGdlMXh1SUNBZ0lDQWdiV0Z6YXkxcGJXRm5aVG9nZFhKc0tDNHZZWE56WlhSekx5TjdKRzFpTFdsamIyNTlMbk4yWnlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0xtbGpiMjRnZTF4dUlDQWdJR1JwYzNCc1lYazZJR2x1YkdsdVpTMWliRzlqYXp0Y2JpQWdJQ0IyWlhKMGFXTmhiQzFoYkdsbmJqb2diV2xrWkd4bE8xeHVJQ0FnSUhkcFpIUm9PaUF5TkhCNE8xeHVJQ0FnSUdobGFXZG9kRG9nTWpSd2VEdGNiaUFnSUNCaVlXTnJaM0p2ZFc1a0xXTnZiRzl5T2lCamRYSnlaVzUwUTI5c2IzSTdYRzRnSUNBZ2JXRnpheTF6YVhwbE9pQmpiM1psY2p0Y2JpQWdJQ0J0WVhOckxYSmxjR1ZoZERvZ2JtOHRjbVZ3WldGME8xeHVJQ0FnSUcxaGMyc3RjRzl6YVhScGIyNDZJR05sYm5SbGNqdGNiaUFnZlZ4dVhHNGdJRnR6YVhwbFBTZHNZWEpuWlNkZElIdGNiaUFnSUNCM2FXUjBhRG9nTXpad2VEdGNiaUFnSUNCb1pXbG5hSFE2SURNMmNIZzdYRzRnSUgxY2JseHVJQ0JiYzJsNlpUMG5aMmxoYm5RblhTQjdYRzRnSUNBZ2QybGtkR2c2SURVMmNIZzdYRzRnSUNBZ2FHVnBaMmgwT2lBMU5uQjRPMXh1SUNCOVhHNWNiaUFnVzNONWJXSnZiRDBuZDJsbWFTZGRJSHRjYmlBZ0lDQndiM05wZEdsdmJqb2djbVZzWVhScGRtVTdYRzRnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUTdYRzVjYmlBZ0lDQW1PanBpWldadmNtVWdlMXh1SUNBZ0lDQWdZMjl1ZEdWdWREb2dKeWM3WEc0Z0lDQWdJQ0J3YjNOcGRHbHZiam9nWVdKemIyeDFkR1U3WEc0Z0lDQWdJQ0JpYjNSMGIyMDZJREE3WEc0Z0lDQWdJQ0JzWldaME9pQXdPMXh1SUNBZ0lDQWdjbWxuYUhRNklEQTdYRzRnSUNBZ0lDQmliM0prWlhJdGNtRmthWFZ6T2lBMU1DVTdYRzRnSUNBZ0lDQmlZV05yWjNKdmRXNWtPaUJqZFhKeVpXNTBRMjlzYjNJN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmx0c1pYWmxiRDBuTUNkZE9qcGlaV1p2Y21VZ2UxeHVJQ0FnSUNBZ2FHVnBaMmgwT2lBd08xeHVJQ0FnSUgxY2JseHVJQ0FnSUNaYmJHVjJaV3c5SnpFblhUbzZZbVZtYjNKbElIdGNiaUFnSUNBZ0lHaGxhV2RvZERvZ05EQWxPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDWmJiR1YyWld3OUp6SW5YVG82WW1WbWIzSmxJSHRjYmlBZ0lDQWdJR2hsYVdkb2REb2dOVFFsTzF4dUlDQWdJSDFjYmx4dUlDQWdJQ1piYkdWMlpXdzlKek1uWFRvNlltVm1iM0psSUh0Y2JpQWdJQ0FnSUdobGFXZG9kRG9nTmpjbE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUNaYmJHVjJaV3c5SnpRblhUbzZZbVZtYjNKbExGeHVJQ0FnSUNaYmJHVjJaV3c5SnpVblhUbzZZbVZtYjNKbElIdGNiaUFnSUNBZ0lHaGxhV2RvZERvZ01UQXdKVHRjYmlBZ0lDQjlYRzRnSUgxY2JpSmRmUT09ICovPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrREEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQUMsQ0FBQyxBQUNkLGtCQUFrQixDQUFFLElBQUksb0JBQW9CLENBQUMsQ0FDckMsVUFBVSxDQUFFLElBQUksb0JBQW9CLENBQUMsQUFDL0MsQ0FBQyxBQUVMLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFDLENBQUMsQUFDWixrQkFBa0IsQ0FBRSxJQUFJLGtCQUFrQixDQUFDLENBQ25DLFVBQVUsQ0FBRSxJQUFJLGtCQUFrQixDQUFDLEFBQzdDLENBQUMsQUFFTCxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBQyxDQUFDLEFBQ2hCLGtCQUFrQixDQUFFLElBQUksc0JBQXNCLENBQUMsQ0FDdkMsVUFBVSxDQUFFLElB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 */";
    append(document.head, style);
  }

  function create_main_fragment$6(component, ctx) {
    var div;

    function click_handler(event) {
      component.fire('click', event);
    }

    return {
      c: function create() {
        div = createElement('div');
        addListener(div, 'click', click_handler);
        div.className = 'icon svelte-se9ah2';
        div.style.cssText = ctx.iconStyle;
        setAttribute(div, 'symbol', ctx.symbol);
        setAttribute(div, 'size', ctx.size);
        setAttribute(div, 'level', ctx.level);
        addLoc(div, file$6, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        component.refs.icon = div;
      },

      p: function update(changed, ctx) {
        if (changed.iconStyle) {
          div.style.cssText = ctx.iconStyle;
        }

        if (changed.symbol) {
          setAttribute(div, 'symbol', ctx.symbol);
        }

        if (changed.size) {
          setAttribute(div, 'size', ctx.size);
        }

        if (changed.level) {
          setAttribute(div, 'level', ctx.level);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        removeListener(div, 'click', click_handler);
        if (component.refs.icon === div) component.refs.icon = null;
      },
    };
  }

  function Icon(options) {
    this._debugName = '<Icon>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$4(), options.data);

    this._recompute({ src: 1, color: 1, width: 1, height: 1 }, this._state);
    if (!('src' in this._state))
      console.warn("<Icon> was created without expected data property 'src'");
    if (!('color' in this._state))
      console.warn("<Icon> was created without expected data property 'color'");
    if (!('width' in this._state))
      console.warn("<Icon> was created without expected data property 'width'");
    if (!('height' in this._state))
      console.warn(
        "<Icon> was created without expected data property 'height'",
      );

    if (!('symbol' in this._state))
      console.warn(
        "<Icon> was created without expected data property 'symbol'",
      );
    if (!('size' in this._state))
      console.warn("<Icon> was created without expected data property 'size'");
    if (!('level' in this._state))
      console.warn("<Icon> was created without expected data property 'level'");
    this._intro = true;

    if (!document.getElementById('svelte-se9ah2-style')) add_css$6();

    this._fragment = create_main_fragment$6(this, this._state);

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);
    }
  }

  assign$1(Icon.prototype, protoDev);

  Icon.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('iconStyle' in newState && !this._updatingReadonlyProperty)
      throw new Error("<Icon>: Cannot set read-only property 'iconStyle'");
  };

  Icon.prototype._recompute = function _recompute(changed, state) {
    if (changed.src || changed.color || changed.width || changed.height) {
      if (this._differs(state.iconStyle, (state.iconStyle = iconStyle(state))))
        changed.iconStyle = true;
    }
  };

  var register = {
    length: 0,
  };
  var hasActiveHandlerFor = function hasActiveHandlerFor(key) {
    return !!register[key] && register[key].length > 0;
  };

  var keystrokeHandler = function keystrokeHandler(e) {
    var keyName = Keyboard.getKeyName(e.charCode || e.which || e.keyCode);
    var keyHandlers = register[keyName];

    if (hasActiveHandlerFor(keyName)) {
      e.preventDefault();
      e.stopImmediatePropagation(); // prevent the <App /> key up event from firing

      keyHandlers.forEach(function(handlers) {
        return handlers(e);
      });
    }
  };

  var listen = function listen() {
    return window.addEventListener('keyup', keystrokeHandler);
  };

  var unlisten = function unlisten() {
    return window.removeEventListener('keyup', keystrokeHandler);
  };

  var addHandler = function addHandler(key, handler) {
    if (key) {
      if (!register[key]) {
        {
          console.log(
            '[@mamba/app/keystroke] Registering manual keystroke handler for "' +
              key +
              '"',
          );
        }

        register[key] = [];
        /** First key in the register, let's start listening */

        if (++register.length === 1) {
          listen();
        }
      }

      register[key].push(handler);
    }
  };
  var removeHandler = function removeHandler(key, handler) {
    if (key && register[key]) {
      var index = register[key].indexOf(handler);

      if (index > -1) {
        register[key].splice(index, 1);

        {
          console.log(
            '[@mamba/app/keystroke] Removing manual keystroke handler for "' +
              key +
              '"',
          );
        }

        if (register[key].length === 0) {
          delete register[key];
        }
      }
      /** Was the last key on the register, let's unlisten */

      if (--register.length === 0) {
        unlisten();
      }
    }
  };

  /* packages/components/App/Keystroke.html generated by Svelte v2.16.1 */

  const onKeystroke = component => e => component.fire('keystroke', e);

  function data$5() {
    return {
      key: null,
      active: true,
    };
  }
  function oncreate$4() {
    this._onKeystroke = onKeystroke(this);
  }
  function ondestroy() {
    removeHandler(this.get().key, this._onKeystroke);
  }
  function onupdate({ changed, current }) {
    /* istanbul ignore else */
    if (changed.active) {
      if (current.active) {
        addHandler(current.key, this._onKeystroke);
      } else {
        removeHandler(current.key, this._onKeystroke);
      }
    }
  }
  function create_main_fragment$7(component, ctx) {
    return {
      c: noop,

      m: noop,

      p: noop,

      d: noop,
    };
  }

  function Keystroke(options) {
    this._debugName = '<Keystroke>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$5(), options.data);
    this._intro = true;
    this._handlers.update = [onupdate];

    this._handlers.destroy = [ondestroy];

    this._fragment = create_main_fragment$7(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$4.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Keystroke.prototype, protoDev);

  Keystroke.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/components/Dialog/Dialog.html generated by Svelte v2.16.1 */

  /** Static variables */
  /** Number of dialogs currently opened */
  let dialogsOpened = 0;
  /** Previous navigable (app meta) object */
  let previousNavigable = null;

  function style$1({ bgColor, textColor }) {
    return [`background-color:${bgColor}`, `color:${textColor}`]
      .filter(Boolean)
      .join(';');
  }
  function data$6() {
    return {
      /** Dialog open state */
      isOpen: false,
      title: undefined,
      bgColor: '#e3e3e3',
      textColor: '#353535',
      align: 'center',
      fullscreen: false,
    };
  }
  var methods$4 = {
    open(duration) {
      this.set({ isOpen: true });

      if (typeof duration !== 'undefined') {
        return this.close(duration);
      }

      return Promise.resolve();
    },
    close(delay) {
      if (typeof delay !== 'undefined') {
        return new Promise(resolve =>
          setTimeout(() => {
            this.close();
            resolve();
          }, parseFloat(delay)),
        );
      }

      this.set({ isOpen: false });

      return Promise.resolve();
    },
    /** Private close method. Used on .close() and ondestroy() */
    _close() {
      /** Allow app to scroll again */
      /* istanbul ignore else */
      if (dialogsOpened === 1 && this.root.meta && previousNavigable != null) {
        /** Let's unlock the app */
        this.root.meta.set({
          navigable: previousNavigable,
          scrollable: true,
        });

        previousNavigable = null;
      }
    },
  };

  function ondestroy$1() {
    /** If the component is being destroyed and the dialog is still opened, let's unlock the app */
    if (this.get().isOpen) {
      this._close();
    }
  }
  function onupdate$1({ changed, current, previous }) {
    /* istanbul ignore next */
    if (changed.isOpen) {
      if (current.isOpen) {
        dialogsOpened++;
        this.fire('open');

        /**
         * Unfocus whatever is focused on the current page.
         * ! This may not work properly if a <Input/> has forcefocus={true}
         */
        document.activeElement.blur();

        if (dialogsOpened === 1 && this.root.meta) {
          const { scrollable, navigable } = this.root.meta.get();

          /** Disable app scroll when opening a dialog */
          /* istanbul ignore else */
          if (scrollable) {
            this.root.meta.set({ scrollable: false });
          }

          previousNavigable = navigable;

          this.root.meta.setNavigable(false);
        }
      } else if (previous) {
        this._close();
        dialogsOpened--;
        this.fire('close');
      }
    }
  }
  const file$7 = 'packages/components/Dialog/Dialog.html';

  function add_css$7() {
    var style = createElement('style');
    style.id = 'svelte-1w2cgro-style';
    style.textContent =
      ".dialog.svelte-1w2cgro{position:fixed;z-index:1000;top:0;left:0;width:100%;bottom:0}.mamba-app.has-appbar .dialog.svelte-1w2cgro:not(.is-fullscreen){top:38px}.mamba-app.has-appbar .dialog.svelte-1w2cgro:not(.is-fullscreen)::before{content:'';display:block;position:absolute;top:-38px;left:0;right:0;bottom:0;background-color:inherit}.dialog.is-fullscreen.svelte-1w2cgro{top:0;z-index:1102}.content.svelte-1w2cgro{width:90%;text-align:center;margin-left:auto;margin-right:auto}.content.-align-top.svelte-1w2cgro{margin-top:15px}.content.-align-center.svelte-1w2cgro{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);text-align:center}.message.svelte-1w2cgro{font-size:16px;line-height:1.23}.title.svelte-1w2cgro{max-width:80%;margin:0 auto 5px;font-size:22px;font-weight:bold}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLmh0bWwiLCJzb3VyY2VzIjpbIkRpYWxvZy5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbInsjaWYgaXNPcGVufVxuICA8ZGl2XG4gICAgY2xhc3M9XCJkaWFsb2dcIlxuICAgIGNsYXNzOmlzLWZ1bGxzY3JlZW49XCJmdWxsc2NyZWVuXCJcbiAgICB7c3R5bGV9XG4gID5cbiAgICA8ZGl2IGNsYXNzPVwiY29udGVudCAtYWxpZ24te2FsaWdufVwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj5cbiAgICAgICAgeyNpZiB0aXRsZX1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj57dGl0bGV9PC9kaXY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIDxzbG90Pjwvc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImV4dHJhXCI+XG4gICAgICAgIDxzbG90IG5hbWU9XCJleHRyYVwiPjwvc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbnsvaWZ9XG5cbjxzY3JpcHQ+XG4gIC8qKiBTdGF0aWMgdmFyaWFibGVzICovXG4gIC8qKiBOdW1iZXIgb2YgZGlhbG9ncyBjdXJyZW50bHkgb3BlbmVkICovXG4gIGxldCBkaWFsb2dzT3BlbmVkID0gMDtcbiAgLyoqIFByZXZpb3VzIG5hdmlnYWJsZSAoYXBwIG1ldGEpIG9iamVjdCAqL1xuICBsZXQgcHJldmlvdXNOYXZpZ2FibGUgPSBudWxsO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBkYXRhKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyoqIERpYWxvZyBvcGVuIHN0YXRlICovXG4gICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgIGJnQ29sb3I6ICcjZTNlM2UzJyxcbiAgICAgICAgdGV4dENvbG9yOiAnIzM1MzUzNScsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgZnVsbHNjcmVlbjogZmFsc2UsXG4gICAgICB9O1xuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIHN0eWxlKHsgYmdDb2xvciwgdGV4dENvbG9yIH0pIHtcbiAgICAgICAgcmV0dXJuIFtgYmFja2dyb3VuZC1jb2xvcjoke2JnQ29sb3J9YCwgYGNvbG9yOiR7dGV4dENvbG9yfWBdXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgIC5qb2luKCc7Jyk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgb25kZXN0cm95KCkge1xuICAgICAgLyoqIElmIHRoZSBjb21wb25lbnQgaXMgYmVpbmcgZGVzdHJveWVkIGFuZCB0aGUgZGlhbG9nIGlzIHN0aWxsIG9wZW5lZCwgbGV0J3MgdW5sb2NrIHRoZSBhcHAgKi9cbiAgICAgIGlmICh0aGlzLmdldCgpLmlzT3Blbikge1xuICAgICAgICB0aGlzLl9jbG9zZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgb251cGRhdGUoeyBjaGFuZ2VkLCBjdXJyZW50LCBwcmV2aW91cyB9KSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKGNoYW5nZWQuaXNPcGVuKSB7XG4gICAgICAgIGlmIChjdXJyZW50LmlzT3Blbikge1xuICAgICAgICAgIGRpYWxvZ3NPcGVuZWQrKztcbiAgICAgICAgICB0aGlzLmZpcmUoJ29wZW4nKTtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFVuZm9jdXMgd2hhdGV2ZXIgaXMgZm9jdXNlZCBvbiB0aGUgY3VycmVudCBwYWdlLlxuICAgICAgICAgICAqICEgVGhpcyBtYXkgbm90IHdvcmsgcHJvcGVybHkgaWYgYSA8SW5wdXQvPiBoYXMgZm9yY2Vmb2N1cz17dHJ1ZX1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblxuICAgICAgICAgIGlmIChkaWFsb2dzT3BlbmVkID09PSAxICYmIHRoaXMucm9vdC5tZXRhKSB7XG4gICAgICAgICAgICBjb25zdCB7IHNjcm9sbGFibGUsIG5hdmlnYWJsZSB9ID0gdGhpcy5yb290Lm1ldGEuZ2V0KCk7XG5cbiAgICAgICAgICAgIC8qKiBEaXNhYmxlIGFwcCBzY3JvbGwgd2hlbiBvcGVuaW5nIGEgZGlhbG9nICovXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgICAgaWYgKHNjcm9sbGFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5yb290Lm1ldGEuc2V0KHsgc2Nyb2xsYWJsZTogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXZpb3VzTmF2aWdhYmxlID0gbmF2aWdhYmxlO1xuXG4gICAgICAgICAgICB0aGlzLnJvb3QubWV0YS5zZXROYXZpZ2FibGUoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwcmV2aW91cykge1xuICAgICAgICAgIHRoaXMuX2Nsb3NlKCk7XG4gICAgICAgICAgZGlhbG9nc09wZW5lZC0tO1xuICAgICAgICAgIHRoaXMuZmlyZSgnY2xvc2UnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgb3BlbihkdXJhdGlvbikge1xuICAgICAgICB0aGlzLnNldCh7IGlzT3BlbjogdHJ1ZSB9KTtcblxuICAgICAgICBpZiAodHlwZW9mIGR1cmF0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNsb3NlKGR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0sXG4gICAgICBjbG9zZShkZWxheSkge1xuICAgICAgICBpZiAodHlwZW9mIGRlbGF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCBwYXJzZUZsb2F0KGRlbGF5KSksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0KHsgaXNPcGVuOiBmYWxzZSB9KTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9LFxuICAgICAgLyoqIFByaXZhdGUgY2xvc2UgbWV0aG9kLiBVc2VkIG9uIC5jbG9zZSgpIGFuZCBvbmRlc3Ryb3koKSAqL1xuICAgICAgX2Nsb3NlKCkge1xuICAgICAgICAvKiogQWxsb3cgYXBwIHRvIHNjcm9sbCBhZ2FpbiAqL1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAoZGlhbG9nc09wZW5lZCA9PT0gMSAmJiB0aGlzLnJvb3QubWV0YSAmJiBwcmV2aW91c05hdmlnYWJsZSAhPSBudWxsKSB7XG4gICAgICAgICAgLyoqIExldCdzIHVubG9jayB0aGUgYXBwICovXG4gICAgICAgICAgdGhpcy5yb290Lm1ldGEuc2V0KHtcbiAgICAgICAgICAgIG5hdmlnYWJsZTogcHJldmlvdXNOYXZpZ2FibGUsXG4gICAgICAgICAgICBzY3JvbGxhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcHJldmlvdXNOYXZpZ2FibGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gIH07XG48L3NjcmlwdD5cblxuPHN0eWxlPi8qIC0tLSAqL1xuXG4vKiogUm93IGNvbXBvbmVudCAqL1xuXG4vKiogSW5wdXQgY29tcG9uZW50ICovXG5cbi8qKiBEaWFsb2cgY29tcG9uZW50ICovXG5cbi8qKiBBZG1pbkxvY2sgY29tcG9uZW50ICovXG5cbi8qIFRhYnMgY29tcG9uZW50ICovXG5cbi8qKlxuICBOb24tb3ZlcnJpZGFibGUgcG9zdGNzcyBzZXR0aW5ncyB2YXJpYWJsZXNcbiovXG5cbi8qKiBMYXllcnMgKi9cblxuLyoqIFVJICovXG5cbi5kaWFsb2cge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB6LWluZGV4OiAxMDAwO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJvdHRvbTogMDtcbiAgfVxuXG46Z2xvYmFsKC5tYW1iYS1hcHAuaGFzLWFwcGJhcikgLmRpYWxvZzpub3QoLmlzLWZ1bGxzY3JlZW4pIHtcbiAgICAgIHRvcDogMzhweDtcbiAgICB9XG5cbjpnbG9iYWwoLm1hbWJhLWFwcC5oYXMtYXBwYmFyKSAuZGlhbG9nOm5vdCguaXMtZnVsbHNjcmVlbik6OmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6ICcnO1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IC0zOHB4O1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBpbmhlcml0O1xuICAgICAgfVxuXG4uZGlhbG9nLmlzLWZ1bGxzY3JlZW4ge1xuICAgICAgdG9wOiAwO1xuICAgICAgei1pbmRleDogMTEwMjtcbiAgICB9XG5cbi5jb250ZW50IHtcbiAgICB3aWR0aDogOTAlO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIH1cblxuLmNvbnRlbnQuLWFsaWduLXRvcCB7XG4gICAgbWFyZ2luLXRvcDogMTVweDtcbiAgfVxuXG4uY29udGVudC4tYWxpZ24tY2VudGVyIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgbGVmdDogNTAlO1xuICAgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuLm1lc3NhZ2Uge1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICBsaW5lLWhlaWdodDogMS4yMztcbiAgfVxuXG4udGl0bGUge1xuICAgIG1heC13aWR0aDogODAlO1xuICAgIG1hcmdpbjogMCBhdXRvIDVweDtcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwyTnZiWEJ2Ym1WdWRITXZSR2xoYkc5bkwyNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwzTmxkSFJwYm1kekxuQmpjM01pTENKd1lXTnJZV2RsY3k5amIyMXdiMjVsYm5SekwwUnBZV3h2Wnk5RWFXRnNiMmN1YUhSdGJDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRjFRa0VzVVVGQlVUczdRVU5vUWxJc2JVSkJRVzFDT3p0QlFWTnVRaXh4UWtGQmNVSTdPMEZCVFhKQ0xITkNRVUZ6UWpzN1FVRk5kRUlzZVVKQlFYbENPenRCUVdWNlFpeHRRa0ZCYlVJN08wRkRNME51UWpzN1EwRkZRenM3UVVGRlJDeFpRVUZaT3p0QlFVOWFMRkZCUVZFN08wRkRVazQ3U1VGRFJTeGxRVUZsTzBsQlEyWXNZVUZCYzBJN1NVRkRkRUlzVFVGQlRUdEpRVU5PTEU5QlFVODdTVUZEVUN4WFFVRlhPMGxCUTFnc1UwRkJVenRGUVhGQ1dEczdRVUZ1UWtVN1RVRkRSU3hUUVVGdFFqdEpRVmx5UWpzN1FVRldSVHRSUVVORkxGZEJRVmM3VVVGRFdDeGpRVUZqTzFGQlEyUXNhMEpCUVd0Q08xRkJRMnhDTEZWQlFXOUNPMUZCUTNCQ0xFOUJRVTg3VVVGRFVDeFJRVUZSTzFGQlExSXNVMEZCVXp0UlFVTlVMSGxDUVVGNVFqdE5RVU16UWpzN1FVRkhSanROUVVORkxFMUJRVTA3VFVGRFRpeGhRVUZwUXp0SlFVTnVRenM3UVVGSFJqdEpRVU5GTEZWQlFWVTdTVUZEVml4clFrRkJhMEk3U1VGRGJFSXNhVUpCUVdsQ08wbEJRMnBDTEd0Q1FVRnJRanRGUVVOd1FqczdRVUZGUVR0SlFVTkZMR2RDUVVGblFqdEZRVU5zUWpzN1FVRkZRVHRKUVVORkxHdENRVUZyUWp0SlFVTnNRaXhSUVVGUk8wbEJRMUlzVTBGQlV6dEpRVU5VTEhkRFFVRm5RenRaUVVGb1F5eG5RMEZCWjBNN1NVRkRhRU1zYTBKQlFXdENPMFZCUTNCQ096dEJRVVZCTzBsQlEwVXNaVUZCWlR0SlFVTm1MR2xDUVVGcFFqdEZRVU51UWpzN1FVRkZRVHRKUVVORkxHTkJRV003U1VGRFpDeHJRa0ZCYTBJN1NVRkRiRUlzWlVGQlpUdEpRVU5tTEdsQ1FVRnBRanRGUVVOdVFpSXNJbVpwYkdVaU9pSndZV05yWVdkbGN5OWpiMjF3YjI1bGJuUnpMMFJwWVd4dlp5OUVhV0ZzYjJjdWFIUnRiQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlSaWJHRmphem9nSXpBd01EdGNibHh1Skhkb2FYUmxPaUFqWm1abU8xeHVKSE5sWVhOb1pXeHNPaUFqWmpGbU1XWXhPMXh1WEc0a2MzUnZibVV0WjNKbFpXNDZJQ00wWm1Jek5ERTdYRzRrYzNSdmJtVXRaM0psWlc0dFpHRnlhem9nSXpFMU16VXlNanRjYmlSemRHOXVaUzFuY21WbGJpMXNhV2RvZERvZ0kyRTJaR1k0WXp0Y2JseHVKR2R5WVhrdFpHRnlhMlZ5T2lBak16VXpOVE0xTzF4dUpHZHlZWGt0WkdGeWF6b2dJelF5TlRrMk16dGNiaVJuY21GNU9pQWpOMlUzWlRkbE8xeHVKR2R5WVhrdGJHbG5hSFE2SUNOaU5XSTFZalU3WEc0a1ozSmhlUzFzYVdkb2RHVnlPaUFqWlRObE5tVTNPMXh1SkdkeVlYa3RiR2xuYUhSbGMzUTZJQ05tTVdZeVpqTTdYRzVjYmlSemFXeDJaWEk2SUNOaVlXSTVZams3WEc0a2MybHNkbVZ5TFd4cFoyaDBPaUFqWkdOa1kyUmpPMXh1WEc0a2NtVmtPaUFqWm1ZeFlURmhPMXh1SkhKbFpDMWtZWEpyT2lBalpEVXdNREF3TzF4dUpISmxaQzFzYVdkb2REb2dJMlU0TldJMVlqdGNibHh1THlvZ0xTMHRJQ292WEc1Y2JpUmliSFZsT2lBak1qRTVObVl6TzF4dUpHSnNkV1V0WkdGeWF6b2dJekUxTmpWak1EdGNibHh1SkdKc2RXVXRaM0poZVMxc2FXZG9kRG9nSXprd1lUUmhaVHRjYmlSaWJIVmxMV2R5WVhrNklDTTJNRGRrT0dJN1hHNGtZbXgxWlMxbmNtRjVMV1JoY21zNklDTTBOVFZoTmpRN1hHNWNiaVJuY21WbGJqb2dJelJsWW1ZeFlUdGNiaVJuY21WaGJpMXNhV2RvZERvZ0l6UmpZV1kxTUR0Y2JpUm5jbVZsYmkxa1lYSnJPaUFqTTJSaE1UQm1PMXh1SkdkeVpXVnVMWEJoZVcxbGJuUTZJQ00wTWprNE5ERTdYRzVjYmlSd2RYSndiR1U2SUNOaFlqUTNZbU03WEc0a2NIVnljR3hsTFdSaGNtczZJQ00zT1RCbE9HSTdYRzRrY0hWeWNHeGxMV3hwWjJoME9pQWpaR1kzT0dWbU8xeHVYRzRrZEdWaGJEb2dJekU1WlROaU1UdGNiaVIwWldGc0xXUmhjbXM2SUNNd01HRm1PVGc3WEc1Y2JpUjVaV3hzYjNjNklDTm1PV0U0TWpVN1hHNGtlV1ZzYkc5M0xXUmhjbXM2SUNObU5UZG1NVGM3WEc0aUxDSkFhVzF3YjNKMElDZGpiMnh2Y25NdWNHTnpjeWM3WEc1Y2JpUmtaV1poZFd4MExYUmxlSFF0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXRsY2p0Y2JpUmtaV1poZFd4MExXWnZiblF0YzJsNlpUb2dNVE53ZUR0Y2JseHVKR0Z3Y0MxaVp5MWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUmxjanRjYmx4dUx5b3FJRkp2ZHlCamIyMXdiMjVsYm5RZ0tpOWNiaVJ5YjNjdGNHRmtaR2x1WnpvZ01USndlQ0F4TlhCNE8xeHVKSEp2ZHkxMGIzQXRhR1ZwWjJoME9pQmhkWFJ2TzF4dUpISnZkeTFpYjNKa1pYSXRZMjlzYjNJNklDUm5jbUY1TFd4cFoyaDBaWEk3WEc0a2NtOTNMV0puTFdOdmJHOXlPaUFrZDJocGRHVTdYRzRrY205M0xYQnlhVzFoY25rdFkyOXNiM0k2SUNSbmNtRjVMV1JoY210bGNqdGNiaVJ5YjNjdGMyVmpiMjVrWVhKNUxXTnZiRzl5T2lBa1ozSmhlVHRjYmlSeWIzY3RabTl1ZEMxemFYcGxPaUF4TkhCNE8xeHVYRzR2S2lvZ1NXNXdkWFFnWTI5dGNHOXVaVzUwSUNvdlhHNGthVzV3ZFhRdFltOXlaR1Z5TFdOdmJHOXlPaUFrWjNKaGVTMXNhV2RvZEdWeU8xeHVKR2x1Y0hWMExXWnZZM1Z6TFdKdmNtUmxjaTFqYjJ4dmNqb2dKSE4wYjI1bExXZHlaV1Z1TzF4dUpHbHVjSFYwTFdsdWRtRnNhV1F0WW05eVpHVnlMV052Ykc5eU9pQWtjbVZrTFd4cFoyaDBPMXh1SkdsdWNIVjBMV1Z5Y205eUxXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVYRzR2S2lvZ1JHbGhiRzluSUdOdmJYQnZibVZ1ZENBcUwxeHVKR1JwWVd4dlp5MXVaV2RoZEdsMlpTMWpiMnh2Y2pvZ0pISmxaQzFzYVdkb2REdGNiaVJrYVdGc2IyY3RjRzl6YVhScGRtVXRZMjlzYjNJNklDUnpkRzl1WlMxbmNtVmxianRjYmlSa2FXRnNiMmN0WTI5dVptbHliV0YwYVc5dUxYQnlhVzFoY25rdFkyOXNiM0k2SUNSbmNtRjVMV1JoY21zN1hHNGtaR2xoYkc5bkxXTnZibVpwY20xaGRHbHZiaTEwWlhoMExXTnZiRzl5T2lBa2QyaHBkR1U3WEc1Y2JpOHFLaUJCWkcxcGJreHZZMnNnWTI5dGNHOXVaVzUwSUNvdlhHNGtZV1J0YVc1c2IyTnJMVzVsWjJGMGFYWmxMV052Ykc5eU9pQWtjbVZrTFd4cFoyaDBPMXh1SkdGa2JXbHViRzlqYXkxMFpYaDBMV052Ykc5eU9pQWtaM0poZVMxa1lYSnJPMXh1SkdGa2JXbHViRzlqYXkxaVlXTnJaM0p2ZFc1a0xXTnZiRzl5T2lBalpqQm1NR1l3TzF4dVhHNGtZblYwZEc5dUxYQnlhVzFoY25rdFkyOXNiM0k2SUNSbmNtVmxianRjYmlSaWRYUjBiMjR0ZEdWNGRDMWpiMnh2Y2pvZ0pIZG9hWFJsTzF4dVhHNGtjM2RwZEdOb0xYVnVZMmhsWTJ0bFpDMWlaem9nSkhOcGJIWmxjanRjYmlSemQybDBZMmd0ZFc1amFHVmphMlZrTFdOdmJHOXlPaUFrYzJWaGMyaGxiR3c3WEc0a2MzZHBkR05vTFdOb1pXTnJaV1F0WW1jNklDUnpkRzl1WlMxbmNtVmxiaTFzYVdkb2REdGNiaVJ6ZDJsMFkyZ3RZMmhsWTJ0bFpDMWpiMnh2Y2pvZ0pHZHlaV1Z1TzF4dUpITjNhWFJqYUMxa2FYTmhZbXhsWkMxaVp6b2dKSE5wYkhabGNpMXNhV2RvZER0Y2JpUnpkMmwwWTJndFpHbHpZV0pzWldRdFkyOXNiM0k2SUNSemFXeDJaWEk3WEc1Y2JpOHFJRlJoWW5NZ1kyOXRjRzl1Wlc1MElDb3ZYRzRrZEdGaUxXNWhkbWxuWVhScGIyNHRZbWM2SUNObU1tWXlaakk3WEc0a2RHRmlMV3hoWW1Wc0xXTnZiRzl5T2lBak5qVTNOemRtTzF4dUpIUmhZaTFwZEdWdExXWnZiblF0YzJsNlpUb2dNVE53ZUR0Y2JpUjBZV0l0YkdsdVpTMWpiMnh2Y2pvZ0pHZHlaV1Z1TzF4dUpIUmhZaTFvWldsbmFIUTZJRFF3Y0hnN1hHNGlMQ0l2S2lwY2JpQWdUbTl1TFc5MlpYSnlhV1JoWW14bElIQnZjM1JqYzNNZ2MyVjBkR2x1WjNNZ2RtRnlhV0ZpYkdWelhHNHFMMXh1WEc0dktpb2dUR0Y1WlhKeklDb3ZYRzRrYkdGNVpYSXRhMlY1WW05aGNtUTZJRGt3TUR0Y2JpUnNZWGxsY2kxa2FXRnNiMmM2SURFd01EQTdYRzRrYkdGNVpYSXRZWEJ3WW1GeU9pQXhNVEF3TzF4dUpHeGhlV1Z5TFd0bGVXSnZZWEprTFdaMWJHeHpZM0psWlc0NklERXhNREU3WEc0a2JHRjVaWEl0WkdsaGJHOW5MV1oxYkd4elkzSmxaVzQ2SURFeE1ESTdYRzVjYmk4cUtpQlZTU0FxTDF4dUpHRndjR0poY2kxb1pXbG5hSFE2SURNNGNIZzdYRzRpTENKY2JpQWdRR2x0Y0c5eWRDQW5RRzFoYldKaEwzTjBlV3hsY3k5elpYUjBhVzVuY3k1d1kzTnpKenRjYmx4dUlDQXVaR2xoYkc5bklIdGNiaUFnSUNCd2IzTnBkR2x2YmpvZ1ptbDRaV1E3WEc0Z0lDQWdlaTFwYm1SbGVEb2dKR3hoZVdWeUxXUnBZV3h2Wnp0Y2JpQWdJQ0IwYjNBNklEQTdYRzRnSUNBZ2JHVm1kRG9nTUR0Y2JpQWdJQ0IzYVdSMGFEb2dNVEF3SlR0Y2JpQWdJQ0JpYjNSMGIyMDZJREE3WEc1Y2JpQWdJQ0E2WjJ4dlltRnNLQzV0WVcxaVlTMWhjSEF1YUdGekxXRndjR0poY2lrZ0pqcHViM1FvTG1sekxXWjFiR3h6WTNKbFpXNHBJSHRjYmlBZ0lDQWdJSFJ2Y0RvZ0pHRndjR0poY2kxb1pXbG5hSFE3WEc1Y2JpQWdJQ0FnSUNZNk9tSmxabTl5WlNCN1hHNGdJQ0FnSUNBZ0lHTnZiblJsYm5RNklDY25PMXh1SUNBZ0lDQWdJQ0JrYVhOd2JHRjVPaUJpYkc5amF6dGNiaUFnSUNBZ0lDQWdjRzl6YVhScGIyNDZJR0ZpYzI5c2RYUmxPMXh1SUNBZ0lDQWdJQ0IwYjNBNklDMGtZWEJ3WW1GeUxXaGxhV2RvZER0Y2JpQWdJQ0FnSUNBZ2JHVm1kRG9nTUR0Y2JpQWdJQ0FnSUNBZ2NtbG5hSFE2SURBN1hHNGdJQ0FnSUNBZ0lHSnZkSFJ2YlRvZ01EdGNiaUFnSUNBZ0lDQWdZbUZqYTJkeWIzVnVaQzFqYjJ4dmNqb2dhVzVvWlhKcGREdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNBbUxtbHpMV1oxYkd4elkzSmxaVzRnZTF4dUlDQWdJQ0FnZEc5d09pQXdPMXh1SUNBZ0lDQWdlaTFwYm1SbGVEb2dKR3hoZVdWeUxXUnBZV3h2WnkxbWRXeHNjMk55WldWdU8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDNWpiMjUwWlc1MElIdGNiaUFnSUNCM2FXUjBhRG9nT1RBbE8xeHVJQ0FnSUhSbGVIUXRZV3hwWjI0NklHTmxiblJsY2p0Y2JpQWdJQ0J0WVhKbmFXNHRiR1ZtZERvZ1lYVjBienRjYmlBZ0lDQnRZWEpuYVc0dGNtbG5hSFE2SUdGMWRHODdYRzRnSUgxY2JseHVJQ0F1WTI5dWRHVnVkQzR0WVd4cFoyNHRkRzl3SUh0Y2JpQWdJQ0J0WVhKbmFXNHRkRzl3T2lBeE5YQjRPMXh1SUNCOVhHNWNiaUFnTG1OdmJuUmxiblF1TFdGc2FXZHVMV05sYm5SbGNpQjdYRzRnSUNBZ2NHOXphWFJwYjI0NklHRmljMjlzZFhSbE8xeHVJQ0FnSUhSdmNEb2dOVEFsTzF4dUlDQWdJR3hsWm5RNklEVXdKVHRjYmlBZ0lDQjBjbUZ1YzJadmNtMDZJSFJ5WVc1emJHRjBaU2d0TlRBbExDQXROVEFsS1R0Y2JpQWdJQ0IwWlhoMExXRnNhV2R1T2lCalpXNTBaWEk3WEc0Z0lIMWNibHh1SUNBdWJXVnpjMkZuWlNCN1hHNGdJQ0FnWm05dWRDMXphWHBsT2lBeE5uQjRPMXh1SUNBZ0lHeHBibVV0YUdWcFoyaDBPaUF4TGpJek8xeHVJQ0I5WEc1Y2JpQWdMblJwZEd4bElIdGNiaUFnSUNCdFlYZ3RkMmxrZEdnNklEZ3dKVHRjYmlBZ0lDQnRZWEpuYVc0NklEQWdZWFYwYnlBMWNIZzdYRzRnSUNBZ1ptOXVkQzF6YVhwbE9pQXlNbkI0TzF4dUlDQWdJR1p2Ym5RdGQyVnBaMmgwT2lCaWIyeGtPMXh1SUNCOVhHNGlYWDA9ICovPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFtSkEsT0FBTyxlQUFDLENBQUMsQUFDTCxRQUFRLENBQUUsS0FBSyxDQUNmLE9BQU8sQ0FBRSxJQUFJLENBQ2IsR0FBRyxDQUFFLENBQUMsQ0FDTixJQUFJLENBQUUsQ0FBQyxDQUNQLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLENBQUMsQUFDWCxDQUFDLEFBRUsscUJBQXFCLEFBQUMsQ0FBQyxzQkFBTyxLQUFLLGNBQWMsQ0FBQyxBQUFDLENBQUMsQUFDdEQsR0FBRyxDQUFFLElBQUksQUFDWCxDQUFDLEFBRUcscUJBQXFCLEFBQUMsQ0FBQyxzQkFBTyxLQUFLLGNBQWMsQ0FBQyxRQUFRLEFBQUMsQ0FBQyxBQUM1RCxPQUFPLENBQUUsRUFBRSxDQUNYLE9BQU8sQ0FBRSxLQUFLLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsR0FBRyxDQUFFLEtBQUssQ0FDVixJQUFJLENBQUUsQ0FBQyxDQUNQLEtBQUssQ0FBRSxDQUFDLENBQ1IsTUFBTSxDQUFFLENBQUMsQ0FDVCxnQkFBZ0IsQ0FBRSxPQUFPLEFBQzNCLENBQUMsQUFFUCxPQUFPLGNBQWMsZUFBQyxDQUFDLEFBQ2pCLEdBQUcsQ0FBRSxDQUFDLENBQ04sT0FBTyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUwsUUFBUSxlQUFDLENBQUMsQUFDTixLQUFLLENBQUUsR0FBRyxDQUNWLFVBQVUsQ0FBRSxNQUFNLENBQ2xCLFdBQVcsQ0FBRSxJQUFJLENBQ2pCLFlBQVksQ0FBRSxJQUFJLEFBQ3BCLENBQUMsQUFFSCxRQUFRLFdBQVcsZUFBQyxDQUFDLEFBQ2pCLFVBQVUsQ0FBRSxJQUFJLEFBQ2xCLENBQUMsQUFFSCxRQUFRLGNBQWMsZUFBQyxDQUFDLEFBQ3BCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxHQUFHLENBQ1IsSUFBSSxDQUFFLEdBQUcsQ0FDVCxpQkFBaUIsQ0FBRSxVQUFVLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNoQyxTQUFTLENBQUUsVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDeEMsVUFBVSxDQUFFLE1BQU0sQUFDcEIsQ0FBQyxBQUVILFFBQVEsZUFBQyxDQUFDLEFBQ04sU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxBQUNuQixDQUFDLEFBRUgsTUFBTSxlQUFDLENBQUMsQUFDSixTQUFTLENBQUUsR0FBRyxDQUNkLE1BQU0sQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDbEIsU0FBUyxDQUFFLElBQUksQ0FDZixXQUFXLENBQUUsSUFBSSxBQUNuQixDQUFDIn0= */";
    append(document.head, style);
  }

  function create_main_fragment$8(component, ctx) {
    var if_block_anchor;

    var if_block = ctx.isOpen && create_if_block$1(component, ctx);

    return {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = createComment();
      },

      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },

      p: function update(changed, ctx) {
        if (ctx.isOpen) {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block$1(component, ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },

      d: function destroy(detach) {
        if (if_block) if_block.d(detach);
        if (detach) {
          detachNode(if_block_anchor);
        }
      },
    };
  }

  // (1:0) {#if isOpen}
  function create_if_block$1(component, ctx) {
    var div3,
      div2,
      div0,
      text0,
      slot_content_default = component._slotted.default,
      slot_content_default_before,
      text1,
      div1,
      slot_content_extra = component._slotted.extra,
      div2_class_value;

    var if_block = ctx.title && create_if_block_1(component, ctx);

    return {
      c: function create() {
        div3 = createElement('div');
        div2 = createElement('div');
        div0 = createElement('div');
        if (if_block) if_block.c();
        text0 = createText('\n        ');
        text1 = createText('\n      ');
        div1 = createElement('div');
        div0.className = 'message svelte-1w2cgro';
        addLoc(div0, file$7, 7, 6, 139);
        div1.className = 'extra';
        addLoc(div1, file$7, 13, 6, 279);
        div2.className = div2_class_value =
          'content -align-' + ctx.align + ' svelte-1w2cgro';
        addLoc(div2, file$7, 6, 4, 96);
        div3.className = 'dialog svelte-1w2cgro';
        div3.style.cssText = ctx.style;
        toggleClass(div3, 'is-fullscreen', ctx.fullscreen);
        addLoc(div3, file$7, 1, 2, 15);
      },

      m: function mount(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div2);
        append(div2, div0);
        if (if_block) if_block.m(div0, null);
        append(div0, text0);

        if (slot_content_default) {
          append(
            div0,
            slot_content_default_before ||
              (slot_content_default_before = createComment()),
          );
          append(div0, slot_content_default);
        }

        append(div2, text1);
        append(div2, div1);

        if (slot_content_extra) {
          append(div1, slot_content_extra);
        }
      },

      p: function update(changed, ctx) {
        if (ctx.title) {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block_1(component, ctx);
            if_block.c();
            if_block.m(div0, text0);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (
          changed.align &&
          div2_class_value !==
            (div2_class_value =
              'content -align-' + ctx.align + ' svelte-1w2cgro')
        ) {
          div2.className = div2_class_value;
        }

        if (changed.style) {
          div3.style.cssText = ctx.style;
        }

        if (changed.fullscreen) {
          toggleClass(div3, 'is-fullscreen', ctx.fullscreen);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div3);
        }

        if (if_block) if_block.d();

        if (slot_content_default) {
          reinsertAfter(slot_content_default_before, slot_content_default);
        }

        if (slot_content_extra) {
          reinsertChildren(div1, slot_content_extra);
        }
      },
    };
  }

  // (9:8) {#if title}
  function create_if_block_1(component, ctx) {
    var div, text;

    return {
      c: function create() {
        div = createElement('div');
        text = createText(ctx.title);
        div.className = 'title svelte-1w2cgro';
        addLoc(div, file$7, 9, 10, 191);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        append(div, text);
      },

      p: function update(changed, ctx) {
        if (changed.title) {
          setData(text, ctx.title);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }
      },
    };
  }

  function Dialog(options) {
    this._debugName = '<Dialog>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$6(), options.data);

    this._recompute({ bgColor: 1, textColor: 1 }, this._state);
    if (!('bgColor' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'bgColor'",
      );
    if (!('textColor' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'textColor'",
      );
    if (!('isOpen' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'isOpen'",
      );
    if (!('fullscreen' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'fullscreen'",
      );

    if (!('align' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'align'",
      );
    if (!('title' in this._state))
      console.warn(
        "<Dialog> was created without expected data property 'title'",
      );
    this._intro = true;
    this._handlers.update = [onupdate$1];

    this._handlers.destroy = [ondestroy$1];

    this._slotted = options.slots || {};

    if (!document.getElementById('svelte-1w2cgro-style')) add_css$7();

    this._fragment = create_main_fragment$8(this, this._state);

    this.root._oncreate.push(() => {
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Dialog.prototype, protoDev);
  assign$1(Dialog.prototype, methods$4);

  Dialog.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('style' in newState && !this._updatingReadonlyProperty)
      throw new Error("<Dialog>: Cannot set read-only property 'style'");
  };

  Dialog.prototype._recompute = function _recompute(changed, state) {
    if (changed.bgColor || changed.textColor) {
      if (this._differs(state.style, (state.style = style$1(state))))
        changed.style = true;
    }
  };

  var loadingSprite = '3492bba039644d8d.png';

  /* packages/components/Sprite/Sprite.html generated by Svelte v2.16.1 */

  const FPS = 60;

  function data$7() {
    return {
      _position: 0,
      src: null,
      width: 0,
      height: 0,
    };
  }
  var methods$5 = {
    start() {
      /** Don't allow to run more than one interval */
      if (this.interval != null) {
        return;
      }

      const { spriteWidth } = this;
      const { _position } = this.get();

      /* istanbul ignore next */
      const STEP = spriteWidth ? spriteWidth / FPS : 0;
      let positionAux = _position;

      /* istanbul ignore next */
      const interval = setInterval(() => {
        positionAux -= STEP;
        if (positionAux < -spriteWidth) {
          positionAux = 0;
        }
        this.set({ _position: positionAux });
      }, 1000 / FPS);

      this.interval = interval;
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    },
  };

  function oncreate$5() {
    const { src, width, height } = this.get();
    const { sprite } = this.refs;
    const image = new Image();

    sprite.style.backgroundImage = `url(${src})`;
    sprite.style.width = width;
    sprite.style.height = height || width;

    image.onload = () => {
      this.spriteWidth = image.width;
      this.start();
    };
    image.src = src;
  }
  function ondestroy$2() {
    /* istanbul ignore next */
    clearInterval(this.interval);
  }
  const file$8 = 'packages/components/Sprite/Sprite.html';

  function add_css$8() {
    var style = createElement('style');
    style.id = 'svelte-zfppi9-style';
    style.textContent =
      '.sprite.svelte-zfppi9{display:inline-block}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ByaXRlLmh0bWwiLCJzb3VyY2VzIjpbIlNwcml0ZS5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxkaXZcbiAgcmVmOnNwcml0ZVxuICBzdHlsZT1cImJhY2tncm91bmQtcG9zaXRpb246IHtfcG9zaXRpb259cHggMDtcIlxuICBjbGFzcz1cInNwcml0ZVwiXG4+PC9kaXY+XG5cbjxzY3JpcHQ+XG4gIGNvbnN0IEZQUyA9IDYwO1xuXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBkYXRhKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX3Bvc2l0aW9uOiAwLFxuICAgICAgICBzcmM6IG51bGwsXG4gICAgICAgIHdpZHRoOiAwLFxuICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICB9O1xuICAgIH0sXG4gICAgb25jcmVhdGUoKSB7XG4gICAgICBjb25zdCB7IHNyYywgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5nZXQoKTtcbiAgICAgIGNvbnN0IHsgc3ByaXRlIH0gPSB0aGlzLnJlZnM7XG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBzcHJpdGUuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3NyY30pYDtcbiAgICAgIHNwcml0ZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgc3ByaXRlLnN0eWxlLmhlaWdodCA9IGhlaWdodCB8fCB3aWR0aDtcblxuICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNwcml0ZVdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgIH07XG4gICAgICBpbWFnZS5zcmMgPSBzcmM7XG4gICAgfSxcbiAgICBvbmRlc3Ryb3koKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIHN0YXJ0KCkge1xuICAgICAgICAvKiogRG9uJ3QgYWxsb3cgdG8gcnVuIG1vcmUgdGhhbiBvbmUgaW50ZXJ2YWwgKi9cbiAgICAgICAgaWYgKHRoaXMuaW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgc3ByaXRlV2lkdGggfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgX3Bvc2l0aW9uIH0gPSB0aGlzLmdldCgpO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNvbnN0IFNURVAgPSBzcHJpdGVXaWR0aCA/IHNwcml0ZVdpZHRoIC8gRlBTIDogMDtcbiAgICAgICAgbGV0IHBvc2l0aW9uQXV4ID0gX3Bvc2l0aW9uO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHBvc2l0aW9uQXV4IC09IFNURVA7XG4gICAgICAgICAgaWYgKHBvc2l0aW9uQXV4IDwgLXNwcml0ZVdpZHRoKSB7XG4gICAgICAgICAgICBwb3NpdGlvbkF1eCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0KHsgX3Bvc2l0aW9uOiBwb3NpdGlvbkF1eCB9KTtcbiAgICAgICAgfSwgMTAwMCAvIEZQUyk7XG5cbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xuICAgICAgfSxcbiAgICAgIHN0b3AoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICAgICAgfSxcbiAgICB9LFxuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiAtLS0gKi9cblxuLyoqIFJvdyBjb21wb25lbnQgKi9cblxuLyoqIElucHV0IGNvbXBvbmVudCAqL1xuXG4vKiogRGlhbG9nIGNvbXBvbmVudCAqL1xuXG4vKiogQWRtaW5Mb2NrIGNvbXBvbmVudCAqL1xuXG4vKiBUYWJzIGNvbXBvbmVudCAqL1xuXG4uc3ByaXRlIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwyTnZiWEJ2Ym1WdWRITXZVM0J5YVhSbEwxTndjbWwwWlM1b2RHMXNJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRWFZDUVN4UlFVRlJPenRCUTJoQ1VpeHRRa0ZCYlVJN08wRkJVMjVDTEhGQ1FVRnhRanM3UVVGTmNrSXNjMEpCUVhOQ096dEJRVTEwUWl4NVFrRkJlVUk3TzBGQlpYcENMRzFDUVVGdFFqczdRVU14UTJwQ08wbEJRMFVzY1VKQlFYRkNPMFZCUTNaQ0lpd2labWxzWlNJNkluQmhZMnRoWjJWekwyTnZiWEJ2Ym1WdWRITXZVM0J5YVhSbEwxTndjbWwwWlM1b2RHMXNJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSkdKc1lXTnJPaUFqTURBd08xeHVYRzRrZDJocGRHVTZJQ05tWm1ZN1hHNGtjMlZoYzJobGJHdzZJQ05tTVdZeFpqRTdYRzVjYmlSemRHOXVaUzFuY21WbGJqb2dJelJtWWpNME1UdGNiaVJ6ZEc5dVpTMW5jbVZsYmkxa1lYSnJPaUFqTVRVek5USXlPMXh1SkhOMGIyNWxMV2R5WldWdUxXeHBaMmgwT2lBallUWmtaamhqTzF4dVhHNGtaM0poZVMxa1lYSnJaWEk2SUNNek5UTTFNelU3WEc0a1ozSmhlUzFrWVhKck9pQWpOREkxT1RZek8xeHVKR2R5WVhrNklDTTNaVGRsTjJVN1hHNGtaM0poZVMxc2FXZG9kRG9nSTJJMVlqVmlOVHRjYmlSbmNtRjVMV3hwWjJoMFpYSTZJQ05sTTJVMlpUYzdYRzRrWjNKaGVTMXNhV2RvZEdWemREb2dJMll4WmpKbU16dGNibHh1SkhOcGJIWmxjam9nSTJKaFlqbGlPVHRjYmlSemFXeDJaWEl0YkdsbmFIUTZJQ05rWTJSalpHTTdYRzVjYmlSeVpXUTZJQ05tWmpGaE1XRTdYRzRrY21Wa0xXUmhjbXM2SUNOa05UQXdNREE3WEc0a2NtVmtMV3hwWjJoME9pQWpaVGcxWWpWaU8xeHVYRzR2S2lBdExTMGdLaTljYmx4dUpHSnNkV1U2SUNNeU1UazJaak03WEc0a1lteDFaUzFrWVhKck9pQWpNVFUyTldNd08xeHVYRzRrWW14MVpTMW5jbUY1TFd4cFoyaDBPaUFqT1RCaE5HRmxPMXh1SkdKc2RXVXRaM0poZVRvZ0l6WXdOMlE0WWp0Y2JpUmliSFZsTFdkeVlYa3RaR0Z5YXpvZ0l6UTFOV0UyTkR0Y2JseHVKR2R5WldWdU9pQWpOR1ZpWmpGaE8xeHVKR2R5WldGdUxXeHBaMmgwT2lBak5HTmhaalV3TzF4dUpHZHlaV1Z1TFdSaGNtczZJQ016WkdFeE1HWTdYRzRrWjNKbFpXNHRjR0Y1YldWdWREb2dJelF5T1RnME1UdGNibHh1SkhCMWNuQnNaVG9nSTJGaU5EZGlZenRjYmlSd2RYSndiR1V0WkdGeWF6b2dJemM1TUdVNFlqdGNiaVJ3ZFhKd2JHVXRiR2xuYUhRNklDTmtaamM0WldZN1hHNWNiaVIwWldGc09pQWpNVGxsTTJJeE8xeHVKSFJsWVd3dFpHRnlhem9nSXpBd1lXWTVPRHRjYmx4dUpIbGxiR3h2ZHpvZ0kyWTVZVGd5TlR0Y2JpUjVaV3hzYjNjdFpHRnlhem9nSTJZMU4yWXhOenRjYmlJc0lrQnBiWEJ2Y25RZ0oyTnZiRzl5Y3k1d1kzTnpKenRjYmx4dUpHUmxabUYxYkhRdGRHVjRkQzFqYjJ4dmNqb2dKR2R5WVhrdFpHRnlhMlZ5TzF4dUpHUmxabUYxYkhRdFptOXVkQzF6YVhwbE9pQXhNM0I0TzF4dVhHNGtZWEJ3TFdKbkxXTnZiRzl5T2lBa1ozSmhlUzFzYVdkb2RHVnlPMXh1WEc0dktpb2dVbTkzSUdOdmJYQnZibVZ1ZENBcUwxeHVKSEp2ZHkxd1lXUmthVzVuT2lBeE1uQjRJREUxY0hnN1hHNGtjbTkzTFhSdmNDMW9aV2xuYUhRNklHRjFkRzg3WEc0a2NtOTNMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pHZHlZWGt0YkdsbmFIUmxjanRjYmlSeWIzY3RZbWN0WTI5c2IzSTZJQ1IzYUdsMFpUdGNiaVJ5YjNjdGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YTJWeU8xeHVKSEp2ZHkxelpXTnZibVJoY25rdFkyOXNiM0k2SUNSbmNtRjVPMXh1SkhKdmR5MW1iMjUwTFhOcGVtVTZJREUwY0hnN1hHNWNiaThxS2lCSmJuQjFkQ0JqYjIxd2IyNWxiblFnS2k5Y2JpUnBibkIxZEMxaWIzSmtaWEl0WTI5c2IzSTZJQ1JuY21GNUxXeHBaMmgwWlhJN1hHNGthVzV3ZFhRdFptOWpkWE10WW05eVpHVnlMV052Ykc5eU9pQWtjM1J2Ym1VdFozSmxaVzQ3WEc0a2FXNXdkWFF0YVc1MllXeHBaQzFpYjNKa1pYSXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzRrYVc1d2RYUXRaWEp5YjNJdFkyOXNiM0k2SUNSeVpXUXRiR2xuYUhRN1hHNWNiaThxS2lCRWFXRnNiMmNnWTI5dGNHOXVaVzUwSUNvdlhHNGtaR2xoYkc5bkxXNWxaMkYwYVhabExXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR1JwWVd4dlp5MXdiM05wZEdsMlpTMWpiMnh2Y2pvZ0pITjBiMjVsTFdkeVpXVnVPMXh1SkdScFlXeHZaeTFqYjI1bWFYSnRZWFJwYjI0dGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YXp0Y2JpUmthV0ZzYjJjdFkyOXVabWx5YldGMGFXOXVMWFJsZUhRdFkyOXNiM0k2SUNSM2FHbDBaVHRjYmx4dUx5b3FJRUZrYldsdVRHOWpheUJqYjIxd2IyNWxiblFnS2k5Y2JpUmhaRzFwYm14dlkyc3RibVZuWVhScGRtVXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzRrWVdSdGFXNXNiMk5yTFhSbGVIUXRZMjlzYjNJNklDUm5jbUY1TFdSaGNtczdYRzRrWVdSdGFXNXNiMk5yTFdKaFkydG5jbTkxYm1RdFkyOXNiM0k2SUNObU1HWXdaakE3WEc1Y2JpUmlkWFIwYjI0dGNISnBiV0Z5ZVMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkdKMWRIUnZiaTEwWlhoMExXTnZiRzl5T2lBa2QyaHBkR1U3WEc1Y2JpUnpkMmwwWTJndGRXNWphR1ZqYTJWa0xXSm5PaUFrYzJsc2RtVnlPMXh1SkhOM2FYUmphQzExYm1Ob1pXTnJaV1F0WTI5c2IzSTZJQ1J6WldGemFHVnNiRHRjYmlSemQybDBZMmd0WTJobFkydGxaQzFpWnpvZ0pITjBiMjVsTFdkeVpXVnVMV3hwWjJoME8xeHVKSE4zYVhSamFDMWphR1ZqYTJWa0xXTnZiRzl5T2lBa1ozSmxaVzQ3WEc0a2MzZHBkR05vTFdScGMyRmliR1ZrTFdKbk9pQWtjMmxzZG1WeUxXeHBaMmgwTzF4dUpITjNhWFJqYUMxa2FYTmhZbXhsWkMxamIyeHZjam9nSkhOcGJIWmxjanRjYmx4dUx5b2dWR0ZpY3lCamIyMXdiMjVsYm5RZ0tpOWNiaVIwWVdJdGJtRjJhV2RoZEdsdmJpMWlaem9nSTJZeVpqSm1NanRjYmlSMFlXSXRiR0ZpWld3dFkyOXNiM0k2SUNNMk5UYzNOMlk3WEc0a2RHRmlMV2wwWlcwdFptOXVkQzF6YVhwbE9pQXhNM0I0TzF4dUpIUmhZaTFzYVc1bExXTnZiRzl5T2lBa1ozSmxaVzQ3WEc0a2RHRmlMV2hsYVdkb2REb2dOREJ3ZUR0Y2JpSXNJbHh1SUNBdWMzQnlhWFJsSUh0Y2JpQWdJQ0JrYVhOd2JHRjVPaUJwYm14cGJtVXRZbXh2WTJzN1hHNGdJSDFjYmlKZGZRPT0gKi88L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtGQSxPQUFPLGNBQUMsQ0FBQyxBQUNMLE9BQU8sQ0FBRSxZQUFZLEFBQ3ZCLENBQUMifQ== */';
    append(document.head, style);
  }

  function create_main_fragment$9(component, ctx) {
    var div;

    return {
      c: function create() {
        div = createElement('div');
        setStyle(div, 'background-position', '' + ctx._position + 'px 0');
        div.className = 'sprite svelte-zfppi9';
        addLoc(div, file$8, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        component.refs.sprite = div;
      },

      p: function update(changed, ctx) {
        if (changed._position) {
          setStyle(div, 'background-position', '' + ctx._position + 'px 0');
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        if (component.refs.sprite === div) component.refs.sprite = null;
      },
    };
  }

  function Sprite(options) {
    this._debugName = '<Sprite>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$7(), options.data);
    if (!('_position' in this._state))
      console.warn(
        "<Sprite> was created without expected data property '_position'",
      );
    this._intro = true;

    this._handlers.destroy = [ondestroy$2];

    if (!document.getElementById('svelte-zfppi9-style')) add_css$8();

    this._fragment = create_main_fragment$9(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$5.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Sprite.prototype, protoDev);
  assign$1(Sprite.prototype, methods$5);

  Sprite.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/components/Sprite/Loading.html generated by Svelte v2.16.1 */

  var src = loadingSprite;

  var methods$6 = {
    start() {
      this.refs.sprite.start();
    },
    stop() {
      this.refs.sprite.stop();
    },
  };

  function create_main_fragment$a(component, ctx) {
    var sprite_initial_data = { src: src, width: '70px' };
    var sprite = new Sprite({
      root: component.root,
      store: component.store,
      data: sprite_initial_data,
    });

    component.refs.sprite = sprite;

    return {
      c: function create() {
        sprite._fragment.c();
      },

      m: function mount(target, anchor) {
        sprite._mount(target, anchor);
      },

      p: noop,

      d: function destroy(detach) {
        sprite.destroy(detach);
        if (component.refs.sprite === sprite) component.refs.sprite = null;
      },
    };
  }

  function Loading(options) {
    this._debugName = '<Loading>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1({}, options.data);
    this._intro = true;

    this._fragment = create_main_fragment$a(this, this._state);

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Loading.prototype, protoDev);
  assign$1(Loading.prototype, methods$6);

  Loading.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/apps/Launcher.html generated by Svelte v2.16.1 */

  const STATES$1 = {
    LOCKSCREEN: 0,
    HOME: 1,
    LOADING: 2,
    APP: 3,
  };

  const APP_INDEXES = [
    'payment',
    'cancellation',
    'calculator',
    'reprint',
    'reports',
    'closing',
    'settings',
    'help',
  ].reduce((acc, name, index) => {
    acc[name] = index;
    return acc;
  }, {});

  function appsList({ apps }) {
    return Object.values(apps).reduce((acc, app) => {
      const { name } = app.manifest;
      if (typeof APP_INDEXES[name] !== 'undefined') {
        acc.splice(APP_INDEXES[name], 0, app);
      } else {
        acc.push(app);
      }
      return acc;
    }, []);
  }

  function data$8() {
    const { hours: initHours, minutes: initMinutes } = System.getCurrentTime();
    const { displayName } = Registry.persistent.get().$Merchant;

    return {
      STATE: STATES$1.LOCKSCREEN,
      time: `${initHours}:${initMinutes}`,
      apps: { ...AppManager.getInstalledApps() },
      displayName,
    };
  }
  var methods$7 = {
    openPaymentApp() {
      const { apps } = this.get();

      if (apps['1-payment']) {
        this.openApp(apps['1-payment'], { openMode: 'detection' });
      } else {
        // TODO: fake payment app
        warn(
          "Should open payment app but it's not installed\nTODO: placeholder payment app.",
        );
      }
    },
    openApp(appMeta, options) {
      this.set({ STATE: STATES$1.APP });
      AppManager.open(appMeta.manifest.slug, options);
    },
    gotoLockscreen() {
      this.set({ STATE: STATES$1.LOCKSCREEN });
      document.title = 'MambaWeb - Lockscreen';
    },
    gotoHome() {
      this.set({ STATE: STATES$1.HOME });
      document.title = 'MambaWeb - Home';
    },
  };

  function oncreate$6() {
    /** Update the clock after each second */
    System.on('clock', (newHours, newMinutes) => {
      this.set({ time: `${newHours}:${newMinutes}` });
    });

    /** Listen to an app being opened and guarantee the Launcher is ready to open it */
    AppManager.on('loading', () => {
      this.refs.loadingDialog.open();
    });

    AppManager.on('opening', () => {
      const { STATE } = this.get();
      if (STATE !== STATES$1.APP) {
        this.set({ STATE: STATES$1.APP });
      }
      this.refs.loadingDialog.close(100);
    });

    AppManager.on('closed', () => {
      if (AppManager.getOpenedApps().length === 0) {
        window.history.pushState('', document.title, window.location.pathname);
        this.gotoHome();
      }
    });

    AppManager.on('appInstalled', () => {
      this.set({
        apps: { ...AppManager.getInstalledApps() },
      });
    });

    HardwareManager.on('cardInserted', () => {
      if (this.get().STATE !== STATES$1.APP) {
        this.openPaymentApp();
      }
    });
  }
  const file$9 = 'packages/pos/simulator/view/pos/apps/Launcher.html';

  function add_css$9() {
    var style = createElement('style');
    style.id = 'svelte-g985rf-style';
    style.textContent =
      "#apps-container{height:100%;position:relative}.mamba-app-container{position:absolute;left:0;top:0;right:0;bottom:0}.mamba-app-container.is-suspended{display:none}.launcher.svelte-g985rf{height:100%;overflow:auto}.lockscreen.svelte-g985rf,.home.svelte-g985rf{min-height:100%;background-color:#fff}.lockscreen.svelte-g985rf{text-align:center;overflow:hidden;padding:0 10px}time.svelte-g985rf{color:#7e7e7e;display:block;margin-top:35px;font-size:64px}.merchant.svelte-g985rf{color:#000;line-height:1.2;font-size:22px;margin:8px 0 20px}.home.svelte-g985rf{padding:5px;background-color:#e3e6e7;font-size:0}.app-item.svelte-g985rf{cursor:pointer;position:relative;width:50%;display:inline-block;vertical-align:middle;text-align:center;padding:5px;background-color:#fff;background-clip:content-box}.app-item.svelte-g985rf::before{content:'';display:block;width:100%;padding-bottom:100%}.app-item.svelte-g985rf .content.svelte-g985rf{position:absolute;width:100%;padding:0 5px;top:50%;left:50%;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%);font-size:12px;font-weight:bold}.app-item.svelte-g985rf .content .icon.svelte-g985rf{width:50px;height:50px;margin:0 auto}.app-item.svelte-g985rf .content .icon img.svelte-g985rf{width:100%;height:auto}.app-item.svelte-g985rf .title.svelte-g985rf{margin-top:5px}@media(min-width: 401px){.mamba-app-container{overflow:auto\n  }}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF1bmNoZXIuaHRtbCIsInNvdXJjZXMiOlsiTGF1bmNoZXIuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyI8RGlhbG9nIHJlZjpsb2FkaW5nRGlhbG9nIGZ1bGxzY3JlZW4+XG4gIDxMb2FkaW5nU3ByaXRlIC8+XG48L0RpYWxvZz5cblxueyNpZiBTVEFURSA9PT0gU1RBVEVTLkFQUH1cbiAgPGRpdiBpZD1cImFwcHMtY29udGFpbmVyXCIgY2xhc3M9XCJoaWRlLXNjcm9sbGJhcnNcIj48L2Rpdj5cbns6ZWxzZX1cbiAgPGRpdiBjbGFzcz1cImxhdW5jaGVyIGhpZGUtc2Nyb2xsYmFyc1wiPlxuICAgIHsjaWYgU1RBVEUgPT09IFNUQVRFUy5MT0NLU0NSRUVOfVxuICAgICAgPGRpdiBjbGFzcz1cImxvY2tzY3JlZW5cIj5cbiAgICAgICAgPHRpbWU+e3RpbWV9PC90aW1lPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVyY2hhbnRcIj57IGRpc3BsYXlOYW1lIH08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIj48L2Rpdj5cblxuICAgICAgICA8QnV0dG9uIHNpemU9XCJmdWxsXCIgYm90dG9tIG9uOmNsaWNrPVwiZ290b0hvbWUoKVwiIHNob3J0Y3V0PVwiZW50ZXJcIj5cbiAgICAgICAgICA8SWNvbiBzeW1ib2w9XCJob21lXCIgY29sb3I9XCIjZmZmXCIvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8S2V5c3Ryb2tlIGtleT1cImVudGVyXCIgb246a2V5c3Ryb2tlPVwiZ290b0hvbWUoKVwiIC8+XG4gICAgey9pZn1cblxuICAgIHsjaWYgU1RBVEUgPT09IFNUQVRFUy5IT01FfVxuICAgICAgPGRpdiBjbGFzcz1cImhvbWVcIj5cbiAgICAgICAgeyNlYWNoIGFwcHNMaXN0IGFzIGFwcH1cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXBwLWl0ZW1cIiBvbjpjbGljaz1cIm9wZW5BcHAoYXBwKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIj5cbiAgICAgICAgICAgICAgICA8aW1nIHNyYz17YXBwLm1hbmlmZXN0Lmljb259IGFsdD1cInthcHAubWFuaWZlc3QubmFtZX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxuICAgICAgICAgICAgICAgIHthcHAubWFuaWZlc3QuYXBwTmFtZX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9lYWNofVxuICAgICAgPC9kaXY+XG4gICAgICA8S2V5c3Ryb2tlIGtleT1cImJhY2tcIiBvbjprZXlzdHJva2U9XCJnb3RvTG9ja3NjcmVlbigpXCIgLz5cbiAgICAgIDxLZXlzdHJva2Uga2V5PVwiY2xvc2VcIiBvbjprZXlzdHJva2U9XCJnb3RvTG9ja3NjcmVlbigpXCIgLz5cbiAgICAgIDxLZXlzdHJva2Uga2V5PVwiZW50ZXJcIiBvbjprZXlzdHJva2U9XCJnb3RvTG9ja3NjcmVlbigpXCIgLz5cbiAgICB7L2lmfVxuICA8L2Rpdj5cbnsvaWZ9XG5cbjxzY3JpcHQ+XG4gIGltcG9ydCB7XG4gICAgQXBwTWFuYWdlcixcbiAgICBTeXN0ZW0sXG4gICAgSGFyZHdhcmVNYW5hZ2VyLFxuICAgIFJlZ2lzdHJ5LFxuICB9IGZyb20gJy4uLy4uLy4uL2luZGV4LmpzJztcbiAgaW1wb3J0IHsgd2FybiB9IGZyb20gJy4uLy4uLy4uL2xpYnMvdXRpbHMuanMnO1xuXG4gIGNvbnN0IFNUQVRFUyA9IHtcbiAgICBMT0NLU0NSRUVOOiAwLFxuICAgIEhPTUU6IDEsXG4gICAgTE9BRElORzogMixcbiAgICBBUFA6IDMsXG4gIH07XG5cbiAgY29uc3QgQVBQX0lOREVYRVMgPSBbXG4gICAgJ3BheW1lbnQnLFxuICAgICdjYW5jZWxsYXRpb24nLFxuICAgICdjYWxjdWxhdG9yJyxcbiAgICAncmVwcmludCcsXG4gICAgJ3JlcG9ydHMnLFxuICAgICdjbG9zaW5nJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdoZWxwJyxcbiAgXS5yZWR1Y2UoKGFjYywgbmFtZSwgaW5kZXgpID0+IHtcbiAgICBhY2NbbmFtZV0gPSBpbmRleDtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgIEJ1dHRvbjogJ0BtYW1iYS9idXR0b24nLFxuICAgICAgSWNvbjogJ0BtYW1iYS9pY29uJyxcbiAgICAgIEtleXN0cm9rZTogJ0BtYW1iYS9hcHAvS2V5c3Ryb2tlLmh0bWwnLFxuICAgICAgRGlhbG9nOiAnQG1hbWJhL2RpYWxvZycsXG4gICAgICBMb2FkaW5nU3ByaXRlOiAnQG1hbWJhL3Nwcml0ZS9Mb2FkaW5nLmh0bWwnLFxuICAgIH0sXG4gICAgaGVscGVyczoge1xuICAgICAgU1RBVEVTLFxuICAgIH0sXG4gICAgZGF0YSgpIHtcbiAgICAgIGNvbnN0IHsgaG91cnM6IGluaXRIb3VycywgbWludXRlczogaW5pdE1pbnV0ZXMgfSA9IFN5c3RlbS5nZXRDdXJyZW50VGltZSgpO1xuICAgICAgY29uc3QgeyBkaXNwbGF5TmFtZSB9ID0gUmVnaXN0cnkucGVyc2lzdGVudC5nZXQoKS4kTWVyY2hhbnQ7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFNUQVRFOiBTVEFURVMuTE9DS1NDUkVFTixcbiAgICAgICAgdGltZTogYCR7aW5pdEhvdXJzfToke2luaXRNaW51dGVzfWAsXG4gICAgICAgIGFwcHM6IHsgLi4uQXBwTWFuYWdlci5nZXRJbnN0YWxsZWRBcHBzKCkgfSxcbiAgICAgICAgZGlzcGxheU5hbWUsXG4gICAgICB9O1xuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIGFwcHNMaXN0OiAoeyBhcHBzIH0pID0+XG4gICAgICAgIE9iamVjdC52YWx1ZXMoYXBwcykucmVkdWNlKChhY2MsIGFwcCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gYXBwLm1hbmlmZXN0O1xuICAgICAgICAgIGlmICh0eXBlb2YgQVBQX0lOREVYRVNbbmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhY2Muc3BsaWNlKEFQUF9JTkRFWEVTW25hbWVdLCAwLCBhcHApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY2MucHVzaChhcHApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSksXG4gICAgfSxcbiAgICBvbmNyZWF0ZSgpIHtcbiAgICAgIC8qKiBVcGRhdGUgdGhlIGNsb2NrIGFmdGVyIGVhY2ggc2Vjb25kICovXG4gICAgICBTeXN0ZW0ub24oJ2Nsb2NrJywgKG5ld0hvdXJzLCBuZXdNaW51dGVzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0KHsgdGltZTogYCR7bmV3SG91cnN9OiR7bmV3TWludXRlc31gIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8qKiBMaXN0ZW4gdG8gYW4gYXBwIGJlaW5nIG9wZW5lZCBhbmQgZ3VhcmFudGVlIHRoZSBMYXVuY2hlciBpcyByZWFkeSB0byBvcGVuIGl0ICovXG4gICAgICBBcHBNYW5hZ2VyLm9uKCdsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnMubG9hZGluZ0RpYWxvZy5vcGVuKCk7XG4gICAgICB9KTtcblxuICAgICAgQXBwTWFuYWdlci5vbignb3BlbmluZycsICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBTVEFURSB9ID0gdGhpcy5nZXQoKTtcbiAgICAgICAgaWYgKFNUQVRFICE9PSBTVEFURVMuQVBQKSB7XG4gICAgICAgICAgdGhpcy5zZXQoeyBTVEFURTogU1RBVEVTLkFQUCB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlZnMubG9hZGluZ0RpYWxvZy5jbG9zZSgxMDApO1xuICAgICAgfSk7XG5cbiAgICAgIEFwcE1hbmFnZXIub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgaWYgKEFwcE1hbmFnZXIuZ2V0T3BlbmVkQXBwcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgnJywgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICAgICAgdGhpcy5nb3RvSG9tZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgQXBwTWFuYWdlci5vbignYXBwSW5zdGFsbGVkJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldCh7XG4gICAgICAgICAgYXBwczogeyAuLi5BcHBNYW5hZ2VyLmdldEluc3RhbGxlZEFwcHMoKSB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBIYXJkd2FyZU1hbmFnZXIub24oJ2NhcmRJbnNlcnRlZCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0KCkuU1RBVEUgIT09IFNUQVRFUy5BUFApIHtcbiAgICAgICAgICB0aGlzLm9wZW5QYXltZW50QXBwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgb3BlblBheW1lbnRBcHAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXBwcyB9ID0gdGhpcy5nZXQoKTtcblxuICAgICAgICBpZiAoYXBwc1snMS1wYXltZW50J10pIHtcbiAgICAgICAgICB0aGlzLm9wZW5BcHAoYXBwc1snMS1wYXltZW50J10sIHsgb3Blbk1vZGU6ICdkZXRlY3Rpb24nIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRPRE86IGZha2UgcGF5bWVudCBhcHBcbiAgICAgICAgICB3YXJuKFxuICAgICAgICAgICAgXCJTaG91bGQgb3BlbiBwYXltZW50IGFwcCBidXQgaXQncyBub3QgaW5zdGFsbGVkXFxuVE9ETzogcGxhY2Vob2xkZXIgcGF5bWVudCBhcHAuXCIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW5BcHAoYXBwTWV0YSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnNldCh7IFNUQVRFOiBTVEFURVMuQVBQIH0pO1xuICAgICAgICBBcHBNYW5hZ2VyLm9wZW4oYXBwTWV0YS5tYW5pZmVzdC5zbHVnLCBvcHRpb25zKTtcbiAgICAgIH0sXG4gICAgICBnb3RvTG9ja3NjcmVlbigpIHtcbiAgICAgICAgdGhpcy5zZXQoeyBTVEFURTogU1RBVEVTLkxPQ0tTQ1JFRU4gfSk7XG4gICAgICAgIGRvY3VtZW50LnRpdGxlID0gJ01hbWJhV2ViIC0gTG9ja3NjcmVlbic7XG4gICAgICB9LFxuICAgICAgZ290b0hvbWUoKSB7XG4gICAgICAgIHRoaXMuc2V0KHsgU1RBVEU6IFNUQVRFUy5IT01FIH0pO1xuICAgICAgICBkb2N1bWVudC50aXRsZSA9ICdNYW1iYVdlYiAtIEhvbWUnO1xuICAgICAgfSxcbiAgICB9LFxuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiAtLS0gKi9cblxuLyoqIFJvdyBjb21wb25lbnQgKi9cblxuLyoqIElucHV0IGNvbXBvbmVudCAqL1xuXG4vKiogRGlhbG9nIGNvbXBvbmVudCAqL1xuXG4vKiogQWRtaW5Mb2NrIGNvbXBvbmVudCAqL1xuXG4vKiBUYWJzIGNvbXBvbmVudCAqL1xuXG46Z2xvYmFsKCNhcHBzLWNvbnRhaW5lcikge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cblxuOmdsb2JhbCgubWFtYmEtYXBwLWNvbnRhaW5lcikge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAwO1xuICAgIHRvcDogMDtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDA7XG4gIH1cblxuOmdsb2JhbCgubWFtYmEtYXBwLWNvbnRhaW5lcikuaXMtc3VzcGVuZGVkIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuXG4ubGF1bmNoZXIge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgfVxuXG4ubG9ja3NjcmVlbixcbiAgLmhvbWUge1xuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgfVxuXG4ubG9ja3NjcmVlbiB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgcGFkZGluZzogMCAxMHB4O1xuICB9XG5cbnRpbWUge1xuICAgIGNvbG9yOiAjN2U3ZTdlO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbi10b3A6IDM1cHg7XG4gICAgZm9udC1zaXplOiA2NHB4O1xuICB9XG5cbi5tZXJjaGFudCB7XG4gICAgY29sb3I6ICMwMDA7XG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgbWFyZ2luOiA4cHggMCAyMHB4O1xuICB9XG5cbi5ob21lIHtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UzZTZlNztcbiAgICBmb250LXNpemU6IDA7XG4gIH1cblxuLmFwcC1pdGVtIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiA1MCU7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHBhZGRpbmc6IDVweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIGJhY2tncm91bmQtY2xpcDogY29udGVudC1ib3g7XG4gIH1cblxuLmFwcC1pdGVtOjpiZWZvcmUge1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgcGFkZGluZy1ib3R0b206IDEwMCU7XG4gICAgfVxuXG4uYXBwLWl0ZW0gLmNvbnRlbnQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBwYWRkaW5nOiAwIDVweDtcbiAgICAgIHRvcDogNTAlO1xuICAgICAgbGVmdDogNTAlO1xuICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICB9XG5cbi5hcHAtaXRlbSAuY29udGVudCAuaWNvbiB7XG4gICAgICAgIHdpZHRoOiA1MHB4O1xuICAgICAgICBoZWlnaHQ6IDUwcHg7XG4gICAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgfVxuXG4uYXBwLWl0ZW0gLmNvbnRlbnQgLmljb24gaW1nIHtcbiAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIH1cblxuLmFwcC1pdGVtIC50aXRsZSB7XG4gICAgICBtYXJnaW4tdG9wOiA1cHg7XG4gICAgfVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNDAxcHgpIHtcblxuOmdsb2JhbCgubWFtYmEtYXBwLWNvbnRhaW5lcikge1xuICAgICAgb3ZlcmZsb3c6IGF1dG9cbiAgfVxuICAgIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwzQnZjeTl6YVcxMWJHRjBiM0l2ZG1sbGR5OXdiM012WVhCd2N5OU1ZWFZ1WTJobGNpNW9kRzFzSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVhWQ1FTeFJRVUZST3p0QlEyaENVaXh0UWtGQmJVSTdPMEZCVTI1Q0xIRkNRVUZ4UWpzN1FVRk5ja0lzYzBKQlFYTkNPenRCUVUxMFFpeDVRa0ZCZVVJN08wRkJaWHBDTEcxQ1FVRnRRanM3UVVONFEycENPMGxCUTBVc1dVRkJXVHRKUVVOYUxHdENRVUZyUWp0RlFVTndRanM3UVVGRlFUdEpRVU5GTEd0Q1FVRnJRanRKUVVOc1FpeFBRVUZQTzBsQlExQXNUVUZCVFR0SlFVTk9MRkZCUVZFN1NVRkRVaXhUUVVGVE8wVkJVMWc3TzBGQlVFVTdUVUZEUlN4aFFVRmhPMGxCUTJZN08wRkJUMFk3U1VGRFJTeFpRVUZaTzBsQlExb3NZMEZCWXp0RlFVTm9RanM3UVVGRlFUczdTVUZGUlN4blFrRkJaMEk3U1VGRGFFSXNjMEpCUVhOQ08wVkJRM2hDT3p0QlFVVkJPMGxCUTBVc2EwSkJRV3RDTzBsQlEyeENMR2RDUVVGblFqdEpRVU5vUWl4bFFVRmxPMFZCUTJwQ096dEJRVVZCTzBsQlEwVXNZMEZCV1R0SlFVTmFMR05CUVdNN1NVRkRaQ3huUWtGQlowSTdTVUZEYUVJc1pVRkJaVHRGUVVOcVFqczdRVUZGUVR0SlFVTkZMRmRCUVdFN1NVRkRZaXhuUWtGQlowSTdTVUZEYUVJc1pVRkJaVHRKUVVObUxHdENRVUZyUWp0RlFVTndRanM3UVVGRlFUdEpRVU5GTEZsQlFWazdTVUZEV2l4NVFrRkJLMEk3U1VGREwwSXNXVUZCV1R0RlFVTmtPenRCUVVWQk8wbEJRMFVzWlVGQlpUdEpRVU5tTEd0Q1FVRnJRanRKUVVOc1FpeFZRVUZWTzBsQlExWXNjVUpCUVhGQ08wbEJRM0pDTEhOQ1FVRnpRanRKUVVOMFFpeHJRa0ZCYTBJN1NVRkRiRUlzV1VGQldUdEpRVU5hTEhOQ1FVRjNRanRKUVVONFFpdzBRa0ZCTkVJN1JVRnJRemxDT3p0QlFXaERSVHROUVVORkxGZEJRVmM3VFVGRFdDeGpRVUZqTzAxQlEyUXNWMEZCVnp0TlFVTllMRzlDUVVGdlFqdEpRVU4wUWpzN1FVRkZRVHROUVVORkxHdENRVUZyUWp0TlFVTnNRaXhYUVVGWE8wMUJRMWdzWTBGQll6dE5RVU5rTEZGQlFWRTdUVUZEVWl4VFFVRlRPMDFCUTFRc2QwTkJRV2RETzJOQlFXaERMR2REUVVGblF6dE5RVU5vUXl4bFFVRmxPMDFCUTJZc2FVSkJRV2xDTzBsQldXNUNPenRCUVZaRk8xRkJRMFVzVjBGQlZ6dFJRVU5ZTEZsQlFWazdVVUZEV2l4alFVRmpPMDFCVFdoQ096dEJRVXBGTzFWQlEwVXNWMEZCVnp0VlFVTllMRmxCUVZrN1VVRkRaRHM3UVVGSlNqdE5RVU5GTEdWQlFXVTdTVUZEYWtJN08wRkJjRVpCT3p0QlFWaEdPMDFCV1VrN1JVRkZTanRKUVVSRklpd2labWxzWlNJNkluQmhZMnRoWjJWekwzQnZjeTl6YVcxMWJHRjBiM0l2ZG1sbGR5OXdiM012WVhCd2N5OU1ZWFZ1WTJobGNpNW9kRzFzSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUpHSnNZV05yT2lBak1EQXdPMXh1WEc0a2QyaHBkR1U2SUNObVptWTdYRzRrYzJWaGMyaGxiR3c2SUNObU1XWXhaakU3WEc1Y2JpUnpkRzl1WlMxbmNtVmxiam9nSXpSbVlqTTBNVHRjYmlSemRHOXVaUzFuY21WbGJpMWtZWEpyT2lBak1UVXpOVEl5TzF4dUpITjBiMjVsTFdkeVpXVnVMV3hwWjJoME9pQWpZVFprWmpoak8xeHVYRzRrWjNKaGVTMWtZWEpyWlhJNklDTXpOVE0xTXpVN1hHNGtaM0poZVMxa1lYSnJPaUFqTkRJMU9UWXpPMXh1SkdkeVlYazZJQ00zWlRkbE4yVTdYRzRrWjNKaGVTMXNhV2RvZERvZ0kySTFZalZpTlR0Y2JpUm5jbUY1TFd4cFoyaDBaWEk2SUNObE0yVTJaVGM3WEc0a1ozSmhlUzFzYVdkb2RHVnpkRG9nSTJZeFpqSm1NenRjYmx4dUpITnBiSFpsY2pvZ0kySmhZamxpT1R0Y2JpUnphV3gyWlhJdGJHbG5hSFE2SUNOa1kyUmpaR003WEc1Y2JpUnlaV1E2SUNObVpqRmhNV0U3WEc0a2NtVmtMV1JoY21zNklDTmtOVEF3TURBN1hHNGtjbVZrTFd4cFoyaDBPaUFqWlRnMVlqVmlPMXh1WEc0dktpQXRMUzBnS2k5Y2JseHVKR0pzZFdVNklDTXlNVGsyWmpNN1hHNGtZbXgxWlMxa1lYSnJPaUFqTVRVMk5XTXdPMXh1WEc0a1lteDFaUzFuY21GNUxXeHBaMmgwT2lBak9UQmhOR0ZsTzF4dUpHSnNkV1V0WjNKaGVUb2dJell3TjJRNFlqdGNiaVJpYkhWbExXZHlZWGt0WkdGeWF6b2dJelExTldFMk5EdGNibHh1SkdkeVpXVnVPaUFqTkdWaVpqRmhPMXh1SkdkeVpXRnVMV3hwWjJoME9pQWpOR05oWmpVd08xeHVKR2R5WldWdUxXUmhjbXM2SUNNelpHRXhNR1k3WEc0a1ozSmxaVzR0Y0dGNWJXVnVkRG9nSXpReU9UZzBNVHRjYmx4dUpIQjFjbkJzWlRvZ0kyRmlORGRpWXp0Y2JpUndkWEp3YkdVdFpHRnlhem9nSXpjNU1HVTRZanRjYmlSd2RYSndiR1V0YkdsbmFIUTZJQ05rWmpjNFpXWTdYRzVjYmlSMFpXRnNPaUFqTVRsbE0ySXhPMXh1SkhSbFlXd3RaR0Z5YXpvZ0l6QXdZV1k1T0R0Y2JseHVKSGxsYkd4dmR6b2dJMlk1WVRneU5UdGNiaVI1Wld4c2IzY3RaR0Z5YXpvZ0kyWTFOMll4Tnp0Y2JpSXNJa0JwYlhCdmNuUWdKMk52Ykc5eWN5NXdZM056Snp0Y2JseHVKR1JsWm1GMWJIUXRkR1Y0ZEMxamIyeHZjam9nSkdkeVlYa3RaR0Z5YTJWeU8xeHVKR1JsWm1GMWJIUXRabTl1ZEMxemFYcGxPaUF4TTNCNE8xeHVYRzRrWVhCd0xXSm5MV052Ykc5eU9pQWtaM0poZVMxc2FXZG9kR1Z5TzF4dVhHNHZLaW9nVW05M0lHTnZiWEJ2Ym1WdWRDQXFMMXh1SkhKdmR5MXdZV1JrYVc1bk9pQXhNbkI0SURFMWNIZzdYRzRrY205M0xYUnZjQzFvWldsbmFIUTZJR0YxZEc4N1hHNGtjbTkzTFdKdmNtUmxjaTFqYjJ4dmNqb2dKR2R5WVhrdGJHbG5hSFJsY2p0Y2JpUnliM2N0WW1jdFkyOXNiM0k2SUNSM2FHbDBaVHRjYmlSeWIzY3RjSEpwYldGeWVTMWpiMnh2Y2pvZ0pHZHlZWGt0WkdGeWEyVnlPMXh1SkhKdmR5MXpaV052Ym1SaGNua3RZMjlzYjNJNklDUm5jbUY1TzF4dUpISnZkeTFtYjI1MExYTnBlbVU2SURFMGNIZzdYRzVjYmk4cUtpQkpibkIxZENCamIyMXdiMjVsYm5RZ0tpOWNiaVJwYm5CMWRDMWliM0prWlhJdFkyOXNiM0k2SUNSbmNtRjVMV3hwWjJoMFpYSTdYRzRrYVc1d2RYUXRabTlqZFhNdFltOXlaR1Z5TFdOdmJHOXlPaUFrYzNSdmJtVXRaM0psWlc0N1hHNGthVzV3ZFhRdGFXNTJZV3hwWkMxaWIzSmtaWEl0WTI5c2IzSTZJQ1J5WldRdGJHbG5hSFE3WEc0a2FXNXdkWFF0WlhKeWIzSXRZMjlzYjNJNklDUnlaV1F0YkdsbmFIUTdYRzVjYmk4cUtpQkVhV0ZzYjJjZ1kyOXRjRzl1Wlc1MElDb3ZYRzRrWkdsaGJHOW5MVzVsWjJGMGFYWmxMV052Ykc5eU9pQWtjbVZrTFd4cFoyaDBPMXh1SkdScFlXeHZaeTF3YjNOcGRHbDJaUzFqYjJ4dmNqb2dKSE4wYjI1bExXZHlaV1Z1TzF4dUpHUnBZV3h2WnkxamIyNW1hWEp0WVhScGIyNHRjSEpwYldGeWVTMWpiMnh2Y2pvZ0pHZHlZWGt0WkdGeWF6dGNiaVJrYVdGc2IyY3RZMjl1Wm1seWJXRjBhVzl1TFhSbGVIUXRZMjlzYjNJNklDUjNhR2wwWlR0Y2JseHVMeW9xSUVGa2JXbHVURzlqYXlCamIyMXdiMjVsYm5RZ0tpOWNiaVJoWkcxcGJteHZZMnN0Ym1WbllYUnBkbVV0WTI5c2IzSTZJQ1J5WldRdGJHbG5hSFE3WEc0a1lXUnRhVzVzYjJOckxYUmxlSFF0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXM3WEc0a1lXUnRhVzVzYjJOckxXSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1NR1l3WmpBN1hHNWNiaVJpZFhSMGIyNHRjSEpwYldGeWVTMWpiMnh2Y2pvZ0pHZHlaV1Z1TzF4dUpHSjFkSFJ2YmkxMFpYaDBMV052Ykc5eU9pQWtkMmhwZEdVN1hHNWNiaVJ6ZDJsMFkyZ3RkVzVqYUdWamEyVmtMV0puT2lBa2MybHNkbVZ5TzF4dUpITjNhWFJqYUMxMWJtTm9aV05yWldRdFkyOXNiM0k2SUNSelpXRnphR1ZzYkR0Y2JpUnpkMmwwWTJndFkyaGxZMnRsWkMxaVp6b2dKSE4wYjI1bExXZHlaV1Z1TFd4cFoyaDBPMXh1SkhOM2FYUmphQzFqYUdWamEyVmtMV052Ykc5eU9pQWtaM0psWlc0N1hHNGtjM2RwZEdOb0xXUnBjMkZpYkdWa0xXSm5PaUFrYzJsc2RtVnlMV3hwWjJoME8xeHVKSE4zYVhSamFDMWthWE5oWW14bFpDMWpiMnh2Y2pvZ0pITnBiSFpsY2p0Y2JseHVMeW9nVkdGaWN5QmpiMjF3YjI1bGJuUWdLaTljYmlSMFlXSXRibUYyYVdkaGRHbHZiaTFpWnpvZ0kyWXlaakptTWp0Y2JpUjBZV0l0YkdGaVpXd3RZMjlzYjNJNklDTTJOVGMzTjJZN1hHNGtkR0ZpTFdsMFpXMHRabTl1ZEMxemFYcGxPaUF4TTNCNE8xeHVKSFJoWWkxc2FXNWxMV052Ykc5eU9pQWtaM0psWlc0N1hHNGtkR0ZpTFdobGFXZG9kRG9nTkRCd2VEdGNiaUlzSWx4dUlDQkFhVzF3YjNKMElDZEFiV0Z0WW1FdmMzUjViR1Z6TDJOdmJHOXljeTV3WTNOekp6dGNibHh1SUNBNloyeHZZbUZzS0NOaGNIQnpMV052Ym5SaGFXNWxjaWtnZTF4dUlDQWdJR2hsYVdkb2REb2dNVEF3SlR0Y2JpQWdJQ0J3YjNOcGRHbHZiam9nY21Wc1lYUnBkbVU3WEc0Z0lIMWNibHh1SUNBNloyeHZZbUZzS0M1dFlXMWlZUzFoY0hBdFkyOXVkR0ZwYm1WeUtTQjdYRzRnSUNBZ2NHOXphWFJwYjI0NklHRmljMjlzZFhSbE8xeHVJQ0FnSUd4bFpuUTZJREE3WEc0Z0lDQWdkRzl3T2lBd08xeHVJQ0FnSUhKcFoyaDBPaUF3TzF4dUlDQWdJR0p2ZEhSdmJUb2dNRHRjYmx4dUlDQWdJQ1l1YVhNdGMzVnpjR1Z1WkdWa0lIdGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklHNXZibVU3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdRRzFsWkdsaElDaHRhVzR0ZDJsa2RHZzZJRFF3TVhCNEtTQjdYRzRnSUNBZ0lDQnZkbVZ5Wm14dmR6b2dZWFYwYnp0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdWJHRjFibU5vWlhJZ2UxeHVJQ0FnSUdobGFXZG9kRG9nTVRBd0pUdGNiaUFnSUNCdmRtVnlabXh2ZHpvZ1lYVjBienRjYmlBZ2ZWeHVYRzRnSUM1c2IyTnJjMk55WldWdUxGeHVJQ0F1YUc5dFpTQjdYRzRnSUNBZ2JXbHVMV2hsYVdkb2REb2dNVEF3SlR0Y2JpQWdJQ0JpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWm1abU8xeHVJQ0I5WEc1Y2JpQWdMbXh2WTJ0elkzSmxaVzRnZTF4dUlDQWdJSFJsZUhRdFlXeHBaMjQ2SUdObGJuUmxjanRjYmlBZ0lDQnZkbVZ5Wm14dmR6b2dhR2xrWkdWdU8xeHVJQ0FnSUhCaFpHUnBibWM2SURBZ01UQndlRHRjYmlBZ2ZWeHVYRzRnSUhScGJXVWdlMXh1SUNBZ0lHTnZiRzl5T2lBa1ozSmhlVHRjYmlBZ0lDQmthWE53YkdGNU9pQmliRzlqYXp0Y2JpQWdJQ0J0WVhKbmFXNHRkRzl3T2lBek5YQjRPMXh1SUNBZ0lHWnZiblF0YzJsNlpUb2dOalJ3ZUR0Y2JpQWdmVnh1WEc0Z0lDNXRaWEpqYUdGdWRDQjdYRzRnSUNBZ1kyOXNiM0k2SUNSaWJHRmphenRjYmlBZ0lDQnNhVzVsTFdobGFXZG9kRG9nTVM0eU8xeHVJQ0FnSUdadmJuUXRjMmw2WlRvZ01qSndlRHRjYmlBZ0lDQnRZWEpuYVc0NklEaHdlQ0F3SURJd2NIZzdYRzRnSUgxY2JseHVJQ0F1YUc5dFpTQjdYRzRnSUNBZ2NHRmtaR2x1WnpvZ05YQjRPMXh1SUNBZ0lHSmhZMnRuY205MWJtUXRZMjlzYjNJNklDUm5jbUY1TFd4cFoyaDBaWEk3WEc0Z0lDQWdabTl1ZEMxemFYcGxPaUF3TzF4dUlDQjlYRzVjYmlBZ0xtRndjQzFwZEdWdElIdGNiaUFnSUNCamRYSnpiM0k2SUhCdmFXNTBaWEk3WEc0Z0lDQWdjRzl6YVhScGIyNDZJSEpsYkdGMGFYWmxPMXh1SUNBZ0lIZHBaSFJvT2lBMU1DVTdYRzRnSUNBZ1pHbHpjR3hoZVRvZ2FXNXNhVzVsTFdKc2IyTnJPMXh1SUNBZ0lIWmxjblJwWTJGc0xXRnNhV2R1T2lCdGFXUmtiR1U3WEc0Z0lDQWdkR1Y0ZEMxaGJHbG5iam9nWTJWdWRHVnlPMXh1SUNBZ0lIQmhaR1JwYm1jNklEVndlRHRjYmlBZ0lDQmlZV05yWjNKdmRXNWtMV052Ykc5eU9pQWtkMmhwZEdVN1hHNGdJQ0FnWW1GamEyZHliM1Z1WkMxamJHbHdPaUJqYjI1MFpXNTBMV0p2ZUR0Y2JseHVJQ0FnSUNZNk9tSmxabTl5WlNCN1hHNGdJQ0FnSUNCamIyNTBaVzUwT2lBbkp6dGNiaUFnSUNBZ0lHUnBjM0JzWVhrNklHSnNiMk5yTzF4dUlDQWdJQ0FnZDJsa2RHZzZJREV3TUNVN1hHNGdJQ0FnSUNCd1lXUmthVzVuTFdKdmRIUnZiVG9nTVRBd0pUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdVkyOXVkR1Z1ZENCN1hHNGdJQ0FnSUNCd2IzTnBkR2x2YmpvZ1lXSnpiMngxZEdVN1hHNGdJQ0FnSUNCM2FXUjBhRG9nTVRBd0pUdGNiaUFnSUNBZ0lIQmhaR1JwYm1jNklEQWdOWEI0TzF4dUlDQWdJQ0FnZEc5d09pQTFNQ1U3WEc0Z0lDQWdJQ0JzWldaME9pQTFNQ1U3WEc0Z0lDQWdJQ0IwY21GdWMyWnZjbTA2SUhSeVlXNXpiR0YwWlNndE5UQWxMQ0F0TlRBbEtUdGNiaUFnSUNBZ0lHWnZiblF0YzJsNlpUb2dNVEp3ZUR0Y2JpQWdJQ0FnSUdadmJuUXRkMlZwWjJoME9pQmliMnhrTzF4dVhHNGdJQ0FnSUNBdWFXTnZiaUI3WEc0Z0lDQWdJQ0FnSUhkcFpIUm9PaUExTUhCNE8xeHVJQ0FnSUNBZ0lDQm9aV2xuYUhRNklEVXdjSGc3WEc0Z0lDQWdJQ0FnSUcxaGNtZHBiam9nTUNCaGRYUnZPMXh1WEc0Z0lDQWdJQ0FnSUdsdFp5QjdYRzRnSUNBZ0lDQWdJQ0FnZDJsa2RHZzZJREV3TUNVN1hHNGdJQ0FnSUNBZ0lDQWdhR1ZwWjJoME9pQmhkWFJ2TzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnTG5ScGRHeGxJSHRjYmlBZ0lDQWdJRzFoY21kcGJpMTBiM0E2SURWd2VEdGNiaUFnSUNCOVhHNGdJSDFjYmlKZGZRPT0gKi88L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQTJMUSxlQUFlLEFBQUUsQ0FBQyxBQUN0QixNQUFNLENBQUUsSUFBSSxDQUNaLFFBQVEsQ0FBRSxRQUFRLEFBQ3BCLENBQUMsQUFFSyxvQkFBb0IsQUFBRSxDQUFDLEFBQzNCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLElBQUksQ0FBRSxDQUFDLENBQ1AsR0FBRyxDQUFFLENBQUMsQ0FDTixLQUFLLENBQUUsQ0FBQyxDQUNSLE1BQU0sQ0FBRSxDQUFDLEFBQ1gsQ0FBQyxBQUVLLG9CQUFvQixBQUFDLGFBQWEsQUFBQyxDQUFDLEFBQ3RDLE9BQU8sQ0FBRSxJQUFJLEFBQ2YsQ0FBQyxBQUVMLFNBQVMsY0FBQyxDQUFDLEFBQ1AsTUFBTSxDQUFFLElBQUksQ0FDWixRQUFRLENBQUUsSUFBSSxBQUNoQixDQUFDLEFBRUgseUJBQVcsQ0FDVCxLQUFLLGNBQUMsQ0FBQyxBQUNMLFVBQVUsQ0FBRSxJQUFJLENBQ2hCLGdCQUFnQixDQUFFLElBQUksQUFDeEIsQ0FBQyxBQUVILFdBQVcsY0FBQyxDQUFDLEFBQ1QsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsUUFBUSxDQUFFLE1BQU0sQ0FDaEIsT0FBTyxDQUFFLENBQUMsQ0FBQyxJQUFJLEFBQ2pCLENBQUMsQUFFSCxJQUFJLGNBQUMsQ0FBQyxBQUNGLEtBQUssQ0FBRSxPQUFPLENBQ2QsT0FBTyxDQUFFLEtBQUssQ0FDZCxVQUFVLENBQUUsSUFBSSxDQUNoQixTQUFTLENBQUUsSUFBSSxBQUNqQixDQUFDLEFBRUgsU0FBUyxjQUFDLENBQUMsQUFDUCxLQUFLLENBQUUsSUFBSSxDQUNYLFdBQVcsQ0FBRSxHQUFHLENBQ2hCLFNBQVMsQ0FBRSxJQUFJLENBQ2YsTUFBTSxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxBQUNwQixDQUFDLEFBRUgsS0FBSyxjQUFDLENBQUMsQUFDSCxPQUFPLENBQUUsR0FBRyxDQUNaLGdCQUFnQixDQUFFLE9BQU8sQ0FDekIsU0FBUyxDQUFFLENBQUMsQUFDZCxDQUFDLEFBRUgsU0FBUyxjQUFDLENBQUMsQUFDUCxNQUFNLENBQUUsT0FBTyxDQUNmLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEtBQUssQ0FBRSxHQUFHLENBQ1YsT0FBTyxDQUFFLFlBQVksQ0FDckIsY0FBYyxDQUFFLE1BQU0sQ0FDdEIsVUFBVSxDQUFFLE1BQU0sQ0FDbEIsT0FBTyxDQUFFLEdBQUcsQ0FDWixnQkFBZ0IsQ0FBRSxJQUFJLENBQ3RCLGVBQWUsQ0FBRSxXQUFXLEFBQzlCLENBQUMsQUFFSCx1QkFBUyxRQUFRLEFBQUMsQ0FBQyxBQUNiLE9BQU8sQ0FBRSxFQUFFLENBQ1gsT0FBTyxDQUFFLEtBQUssQ0FDZCxLQUFLLENBQUUsSUFBSSxDQUNYLGNBQWMsQ0FBRSxJQUFJLEFBQ3RCLENBQUMsQUFFTCx1QkFBUyxDQUFDLFFBQVEsY0FBQyxDQUFDLEFBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxPQUFPLENBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDZCxHQUFHLENBQUUsR0FBRyxDQUNSLElBQUksQ0FBRSxHQUFHLENBQ1QsaUJBQWlCLENBQUUsVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDaEMsU0FBUyxDQUFFLFVBQVUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ3hDLFNBQVMsQ0FBRSxJQUFJLENBQ2YsV0FBVyxDQUFFLElBQUksQUFDbkIsQ0FBQyxBQUVMLHVCQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssY0FBQyxDQUFDLEFBQ2xCLEtBQUssQ0FBRSxJQUFJLENBQ1gsTUFBTSxDQUFFLElBQUksQ0FDWixNQUFNLENBQUUsQ0FBQyxDQUFDLElBQUksQUFDaEIsQ0FBQyxBQUVQLHVCQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLGNBQUMsQ0FBQyxBQUNwQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLEFBQ2QsQ0FBQyxBQUVULHVCQUFTLENBQUMsTUFBTSxjQUFDLENBQUMsQUFDWixVQUFVLENBQUUsR0FBRyxBQUNqQixDQUFDLEFBRUwsTUFBTSxBQUFDLFlBQVksS0FBSyxDQUFDLEFBQUMsQ0FBQyxBQUVuQixvQkFBb0IsQUFBRSxDQUFDLEFBQ3pCLFFBQVEsQ0FBRSxJQUFJO0VBQ2xCLENBQUMsQUFDQyxDQUFDIn0= */";
    append(document.head, style);
  }

  function click_handler(event) {
    const { component, ctx } = this._svelte;

    component.openApp(ctx.app);
  }

  function get_each_context(ctx, list, i) {
    const child_ctx = Object.create(ctx);
    child_ctx.app = list[i];
    return child_ctx;
  }

  function create_main_fragment$b(component, ctx) {
    var text, if_block_anchor;

    var loadingsprite = new Loading({
      root: component.root,
      store: component.store,
    });

    var dialog_initial_data = { fullscreen: true };
    var dialog = new Dialog({
      root: component.root,
      store: component.store,
      slots: { default: createFragment() },
      data: dialog_initial_data,
    });

    component.refs.loadingDialog = dialog;

    function select_block_type(ctx) {
      if (ctx.STATE === STATES$1.APP) return create_if_block$2;
      return create_else_block;
    }

    var current_block_type = select_block_type(ctx);
    var if_block = current_block_type(component, ctx);

    return {
      c: function create() {
        loadingsprite._fragment.c();
        dialog._fragment.c();
        text = createText('\n\n');
        if_block.c();
        if_block_anchor = createComment();
      },

      m: function mount(target, anchor) {
        loadingsprite._mount(dialog._slotted.default, null);
        dialog._mount(target, anchor);
        insert(target, text, anchor);
        if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },

      p: function update(changed, ctx) {
        if (
          current_block_type ===
            (current_block_type = select_block_type(ctx)) &&
          if_block
        ) {
          if_block.p(changed, ctx);
        } else {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      },

      d: function destroy(detach) {
        loadingsprite.destroy();
        dialog.destroy(detach);
        if (component.refs.loadingDialog === dialog)
          component.refs.loadingDialog = null;
        if (detach) {
          detachNode(text);
        }

        if_block.d(detach);
        if (detach) {
          detachNode(if_block_anchor);
        }
      },
    };
  }

  // (7:0) {:else}
  function create_else_block(component, ctx) {
    var div, text;

    var if_block0 =
      ctx.STATE === STATES$1.LOCKSCREEN && create_if_block_2(component, ctx);

    var if_block1 =
      ctx.STATE === STATES$1.HOME && create_if_block_1$1(component, ctx);

    return {
      c: function create() {
        div = createElement('div');
        if (if_block0) if_block0.c();
        text = createText('\n\n    ');
        if (if_block1) if_block1.c();
        div.className = 'launcher hide-scrollbars svelte-g985rf';
        addLoc(div, file$9, 7, 2, 164);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        if (if_block0) if_block0.m(div, null);
        append(div, text);
        if (if_block1) if_block1.m(div, null);
      },

      p: function update(changed, ctx) {
        if (ctx.STATE === STATES$1.LOCKSCREEN) {
          if (if_block0) {
            if_block0.p(changed, ctx);
          } else {
            if_block0 = create_if_block_2(component, ctx);
            if_block0.c();
            if_block0.m(div, text);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        if (ctx.STATE === STATES$1.HOME) {
          if (if_block1) {
            if_block1.p(changed, ctx);
          } else {
            if_block1 = create_if_block_1$1(component, ctx);
            if_block1.c();
            if_block1.m(div, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      },
    };
  }

  // (5:0) {#if STATE === STATES.APP}
  function create_if_block$2(component, ctx) {
    var div;

    return {
      c: function create() {
        div = createElement('div');
        div.id = 'apps-container';
        div.className = 'hide-scrollbars';
        addLoc(div, file$9, 5, 2, 98);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
      },

      p: noop,

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }
      },
    };
  }

  // (9:4) {#if STATE === STATES.LOCKSCREEN}
  function create_if_block_2(component, ctx) {
    var div2, time, text0, text1, div0, text2, text3, div1, text4, text5;

    var icon_initial_data = { symbol: 'home', color: '#fff' };
    var icon = new Icon({
      root: component.root,
      store: component.store,
      data: icon_initial_data,
    });

    var button_initial_data = {
      size: 'full',
      bottom: true,
      shortcut: 'enter',
    };
    var button = new Button({
      root: component.root,
      store: component.store,
      slots: { default: createFragment() },
      data: button_initial_data,
    });

    button.on('click', function(event) {
      component.gotoHome();
    });

    var keystroke_initial_data = { key: 'enter' };
    var keystroke = new Keystroke({
      root: component.root,
      store: component.store,
      data: keystroke_initial_data,
    });

    keystroke.on('keystroke', function(event) {
      component.gotoHome();
    });

    return {
      c: function create() {
        div2 = createElement('div');
        time = createElement('time');
        text0 = createText(ctx.time);
        text1 = createText('\n        ');
        div0 = createElement('div');
        text2 = createText(ctx.displayName);
        text3 = createText('\n        ');
        div1 = createElement('div');
        text4 = createText('\n\n        ');
        icon._fragment.c();
        button._fragment.c();
        text5 = createText('\n\n      ');
        keystroke._fragment.c();
        time.className = 'svelte-g985rf';
        addLoc(time, file$9, 10, 8, 280);
        div0.className = 'merchant svelte-g985rf';
        addLoc(div0, file$9, 11, 8, 308);
        div1.className = 'actions';
        addLoc(div1, file$9, 12, 8, 360);
        div2.className = 'lockscreen svelte-g985rf';
        addLoc(div2, file$9, 9, 6, 247);
      },

      m: function mount(target, anchor) {
        insert(target, div2, anchor);
        append(div2, time);
        append(time, text0);
        append(div2, text1);
        append(div2, div0);
        append(div0, text2);
        append(div2, text3);
        append(div2, div1);
        append(div2, text4);
        icon._mount(button._slotted.default, null);
        button._mount(div2, null);
        insert(target, text5, anchor);
        keystroke._mount(target, anchor);
      },

      p: function update(changed, ctx) {
        if (changed.time) {
          setData(text0, ctx.time);
        }

        if (changed.displayName) {
          setData(text2, ctx.displayName);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div2);
        }

        icon.destroy();
        button.destroy();
        if (detach) {
          detachNode(text5);
        }

        keystroke.destroy(detach);
      },
    };
  }

  // (23:4) {#if STATE === STATES.HOME}
  function create_if_block_1$1(component, ctx) {
    var div, text0, text1, text2;

    var each_value = ctx.appsList;

    var each_blocks = [];

    for (var i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(
        component,
        get_each_context(ctx, each_value, i),
      );
    }

    var keystroke0_initial_data = { key: 'back' };
    var keystroke0 = new Keystroke({
      root: component.root,
      store: component.store,
      data: keystroke0_initial_data,
    });

    keystroke0.on('keystroke', function(event) {
      component.gotoLockscreen();
    });

    var keystroke1_initial_data = { key: 'close' };
    var keystroke1 = new Keystroke({
      root: component.root,
      store: component.store,
      data: keystroke1_initial_data,
    });

    keystroke1.on('keystroke', function(event) {
      component.gotoLockscreen();
    });

    var keystroke2_initial_data = { key: 'enter' };
    var keystroke2 = new Keystroke({
      root: component.root,
      store: component.store,
      data: keystroke2_initial_data,
    });

    keystroke2.on('keystroke', function(event) {
      component.gotoLockscreen();
    });

    return {
      c: function create() {
        div = createElement('div');

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        text0 = createText('\n      ');
        keystroke0._fragment.c();
        text1 = createText('\n      ');
        keystroke1._fragment.c();
        text2 = createText('\n      ');
        keystroke2._fragment.c();
        div.className = 'home svelte-g985rf';
        addLoc(div, file$9, 23, 6, 648);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }

        insert(target, text0, anchor);
        keystroke0._mount(target, anchor);
        insert(target, text1, anchor);
        keystroke1._mount(target, anchor);
        insert(target, text2, anchor);
        keystroke2._mount(target, anchor);
      },

      p: function update(changed, ctx) {
        if (changed.appsList) {
          each_value = ctx.appsList;

          for (var i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        destroyEach(each_blocks, detach);

        if (detach) {
          detachNode(text0);
        }

        keystroke0.destroy(detach);
        if (detach) {
          detachNode(text1);
        }

        keystroke1.destroy(detach);
        if (detach) {
          detachNode(text2);
        }

        keystroke2.destroy(detach);
      },
    };
  }

  // (25:8) {#each appsList as app}
  function create_each_block(component, ctx) {
    var div3,
      div2,
      div0,
      img,
      img_src_value,
      img_alt_value,
      text0,
      div1,
      text1_value = ctx.app.manifest.appName,
      text1;

    return {
      c: function create() {
        div3 = createElement('div');
        div2 = createElement('div');
        div0 = createElement('div');
        img = createElement('img');
        text0 = createText('\n              ');
        div1 = createElement('div');
        text1 = createText(text1_value);
        img.src = img_src_value = ctx.app.manifest.icon;
        img.alt = img_alt_value = ctx.app.manifest.name;
        img.className = 'svelte-g985rf';
        addLoc(img, file$9, 28, 16, 839);
        div0.className = 'icon svelte-g985rf';
        addLoc(div0, file$9, 27, 14, 804);
        div1.className = 'title svelte-g985rf';
        addLoc(div1, file$9, 30, 14, 930);
        div2.className = 'content svelte-g985rf';
        addLoc(div2, file$9, 26, 12, 768);

        div3._svelte = { component, ctx };

        addListener(div3, 'click', click_handler);
        div3.className = 'app-item svelte-g985rf';
        addLoc(div3, file$9, 25, 10, 709);
      },

      m: function mount(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div2);
        append(div2, div0);
        append(div0, img);
        append(div2, text0);
        append(div2, div1);
        append(div1, text1);
      },

      p: function update(changed, _ctx) {
        ctx = _ctx;
        if (
          changed.appsList &&
          img_src_value !== (img_src_value = ctx.app.manifest.icon)
        ) {
          img.src = img_src_value;
        }

        if (
          changed.appsList &&
          img_alt_value !== (img_alt_value = ctx.app.manifest.name)
        ) {
          img.alt = img_alt_value;
        }

        if (
          changed.appsList &&
          text1_value !== (text1_value = ctx.app.manifest.appName)
        ) {
          setData(text1, text1_value);
        }

        div3._svelte.ctx = ctx;
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div3);
        }

        removeListener(div3, 'click', click_handler);
      },
    };
  }

  function Launcher(options) {
    this._debugName = '<Launcher>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$8(), options.data);

    this._recompute({ apps: 1 }, this._state);
    if (!('apps' in this._state))
      console.warn(
        "<Launcher> was created without expected data property 'apps'",
      );
    if (!('STATE' in this._state))
      console.warn(
        "<Launcher> was created without expected data property 'STATE'",
      );
    if (!('time' in this._state))
      console.warn(
        "<Launcher> was created without expected data property 'time'",
      );
    if (!('displayName' in this._state))
      console.warn(
        "<Launcher> was created without expected data property 'displayName'",
      );
    this._intro = true;

    if (!document.getElementById('svelte-g985rf-style')) add_css$9();

    this._fragment = create_main_fragment$b(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$6.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Launcher.prototype, protoDev);
  assign$1(Launcher.prototype, methods$7);

  Launcher.prototype._checkReadOnly = function _checkReadOnly(newState) {
    if ('appsList' in newState && !this._updatingReadonlyProperty)
      throw new Error("<Launcher>: Cannot set read-only property 'appsList'");
  };

  Launcher.prototype._recompute = function _recompute(changed, state) {
    if (changed.apps) {
      if (this._differs(state.appsList, (state.appsList = appsList(state))))
        changed.appsList = true;
    }
  };

  /* packages/pos/simulator/view/pos/panels/General.html generated by Svelte v2.16.1 */

  function data$9() {
    const {
      $System: { serialNumber },
      $Merchant: { stoneCode, adminPassword },
    } = Registry.persistent.get();

    return {
      stoneCode,
      serialNumber,
      adminPassword,
      printerHasPaper: Registry.get().$Printer.panel.shouldFail,
    };
  }
  function oncreate$7() {
    Registry.on('persistentDataChanged', changes => {
      changes.forEach(({ path: [, prop], value }) => {
        if (prop === 'adminPassword') {
          this.set({ adminPassword: value });
        }
      });
    });
  }
  function onupdate$2({ previous, changed, current }) {
    if (!previous) {
      return;
    }

    Registry.set(draft => {
      if (changed.printerHasPaper) {
        console.log(current.printerHasPaper);
        draft.$Printer.panel.shouldFail = !current.printerHasPaper;
      }
    });

    Registry.persistent.set(draft => {
      if (changed.serialNumber) {
        draft.$System.serialNumber = current.serialNumber;
      }

      if (changed.stoneCode) {
        draft.$Merchant.stoneCode = current.stoneCode;
      }

      if (changed.adminPassword) {
        draft.$Merchant.adminPassword = current.adminPassword;
      }
    });
  }
  const file$a = 'packages/pos/simulator/view/pos/panels/General.html';

  function create_main_fragment$c(component, ctx) {
    var div,
      text1,
      ul,
      li0,
      span0,
      text3,
      input0,
      input0_updating = false,
      text4,
      li1,
      span1,
      text6,
      input1,
      input1_updating = false,
      text7,
      li2,
      span2,
      text9,
      input2,
      input2_updating = false;

    function input0_input_handler() {
      input0_updating = true;
      component.set({ serialNumber: input0.value });
      input0_updating = false;
    }

    function input1_input_handler() {
      input1_updating = true;
      component.set({ stoneCode: input1.value });
      input1_updating = false;
    }

    function input2_input_handler() {
      input2_updating = true;
      component.set({ adminPassword: input2.value });
      input2_updating = false;
    }

    return {
      c: function create() {
        div = createElement('div');
        div.textContent = 'Geral';
        text1 = createText('\n\n');
        ul = createElement('ul');
        li0 = createElement('li');
        span0 = createElement('span');
        span0.textContent = 'Nº de série';
        text3 = createText('\n    ');
        input0 = createElement('input');
        text4 = createText('\n  ');
        li1 = createElement('li');
        span1 = createElement('span');
        span1.textContent = 'Stonecode';
        text6 = createText('\n    ');
        input1 = createElement('input');
        text7 = createText('\n  ');
        li2 = createElement('li');
        span2 = createElement('span');
        span2.textContent = 'Senha Admin';
        text9 = createText('\n    ');
        input2 = createElement('input');
        div.className = 'title';
        addLoc(div, file$a, 0, 0, 0);
        addLoc(span0, file$a, 4, 4, 95);
        addListener(input0, 'input', input0_input_handler);
        setInputType(input0, 'text');
        input0.maxLength = '8';
        addLoc(input0, file$a, 5, 4, 124);
        li0.className = 'controller is-full';
        addLoc(li0, file$a, 3, 2, 59);
        addLoc(span1, file$a, 8, 4, 232);
        addListener(input1, 'input', input1_input_handler);
        setInputType(input1, 'text');
        input1.maxLength = '9';
        addLoc(input1, file$a, 9, 4, 259);
        li1.className = 'controller is-full';
        addLoc(li1, file$a, 7, 2, 196);
        addLoc(span2, file$a, 12, 4, 364);
        addListener(input2, 'input', input2_input_handler);
        setInputType(input2, 'text');
        input2.maxLength = '4';
        addLoc(input2, file$a, 13, 4, 393);
        li2.className = 'controller is-full';
        addLoc(li2, file$a, 11, 2, 328);
        ul.className = 'controllers';
        addLoc(ul, file$a, 2, 0, 32);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        insert(target, text1, anchor);
        insert(target, ul, anchor);
        append(ul, li0);
        append(li0, span0);
        append(li0, text3);
        append(li0, input0);

        input0.value = ctx.serialNumber;

        append(ul, text4);
        append(ul, li1);
        append(li1, span1);
        append(li1, text6);
        append(li1, input1);

        input1.value = ctx.stoneCode;

        append(ul, text7);
        append(ul, li2);
        append(li2, span2);
        append(li2, text9);
        append(li2, input2);

        input2.value = ctx.adminPassword;
      },

      p: function update(changed, ctx) {
        if (!input0_updating && changed.serialNumber)
          input0.value = ctx.serialNumber;
        if (!input1_updating && changed.stoneCode) input1.value = ctx.stoneCode;
        if (!input2_updating && changed.adminPassword)
          input2.value = ctx.adminPassword;
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
          detachNode(text1);
          detachNode(ul);
        }

        removeListener(input0, 'input', input0_input_handler);
        removeListener(input1, 'input', input1_input_handler);
        removeListener(input2, 'input', input2_input_handler);
      },
    };
  }

  function General(options) {
    this._debugName = '<General>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$9(), options.data);
    if (!('serialNumber' in this._state))
      console.warn(
        "<General> was created without expected data property 'serialNumber'",
      );
    if (!('stoneCode' in this._state))
      console.warn(
        "<General> was created without expected data property 'stoneCode'",
      );
    if (!('adminPassword' in this._state))
      console.warn(
        "<General> was created without expected data property 'adminPassword'",
      );
    this._intro = true;
    this._handlers.update = [onupdate$2];

    this._fragment = create_main_fragment$c(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$7.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(General.prototype, protoDev);

  General.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/components/Switch/Switch.html generated by Svelte v2.16.1 */

  function data$a() {
    return {
      disabled: false,
      checked: false,
    };
  }
  var methods$8 = {
    toggle(value) {
      if (typeof value === 'undefined') {
        this.set({ checked: !this.get().checked });
      } else if (value === true) {
        this.set({ checked: true });
      } else if (value === false) {
        this.set({ checked: false });
      }
    },
  };

  const file$b = 'packages/components/Switch/Switch.html';

  function add_css$a() {
    var style = createElement('style');
    style.id = 'svelte-43xk7i-style';
    style.textContent =
      "input.svelte-43xk7i{display:none}.switch.svelte-43xk7i{position:relative;display:inline-block;width:27px;height:12px;vertical-align:middle;border-radius:8px;background-color:#bab9b9}.switch.svelte-43xk7i::after{content:'';display:inline-block;position:absolute;top:-2px;left:-3px;width:16px;height:16px;border-radius:50%;border:none;background-color:#f1f1f1;box-shadow:0 0 1px 0 #e0e0e0, 0 1px 1px 0 #c1c1c1}.switch[checked='true'].svelte-43xk7i{background-color:#a6df8c}.switch[checked='true'].svelte-43xk7i::after{left:auto;right:-3px;background-color:#4ebf1a}.switch[disabled='true'].svelte-43xk7i{background-color:#dcdcdc}.switch[disabled='true'].svelte-43xk7i::after{background-color:#bab9b9}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dpdGNoLmh0bWwiLCJzb3VyY2VzIjpbIlN3aXRjaC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxsYWJlbCBjbGFzcz1cInN3aXRjaFwiIHtjaGVja2VkfSB7ZGlzYWJsZWR9PlxuXHQ8aW5wdXRcbiAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgIHtkaXNhYmxlZH1cbiAgICBiaW5kOmNoZWNrZWRcbiAgICBvbjpjaGFuZ2U9XCJmaXJlKCdjaGFuZ2UnLCB7IHZhbHVlOiBjaGVja2VkIH0pXCJcbiAgICBkYXRhLXRyaWdnZXI9XCJjbGlja1wiXG5cdC8+XG48L2xhYmVsPlxuXG48c2NyaXB0PlxuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgZGF0YSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgY2hlY2tlZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgdG9nZ2xlKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGhpcy5zZXQoeyBjaGVja2VkOiAhdGhpcy5nZXQoKS5jaGVja2VkIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5zZXQoeyBjaGVja2VkOiB0cnVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuc2V0KHsgY2hlY2tlZDogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbjwvc2NyaXB0PlxuXG48c3R5bGU+LyogLS0tICovXG5cbi8qKiBSb3cgY29tcG9uZW50ICovXG5cbi8qKiBJbnB1dCBjb21wb25lbnQgKi9cblxuLyoqIERpYWxvZyBjb21wb25lbnQgKi9cblxuLyoqIEFkbWluTG9jayBjb21wb25lbnQgKi9cblxuLyogVGFicyBjb21wb25lbnQgKi9cblxuaW5wdXQge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cblxuLnN3aXRjaCB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICB3aWR0aDogMjdweDtcbiAgICBoZWlnaHQ6IDEycHg7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2JhYjliOTtcbiAgfVxuXG4uc3dpdGNoOjphZnRlciB7XG4gICAgICBjb250ZW50OiAnJztcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogLTJweDtcbiAgICAgIGxlZnQ6IC0zcHg7XG4gICAgICB3aWR0aDogMTZweDtcbiAgICAgIGhlaWdodDogMTZweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmMWYxZjE7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMXB4IDAgI2UwZTBlMCwgMCAxcHggMXB4IDAgI2MxYzFjMTtcbiAgICB9XG5cbi8qKiBDaGVja2VkIHN3aXRjaCBzdHlsZSAqL1xuXG4uc3dpdGNoW2NoZWNrZWQ9J3RydWUnXSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTZkZjhjO1xuICAgIH1cblxuLnN3aXRjaFtjaGVja2VkPSd0cnVlJ106OmFmdGVyIHtcbiAgICAgICAgbGVmdDogYXV0bztcbiAgICAgICAgcmlnaHQ6IC0zcHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0ZWJmMWE7XG4gICAgICB9XG5cbi8qKiBEaXNhYmxlZCBzd2l0Y2ggc3R5bGUgKi9cblxuLnN3aXRjaFtkaXNhYmxlZD0ndHJ1ZSddIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNkY2RjZGM7XG4gICAgfVxuXG4uc3dpdGNoW2Rpc2FibGVkPSd0cnVlJ106OmFmdGVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2JhYjliOTtcbiAgICAgIH1cblxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltNXZaR1ZmYlc5a2RXeGxjeTlBYldGdFltRXZjM1I1YkdWekwyTnZiRzl5Y3k1d1kzTnpJaXdpYm05a1pWOXRiMlIxYkdWekwwQnRZVzFpWVM5emRIbHNaWE12ZEdobGJXVXVjR056Y3lJc0luQmhZMnRoWjJWekwyTnZiWEJ2Ym1WdWRITXZVM2RwZEdOb0wxTjNhWFJqYUM1b2RHMXNJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRWFZDUVN4UlFVRlJPenRCUTJoQ1VpeHRRa0ZCYlVJN08wRkJVMjVDTEhGQ1FVRnhRanM3UVVGTmNrSXNjMEpCUVhOQ096dEJRVTEwUWl4NVFrRkJlVUk3TzBGQlpYcENMRzFDUVVGdFFqczdRVU14UTJwQ08wbEJRMFVzWVVGQllUdEZRVU5tT3p0QlFVVkJPMGxCUTBVc2EwSkJRV3RDTzBsQlEyeENMSEZDUVVGeFFqdEpRVU55UWl4WFFVRlhPMGxCUTFnc1dVRkJXVHRKUVVOYUxITkNRVUZ6UWp0SlFVTjBRaXhyUWtGQmEwSTdTVUZEYkVJc2VVSkJRWE5ETzBWQmJVTjRRenM3UVVGcVEwVTdUVUZEUlN4WFFVRlhPMDFCUTFnc2NVSkJRWEZDTzAxQlEzSkNMR3RDUVVGclFqdE5RVU5zUWl4VFFVRlRPMDFCUTFRc1ZVRkJWVHROUVVOV0xGZEJRVmM3VFVGRFdDeFpRVUZaTzAxQlExb3NhMEpCUVd0Q08wMUJRMnhDTEZsQlFWazdUVUZEV2l4NVFrRkJlVU03VFVGRGVrTXNhMFJCUVd0RU8wbEJRM0JFT3p0QlFVVkJMREJDUVVFd1FqczdRVUZETVVJN1RVRkRSU3g1UWtGQmIwTTdTVUZQZEVNN08wRkJURVU3VVVGRFJTeFZRVUZWTzFGQlExWXNWMEZCVnp0UlFVTllMSGxDUVVGMVF6dE5RVU42UXpzN1FVRkhSaXd5UWtGQk1rSTdPMEZCUXpOQ08wMUJRMFVzZVVKQlFYRkRPMGxCUzNaRE96dEJRVWhGTzFGQlEwVXNlVUpCUVhkRE8wMUJRekZESWl3aVptbHNaU0k2SW5CaFkydGhaMlZ6TDJOdmJYQnZibVZ1ZEhNdlUzZHBkR05vTDFOM2FYUmphQzVvZEcxc0lpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lKR0pzWVdOck9pQWpNREF3TzF4dVhHNGtkMmhwZEdVNklDTm1abVk3WEc0a2MyVmhjMmhsYkd3NklDTm1NV1l4WmpFN1hHNWNiaVJ6ZEc5dVpTMW5jbVZsYmpvZ0l6Um1Zak0wTVR0Y2JpUnpkRzl1WlMxbmNtVmxiaTFrWVhKck9pQWpNVFV6TlRJeU8xeHVKSE4wYjI1bExXZHlaV1Z1TFd4cFoyaDBPaUFqWVRaa1pqaGpPMXh1WEc0a1ozSmhlUzFrWVhKclpYSTZJQ016TlRNMU16VTdYRzRrWjNKaGVTMWtZWEpyT2lBak5ESTFPVFl6TzF4dUpHZHlZWGs2SUNNM1pUZGxOMlU3WEc0a1ozSmhlUzFzYVdkb2REb2dJMkkxWWpWaU5UdGNiaVJuY21GNUxXeHBaMmgwWlhJNklDTmxNMlUyWlRjN1hHNGtaM0poZVMxc2FXZG9kR1Z6ZERvZ0kyWXhaakptTXp0Y2JseHVKSE5wYkhabGNqb2dJMkpoWWpsaU9UdGNiaVJ6YVd4MlpYSXRiR2xuYUhRNklDTmtZMlJqWkdNN1hHNWNiaVJ5WldRNklDTm1aakZoTVdFN1hHNGtjbVZrTFdSaGNtczZJQ05rTlRBd01EQTdYRzRrY21Wa0xXeHBaMmgwT2lBalpUZzFZalZpTzF4dVhHNHZLaUF0TFMwZ0tpOWNibHh1SkdKc2RXVTZJQ015TVRrMlpqTTdYRzRrWW14MVpTMWtZWEpyT2lBak1UVTJOV013TzF4dVhHNGtZbXgxWlMxbmNtRjVMV3hwWjJoME9pQWpPVEJoTkdGbE8xeHVKR0pzZFdVdFozSmhlVG9nSXpZd04yUTRZanRjYmlSaWJIVmxMV2R5WVhrdFpHRnlhem9nSXpRMU5XRTJORHRjYmx4dUpHZHlaV1Z1T2lBak5HVmlaakZoTzF4dUpHZHlaV0Z1TFd4cFoyaDBPaUFqTkdOaFpqVXdPMXh1SkdkeVpXVnVMV1JoY21zNklDTXpaR0V4TUdZN1hHNGtaM0psWlc0dGNHRjViV1Z1ZERvZ0l6UXlPVGcwTVR0Y2JseHVKSEIxY25Cc1pUb2dJMkZpTkRkaVl6dGNiaVJ3ZFhKd2JHVXRaR0Z5YXpvZ0l6YzVNR1U0WWp0Y2JpUndkWEp3YkdVdGJHbG5hSFE2SUNOa1pqYzRaV1k3WEc1Y2JpUjBaV0ZzT2lBak1UbGxNMkl4TzF4dUpIUmxZV3d0WkdGeWF6b2dJekF3WVdZNU9EdGNibHh1SkhsbGJHeHZkem9nSTJZNVlUZ3lOVHRjYmlSNVpXeHNiM2N0WkdGeWF6b2dJMlkxTjJZeE56dGNiaUlzSWtCcGJYQnZjblFnSjJOdmJHOXljeTV3WTNOekp6dGNibHh1SkdSbFptRjFiSFF0ZEdWNGRDMWpiMnh2Y2pvZ0pHZHlZWGt0WkdGeWEyVnlPMXh1SkdSbFptRjFiSFF0Wm05dWRDMXphWHBsT2lBeE0zQjRPMXh1WEc0a1lYQndMV0puTFdOdmJHOXlPaUFrWjNKaGVTMXNhV2RvZEdWeU8xeHVYRzR2S2lvZ1VtOTNJR052YlhCdmJtVnVkQ0FxTDF4dUpISnZkeTF3WVdSa2FXNW5PaUF4TW5CNElERTFjSGc3WEc0a2NtOTNMWFJ2Y0Mxb1pXbG5hSFE2SUdGMWRHODdYRzRrY205M0xXSnZjbVJsY2kxamIyeHZjam9nSkdkeVlYa3RiR2xuYUhSbGNqdGNiaVJ5YjNjdFltY3RZMjlzYjNJNklDUjNhR2wwWlR0Y2JpUnliM2N0Y0hKcGJXRnllUzFqYjJ4dmNqb2dKR2R5WVhrdFpHRnlhMlZ5TzF4dUpISnZkeTF6WldOdmJtUmhjbmt0WTI5c2IzSTZJQ1JuY21GNU8xeHVKSEp2ZHkxbWIyNTBMWE5wZW1VNklERTBjSGc3WEc1Y2JpOHFLaUJKYm5CMWRDQmpiMjF3YjI1bGJuUWdLaTljYmlScGJuQjFkQzFpYjNKa1pYSXRZMjlzYjNJNklDUm5jbUY1TFd4cFoyaDBaWEk3WEc0a2FXNXdkWFF0Wm05amRYTXRZbTl5WkdWeUxXTnZiRzl5T2lBa2MzUnZibVV0WjNKbFpXNDdYRzRrYVc1d2RYUXRhVzUyWVd4cFpDMWliM0prWlhJdFkyOXNiM0k2SUNSeVpXUXRiR2xuYUhRN1hHNGthVzV3ZFhRdFpYSnliM0l0WTI5c2IzSTZJQ1J5WldRdGJHbG5hSFE3WEc1Y2JpOHFLaUJFYVdGc2IyY2dZMjl0Y0c5dVpXNTBJQ292WEc0a1pHbGhiRzluTFc1bFoyRjBhWFpsTFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dUpHUnBZV3h2Wnkxd2IzTnBkR2wyWlMxamIyeHZjam9nSkhOMGIyNWxMV2R5WldWdU8xeHVKR1JwWVd4dlp5MWpiMjVtYVhKdFlYUnBiMjR0Y0hKcGJXRnllUzFqYjJ4dmNqb2dKR2R5WVhrdFpHRnlhenRjYmlSa2FXRnNiMmN0WTI5dVptbHliV0YwYVc5dUxYUmxlSFF0WTI5c2IzSTZJQ1IzYUdsMFpUdGNibHh1THlvcUlFRmtiV2x1VEc5amF5QmpiMjF3YjI1bGJuUWdLaTljYmlSaFpHMXBibXh2WTJzdGJtVm5ZWFJwZG1VdFkyOXNiM0k2SUNSeVpXUXRiR2xuYUhRN1hHNGtZV1J0YVc1c2IyTnJMWFJsZUhRdFkyOXNiM0k2SUNSbmNtRjVMV1JoY21zN1hHNGtZV1J0YVc1c2IyTnJMV0poWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ05tTUdZd1pqQTdYRzVjYmlSaWRYUjBiMjR0Y0hKcGJXRnllUzFqYjJ4dmNqb2dKR2R5WldWdU8xeHVKR0oxZEhSdmJpMTBaWGgwTFdOdmJHOXlPaUFrZDJocGRHVTdYRzVjYmlSemQybDBZMmd0ZFc1amFHVmphMlZrTFdKbk9pQWtjMmxzZG1WeU8xeHVKSE4zYVhSamFDMTFibU5vWldOclpXUXRZMjlzYjNJNklDUnpaV0Z6YUdWc2JEdGNiaVJ6ZDJsMFkyZ3RZMmhsWTJ0bFpDMWlaem9nSkhOMGIyNWxMV2R5WldWdUxXeHBaMmgwTzF4dUpITjNhWFJqYUMxamFHVmphMlZrTFdOdmJHOXlPaUFrWjNKbFpXNDdYRzRrYzNkcGRHTm9MV1JwYzJGaWJHVmtMV0puT2lBa2MybHNkbVZ5TFd4cFoyaDBPMXh1SkhOM2FYUmphQzFrYVhOaFlteGxaQzFqYjJ4dmNqb2dKSE5wYkhabGNqdGNibHh1THlvZ1ZHRmljeUJqYjIxd2IyNWxiblFnS2k5Y2JpUjBZV0l0Ym1GMmFXZGhkR2x2YmkxaVp6b2dJMll5WmpKbU1qdGNiaVIwWVdJdGJHRmlaV3d0WTI5c2IzSTZJQ00yTlRjM04yWTdYRzRrZEdGaUxXbDBaVzB0Wm05dWRDMXphWHBsT2lBeE0zQjRPMXh1SkhSaFlpMXNhVzVsTFdOdmJHOXlPaUFrWjNKbFpXNDdYRzRrZEdGaUxXaGxhV2RvZERvZ05EQndlRHRjYmlJc0lseHVJQ0JwYm5CMWRDQjdYRzRnSUNBZ1pHbHpjR3hoZVRvZ2JtOXVaVHRjYmlBZ2ZWeHVYRzRnSUM1emQybDBZMmdnZTF4dUlDQWdJSEJ2YzJsMGFXOXVPaUJ5Wld4aGRHbDJaVHRjYmlBZ0lDQmthWE53YkdGNU9pQnBibXhwYm1VdFlteHZZMnM3WEc0Z0lDQWdkMmxrZEdnNklESTNjSGc3WEc0Z0lDQWdhR1ZwWjJoME9pQXhNbkI0TzF4dUlDQWdJSFpsY25ScFkyRnNMV0ZzYVdkdU9pQnRhV1JrYkdVN1hHNGdJQ0FnWW05eVpHVnlMWEpoWkdsMWN6b2dPSEI0TzF4dUlDQWdJR0poWTJ0bmNtOTFibVF0WTI5c2IzSTZJQ1J6ZDJsMFkyZ3RkVzVqYUdWamEyVmtMV0puTzF4dVhHNGdJQ0FnSmpvNllXWjBaWElnZTF4dUlDQWdJQ0FnWTI5dWRHVnVkRG9nSnljN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lCcGJteHBibVV0WW14dlkyczdYRzRnSUNBZ0lDQndiM05wZEdsdmJqb2dZV0p6YjJ4MWRHVTdYRzRnSUNBZ0lDQjBiM0E2SUMweWNIZzdYRzRnSUNBZ0lDQnNaV1owT2lBdE0zQjRPMXh1SUNBZ0lDQWdkMmxrZEdnNklERTJjSGc3WEc0Z0lDQWdJQ0JvWldsbmFIUTZJREUyY0hnN1hHNGdJQ0FnSUNCaWIzSmtaWEl0Y21Ga2FYVnpPaUExTUNVN1hHNGdJQ0FnSUNCaWIzSmtaWEk2SUc1dmJtVTdYRzRnSUNBZ0lDQmlZV05yWjNKdmRXNWtMV052Ykc5eU9pQWtjM2RwZEdOb0xYVnVZMmhsWTJ0bFpDMWpiMnh2Y2p0Y2JpQWdJQ0FnSUdKdmVDMXphR0ZrYjNjNklEQWdNQ0F4Y0hnZ01DQWpaVEJsTUdVd0xDQXdJREZ3ZUNBeGNIZ2dNQ0FqWXpGak1XTXhPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLaUJEYUdWamEyVmtJSE4zYVhSamFDQnpkSGxzWlNBcUwxeHVJQ0FnSUNaYlkyaGxZMnRsWkQwbmRISjFaU2RkSUh0Y2JpQWdJQ0FnSUdKaFkydG5jbTkxYm1RdFkyOXNiM0k2SUNSemQybDBZMmd0WTJobFkydGxaQzFpWnp0Y2JseHVJQ0FnSUNBZ0pqbzZZV1owWlhJZ2UxeHVJQ0FnSUNBZ0lDQnNaV1owT2lCaGRYUnZPMXh1SUNBZ0lDQWdJQ0J5YVdkb2REb2dMVE53ZUR0Y2JpQWdJQ0FnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0pITjNhWFJqYUMxamFHVmphMlZrTFdOdmJHOXlPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNibHh1SUNBZ0lDOHFLaUJFYVhOaFlteGxaQ0J6ZDJsMFkyZ2djM1I1YkdVZ0tpOWNiaUFnSUNBbVcyUnBjMkZpYkdWa1BTZDBjblZsSjEwZ2UxeHVJQ0FnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0pITjNhWFJqYUMxa2FYTmhZbXhsWkMxaVp6dGNibHh1SUNBZ0lDQWdKam82WVdaMFpYSWdlMXh1SUNBZ0lDQWdJQ0JpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFrYzNkcGRHTm9MV1JwYzJGaWJHVmtMV052Ykc5eU8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JpQWdmVnh1SWwxOSAqLzwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBNENBLEtBQUssY0FBQyxDQUFDLEFBQ0gsT0FBTyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUgsT0FBTyxjQUFDLENBQUMsQUFDTCxRQUFRLENBQUUsUUFBUSxDQUNsQixPQUFPLENBQUUsWUFBWSxDQUNyQixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osY0FBYyxDQUFFLE1BQU0sQ0FDdEIsYUFBYSxDQUFFLEdBQUcsQ0FDbEIsZ0JBQWdCLENBQUUsT0FBTyxBQUMzQixDQUFDLEFBRUgscUJBQU8sT0FBTyxBQUFDLENBQUMsQUFDVixPQUFPLENBQUUsRUFBRSxDQUNYLE9BQU8sQ0FBRSxZQUFZLENBQ3JCLFFBQVEsQ0FBRSxRQUFRLENBQ2xCLEdBQUcsQ0FBRSxJQUFJLENBQ1QsSUFBSSxDQUFFLElBQUksQ0FDVixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osYUFBYSxDQUFFLEdBQUcsQ0FDbEIsTUFBTSxDQUFFLElBQUksQ0FDWixnQkFBZ0IsQ0FBRSxPQUFPLENBQ3pCLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQUFDcEQsQ0FBQyxBQUlMLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQUMsQ0FBQyxBQUNuQixnQkFBZ0IsQ0FBRSxPQUFPLEFBQzNCLENBQUMsQUFFTCxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sZUFBQyxPQUFPLEFBQUMsQ0FBQyxBQUN4QixJQUFJLENBQUUsSUFBSSxDQUNWLEtBQUssQ0FBRSxJQUFJLENBQ1gsZ0JBQWdCLENBQUUsT0FBTyxBQUMzQixDQUFDLEFBSVAsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBQyxDQUFDLEFBQ3BCLGdCQUFnQixDQUFFLE9BQU8sQUFDM0IsQ0FBQyxBQUVMLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxlQUFDLE9BQU8sQUFBQyxDQUFDLEFBQ3pCLGdCQUFnQixDQUFFLE9BQU8sQUFDM0IsQ0FBQyJ9 */";
    append(document.head, style);
  }

  function create_main_fragment$d(component, ctx) {
    var label, input;

    function input_change_handler() {
      component.set({ checked: input.checked });
    }

    function change_handler(event) {
      component.fire('change', { value: ctx.checked });
    }

    return {
      c: function create() {
        label = createElement('label');
        input = createElement('input');
        addListener(input, 'change', input_change_handler);
        addListener(input, 'change', change_handler);
        setInputType(input, 'checkbox');
        input.disabled = ctx.disabled;
        setAttribute(input, 'data-trigger', 'click');
        input.className = 'svelte-43xk7i';
        addLoc(input, file$b, 1, 1, 45);
        label.className = 'switch svelte-43xk7i';
        setAttribute(label, 'checked', ctx.checked);
        setAttribute(label, 'disabled', ctx.disabled);
        addLoc(label, file$b, 0, 0, 0);
      },

      m: function mount(target, anchor) {
        insert(target, label, anchor);
        append(label, input);

        input.checked = ctx.checked;
      },

      p: function update(changed, _ctx) {
        ctx = _ctx;
        if (changed.checked) input.checked = ctx.checked;
        if (changed.disabled) {
          input.disabled = ctx.disabled;
        }

        if (changed.checked) {
          setAttribute(label, 'checked', ctx.checked);
        }

        if (changed.disabled) {
          setAttribute(label, 'disabled', ctx.disabled);
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(label);
        }

        removeListener(input, 'change', input_change_handler);
        removeListener(input, 'change', change_handler);
      },
    };
  }

  function Switch(options) {
    this._debugName = '<Switch>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$a(), options.data);
    if (!('checked' in this._state))
      console.warn(
        "<Switch> was created without expected data property 'checked'",
      );
    if (!('disabled' in this._state))
      console.warn(
        "<Switch> was created without expected data property 'disabled'",
      );
    this._intro = true;

    if (!document.getElementById('svelte-43xk7i-style')) add_css$a();

    this._fragment = create_main_fragment$d(this, this._state);

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);
    }
  }

  assign$1(Switch.prototype, protoDev);
  assign$1(Switch.prototype, methods$8);

  Switch.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/panels/Flows.html generated by Svelte v2.16.1 */

  function data$b() {
    const { $Payment, $Printer } = Registry.get();
    return {
      paymentWillFail: $Payment.panel.shouldFail,
      printerWillFail: $Printer.panel.shouldFail,
    };
  }
  function onupdate$3({ previous, changed, current }) {
    if (previous) {
      Registry.set(draft => {
        if (changed.printerWillFail) {
          draft.$Printer.panel.shouldFail = current.printerWillFail;
        }

        if (changed.paymentWillFail) {
          draft.$Payment.panel.shouldFail = current.paymentWillFail;
        }
      });
    }
  }
  const file$c = 'packages/pos/simulator/view/pos/panels/Flows.html';

  function create_main_fragment$e(component, ctx) {
    var div,
      text1,
      ul,
      li0,
      span0,
      text3,
      switch0_updating = {},
      text4,
      li1,
      span1,
      text6,
      switch1_updating = {};

    var switch0_initial_data = {};
    if (ctx.printerWillFail !== void 0) {
      switch0_initial_data.checked = ctx.printerWillFail;
      switch0_updating.checked = true;
    }
    var switch0 = new Switch({
      root: component.root,
      store: component.store,
      data: switch0_initial_data,
      _bind(changed, childState) {
        var newState = {};
        if (!switch0_updating.checked && changed.checked) {
          newState.printerWillFail = childState.checked;
        }
        component._set(newState);
        switch0_updating = {};
      },
    });

    component.root._beforecreate.push(() => {
      switch0._bind({ checked: 1 }, switch0.get());
    });

    var switch1_initial_data = {};
    if (ctx.paymentWillFail !== void 0) {
      switch1_initial_data.checked = ctx.paymentWillFail;
      switch1_updating.checked = true;
    }
    var switch1 = new Switch({
      root: component.root,
      store: component.store,
      data: switch1_initial_data,
      _bind(changed, childState) {
        var newState = {};
        if (!switch1_updating.checked && changed.checked) {
          newState.paymentWillFail = childState.checked;
        }
        component._set(newState);
        switch1_updating = {};
      },
    });

    component.root._beforecreate.push(() => {
      switch1._bind({ checked: 1 }, switch1.get());
    });

    return {
      c: function create() {
        div = createElement('div');
        div.textContent = 'Fluxos';
        text1 = createText('\n\n');
        ul = createElement('ul');
        li0 = createElement('li');
        span0 = createElement('span');
        span0.textContent = 'Impressora sem papel';
        text3 = createText('\n    ');
        switch0._fragment.c();
        text4 = createText('\n  ');
        li1 = createElement('li');
        span1 = createElement('span');
        span1.textContent = 'Pagamento com falha';
        text6 = createText('\n    ');
        switch1._fragment.c();
        div.className = 'title';
        addLoc(div, file$c, 0, 0, 0);
        addLoc(span0, file$c, 4, 4, 88);
        li0.className = 'controller';
        addLoc(li0, file$c, 3, 2, 60);
        addLoc(span1, file$c, 8, 4, 206);
        li1.className = 'controller';
        addLoc(li1, file$c, 7, 2, 178);
        ul.className = 'controllers';
        addLoc(ul, file$c, 2, 0, 33);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        insert(target, text1, anchor);
        insert(target, ul, anchor);
        append(ul, li0);
        append(li0, span0);
        append(li0, text3);
        switch0._mount(li0, null);
        append(ul, text4);
        append(ul, li1);
        append(li1, span1);
        append(li1, text6);
        switch1._mount(li1, null);
      },

      p: function update(changed, _ctx) {
        ctx = _ctx;
        var switch0_changes = {};
        if (!switch0_updating.checked && changed.printerWillFail) {
          switch0_changes.checked = ctx.printerWillFail;
          switch0_updating.checked = ctx.printerWillFail !== void 0;
        }
        switch0._set(switch0_changes);
        switch0_updating = {};

        var switch1_changes = {};
        if (!switch1_updating.checked && changed.paymentWillFail) {
          switch1_changes.checked = ctx.paymentWillFail;
          switch1_updating.checked = ctx.paymentWillFail !== void 0;
        }
        switch1._set(switch1_changes);
        switch1_updating = {};
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
          detachNode(text1);
          detachNode(ul);
        }

        switch0.destroy();
        switch1.destroy();
      },
    };
  }

  function Flows(options) {
    this._debugName = '<Flows>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$b(), options.data);
    if (!('printerWillFail' in this._state))
      console.warn(
        "<Flows> was created without expected data property 'printerWillFail'",
      );
    if (!('paymentWillFail' in this._state))
      console.warn(
        "<Flows> was created without expected data property 'paymentWillFail'",
      );
    this._intro = true;
    this._handlers.update = [onupdate$3];

    this._fragment = create_main_fragment$e(this, this._state);

    this.root._oncreate.push(() => {
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Flows.prototype, protoDev);

  Flows.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/panels/Http.html generated by Svelte v2.16.1 */

  function data$c() {
    const {
      $App: { appKey },
    } = Registry.persistent.get();

    return {
      ...Registry.get().$Http.panel,
      appKey,
      timeout: 0,
    };
  }
  function oncreate$8() {
    this.set({ requestMsg: `{"status":200, "msg": "OK"}` });
  }
  function onupdate$4({ previous, changed, current }) {
    if (previous) {
      Registry.persistent.set(draft => {
        if (changed.appKey) {
          draft.$App.appKey = current.appKey;
        }
      });
      Registry.set(draft => {
        draft.$Http.panel = current;
      });
    }
  }
  const file$d = 'packages/pos/simulator/view/pos/panels/Http.html';

  function create_main_fragment$f(component, ctx) {
    var div,
      text1,
      ul,
      li0,
      span0,
      text3,
      switch0_updating = {},
      text4,
      text5,
      li1,
      span1,
      text7,
      switch1_updating = {},
      text8;

    var switch0_initial_data = {};
    if (ctx.simulateRequest !== void 0) {
      switch0_initial_data.checked = ctx.simulateRequest;
      switch0_updating.checked = true;
    }
    var switch0 = new Switch({
      root: component.root,
      store: component.store,
      data: switch0_initial_data,
      _bind(changed, childState) {
        var newState = {};
        if (!switch0_updating.checked && changed.checked) {
          newState.simulateRequest = childState.checked;
        }
        component._set(newState);
        switch0_updating = {};
      },
    });

    component.root._beforecreate.push(() => {
      switch0._bind({ checked: 1 }, switch0.get());
    });

    var if_block0 = ctx.simulateRequest && create_if_block_1$2(component, ctx);

    var switch1_initial_data = {};
    if (ctx.activeProxy !== void 0) {
      switch1_initial_data.checked = ctx.activeProxy;
      switch1_updating.checked = true;
    }
    var switch1 = new Switch({
      root: component.root,
      store: component.store,
      data: switch1_initial_data,
      _bind(changed, childState) {
        var newState = {};
        if (!switch1_updating.checked && changed.checked) {
          newState.activeProxy = childState.checked;
        }
        component._set(newState);
        switch1_updating = {};
      },
    });

    component.root._beforecreate.push(() => {
      switch1._bind({ checked: 1 }, switch1.get());
    });

    var if_block1 = ctx.activeProxy && create_if_block$3(component, ctx);

    return {
      c: function create() {
        div = createElement('div');
        div.textContent = 'Requests';
        text1 = createText('\n\n');
        ul = createElement('ul');
        li0 = createElement('li');
        span0 = createElement('span');
        span0.textContent = 'Simular requisição?';
        text3 = createText('\n    ');
        switch0._fragment.c();
        text4 = createText('\n  ');
        if (if_block0) if_block0.c();
        text5 = createText('\n\n  ');
        li1 = createElement('li');
        span1 = createElement('span');
        span1.textContent = 'Ativar proxy';
        text7 = createText('\n    ');
        switch1._fragment.c();
        text8 = createText('\n\n  ');
        if (if_block1) if_block1.c();
        div.className = 'title';
        addLoc(div, file$d, 0, 0, 0);
        addLoc(span0, file$d, 4, 4, 90);
        li0.className = 'controller';
        addLoc(li0, file$d, 3, 2, 62);
        addLoc(span1, file$d, 37, 4, 1619);
        li1.className = 'controller';
        addLoc(li1, file$d, 36, 2, 1591);
        ul.className = 'controllers';
        addLoc(ul, file$d, 2, 0, 35);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        insert(target, text1, anchor);
        insert(target, ul, anchor);
        append(ul, li0);
        append(li0, span0);
        append(li0, text3);
        switch0._mount(li0, null);
        append(ul, text4);
        if (if_block0) if_block0.m(ul, null);
        append(ul, text5);
        append(ul, li1);
        append(li1, span1);
        append(li1, text7);
        switch1._mount(li1, null);
        append(ul, text8);
        if (if_block1) if_block1.m(ul, null);
      },

      p: function update(changed, _ctx) {
        ctx = _ctx;
        var switch0_changes = {};
        if (!switch0_updating.checked && changed.simulateRequest) {
          switch0_changes.checked = ctx.simulateRequest;
          switch0_updating.checked = ctx.simulateRequest !== void 0;
        }
        switch0._set(switch0_changes);
        switch0_updating = {};

        if (ctx.simulateRequest) {
          if (if_block0) {
            if_block0.p(changed, ctx);
          } else {
            if_block0 = create_if_block_1$2(component, ctx);
            if_block0.c();
            if_block0.m(ul, text5);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }

        var switch1_changes = {};
        if (!switch1_updating.checked && changed.activeProxy) {
          switch1_changes.checked = ctx.activeProxy;
          switch1_updating.checked = ctx.activeProxy !== void 0;
        }
        switch1._set(switch1_changes);
        switch1_updating = {};

        if (ctx.activeProxy) {
          if (if_block1) {
            if_block1.p(changed, ctx);
          } else {
            if_block1 = create_if_block$3(component, ctx);
            if_block1.c();
            if_block1.m(ul, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
          detachNode(text1);
          detachNode(ul);
        }

        switch0.destroy();
        if (if_block0) if_block0.d();
        switch1.destroy();
        if (if_block1) if_block1.d();
      },
    };
  }

  // (8:2) {#if simulateRequest}
  function create_if_block_1$2(component, ctx) {
    var li0,
      span0,
      text1,
      select,
      option0,
      option1,
      option2,
      option3,
      option4,
      option5,
      option6,
      option7,
      option8,
      option9,
      option10,
      option11,
      text14,
      li1,
      span1,
      text16,
      input,
      input_updating = false,
      text17,
      li2,
      span2,
      text19,
      textarea,
      textarea_updating = false;

    function change_handler(event) {
      component.set({ requestMsg: event.target.value });
    }

    function input_input_handler() {
      input_updating = true;
      component.set({ timeout: input.value });
      input_updating = false;
    }

    function textarea_input_handler() {
      textarea_updating = true;
      component.set({ requestPayload: textarea.value });
      textarea_updating = false;
    }

    return {
      c: function create() {
        li0 = createElement('li');
        span0 = createElement('span');
        span0.textContent = 'Código';
        text1 = createText('\n      ');
        select = createElement('select');
        option0 = createElement('option');
        option0.textContent = '200';
        option1 = createElement('option');
        option1.textContent = '201';
        option2 = createElement('option');
        option2.textContent = '202';
        option3 = createElement('option');
        option3.textContent = '203';
        option4 = createElement('option');
        option4.textContent = '204';
        option5 = createElement('option');
        option5.textContent = '400';
        option6 = createElement('option');
        option6.textContent = '401';
        option7 = createElement('option');
        option7.textContent = '403';
        option8 = createElement('option');
        option8.textContent = '404';
        option9 = createElement('option');
        option9.textContent = '408';
        option10 = createElement('option');
        option10.textContent = '500';
        option11 = createElement('option');
        option11.textContent = '504';
        text14 = createText('\n\n    ');
        li1 = createElement('li');
        span1 = createElement('span');
        span1.textContent = 'Timeout';
        text16 = createText('\n      ');
        input = createElement('input');
        text17 = createText('\n    ');
        li2 = createElement('li');
        span2 = createElement('span');
        span2.textContent = 'Payload';
        text19 = createText('\n      ');
        textarea = createElement('textarea');
        addLoc(span0, file$d, 9, 6, 235);
        option0.__value = `{"status":200, "msg": "OK"}`;
        option0.value = option0.__value;
        setAttribute(option0, 'default', true);
        addLoc(option0, file$d, 11, 10, 332);
        option1.__value = `{"status":201, "msg": "Created"}`;
        option1.value = option1.__value;
        addLoc(option1, file$d, 12, 10, 409);
        option2.__value = `{"status":202, "msg": "Accepted"}`;
        option2.value = option2.__value;
        addLoc(option2, file$d, 13, 10, 483);
        option3.__value = `{"status":203, "msg": "Non-authoritative Information"}`;
        option3.value = option3.__value;
        addLoc(option3, file$d, 14, 10, 558);
        option4.__value = `{"status":204, "msg": "No Content"}`;
        option4.value = option4.__value;
        addLoc(option4, file$d, 15, 10, 654);
        option5.__value = `{"status":400, "msg": "Bad Request"}`;
        option5.value = option5.__value;
        addLoc(option5, file$d, 16, 10, 731);
        option6.__value = `{"status":401, "msg": "Unauthorized"}`;
        option6.value = option6.__value;
        addLoc(option6, file$d, 17, 10, 809);
        option7.__value = `{"status":403, "msg": "Forbidden"}`;
        option7.value = option7.__value;
        addLoc(option7, file$d, 18, 10, 888);
        option8.__value = `{"status":404, "msg": "Not Found"}`;
        option8.value = option8.__value;
        addLoc(option8, file$d, 19, 10, 964);
        option9.__value = `{"status":408, "msg": "Request Timeout"}`;
        option9.value = option9.__value;
        addLoc(option9, file$d, 20, 10, 1040);
        option10.__value = `{"status":500, "msg": "Internal Server Error"}`;
        option10.value = option10.__value;
        addLoc(option10, file$d, 21, 10, 1122);
        option11.__value = `{"status":504, "msg": "Gateway Time-Out"}`;
        option11.value = option11.__value;
        addLoc(option11, file$d, 22, 10, 1210);
        addListener(select, 'change', change_handler);
        addLoc(select, file$d, 10, 6, 261);
        li0.className = 'controller';
        addLoc(li0, file$d, 8, 4, 205);
        addLoc(span1, file$d, 27, 6, 1352);
        addListener(input, 'input', input_input_handler);
        setInputType(input, 'text');
        addLoc(input, file$d, 28, 6, 1379);
        li1.className = 'controller is-full';
        addLoc(li1, file$d, 26, 4, 1314);
        addLoc(span2, file$d, 31, 6, 1473);
        addListener(textarea, 'input', textarea_input_handler);
        textarea.rows = '4';
        setStyle(textarea, 'resize', 'none');
        addLoc(textarea, file$d, 32, 6, 1500);
        li2.className = 'controller is-full';
        addLoc(li2, file$d, 30, 4, 1435);
      },

      m: function mount(target, anchor) {
        insert(target, li0, anchor);
        append(li0, span0);
        append(li0, text1);
        append(li0, select);
        append(select, option0);
        append(select, option1);
        append(select, option2);
        append(select, option3);
        append(select, option4);
        append(select, option5);
        append(select, option6);
        append(select, option7);
        append(select, option8);
        append(select, option9);
        append(select, option10);
        append(select, option11);
        insert(target, text14, anchor);
        insert(target, li1, anchor);
        append(li1, span1);
        append(li1, text16);
        append(li1, input);

        input.value = ctx.timeout;

        insert(target, text17, anchor);
        insert(target, li2, anchor);
        append(li2, span2);
        append(li2, text19);
        append(li2, textarea);

        textarea.value = ctx.requestPayload;
      },

      p: function update(changed, ctx) {
        if (!input_updating && changed.timeout) input.value = ctx.timeout;
        if (!textarea_updating && changed.requestPayload)
          textarea.value = ctx.requestPayload;
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(li0);
        }

        removeListener(select, 'change', change_handler);
        if (detach) {
          detachNode(text14);
          detachNode(li1);
        }

        removeListener(input, 'input', input_input_handler);
        if (detach) {
          detachNode(text17);
          detachNode(li2);
        }

        removeListener(textarea, 'input', textarea_input_handler);
      },
    };
  }

  // (42:2) {#if activeProxy}
  function create_if_block$3(component, ctx) {
    var li,
      span,
      text_1,
      input,
      input_updating = false;

    function input_input_handler() {
      input_updating = true;
      component.set({ appKey: input.value });
      input_updating = false;
    }

    return {
      c: function create() {
        li = createElement('li');
        span = createElement('span');
        span.textContent = 'AppKey';
        text_1 = createText('\n      ');
        input = createElement('input');
        addLoc(span, file$d, 43, 6, 1758);
        addListener(input, 'input', input_input_handler);
        setInputType(input, 'text');
        addLoc(input, file$d, 44, 6, 1784);
        li.className = 'controller is-full';
        addLoc(li, file$d, 42, 4, 1720);
      },

      m: function mount(target, anchor) {
        insert(target, li, anchor);
        append(li, span);
        append(li, text_1);
        append(li, input);

        input.value = ctx.appKey;
      },

      p: function update(changed, ctx) {
        if (!input_updating && changed.appKey) input.value = ctx.appKey;
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(li);
        }

        removeListener(input, 'input', input_input_handler);
      },
    };
  }

  function Http(options) {
    this._debugName = '<Http>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$c(), options.data);
    if (!('simulateRequest' in this._state))
      console.warn(
        "<Http> was created without expected data property 'simulateRequest'",
      );
    if (!('timeout' in this._state))
      console.warn(
        "<Http> was created without expected data property 'timeout'",
      );
    if (!('requestPayload' in this._state))
      console.warn(
        "<Http> was created without expected data property 'requestPayload'",
      );
    if (!('activeProxy' in this._state))
      console.warn(
        "<Http> was created without expected data property 'activeProxy'",
      );
    if (!('appKey' in this._state))
      console.warn(
        "<Http> was created without expected data property 'appKey'",
      );
    this._intro = true;
    this._handlers.update = [onupdate$4];

    this._fragment = create_main_fragment$f(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$8.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Http.prototype, protoDev);

  Http.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/panels/Merchant.html generated by Svelte v2.16.1 */

  const PERSISTENT_MERCHANT_INFO = [
    'stoneCode',
    'zipCode',
    'country',
    'city',
    'state',
    'neighborhood',
    'complement',
    'street',
    'number',
    'displayName',
    'taxationIdentificationType',
    'taxationIdentificationNumber',
  ];

  function data$d() {
    const {
      stoneCode,
      zipCode,
      country,
      city,
      state,
      neighborhood,
      complement,
      street,
      number,
      displayName,
      taxationIdentificationType,
      taxationIdentificationNumber,
    } = Registry.persistent.get().$Merchant;

    return {
      stoneCode,
      zipCode,
      country,
      city,
      state,
      neighborhood,
      complement,
      street,
      number,
      displayName,
      taxationIdentificationType,
      taxationIdentificationNumber,
    };
  }
  function oncreate$9() {
    Registry.on('persistentDataChanged', changes => {
      changes.forEach(({ path: [, prop], value }) => {
        if (prop in PERSISTENT_MERCHANT_INFO) {
          const key = {};
          key[prop] = value;
          this.set(key);
        }
      });
    });
  }
  function onupdate$5({ previous, changed, current }) {
    if (!previous) {
      return;
    }

    Registry.persistent.set(draft => {
      draft.$Merchant = {};
      PERSISTENT_MERCHANT_INFO.forEach(key => {
        if (changed[key]) {
          draft.$Merchant[key] = current[key];
        }
      });
    });
  }
  const file$e = 'packages/pos/simulator/view/pos/panels/Merchant.html';

  function create_main_fragment$g(component, ctx) {
    var div,
      text1,
      ul,
      li0,
      span0,
      text3,
      input0,
      input0_updating = false,
      text4,
      li1,
      span1,
      text6,
      input1,
      input1_updating = false,
      text7,
      li2,
      span2,
      text9,
      input2,
      input2_updating = false,
      text10,
      li3,
      span3,
      text12,
      input3,
      input3_updating = false,
      text13,
      li4,
      span4,
      text15,
      input4,
      input4_updating = false,
      text16,
      li5,
      span5,
      text18,
      input5,
      input5_updating = false,
      text19,
      li6,
      span6,
      text21,
      input6,
      input6_updating = false,
      text22,
      li7,
      span7,
      text24,
      input7,
      input7_updating = false,
      text25,
      li8,
      span8,
      text27,
      input8,
      input8_updating = false,
      text28,
      li9,
      span9,
      text30,
      input9,
      input9_updating = false;

    function input0_input_handler() {
      input0_updating = true;
      component.set({ displayName: input0.value });
      input0_updating = false;
    }

    function input1_input_handler() {
      input1_updating = true;
      component.set({ zipCode: input1.value });
      input1_updating = false;
    }

    function input2_input_handler() {
      input2_updating = true;
      component.set({ street: input2.value });
      input2_updating = false;
    }

    function input3_input_handler() {
      input3_updating = true;
      component.set({ number: input3.value });
      input3_updating = false;
    }

    function input4_input_handler() {
      input4_updating = true;
      component.set({ complement: input4.value });
      input4_updating = false;
    }

    function input5_input_handler() {
      input5_updating = true;
      component.set({ neighborhood: input5.value });
      input5_updating = false;
    }

    function input6_input_handler() {
      input6_updating = true;
      component.set({ city: input6.value });
      input6_updating = false;
    }

    function input7_input_handler() {
      input7_updating = true;
      component.set({ state: input7.value });
      input7_updating = false;
    }

    function input8_input_handler() {
      input8_updating = true;
      component.set({ taxationIdentificationType: input8.value });
      input8_updating = false;
    }

    function input9_input_handler() {
      input9_updating = true;
      component.set({ taxationIdentificationNumber: input9.value });
      input9_updating = false;
    }

    return {
      c: function create() {
        div = createElement('div');
        div.textContent = 'Lojista';
        text1 = createText('\n\n');
        ul = createElement('ul');
        li0 = createElement('li');
        span0 = createElement('span');
        span0.textContent = 'Nome de Exibição';
        text3 = createText('\n    ');
        input0 = createElement('input');
        text4 = createText('\n  ');
        li1 = createElement('li');
        span1 = createElement('span');
        span1.textContent = 'CEP';
        text6 = createText('\n    ');
        input1 = createElement('input');
        text7 = createText('\n  ');
        li2 = createElement('li');
        span2 = createElement('span');
        span2.textContent = 'Rua';
        text9 = createText('\n    ');
        input2 = createElement('input');
        text10 = createText('\n  ');
        li3 = createElement('li');
        span3 = createElement('span');
        span3.textContent = 'Número';
        text12 = createText('\n    ');
        input3 = createElement('input');
        text13 = createText('\n  ');
        li4 = createElement('li');
        span4 = createElement('span');
        span4.textContent = 'Complemento';
        text15 = createText('\n    ');
        input4 = createElement('input');
        text16 = createText('\n  ');
        li5 = createElement('li');
        span5 = createElement('span');
        span5.textContent = 'Bairro';
        text18 = createText('\n    ');
        input5 = createElement('input');
        text19 = createText('\n  ');
        li6 = createElement('li');
        span6 = createElement('span');
        span6.textContent = 'Cidade';
        text21 = createText('\n    ');
        input6 = createElement('input');
        text22 = createText('\n  ');
        li7 = createElement('li');
        span7 = createElement('span');
        span7.textContent = 'Estado';
        text24 = createText('\n    ');
        input7 = createElement('input');
        text25 = createText('\n  ');
        li8 = createElement('li');
        span8 = createElement('span');
        span8.textContent = 'CNPJ/CPF';
        text27 = createText('\n    ');
        input8 = createElement('input');
        text28 = createText('\n  ');
        li9 = createElement('li');
        span9 = createElement('span');
        span9.textContent = 'CPF/CNPJ';
        text30 = createText('\n    ');
        input9 = createElement('input');
        div.className = 'title';
        addLoc(div, file$e, 0, 0, 0);
        addLoc(span0, file$e, 4, 4, 97);
        addListener(input0, 'input', input0_input_handler);
        setInputType(input0, 'text');
        input0.maxLength = '20';
        addLoc(input0, file$e, 5, 4, 131);
        li0.className = 'controller is-full';
        addLoc(li0, file$e, 3, 2, 61);
        addLoc(span1, file$e, 8, 4, 239);
        addListener(input1, 'input', input1_input_handler);
        setInputType(input1, 'text');
        input1.maxLength = '8';
        addLoc(input1, file$e, 9, 4, 260);
        li1.className = 'controller is-full';
        addLoc(li1, file$e, 7, 2, 203);
        addLoc(span2, file$e, 12, 4, 363);
        addListener(input2, 'input', input2_input_handler);
        setInputType(input2, 'text');
        input2.maxLength = '30';
        addLoc(input2, file$e, 13, 4, 384);
        li2.className = 'controller is-full';
        addLoc(li2, file$e, 11, 2, 327);
        addLoc(span3, file$e, 16, 4, 487);
        addListener(input3, 'input', input3_input_handler);
        setInputType(input3, 'text');
        input3.maxLength = '10';
        addLoc(input3, file$e, 17, 4, 511);
        li3.className = 'controller is-full';
        addLoc(li3, file$e, 15, 2, 451);
        addLoc(span4, file$e, 20, 4, 614);
        addListener(input4, 'input', input4_input_handler);
        setInputType(input4, 'text');
        input4.maxLength = '20';
        addLoc(input4, file$e, 21, 4, 643);
        li4.className = 'controller is-full';
        addLoc(li4, file$e, 19, 2, 578);
        addLoc(span5, file$e, 24, 4, 750);
        addListener(input5, 'input', input5_input_handler);
        setInputType(input5, 'text');
        input5.maxLength = '20';
        addLoc(input5, file$e, 25, 4, 774);
        li5.className = 'controller is-full';
        addLoc(li5, file$e, 23, 2, 714);
        addLoc(span6, file$e, 28, 4, 883);
        addListener(input6, 'input', input6_input_handler);
        setInputType(input6, 'text');
        input6.maxLength = '30';
        addLoc(input6, file$e, 29, 4, 907);
        li6.className = 'controller is-full';
        addLoc(li6, file$e, 27, 2, 847);
        addLoc(span7, file$e, 32, 4, 1008);
        addListener(input7, 'input', input7_input_handler);
        setInputType(input7, 'text');
        input7.maxLength = '30';
        addLoc(input7, file$e, 33, 4, 1032);
        li7.className = 'controller is-full';
        addLoc(li7, file$e, 31, 2, 972);
        addLoc(span8, file$e, 36, 4, 1134);
        addListener(input8, 'input', input8_input_handler);
        setInputType(input8, 'text');
        input8.maxLength = '4';
        addLoc(input8, file$e, 37, 4, 1160);
        li8.className = 'controller is-full';
        addLoc(li8, file$e, 35, 2, 1098);
        addLoc(span9, file$e, 40, 4, 1282);
        addListener(input9, 'input', input9_input_handler);
        setInputType(input9, 'text');
        input9.maxLength = '16';
        addLoc(input9, file$e, 41, 4, 1308);
        li9.className = 'controller is-full';
        addLoc(li9, file$e, 39, 2, 1246);
        ul.className = 'controllers';
        addLoc(ul, file$e, 2, 0, 34);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);
        insert(target, text1, anchor);
        insert(target, ul, anchor);
        append(ul, li0);
        append(li0, span0);
        append(li0, text3);
        append(li0, input0);

        input0.value = ctx.displayName;

        append(ul, text4);
        append(ul, li1);
        append(li1, span1);
        append(li1, text6);
        append(li1, input1);

        input1.value = ctx.zipCode;

        append(ul, text7);
        append(ul, li2);
        append(li2, span2);
        append(li2, text9);
        append(li2, input2);

        input2.value = ctx.street;

        append(ul, text10);
        append(ul, li3);
        append(li3, span3);
        append(li3, text12);
        append(li3, input3);

        input3.value = ctx.number;

        append(ul, text13);
        append(ul, li4);
        append(li4, span4);
        append(li4, text15);
        append(li4, input4);

        input4.value = ctx.complement;

        append(ul, text16);
        append(ul, li5);
        append(li5, span5);
        append(li5, text18);
        append(li5, input5);

        input5.value = ctx.neighborhood;

        append(ul, text19);
        append(ul, li6);
        append(li6, span6);
        append(li6, text21);
        append(li6, input6);

        input6.value = ctx.city;

        append(ul, text22);
        append(ul, li7);
        append(li7, span7);
        append(li7, text24);
        append(li7, input7);

        input7.value = ctx.state;

        append(ul, text25);
        append(ul, li8);
        append(li8, span8);
        append(li8, text27);
        append(li8, input8);

        input8.value = ctx.taxationIdentificationType;

        append(ul, text28);
        append(ul, li9);
        append(li9, span9);
        append(li9, text30);
        append(li9, input9);

        input9.value = ctx.taxationIdentificationNumber;
      },

      p: function update(changed, ctx) {
        if (!input0_updating && changed.displayName)
          input0.value = ctx.displayName;
        if (!input1_updating && changed.zipCode) input1.value = ctx.zipCode;
        if (!input2_updating && changed.street) input2.value = ctx.street;
        if (!input3_updating && changed.number) input3.value = ctx.number;
        if (!input4_updating && changed.complement)
          input4.value = ctx.complement;
        if (!input5_updating && changed.neighborhood)
          input5.value = ctx.neighborhood;
        if (!input6_updating && changed.city) input6.value = ctx.city;
        if (!input7_updating && changed.state) input7.value = ctx.state;
        if (!input8_updating && changed.taxationIdentificationType)
          input8.value = ctx.taxationIdentificationType;
        if (!input9_updating && changed.taxationIdentificationNumber)
          input9.value = ctx.taxationIdentificationNumber;
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
          detachNode(text1);
          detachNode(ul);
        }

        removeListener(input0, 'input', input0_input_handler);
        removeListener(input1, 'input', input1_input_handler);
        removeListener(input2, 'input', input2_input_handler);
        removeListener(input3, 'input', input3_input_handler);
        removeListener(input4, 'input', input4_input_handler);
        removeListener(input5, 'input', input5_input_handler);
        removeListener(input6, 'input', input6_input_handler);
        removeListener(input7, 'input', input7_input_handler);
        removeListener(input8, 'input', input8_input_handler);
        removeListener(input9, 'input', input9_input_handler);
      },
    };
  }

  function Merchant(options) {
    this._debugName = '<Merchant>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this._state = assign$1(data$d(), options.data);
    if (!('displayName' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'displayName'",
      );
    if (!('zipCode' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'zipCode'",
      );
    if (!('street' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'street'",
      );
    if (!('number' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'number'",
      );
    if (!('complement' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'complement'",
      );
    if (!('neighborhood' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'neighborhood'",
      );
    if (!('city' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'city'",
      );
    if (!('state' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'state'",
      );
    if (!('taxationIdentificationType' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'taxationIdentificationType'",
      );
    if (!('taxationIdentificationNumber' in this._state))
      console.warn(
        "<Merchant> was created without expected data property 'taxationIdentificationNumber'",
      );
    this._intro = true;
    this._handlers.update = [onupdate$5];

    this._fragment = create_main_fragment$g(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$9.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Merchant.prototype, protoDev);

  Merchant.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/ControlPanel.html generated by Svelte v2.16.1 */

  let lastKeypressTime = 0;

  function data$e() {
    return {
      panels: [General, Merchant, Flows, Http],
    };
  }
  var methods$9 = {
    handleShortcutStroke() {
      const keypressTime = new Date();
      /** Require double keypress */
      if (keypressTime - lastKeypressTime <= 400) {
        this.refs.toggle.checked = !this.refs.toggle.checked;
      }
      lastKeypressTime = keypressTime;
    },
  };

  function oncreate$a() {
    const togglePanels = e => {
      if (e.target.classList.contains('title')) {
        const eventPath = e.path || (e.composedPath && e.composedPath());
        const section = eventPath.find(n => n.classList.contains('section'));
        if (section) {
          section.classList.toggle('is-active');
        }
      }
    };

    this.refs.panel.addEventListener('click', togglePanels);
    this.on('destroy', () => {
      this.refs.panel.removeEventListener('click', togglePanels);
    });
  }
  const file$f = 'packages/pos/simulator/view/pos/ControlPanel.html';

  function add_css$b() {
    var style = createElement('style');
    style.id = 'svelte-1bkz5bw-style';
    style.textContent =
      '.panel-wrapper.svelte-1bkz5bw{width:100vh;overflow:hidden;color:#333;-webkit-user-select:none;user-select:none}.panel-toggle.svelte-1bkz5bw{position:fixed;z-index:9001;top:20px;right:20px;display:-webkit-box;display:flex;width:40px;height:40px;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;background-color:#fff;border-radius:50%;cursor:pointer;font-size:24px;-webkit-transition:-webkit-transform 0.3s ease;transition:-webkit-transform 0.3s ease;transition:transform 0.3s ease;transition:transform 0.3s ease, -webkit-transform 0.3s ease;box-shadow:0px 0px 4px 1px rgba(0, 0, 0, 0.2)}.panel-toggle.svelte-1bkz5bw:hover{-webkit-transform:scale(1.1) rotate(0);transform:scale(1.1) rotate(0)}.panel-checkbox:checked~.panel-toggle.svelte-1bkz5bw{-webkit-transform:scale(1) rotate(360deg);transform:scale(1) rotate(360deg)}.panel-checkbox.svelte-1bkz5bw{display:none}.panel.svelte-1bkz5bw{position:fixed;z-index:9000;top:0;right:-100%;background-color:#fff;width:260px;height:100%;padding:60px 15px 30px;opacity:0;border-top-left-radius:5px;border-bottom-left-radius:5px;box-shadow:-4px 0 15px rgba(0, 0, 0, 0.4);overflow:auto;overflow-x:hidden}.panel-checkbox:checked~.panel.svelte-1bkz5bw{right:0;opacity:1}.panel.svelte-1bkz5bw .title{cursor:pointer;font-weight:bold;border-bottom:1px dotted #ccc;font-size:18px;line-height:1;padding-bottom:5px;-webkit-transition:-webkit-transform 0.3s ease;transition:-webkit-transform 0.3s ease;transition:transform 0.3s ease;transition:transform 0.3s ease, -webkit-transform 0.3s ease;-webkit-transform-origin:0 50%;transform-origin:0 50%}.panel.svelte-1bkz5bw .title:hover{-webkit-transform:scale(1.05);transform:scale(1.05)}.panel.svelte-1bkz5bw textarea,.panel.svelte-1bkz5bw input{width:100%;border-radius:3px;border:none;border-left:3px solid #e3e6e7;padding:8px 5px;-webkit-transition:background-color 0.3s ease;transition:background-color 0.3s ease}.panel.svelte-1bkz5bw textarea{background-color:#f5f7f7}.panel.svelte-1bkz5bw input{background-color:#fff}.panel.svelte-1bkz5bw input:hover,.panel.svelte-1bkz5bw input:focus{background-color:#f5f7f7}.panel.svelte-1bkz5bw .controllers{-webkit-transition:opacity 0.3s ease, visibility 0.3s ease;transition:opacity 0.3s ease, visibility 0.3s ease}.panel.svelte-1bkz5bw .controller{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:justify;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}.panel.svelte-1bkz5bw .controller.is-full{display:block}.panel.svelte-1bkz5bw .controller.is-full > span{display:block;margin-bottom:8px}.panel.svelte-1bkz5bw .controller > *{display:block}.section.svelte-1bkz5bw:not(.is-active) .title{border-bottom:none}.section.svelte-1bkz5bw:not(.is-active) .controllers{-webkit-transition:none;transition:none;opacity:0;height:0;visibility:hidden}.section+.section.svelte-1bkz5bw{margin-top:25px}@media(max-width: 400px){.panel-toggle.svelte-1bkz5bw{display:none\n  }.panel.svelte-1bkz5bw{padding-top:30px;width:220px\n  }.panel.svelte-1bkz5bw .controller{font-size:12px\n    }.panel.svelte-1bkz5bw .controller > span{max-width:145px}}@media(min-width: 401px){.panel.svelte-1bkz5bw{-webkit-transition:right 0.3s ease, opacity 0.5s ease;transition:right 0.3s ease, opacity 0.5s ease\n  }}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbFBhbmVsLmh0bWwiLCJzb3VyY2VzIjpbIkNvbnRyb2xQYW5lbC5odG1sIl0sInNvdXJjZXNDb250ZW50IjpbIjxLZXlzdHJva2Uga2V5PVwic2hvcnRjdXRzXCIgb246a2V5c3Ryb2tlPVwiaGFuZGxlU2hvcnRjdXRTdHJva2UoZXZlbnQpXCIgLz5cblxuPGRpdiBjbGFzcz1cInBhbmVsLXdyYXBwZXJcIj5cbiAgPGlucHV0IHJlZjp0b2dnbGUgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJwYW5lbC1jaGVja2JveFwiIGlkPVwicGFuZWwtdG9nZ2xlclwiPlxuICA8bGFiZWwgZm9yPVwicGFuZWwtdG9nZ2xlclwiIGNsYXNzPVwicGFuZWwtdG9nZ2xlXCI+JiN4MjY5OTs8L2xhYmVsPlxuICA8ZGl2IGNsYXNzPVwicGFuZWxcIiByZWY6cGFuZWw+XG4gICAgeyNlYWNoIHBhbmVscyBhcyBwYW5lbH1cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uXCI+XG4gICAgICAgIDxzdmVsdGU6Y29tcG9uZW50IHRoaXM9e3BhbmVsfSAvPlxuICAgICAgPC9kaXY+XG4gICAgey9lYWNofVxuICA8L2Rpdj5cbjwvZGl2PlxuXG48c2NyaXB0PlxuICBpbXBvcnQgR2VuZXJhbFBhbmVsIGZyb20gJy4vcGFuZWxzL0dlbmVyYWwuaHRtbCc7XG4gIGltcG9ydCBGbG93c1BhbmVsIGZyb20gJy4vcGFuZWxzL0Zsb3dzLmh0bWwnO1xuICBpbXBvcnQgSHR0cFBhbmVsIGZyb20gJy4vcGFuZWxzL0h0dHAuaHRtbCc7XG4gIGltcG9ydCBNZXJjaGFudCBmcm9tICcuL3BhbmVscy9NZXJjaGFudC5odG1sJztcblxuICBsZXQgbGFzdEtleXByZXNzVGltZSA9IDA7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgIEtleXN0cm9rZTogJ0BtYW1iYS9hcHAvS2V5c3Ryb2tlLmh0bWwnLFxuICAgIH0sXG4gICAgZGF0YSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhbmVsczogW0dlbmVyYWxQYW5lbCwgTWVyY2hhbnQsIEZsb3dzUGFuZWwsIEh0dHBQYW5lbF0sXG4gICAgICB9O1xuICAgIH0sXG4gICAgb25jcmVhdGUoKSB7XG4gICAgICBjb25zdCB0b2dnbGVQYW5lbHMgPSBlID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndGl0bGUnKSkge1xuICAgICAgICAgIGNvbnN0IGV2ZW50UGF0aCA9IGUucGF0aCB8fCAoZS5jb21wb3NlZFBhdGggJiYgZS5jb21wb3NlZFBhdGgoKSk7XG4gICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IGV2ZW50UGF0aC5maW5kKG4gPT4gbi5jbGFzc0xpc3QuY29udGFpbnMoJ3NlY3Rpb24nKSk7XG4gICAgICAgICAgaWYgKHNlY3Rpb24pIHtcbiAgICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlZnMucGFuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVQYW5lbHMpO1xuICAgICAgdGhpcy5vbignZGVzdHJveScsICgpID0+IHtcbiAgICAgICAgdGhpcy5yZWZzLnBhbmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlUGFuZWxzKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgaGFuZGxlU2hvcnRjdXRTdHJva2UoKSB7XG4gICAgICAgIGNvbnN0IGtleXByZXNzVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIC8qKiBSZXF1aXJlIGRvdWJsZSBrZXlwcmVzcyAqL1xuICAgICAgICBpZiAoa2V5cHJlc3NUaW1lIC0gbGFzdEtleXByZXNzVGltZSA8PSA0MDApIHtcbiAgICAgICAgICB0aGlzLnJlZnMudG9nZ2xlLmNoZWNrZWQgPSAhdGhpcy5yZWZzLnRvZ2dsZS5jaGVja2VkO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RLZXlwcmVzc1RpbWUgPSBrZXlwcmVzc1RpbWU7XG4gICAgICB9LFxuICAgIH0sXG4gIH07XG48L3NjcmlwdD5cblxuPHN0eWxlPi8qIC0tLSAqL1xuXG4vKiogUm93IGNvbXBvbmVudCAqL1xuXG4vKiogSW5wdXQgY29tcG9uZW50ICovXG5cbi8qKiBEaWFsb2cgY29tcG9uZW50ICovXG5cbi8qKiBBZG1pbkxvY2sgY29tcG9uZW50ICovXG5cbi8qIFRhYnMgY29tcG9uZW50ICovXG5cbi5wYW5lbC13cmFwcGVyIHtcbiAgICB3aWR0aDogMTAwdmg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBjb2xvcjogIzMzMztcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuLnBhbmVsLXRvZ2dsZSB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHotaW5kZXg6IDkwMDE7XG4gICAgdG9wOiAyMHB4O1xuICAgIHJpZ2h0OiAyMHB4O1xuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgd2lkdGg6IDQwcHg7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gICAgdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZSwgLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIGJveC1zaGFkb3c6IDBweCAwcHggNHB4IDFweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gIH1cblxuLnBhbmVsLXRvZ2dsZTpob3ZlciB7XG4gICAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMS4xKSByb3RhdGUoMCk7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4xKSByb3RhdGUoMCk7XG4gICAgfVxuXG4ucGFuZWwtY2hlY2tib3g6Y2hlY2tlZCB+IC5wYW5lbC10b2dnbGUge1xuICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgzNjBkZWcpO1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cblxuLnBhbmVsLWNoZWNrYm94IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbi5wYW5lbCB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHotaW5kZXg6IDkwMDA7XG4gICAgdG9wOiAwO1xuICAgIHJpZ2h0OiAtMTAwJTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xuICAgIHdpZHRoOiAyNjBweDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgcGFkZGluZzogNjBweCAxNXB4IDMwcHg7XG4gICAgb3BhY2l0eTogMDtcbiAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiA1cHg7XG4gICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogNXB4O1xuICAgIGJveC1zaGFkb3c6IC00cHggMCAxNXB4IHJnYmEoMCwgMCwgMCwgMC40KTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gIH1cblxuLnBhbmVsLWNoZWNrYm94OmNoZWNrZWQgfiAucGFuZWwge1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cblxuLnBhbmVsIDpnbG9iYWwoLnRpdGxlKSB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBkb3R0ZWQgI2NjYztcbiAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgcGFkZGluZy1ib3R0b206IDVweDtcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2UsIC13ZWJraXQtdHJhbnNmb3JtIDAuM3MgZWFzZTtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbjogMCA1MCU7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgNTAlO1xuICAgIH1cblxuLnBhbmVsIDpnbG9iYWwoLnRpdGxlKTpob3ZlciB7XG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xuICAgICAgfVxuXG4ucGFuZWwgOmdsb2JhbCh0ZXh0YXJlYSksXG4gICAgLnBhbmVsIDpnbG9iYWwoaW5wdXQpIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAjZTNlNmU3O1xuICAgICAgcGFkZGluZzogOHB4IDVweDtcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2U7XG4gICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZTtcbiAgICB9XG5cbi5wYW5lbCA6Z2xvYmFsKHRleHRhcmVhKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmN2Y3O1xuICAgIH1cblxuLnBhbmVsIDpnbG9iYWwoaW5wdXQpIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgfVxuXG4ucGFuZWwgOmdsb2JhbChpbnB1dCk6aG92ZXIsXG4gICAgICAucGFuZWwgOmdsb2JhbChpbnB1dCk6Zm9jdXMge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmN2Y3O1xuICAgICAgfVxuXG4ucGFuZWwgOmdsb2JhbCguY29udHJvbGxlcnMpIHtcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzIGVhc2UsIHZpc2liaWxpdHkgMC4zcyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzIGVhc2UsIHZpc2liaWxpdHkgMC4zcyBlYXNlO1xuICAgIH1cblxuLnBhbmVsIDpnbG9iYWwoLmNvbnRyb2xsZXIpIHtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAtd2Via2l0LWJveC1wYWNrOiBqdXN0aWZ5O1xuICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICBwYWRkaW5nOiAxMHB4IDA7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2VlZTtcbiAgICB9XG5cbi5wYW5lbCA6Z2xvYmFsKC5jb250cm9sbGVyKS5pcy1mdWxsIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG5cbi5wYW5lbCA6Z2xvYmFsKC5jb250cm9sbGVyKS5pcy1mdWxsIDpnbG9iYWwoPiBzcGFuKSB7XG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICAgICAgICB9XG5cbi5wYW5lbCA6Z2xvYmFsKC5jb250cm9sbGVyKSA6Z2xvYmFsKD4gKikge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIH1cblxuLnNlY3Rpb246bm90KC5pcy1hY3RpdmUpIDpnbG9iYWwoLnRpdGxlKSB7XG4gICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICB9XG5cbi5zZWN0aW9uOm5vdCguaXMtYWN0aXZlKSA6Z2xvYmFsKC5jb250cm9sbGVycykge1xuICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IG5vbmU7XG4gICAgICAgIHRyYW5zaXRpb246IG5vbmU7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIGhlaWdodDogMDtcbiAgICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgICAgfVxuXG4uc2VjdGlvbiArIC5zZWN0aW9uIHtcbiAgICAgIG1hcmdpbi10b3A6IDI1cHg7XG4gICAgfVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDAwcHgpIHtcblxuLnBhbmVsLXRvZ2dsZSB7XG4gICAgICBkaXNwbGF5OiBub25lXG4gIH1cblxuLnBhbmVsIHtcbiAgICAgIHBhZGRpbmctdG9wOiAzMHB4O1xuICAgICAgd2lkdGg6IDIyMHB4XG4gIH1cblxuLnBhbmVsIDpnbG9iYWwoLmNvbnRyb2xsZXIpIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4XG4gICAgfVxuXG4gICAgICAgIC5wYW5lbCA6Z2xvYmFsKC5jb250cm9sbGVyKSA6Z2xvYmFsKD4gc3Bhbikge1xuICAgICAgICAgIG1heC13aWR0aDogMTQ1cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbkBtZWRpYSAobWluLXdpZHRoOiA0MDFweCkge1xuXG4ucGFuZWwge1xuICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiByaWdodCAwLjNzIGVhc2UsIG9wYWNpdHkgMC41cyBlYXNlO1xuICAgICAgdHJhbnNpdGlvbjogcmlnaHQgMC4zcyBlYXNlLCBvcGFjaXR5IDAuNXMgZWFzZVxuICB9XG4gICAgfVxuXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OUFiV0Z0WW1FdmMzUjViR1Z6TDJOdmJHOXljeTV3WTNOeklpd2libTlrWlY5dGIyUjFiR1Z6TDBCdFlXMWlZUzl6ZEhsc1pYTXZkR2hsYldVdWNHTnpjeUlzSW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZRMjl1ZEhKdmJGQmhibVZzTG1oMGJXd2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJkVUpCTEZGQlFWRTdPMEZEYUVKU0xHMUNRVUZ0UWpzN1FVRlRia0lzY1VKQlFYRkNPenRCUVUxeVFpeHpRa0ZCYzBJN08wRkJUWFJDTEhsQ1FVRjVRanM3UVVGbGVrSXNiVUpCUVcxQ096dEJRekZEYWtJN1NVRkRSU3haUVVGWk8wbEJRMW9zWjBKQlFXZENPMGxCUTJoQ0xGZEJRVmM3U1VGRFdDeDVRa0ZCYVVJN1dVRkJha0lzYVVKQlFXbENPMFZCUTI1Q096dEJRVVZCTzBsQlEwVXNaVUZCWlR0SlFVTm1MR0ZCUVdFN1NVRkRZaXhUUVVGVE8wbEJRMVFzVjBGQlZ6dEpRVU5ZTEc5Q1FVRmhPMGxCUVdJc1lVRkJZVHRKUVVOaUxGZEJRVmM3U1VGRFdDeFpRVUZaTzBsQlExb3NlVUpCUVcxQ08xbEJRVzVDTEcxQ1FVRnRRanRKUVVOdVFpeDNRa0ZCZFVJN1dVRkJka0lzZFVKQlFYVkNPMGxCUTNaQ0xITkNRVUZ6UWp0SlFVTjBRaXhyUWtGQmEwSTdTVUZEYkVJc1pVRkJaVHRKUVVObUxHVkJRV1U3U1VGRFppd3JRMEZCSzBJN1NVRkJMMElzZFVOQlFTdENPMGxCUVM5Q0xDdENRVUVyUWp0SlFVRXZRaXcwUkVGQkswSTdTVUZETDBJc09FTkJRVGhETzBWQllXaEVPenRCUVZCRk8wMUJRMFVzZFVOQlFTdENPMk5CUVM5Q0xDdENRVUVyUWp0SlFVTnFRenM3UVVGRlFUdE5RVU5GTERCRFFVRnJRenRqUVVGc1F5eHJRMEZCYTBNN1NVRkRjRU03TzBGQlIwWTdTVUZEUlN4aFFVRmhPMFZCUTJZN08wRkJSVUU3U1VGRFJTeGxRVUZsTzBsQlEyWXNZVUZCWVR0SlFVTmlMRTFCUVUwN1NVRkRUaXhaUVVGWk8wbEJRMW9zYzBKQlFYTkNPMGxCUTNSQ0xGbEJRVms3U1VGRFdpeFpRVUZaTzBsQlExb3NkVUpCUVhWQ08wbEJRM1pDTEZWQlFWVTdTVUZEVml3eVFrRkJNa0k3U1VGRE0wSXNPRUpCUVRoQ08wbEJRemxDTERCRFFVRXdRenRKUVVNeFF5eGpRVUZqTzBsQlEyUXNhMEpCUVd0Q08wVkJjMFp3UWpzN1FVRXpSVVU3VFVGRFJTeFJRVUZSTzAxQlExSXNWVUZCVlR0SlFVTmFPenRCUVVWQk8wMUJRMFVzWlVGQlpUdE5RVU5tTEdsQ1FVRnBRanROUVVOcVFpdzRRa0ZCT0VJN1RVRkRPVUlzWlVGQlpUdE5RVU5tTEdOQlFXTTdUVUZEWkN4dFFrRkJiVUk3VFVGRGJrSXNLME5CUVN0Q08wMUJRUzlDTEhWRFFVRXJRanROUVVFdlFpd3JRa0ZCSzBJN1RVRkJMMElzTkVSQlFTdENPMDFCUXk5Q0xDdENRVUYxUWp0alFVRjJRaXgxUWtGQmRVSTdTVUZMZWtJN08wRkJTRVU3VVVGRFJTdzRRa0ZCYzBJN1owSkJRWFJDTEhOQ1FVRnpRanROUVVONFFqczdRVUZIUmpzN1RVRkZSU3hYUVVGWE8wMUJRMWdzYTBKQlFXdENPMDFCUTJ4Q0xGbEJRVms3VFVGRFdpdzRRa0ZCT0VJN1RVRkRPVUlzWjBKQlFXZENPMDFCUTJoQ0xEaERRVUZ6UXp0TlFVRjBReXh6UTBGQmMwTTdTVUZEZUVNN08wRkJSVUU3VFVGRFJTeDVRa0ZCZVVJN1NVRkRNMEk3TzBGQlJVRTdUVUZEUlN4elFrRkJjMEk3U1VGTmVFSTdPMEZCU2tVN08xRkJSVVVzZVVKQlFYbENPMDFCUXpOQ096dEJRVWRHTzAxQlEwVXNNa1JCUVcxRU8wMUJRVzVFTEcxRVFVRnRSRHRKUVVOeVJEczdRVUZGUVR0TlFVTkZMRzlDUVVGaE8wMUJRV0lzWVVGQllUdE5RVU5pTEhsQ1FVRnRRanRqUVVGdVFpeHRRa0ZCYlVJN1RVRkRia0lzZVVKQlFUaENPMk5CUVRsQ0xEaENRVUU0UWp0TlFVTTVRaXhsUVVGbE8wMUJRMllzTmtKQlFUWkNPMGxCYzBJdlFqczdRVUZ3UWtVN1VVRkRSU3hqUVVGak8wMUJUV2hDT3p0QlFVcEZPMVZCUTBVc1kwRkJZenRWUVVOa0xHdENRVUZyUWp0UlFVTndRanM3UVVGWFJqdFJRVU5GTEdOQlFXTTdUVUZEYUVJN08wRkJUVUU3VVVGRFJTeHRRa0ZCYlVJN1RVRkRja0k3TzBGQlJVRTdVVUZEUlN4M1FrRkJaMEk3VVVGQmFFSXNaMEpCUVdkQ08xRkJRMmhDTEZWQlFWVTdVVUZEVml4VFFVRlRPMUZCUTFRc2EwSkJRV3RDTzAxQlEzQkNPenRCUVVkR08wMUJRMFVzWjBKQlFXZENPMGxCUTJ4Q096dEJRWFpKUVRzN1FVRnFRa1k3VFVGclFrazdSVUZWU2pzN1FVRk5RVHROUVdsQ1NTeHBRa0ZCYVVJN1RVRkRha0k3UlVGclJrbzdPMEZCTlVKRk8xRkJhVUpKTzBsQlZVbzdPMUZCVWtrN1ZVRkRSU3huUWtGQlowSTdVVUZEYkVJN1NVRTFSMG83TzBGQmIwTkJPenRCUVhKQ1JqdE5RWE5DU1N4elJFRkJPRU03VFVGQk9VTTdSVUU0UlVvN1NVRTNSVVVpTENKbWFXeGxJam9pY0dGamEyRm5aWE12Y0c5ekwzTnBiWFZzWVhSdmNpOTJhV1YzTDNCdmN5OURiMjUwY205c1VHRnVaV3d1YUhSdGJDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaVJpYkdGamF6b2dJekF3TUR0Y2JseHVKSGRvYVhSbE9pQWpabVptTzF4dUpITmxZWE5vWld4c09pQWpaakZtTVdZeE8xeHVYRzRrYzNSdmJtVXRaM0psWlc0NklDTTBabUl6TkRFN1hHNGtjM1J2Ym1VdFozSmxaVzR0WkdGeWF6b2dJekUxTXpVeU1qdGNiaVJ6ZEc5dVpTMW5jbVZsYmkxc2FXZG9kRG9nSTJFMlpHWTRZenRjYmx4dUpHZHlZWGt0WkdGeWEyVnlPaUFqTXpVek5UTTFPMXh1SkdkeVlYa3RaR0Z5YXpvZ0l6UXlOVGsyTXp0Y2JpUm5jbUY1T2lBak4yVTNaVGRsTzF4dUpHZHlZWGt0YkdsbmFIUTZJQ05pTldJMVlqVTdYRzRrWjNKaGVTMXNhV2RvZEdWeU9pQWpaVE5sTm1VM08xeHVKR2R5WVhrdGJHbG5hSFJsYzNRNklDTm1NV1l5WmpNN1hHNWNiaVJ6YVd4MlpYSTZJQ05pWVdJNVlqazdYRzRrYzJsc2RtVnlMV3hwWjJoME9pQWpaR05rWTJSak8xeHVYRzRrY21Wa09pQWpabVl4WVRGaE8xeHVKSEpsWkMxa1lYSnJPaUFqWkRVd01EQXdPMXh1SkhKbFpDMXNhV2RvZERvZ0kyVTROV0kxWWp0Y2JseHVMeW9nTFMwdElDb3ZYRzVjYmlSaWJIVmxPaUFqTWpFNU5tWXpPMXh1SkdKc2RXVXRaR0Z5YXpvZ0l6RTFOalZqTUR0Y2JseHVKR0pzZFdVdFozSmhlUzFzYVdkb2REb2dJemt3WVRSaFpUdGNiaVJpYkhWbExXZHlZWGs2SUNNMk1EZGtPR0k3WEc0a1lteDFaUzFuY21GNUxXUmhjbXM2SUNNME5UVmhOalE3WEc1Y2JpUm5jbVZsYmpvZ0l6UmxZbVl4WVR0Y2JpUm5jbVZoYmkxc2FXZG9kRG9nSXpSallXWTFNRHRjYmlSbmNtVmxiaTFrWVhKck9pQWpNMlJoTVRCbU8xeHVKR2R5WldWdUxYQmhlVzFsYm5RNklDTTBNams0TkRFN1hHNWNiaVJ3ZFhKd2JHVTZJQ05oWWpRM1ltTTdYRzRrY0hWeWNHeGxMV1JoY21zNklDTTNPVEJsT0dJN1hHNGtjSFZ5Y0d4bExXeHBaMmgwT2lBalpHWTNPR1ZtTzF4dVhHNGtkR1ZoYkRvZ0l6RTVaVE5pTVR0Y2JpUjBaV0ZzTFdSaGNtczZJQ013TUdGbU9UZzdYRzVjYmlSNVpXeHNiM2M2SUNObU9XRTRNalU3WEc0a2VXVnNiRzkzTFdSaGNtczZJQ05tTlRkbU1UYzdYRzRpTENKQWFXMXdiM0owSUNkamIyeHZjbk11Y0dOemN5YzdYRzVjYmlSa1pXWmhkV3gwTFhSbGVIUXRZMjlzYjNJNklDUm5jbUY1TFdSaGNtdGxjanRjYmlSa1pXWmhkV3gwTFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmx4dUpHRndjQzFpWnkxamIyeHZjam9nSkdkeVlYa3RiR2xuYUhSbGNqdGNibHh1THlvcUlGSnZkeUJqYjIxd2IyNWxiblFnS2k5Y2JpUnliM2N0Y0dGa1pHbHVaem9nTVRKd2VDQXhOWEI0TzF4dUpISnZkeTEwYjNBdGFHVnBaMmgwT2lCaGRYUnZPMXh1SkhKdmR5MWliM0prWlhJdFkyOXNiM0k2SUNSbmNtRjVMV3hwWjJoMFpYSTdYRzRrY205M0xXSm5MV052Ykc5eU9pQWtkMmhwZEdVN1hHNGtjbTkzTFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXRsY2p0Y2JpUnliM2N0YzJWamIyNWtZWEo1TFdOdmJHOXlPaUFrWjNKaGVUdGNiaVJ5YjNjdFptOXVkQzF6YVhwbE9pQXhOSEI0TzF4dVhHNHZLaW9nU1c1d2RYUWdZMjl0Y0c5dVpXNTBJQ292WEc0a2FXNXdkWFF0WW05eVpHVnlMV052Ykc5eU9pQWtaM0poZVMxc2FXZG9kR1Z5TzF4dUpHbHVjSFYwTFdadlkzVnpMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pITjBiMjVsTFdkeVpXVnVPMXh1SkdsdWNIVjBMV2x1ZG1Gc2FXUXRZbTl5WkdWeUxXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR2x1Y0hWMExXVnljbTl5TFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dVhHNHZLaW9nUkdsaGJHOW5JR052YlhCdmJtVnVkQ0FxTDF4dUpHUnBZV3h2WnkxdVpXZGhkR2wyWlMxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUmthV0ZzYjJjdGNHOXphWFJwZG1VdFkyOXNiM0k2SUNSemRHOXVaUzFuY21WbGJqdGNiaVJrYVdGc2IyY3RZMjl1Wm1seWJXRjBhVzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXM3WEc0a1pHbGhiRzluTFdOdmJtWnBjbTFoZEdsdmJpMTBaWGgwTFdOdmJHOXlPaUFrZDJocGRHVTdYRzVjYmk4cUtpQkJaRzFwYmt4dlkyc2dZMjl0Y0c5dVpXNTBJQ292WEc0a1lXUnRhVzVzYjJOckxXNWxaMkYwYVhabExXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR0ZrYldsdWJHOWpheTEwWlhoMExXTnZiRzl5T2lBa1ozSmhlUzFrWVhKck8xeHVKR0ZrYldsdWJHOWpheTFpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWmpCbU1HWXdPMXh1WEc0a1luVjBkRzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVJpZFhSMGIyNHRkR1Y0ZEMxamIyeHZjam9nSkhkb2FYUmxPMXh1WEc0a2MzZHBkR05vTFhWdVkyaGxZMnRsWkMxaVp6b2dKSE5wYkhabGNqdGNiaVJ6ZDJsMFkyZ3RkVzVqYUdWamEyVmtMV052Ykc5eU9pQWtjMlZoYzJobGJHdzdYRzRrYzNkcGRHTm9MV05vWldOclpXUXRZbWM2SUNSemRHOXVaUzFuY21WbGJpMXNhV2RvZER0Y2JpUnpkMmwwWTJndFkyaGxZMnRsWkMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhOM2FYUmphQzFrYVhOaFlteGxaQzFpWnpvZ0pITnBiSFpsY2kxc2FXZG9kRHRjYmlSemQybDBZMmd0WkdsellXSnNaV1F0WTI5c2IzSTZJQ1J6YVd4MlpYSTdYRzVjYmk4cUlGUmhZbk1nWTI5dGNHOXVaVzUwSUNvdlhHNGtkR0ZpTFc1aGRtbG5ZWFJwYjI0dFltYzZJQ05tTW1ZeVpqSTdYRzRrZEdGaUxXeGhZbVZzTFdOdmJHOXlPaUFqTmpVM056ZG1PMXh1SkhSaFlpMXBkR1Z0TFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmlSMFlXSXRiR2x1WlMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhSaFlpMW9aV2xuYUhRNklEUXdjSGc3WEc0aUxDSmNiaUFnTG5CaGJtVnNMWGR5WVhCd1pYSWdlMXh1SUNBZ0lIZHBaSFJvT2lBeE1EQjJhRHRjYmlBZ0lDQnZkbVZ5Wm14dmR6b2dhR2xrWkdWdU8xeHVJQ0FnSUdOdmJHOXlPaUFqTXpNek8xeHVJQ0FnSUhWelpYSXRjMlZzWldOME9pQnViMjVsTzF4dUlDQjlYRzVjYmlBZ0xuQmhibVZzTFhSdloyZHNaU0I3WEc0Z0lDQWdjRzl6YVhScGIyNDZJR1pwZUdWa08xeHVJQ0FnSUhvdGFXNWtaWGc2SURrd01ERTdYRzRnSUNBZ2RHOXdPaUF5TUhCNE8xeHVJQ0FnSUhKcFoyaDBPaUF5TUhCNE8xeHVJQ0FnSUdScGMzQnNZWGs2SUdac1pYZzdYRzRnSUNBZ2QybGtkR2c2SURRd2NIZzdYRzRnSUNBZ2FHVnBaMmgwT2lBME1IQjRPMXh1SUNBZ0lHRnNhV2R1TFdsMFpXMXpPaUJqWlc1MFpYSTdYRzRnSUNBZ2FuVnpkR2xtZVMxamIyNTBaVzUwT2lCalpXNTBaWEk3WEc0Z0lDQWdZbUZqYTJkeWIzVnVaQzFqYjJ4dmNqb2dJMlptWmp0Y2JpQWdJQ0JpYjNKa1pYSXRjbUZrYVhWek9pQTFNQ1U3WEc0Z0lDQWdZM1Z5YzI5eU9pQndiMmx1ZEdWeU8xeHVJQ0FnSUdadmJuUXRjMmw2WlRvZ01qUndlRHRjYmlBZ0lDQjBjbUZ1YzJsMGFXOXVPaUIwY21GdWMyWnZjbTBnTUM0emN5QmxZWE5sTzF4dUlDQWdJR0p2ZUMxemFHRmtiM2M2SURCd2VDQXdjSGdnTkhCNElERndlQ0J5WjJKaEtEQXNJREFzSURBc0lEQXVNaWs3WEc1Y2JpQWdJQ0JBYldWa2FXRWdLRzFoZUMxM2FXUjBhRG9nTkRBd2NIZ3BJSHRjYmlBZ0lDQWdJR1JwYzNCc1lYazZJRzV2Ym1VN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnSmpwb2IzWmxjaUI3WEc0Z0lDQWdJQ0IwY21GdWMyWnZjbTA2SUhOallXeGxLREV1TVNrZ2NtOTBZWFJsS0RBcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM1d1lXNWxiQzFqYUdWamEySnZlRHBqYUdWamEyVmtJSDRnSmlCN1hHNGdJQ0FnSUNCMGNtRnVjMlp2Y20wNklITmpZV3hsS0RFcElISnZkR0YwWlNnek5qQmtaV2NwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM1d1lXNWxiQzFqYUdWamEySnZlQ0I3WEc0Z0lDQWdaR2x6Y0d4aGVUb2dibTl1WlR0Y2JpQWdmVnh1WEc0Z0lDNXdZVzVsYkNCN1hHNGdJQ0FnY0c5emFYUnBiMjQ2SUdacGVHVmtPMXh1SUNBZ0lIb3RhVzVrWlhnNklEa3dNREE3WEc0Z0lDQWdkRzl3T2lBd08xeHVJQ0FnSUhKcFoyaDBPaUF0TVRBd0pUdGNiaUFnSUNCaVlXTnJaM0p2ZFc1a0xXTnZiRzl5T2lBalptWm1PMXh1SUNBZ0lIZHBaSFJvT2lBeU5qQndlRHRjYmlBZ0lDQm9aV2xuYUhRNklERXdNQ1U3WEc0Z0lDQWdjR0ZrWkdsdVp6b2dOakJ3ZUNBeE5YQjRJRE13Y0hnN1hHNGdJQ0FnYjNCaFkybDBlVG9nTUR0Y2JpQWdJQ0JpYjNKa1pYSXRkRzl3TFd4bFpuUXRjbUZrYVhWek9pQTFjSGc3WEc0Z0lDQWdZbTl5WkdWeUxXSnZkSFJ2YlMxc1pXWjBMWEpoWkdsMWN6b2dOWEI0TzF4dUlDQWdJR0p2ZUMxemFHRmtiM2M2SUMwMGNIZ2dNQ0F4TlhCNElISm5ZbUVvTUN3Z01Dd2dNQ3dnTUM0MEtUdGNiaUFnSUNCdmRtVnlabXh2ZHpvZ1lYVjBienRjYmlBZ0lDQnZkbVZ5Wm14dmR5MTRPaUJvYVdSa1pXNDdYRzVjYmlBZ0lDQkFiV1ZrYVdFZ0tHMWhlQzEzYVdSMGFEb2dOREF3Y0hncElIdGNiaUFnSUNBZ0lIQmhaR1JwYm1jdGRHOXdPaUF6TUhCNE8xeHVJQ0FnSUNBZ2QybGtkR2c2SURJeU1IQjRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lFQnRaV1JwWVNBb2JXbHVMWGRwWkhSb09pQTBNREZ3ZUNrZ2UxeHVJQ0FnSUNBZ2RISmhibk5wZEdsdmJqb2djbWxuYUhRZ01DNHpjeUJsWVhObExDQnZjR0ZqYVhSNUlEQXVOWE1nWldGelpUdGNiaUFnSUNCOVhHNWNiaUFnSUNBdWNHRnVaV3d0WTJobFkydGliM2c2WTJobFkydGxaQ0IrSUNZZ2UxeHVJQ0FnSUNBZ2NtbG5hSFE2SURBN1hHNGdJQ0FnSUNCdmNHRmphWFI1T2lBeE8xeHVJQ0FnSUgxY2JseHVJQ0FnSURwbmJHOWlZV3dvTG5ScGRHeGxLU0I3WEc0Z0lDQWdJQ0JqZFhKemIzSTZJSEJ2YVc1MFpYSTdYRzRnSUNBZ0lDQm1iMjUwTFhkbGFXZG9kRG9nWW05c1pEdGNiaUFnSUNBZ0lHSnZjbVJsY2kxaWIzUjBiMjA2SURGd2VDQmtiM1IwWldRZ0kyTmpZenRjYmlBZ0lDQWdJR1p2Ym5RdGMybDZaVG9nTVRod2VEdGNiaUFnSUNBZ0lHeHBibVV0YUdWcFoyaDBPaUF4TzF4dUlDQWdJQ0FnY0dGa1pHbHVaeTFpYjNSMGIyMDZJRFZ3ZUR0Y2JpQWdJQ0FnSUhSeVlXNXphWFJwYjI0NklIUnlZVzV6Wm05eWJTQXdMak56SUdWaGMyVTdYRzRnSUNBZ0lDQjBjbUZ1YzJadmNtMHRiM0pwWjJsdU9pQXdJRFV3SlR0Y2JseHVJQ0FnSUNBZ0pqcG9iM1psY2lCN1hHNGdJQ0FnSUNBZ0lIUnlZVzV6Wm05eWJUb2djMk5oYkdVb01TNHdOU2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdPbWRzYjJKaGJDaDBaWGgwWVhKbFlTa3NYRzRnSUNBZ09tZHNiMkpoYkNocGJuQjFkQ2tnZTF4dUlDQWdJQ0FnZDJsa2RHZzZJREV3TUNVN1hHNGdJQ0FnSUNCaWIzSmtaWEl0Y21Ga2FYVnpPaUF6Y0hnN1hHNGdJQ0FnSUNCaWIzSmtaWEk2SUc1dmJtVTdYRzRnSUNBZ0lDQmliM0prWlhJdGJHVm1kRG9nTTNCNElITnZiR2xrSUNObE0yVTJaVGM3WEc0Z0lDQWdJQ0J3WVdSa2FXNW5PaUE0Y0hnZ05YQjRPMXh1SUNBZ0lDQWdkSEpoYm5OcGRHbHZiam9nWW1GamEyZHliM1Z1WkMxamIyeHZjaUF3TGpOeklHVmhjMlU3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdPbWRzYjJKaGJDaDBaWGgwWVhKbFlTa2dlMXh1SUNBZ0lDQWdZbUZqYTJkeWIzVnVaQzFqYjJ4dmNqb2dJMlkxWmpkbU56dGNiaUFnSUNCOVhHNWNiaUFnSUNBNloyeHZZbUZzS0dsdWNIVjBLU0I3WEc0Z0lDQWdJQ0JpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWm1abU8xeHVYRzRnSUNBZ0lDQW1PbWh2ZG1WeUxGeHVJQ0FnSUNBZ0pqcG1iMk4xY3lCN1hHNGdJQ0FnSUNBZ0lHSmhZMnRuY205MWJtUXRZMjlzYjNJNklDTm1OV1kzWmpjN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnT21kc2IySmhiQ2d1WTI5dWRISnZiR3hsY25NcElIdGNiaUFnSUNBZ0lIUnlZVzV6YVhScGIyNDZJRzl3WVdOcGRIa2dNQzR6Y3lCbFlYTmxMQ0IyYVhOcFltbHNhWFI1SURBdU0zTWdaV0Z6WlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0E2WjJ4dlltRnNLQzVqYjI1MGNtOXNiR1Z5S1NCN1hHNGdJQ0FnSUNCa2FYTndiR0Y1T2lCbWJHVjRPMXh1SUNBZ0lDQWdZV3hwWjI0dGFYUmxiWE02SUdObGJuUmxjanRjYmlBZ0lDQWdJR3AxYzNScFpua3RZMjl1ZEdWdWREb2djM0JoWTJVdFltVjBkMlZsYmp0Y2JpQWdJQ0FnSUhCaFpHUnBibWM2SURFd2NIZ2dNRHRjYmlBZ0lDQWdJR0p2Y21SbGNpMWliM1IwYjIwNklERndlQ0J6YjJ4cFpDQWpaV1ZsTzF4dVhHNGdJQ0FnSUNBbUxtbHpMV1oxYkd3Z2UxeHVJQ0FnSUNBZ0lDQmthWE53YkdGNU9pQmliRzlqYXp0Y2JseHVJQ0FnSUNBZ0lDQTZaMnh2WW1Gc0tENGdjM0JoYmlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1JwYzNCc1lYazZJR0pzYjJOck8xeHVJQ0FnSUNBZ0lDQWdJRzFoY21kcGJpMWliM1IwYjIwNklEaHdlRHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCQWJXVmthV0VnS0cxaGVDMTNhV1IwYURvZ05EQXdjSGdwSUh0Y2JpQWdJQ0FnSUNBZ1ptOXVkQzF6YVhwbE9pQXhNbkI0TzF4dVhHNGdJQ0FnSUNBZ0lEcG5iRzlpWVd3b1BpQnpjR0Z1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdiV0Y0TFhkcFpIUm9PaUF4TkRWd2VEdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0E2WjJ4dlltRnNLRDRnS2lrZ2UxeHVJQ0FnSUNBZ0lDQmthWE53YkdGNU9pQmliRzlqYXp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdWMyVmpkR2x2YmlCN1hHNGdJQ0FnSmpwdWIzUW9MbWx6TFdGamRHbDJaU2tnZTF4dUlDQWdJQ0FnT21kc2IySmhiQ2d1ZEdsMGJHVXBJSHRjYmlBZ0lDQWdJQ0FnWW05eVpHVnlMV0p2ZEhSdmJUb2dibTl1WlR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ09tZHNiMkpoYkNndVkyOXVkSEp2Ykd4bGNuTXBJSHRjYmlBZ0lDQWdJQ0FnZEhKaGJuTnBkR2x2YmpvZ2JtOXVaVHRjYmlBZ0lDQWdJQ0FnYjNCaFkybDBlVG9nTUR0Y2JpQWdJQ0FnSUNBZ2FHVnBaMmgwT2lBd08xeHVJQ0FnSUNBZ0lDQjJhWE5wWW1sc2FYUjVPaUJvYVdSa1pXNDdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0ppQXJJQzV6WldOMGFXOXVJSHRjYmlBZ0lDQWdJRzFoY21kcGJpMTBiM0E2SURJMWNIZzdYRzRnSUNBZ2ZWeHVJQ0I5WEc0aVhYMD0gKi88L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXdFQSxjQUFjLGVBQUMsQ0FBQyxBQUNaLEtBQUssQ0FBRSxLQUFLLENBQ1osUUFBUSxDQUFFLE1BQU0sQ0FDaEIsS0FBSyxDQUFFLElBQUksQ0FDWCxtQkFBbUIsQ0FBRSxJQUFJLENBQ2pCLFdBQVcsQ0FBRSxJQUFJLEFBQzNCLENBQUMsQUFFSCxhQUFhLGVBQUMsQ0FBQyxBQUNYLFFBQVEsQ0FBRSxLQUFLLENBQ2YsT0FBTyxDQUFFLElBQUksQ0FDYixHQUFHLENBQUUsSUFBSSxDQUNULEtBQUssQ0FBRSxJQUFJLENBQ1gsT0FBTyxDQUFFLFdBQVcsQ0FDcEIsT0FBTyxDQUFFLElBQUksQ0FDYixLQUFLLENBQUUsSUFBSSxDQUNYLE1BQU0sQ0FBRSxJQUFJLENBQ1osaUJBQWlCLENBQUUsTUFBTSxDQUNqQixX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 */';
    append(document.head, style);
  }

  function get_each_context$1(ctx, list, i) {
    const child_ctx = Object.create(ctx);
    child_ctx.panel = list[i];
    return child_ctx;
  }

  function create_main_fragment$h(component, ctx) {
    var text0, div1, input, text1, label, text3, div0;

    var keystroke_initial_data = { key: 'shortcuts' };
    var keystroke = new Keystroke({
      root: component.root,
      store: component.store,
      data: keystroke_initial_data,
    });

    keystroke.on('keystroke', function(event) {
      component.handleShortcutStroke(event);
    });

    var each_value = ctx.panels;

    var each_blocks = [];

    for (var i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(
        component,
        get_each_context$1(ctx, each_value, i),
      );
    }

    return {
      c: function create() {
        keystroke._fragment.c();
        text0 = createText('\n\n');
        div1 = createElement('div');
        input = createElement('input');
        text1 = createText('\n  ');
        label = createElement('label');
        label.textContent = '⚙';
        text3 = createText('\n  ');
        div0 = createElement('div');

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        setInputType(input, 'checkbox');
        input.className = 'panel-checkbox svelte-1bkz5bw';
        input.id = 'panel-toggler';
        addLoc(input, file$f, 3, 2, 104);
        label.htmlFor = 'panel-toggler';
        label.className = 'panel-toggle svelte-1bkz5bw';
        addLoc(label, file$f, 4, 2, 183);
        div0.className = 'panel svelte-1bkz5bw';
        addLoc(div0, file$f, 5, 2, 250);
        div1.className = 'panel-wrapper svelte-1bkz5bw';
        addLoc(div1, file$f, 2, 0, 74);
      },

      m: function mount(target, anchor) {
        keystroke._mount(target, anchor);
        insert(target, text0, anchor);
        insert(target, div1, anchor);
        append(div1, input);
        component.refs.toggle = input;
        append(div1, text1);
        append(div1, label);
        append(div1, text3);
        append(div1, div0);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div0, null);
        }

        component.refs.panel = div0;
      },

      p: function update(changed, ctx) {
        if (changed.panels) {
          each_value = ctx.panels;

          for (var i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, child_ctx);
            } else {
              each_blocks[i] = create_each_block$1(component, child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },

      d: function destroy(detach) {
        keystroke.destroy(detach);
        if (detach) {
          detachNode(text0);
          detachNode(div1);
        }

        if (component.refs.toggle === input) component.refs.toggle = null;

        destroyEach(each_blocks, detach);

        if (component.refs.panel === div0) component.refs.panel = null;
      },
    };
  }

  // (7:4) {#each panels as panel}
  function create_each_block$1(component, ctx) {
    var div, text;

    var switch_value = ctx.panel;

    function switch_props(ctx) {
      return {
        root: component.root,
        store: component.store,
      };
    }

    if (switch_value) {
      var switch_instance = new switch_value(switch_props());
    }

    return {
      c: function create() {
        div = createElement('div');
        if (switch_instance) switch_instance._fragment.c();
        text = createText('\n      ');
        div.className = 'section svelte-1bkz5bw';
        addLoc(div, file$f, 7, 6, 314);
      },

      m: function mount(target, anchor) {
        insert(target, div, anchor);

        if (switch_instance) {
          switch_instance._mount(div, null);
        }

        append(div, text);
      },

      p: function update(changed, ctx) {
        if (switch_value !== (switch_value = ctx.panel)) {
          if (switch_instance) {
            switch_instance.destroy();
          }

          if (switch_value) {
            switch_instance = new switch_value(switch_props());
            switch_instance._fragment.c();
            switch_instance._mount(div, text);
          } else {
            switch_instance = null;
          }
        }
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div);
        }

        if (switch_instance) switch_instance.destroy();
      },
    };
  }

  function ControlPanel(options) {
    this._debugName = '<ControlPanel>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1(data$e(), options.data);
    if (!('panels' in this._state))
      console.warn(
        "<ControlPanel> was created without expected data property 'panels'",
      );
    this._intro = true;

    if (!document.getElementById('svelte-1bkz5bw-style')) add_css$b();

    this._fragment = create_main_fragment$h(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$a.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(ControlPanel.prototype, protoDev);
  assign$1(ControlPanel.prototype, methods$9);

  ControlPanel.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  /* packages/pos/simulator/view/pos/Wrapper.html generated by Svelte v2.16.1 */

  /**
   * Detect if we're running on a webkit environment.
   * We check for `edge` because it fakes one.
   */
  const ENGINE =
    'WebkitAppearance' in document.documentElement.style &&
    !/edge/i.test(navigator.userAgent)
      ? 'webkit'
      : 'other';

  function oncreate$b() {
    /**
     * Remove the 'app-root' id from the body, since
     * its replaced by the 'app-root' inside the <Screen />
     * */
    document.body.removeAttribute('id');
    document.documentElement.setAttribute('virtual-pos', '');

    /**
     * Set the render engine to the html attribute
     * to make our css a bit smarter since we depend heavily on webkit.
     * */
    document.documentElement.setAttribute('engine', ENGINE);
  }
  const file$g = 'packages/pos/simulator/view/pos/Wrapper.html';

  function add_css$c() {
    var style = createElement('style');
    style.id = 'svelte-6ehx64-style';
    style.textContent =
      '.hide-scrollbar{}.hide-scrollbar::-webkit-scrollbar{display:none;width:0px;background:transparent}.hide-scrollbar,.hide-scrollbar::before,.hide-scrollbar::after{scrollbar-width:none}.hide-scrollbars,.hide-scrollbars *{}.hide-scrollbars::-webkit-scrollbar,.hide-scrollbars *::-webkit-scrollbar{display:none;width:0px;background:transparent}.hide-scrollbars,.hide-scrollbars::before,.hide-scrollbars::after,.hide-scrollbars *,.hide-scrollbars *::before,.hide-scrollbars *::after{scrollbar-width:none}.engine-alert.svelte-6ehx64{position:static;z-index:100000;width:100%;padding:10px 75px;background-color:#bf4130;color:#fff;font-size:16px;text-align:center;-webkit-animation:2s ease-in-out svelte-6ehx64-blink infinite;animation:2s ease-in-out svelte-6ehx64-blink infinite;pointer-events:none}.engine-alert.svelte-6ehx64 a.svelte-6ehx64{text-decoration:underline;color:#fff;pointer-events:auto}@-webkit-keyframes svelte-6ehx64-blink{0%{opacity:0.4}50%{opacity:0.9}100%{opacity:0.4}}@keyframes svelte-6ehx64-blink{0%{opacity:0.4}50%{opacity:0.9}100%{opacity:0.4}}@media(max-width: 400px){body,.container.svelte-6ehx64,.main-wrapper.svelte-6ehx64{height:100%}body{}body::-webkit-scrollbar{display:none;width:0px;background:transparent}body,body::before,body::after{scrollbar-width:none}}@media(min-width: 401px){.container.svelte-6ehx64{display:-webkit-box;display:flex;height:100vh;width:100%;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;background-image:url(./assets/wood.jpg);background-size:cover;overflow:hidden}.main-wrapper.svelte-6ehx64{position:relative}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV3JhcHBlci5odG1sIiwic291cmNlcyI6WyJXcmFwcGVyLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsieyNpZiBFTkdJTkUgPT09ICd3ZWJraXQnfVxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1haW4td3JhcHBlclwiPlxuICAgICAgPFBPUyByZWY6UE9TPlxuICAgICAgICA8TGF1bmNoZXIgLz5cbiAgICAgIDwvUE9TPlxuICAgICAgPENhcmQgcmVmOmNhcmQgLz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG57OmVsc2V9XG4gIDxkaXYgY2xhc3M9XCJlbmdpbmUtYWxlcnRcIj5cbiAgICBQYXJhIHVtIHLDoXBpZG8gZGVzZW52b2x2aW1lbnRvIG1haXMgZmllbCBhbyBhbWJpZW50ZSBkbyBQT1MsIMOpIHJlY29tZW5kYWRvIG8gdXNvIGRvIDxzdHJvbmc+PGEgaHJlZj1cImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vY2hyb21lL1wiIHRhcmdldD1cIl9ibGFua1wiPkNocm9tZTwvYT48L3N0cm9uZz4gY29tbyBuYXZlZ2Fkb3IuXG4gIDwvZGl2PlxuICA8ZGl2IGlkPVwiYXBwLXJvb3RcIj48L2Rpdj5cbnsvaWZ9XG5cbjxDb250cm9sUGFuZWwgcmVmOmNvbnRyb2xQYW5lbCAvPlxuXG48c2NyaXB0PlxuICAvKipcbiAgICogRGV0ZWN0IGlmIHdlJ3JlIHJ1bm5pbmcgb24gYSB3ZWJraXQgZW52aXJvbm1lbnQuXG4gICAqIFdlIGNoZWNrIGZvciBgZWRnZWAgYmVjYXVzZSBpdCBmYWtlcyBvbmUuXG4gICAqL1xuICBjb25zdCBFTkdJTkUgPVxuICAgICdXZWJraXRBcHBlYXJhbmNlJyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUgJiZcbiAgICAhL2VkZ2UvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG4gICAgICA/ICd3ZWJraXQnXG4gICAgICA6ICdvdGhlcic7XG5cbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgIFBPUzogJy4vUE9TLmh0bWwnLFxuICAgICAgQ2FyZDogJy4vQ2FyZC5odG1sJyxcbiAgICAgIExhdW5jaGVyOiAnLi9hcHBzL0xhdW5jaGVyLmh0bWwnLFxuICAgICAgQ29udHJvbFBhbmVsOiAnLi9Db250cm9sUGFuZWwuaHRtbCcsXG4gICAgfSxcbiAgICBoZWxwZXJzOiB7XG4gICAgICBFTkdJTkUsXG4gICAgfSxcbiAgICBvbmNyZWF0ZSgpIHtcbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIHRoZSAnYXBwLXJvb3QnIGlkIGZyb20gdGhlIGJvZHksIHNpbmNlXG4gICAgICAgKiBpdHMgcmVwbGFjZWQgYnkgdGhlICdhcHAtcm9vdCcgaW5zaWRlIHRoZSA8U2NyZWVuIC8+XG4gICAgICAgKiAqL1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCd2aXJ0dWFsLXBvcycsICcnKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgdGhlIHJlbmRlciBlbmdpbmUgdG8gdGhlIGh0bWwgYXR0cmlidXRlXG4gICAgICAgKiB0byBtYWtlIG91ciBjc3MgYSBiaXQgc21hcnRlciBzaW5jZSB3ZSBkZXBlbmQgaGVhdmlseSBvbiB3ZWJraXQuXG4gICAgICAgKiAqL1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZW5naW5lJywgRU5HSU5FKTtcbiAgICB9LFxuICB9O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZT4vKiAtLS0gKi9cblxuLyoqIFJvdyBjb21wb25lbnQgKi9cblxuLyoqIElucHV0IGNvbXBvbmVudCAqL1xuXG4vKiogRGlhbG9nIGNvbXBvbmVudCAqL1xuXG4vKiogQWRtaW5Mb2NrIGNvbXBvbmVudCAqL1xuXG4vKiBUYWJzIGNvbXBvbmVudCAqL1xuXG4vKiBzdHlsZWxpbnQtZGlzYWJsZSAqL1xuXG4vKiBzdHlsZWxpbnQtZW5hYmxlICovXG5cbjpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFyKSB7LyogSGlkZSBhbGwgc2Nyb2xsYmFycyBmb3Igd2Via2l0IGJhc2VkIGJyb3dzZXJzICovLyogSGlkZSBhbGwgc2Nyb2xsYmFycyBmb3IgZmlyZWZveCA+IDYzICovXG59XG5cbi8qIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9zY3JvbGxiYXItd2lkdGgjQnJvd3Nlcl9Db21wYXRpYmlsaXR5ICovXG5cbjpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFyKTo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgd2lkdGg6IDBweDtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblxuLyogRm9yIG5vdywgbXVzdCBzZXQgdGhlIHRhZyAnbGF5b3V0LmNzcy5zY3JvbGxiYXItd2lkdGguZW5hYmxlZCcgdG8gJ3RydWUnIGluICdhYm91dDpjb25maWcnICovXG5cbjpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFyKSxcbiAgOmdsb2JhbCguaGlkZS1zY3JvbGxiYXIpOjpiZWZvcmUsXG4gIDpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFyKTo6YWZ0ZXIge1xuICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTtcbn1cblxuOmdsb2JhbCguaGlkZS1zY3JvbGxiYXJzKSwgOmdsb2JhbCguaGlkZS1zY3JvbGxiYXJzKSA6Z2xvYmFsKCopIHsvKiBIaWRlIGFsbCBzY3JvbGxiYXJzIGZvciB3ZWJraXQgYmFzZWQgYnJvd3NlcnMgKi8vKiBIaWRlIGFsbCBzY3JvbGxiYXJzIGZvciBmaXJlZm94ID4gNjMgKi9cbn1cblxuLyogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3Njcm9sbGJhci13aWR0aCNCcm93c2VyX0NvbXBhdGliaWxpdHkgKi9cblxuOmdsb2JhbCguaGlkZS1zY3JvbGxiYXJzKTo6LXdlYmtpdC1zY3JvbGxiYXIsIDpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFycykgOmdsb2JhbCgqKTo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgd2lkdGg6IDBweDtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblxuLyogRm9yIG5vdywgbXVzdCBzZXQgdGhlIHRhZyAnbGF5b3V0LmNzcy5zY3JvbGxiYXItd2lkdGguZW5hYmxlZCcgdG8gJ3RydWUnIGluICdhYm91dDpjb25maWcnICovXG5cbjpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFycyksXG4gIDpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFycyk6OmJlZm9yZSxcbiAgOmdsb2JhbCguaGlkZS1zY3JvbGxiYXJzKTo6YWZ0ZXIsXG4gIDpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFycykgOmdsb2JhbCgqKSxcbiAgOmdsb2JhbCguaGlkZS1zY3JvbGxiYXJzKSA6Z2xvYmFsKCopOjpiZWZvcmUsXG4gIDpnbG9iYWwoLmhpZGUtc2Nyb2xsYmFycykgOmdsb2JhbCgqKTo6YWZ0ZXIge1xuICAgIHNjcm9sbGJhci13aWR0aDogbm9uZTtcbn1cblxuLmVuZ2luZS1hbGVydCB7XG4gICAgcG9zaXRpb246IHN0YXRpYztcbiAgICB6LWluZGV4OiAxMDAwMDA7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMTBweCA3NXB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNiZjQxMzA7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgZm9udC1zaXplOiAxNnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogMnMgZWFzZS1pbi1vdXQgYmxpbmsgaW5maW5pdGU7XG4gICAgICAgICAgICBhbmltYXRpb246IDJzIGVhc2UtaW4tb3V0IGJsaW5rIGluZmluaXRlO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbi5lbmdpbmUtYWxlcnQgYSB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgfVxuXG5ALXdlYmtpdC1rZXlmcmFtZXMgYmxpbmsge1xuICAgIDAlIHtcbiAgICAgIG9wYWNpdHk6IDAuNDtcbiAgICB9XG5cbiAgICA1MCUge1xuICAgICAgb3BhY2l0eTogMC45O1xuICAgIH1cblxuICAgIDEwMCUge1xuICAgICAgb3BhY2l0eTogMC40O1xuICAgIH1cbiAgfVxuXG5Aa2V5ZnJhbWVzIGJsaW5rIHtcbiAgICAwJSB7XG4gICAgICBvcGFjaXR5OiAwLjQ7XG4gICAgfVxuXG4gICAgNTAlIHtcbiAgICAgIG9wYWNpdHk6IDAuOTtcbiAgICB9XG5cbiAgICAxMDAlIHtcbiAgICAgIG9wYWNpdHk6IDAuNDtcbiAgICB9XG4gIH1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDQwMHB4KSB7XG4gICAgOmdsb2JhbChib2R5KSxcbiAgICAuY29udGFpbmVyLFxuICAgIC5tYWluLXdyYXBwZXIge1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cblxuICAgIDpnbG9iYWwoYm9keSkgey8qIEhpZGUgYWxsIHNjcm9sbGJhcnMgZm9yIHdlYmtpdCBiYXNlZCBicm93c2VycyAqLy8qIEhpZGUgYWxsIHNjcm9sbGJhcnMgZm9yIGZpcmVmb3ggPiA2MyAqL1xuICAgIH1cblxuICAgIC8qIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9zY3JvbGxiYXItd2lkdGgjQnJvd3Nlcl9Db21wYXRpYmlsaXR5ICovXG5cbiAgICA6Z2xvYmFsKGJvZHkpOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgICB3aWR0aDogMHB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIH1cblxuICAgIC8qIEZvciBub3csIG11c3Qgc2V0IHRoZSB0YWcgJ2xheW91dC5jc3Muc2Nyb2xsYmFyLXdpZHRoLmVuYWJsZWQnIHRvICd0cnVlJyBpbiAnYWJvdXQ6Y29uZmlnJyAqL1xuXG4gICAgOmdsb2JhbChib2R5KSxcbiAgOmdsb2JhbChib2R5KTo6YmVmb3JlLFxuICA6Z2xvYmFsKGJvZHkpOjphZnRlciB7XG4gICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xuICAgIH1cbiAgfVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNDAxcHgpIHtcbiAgICAuY29udGFpbmVyIHtcbiAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGhlaWdodDogMTAwdmg7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XG4gICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL3dvb2QuanBnKTtcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIH1cblxuICAgIC5tYWluLXdyYXBwZXIge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIH1cbiAgfVxuXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW01dlpHVmZiVzlrZFd4bGN5OUFiV0Z0WW1FdmMzUjViR1Z6TDJOdmJHOXljeTV3WTNOeklpd2libTlrWlY5dGIyUjFiR1Z6TDBCdFlXMWlZUzl6ZEhsc1pYTXZkR2hsYldVdWNHTnpjeUlzSW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZjM1I1YkdVdWNHTnpjeUlzSW5CaFkydGhaMlZ6TDNCdmN5OXphVzExYkdGMGIzSXZkbWxsZHk5d2IzTXZWM0poY0hCbGNpNW9kRzFzSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVhWQ1FTeFJRVUZST3p0QlEyaENVaXh0UWtGQmJVSTdPMEZCVTI1Q0xIRkNRVUZ4UWpzN1FVRk5ja0lzYzBKQlFYTkNPenRCUVUxMFFpeDVRa0ZCZVVJN08wRkJaWHBDTEcxQ1FVRnRRanM3UVVNelEyNUNMSE5DUVVGelFqczdRVUZyUW5SQ0xIRkNRVUZ4UWpzN1FVRkhia0lzTUVKQmJrSkJMR3RFUVVGclJDeERRVU5zUkN4NVEwRkJlVU03UVVGclFteENPenRCUVdoQ2RrSXNNa1pCUVRKR096dEJRVU16Ump0SlFVTkZMR0ZCUVdFN1NVRkRZaXhWUVVGVk8wbEJRMVlzZFVKQlFYVkNPMEZCUTNwQ096dEJRVTVCTEN0R1FVRXJSanM3UVVGUkwwWTdPenRKUVVkRkxIRkNRVUZ4UWp0QlFVTjJRanM3UVVGWFJTeHBSVUY2UWtZc2EwUkJRV3RFTEVOQlEyeEVMSGxEUVVGNVF6dEJRWGRDYUVJN08wRkJkRUo2UWl3eVJrRkJNa1k3TzBGQlF6TkdPMGxCUTBVc1lVRkJZVHRKUVVOaUxGVkJRVlU3U1VGRFZpeDFRa0ZCZFVJN1FVRkRla0k3TzBGQlRrRXNLMFpCUVN0R096dEJRVkV2UmpzN096czdPMGxCUjBVc2NVSkJRWEZDTzBGQlEzWkNPenRCUTJsQ1FUdEpRVU5GTEdkQ1FVRm5RanRKUVVOb1FpeGxRVUZsTzBsQlEyWXNWMEZCVnp0SlFVTllMR3RDUVVGclFqdEpRVU5zUWl4NVFrRkJlVUk3U1VGRGVrSXNWMEZCVnp0SlFVTllMR1ZCUVdVN1NVRkRaaXhyUWtGQmEwSTdTVUZEYkVJc1owUkJRWGRETzFsQlFYaERMSGREUVVGM1F6dEpRVU40UXl4dlFrRkJiMEk3UlVGUGRFSTdPMEZCVEVVN1RVRkRSU3d3UWtGQk1FSTdUVUZETVVJc1YwRkJWenROUVVOWUxHOUNRVUZ2UWp0SlFVTjBRanM3UVVGSFJqdEpRVU5GTzAxQlEwVXNXVUZCV1R0SlFVTmtPenRKUVVWQk8wMUJRMFVzV1VGQldUdEpRVU5rT3p0SlFVVkJPMDFCUTBVc1dVRkJXVHRKUVVOa08wVkJRMFk3TzBGQldrRTdTVUZEUlR0TlFVTkZMRmxCUVZrN1NVRkRaRHM3U1VGRlFUdE5RVU5GTEZsQlFWazdTVUZEWkRzN1NVRkZRVHROUVVORkxGbEJRVms3U1VGRFpEdEZRVU5HT3p0QlFUVkVRVHRKUVVORk96czdUVUZIUlN4WlFVRlpPMGxCUTJRN08wbEJSMFVzWlVSV1NpeHJSRUZCYTBRc1EwRkRiRVFzZVVOQlFYbERPMGxEVTJRN08wbEVVRE5DTERKR1FVRXlSanM3U1VGRE0wWTdTVUZEUlN4aFFVRmhPMGxCUTJJc1ZVRkJWVHRKUVVOV0xIVkNRVUYxUWp0SlFVTjZRanM3U1VGT1FTd3JSa0ZCSzBZN08wbEJVUzlHT3pzN1NVRkhSU3h4UWtGQmNVSTdTVUZEZGtJN1JVTkdRVHM3UVVGRlFUdEpRVU5GTzAxQlEwVXNiMEpCUVdFN1RVRkJZaXhoUVVGaE8wMUJRMklzWVVGQllUdE5RVU5pTEZkQlFWYzdUVUZEV0N4NVFrRkJiVUk3WTBGQmJrSXNiVUpCUVcxQ08wMUJRMjVDTEhkQ1FVRjFRanRqUVVGMlFpeDFRa0ZCZFVJN1RVRkRka0lzZDBOQlFYZERPMDFCUTNoRExITkNRVUZ6UWp0TlFVTjBRaXhuUWtGQlowSTdTVUZEYkVJN08wbEJSVUU3VFVGRFJTeHJRa0ZCYTBJN1NVRkRjRUk3UlVGRFJpSXNJbVpwYkdVaU9pSndZV05yWVdkbGN5OXdiM012YzJsdGRXeGhkRzl5TDNacFpYY3ZjRzl6TDFkeVlYQndaWEl1YUhSdGJDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaVJpYkdGamF6b2dJekF3TUR0Y2JseHVKSGRvYVhSbE9pQWpabVptTzF4dUpITmxZWE5vWld4c09pQWpaakZtTVdZeE8xeHVYRzRrYzNSdmJtVXRaM0psWlc0NklDTTBabUl6TkRFN1hHNGtjM1J2Ym1VdFozSmxaVzR0WkdGeWF6b2dJekUxTXpVeU1qdGNiaVJ6ZEc5dVpTMW5jbVZsYmkxc2FXZG9kRG9nSTJFMlpHWTRZenRjYmx4dUpHZHlZWGt0WkdGeWEyVnlPaUFqTXpVek5UTTFPMXh1SkdkeVlYa3RaR0Z5YXpvZ0l6UXlOVGsyTXp0Y2JpUm5jbUY1T2lBak4yVTNaVGRsTzF4dUpHZHlZWGt0YkdsbmFIUTZJQ05pTldJMVlqVTdYRzRrWjNKaGVTMXNhV2RvZEdWeU9pQWpaVE5sTm1VM08xeHVKR2R5WVhrdGJHbG5hSFJsYzNRNklDTm1NV1l5WmpNN1hHNWNiaVJ6YVd4MlpYSTZJQ05pWVdJNVlqazdYRzRrYzJsc2RtVnlMV3hwWjJoME9pQWpaR05rWTJSak8xeHVYRzRrY21Wa09pQWpabVl4WVRGaE8xeHVKSEpsWkMxa1lYSnJPaUFqWkRVd01EQXdPMXh1SkhKbFpDMXNhV2RvZERvZ0kyVTROV0kxWWp0Y2JseHVMeW9nTFMwdElDb3ZYRzVjYmlSaWJIVmxPaUFqTWpFNU5tWXpPMXh1SkdKc2RXVXRaR0Z5YXpvZ0l6RTFOalZqTUR0Y2JseHVKR0pzZFdVdFozSmhlUzFzYVdkb2REb2dJemt3WVRSaFpUdGNiaVJpYkhWbExXZHlZWGs2SUNNMk1EZGtPR0k3WEc0a1lteDFaUzFuY21GNUxXUmhjbXM2SUNNME5UVmhOalE3WEc1Y2JpUm5jbVZsYmpvZ0l6UmxZbVl4WVR0Y2JpUm5jbVZoYmkxc2FXZG9kRG9nSXpSallXWTFNRHRjYmlSbmNtVmxiaTFrWVhKck9pQWpNMlJoTVRCbU8xeHVKR2R5WldWdUxYQmhlVzFsYm5RNklDTTBNams0TkRFN1hHNWNiaVJ3ZFhKd2JHVTZJQ05oWWpRM1ltTTdYRzRrY0hWeWNHeGxMV1JoY21zNklDTTNPVEJsT0dJN1hHNGtjSFZ5Y0d4bExXeHBaMmgwT2lBalpHWTNPR1ZtTzF4dVhHNGtkR1ZoYkRvZ0l6RTVaVE5pTVR0Y2JpUjBaV0ZzTFdSaGNtczZJQ013TUdGbU9UZzdYRzVjYmlSNVpXeHNiM2M2SUNObU9XRTRNalU3WEc0a2VXVnNiRzkzTFdSaGNtczZJQ05tTlRkbU1UYzdYRzRpTENKQWFXMXdiM0owSUNkamIyeHZjbk11Y0dOemN5YzdYRzVjYmlSa1pXWmhkV3gwTFhSbGVIUXRZMjlzYjNJNklDUm5jbUY1TFdSaGNtdGxjanRjYmlSa1pXWmhkV3gwTFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmx4dUpHRndjQzFpWnkxamIyeHZjam9nSkdkeVlYa3RiR2xuYUhSbGNqdGNibHh1THlvcUlGSnZkeUJqYjIxd2IyNWxiblFnS2k5Y2JpUnliM2N0Y0dGa1pHbHVaem9nTVRKd2VDQXhOWEI0TzF4dUpISnZkeTEwYjNBdGFHVnBaMmgwT2lCaGRYUnZPMXh1SkhKdmR5MWliM0prWlhJdFkyOXNiM0k2SUNSbmNtRjVMV3hwWjJoMFpYSTdYRzRrY205M0xXSm5MV052Ykc5eU9pQWtkMmhwZEdVN1hHNGtjbTkzTFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXRsY2p0Y2JpUnliM2N0YzJWamIyNWtZWEo1TFdOdmJHOXlPaUFrWjNKaGVUdGNiaVJ5YjNjdFptOXVkQzF6YVhwbE9pQXhOSEI0TzF4dVhHNHZLaW9nU1c1d2RYUWdZMjl0Y0c5dVpXNTBJQ292WEc0a2FXNXdkWFF0WW05eVpHVnlMV052Ykc5eU9pQWtaM0poZVMxc2FXZG9kR1Z5TzF4dUpHbHVjSFYwTFdadlkzVnpMV0p2Y21SbGNpMWpiMnh2Y2pvZ0pITjBiMjVsTFdkeVpXVnVPMXh1SkdsdWNIVjBMV2x1ZG1Gc2FXUXRZbTl5WkdWeUxXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR2x1Y0hWMExXVnljbTl5TFdOdmJHOXlPaUFrY21Wa0xXeHBaMmgwTzF4dVhHNHZLaW9nUkdsaGJHOW5JR052YlhCdmJtVnVkQ0FxTDF4dUpHUnBZV3h2WnkxdVpXZGhkR2wyWlMxamIyeHZjam9nSkhKbFpDMXNhV2RvZER0Y2JpUmthV0ZzYjJjdGNHOXphWFJwZG1VdFkyOXNiM0k2SUNSemRHOXVaUzFuY21WbGJqdGNiaVJrYVdGc2IyY3RZMjl1Wm1seWJXRjBhVzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21GNUxXUmhjbXM3WEc0a1pHbGhiRzluTFdOdmJtWnBjbTFoZEdsdmJpMTBaWGgwTFdOdmJHOXlPaUFrZDJocGRHVTdYRzVjYmk4cUtpQkJaRzFwYmt4dlkyc2dZMjl0Y0c5dVpXNTBJQ292WEc0a1lXUnRhVzVzYjJOckxXNWxaMkYwYVhabExXTnZiRzl5T2lBa2NtVmtMV3hwWjJoME8xeHVKR0ZrYldsdWJHOWpheTEwWlhoMExXTnZiRzl5T2lBa1ozSmhlUzFrWVhKck8xeHVKR0ZrYldsdWJHOWpheTFpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWmpCbU1HWXdPMXh1WEc0a1luVjBkRzl1TFhCeWFXMWhjbmt0WTI5c2IzSTZJQ1JuY21WbGJqdGNiaVJpZFhSMGIyNHRkR1Y0ZEMxamIyeHZjam9nSkhkb2FYUmxPMXh1WEc0a2MzZHBkR05vTFhWdVkyaGxZMnRsWkMxaVp6b2dKSE5wYkhabGNqdGNiaVJ6ZDJsMFkyZ3RkVzVqYUdWamEyVmtMV052Ykc5eU9pQWtjMlZoYzJobGJHdzdYRzRrYzNkcGRHTm9MV05vWldOclpXUXRZbWM2SUNSemRHOXVaUzFuY21WbGJpMXNhV2RvZER0Y2JpUnpkMmwwWTJndFkyaGxZMnRsWkMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhOM2FYUmphQzFrYVhOaFlteGxaQzFpWnpvZ0pITnBiSFpsY2kxc2FXZG9kRHRjYmlSemQybDBZMmd0WkdsellXSnNaV1F0WTI5c2IzSTZJQ1J6YVd4MlpYSTdYRzVjYmk4cUlGUmhZbk1nWTI5dGNHOXVaVzUwSUNvdlhHNGtkR0ZpTFc1aGRtbG5ZWFJwYjI0dFltYzZJQ05tTW1ZeVpqSTdYRzRrZEdGaUxXeGhZbVZzTFdOdmJHOXlPaUFqTmpVM056ZG1PMXh1SkhSaFlpMXBkR1Z0TFdadmJuUXRjMmw2WlRvZ01UTndlRHRjYmlSMFlXSXRiR2x1WlMxamIyeHZjam9nSkdkeVpXVnVPMXh1SkhSaFlpMW9aV2xuYUhRNklEUXdjSGc3WEc0aUxDSXZLaUJ6ZEhsc1pXeHBiblF0WkdsellXSnNaU0FxTDF4dUpXaHBaR1V0YzJOeWIyeHNZbUZ5SUh0Y2JpQWdMeW9nU0dsa1pTQmhiR3dnYzJOeWIyeHNZbUZ5Y3lCbWIzSWdkMlZpYTJsMElHSmhjMlZrSUdKeWIzZHpaWEp6SUNvdlhHNGdJQzhxSUVocFpHVWdZV3hzSUhOamNtOXNiR0poY25NZ1ptOXlJR1pwY21WbWIzZ2dQaUEyTXlBcUwxeHVJQ0F2S2lCR2IzSWdibTkzTENCdGRYTjBJSE5sZENCMGFHVWdkR0ZuSUNkc1lYbHZkWFF1WTNOekxuTmpjbTlzYkdKaGNpMTNhV1IwYUM1bGJtRmliR1ZrSnlCMGJ5QW5kSEoxWlNjZ2FXNGdKMkZpYjNWME9tTnZibVpwWnljZ0tpOWNiaUFnTHlvZ2FIUjBjSE02THk5a1pYWmxiRzl3WlhJdWJXOTZhV3hzWVM1dmNtY3ZaVzR0VlZNdlpHOWpjeTlYWldJdlExTlRMM05qY205c2JHSmhjaTEzYVdSMGFDTkNjbTkzYzJWeVgwTnZiWEJoZEdsaWFXeHBkSGtnS2k5Y2JpQWdKam82TFhkbFltdHBkQzF6WTNKdmJHeGlZWElnZTF4dUlDQWdJR1JwYzNCc1lYazZJRzV2Ym1VN1hHNGdJQ0FnZDJsa2RHZzZJREJ3ZUR0Y2JpQWdJQ0JpWVdOclozSnZkVzVrT2lCMGNtRnVjM0JoY21WdWREdGNiaUFnZlZ4dVhHNGdJQ1lzWEc0Z0lDWTZPbUpsWm05eVpTeGNiaUFnSmpvNllXWjBaWElnZTF4dUlDQWdJSE5qY205c2JHSmhjaTEzYVdSMGFEb2dibTl1WlR0Y2JpQWdmVnh1ZlZ4dUx5b2djM1I1YkdWc2FXNTBMV1Z1WVdKc1pTQXFMMXh1WEc0NloyeHZZbUZzS0M1b2FXUmxMWE5qY205c2JHSmhjaWtnZTF4dUlDQkFaWGgwWlc1a0lDVm9hV1JsTFhOamNtOXNiR0poY2p0Y2JuMWNibHh1T21kc2IySmhiQ2d1YUdsa1pTMXpZM0p2Ykd4aVlYSnpLU0I3WEc0Z0lDWXNYRzRnSURwbmJHOWlZV3dvS2lrZ2UxeHVJQ0FnSUVCbGVIUmxibVFnSldocFpHVXRjMk55YjJ4c1ltRnlPMXh1SUNCOVhHNTlYRzRpTENKY2JpQWdRR2x0Y0c5eWRDQW5RRzFoYldKaEwzTjBlV3hsY3k5amIyeHZjbk11Y0dOemN5YzdYRzRnSUVCcGJYQnZjblFnSnk0dmMzUjViR1V1Y0dOemN5YzdYRzVjYmlBZ1FHMWxaR2xoSUNodFlYZ3RkMmxrZEdnNklEUXdNSEI0S1NCN1hHNGdJQ0FnT21kc2IySmhiQ2hpYjJSNUtTeGNiaUFnSUNBdVkyOXVkR0ZwYm1WeUxGeHVJQ0FnSUM1dFlXbHVMWGR5WVhCd1pYSWdlMXh1SUNBZ0lDQWdhR1ZwWjJoME9pQXhNREFsTzF4dUlDQWdJSDFjYmx4dUlDQWdJRHBuYkc5aVlXd29ZbTlrZVNrZ2UxeHVJQ0FnSUNBZ1FHVjRkR1Z1WkNBbGFHbGtaUzF6WTNKdmJHeGlZWEk3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnUUcxbFpHbGhJQ2h0YVc0dGQybGtkR2c2SURRd01YQjRLU0I3WEc0Z0lDQWdMbU52Ym5SaGFXNWxjaUI3WEc0Z0lDQWdJQ0JrYVhOd2JHRjVPaUJtYkdWNE8xeHVJQ0FnSUNBZ2FHVnBaMmgwT2lBeE1EQjJhRHRjYmlBZ0lDQWdJSGRwWkhSb09pQXhNREFsTzF4dUlDQWdJQ0FnWVd4cFoyNHRhWFJsYlhNNklHTmxiblJsY2p0Y2JpQWdJQ0FnSUdwMWMzUnBabmt0WTI5dWRHVnVkRG9nWTJWdWRHVnlPMXh1SUNBZ0lDQWdZbUZqYTJkeWIzVnVaQzFwYldGblpUb2dkWEpzS0M0dllYTnpaWFJ6TDNkdmIyUXVhbkJuS1R0Y2JpQWdJQ0FnSUdKaFkydG5jbTkxYm1RdGMybDZaVG9nWTI5MlpYSTdYRzRnSUNBZ0lDQnZkbVZ5Wm14dmR6b2dhR2xrWkdWdU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUM1dFlXbHVMWGR5WVhCd1pYSWdlMXh1SUNBZ0lDQWdjRzl6YVhScGIyNDZJSEpsYkdGMGFYWmxPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzVsYm1kcGJtVXRZV3hsY25RZ2UxeHVJQ0FnSUhCdmMybDBhVzl1T2lCemRHRjBhV003WEc0Z0lDQWdlaTFwYm1SbGVEb2dNVEF3TURBd08xeHVJQ0FnSUhkcFpIUm9PaUF4TURBbE8xeHVJQ0FnSUhCaFpHUnBibWM2SURFd2NIZ2dOelZ3ZUR0Y2JpQWdJQ0JpWVdOclozSnZkVzVrTFdOdmJHOXlPaUFqWW1ZME1UTXdPMXh1SUNBZ0lHTnZiRzl5T2lBalptWm1PMXh1SUNBZ0lHWnZiblF0YzJsNlpUb2dNVFp3ZUR0Y2JpQWdJQ0IwWlhoMExXRnNhV2R1T2lCalpXNTBaWEk3WEc0Z0lDQWdZVzVwYldGMGFXOXVPaUF5Y3lCbFlYTmxMV2x1TFc5MWRDQmliR2x1YXlCcGJtWnBibWwwWlR0Y2JpQWdJQ0J3YjJsdWRHVnlMV1YyWlc1MGN6b2dibTl1WlR0Y2JseHVJQ0FnSUdFZ2UxeHVJQ0FnSUNBZ2RHVjRkQzFrWldOdmNtRjBhVzl1T2lCMWJtUmxjbXhwYm1VN1hHNGdJQ0FnSUNCamIyeHZjam9nSTJabVpqdGNiaUFnSUNBZ0lIQnZhVzUwWlhJdFpYWmxiblJ6T2lCaGRYUnZPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJRUJyWlhsbWNtRnRaWE1nWW14cGJtc2dlMXh1SUNBZ0lEQWxJSHRjYmlBZ0lDQWdJRzl3WVdOcGRIazZJREF1TkR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0ExTUNVZ2UxeHVJQ0FnSUNBZ2IzQmhZMmwwZVRvZ01DNDVPMXh1SUNBZ0lIMWNibHh1SUNBZ0lERXdNQ1VnZTF4dUlDQWdJQ0FnYjNCaFkybDBlVG9nTUM0ME8xeHVJQ0FnSUgxY2JpQWdmVnh1SWwxOSAqLzwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0VRLGVBQWUsQUFBRSxDQUFDLEFBQzFCLENBQUMsQUFJTyxlQUFlLEFBQUMsbUJBQW1CLEFBQUMsQ0FBQyxBQUN6QyxPQUFPLENBQUUsSUFBSSxDQUNiLEtBQUssQ0FBRSxHQUFHLENBQ1YsVUFBVSxDQUFFLFdBQVcsQUFDM0IsQ0FBQyxBQUlPLGVBQWUsQUFBQyxDQUNkLGVBQWUsQUFBQyxRQUFRLENBQ3hCLGVBQWUsQUFBQyxPQUFPLEFBQUMsQ0FBQyxBQUMvQixlQUFlLENBQUUsSUFBSSxBQUN6QixDQUFDLEFBRU8sZ0JBQWdCLEFBQUMsQ0FBVSxnQkFBZ0IsQUFBQyxDQUFDLEFBQVEsQ0FBQyxBQUFFLENBQUMsQUFDakUsQ0FBQyxBQUlPLGdCQUFnQixBQUFDLG1CQUFtQixDQUFVLGdCQUFnQixBQUFDLENBQUMsQUFBUSxDQUFDLEFBQUMsbUJB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 */';
    append(document.head, style);
  }

  function create_main_fragment$i(component, ctx) {
    var text;

    function select_block_type(ctx) {
      if (ENGINE === 'webkit') return create_if_block$4;
      return create_else_block$1;
    }

    var current_block_type = select_block_type();
    var if_block = current_block_type(component, ctx);

    var controlpanel = new ControlPanel({
      root: component.root,
      store: component.store,
    });

    component.refs.controlPanel = controlpanel;

    return {
      c: function create() {
        if_block.c();
        text = createText('\n\n');
        controlpanel._fragment.c();
      },

      m: function mount(target, anchor) {
        if_block.m(target, anchor);
        insert(target, text, anchor);
        controlpanel._mount(target, anchor);
      },

      p: function update(changed, ctx) {
        if (current_block_type !== (current_block_type = select_block_type())) {
          if_block.d(1);
          if_block = current_block_type(component, ctx);
          if_block.c();
          if_block.m(text.parentNode, text);
        }
      },

      d: function destroy(detach) {
        if_block.d(detach);
        if (detach) {
          detachNode(text);
        }

        controlpanel.destroy(detach);
        if (component.refs.controlPanel === controlpanel)
          component.refs.controlPanel = null;
      },
    };
  }

  // (10:0) {:else}
  function create_else_block$1(component, ctx) {
    var div0, text0, strong, a, text2, text3, div1;

    return {
      c: function create() {
        div0 = createElement('div');
        text0 = createText(
          'Para um rápido desenvolvimento mais fiel ao ambiente do POS, é recomendado o uso do ',
        );
        strong = createElement('strong');
        a = createElement('a');
        a.textContent = 'Chrome';
        text2 = createText(' como navegador.');
        text3 = createText('\n  ');
        div1 = createElement('div');
        a.href = 'https://www.google.com/chrome/';
        a.target = '_blank';
        a.className = 'svelte-6ehx64';
        addLoc(a, file$g, 11, 96, 314);
        addLoc(strong, file$g, 11, 88, 306);
        div0.className = 'engine-alert svelte-6ehx64';
        addLoc(div0, file$g, 10, 2, 191);
        div1.id = 'app-root';
        addLoc(div1, file$g, 13, 2, 418);
      },

      m: function mount(target, anchor) {
        insert(target, div0, anchor);
        append(div0, text0);
        append(div0, strong);
        append(strong, a);
        append(div0, text2);
        insert(target, text3, anchor);
        insert(target, div1, anchor);
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div0);
          detachNode(text3);
          detachNode(div1);
        }
      },
    };
  }

  // (1:0) {#if ENGINE === 'webkit'}
  function create_if_block$4(component, ctx) {
    var div1, div0, text;

    var launcher = new Launcher({
      root: component.root,
      store: component.store,
    });

    var pos = new POS({
      root: component.root,
      store: component.store,
      slots: { default: createFragment() },
    });

    component.refs.POS = pos;

    var card = new Card({
      root: component.root,
      store: component.store,
    });

    component.refs.card = card;

    return {
      c: function create() {
        div1 = createElement('div');
        div0 = createElement('div');
        launcher._fragment.c();
        pos._fragment.c();
        text = createText('\n      ');
        card._fragment.c();
        div0.className = 'main-wrapper svelte-6ehx64';
        addLoc(div0, file$g, 2, 4, 56);
        div1.className = 'container svelte-6ehx64';
        addLoc(div1, file$g, 1, 2, 28);
      },

      m: function mount(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        launcher._mount(pos._slotted.default, null);
        pos._mount(div0, null);
        append(div0, text);
        card._mount(div0, null);
      },

      d: function destroy(detach) {
        if (detach) {
          detachNode(div1);
        }

        launcher.destroy();
        pos.destroy();
        if (component.refs.POS === pos) component.refs.POS = null;
        card.destroy();
        if (component.refs.card === card) component.refs.card = null;
      },
    };
  }

  function Wrapper(options) {
    this._debugName = '<Wrapper>';
    if (!options || (!options.target && !options.root)) {
      throw new Error("'target' is a required option");
    }

    init(this, options);
    this.refs = {};
    this._state = assign$1({}, options.data);
    this._intro = true;

    if (!document.getElementById('svelte-6ehx64-style')) add_css$c();

    this._fragment = create_main_fragment$i(this, this._state);

    this.root._oncreate.push(() => {
      oncreate$b.call(this);
      this.fire('update', {
        changed: assignTrue({}, this._state),
        current: this._state,
      });
    });

    if (options.target) {
      if (options.hydrate)
        throw new Error(
          'options.hydrate only works if the component was compiled with the `hydratable: true` option',
        );
      this._fragment.c();
      this._mount(options.target, options.anchor);

      flush(this);
    }
  }

  assign$1(Wrapper.prototype, protoDev);

  Wrapper.prototype._checkReadOnly = function _checkReadOnly(newState) {};

  var View = extend({}, EventTarget());
  var instance;
  var panelsToAdd = [];

  var updatePanels = function updatePanels() {
    var _instance$refs$contro = instance.refs.controlPanel.get(),
      panels = _instance$refs$contro.panels;

    instance.refs.controlPanel.set({
      panels: [].concat(panels, panelsToAdd),
    });
    panelsToAdd = [];
  };

  View.addPanel = function(panel) {
    panelsToAdd.push(panel);

    if (instance) {
      updatePanels();
    }
  };

  View.show = function() {
    if (!instance) {
      instance = new Wrapper({
        target: document.body,
      });

      if (panelsToAdd.length) {
        updatePanels();
      }
    }

    return instance;
  };

  View.getInstance = function() {
    return instance;
  };

  /**
   * This file initializes every aspect of the simulator (logic and view).
   * */
  /** Mamba Web simulator global object */

  window.MambaWeb = {
    System: System,
    Registry: Registry,
    HardwareManager: HardwareManager,
    DriverManager: DriverManager,
    AppManager: AppManager,
    View: View,
  };

  new App({ target: document.getElementById('root') });
});

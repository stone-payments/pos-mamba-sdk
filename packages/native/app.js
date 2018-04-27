module.exports = function(n) {
    var o = {};
    function t(e) {
        if (o[e]) return o[e].exports;
        var r = o[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return n[e].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
    }
    return t.m = n, t.c = o, t.d = function(n, o, e) {
        t.o(n, o) || Object.defineProperty(n, o, {
            configurable: !1,
            enumerable: !0,
            get: e
        });
    }, t.r = function(n) {
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
    }, t.n = function(n) {
        var o = n && n.__esModule ? function() {
            return n.default;
        } : function() {
            return n;
        };
        return t.d(o, "a", o), o;
    }, t.o = function(n, o) {
        return Object.prototype.hasOwnProperty.call(n, o);
    }, t.p = "", t(t.s = 0);
}([ function(n, o, t) {
    "use strict";
    t.r(o);
    var e = {
        mount: function() {},
        open: function() {},
        close: function() {}
    }, r = window.App;
    if (!r) throw new Error("[@mamba/native] 'App' module not found");
    !function(n) {
        function o() {
            setTimeout(function() {
                n.doClose();
            }, 100);
        }
        n.close = function(n) {
            void 0 === n && (n = !1), n ? e.open(function(n) {
                n === e.positiveAction && o();
            }) : o();
        };
    }(r);
    o.default = r;
} ]);
module.exports = function(r) {
    var n = {};
    function e(t) {
        if (n[t]) return n[t].exports;
        var o = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return r[t].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
    }
    return e.m = r, e.c = n, e.d = function(r, n, t) {
        e.o(r, n) || Object.defineProperty(r, n, {
            configurable: !1,
            enumerable: !0,
            get: t
        });
    }, e.r = function(r) {
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
    }, e.n = function(r) {
        var n = r && r.__esModule ? function() {
            return r.default;
        } : function() {
            return r;
        };
        return e.d(n, "a", n), n;
    }, e.o = function(r, n) {
        return Object.prototype.hasOwnProperty.call(r, n);
    }, e.p = "", e(e.s = 0);
}([ function(r, n, e) {
    "use strict";
    e.r(n);
    var t = window.Printer;
    if (!t) throw new Error("[@mamba/native] 'Printer' module not found");
    !function(r) {
        r.currentPrinterDoneCallback = void 0, r.printerDoneCallback = function() {
            try {
                r.printerDone.disconnect(this, r.printerDoneCallback);
            } catch (r) {
                console.err(r);
            }
            var n;
            r.failedPrinting() && (n = new Error("Failed to print")), "function" == typeof r.currentPrinterDoneCallback && r.currentPrinterDoneCallback(n), 
            r.currentPrinterDoneCallback = void 0;
        }, r.print = function(n, e, t) {
            void 0 === e && (e = {}), r.currentPrinterDoneCallback = t, r.printerDone.connect(this, r.printerDoneCallback), 
            r.doPrint(n, e);
        };
    }(t);
    n.default = t;
} ]);
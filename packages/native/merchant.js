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
    var t, o = window.MbMerchant;
    if (!o) throw new Error("[@mamba/native] 'Merchant' module not found");
    (t = o).currentPrinterDoneCallback = void 0, t.printerDoneCallback = function() {
        try {
            t.printerDone.disconnect(this, t.printerDoneCallback);
        } catch (r) {
            console.err(r);
        }
        var r;
        t.failedPrinting() && (r = new Error("Failed to print")), "function" == typeof t.currentPrinterDoneCallback && t.currentPrinterDoneCallback(r), 
        t.currentPrinterDoneCallback = void 0;
    }, t.print = function(r, n, e) {
        void 0 === n && (n = {}), t.currentPrinterDoneCallback = e, t.printerDone.connect(this, t.printerDoneCallback), 
        t.doPrint(r, n);
    };
    n.default = o;
} ]);
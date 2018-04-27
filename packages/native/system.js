module.exports = function(e) {
    var t = {};
    function r(n) {
        if (t[n]) return t[n].exports;
        var o = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
    }
    return r.m = e, r.c = t, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            configurable: !1,
            enumerable: !0,
            get: n
        });
    }, r.r = function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return r.d(t, "a", t), t;
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 0);
}([ function(e, t, r) {
    "use strict";
    r.r(t);
    var n = window.System;
    if (!n) throw new Error("[@mamba/native] 'System' module not found");
    !function(e) {
        e.Tone = Object.freeze({
            TONE1: "TONE1",
            TONE2: "TONE2",
            TONE3: "TONE3",
            TONE4: "TONE4",
            TONE5: "TONE5",
            TONE6: "TONE6",
            TONE7: "TONE7"
        }), e.PowerSupply = Object.freeze({
            ADAPTER: "ADAPTER",
            BATTERY: "BATTERY",
            USB: "USB"
        }), e.BatteryStatus = Object.freeze({
            CHECK_NOT_SUPPORTED: "CHECK_NOT_SUPPORTED",
            IN_CHARGE: "IN_CHARGE",
            CHARGE_COMPLETE: "CHARGE_COMPLETE",
            DISCHARGE: "DISCHARGE",
            ABSENT: "ABSENT"
        });
    }(n);
    t.default = n;
} ]);
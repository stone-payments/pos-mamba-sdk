module.exports = function(e) {
    var n = {};
    function t(o) {
        if (n[o]) return n[o].exports;
        var r = n[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
    }
    return t.m = e, t.c = n, t.d = function(e, n, o) {
        t.o(e, n) || Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: o
        });
    }, t.r = function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default;
        } : function() {
            return e;
        };
        return t.d(n, "a", n), n;
    }, t.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n);
    }, t.p = "", t(t.s = 0);
}([ function(e, n, t) {
    "use strict";
    t.r(n);
    var o = window.Payment;
    if (!o) throw new Error("[@mamba/native] 'Payment' module not found");
    !function(e) {
        e.currentPaymentDoneCallback = void 0, e.paymentDoneCallback = function() {
            var n = e.getAmountAuthorized();
            try {
                e.paymentDone.disconnect(this, e.paymentDoneCallback);
            } catch (e) {
                console.log(e);
            }
            "function" == typeof e.currentPaymentDoneCallback && e.currentPaymentDoneCallback(n), 
            e.currentPaymentDoneCallback = void 0;
        }, e.pay = function(n, t) {
            if ("object" != typeof n && (n = {
                amount: n,
                editable_amount: !0
            }), !1 === e.isPaying()) if (n.amount >= 0) {
                e.currentPaymentDoneCallback = t;
                try {
                    e.paymentDone.disconnect(this, e.paymentDoneCallback);
                } catch (e) {
                    console.log(e);
                }
                e.paymentDone.connect(this, e.paymentDoneCallback), e.doPay(n);
            } else {
                var o = new Error("BAD USAGE: Proposed amount must be greater than 0!");
                console.error(o.msg);
            } else console.warn("Payment is already in progress"), t.call(this, 0);
        }, e.triggerEvent = function() {
            var e;
            (e = document.createEvent("CustomEvent")).initCustomEvent("oncardevent", !0, !0), 
            document.dispatchEvent(e);
        }, e.enableCardEvent = function() {
            e.doEnableCardEvent();
            try {
                e.cardEvent.disconnect(this, e.triggerEvent);
            } catch (e) {
                console.log(e);
            }
            e.cardEvent.connect(this, e.triggerEvent);
        }, e.disableCardEvent = function() {
            e.doDisableCardEvent();
            try {
                e.cardEvent.disconnect(this, e.triggerEvent);
            } catch (e) {
                console.log(e);
            }
        };
    }(o);
    n.default = o;
} ]);
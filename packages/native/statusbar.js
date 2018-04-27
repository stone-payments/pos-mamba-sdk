module.exports = function(r) {
    var t = {};
    function o(n) {
        if (t[n]) return t[n].exports;
        var e = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return r[n].call(e.exports, e, e.exports, o), e.l = !0, e.exports;
    }
    return o.m = r, o.c = t, o.d = function(r, t, n) {
        o.o(r, t) || Object.defineProperty(r, t, {
            configurable: !1,
            enumerable: !0,
            get: n
        });
    }, o.r = function(r) {
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
    }, o.n = function(r) {
        var t = r && r.__esModule ? function() {
            return r.default;
        } : function() {
            return r;
        };
        return o.d(t, "a", t), t;
    }, o.o = function(r, t) {
        return Object.prototype.hasOwnProperty.call(r, t);
    }, o.p = "", o(o.s = 0);
}([ function(r, t, o) {
    "use strict";
    function n(r) {
        return null !== r.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || r.indexOf("#") > -1 ? u(r) : function(r) {
            var t = document.createElement("div");
            t.classList.add(r), document.body.appendChild(t);
            var o = window.getComputedStyle(t).backgroundColor;
            return document.body.removeChild(t), u(o);
        }(r);
    }
    function e(r) {
        return ("0" + parseInt(r).toString(16)).slice(-2);
    }
    function u(r) {
        return /^#[0-9A-F]{6}$/i.test(r) ? r : "#" + e((r = r.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/))[1]) + e(r[2]) + e(r[3]);
    }
    o.r(t);
    o.d(t, "STATUSBAR_HEIGHT", function() {
        return c;
    });
    var a, c = 20, d = window.StatusBar;
    if (!d) throw new Error("[@mamba/native] 'StatusBar' module not found");
    (a = d).setBackgroundColor = function(r) {
        var t = n(r);
        "transparent" !== t ? a.doSetBackgroundColor(t.replace("#", "0x")) : console.error("Invalid color format or color class don't exist");
    }, a.getBackgroundColor = function() {
        return "#" + a.doGetBackgroundColor().toString(16);
    }, a.setBackgroundColor("primary-color-dark");
    t.default = d;
} ]);
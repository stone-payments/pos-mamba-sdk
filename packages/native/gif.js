module.exports = function(r) {
    var o = {};
    function t(n) {
        if (o[n]) return o[n].exports;
        var e = o[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return r[n].call(e.exports, e, e.exports, t), e.l = !0, e.exports;
    }
    return t.m = r, t.c = o, t.d = function(r, o, n) {
        t.o(r, o) || Object.defineProperty(r, o, {
            configurable: !1,
            enumerable: !0,
            get: n
        });
    }, t.r = function(r) {
        Object.defineProperty(r, "__esModule", {
            value: !0
        });
    }, t.n = function(r) {
        var o = r && r.__esModule ? function() {
            return r.default;
        } : function() {
            return r;
        };
        return t.d(o, "a", o), o;
    }, t.o = function(r, o) {
        return Object.prototype.hasOwnProperty.call(r, o);
    }, t.p = "", t(t.s = 0);
}([ function(r, o, t) {
    "use strict";
    function n(r) {
        return null !== r.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) || r.indexOf("#") > -1 ? u(r) : function(r) {
            var o = document.createElement("div");
            o.classList.add(r), document.body.appendChild(o);
            var t = window.getComputedStyle(o).backgroundColor;
            return document.body.removeChild(o), u(t);
        }(r);
    }
    function e(r) {
        return ("0" + parseInt(r).toString(16)).slice(-2);
    }
    function u(r) {
        return /^#[0-9A-F]{6}$/i.test(r) ? r : "#" + e((r = r.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/))[1]) + e(r[2]) + e(r[3]);
    }
    t.r(o);
    var a, d = window.StatusBar;
    if (!d) throw new Error("[@mamba/native] 'StatusBar' module not found");
    (a = d).setBackgroundColor = function(r) {
        var o = n(r);
        "transparent" !== o ? a.doSetBackgroundColor(o.replace("#", "0x")) : console.error("Invalid color format or color class don't exist");
    }, a.getBackgroundColor = function() {
        return "#" + a.doGetBackgroundColor().toString(16);
    }, a.setBackgroundColor("primary-color-dark");
    var c = window.Gif;
    if (!c) throw new Error("[@mamba/native] 'Gif' module not found");
    o.default = c;
} ]);
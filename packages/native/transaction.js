module.exports = function(t) {
    var a = {};
    function n(o) {
        if (a[o]) return a[o].exports;
        var e = a[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return t[o].call(e.exports, e, e.exports, n), e.l = !0, e.exports;
    }
    return n.m = t, n.c = a, n.d = function(t, a, o) {
        n.o(t, a) || Object.defineProperty(t, a, {
            configurable: !1,
            enumerable: !0,
            get: o
        });
    }, n.r = function(t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
    }, n.n = function(t) {
        var a = t && t.__esModule ? function() {
            return t.default;
        } : function() {
            return t;
        };
        return n.d(a, "a", a), a;
    }, n.o = function(t, a) {
        return Object.prototype.hasOwnProperty.call(t, a);
    }, n.p = "", n(n.s = 2);
}([ function(t, a) {
    t.exports = function() {
        return [ {
            brand: "VISA",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 25,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 75,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "VISA",
            transactionType: "Débito",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 25,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 75,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "ALELO",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 100,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "ELO",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 100,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 0,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "HIPER",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 100,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "HIPERCARD",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 100,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "MASTERCARD",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 75,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "SODEXO",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 100,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "TICKET",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 0,
            authorizationDateTime: "2018-04-26T20:53:40.929Z",
            remainingValue: 100,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "VR",
            transactionType: "Crédito à vista",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 25,
            authorizationDateTime: "2017-02-15T14:35:27.009Z",
            lastCancellationDateTime: "2017-02-15T14:37:56.045Z",
            remainingValue: 75,
            installmentCount: 0,
            transactionStatusCode: 2
        }, {
            brand: "MASTERCARD",
            transactionType: "Débito",
            totalAmountAuthorized: 100,
            totalAmountCancelled: 25,
            authorizationDateTime: "2017-02-15T14:40:09.007Z",
            remainingValue: 75,
            installmentCount: 0,
            transactionStatusCode: 2
        } ];
    };
}, function(t, a) {
    t.exports = function() {
        return {
            VISA: [ {
                totalApprovedBrand: 5,
                approvedValueBrand: 10,
                approvedTransactionsNumber: 2,
                cancelledValueBrand: 5,
                cancelledTransactionsNumber: 1,
                transactionType: "Débito"
            }, {
                totalApprovedBrand: 5,
                approvedValueBrand: 10,
                approvedTransactionsNumber: 2,
                transactionType: "Crédito"
            } ],
            ALELO: [ {
                totalApprovedBrand: 100,
                approvedValueBrand: 100,
                approvedTransactionsNumber: 1,
                transactionType: "Refeição"
            }, {
                totalApprovedBrand: 100,
                approvedValueBrand: 100,
                approvedTransactionsNumber: 1,
                transactionType: "Cultura"
            } ],
            VR: [ {
                totalApprovedBrand: 100,
                approvedValueBrand: 100,
                approvedTransactionsNumber: 1,
                transactionType: "Benefícios"
            }, {
                totalApprovedBrand: 100,
                approvedValueBrand: 100,
                approvedTransactionsNumber: 1,
                transactionType: "Auto"
            } ],
            MASTERCARD: [ {
                totalApprovedBrand: 10,
                approvedValueBrand: 10,
                approvedTransactionsNumber: 2,
                transactionType: "Crédito"
            }, {
                totalApprovedBrand: 10,
                approvedValueBrand: 10,
                approvedTransactionsNumber: 2,
                transactionType: "Parcelado sem juros"
            }, {
                totalApprovedBrand: 10,
                approvedValueBrand: 10,
                approvedTransactionsNumber: 2,
                transactionType: "Crédito à vista"
            } ]
        };
    };
}, function(t, a, n) {
    "use strict";
    n.r(a);
    n(1), n(0);
    var o = window.MbTransaction;
    if (!o) throw new Error("[@mamba/native] 'Transaction' module not found");
    o.TransactionStatusCodes = Object.freeze({
        PENDING_REVERSAL_BY_TECHNICAL_ERROR: -3,
        PENDING_REVERSAL: -2,
        PENDING: -1,
        UNKNOWN: 0,
        APPROVED: 1,
        CANCELLED_BY_THE_USER: 2,
        CANCELLED_IN_REVISION_PROCESS: 3,
        CANCELLED_AUTOMATICALLY: 4,
        FALLBACK_APPROVED: 5,
        FALLBACK_CANCELLED_BY_THE_USER: 6,
        FALLBACK_CANCELLED_AUTOMATICALLY: 7,
        FALLBACK_CANCELLED_IN_REVISION_PROCESS: 8
    });
    a.default = o;
} ]);
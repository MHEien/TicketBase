// Auto-generated plugin wrapper for Stripe Payment Gateway v2.0.0
(function (window) {
  "use strict";

  // Ensure PluginSDK is available
  if (!window.PluginSDK) {
    console.error("[stripe-payment-plugin] PluginSDK not available");
    return;
  }

  // Plugin bundle
  ("use strict");
  var PluginBundle = (() => {
    var ue = Object.create;
    var P = Object.defineProperty;
    var le = Object.getOwnPropertyDescriptor;
    var pe = Object.getOwnPropertyNames;
    var de = Object.getPrototypeOf,
      fe = Object.prototype.hasOwnProperty;
    var E = (e, t) => () => (
        t || e((t = { exports: {} }).exports, t), t.exports
      ),
      me = (e, t) => {
        for (var n in t) P(e, n, { get: t[n], enumerable: !0 });
      },
      U = (e, t, n, o) => {
        if ((t && typeof t == "object") || typeof t == "function")
          for (let s of pe(t))
            !fe.call(e, s) &&
              s !== n &&
              P(e, s, {
                get: () => t[s],
                enumerable: !(o = le(t, s)) || o.enumerable,
              });
        return e;
      };
    var I = (e, t, n) => (
        (n = e != null ? ue(de(e)) : {}),
        U(
          t || !e || !e.__esModule
            ? P(n, "default", { value: e, enumerable: !0 })
            : n,
          e,
        )
      ),
      ye = (e) => U(P({}, "__esModule", { value: !0 }), e);
    var ee = E((a) => {
      "use strict";
      var x = Symbol.for("react.element"),
        he = Symbol.for("react.portal"),
        ve = Symbol.for("react.fragment"),
        ge = Symbol.for("react.strict_mode"),
        be = Symbol.for("react.profiler"),
        Ce = Symbol.for("react.provider"),
        Se = Symbol.for("react.context"),
        _e = Symbol.for("react.forward_ref"),
        xe = Symbol.for("react.suspense"),
        we = Symbol.for("react.memo"),
        Pe = Symbol.for("react.lazy"),
        V = Symbol.iterator;
      function Ee(e) {
        return e === null || typeof e != "object"
          ? null
          : ((e = (V && e[V]) || e["@@iterator"]),
            typeof e == "function" ? e : null);
      }
      var H = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        W = Object.assign,
        z = {};
      function S(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = z),
          (this.updater = n || H);
      }
      S.prototype.isReactComponent = {};
      S.prototype.setState = function (e, t) {
        if (typeof e != "object" && typeof e != "function" && e != null)
          throw Error(
            "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
          );
        this.updater.enqueueSetState(this, e, t, "setState");
      };
      S.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      };
      function G() {}
      G.prototype = S.prototype;
      function F(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = z),
          (this.updater = n || H);
      }
      var q = (F.prototype = new G());
      q.constructor = F;
      W(q, S.prototype);
      q.isPureReactComponent = !0;
      var B = Array.isArray,
        J = Object.prototype.hasOwnProperty,
        A = { current: null },
        Q = { key: !0, ref: !0, __self: !0, __source: !0 };
      function X(e, t, n) {
        var o,
          s = {},
          c = null,
          l = null;
        if (t != null)
          for (o in (t.ref !== void 0 && (l = t.ref),
          t.key !== void 0 && (c = "" + t.key),
          t))
            J.call(t, o) && !Q.hasOwnProperty(o) && (s[o] = t[o]);
        var u = arguments.length - 2;
        if (u === 1) s.children = n;
        else if (1 < u) {
          for (var i = Array(u), p = 0; p < u; p++) i[p] = arguments[p + 2];
          s.children = i;
        }
        if (e && e.defaultProps)
          for (o in ((u = e.defaultProps), u)) s[o] === void 0 && (s[o] = u[o]);
        return {
          $$typeof: x,
          type: e,
          key: c,
          ref: l,
          props: s,
          _owner: A.current,
        };
      }
      function Ne(e, t) {
        return {
          $$typeof: x,
          type: e.type,
          key: t,
          ref: e.ref,
          props: e.props,
          _owner: e._owner,
        };
      }
      function T(e) {
        return typeof e == "object" && e !== null && e.$$typeof === x;
      }
      function je(e) {
        var t = { "=": "=0", ":": "=2" };
        return (
          "$" +
          e.replace(/[=:]/g, function (n) {
            return t[n];
          })
        );
      }
      var Y = /\/+/g;
      function k(e, t) {
        return typeof e == "object" && e !== null && e.key != null
          ? je("" + e.key)
          : t.toString(36);
      }
      function j(e, t, n, o, s) {
        var c = typeof e;
        (c === "undefined" || c === "boolean") && (e = null);
        var l = !1;
        if (e === null) l = !0;
        else
          switch (c) {
            case "string":
            case "number":
              l = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case x:
                case he:
                  l = !0;
              }
          }
        if (l)
          return (
            (l = e),
            (s = s(l)),
            (e = o === "" ? "." + k(l, 0) : o),
            B(s)
              ? ((n = ""),
                e != null && (n = e.replace(Y, "$&/") + "/"),
                j(s, t, n, "", function (p) {
                  return p;
                }))
              : s != null &&
                (T(s) &&
                  (s = Ne(
                    s,
                    n +
                      (!s.key || (l && l.key === s.key)
                        ? ""
                        : ("" + s.key).replace(Y, "$&/") + "/") +
                      e,
                  )),
                t.push(s)),
            1
          );
        if (((l = 0), (o = o === "" ? "." : o + ":"), B(e)))
          for (var u = 0; u < e.length; u++) {
            c = e[u];
            var i = o + k(c, u);
            l += j(c, t, n, i, s);
          }
        else if (((i = Ee(e)), typeof i == "function"))
          for (e = i.call(e), u = 0; !(c = e.next()).done; )
            (c = c.value), (i = o + k(c, u++)), (l += j(c, t, n, i, s));
        else if (c === "object")
          throw (
            ((t = String(e)),
            Error(
              "Objects are not valid as a React child (found: " +
                (t === "[object Object]"
                  ? "object with keys {" + Object.keys(e).join(", ") + "}"
                  : t) +
                "). If you meant to render a collection of children, use an array instead.",
            ))
          );
        return l;
      }
      function N(e, t, n) {
        if (e == null) return e;
        var o = [],
          s = 0;
        return (
          j(e, o, "", "", function (c) {
            return t.call(n, c, s++);
          }),
          o
        );
      }
      function Re(e) {
        if (e._status === -1) {
          var t = e._result;
          (t = t()),
            t.then(
              function (n) {
                (e._status === 0 || e._status === -1) &&
                  ((e._status = 1), (e._result = n));
              },
              function (n) {
                (e._status === 0 || e._status === -1) &&
                  ((e._status = 2), (e._result = n));
              },
            ),
            e._status === -1 && ((e._status = 0), (e._result = t));
        }
        if (e._status === 1) return e._result.default;
        throw e._result;
      }
      var f = { current: null },
        R = { transition: null },
        De = {
          ReactCurrentDispatcher: f,
          ReactCurrentBatchConfig: R,
          ReactCurrentOwner: A,
        };
      function Z() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      a.Children = {
        map: N,
        forEach: function (e, t, n) {
          N(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            N(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            N(e, function (t) {
              return t;
            }) || []
          );
        },
        only: function (e) {
          if (!T(e))
            throw Error(
              "React.Children.only expected to receive a single React element child.",
            );
          return e;
        },
      };
      a.Component = S;
      a.Fragment = ve;
      a.Profiler = be;
      a.PureComponent = F;
      a.StrictMode = ge;
      a.Suspense = xe;
      a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = De;
      a.act = Z;
      a.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            "React.cloneElement(...): The argument must be a React element, but you passed " +
              e +
              ".",
          );
        var o = W({}, e.props),
          s = e.key,
          c = e.ref,
          l = e._owner;
        if (t != null) {
          if (
            (t.ref !== void 0 && ((c = t.ref), (l = A.current)),
            t.key !== void 0 && (s = "" + t.key),
            e.type && e.type.defaultProps)
          )
            var u = e.type.defaultProps;
          for (i in t)
            J.call(t, i) &&
              !Q.hasOwnProperty(i) &&
              (o[i] = t[i] === void 0 && u !== void 0 ? u[i] : t[i]);
        }
        var i = arguments.length - 2;
        if (i === 1) o.children = n;
        else if (1 < i) {
          u = Array(i);
          for (var p = 0; p < i; p++) u[p] = arguments[p + 2];
          o.children = u;
        }
        return {
          $$typeof: x,
          type: e.type,
          key: s,
          ref: c,
          props: o,
          _owner: l,
        };
      };
      a.createContext = function (e) {
        return (
          (e = {
            $$typeof: Se,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _defaultValue: null,
            _globalName: null,
          }),
          (e.Provider = { $$typeof: Ce, _context: e }),
          (e.Consumer = e)
        );
      };
      a.createElement = X;
      a.createFactory = function (e) {
        var t = X.bind(null, e);
        return (t.type = e), t;
      };
      a.createRef = function () {
        return { current: null };
      };
      a.forwardRef = function (e) {
        return { $$typeof: _e, render: e };
      };
      a.isValidElement = T;
      a.lazy = function (e) {
        return {
          $$typeof: Pe,
          _payload: { _status: -1, _result: e },
          _init: Re,
        };
      };
      a.memo = function (e, t) {
        return { $$typeof: we, type: e, compare: t === void 0 ? null : t };
      };
      a.startTransition = function (e) {
        var t = R.transition;
        R.transition = {};
        try {
          e();
        } finally {
          R.transition = t;
        }
      };
      a.unstable_act = Z;
      a.useCallback = function (e, t) {
        return f.current.useCallback(e, t);
      };
      a.useContext = function (e) {
        return f.current.useContext(e);
      };
      a.useDebugValue = function () {};
      a.useDeferredValue = function (e) {
        return f.current.useDeferredValue(e);
      };
      a.useEffect = function (e, t) {
        return f.current.useEffect(e, t);
      };
      a.useId = function () {
        return f.current.useId();
      };
      a.useImperativeHandle = function (e, t, n) {
        return f.current.useImperativeHandle(e, t, n);
      };
      a.useInsertionEffect = function (e, t) {
        return f.current.useInsertionEffect(e, t);
      };
      a.useLayoutEffect = function (e, t) {
        return f.current.useLayoutEffect(e, t);
      };
      a.useMemo = function (e, t) {
        return f.current.useMemo(e, t);
      };
      a.useReducer = function (e, t, n) {
        return f.current.useReducer(e, t, n);
      };
      a.useRef = function (e) {
        return f.current.useRef(e);
      };
      a.useState = function (e) {
        return f.current.useState(e);
      };
      a.useSyncExternalStore = function (e, t, n) {
        return f.current.useSyncExternalStore(e, t, n);
      };
      a.useTransition = function () {
        return f.current.useTransition();
      };
      a.version = "18.3.1";
    });
    var D = E((Ye, te) => {
      "use strict";
      te.exports = ee();
    });
    var ne = E(($) => {
      "use strict";
      var $e = D(),
        Le = Symbol.for("react.element"),
        Oe = Symbol.for("react.fragment"),
        Me = Object.prototype.hasOwnProperty,
        Ie =
          $e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
            .ReactCurrentOwner,
        ke = { key: !0, ref: !0, __self: !0, __source: !0 };
      function re(e, t, n) {
        var o,
          s = {},
          c = null,
          l = null;
        n !== void 0 && (c = "" + n),
          t.key !== void 0 && (c = "" + t.key),
          t.ref !== void 0 && (l = t.ref);
        for (o in t) Me.call(t, o) && !ke.hasOwnProperty(o) && (s[o] = t[o]);
        if (e && e.defaultProps)
          for (o in ((t = e.defaultProps), t)) s[o] === void 0 && (s[o] = t[o]);
        return {
          $$typeof: Le,
          type: e,
          key: c,
          ref: l,
          props: s,
          _owner: Ie.current,
        };
      }
      $.Fragment = Oe;
      $.jsx = re;
      $.jsxs = re;
    });
    var se = E((We, oe) => {
      "use strict";
      oe.exports = ne();
    });
    var Ue = {};
    me(Ue, { default: () => Ke });
    var r = I(se()),
      v = I(D());
    var h = I(D(), 1);
    function ie() {
      return window.PluginSDK;
    }
    function K(e) {
      let t = ie(),
        [n, o] = h.default.useState(null),
        [s, c] = h.default.useState(!0),
        [l, u] = h.default.useState(null);
      h.default.useEffect(() => {
        async function p() {
          try {
            c(!0), u(null);
            let d = await t.api.loadConfig(e);
            o(d);
          } catch (d) {
            u(d instanceof Error ? d.message : "Failed to load configuration");
          } finally {
            c(!1);
          }
        }
        p();
      }, [e, t.api]);
      let i = h.default.useCallback(
        async (p) => {
          try {
            u(null),
              await t.api.saveConfig(e, p),
              o(p),
              t.utils.toast({
                title: "Success",
                description: "Configuration saved successfully",
                variant: "success",
              });
          } catch (d) {
            let g =
              d instanceof Error ? d.message : "Failed to save configuration";
            throw (
              (u(g),
              t.utils.toast({
                title: "Error",
                description: g,
                variant: "destructive",
              }),
              d)
            );
          }
        },
        [e, t.api, t.utils],
      );
      return { config: n, loading: s, error: l, saveConfig: i };
    }
    function ce(e) {
      let t = ie(),
        [n, o] = h.default.useState(!1),
        [s, c] = h.default.useState(null);
      return {
        processPayment: h.default.useCallback(
          async (u, i) => {
            try {
              o(!0), c(null);
              let d = await (
                await t.api.post("/api/payments/process", { pluginId: e, ...u })
              ).json();
              if (d.success)
                t.utils.toast({
                  title: "Payment Successful",
                  description: "Your payment has been processed successfully",
                  variant: "success",
                }),
                  i(d.paymentId, d.metadata);
              else throw new Error(d.error || "Payment failed");
            } catch (p) {
              let d =
                p instanceof Error ? p.message : "Payment processing failed";
              throw (
                (c(d),
                t.utils.toast({
                  title: "Payment Failed",
                  description: d,
                  variant: "destructive",
                }),
                p)
              );
            } finally {
              o(!1);
            }
          },
          [e, t],
        ),
        processing: n,
        error: s,
      };
    }
    var Fe = ({ context: e, sdk: t }) => {
        let { pluginId: n, user: o } = e,
          { config: s, loading: c, error: l, saveConfig: u } = K(n),
          [i, p] = v.default.useState({
            apiKey: "",
            publishableKey: "",
            webhookUrl: "",
            testMode: !0,
          }),
          [d, g] = v.default.useState(!1);
        v.default.useEffect(() => {
          s && p(s);
        }, [s]);
        let b = (y) => {
            let { name: C, value: _, type: O, checked: M } = y.target;
            p((m) => ({ ...m, [C]: O === "checkbox" ? M : _ }));
          },
          L = async (y) => {
            y.preventDefault(), g(!0);
            try {
              await u(i);
            } catch {
            } finally {
              g(!1);
            }
          };
        return c
          ? (0, r.jsx)(t.components.Card, {
              children: (0, r.jsx)(t.components.CardContent, {
                className: "p-6 text-center",
                children: "Loading configuration...",
              }),
            })
          : (0, r.jsxs)(t.components.Card, {
              children: [
                (0, r.jsxs)(t.components.CardHeader, {
                  children: [
                    (0, r.jsx)(t.components.CardTitle, {
                      children: "Stripe Payment Configuration",
                    }),
                    (0, r.jsxs)(t.components.CardDescription, {
                      children: [
                        "Configure your Stripe payment gateway. Authenticated as: ",
                        o.email,
                      ],
                    }),
                  ],
                }),
                (0, r.jsx)(t.components.CardContent, {
                  children: (0, r.jsxs)("form", {
                    onSubmit: L,
                    className: "space-y-6",
                    children: [
                      (0, r.jsxs)("div", {
                        className: "space-y-2",
                        children: [
                          (0, r.jsx)(t.components.Label, {
                            htmlFor: "apiKey",
                            children: "Stripe Secret API Key",
                          }),
                          (0, r.jsx)(t.components.Input, {
                            id: "apiKey",
                            name: "apiKey",
                            type: "password",
                            placeholder: "sk_test_... or sk_live_...",
                            value: i.apiKey,
                            onChange: b,
                            disabled: d,
                            required: !0,
                          }),
                          (0, r.jsx)("p", {
                            className: "text-sm text-muted-foreground",
                            children:
                              "Your Stripe secret API key from the Stripe Dashboard",
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className: "space-y-2",
                        children: [
                          (0, r.jsx)(t.components.Label, {
                            htmlFor: "publishableKey",
                            children: "Stripe Publishable Key",
                          }),
                          (0, r.jsx)(t.components.Input, {
                            id: "publishableKey",
                            name: "publishableKey",
                            type: "text",
                            placeholder: "pk_test_... or pk_live_...",
                            value: i.publishableKey,
                            onChange: b,
                            disabled: d,
                            required: !0,
                          }),
                          (0, r.jsx)("p", {
                            className: "text-sm text-muted-foreground",
                            children:
                              "Your Stripe publishable key for client-side integration",
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className: "space-y-2",
                        children: [
                          (0, r.jsx)(t.components.Label, {
                            htmlFor: "webhookUrl",
                            children: "Webhook URL (Optional)",
                          }),
                          (0, r.jsx)(t.components.Input, {
                            id: "webhookUrl",
                            name: "webhookUrl",
                            type: "url",
                            placeholder:
                              "https://yoursite.com/api/stripe/webhook",
                            value: i.webhookUrl || "",
                            onChange: b,
                            disabled: d,
                          }),
                          (0, r.jsx)("p", {
                            className: "text-sm text-muted-foreground",
                            children:
                              "Stripe will send payment events to this URL",
                          }),
                        ],
                      }),
                      (0, r.jsxs)("div", {
                        className: "flex items-center space-x-2",
                        children: [
                          (0, r.jsx)(t.components.Switch, {
                            id: "testMode",
                            checked: i.testMode,
                            onCheckedChange: (y) =>
                              p((C) => ({ ...C, testMode: y })),
                            disabled: d,
                          }),
                          (0, r.jsx)(t.components.Label, {
                            htmlFor: "testMode",
                            children: "Test Mode",
                          }),
                        ],
                      }),
                      l &&
                        (0, r.jsx)(t.components.Alert, {
                          variant: "destructive",
                          children: (0, r.jsx)(t.components.AlertDescription, {
                            children: l,
                          }),
                        }),
                      (0, r.jsx)("div", {
                        className: "flex justify-end",
                        children: (0, r.jsx)(t.components.Button, {
                          type: "submit",
                          disabled: d,
                          children: d ? "Saving..." : "Save Configuration",
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            });
      },
      qe = ({ context: e, sdk: t }) => {
        let { cart: n, onSuccess: o, onError: s } = e,
          { config: c, loading: l } = K("stripe-payment-plugin"),
          {
            processPayment: u,
            processing: i,
            error: p,
          } = ce("stripe-payment-plugin"),
          [d, g] = v.default.useState(""),
          [b, L] = v.default.useState(""),
          [y, C] = v.default.useState(""),
          [_, O] = v.default.useState(""),
          M = async (m) => {
            if ((m.preventDefault(), !c?.apiKey)) {
              s("Stripe is not configured properly");
              return;
            }
            try {
              await u(
                {
                  paymentMethod: "stripe",
                  cardNumber: d,
                  expiry: b,
                  cvc: y,
                  cardholderName: _,
                  amount: n.total,
                  currency: n.currency,
                  customer: n.customer,
                },
                (w, ae) => {
                  o(w, { provider: "stripe", testMode: c.testMode, ...ae });
                },
              );
            } catch (w) {
              s(w instanceof Error ? w.message : "Payment failed");
            }
          };
        return l
          ? (0, r.jsx)(t.components.Card, {
              children: (0, r.jsx)(t.components.CardContent, {
                className: "p-6 text-center",
                children: "Loading payment configuration...",
              }),
            })
          : c?.apiKey
            ? (0, r.jsxs)(t.components.Card, {
                children: [
                  (0, r.jsxs)(t.components.CardHeader, {
                    children: [
                      (0, r.jsx)(t.components.CardTitle, {
                        children: "Credit Card Payment",
                      }),
                      (0, r.jsxs)(t.components.CardDescription, {
                        children: [
                          "Secure payment processing via Stripe",
                          c.testMode && " (Test Mode)",
                        ],
                      }),
                    ],
                  }),
                  (0, r.jsx)(t.components.CardContent, {
                    children: (0, r.jsxs)("form", {
                      onSubmit: M,
                      className: "space-y-4",
                      children: [
                        (0, r.jsxs)("div", {
                          className: "space-y-2",
                          children: [
                            (0, r.jsx)(t.components.Label, {
                              htmlFor: "cardholderName",
                              children: "Cardholder Name",
                            }),
                            (0, r.jsx)(t.components.Input, {
                              id: "cardholderName",
                              type: "text",
                              placeholder: "John Doe",
                              value: _,
                              onChange: (m) => O(m.target.value),
                              disabled: i,
                              required: !0,
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "space-y-2",
                          children: [
                            (0, r.jsx)(t.components.Label, {
                              htmlFor: "cardNumber",
                              children: "Card Number",
                            }),
                            (0, r.jsx)(t.components.Input, {
                              id: "cardNumber",
                              type: "text",
                              placeholder: "1234 5678 9012 3456",
                              value: d,
                              onChange: (m) => g(m.target.value),
                              disabled: i,
                              required: !0,
                            }),
                          ],
                        }),
                        (0, r.jsxs)("div", {
                          className: "grid grid-cols-2 gap-4",
                          children: [
                            (0, r.jsxs)("div", {
                              className: "space-y-2",
                              children: [
                                (0, r.jsx)(t.components.Label, {
                                  htmlFor: "expiry",
                                  children: "Expiry Date",
                                }),
                                (0, r.jsx)(t.components.Input, {
                                  id: "expiry",
                                  type: "text",
                                  placeholder: "MM/YY",
                                  value: b,
                                  onChange: (m) => L(m.target.value),
                                  disabled: i,
                                  required: !0,
                                }),
                              ],
                            }),
                            (0, r.jsxs)("div", {
                              className: "space-y-2",
                              children: [
                                (0, r.jsx)(t.components.Label, {
                                  htmlFor: "cvc",
                                  children: "CVC",
                                }),
                                (0, r.jsx)(t.components.Input, {
                                  id: "cvc",
                                  type: "text",
                                  placeholder: "123",
                                  value: y,
                                  onChange: (m) => C(m.target.value),
                                  disabled: i,
                                  required: !0,
                                }),
                              ],
                            }),
                          ],
                        }),
                        p &&
                          (0, r.jsx)(t.components.Alert, {
                            variant: "destructive",
                            children: (0, r.jsx)(
                              t.components.AlertDescription,
                              { children: p },
                            ),
                          }),
                        (0, r.jsx)("div", {
                          className: "p-3 bg-muted rounded-md text-sm",
                          children: (0, r.jsxs)("div", {
                            className: "flex justify-between font-medium",
                            children: [
                              (0, r.jsx)("span", { children: "Total:" }),
                              (0, r.jsx)("span", {
                                children: t.utils.formatCurrency(
                                  n.total / 100,
                                  n.currency,
                                ),
                              }),
                            ],
                          }),
                        }),
                        (0, r.jsx)(t.components.Button, {
                          type: "submit",
                          disabled: i || !d || !b || !y || !_,
                          className: "w-full",
                          children: i
                            ? "Processing Payment..."
                            : `Pay ${t.utils.formatCurrency(n.total / 100, n.currency)}`,
                        }),
                      ],
                    }),
                  }),
                ],
              })
            : (0, r.jsx)(t.components.Alert, {
                variant: "destructive",
                children: (0, r.jsx)(t.components.AlertDescription, {
                  children:
                    "Stripe payment is not configured. Please contact the administrator.",
                }),
              });
      },
      Ae = ({ context: e, sdk: t }) => {
        let { paymentDetails: n } = e;
        return n.provider !== "stripe"
          ? null
          : (0, r.jsxs)("div", {
              className:
                "flex items-center space-x-2 text-sm p-3 bg-green-50 rounded-md border border-green-200",
              children: [
                (0, r.jsx)("div", {
                  className: "flex-shrink-0",
                  children: (0, r.jsx)("svg", {
                    className: "h-5 w-5 text-green-500",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    children: (0, r.jsx)("path", {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M5 13l4 4L19 7",
                    }),
                  }),
                }),
                (0, r.jsxs)("div", {
                  className: "text-green-700",
                  children: [
                    (0, r.jsx)("span", {
                      className: "font-medium",
                      children: "Payment Successful",
                    }),
                    (0, r.jsxs)("div", {
                      className: "text-xs text-green-600",
                      children: [
                        "Processed securely by Stripe ",
                        n.testMode && "(Test Mode)",
                      ],
                    }),
                  ],
                }),
              ],
            });
      },
      Te = {
        id: "stripe-payment-plugin",
        name: "Stripe Payment Gateway",
        version: "2.0.0",
        description: "Accept credit card payments securely with Stripe",
        author: "Tickets Platform Team",
        category: "payment",
        displayName: "Credit Card (Stripe)",
        requiredPermissions: ["read:orders", "write:transactions"],
        priority: 100,
      },
      Ke = {
        metadata: Te,
        extensionPoints: {
          "admin-settings": Fe,
          "payment-methods": qe,
          "checkout-confirmation": Ae,
        },
      };
    return ye(Ue);
  })();
  /*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/

  // Extract plugin from bundle
  const plugin =
    typeof PluginBundle !== "undefined"
      ? PluginBundle.default || PluginBundle
      : null;

  if (!plugin || !plugin.extensionPoints) {
    console.error("[stripe-payment-plugin] Invalid plugin structure");
    return;
  }

  // Register with current plugin system
  window.__PLUGIN_REGISTRY = window.__PLUGIN_REGISTRY || {
    registered: {},
    register: () => {},
    get: () => {},
  };
  window.__PLUGIN_REGISTRY.registered["stripe-payment-plugin"] = {
    metadata: plugin.metadata || {
      id: "stripe-payment-plugin",
      name: "Stripe Payment Gateway",
      version: "2.0.0",
      description: "Accept credit card payments securely with Stripe",
      author: "Tickets Platform Team",
      category: "payment",
      displayName: "Credit Card (Stripe)",
      main: "index.tsx",
      extensionPoints: [
        "admin-settings",
        "payment-methods",
        "checkout-confirmation",
      ],
      dependencies: { stripe: "^14.21.0" },
      configSchema: {
        type: "object",
        properties: {
          apiKey: {
            type: "string",
            title: "Stripe Secret API Key",
            description: "Your Stripe secret API key from the Stripe Dashboard",
            pattern: "^sk_(test_|live_)",
            minLength: 20,
          },
          publishableKey: {
            type: "string",
            title: "Stripe Publishable Key",
            description:
              "Your Stripe publishable key for client-side integration",
            pattern: "^pk_(test_|live_)",
            minLength: 20,
          },
          webhookUrl: {
            type: "string",
            title: "Webhook URL (Optional)",
            description: "Stripe will send payment events to this URL",
            format: "uri",
          },
          testMode: {
            type: "boolean",
            title: "Test Mode",
            description: "Use test API keys and process test payments",
            default: true,
          },
        },
        required: ["apiKey", "publishableKey"],
      },
      requiredPermissions: ["read:orders", "write:transactions"],
      priority: 100,
      build: {
        target: "es2020",
        external: ["react", "react-dom"],
        minify: true,
        sourcemap: false,
      },
    },
    extensionPoints: plugin.extensionPoints,
    // Legacy compatibility
    AdminSettingsComponent: plugin.extensionPoints["admin-settings"],
    PaymentMethodComponent: plugin.extensionPoints["payment-methods"],
    CheckoutConfirmationComponent:
      plugin.extensionPoints["checkout-confirmation"],
  };

  console.log("✅ Plugin Stripe Payment Gateway loaded successfully");
})(window);

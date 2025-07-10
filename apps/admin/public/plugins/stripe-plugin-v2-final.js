// src/index.tsx
import React from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
var Card = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("div", {
  className: "border rounded-lg shadow-sm",
  ...props,
  children
}, undefined, false, undefined, this);
var CardHeader = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("div", {
  className: "p-6 pb-4",
  ...props,
  children
}, undefined, false, undefined, this);
var CardTitle = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("h3", {
  className: "text-lg font-semibold",
  ...props,
  children
}, undefined, false, undefined, this);
var CardDescription = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("p", {
  className: "text-sm text-gray-600",
  ...props,
  children
}, undefined, false, undefined, this);
var CardContent = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("div", {
  className: "p-6 pt-0",
  ...props,
  children
}, undefined, false, undefined, this);
var Input = ({ ...props }) => /* @__PURE__ */ jsxDEV("input", {
  className: "w-full px-3 py-2 border rounded-md",
  ...props
}, undefined, false, undefined, this);
var Label = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("label", {
  className: "text-sm font-medium",
  ...props,
  children
}, undefined, false, undefined, this);
var Button = ({ children, disabled, ...props }) => /* @__PURE__ */ jsxDEV("button", {
  className: `px-4 py-2 rounded-md ${disabled ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`,
  disabled,
  ...props,
  children
}, undefined, false, undefined, this);
var Switch = ({ checked, onCheckedChange, ...props }) => /* @__PURE__ */ jsxDEV("input", {
  type: "checkbox",
  checked,
  onChange: (e) => onCheckedChange?.(e.target.checked),
  ...props
}, undefined, false, undefined, this);
var Alert = ({ variant, children, ...props }) => /* @__PURE__ */ jsxDEV("div", {
  className: `p-4 rounded-md ${variant === "destructive" ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"}`,
  ...props,
  children
}, undefined, false, undefined, this);
var AlertDescription = ({ children, ...props }) => /* @__PURE__ */ jsxDEV("div", {
  className: "text-sm",
  ...props,
  children
}, undefined, false, undefined, this);
var AdminSettingsComponent = ({ context = {} }) => {
  const {
    plugin,
    pluginId = "stripe-payment-plugin",
    onSave,
    saving = false,
    user = { email: "admin@example.com" },
    isAuthenticated = true
  } = context;
  const [formData, setFormData] = React.useState({
    apiKey: plugin?.configuration?.apiKey || "",
    publishableKey: plugin?.configuration?.publishableKey || "",
    webhookUrl: plugin?.configuration?.webhookUrl || "",
    testMode: plugin?.configuration?.testMode ?? true
  });
  const [formError, setFormError] = React.useState(null);
  React.useEffect(() => {
    if (plugin?.configuration) {
      setFormData({
        apiKey: plugin.configuration.apiKey || "",
        publishableKey: plugin.configuration.publishableKey || "",
        webhookUrl: plugin.configuration.webhookUrl || "",
        testMode: plugin.configuration.testMode ?? true
      });
    }
  }, [plugin?.configuration]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (formError) {
      setFormError(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.apiKey.trim()) {
      setFormError("Stripe Secret API Key is required");
      return;
    }
    if (!formData.publishableKey.trim()) {
      setFormError("Stripe Publishable Key is required");
      return;
    }
    if (!formData.apiKey.match(/^sk_(test_|live_)/)) {
      setFormError("Stripe Secret API Key must start with 'sk_test_' or 'sk_live_'");
      return;
    }
    if (!formData.publishableKey.match(/^pk_(test_|live_)/)) {
      setFormError("Stripe Publishable Key must start with 'pk_test_' or 'pk_live_'");
      return;
    }
    try {
      setFormError(null);
      if (onSave) {
        await onSave(formData);
      } else {
        throw new Error("No save function available. Plugin may not be properly integrated.");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save configuration");
    }
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxDEV(Card, {
      children: /* @__PURE__ */ jsxDEV(CardContent, {
        className: "p-6 text-center",
        children: /* @__PURE__ */ jsxDEV(Alert, {
          variant: "destructive",
          children: /* @__PURE__ */ jsxDEV(AlertDescription, {
            children: "You must be authenticated to configure this plugin."
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV(Card, {
    children: [
      /* @__PURE__ */ jsxDEV(CardHeader, {
        children: [
          /* @__PURE__ */ jsxDEV(CardTitle, {
            children: "\uD83D\uDD12 Stripe Payment Configuration"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV(CardDescription, {
            children: [
              "Configure your Stripe payment gateway. Sensitive data is encrypted automatically.",
              /* @__PURE__ */ jsxDEV("br", {}, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV("strong", {
                children: "Authenticated as:"
              }, undefined, false, undefined, this),
              " ",
              user.email
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV(CardContent, {
        children: /* @__PURE__ */ jsxDEV("form", {
          onSubmit: handleSubmit,
          className: "space-y-6",
          children: [
            /* @__PURE__ */ jsxDEV("div", {
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxDEV(Label, {
                  htmlFor: "apiKey",
                  children: "\uD83D\uDD10 Stripe Secret API Key (Encrypted) *"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(Input, {
                  id: "apiKey",
                  name: "apiKey",
                  type: "password",
                  placeholder: "sk_test_... or sk_live_...",
                  value: formData.apiKey,
                  onChange: handleInputChange,
                  disabled: saving,
                  required: true
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("p", {
                  className: "text-sm text-gray-500",
                  children: [
                    "✅ ",
                    /* @__PURE__ */ jsxDEV("strong", {
                      children: "This field is automatically encrypted"
                    }, undefined, false, undefined, this),
                    " and stored securely based on the plugin.json configuration."
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxDEV(Label, {
                  htmlFor: "publishableKey",
                  children: "\uD83D\uDCD6 Stripe Publishable Key (Plain Text) *"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(Input, {
                  id: "publishableKey",
                  name: "publishableKey",
                  type: "text",
                  placeholder: "pk_test_... or pk_live_...",
                  value: formData.publishableKey,
                  onChange: handleInputChange,
                  disabled: saving,
                  required: true
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("p", {
                  className: "text-sm text-gray-500",
                  children: "ℹ️ This field is stored as plain text (safe for client-side use)."
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxDEV(Label, {
                  htmlFor: "webhookUrl",
                  children: "\uD83D\uDD17 Webhook URL (Optional)"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(Input, {
                  id: "webhookUrl",
                  name: "webhookUrl",
                  type: "url",
                  placeholder: "https://yoursite.com/api/stripe/webhook",
                  value: formData.webhookUrl || "",
                  onChange: handleInputChange,
                  disabled: saving
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("p", {
                  className: "text-sm text-gray-500",
                  children: "Stripe will send payment events to this URL"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "flex items-center space-x-2",
              children: [
                /* @__PURE__ */ jsxDEV(Switch, {
                  id: "testMode",
                  checked: formData.testMode,
                  onCheckedChange: (checked) => setFormData((prev) => ({ ...prev, testMode: checked })),
                  disabled: saving
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(Label, {
                  htmlFor: "testMode",
                  children: "\uD83E\uDDEA Test Mode"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            formError && /* @__PURE__ */ jsxDEV(Alert, {
              variant: "destructive",
              children: /* @__PURE__ */ jsxDEV(AlertDescription, {
                children: formError
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "flex justify-end",
              children: /* @__PURE__ */ jsxDEV(Button, {
                type: "submit",
                disabled: saving || !onSave,
                children: saving ? "\uD83D\uDD04 Saving..." : "\uD83D\uDCBE Save Secure Configuration"
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md",
              children: [
                /* @__PURE__ */ jsxDEV("h4", {
                  className: "font-medium text-blue-900 mb-2",
                  children: "\uD83D\uDD12 Security Features"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("ul", {
                  className: "text-sm text-blue-800 space-y-1",
                  children: [
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Sensitive fields (API keys) are AES-256 encrypted at rest"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Each value uses unique initialization vectors"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Configuration changes are fully audited"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Tenant isolation ensures data separation"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Encryption keys are stored separately from data"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("li", {
                      children: "✅ Real-time validation against plugin schema"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md",
              children: [
                /* @__PURE__ */ jsxDEV("h4", {
                  className: "font-medium text-gray-900 mb-2",
                  children: "\uD83D\uDD27 Debug Information"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("div", {
                  className: "text-xs text-gray-600 space-y-1",
                  children: [
                    /* @__PURE__ */ jsxDEV("p", {
                      children: [
                        /* @__PURE__ */ jsxDEV("strong", {
                          children: "Plugin ID:"
                        }, undefined, false, undefined, this),
                        " ",
                        pluginId
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsxDEV("p", {
                      children: [
                        /* @__PURE__ */ jsxDEV("strong", {
                          children: "Save Function:"
                        }, undefined, false, undefined, this),
                        " ",
                        onSave ? "✅ Available" : "❌ Missing"
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsxDEV("p", {
                      children: [
                        /* @__PURE__ */ jsxDEV("strong", {
                          children: "Current Config:"
                        }, undefined, false, undefined, this),
                        " ",
                        JSON.stringify(plugin?.configuration || {}, null, 2)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsxDEV("p", {
                      children: [
                        /* @__PURE__ */ jsxDEV("strong", {
                          children: "Form Data:"
                        }, undefined, false, undefined, this),
                        " ",
                        JSON.stringify({ ...formData, apiKey: formData.apiKey ? "***HIDDEN***" : "" }, null, 2)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var PaymentMethodComponent = ({ context = {} }) => {
  const { cart = { total: 2000, currency: "USD" } } = context;
  return /* @__PURE__ */ jsxDEV(Card, {
    children: [
      /* @__PURE__ */ jsxDEV(CardHeader, {
        children: [
          /* @__PURE__ */ jsxDEV(CardTitle, {
            children: "Credit Card Payment"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV(CardDescription, {
            children: "Secure payment processing via Stripe"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV(CardContent, {
        children: /* @__PURE__ */ jsxDEV("div", {
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxDEV("div", {
              className: "space-y-2",
              children: [
                /* @__PURE__ */ jsxDEV(Label, {
                  htmlFor: "cardNumber",
                  children: "Card Number"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(Input, {
                  id: "cardNumber",
                  placeholder: "1234 5678 9012 3456",
                  type: "text"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "grid grid-cols-2 gap-4",
              children: [
                /* @__PURE__ */ jsxDEV("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxDEV(Label, {
                      htmlFor: "expiry",
                      children: "Expiry Date"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV(Input, {
                      id: "expiry",
                      placeholder: "MM/YY",
                      type: "text"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                /* @__PURE__ */ jsxDEV("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxDEV(Label, {
                      htmlFor: "cvc",
                      children: "CVC"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV(Input, {
                      id: "cvc",
                      placeholder: "123",
                      type: "text"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "p-3 bg-gray-50 rounded-md",
              children: /* @__PURE__ */ jsxDEV("div", {
                className: "flex justify-between font-medium",
                children: [
                  /* @__PURE__ */ jsxDEV("span", {
                    children: "Total:"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV("span", {
                    children: [
                      "$",
                      (cart.total / 100).toFixed(2),
                      " ",
                      cart.currency
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV(Button, {
              className: "w-full",
              children: [
                "Pay $",
                (cart.total / 100).toFixed(2)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var CheckoutConfirmationComponent = ({ context = {} }) => {
  const { paymentDetails = {} } = context;
  if (paymentDetails.provider !== "stripe") {
    return null;
  }
  return /* @__PURE__ */ jsxDEV("div", {
    className: "flex items-center space-x-2 text-sm p-3 bg-green-50 rounded-md border border-green-200",
    children: [
      /* @__PURE__ */ jsxDEV("div", {
        className: "flex-shrink-0",
        children: /* @__PURE__ */ jsxDEV("svg", {
          className: "h-5 w-5 text-green-500",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          children: /* @__PURE__ */ jsxDEV("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M5 13l4 4L19 7"
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV("div", {
        className: "text-green-700",
        children: [
          /* @__PURE__ */ jsxDEV("span", {
            className: "font-medium",
            children: "Payment Successful"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV("div", {
            className: "text-xs text-green-600",
            children: [
              "Processed securely by Stripe",
              " ",
              paymentDetails.testMode && "(Test Mode)"
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var metadata = {
  id: "stripe-payment-plugin",
  name: "Stripe Payment Gateway",
  version: "2.0.0",
  description: "Accept credit card payments securely with Stripe",
  author: "Tickets Platform Team",
  category: "payment",
  displayName: "Credit Card (Stripe)",
  requiredPermissions: ["read:orders", "write:transactions"],
  priority: 100
};
var stripePlugin = {
  metadata,
  extensionPoints: {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-confirmation": CheckoutConfirmationComponent
  }
};
var src_default = stripePlugin;
console.log("✅ Stripe Plugin: Loaded with secure backend integration");
export {
  metadata,
  src_default as default,
  PaymentMethodComponent,
  CheckoutConfirmationComponent,
  AdminSettingsComponent
};

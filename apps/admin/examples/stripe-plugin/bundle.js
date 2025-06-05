// Stripe Payment Plugin - Plugin SDK Context-Aware Version
// This is a browser-compatible plugin bundle that can be served from MinIO
// and loaded dynamically by the admin application.

"use strict";

// Ensure PluginSDK is available
if (!window.PluginSDK) {
  console.error(
    "PluginSDK not available - make sure PluginSDKProvider is active",
  );
  // Don't return, just exit gracefully
  window.PluginRegistry = window.PluginRegistry || [];
  window.PluginRegistry.push({
    id: "stripe-payment-plugin",
    error: "PluginSDK not available",
  });
} else {
  // Get SDK features
  var PluginSDK = window.PluginSDK;
  var components = PluginSDK.components;
  var hooks = PluginSDK.hooks;
  var api = PluginSDK.api;
  var auth = PluginSDK.auth;
  var utils = PluginSDK.utils;
  var navigation = PluginSDK.navigation;
  var useState = hooks.useState;
  var useEffect = hooks.useEffect;
  var useCallback = hooks.useCallback;

  // Admin Settings Component
  var AdminSettingsComponent = function (props) {
    var pluginId = props.pluginId;
    var sdk = props.sdk;
    var api = props.api;
    var auth = props.auth;
    var components = props.components;
    var utils = props.utils;

    var configState = useState({
      apiKey: "",
      webhookUrl: "",
      testMode: false,
    });
    var config = configState[0];
    var setConfig = configState[1];

    var savingState = useState(false);
    var isSaving = savingState[0];
    var setIsSaving = savingState[1];

    var savedState = useState(false);
    var saved = savedState[0];
    var setSaved = savedState[1];

    var errorState = useState(null);
    var error = errorState[0];
    var setError = errorState[1];

    // Load existing configuration
    useEffect(
      function () {
        var loadConfig = function () {
          api
            .loadConfig(pluginId)
            .then(function (savedConfig) {
              if (savedConfig) {
                setConfig(Object.assign({}, config, savedConfig));
              }
            })
            .catch(function (error) {
              console.error("Failed to load Stripe configuration:", error);
              utils.toast({
                title: "Error",
                description: "Failed to load configuration",
                variant: "destructive",
              });
            });
        };
        loadConfig();
      },
      [pluginId],
    );

    var handleChange = useCallback(function (e) {
      var name = e.target.name;
      var value = e.target.value;
      var type = e.target.type;
      var checked = e.target.checked;

      setConfig(function (prev) {
        var newConfig = Object.assign({}, prev);
        newConfig[name] = type === "checkbox" ? checked : value;
        return newConfig;
      });
      setSaved(false);
      setError(null);
    }, []);

    var handleSubmit = useCallback(
      function (e) {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSaved(false);

        api
          .saveConfig(pluginId, config)
          .then(function () {
            setSaved(true);
            utils.toast({
              title: "Success",
              description: "Stripe configuration saved successfully",
            });
          })
          .catch(function (err) {
            console.error("Failed to save Stripe settings:", err);
            var errorMessage = "Failed to save settings. Please try again.";
            setError(errorMessage);
            utils.toast({
              title: "Error",
              description: errorMessage,
              variant: "destructive",
            });
          })
          .finally(function () {
            setIsSaving(false);
          });
      },
      [config, pluginId, api, utils],
    );

    return React.createElement(components.Card, {}, [
      React.createElement(components.CardHeader, { key: "header" }, [
        React.createElement(
          components.CardTitle,
          { key: "title" },
          "Stripe Payment Configuration",
        ),
        React.createElement(
          components.CardDescription,
          { key: "desc" },
          "Authenticated as: " +
            (auth.user && auth.user.email ? auth.user.email : "Unknown") +
            " • Configure your Stripe payment gateway",
        ),
      ]),
      React.createElement(components.CardContent, { key: "content" }, [
        React.createElement(
          "form",
          {
            key: "form",
            onSubmit: handleSubmit,
            className: "space-y-6",
          },
          [
            // Stripe API Key
            React.createElement(
              "div",
              { key: "api-key-group", className: "space-y-2" },
              [
                React.createElement(
                  components.Label,
                  {
                    key: "api-key-label",
                    htmlFor: "stripe-api-key",
                  },
                  "Stripe API Key",
                ),
                React.createElement(components.Input, {
                  key: "api-key-input",
                  id: "stripe-api-key",
                  name: "apiKey",
                  type: "text",
                  placeholder: "sk_test_... or sk_live_...",
                  value: config.apiKey || "",
                  onChange: handleChange,
                  disabled: isSaving,
                  required: true,
                }),
                React.createElement(
                  "p",
                  {
                    key: "api-key-help",
                    className: "text-sm text-muted-foreground",
                  },
                  "Your Stripe secret API key. Find it in your Stripe Dashboard → Developers → API keys",
                ),
              ],
            ),

            // Webhook URL
            React.createElement(
              "div",
              { key: "webhook-group", className: "space-y-2" },
              [
                React.createElement(
                  components.Label,
                  {
                    key: "webhook-label",
                    htmlFor: "stripe-webhook",
                  },
                  "Webhook URL (Optional)",
                ),
                React.createElement(components.Input, {
                  key: "webhook-input",
                  id: "stripe-webhook",
                  name: "webhookUrl",
                  type: "url",
                  placeholder: "https://yoursite.com/api/stripe/webhook",
                  value: config.webhookUrl || "",
                  onChange: handleChange,
                  disabled: isSaving,
                }),
                React.createElement(
                  "p",
                  {
                    key: "webhook-help",
                    className: "text-sm text-muted-foreground",
                  },
                  "Stripe will send payment events to this URL for verification and processing",
                ),
              ],
            ),

            // Test Mode Toggle
            React.createElement(
              "div",
              {
                key: "test-mode-group",
                className: "flex items-center space-x-2",
              },
              [
                React.createElement(components.Switch, {
                  key: "test-mode-switch",
                  id: "stripe-test-mode",
                  name: "testMode",
                  checked: config.testMode || false,
                  onCheckedChange: function (checked) {
                    setConfig(function (prev) {
                      return Object.assign({}, prev, { testMode: checked });
                    });
                    setSaved(false);
                  },
                  disabled: isSaving,
                }),
                React.createElement(
                  components.Label,
                  {
                    key: "test-mode-label",
                    htmlFor: "stripe-test-mode",
                  },
                  "Test Mode",
                ),
                React.createElement(
                  "p",
                  {
                    key: "test-mode-help",
                    className: "text-sm text-muted-foreground ml-2",
                  },
                  "(Use test API keys and process test payments)",
                ),
              ],
            ),

            // Error Display
            error &&
              React.createElement(
                components.Alert,
                {
                  key: "error-alert",
                  variant: "destructive",
                },
                [
                  React.createElement(
                    components.AlertDescription,
                    { key: "error-desc" },
                    error,
                  ),
                ],
              ),

            // Success Display
            saved &&
              React.createElement(
                components.Alert,
                {
                  key: "success-alert",
                },
                [
                  React.createElement(
                    components.AlertDescription,
                    { key: "success-desc" },
                    "Settings saved successfully!",
                  ),
                ],
              ),

            // Save Button
            React.createElement(
              "div",
              { key: "submit-group", className: "flex justify-end pt-4" },
              [
                React.createElement(
                  components.Button,
                  {
                    key: "submit-button",
                    type: "submit",
                    disabled: isSaving,
                  },
                  isSaving ? "Saving..." : "Save Stripe Settings",
                ),
              ],
            ),
          ],
        ),
      ]),
    ]);
  };

  // Payment Method Component
  var PaymentMethodComponent = function (props) {
    var context = props.context || {};
    var pluginId = props.pluginId;
    var api = props.api;
    var components = props.components;
    var utils = props.utils;
    var cart = context.cart;
    var onSuccess = context.onSuccess;

    var configState = useState(null);
    var config = configState[0];
    var setConfig = configState[1];

    var cardNumberState = useState("");
    var cardNumber = cardNumberState[0];
    var setCardNumber = cardNumberState[1];

    var expiryState = useState("");
    var expiry = expiryState[0];
    var setExpiry = expiryState[1];

    var cvcState = useState("");
    var cvc = cvcState[0];
    var setCvc = cvcState[1];

    var processingState = useState(false);
    var processing = processingState[0];
    var setProcessing = processingState[1];

    var errorState = useState(null);
    var error = errorState[0];
    var setError = errorState[1];

    // Load plugin configuration
    useEffect(
      function () {
        var loadConfig = function () {
          api
            .loadConfig(pluginId)
            .then(function (savedConfig) {
              setConfig(savedConfig);
            })
            .catch(function (error) {
              console.error("Failed to load Stripe configuration:", error);
              setError("Stripe is not configured. Please contact support.");
            });
        };
        loadConfig();
      },
      [pluginId, api],
    );

    var handleSubmit = useCallback(
      function (e) {
        e.preventDefault();
        if (!config || !config.apiKey) {
          setError("Stripe is not configured properly.");
          return;
        }

        setProcessing(true);
        setError(null);

        // Simulate payment processing
        new Promise(function (resolve) {
          setTimeout(resolve, 2000);
        })
          .then(function () {
            // Simulate payment success
            var paymentId = "pi_stripe_" + Date.now();

            utils.toast({
              title: "Payment Successful",
              description: "Payment processed via Stripe. ID: " + paymentId,
            });

            if (onSuccess) {
              onSuccess(paymentId);
            }
          })
          .catch(function (err) {
            console.error("Stripe payment failed:", err);
            var errorMessage =
              "Payment failed. Please check your card details and try again.";
            setError(errorMessage);
            utils.toast({
              title: "Payment Failed",
              description: errorMessage,
              variant: "destructive",
            });
          })
          .finally(function () {
            setProcessing(false);
          });
      },
      [config, cardNumber, expiry, cvc, onSuccess, utils],
    );

    if (!config) {
      return React.createElement(
        "div",
        {
          className: "p-4 text-center text-muted-foreground",
        },
        "Loading payment configuration...",
      );
    }

    if (!config.apiKey) {
      return React.createElement(components.Alert, { variant: "destructive" }, [
        React.createElement(
          components.AlertDescription,
          { key: "error" },
          "Stripe payment is not configured. Please contact the site administrator.",
        ),
      ]);
    }

    var amount = cart ? cart.total || 0 : 0;
    var currency = cart ? cart.currency || "USD" : "USD";

    return React.createElement(components.Card, {}, [
      React.createElement(components.CardHeader, { key: "header" }, [
        React.createElement(
          components.CardTitle,
          { key: "title" },
          "Credit Card Payment",
        ),
        React.createElement(
          components.CardDescription,
          { key: "desc" },
          "Secure payment processing via Stripe" +
            (config.testMode ? " (Test Mode)" : ""),
        ),
      ]),
      React.createElement(components.CardContent, { key: "content" }, [
        React.createElement(
          "form",
          {
            key: "payment-form",
            onSubmit: handleSubmit,
            className: "space-y-4",
          },
          [
            // Card Number
            React.createElement(
              "div",
              { key: "card-number", className: "space-y-2" },
              [
                React.createElement(
                  components.Label,
                  { key: "label" },
                  "Card Number",
                ),
                React.createElement(components.Input, {
                  key: "input",
                  type: "text",
                  placeholder: "1234 5678 9012 3456",
                  value: cardNumber,
                  onChange: function (e) {
                    setCardNumber(e.target.value);
                  },
                  disabled: processing,
                  required: true,
                }),
              ],
            ),

            // Expiry and CVC Row
            React.createElement(
              "div",
              { key: "card-details", className: "grid grid-cols-2 gap-4" },
              [
                React.createElement(
                  "div",
                  { key: "expiry", className: "space-y-2" },
                  [
                    React.createElement(
                      components.Label,
                      { key: "label" },
                      "Expiry",
                    ),
                    React.createElement(components.Input, {
                      key: "input",
                      type: "text",
                      placeholder: "MM/YY",
                      value: expiry,
                      onChange: function (e) {
                        setExpiry(e.target.value);
                      },
                      disabled: processing,
                      required: true,
                    }),
                  ],
                ),
                React.createElement(
                  "div",
                  { key: "cvc", className: "space-y-2" },
                  [
                    React.createElement(
                      components.Label,
                      { key: "label" },
                      "CVC",
                    ),
                    React.createElement(components.Input, {
                      key: "input",
                      type: "text",
                      placeholder: "123",
                      value: cvc,
                      onChange: function (e) {
                        setCvc(e.target.value);
                      },
                      disabled: processing,
                      required: true,
                    }),
                  ],
                ),
              ],
            ),

            // Error Display
            error &&
              React.createElement(
                components.Alert,
                {
                  key: "error",
                  variant: "destructive",
                },
                [
                  React.createElement(
                    components.AlertDescription,
                    { key: "desc" },
                    error,
                  ),
                ],
              ),

            // Payment Amount Summary
            React.createElement(
              "div",
              {
                key: "summary",
                className: "p-3 bg-muted rounded-md text-sm",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "total",
                    className: "flex justify-between font-medium",
                  },
                  [
                    React.createElement("span", { key: "label" }, "Total:"),
                    React.createElement(
                      "span",
                      { key: "amount" },
                      utils.formatCurrency(amount / 100, currency),
                    ),
                  ],
                ),
              ],
            ),

            // Pay Button
            React.createElement(
              components.Button,
              {
                key: "pay-button",
                type: "submit",
                disabled: processing || !cardNumber || !expiry || !cvc,
                className: "w-full",
              },
              processing
                ? "Processing Payment..."
                : "Pay " + utils.formatCurrency(amount / 100, currency),
            ),
          ],
        ),
      ]),
    ]);
  };

  // Checkout Confirmation Component
  var CheckoutConfirmationComponent = function (props) {
    var context = props.context || {};
    var paymentDetails = context.paymentDetails;

    if (!paymentDetails || paymentDetails.provider !== "stripe") {
      return null;
    }

    return React.createElement(
      "div",
      {
        className:
          "flex items-center space-x-2 text-sm text-muted-foreground p-2 bg-green-50 rounded-md border border-green-200",
      },
      [
        React.createElement(
          "svg",
          {
            key: "icon",
            className: "h-5 w-5 text-green-500",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
          },
          [
            React.createElement("path", {
              key: "check",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "M5 13l4 4L19 7",
            }),
          ],
        ),
        React.createElement(
          "span",
          { key: "text", className: "text-green-700" },
          "Payment securely processed by Stripe" +
            (paymentDetails.testMode ? " (Test Mode)" : ""),
        ),
      ],
    );
  };

  // Plugin Extension Points
  var extensionPoints = {
    "admin-settings": AdminSettingsComponent,
    "payment-methods": PaymentMethodComponent,
    "checkout-payment": PaymentMethodComponent, // Alternative extension point name
    "checkout-confirmation": CheckoutConfirmationComponent,
  };

  // Plugin Metadata
  var pluginMetadata = {
    name: "Stripe Payment Gateway",
    version: "2.0.0",
    description: "Process credit card payments securely with Stripe",
    author: "Ticket Platform, Inc.",
    category: "payments",
    priority: 100,
    displayName: "Credit Card (Stripe)",
    requiredPermissions: ["read:orders", "write:transactions"],
    supportedExtensionPoints: Object.keys(extensionPoints),
  };

  // Register the plugin globally
  console.log("Loading Stripe Plugin with Plugin SDK...", pluginMetadata);

  // Export plugin for the Plugin SDK loader
  window.PluginRegistry = window.PluginRegistry || [];
  window.PluginRegistry.push({
    id: "stripe-payment-plugin",
    metadata: pluginMetadata,
    extensionPoints: extensionPoints,
    // Legacy compatibility
    AdminSettingsComponent: AdminSettingsComponent,
    PaymentMethodComponent: PaymentMethodComponent,
    CheckoutConfirmationComponent: CheckoutConfirmationComponent,
  });

  console.log(
    "✅ Stripe Plugin loaded successfully with Plugin SDK context support",
  );
} // End of PluginSDK availability check

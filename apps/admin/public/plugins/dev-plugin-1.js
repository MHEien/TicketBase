/**
 * Development Test Plugin
 * This is a simple plugin for testing the dynamic import system
 */

// Make the plugin available globally
window.devPlugin1 = (function () {
  // Use React from window
  const React = window.React;

  // Create a simple payment method component
  const PaymentMethodComponent = function ({ context, configuration, plugin }) {
    const handlePayment = function () {
      if (context.onSuccess) {
        context.onSuccess("dev-payment-123");
      }
    };

    return React.createElement(
      "div",
      {
        style: {
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
        },
      },
      [
        React.createElement(
          "h3",
          { key: "title" },
          "Development Test Payment Method",
        ),
        React.createElement(
          "p",
          { key: "desc" },
          `This is a test payment method from ${plugin.name}`,
        ),
        React.createElement(
          "p",
          { key: "amount" },
          `Amount: ${context.cart?.total || 0}`,
        ),
        React.createElement(
          "button",
          {
            key: "button",
            onClick: handlePayment,
            style: {
              backgroundColor: "#4CAF50",
              border: "none",
              color: "white",
              padding: "10px 20px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px",
              margin: "4px 2px",
              cursor: "pointer",
              borderRadius: "4px",
            },
          },
          "Complete Test Payment",
        ),
      ],
    );
  };

  // Create a simple admin settings component
  const AdminSettingsComponent = function ({ context, configuration, plugin }) {
    return React.createElement("div", null, [
      React.createElement("h3", { key: "title" }, "Plugin Settings"),
      React.createElement(
        "p",
        { key: "desc" },
        `This is the settings panel for ${plugin.name}`,
      ),
      React.createElement(
        "p",
        { key: "config" },
        `Current config: ${JSON.stringify(configuration)}`,
      ),
    ]);
  };

  // Return the plugin definition
  return {
    name: "Development Test Plugin",
    version: "1.0.0",
    description: "A test plugin for development",
    category: "payment",
    metadata: {
      author: "Dev Team",
      priority: 10,
    },
    // Export extension points
    extensionPoints: {
      "payment-methods": PaymentMethodComponent,
      "admin-settings": AdminSettingsComponent,
    },
  };
})();

// For compatibility with dynamic imports
if (typeof exports !== "undefined") {
  exports.default = window.devPlugin1;
}

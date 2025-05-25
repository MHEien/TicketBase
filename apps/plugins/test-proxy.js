const axios = require('axios');

// Test configuration
const config = {
  baseUrl: 'http://localhost:4000',
  tenantId: 'test-tenant-123',
  pluginId: 'payment-gateway',
  pathSuffix: 'process-payment',
};

// Test payload
const payload = {
  amount: 100.5,
  currency: 'USD',
  paymentMethod: 'credit-card',
  cardDetails: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
  },
};

// Execute test
async function runTest() {
  console.log('🧪 Testing Plugin Proxy API');
  console.log(
    `🔗 URL: ${config.baseUrl}/api/plugin-proxy/${config.pluginId}/${config.pathSuffix}`,
  );
  console.log(`👤 Tenant ID: ${config.tenantId}`);
  console.log(`📦 Payload: ${JSON.stringify(payload, null, 2)}`);

  try {
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/api/plugin-proxy/${config.pluginId}/${config.pathSuffix}`,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': config.tenantId,
      },
      data: payload,
    });

    console.log('\n✅ Success!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response: ${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.error('\n❌ Error!');

    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(
        `📄 Response: ${JSON.stringify(error.response.data, null, 2)}`,
      );
    } else {
      console.error(`📄 Error: ${error.message}`);
    }
  }
}

// Run the test
runTest();

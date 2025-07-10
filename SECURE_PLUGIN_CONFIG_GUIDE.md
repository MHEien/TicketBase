# 🔒 Secure Plugin Configuration System

## Overview

This system provides enterprise-grade security for storing and managing plugin configurations, with automatic encryption of sensitive fields, comprehensive audit logging, and tenant isolation.

## ✅ **Key Security Features**

### **🔐 Automatic Encryption**
- **AES-256-CBC encryption** for sensitive fields
- **Unique initialization vectors (IV)** for each encrypted value
- **Configurable encryption keys** via environment variables
- **Transparent encryption/decryption** - plugins don't handle crypto

### **🏢 Tenant Isolation**
- **Complete data separation** between organizations
- **JWT-based tenant extraction** from authentication
- **No cross-tenant access** possible
- **Secure multi-tenancy** at the database level

### **📊 Comprehensive Audit Trail**
- **All configuration operations logged** (CREATE, UPDATE, DELETE, VIEW)
- **Change tracking** with before/after values
- **Sensitive field access tracking**
- **IP address and user agent logging**
- **Failed operation logging** for security monitoring

### **🛡️ Schema-Based Security**
- **Automatic sensitive field detection** via plugin.json
- **Schema validation** against defined structure
- **Type checking and pattern validation**
- **Required field enforcement**

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │ Plugins Server  │
│                 │    │   (Port 4000)   │    │   (Port 4001)   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Plugin SDK      │───▶│ Auth & Proxy    │───▶│ SecureConfig    │
│ - saveConfig()  │    │ - JWT Auth      │    │ Service         │
│ - loadConfig()  │    │ - Route Proxy   │    │ - Encryption    │
│ - Toast/Error   │    │ - Validation    │    │ - Audit Logs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                               ┌─────────────────┐
                                               │    MongoDB      │
                                               │                 │
                                               │ PluginConfig    │
                                               │ ConfigAudit     │
                                               └─────────────────┘
```

## 📋 **Implementation Guide**

### **1. Plugin Configuration Schema**

In your `plugin.json`, define which fields should be encrypted:

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "apiKey": {
        "type": "string",
        "title": "Secret API Key",
        "pattern": "^sk_(test_|live_)",
        "minLength": 20
      },
      "publicKey": {
        "type": "string", 
        "title": "Public Key"
      }
    },
    "required": ["apiKey"],
    "sensitiveFields": ["apiKey"]  // 🔑 This field will be encrypted
  }
}
```

### **2. Frontend Integration**

Use the Plugin SDK to safely handle configurations:

```typescript
// In your plugin component
const { config, loading, error, saveConfig } = usePluginConfig<MyConfig>(pluginId);

const handleSave = async (newConfig: MyConfig) => {
  try {
    // 🔐 Sensitive fields are automatically encrypted
    // 📊 All changes are audited  
    // 🏢 Tenant isolation is enforced
    await saveConfig(newConfig);
  } catch (error) {
    // Error handling with user feedback
  }
};
```

### **3. Environment Configuration**

Set up encryption keys in your environment:

```bash
# .env file
PLUGIN_CONFIG_SECRET=your-very-secure-256-bit-encryption-key-here
```

## 🔍 **Data Storage Structure**

### **PluginConfig Collection**
```typescript
{
  tenantId: "org_123",
  pluginId: "stripe-payment-plugin", 
  version: "2.0.0",
  
  // Plain text configuration
  publicConfig: {
    publishableKey: "pk_test_...",
    testMode: true
  },
  
  // Encrypted sensitive fields
  encryptedSecrets: {
    apiKey: {
      value: "a1b2c3d4...",      // AES-256 encrypted
      iv: "f5e6d7c8...",         // Unique IV
      algorithm: "aes-256-cbc"   // Algorithm used
    }
  },
  
  configSchema: { /* validation schema */ },
  lastValidated: "2024-01-15T10:00:00Z",
  validationErrors: []
}
```

### **ConfigAudit Collection**
```typescript
{
  tenantId: "org_123",
  pluginId: "stripe-payment-plugin",
  userId: "user_456",
  action: "UPDATE",
  
  previousConfig: { /* previous values */ },
  newConfig: { /* new values */ },
  changedFields: ["apiKey", "testMode"],
  sensitiveFieldsAccessed: ["apiKey"],
  
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: "2024-01-15T10:00:00Z",
  success: true
}
```

## 🛠️ **API Endpoints**

### **Configuration Management**
- `POST /api/plugins/{id}/config` - Save configuration
- `GET /api/plugins/{id}/config` - Load configuration  
- `DELETE /api/plugins/{id}/config` - Delete configuration

### **Audit & Monitoring**
- `GET /api/plugins/{id}/audit` - Get audit logs
- `GET /api/plugins/config/health` - System health check

## 🚨 **Security Best Practices**

### **✅ DO:**
- **Set custom encryption keys** in production (`PLUGIN_CONFIG_SECRET`)
- **Define sensitive fields** in plugin.json `sensitiveFields` array
- **Use strong API key patterns** in schema validation
- **Monitor audit logs** for suspicious activity
- **Rotate encryption keys** periodically in production

### **❌ DON'T:**
- Use default encryption keys in production
- Store sensitive data in `publicConfig` fields
- Hardcode secrets in plugin source code
- Share encryption keys between environments
- Ignore audit log alerts

## 🔄 **Migration from Old System**

If migrating from the old configuration system:

1. **Update plugin.json** with `configSchema` and `sensitiveFields`
2. **Test encryption** in development environment  
3. **Migrate existing configs** using the secure service
4. **Update frontend code** to use Plugin SDK
5. **Monitor audit logs** during migration

## 📊 **Monitoring & Alerts**

### **Health Checks**
```typescript
const health = await secureConfigService.healthCheck();
// {
//   status: 'healthy',
//   details: {
//     database: true,
//     encryption: true
//   }
// }
```

### **Audit Monitoring**
- Track failed configuration access attempts
- Monitor unusual access patterns
- Alert on encryption/decryption failures
- Log all sensitive field access

## 🎯 **Example: Stripe Plugin**

See `apps/admin/examples/stripe-plugin-v2/` for a complete implementation:

- ✅ **Secure API key storage** (encrypted)
- ✅ **Public key storage** (plain text)
- ✅ **Schema validation** with patterns
- ✅ **User-friendly interface** with security indicators
- ✅ **Comprehensive error handling**

## 🔐 **Security Guarantees**

1. **Encryption at Rest**: All sensitive fields encrypted with AES-256-CBC
2. **Tenant Isolation**: Complete data separation between organizations  
3. **Audit Trail**: Every operation logged with full context
4. **Access Control**: JWT-based authentication with role validation
5. **Schema Validation**: Type-safe configuration with runtime checks
6. **Error Security**: Failed operations logged, sensitive data never exposed

This system provides enterprise-grade security for plugin configurations while maintaining ease of use for developers. The automatic encryption, comprehensive auditing, and tenant isolation ensure that sensitive user data is protected at all times. 
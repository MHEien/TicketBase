# DNS Setup Guide for heien.dev

This guide helps you configure DNS records for your production ticket system deployment.

## 🌐 Required DNS Records

Configure the following DNS records to point to your server's IP address:

### A Records (IPv4)

Replace `YOUR_SERVER_IP` with your actual server's IP address:

```
Record Type: A
Name: heien.dev
Value: YOUR_SERVER_IP
TTL: 300 (5 minutes)

Record Type: A
Name: www.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: api.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: plugins.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: traefik.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: adminer.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: minio.heien.dev
Value: YOUR_SERVER_IP
TTL: 300

Record Type: A
Name: s3.heien.dev
Value: YOUR_SERVER_IP
TTL: 300
```

### AAAA Records (IPv6) - Optional

If your server has IPv6 support, add these records:

```
Record Type: AAAA
Name: heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: www.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: api.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: plugins.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: traefik.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: adminer.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: minio.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300

Record Type: AAAA
Name: s3.heien.dev
Value: YOUR_SERVER_IPv6
TTL: 300
```

## 📋 DNS Configuration Steps

### Step 1: Access Your Domain Registrar

1. Log in to your domain registrar (where you bought heien.dev)
2. Navigate to DNS management or DNS settings
3. Look for "DNS Records", "DNS Zone", or similar

### Step 2: Add DNS Records

1. **Delete any existing A records** for heien.dev if they exist
2. **Add each A record** listed above
3. **Set TTL to 300 seconds** (5 minutes) for faster propagation during setup
4. **Save changes**

### Step 3: Verify DNS Propagation

Use these tools to check if your DNS records are propagating:

```bash
# Check from command line
dig heien.dev
dig api.heien.dev
dig www.heien.dev

# Or use online tools:
# - https://www.whatsmydns.net/
# - https://dnschecker.org/
# - https://www.nslookup.io/
```

## 🕐 DNS Propagation Time

- **Local ISP**: 5-30 minutes
- **Global propagation**: 1-24 hours
- **Worst case**: Up to 48 hours

## 🔧 Common DNS Providers

### Cloudflare

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to DNS > Records
4. Add A records as shown above
5. Set Proxy status to "DNS only" (gray cloud) initially

### Namecheap

1. Log in to Namecheap account
2. Go to Domain List
3. Click "Manage" next to your domain
4. Go to "Advanced DNS"
5. Add A records as shown above

### GoDaddy

1. Log in to GoDaddy account
2. Go to My Products > DNS
3. Select your domain
4. Add A records as shown above

### Google Domains

1. Log in to Google Domains
2. Select your domain
3. Go to DNS
4. Add A records as shown above

## 🔒 SSL Certificate Notes

- **Let's Encrypt** will automatically issue SSL certificates for all domains
- **Initial certificate generation** may take 1-5 minutes
- **Certificates auto-renew** every 60 days
- **Rate limits**: 50 certificates per registered domain per week

## 🧪 Testing Your Setup

After DNS propagation, test your setup:

```bash
# Test main application
curl -I https://heien.dev

# Test API
curl -I https://api.heien.dev

# Test plugin server
curl -I https://plugins.heien.dev

# Test Traefik dashboard
curl -I https://traefik.heien.dev
```

## 🚨 Troubleshooting

### DNS Not Propagating

- Check TTL values (use 300 seconds for faster propagation)
- Verify records are correctly entered
- Try different DNS checker tools
- Flush local DNS cache: `sudo systemctl flush-dns` (Linux) or `ipconfig /flushdns` (Windows)

### SSL Certificate Issues

- Check DNS propagation first
- Verify ports 80 and 443 are open
- Check Traefik logs: `docker-compose logs traefik`
- Wait 5-10 minutes for initial certificate generation

### Subdomain Not Working

- Verify A record exists for the subdomain
- Check domain registrar's DNS settings
- Ensure no conflicting CNAME records exist

## 📝 Sample DNS Configuration

Here's what your DNS configuration should look like:

```
Type  Name                Value           TTL
A     heien.dev          203.0.113.1     300
A     www.heien.dev      203.0.113.1     300
A     api.heien.dev      203.0.113.1     300
A     plugins.heien.dev  203.0.113.1     300
A     traefik.heien.dev  203.0.113.1     300
A     adminer.heien.dev  203.0.113.1     300
A     minio.heien.dev    203.0.113.1     300
A     s3.heien.dev       203.0.113.1     300
```

## 🔄 Post-Deployment Changes

After successful deployment, you can:

1. **Increase TTL** to 3600 (1 hour) or 86400 (24 hours) for better caching
2. **Enable Cloudflare proxy** if using Cloudflare (orange cloud)
3. **Add CNAME records** for additional aliases if needed

## 📞 Support

If you need help with DNS configuration:

1. Check your domain registrar's documentation
2. Contact your domain registrar's support
3. Use online DNS testing tools
4. Check the production setup logs for specific errors

Remember: DNS changes can take time to propagate globally, so be patient!

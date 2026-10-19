# Production Deployment Guide

This guide details how to deploy the **Oxygen Consulting & Marketing** web application on an Ubuntu Linux server using Kestrel, systemd, Nginx as a reverse proxy, and Let's Encrypt for TLS/SSL encryption. An optional Windows Server (IIS) deployment guide is also provided.

---

## 1. Linux VPS Deployment (Ubuntu 22.04 / 24.04 LTS)

### Architecture Overview
```
Client Browser (HTTPS :443)
       │
       ▼
Nginx Reverse Proxy (SSL Termination, Static Caching, Security Headers)
       │
       ▼ (HTTP :5000 via loopback)
Kestrel Web Server (.NET 8 Runtime)
       │
       ▼
ASP.NET Core MVC Application (OxygenMarketing.dll)
       │
       ▼
SQLite Database (/var/data/oxygen/OxygenMarketing.db) / SQL Server
```

---

### Step 1: Server Provisioning & Prerequisites

Connect to your Ubuntu server via SSH and install the required runtimes:

```bash
# Update package repositories
sudo apt-get update && sudo apt-get upgrade -y

# Install .NET 8 ASP.NET Core Runtime, Nginx, and Certbot
sudo apt-get install -y aspnetcore-runtime-8.0 nginx certbot python3-certbot-nginx
```

Verify the .NET runtime installation:
```bash
dotnet --info
```

---

### Step 2: Prepare Application Directories

Create dedicated directories for the application binaries, uploaded assets, and database storage:

```bash
# Application binaries
sudo mkdir -p /var/www/oxygen

# User-uploaded files
sudo mkdir -p /var/www/oxygen/wwwroot/uploads

# Persistent SQLite database storage
sudo mkdir -p /var/data/oxygen

# Application logs
sudo mkdir -p /var/log/oxygen

# Assign ownership to the web server service account (www-data)
sudo chown -R www-data:www-data /var/www/oxygen /var/data/oxygen /var/log/oxygen
sudo chmod -R 750 /var/www/oxygen /var/data/oxygen
sudo chmod -R 775 /var/www/oxygen/wwwroot/uploads /var/log/oxygen
```

---

### Step 3: Publish and Transfer Application

On your build machine or CI runner, publish the Release build:

```bash
dotnet publish src/OxygenMarketing/OxygenMarketing.csproj -c Release -o ./publish
```

Transfer the contents of `./publish` to `/var/www/oxygen` on the server using `rsync` or `scp`:

```bash
rsync -avz --delete ./publish/ user@your-server-ip:/var/www/oxygen/
```

Ensure ownership is restored after deployment:
```bash
sudo chown -R www-data:www-data /var/www/oxygen
```

---

### Step 4: Configure Production Settings

Create `appsettings.Production.json` in `/var/www/oxygen/` using `appsettings.Production.example.json` as a baseline:

```bash
sudo cp /var/www/oxygen/appsettings.Production.example.json /var/www/oxygen/appsettings.Production.json
sudo nano /var/www/oxygen/appsettings.Production.json
```

Key production settings:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=/var/data/oxygen/OxygenMarketing.db"
  },
  "AdminUser": {
    "Email": "admin@oxygen.jo",
    "Password": "",
    "FullName": "Oxygen Executive Administrator"
  },
  "ContactSettings": {
    "NotificationEmail": "info@oxygen.jo"
  },
  "Smtp": {
    "Enabled": false,
    "Host": "smtp.yourprovider.com",
    "Port": 587,
    "Username": "",
    "Password": "",
    "FromEmail": "no-reply@oxygen.jo",
    "EnableSsl": true
  },
  "AllowedHosts": "yourdomain.com;www.yourdomain.com"
}
```

> **Security Note**: Store the production admin password in systemd environment overrides rather than plaintext files (see Step 5).

---

### Step 5: Configure systemd Service

Create the service definition file at `/etc/systemd/system/oxygen.service`:

```ini
[Unit]
Description=Oxygen Consulting & Marketing Web Platform (.NET 8)
After=network.target

[Service]
WorkingDirectory=/var/www/oxygen
ExecStart=/usr/bin/dotnet /var/www/oxygen/OxygenMarketing.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=oxygen-marketing
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000

# Securely set admin password and SMTP password via environment overrides:
Environment=AdminUser__Password=YOUR_SECURE_ADMIN_PASSWORD_HERE
# Environment=Smtp__Password=YOUR_SECURE_SMTP_PASSWORD_HERE

[Install]
WantedBy=multi-user.target
```

Reload systemd, enable, and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable oxygen.service
sudo systemctl start oxygen.service
```

Check service status and verify it is running:
```bash
sudo systemctl status oxygen.service
```

---

### Step 6: Configure Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/oxygen.jo`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name oxygen.jo www.oxygen.jo;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name oxygen.jo www.oxygen.jo;

    # SSL certificate paths (configured by Certbot in Step 7)
    # ssl_certificate /etc/letsencrypt/live/oxygen.jo/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/oxygen.jo/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Uploads limit
    client_max_body_size 10M;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_read_timeout 90;
    }

    # Static file caching for static assets
    location ~* \.(css|js|woff2|png|jpg|svg|ico)$ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable the site configuration and test for syntax errors:
```bash
sudo ln -s /etc/nginx/sites-available/oxygen.jo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 7: Obtain Let's Encrypt TLS/SSL Certificate

Run Certbot to automatically configure SSL:

```bash
sudo certbot --nginx -d oxygen.jo -d www.oxygen.jo
```

Certbot will automatically install renewal timers (`systemctl list-timers | grep certbot`).

---

### Step 8: Database Backups

Schedule automated daily backups of the SQLite database and uploads:

```bash
# Add to root crontab via sudo crontab -e
0 3 * * * sqlite3 /var/data/oxygen/OxygenMarketing.db ".backup '/var/backups/oxygen/db-$(date +\%F).db'" && tar -czf /var/backups/oxygen/uploads-$(date +\%F).tar.gz /var/www/oxygen/wwwroot/uploads
```

---

## 2. Windows Server (IIS) Deployment

1. **Install IIS Prerequisites**:
   - Install **ASP.NET Core Hosting Bundle (.NET 8)** on the Windows Server.
   - In Server Manager, ensure IIS features *WebSocket Protocol*, *HTTP Redirection*, and *Static Content* are enabled.

2. **Publish Application**:
   ```powershell
   dotnet publish src/OxygenMarketing/OxygenMarketing.csproj -c Release -o C:\inetpub\wwwroot\OxygenMarketing
   ```

3. **Configure IIS Application Pool**:
   - .NET CLR Version: **No Managed Code**.
   - Managed Pipeline Mode: **Integrated**.
   - Identity: `ApplicationPoolIdentity` (grant Read & Write permissions to `C:\inetpub\wwwroot\OxygenMarketing\wwwroot\uploads` and database directory).

4. **SSL Binding**:
   - Bind Port 443 with a trusted certificate (via Win-ACME or enterprise certificate authority).

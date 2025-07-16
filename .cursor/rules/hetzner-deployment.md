
# Hetzner Cloud Deployment - AI Pair Orchestrator Pro

## PRODUCTION DEPLOYMENT CONFIGURATION
Enterprise-grade deployment on Hetzner Cloud VPS with scalable infrastructure.

## DOCKER CONFIGURATION
```dockerfile
# ✅ REQUIRED: Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm install -g bun
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install -g bun serve
RUN bun install --production --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
```

## DOCKER COMPOSE SETUP
```yaml
# ✅ REQUIRED: Production Docker Compose
version: '3.8'

services:
  web:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: ai-pair-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - FIRECRAWL_API_KEY=${FIRECRAWL_API_KEY}
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - ai-pair-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  nginx:
    image: nginx:alpine
    container_name: ai-pair-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - web
    restart: unless-stopped
    networks:
      - ai-pair-network

  redis:
    image: redis:7-alpine
    container_name: ai-pair-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - ai-pair-network
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}

  monitoring:
    image: grafana/grafana:latest
    container_name: ai-pair-monitoring
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped
    networks:
      - ai-pair-network

volumes:
  redis_data:
  grafana_data:

networks:
  ai-pair-network:
    driver: bridge
```

## NGINX CONFIGURATION
```nginx
# ✅ REQUIRED: Production Nginx config
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://*.supabase.co; frame-src 'self' https://accounts.google.com;";
    
    upstream ai_pair_backend {
        server web:3000;
        keepalive 32;
    }
    
    server {
        listen 80;
        server_name VibeThink.com www.VibeThink.com;
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name VibeThink.com www.VibeThink.com;
        
        # SSL certificates
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        # Static files
        location /assets/ {
            alias /app/dist/assets/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://ai_pair_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Auth endpoints with stricter rate limiting
        location /auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://ai_pair_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Main application
        location / {
            proxy_pass http://ai_pair_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Fallback for SPA routing
            try_files $uri $uri/ /index.html;
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            proxy_pass http://ai_pair_backend;
        }
    }
}
```

## DEPLOYMENT SCRIPTS
```bash
#!/bin/bash
# ✅ REQUIRED: Deployment script

# deploy.sh - Production deployment script for Hetzner Cloud

set -e

echo "🚀 Starting AI Pair Orchestrator Pro deployment..."

# Configuration
BACKUP_DIR="/home/VibeThink/backups"
APP_DIR="/home/VibeThink/ai-pair-orchestrator"
COMPOSE_FILE="docker-compose.prod.yml"

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
timestamp=$(date +%Y%m%d_%H%M%S)
cp -r $APP_DIR $BACKUP_DIR/ai-pair-backup-$timestamp

# Pull latest changes
echo "📥 Pulling latest changes..."
cd $APP_DIR
git pull origin main

# Environment validation
echo "🔍 Validating environment..."
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found!"
    exit 1
fi

# Check required environment variables
required_vars=("SUPABASE_URL" "SUPABASE_ANON_KEY" "GOOGLE_CLIENT_ID" "OPENAI_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set!"
        exit 1
    fi
done

# Build and deploy
echo "🏗️ Building application..."
docker-compose -f $COMPOSE_FILE build --no-cache

echo "🔄 Stopping existing services..."
docker-compose -f $COMPOSE_FILE down

echo "🚀 Starting new services..."
docker-compose -f $COMPOSE_FILE up -d

# Health check
echo "🏥 Performing health check..."
sleep 30
if curl -f http://localhost/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed! Rolling back..."
    docker-compose -f $COMPOSE_FILE down
    cp -r $BACKUP_DIR/ai-pair-backup-$timestamp/* $APP_DIR/
    docker-compose -f $COMPOSE_FILE up -d
    exit 1
fi

# Cleanup old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
ls -t $BACKUP_DIR | tail -n +6 | xargs -r rm -rf

echo "🎉 Deployment completed successfully!"
```

## MONITORING SETUP
```yaml
# ✅ REQUIRED: Monitoring configuration
# monitoring/docker-compose.yml

version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: ai-pair-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: ai-pair-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_SECURITY_ADMIN_USER=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    restart: unless-stopped
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: ai-pair-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    restart: unless-stopped
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

## SSL CERTIFICATE MANAGEMENT
```bash
#!/bin/bash
# ✅ REQUIRED: SSL certificate renewal script

# ssl-renew.sh - Let's Encrypt SSL certificate renewal

set -e

DOMAIN="VibeThink.com"
EMAIL="admin@VibeThink.com"
WEBROOT="/var/www/certbot"

echo "🔒 Renewing SSL certificate for $DOMAIN..."

# Create webroot directory
mkdir -p $WEBROOT

# Request certificate
certbot certonly \
    --webroot \
    --webroot-path=$WEBROOT \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN \
    -d www.$DOMAIN

# Copy certificates to nginx directory
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /home/VibeThink/ai-pair-orchestrator/nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /home/VibeThink/ai-pair-orchestrator/nginx/ssl/

# Reload nginx
docker-compose -f /home/VibeThink/ai-pair-orchestrator/docker-compose.prod.yml exec nginx nginx -s reload

echo "✅ SSL certificate renewed successfully!"
```

## BACKUP STRATEGY
```bash
#!/bin/bash
# ✅ REQUIRED: Backup script

# backup.sh - Automated backup for AI Pair Orchestrator Pro

set -e

BACKUP_DIR="/home/VibeThink/backups"
APP_DIR="/home/VibeThink/ai-pair-orchestrator"
S3_BUCKET="ai-pair-backups"
timestamp=$(date +%Y%m%d_%H%M%S)

echo "💾 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR/backup-$timestamp

# Backup application files
tar -czf $BACKUP_DIR/backup-$timestamp/app-files.tar.gz -C $APP_DIR .

# Backup Docker volumes
docker run --rm \
    -v ai-pair-orchestrator_redis_data:/source:ro \
    -v $BACKUP_DIR/backup-$timestamp:/backup \
    alpine tar -czf /backup/redis-data.tar.gz -C /source .

# Backup environment files
cp $APP_DIR/.env.production $BACKUP_DIR/backup-$timestamp/

# Upload to S3 (if configured)
if [ ! -z "$AWS_ACCESS_KEY_ID" ]; then
    echo "☁️ Uploading to S3..."
    aws s3 sync $BACKUP_DIR/backup-$timestamp s3://$S3_BUCKET/backups/backup-$timestamp
fi

# Cleanup local backups older than 7 days
find $BACKUP_DIR -type d -name "backup-*" -mtime +7 -exec rm -rf {} \;

echo "✅ Backup completed successfully!"
```

**Hetzner Deployment Success Criteria**: Zero-downtime deployments, SSL automation, monitoring, automated backups.

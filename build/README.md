# SmartEat Deployment Guide

This directory contains all the files needed to deploy SmartEat on your Linux VM.

## Files Overview

- `docker-compose.yml` - Orchestrates all services
- `nginx.conf` - Nginx reverse proxy configuration for external access
- `env.template` - Template for environment variables

## Prerequisites

- Docker and Docker Compose installed
- MongoDB running on the host VM
- Nginx installed on the host VM

## Setup Steps

### 1. Environment Variables

**Option A: VM Shell Profile (Recommended)**
Add these to your VM's `~/.bashrc` or `~/.zshrc`:
```bash
export GEMINI_API_KEY="your_actual_key_here"
export USDA_API_KEY="your_actual_key_here"
export GROQ_API_KEY="your_actual_key_here"
export TOKEN_SECRET="your_secret_here"
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export HOSTNAME="your.domain.com"

# Reload shell
source ~/.bashrc
```

**Option B: .env File**
Copy the template and fill in your values:
```bash
cp env.template .env
# Edit .env with your actual API keys and configuration
```

**Why this approach is clean:**
- Environment variables are set once on the VM
- Docker Compose automatically picks them up
- No complex build arguments or scripts needed
- Simple and straightforward

### 2. Build and Run Services

```bash
# Build all images
docker compose build

# Start all services
docker compose up -d

# Check status
docker compose ps
```

### 3. Configure Nginx

Copy the nginx config to your nginx sites:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/smarteat
sudo ln -s /etc/nginx/sites-available/smarteat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Setup

Ensure your SSL certificates are in `/etc/nginx/ssl/`:
- `selfsigned.crt`
- `selfsigned.key`

Or update the nginx.conf with your actual certificate paths.

## Service Ports

- **Client (Frontend)**: 3000 → 80 (container)
- **API Gateway**: 3002
- **Auth Service**: 4001 → 3000 (container)
- **Exercise Service**: 3003 + 50055 (gRPC)
- **Meal Analysis Service**: 3000 + 50052/50053/50054 (gRPC)
- **Recommendations Service**: 3001

## MongoDB Connection

Services connect to MongoDB using `host.docker.internal:27017` to access the MongoDB instance running on your VM.

## Troubleshooting

- Check logs: `docker compose logs [service-name]`
- Restart services: `docker compose restart [service-name]`
- Rebuild: `docker compose down && docker compose build --no-cache && docker compose up -d`

# Environment Setup Guide - Anchor OS

**Version**: 1.0  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Files](#environment-files)
3. [Environment Variables Reference](#environment-variables-reference)
4. [Firebase Project Configuration](#firebase-project-configuration)
5. [Local Development Setup](#local-development-setup)
6. [LXC Container Deployment](#lxc-container-deployment)
7. [Tailscale Integration](#tailscale-integration)
8. [Build & Deploy Commands](#build--deploy-commands)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Anchor OS uses environment-specific configuration to manage connections to different Firebase projects and deployment targets. The application supports three environments:

| Environment | Firebase Project | Hosting URL | Purpose | Access |
|------------|------------------|-------------|---------|--------|
| **Development** | anchor-os-dev-1c6ec | https://anchor-os-dev-1c6ec.web.app/ | Testing & experimentation | Public |
| **Staging** | anchor-os-staging | https://anchor-os-staging.web.app/ | Pre-production validation | Public |
| **Production** | anchor-os | https://anchor-os.web.app/ | Live application | Public |

All environments are hosted on **Firebase Hosting** (Google Cloud CDN) with automatic SSL/TLS.

### Local Development Environment

For local development with hot reload, Teeto uses a **Tailscale-only** development server:

- **LXC Container**: LXC 107 (192.168.0.57)
- **Tailscale URL**: https://anchor.tail2fa2e.ts.net:5173
- **Purpose**: Local development with instant hot reload
- **Access**: Teeto only (via Tailscale network)

---

## Environment Files

### File Structure

```
anchor-os/
├── .env.development      # Development environment (git-ignored)
├── .env.staging         # Staging environment (git-ignored)
├── .env.production      # Production environment (git-ignored)
├── .env.example         # Template file (committed to git)
└── src/config/
    └── firebase.ts      # Firebase configuration (hardcoded per environment)
```

### .env.example Template

Create this file in the project root:

```bash
# ============================================================================
# ANCHOR OS - ENVIRONMENT VARIABLES
# ============================================================================
#
# This is a template file. Copy it to create environment-specific files:
#   - .env.development  (for local development)
#   - .env.staging      (for staging deployment)
#   - .env.production   (for production deployment)
#
# IMPORTANT: Never commit actual .env files to git!
# ============================================================================

# ----------------------------------------------------------------------------
# ENVIRONMENT IDENTIFIER
# ----------------------------------------------------------------------------
# Determines which environment the app is running in
# Values: 'development' | 'staging' | 'production'
VITE_APP_ENV=development

# ----------------------------------------------------------------------------
# FIREBASE PROJECT SELECTION
# ----------------------------------------------------------------------------
# Determines which Firebase project to connect to
# This must match one of the project IDs configured in src/config/firebase.ts
#
# Development:  anchor-os-dev-1c6ec
# Staging:      anchor-os-staging
# Production:   anchor-os
VITE_FIREBASE_PROJECT_ID=anchor-os-dev-1c6ec

# ----------------------------------------------------------------------------
# EXTERNAL SERVICES
# ----------------------------------------------------------------------------
# Formspree contact form endpoint ID (optional)
# Get your ID from: https://formspree.io/
VITE_FORMSPREE_ID=your_formspree_endpoint_id

# ----------------------------------------------------------------------------
# FEATURE FLAGS (Optional)
# ----------------------------------------------------------------------------
# Enable/disable features in development
# VITE_ENABLE_ANALYTICS=false
# VITE_ENABLE_DEBUG_PANEL=true
# VITE_ENABLE_FIREBASE_EMULATOR=false

# ----------------------------------------------------------------------------
# DEPLOYMENT TARGET (For build scripts)
# ----------------------------------------------------------------------------
# Used by deployment scripts to determine target LXC container
# Not used by the application itself
# DEPLOY_TARGET=192.168.0.57  # LXC 107 IP address
# DEPLOY_SSH_USER=root
```

---

## Environment Variables Reference

### Required Variables

#### VITE_APP_ENV

**Type**: `string`  
**Values**: `development` | `staging` | `production`  
**Purpose**: Identifies the current environment for logging and feature flags

**Usage in Code**:

```typescript
// src/config/firebase.ts
const env = import.meta.env.VITE_APP_ENV || 'production';
console.log(`[Firebase] Initializing for ${env} environment...`);

// Conditional behavior
if (import.meta.env.VITE_APP_ENV === 'development') {
  console.debug('[Debug] Feature X enabled');
}
```

**Default**: `production` (if not set)

---

#### VITE_FIREBASE_PROJECT_ID

**Type**: `string`  
**Values**: `anchor-os-dev-1c6ec` | `anchor-os-staging` | `anchor-os`  
**Purpose**: Selects which Firebase project configuration to use

**Usage in Code**:

```typescript
// src/config/firebase.ts
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anchor-os';

// Firebase configurations for each environment
const configs: Record<string, FirebaseConfig> = {
  'anchor-os': { /* production config */ },
  'anchor-os-staging': { /* staging config */ },
  'anchor-os-dev-1c6ec': { /* dev config */ },
};

const firebaseConfig = configs[projectId] || configs['anchor-os'];
```

**Default**: `anchor-os` (production)

---

### Optional Variables

#### VITE_FORMSPREE_ID

**Type**: `string`  
**Purpose**: Contact form endpoint for user feedback

**Usage in Code**:

```typescript
// src/components/ContactModal.tsx
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

if (!FORMSPREE_ID) {
  console.warn('Formspree ID not configured');
  return null;
}

const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
  method: 'POST',
  body: JSON.stringify(formData),
});
```

**Default**: `undefined` (contact form disabled)

---

#### import.meta.env.DEV

**Type**: `boolean`  
**Provided by**: Vite (automatically set)  
**Purpose**: True in development mode, false in production builds

**Usage in Code**:

```typescript
// Conditional debug logging
if (import.meta.env.DEV) {
  console.debug('[AuthContext] Session expired');
}

// Development-only features
if (import.meta.env.DEV) {
  // Show diagnostic panel
}
```

---

## Firebase Project Configuration

### Hardcoded Configurations

Firebase credentials are **hardcoded** in `src/config/firebase.ts` (not in environment variables) because:
1. They are public client credentials (not secrets)
2. They include apiKey, authDomain, etc. which are safe to expose
3. Firebase security is enforced by Firestore security rules, not client credentials

**File**: `src/config/firebase.ts`

```typescript
const configs: Record<string, {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}> = {
  // Production
  'anchor-os': {
    apiKey: "AIzaSyBiJ9rSE11D29A-356F9KtzvnTV6Ajs_mQ",
    authDomain: "anchor-os.firebaseapp.com",
    projectId: "anchor-os",
    storageBucket: "anchor-os.firebasestorage.app",
    messagingSenderId: "501329205014",
    appId: "1:501329205014:web:1092c50e54faa5216ea237",
    measurementId: "G-LBNK80WWNS"
  },
  
  // Staging
  'anchor-os-staging': {
    apiKey: "AIzaSyDoQevJKyequof4p1XdIXCPz3hE3QaKSUc",
    authDomain: "anchor-os-staging.firebaseapp.com",
    projectId: "anchor-os-staging",
    storageBucket: "anchor-os-staging.firebasestorage.app",
    messagingSenderId: "251281982839",
    appId: "1:251281982839:web:bae102a18f2d209432cd72"
  },
  
  // Development
  'anchor-os-dev-1c6ec': {
    apiKey: "AIzaSyAcRCcHADYhsh1YLo_qZs4sXLgLEEJd5PA",
    authDomain: "anchor-os-dev-1c6ec.firebaseapp.com",
    projectId: "anchor-os-dev-1c6ec",
    storageBucket: "anchor-os-dev-1c6ec.firebasestorage.app",
    messagingSenderId: "151437822604",
    appId: "1:151437822604:web:fdd06a38842d7992d109a9"
  }
};
```

### Environment Selection Logic

```typescript
// 1. Read project ID from environment variable
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'anchor-os';

// 2. Select configuration
const firebaseConfig = configs[projectId] || configs['anchor-os'];

// 3. Log which environment we're connecting to
const env = import.meta.env.VITE_APP_ENV || 'production';
console.log(`[Firebase] Initializing for ${env} environment (${projectId})...`);

// 4. Initialize Firebase
export const app = initializeApp(firebaseConfig);
```

---

## Local Development Setup

### Prerequisites

- Node.js 20+ installed
- npm 10+ installed
- Git configured
- Tailscale installed and authenticated

### Step 1: Clone Repository

```bash
# Clone via SSH (requires GitHub access)
git clone git@github.com:yourusername/anchor-os.git
cd anchor-os

# Or clone via HTTPS
git clone https://github.com/yourusername/anchor-os.git
cd anchor-os
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Development Environment File

```bash
# Copy template
cp .env.example .env.development

# Edit file
nano .env.development
```

**Development Configuration**:

```bash
VITE_APP_ENV=development
VITE_FIREBASE_PROJECT_ID=anchor-os-dev-1c6ec
VITE_FORMSPREE_ID=your_formspree_id  # Optional
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output**:

```
VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

[Firebase] Initializing for development environment (anchor-os-dev-1c6ec)...
[Firebase] Connected to anchor-os-dev-1c6ec
```

### Step 5: Access via Browser

```bash
# Open in browser
open http://localhost:5173

# Or via Tailscale IP (if accessing from another device)
open http://100.x.x.x:5173
```

---

## Firebase Hosting Deployment

### Deployment Overview

Anchor OS is deployed to Firebase Hosting (Google Cloud CDN), not self-hosted. The LXC container is used **only for local development** and building the application before deploying to Firebase.

**Deployment Flow**:
```
Local Development (LXC) → Build → Deploy to Firebase Hosting → Live on CDN
```

### Container Configuration (Development Only)

**Current Setup**: LXC 107 on Dell OptiPlex 5090 (Proxmox VE)

| Property | Value |
|---------|--------|
| **Container ID** | 107 |
| **Hostname** | anchor |
| **OS** | Ubuntu 24.04 LTS |
| **IP Address (LAN)** | 192.168.0.57 |
| **IP Address (Tailscale)** | 100.112.129.21 |
| **Tailscale Hostname** | anchor.tail2fa2e.ts.net |
| **Container Type** | Unprivileged |
| **Docker Version** | 28.5.1 (not 29.x - see git history for Docker issues) |
| **Purpose** | Local development & build environment |

### Deployment Process

#### Step 1: SSH into Container

```bash
# Via Tailscale (recommended - works from anywhere)
ssh root@anchor.tail2fa2e.ts.net

# Via LAN (only from local network)
ssh root@192.168.0.57
```

#### Step 2: Navigate to Application Directory

```bash
cd /root/anchor-os
```

#### Step 3: Pull Latest Code

```bash
git pull origin master
```

#### Step 4: Install Dependencies (If package.json Changed)

```bash
npm install
```

#### Step 5: Run Tests

```bash
# Run unit tests
npm run test:run

# Check for errors
echo $?  # Should output 0 if tests passed
```

#### Step 6-8: Build & Deploy (Automated)

WE ONE COMMAND for Build, Test, and Deploy.

```bash
# Deploy to development
./DEPLOY_PIPELINE.sh --env=development

# Deploy to staging
./DEPLOY_PIPELINE.sh --env=staging

# Deploy to production (fast)
./DEPLOY_PIPELINE.sh --env=production --skip-e2e
```

**Deployment Time**: ~30-60 seconds (CDN propagation)

#### Step 8: Verify Deployment

```bash
# Check deployment status
firebase hosting:channel:list

# Test the deployed URL
curl https://anchor-os-staging.web.app/

# Or open in browser
# https://anchor-os-staging.web.app/
```

### Local Development Server (Optional)

For local development with hot reload:

```bash
# Start Vite dev server
npm run dev

# Access via Tailscale
# https://anchor.tail2fa2e.ts.net:5173

# Access via LAN (same network only)
# http://192.168.0.57:5173
```

**Note**: The dev server is **NOT** for production use. It's only for local development with instant hot module replacement (HMR).

---

## Tailscale Integration

### Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TAILSCALE NETWORK                        │
│                   (tail2fa2e.ts.net)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Desktop    │      │    Mobile    │                    │
│  │  (Browser)   │      │   (Safari)   │                    │
│  └──────┬───────┘      └──────┬───────┘                    │
│         │                     │                             │
│         └──────────┬──────────┘                             │
│                    │                                        │
│         ┌──────────▼───────────┐                           │
│         │   LXC 107 (Anchor)   │                           │
│         │  192.168.0.57        │                           │
│         │  100.112.129.21      │                           │
│         │  :4173 (staging)     │                           │
│         └──────────────────────┘                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ACL Configuration

**File**: Tailscale Admin Console → Access Controls

```json
{
  "tagOwners": {
    "tag:anchor": ["teeto@adedamola.us"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["teeto@adedamola.us", "wife@example.com", "sil@example.com"],
      "dst": ["tag:anchor:*"]
    }
  ]
}
```

### Device Configuration

**Anchor OS LXC Container**:

```bash
# Install Tailscale (first time only)
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up --advertise-tags=tag:anchor

# Verify connection
tailscale status
```

**Expected Output**:

```
100.112.129.21  anchor              teeto@       linux   -
100.x.x.x       desktop-mac         teeto@       macOS   -
100.y.y.y       mobile-iphone       wife@        iOS     -
```

### Accessing Anchor OS via Tailscale

```bash
# Via Tailscale hostname (recommended)
http://anchor.tail2fa2e.ts.net:4173

# Via Tailscale IP
http://100.112.129.21:4173

# Via LAN IP (only from local network)
http://192.168.0.57:4173
```

**Note**: Anchor OS is **NOT** exposed to the public internet. It is only accessible via Tailscale zero-trust network.

---

## Build & Deploy Commands

### Development Commands

```bash
# Start dev server (hot reload enabled)
npm run dev

# Run tests in watch mode
npm run test

# Run E2E tests
npm run test:e2e
```

### Build Commands

```bash
# Build for development environment
npm run build:dev

# Build for staging environment
npm run build:staging

# Build for production environment
npm run build:production

# Generic build (uses default config)
npm run build
```

**Build Output**: `dist/` directory

### Preview Commands

```bash
# Preview production build locally
npm run preview
```

**Preview Server**: http://localhost:4173

### Deployment Script (Future)

```bash
#!/bin/bash
# deploy.sh - Automated deployment script

ENV=$1  # staging | production
TARGET_HOST=$2  # anchor.tail2fa2e.ts.net

if [ -z "$ENV" ] || [ -z "$TARGET_HOST" ]; then
  echo "Usage: ./deploy.sh <staging|production> <host>"
  exit 1
fi

echo "Deploying to $ENV environment on $TARGET_HOST..."

# 1. Build locally
npm run build:$ENV

# 2. Copy to target
rsync -avz --delete dist/ root@$TARGET_HOST:/root/anchor-os/dist/

# 3. Restart service
ssh root@$TARGET_HOST "cd /root/anchor-os && pm2 restart anchor-os"

echo "Deployment complete!"
```

**Usage**:

```bash
chmod +x deploy.sh
./deploy.sh staging anchor.tail2fa2e.ts.net
```

---

## Troubleshooting

### Issue: Application Connects to Wrong Firebase Project

**Symptom**: Data from wrong environment appears, or authentication fails

**Diagnosis**:

```bash
# Check which environment is set
cat .env.development

# Verify in browser console
# Should see: [Firebase] Initializing for development environment (anchor-os-dev-1c6ec)
```

**Solution**:

```bash
# Edit environment file
nano .env.development

# Ensure correct project ID
VITE_FIREBASE_PROJECT_ID=anchor-os-dev-1c6ec

# Restart dev server
npm run dev
```

---

### Issue: Build Fails with TypeScript Errors

**Symptom**: `npm run build` fails with type errors

**Diagnosis**:

```bash
# Check TypeScript errors
npx tsc --noEmit
```

**Solution**:

```bash
# Fix type errors in reported files
# Or temporarily bypass (not recommended)
npm run build -- --force
```

---

### Issue: Cannot Access via Tailscale

**Symptom**: `http://anchor.tail2fa2e.ts.net:4173` times out

**Diagnosis**:

```bash
# On LXC container, check Tailscale status
tailscale status

# Check if port is listening
sudo netstat -tlnp | grep 4173

# Check firewall
sudo ufw status
```

**Solution**:

```bash
# Restart Tailscale
sudo systemctl restart tailscaled

# Ensure service is running
pm2 status anchor-os

# Allow port through firewall
sudo ufw allow 4173/tcp
```

---

### Issue: Environment Variables Not Loading

**Symptom**: `import.meta.env.VITE_FIREBASE_PROJECT_ID` is `undefined`

**Diagnosis**:

```typescript
// Add debug logging to src/config/firebase.ts
console.log('ENV:', import.meta.env.VITE_APP_ENV);
console.log('PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('All env vars:', import.meta.env);
```

**Solution**:

1. Ensure environment file is named correctly (`.env.development`, NOT `.env`)
2. Ensure environment file is in project root (NOT in `src/`)
3. Ensure variables are prefixed with `VITE_` (Vite requirement)
4. Restart dev server after changing environment files

---

### Issue: Docker Version Conflict in LXC

**Symptom**: `sysctl` permission errors when using Docker 29.x in unprivileged LXC

**Diagnosis**:

```bash
# Check Docker version
docker --version
```

**Solution**:

```bash
# Downgrade to Docker 28.5.1 (see git history for Docker issues)
sudo apt-get remove docker-ce docker-ce-cli containerd.io
sudo apt-get install docker-ce=5:28.5.1-1~ubuntu.24.04~noble
```

**Reference**: Git commit history (search: Docker 28.5.1)

---

## Additional Resources

### Related Documentation

- **DEPLOYMENT_STATUS.md** - Current deployment state
- **Git commit history** - Known bugs tracked via `fix:` commit prefixes
- **CLAUDE.md** - Development constitution

### Firebase Console Links

- **Development Console**: https://console.firebase.google.com/project/anchor-os-dev-1c6ec
- **Staging Console**: https://console.firebase.google.com/project/anchor-os-staging
- **Production Console**: https://console.firebase.google.com/project/anchor-os

### Tailscale Admin

- **Admin Console**: https://login.tailscale.com/admin/machines
- **ACL Editor**: https://login.tailscale.com/admin/acls

---

## Maintenance & Updates

This document should be updated when:
- New environment variables are added
- Firebase projects are created or renamed
- Deployment infrastructure changes
- New deployment targets are added (e.g., production LXC container)

**Document Owner**: Anchor OS Core Team  
**Review Cadence**: After infrastructure changes  
**Last Reviewed**: January 26, 2026

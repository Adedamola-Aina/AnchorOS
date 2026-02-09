# Architecture Overview - Anchor OS

**Version**: 2.0  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [High-Level Architecture](#high-level-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Infrastructure Architecture](#infrastructure-architecture)
7. [Security Architecture](#security-architecture)
8. [Data Flow Patterns](#data-flow-patterns)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### What is Anchor OS?

Anchor OS is a comprehensive self-hosted personal operating system for tracking commitments and finances. It emphasizes calm, utilitarian design over gamification and operates on a privacy-first, zero-trust security model.

### Core Capabilities

- **Commitment Tracking**: Daily, weekly, monthly habits with streak tracking
- **Finance Management**: Multi-currency accounts, transactions, transfers, analytics
- **Family Mode**: Secure account sharing with granular permissions
- **Analytics**: GitHub-style heatmaps, spending insights, behavioral patterns
- **Mobile-First**: Responsive design with adaptive components

### Design Principles

1. **Calm Design**: Neutral-first color systems, minimal semantic colors, no celebratory animations
2. **Intentional Use**: Single-column layouts with breathing room, no gamification
3. **Privacy First**: Self-hosted, zero public exposure, Tailscale-only access
4. **Zero Trust**: All access verified, explicit permissions, audit trails
5. **Progressive Disclosure**: Features appear only when prerequisites are met

---

## Technology Stack

### Frontend

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2.0 | UI library |
| **Build Tool** | Vite | 5.x | Fast development & bundling |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS |
| **Routing** | React Router | 7.12.0 | Client-side navigation |
| **State Management** | React Query | 5.90.19 | Server state management |
| **Data Persistence** | idb-keyval | 6.2.2 | IndexedDB caching |
| **UI Components** | Radix UI | Latest | Accessible primitives |
| **Icons** | Lucide React | 0.562.0 | Icon library |
| **Charts** | Recharts | 3.6.0 | Data visualization |

### Backend

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **BaaS** | Firebase | 12.8.0 | Backend services |
| **Database** | Firestore | (via Firebase) | NoSQL document database |
| **Authentication** | Firebase Auth | (via Firebase) | User authentication + MFA |
| **Functions** | Cloud Functions | (via Firebase) | Serverless compute |
| **Hosting** | Self-hosted | N/A | LXC container |

### Infrastructure

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Hypervisor** | Proxmox VE | 9.1 | Container virtualization |
| **Container** | LXC | Latest | Application isolation |
| **OS** | Ubuntu | 24.04 LTS | Container operating system |
| **Network** | Tailscale | Latest | Zero-trust networking |
| **Monitoring** | Beszel | Latest | System monitoring |
| **DNS** | AdGuard Home | Latest | DNS filtering |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **ESLint** | Code linting |
| **Git** | Version control |
| **VS Code** | Primary IDE |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Desktop    │  │    Mobile    │  │    Tablet    │          │
│  │  (Browser)   │  │   (Safari)   │  │  (Browser)   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │            Public Internet (HTTPS)  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                  FIREBASE HOSTING LAYER                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │   Production: https://anchor-os.web.app/           │         │
│  │   Staging:    https://anchor-os-staging.web.app/   │         │
│  │   Dev:        https://anchor-os-dev-1c6ec.web.app/ │         │
│  │                                                     │         │
│  │   - Static SPA hosting (CDN-backed)                │         │
│  │   - Automatic SSL/TLS                              │         │
│  │   - Global edge locations                          │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
          │                  │                  │
          │         Firebase Services (Google Cloud)              │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                    BACKEND SERVICES LAYER                        │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐       │
│  │   Firestore   │  │ Firebase Auth  │  │   Cloud      │       │
│  │   (Database)  │  │   (Auth+MFA)   │  │  Functions   │       │
│  └───────────────┘  └────────────────┘  └──────────────┘       │
│                                                                  │
│  Projects:                                                       │
│    - anchor-os-dev-1c6ec (Development)                          │
│    - anchor-os-staging (Staging)                                │
│    - anchor-os (Production)                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               DEVELOPER ENVIRONMENT (Tailscale Only)             │
│  ┌────────────────────────────────────────────────────┐         │
│  │    LXC 107 - Local Development (192.168.0.57)     │         │
│  │    Ubuntu 24.04 | Node.js 20 | Vite Dev Server    │         │
│  │    Port 5173 (dev server with hot reload)         │         │
│  │                                                     │         │
│  │    Access: https://anchor.tail2fa2e.ts.net:5173   │         │
│  │    (Teeto only - for local development)           │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### System Boundaries

1. **Client Layer**: React SPA running in browser (any device, any location)
2. **Hosting Layer**: Firebase Hosting (Google Cloud CDN)
3. **Backend Layer**: Firebase services (Firestore, Auth, Functions)
4. **Developer Layer**: LXC container (Tailscale-only, local development)

### Communication Flow

**Production/Staging Users**:
```
User → Browser → HTTPS → Firebase Hosting (CDN) → Static Assets
                                ↓
User ← Browser ← Firebase Hosting ← React App ← Firebase SDK ← Firestore
```

**Developer (Local Development)**:
```
Developer → Browser → Tailscale → LXC Container → Vite Dev Server → Hot Reload
                                                       ↓
Developer ← Browser ← Tailscale ← React App (Dev) ← Firebase SDK ← Firestore (Dev)
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
├── ErrorBoundary
├── AuthContext Provider
├── FinanceContext Provider
├── NotificationContext Provider
├── TaskContext Provider
├── QueryClientProvider (React Query)
└── Router
    ├── MainLayout
    │   ├── Header
    │   ├── BottomNavigation (mobile)
    │   └── Outlet
    │       ├── /dashboard → DashboardView
    │       ├── /commitments → CommitmentsView
    │       ├── /finance → FinanceView
    │       └── /settings → SettingsView
    └── AuthLayout
        ├── LoginView
        ├── SignupView
        └── OnboardingView
```

### State Management Strategy

| State Type | Strategy | Tool | Example |
|------------|----------|------|---------|
| **Server State** | React Query | @tanstack/react-query | Accounts, transactions |
| **Authentication State** | Context API | AuthContext | Current user, auth status |
| **UI State** | Local State | useState | Modal open/closed |
| **Form State** | Local State | useState + validation | Transaction form |
| **Cache** | IndexedDB | idb-keyval | Offline persistence |

### Data Flow Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND DATA FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Component                                                       │
│     │                                                            │
│     ├─── useQuery (React Query)                                 │
│     │       │                                                    │
│     │       ├─── Service Layer (FinanceService, AccountService)│
│     │       │       │                                            │
│     │       │       ├─── Firebase SDK                           │
│     │       │       │       │                                    │
│     │       │       │       └─── Firestore                      │
│     │       │       │                                            │
│     │       │       └─── Cache (idb-keyval)                     │
│     │       │                                                    │
│     │       └─── Update Component State                         │
│     │                                                            │
│     └─── Render UI                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── mobile/         # Mobile-specific components
│   ├── shared/         # Shared components (CommandPalette, etc.)
│   └── ui/             # Base UI primitives (Button, Dialog, etc.)
├── context/            # React context providers
│   ├── AuthContext.tsx
│   ├── FinanceContext.tsx
│   └── NotificationContext.tsx
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   ├── commitments/    # Commitment tracking feature
│   ├── dashboard/      # Dashboard feature
│   ├── finance/        # Finance management feature
│   └── settings/       # Settings feature
├── hooks/              # Custom React hooks
│   ├── useFinanceService.ts
│   ├── useCommitmentService.ts
│   └── useResponsive.ts
├── services/           # Business logic & API calls
│   ├── FinanceService.ts
│   ├── AccountService.ts
│   └── TransactionService.ts
├── types/              # TypeScript type definitions
│   ├── index.ts
│   └── activity.ts
├── utils/              # Utility functions
│   ├── format.ts
│   ├── validation.ts
│   └── sanitize.ts
├── config/             # Configuration files
│   ├── firebase.ts
│   └── queryClient.ts
├── layouts/            # Layout components
│   └── MainLayout.tsx
└── App.tsx             # Root application component
```

### Routing Structure

| Route | Component | Auth Required | Family Mode |
|-------|-----------|---------------|-------------|
| `/` | LoginView | No | N/A |
| `/signup` | SignupView | No | N/A |
| `/onboarding` | OnboardingView | Yes | No |
| `/dashboard` | DashboardView | Yes | Optional |
| `/commitments` | CommitmentsView | Yes | Optional |
| `/finance` | FinanceView | Yes | Optional |
| `/settings` | SettingsView | Yes | N/A |
| `/settings/family` | FamilySettingsView | Yes | Optional |

---

## Backend Architecture

### Firebase Services

```
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │                 Firebase Auth                      │         │
│  │  - Email/Password Authentication                   │         │
│  │  - TOTP Multi-Factor Authentication                │         │
│  │  - Session Management                              │         │
│  └──────────────────┬─────────────────────────────────┘         │
│                     │                                            │
│  ┌──────────────────▼─────────────────────────────────┐         │
│  │                  Firestore                         │         │
│  │  Database Structure:                               │         │
│  │    /artifacts/anchor-os/                           │         │
│  │      ├── users/{userId}/                           │         │
│  │      │   ├── accounts/{accountId}                  │         │
│  │      │   ├── finance/{transactionId}               │         │
│  │      │   ├── commitments/{taskId}                  │         │
│  │      │   └── notifications/{notificationId}        │         │
│  │      ├── family_invitations/{inviteId}             │         │
│  │      └── family_connections/{connectionId}         │         │
│  │                                                     │         │
│  │  Security Rules:                                    │         │
│  │    - Owner-based access control                    │         │
│  │    - Permission-based sharing (read/transact/manage│         │
│  │    - Collection group queries for shared data      │         │
│  └──────────────────┬─────────────────────────────────┘         │
│                     │                                            │
│  ┌──────────────────▼─────────────────────────────────┐         │
│  │             Cloud Functions                        │         │
│  │  - getSharedAccountTransactions                    │         │
│  │  - shareAccount                                    │         │
│  │  - createInvitation                                │         │
│  │  - acceptInvitation                                │         │
│  │  - confirmConnection                               │         │
│  │  - disconnectFamily                                │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cloud Functions

| Function | Purpose | Trigger | Auth Required |
|----------|---------|---------|---------------|
| `getSharedAccountTransactions` | Fetch transactions from shared accounts | Callable | Yes |
| `shareAccount` | Share account with family member | Callable | Yes (owner) |
| `createInvitation` | Create family connection invitation | Callable | Yes |
| `acceptInvitation` | Accept family invitation | Callable | Yes |
| `confirmConnection` | Finalize family connection | Callable | Yes |
| `disconnectFamily` | Remove family connection | Callable | Yes |

### Security Rules Architecture

**Key Principles**:

1. **Document-Level Security**: Every Firestore read/write is verified
2. **No Implicit Access**: All access must be explicitly granted
3. **Collection Queries Fail-Closed**: If ANY document fails security, entire query fails
4. **Collection Group Queries**: Use permission maps for cross-user queries

**Example Rule Pattern**:

```javascript
// Personal accounts - owner only
match /users/{userId}/accounts/{accountId} {
  allow read: if request.auth.uid == userId;
  allow write: if request.auth.uid == userId;
}

// Shared accounts - owner or shared member
match /users/{userId}/accounts/{accountId} {
  allow read: if request.auth.uid == userId 
                || resource.data.get('sharedWith', {})[request.auth.uid] != null;
}

// Collection group queries - permission map
match /{path=**}/accounts/{accountId} {
  allow read: if request.auth != null 
              && request.auth.uid in resource.data.get('sharedWith', {}).keys();
}
```

**See**: FIRESTORE_SCHEMA.md for complete security model

---

## Infrastructure Architecture

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE HOSTING (Google Cloud)               │
│                                                                  │
│  Production:  https://anchor-os.web.app/                        │
│    Project: anchor-os                                           │
│    Hosting: Global CDN with edge locations                      │
│    SSL/TLS: Automatic (Google-managed)                          │
│                                                                  │
│  Staging:     https://anchor-os-staging.web.app/                │
│    Project: anchor-os-staging                                   │
│    Hosting: Global CDN with edge locations                      │
│    SSL/TLS: Automatic (Google-managed)                          │
│                                                                  │
│  Development: https://anchor-os-dev-1c6ec.web.app/              │
│    Project: anchor-os-dev-1c6ec                                 │
│    Hosting: Global CDN with edge locations                      │
│    SSL/TLS: Automatic (Google-managed)                          │
│    Auto-deploy: Connected to local builds                       │
│                                                                  │
│  All environments serve:                                        │
│    - Static HTML/CSS/JS (from dist/)                            │
│    - SPA routing (index.html fallback)                          │
│    - Asset caching (immutable assets)                           │
│    - Gzip/Brotli compression                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Developer Infrastructure (Local Only)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROXMOX HOST (Dell OptiPlex 5090)            │
│                     192.168.0.x (LAN)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │  LXC 107 - Anchor OS Development                  │         │
│  │    OS: Ubuntu 24.04 LTS                           │         │
│  │    IP: 192.168.0.57 (LAN)                         │         │
│  │    IP: 100.112.129.21 (Tailscale)                │         │
│  │    Hostname: anchor.tail2fa2e.ts.net              │         │
│  │                                                    │         │
│  │    Services:                                       │         │
│  │      - Node.js 20                                 │         │
│  │      - Vite Dev Server (Port 5173)                │         │
│  │      - Tailscale Client                           │         │
│  │      - Git                                         │         │
│  │      - Firebase CLI (for deployments)             │         │
│  │                                                    │         │
│  │    Purpose:                                        │         │
│  │      - Local development with hot reload          │         │
│  │      - Build and deploy to Firebase Hosting       │         │
│  │      - Run tests                                  │         │
│  │      - Access: Teeto only via Tailscale           │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐         │
│  │  Other LXCs                                       │         │
│  │    - Beszel (Monitoring)                          │         │
│  │    - Bitwarden (Password Manager)                 │         │
│  │    - AdGuard Home (DNS Filtering)                 │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Network Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │         PUBLIC INTERNET (HTTPS)                     │        │
│  │                                                     │        │
│  │    All Users:                                       │        │
│  │      ✓ https://anchor-os.web.app/ (Production)     │        │
│  │      ✓ https://anchor-os-staging.web.app/ (Staging│        │
│  │      ✓ https://anchor-os-dev-1c6ec.web.app/ (Dev) │        │
│  │                                                     │        │
│  │    Access: Public (anyone with browser)            │        │
│  │    Security: Firebase Auth + Firestore Rules       │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │           Tailscale Mesh Network                    │        │
│  │           (tail2fa2e.ts.net)                       │        │
│  │           DEVELOPER ONLY                            │        │
│  │                                                     │        │
│  │    Nodes:                                           │        │
│  │      ✓ anchor.tail2fa2e.ts.net (LXC 107)          │        │
│  │      ✓ desktop-mac (Teeto's device)                │        │
│  │      ✓ mobile-iphone (Teeto's device)              │        │
│  │                                                     │        │
│  │    Purpose:                                         │        │
│  │      - Access local dev server (port 5173)         │        │
│  │      - SSH into LXC container                      │        │
│  │      - Local development with hot reload           │        │
│  │                                                     │        │
│  │    Access: Teeto only                              │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │           Local Network (Optional)                  │        │
│  │           192.168.0.0/24                           │        │
│  │                                                     │        │
│  │    Devices:                                         │        │
│  │      - Proxmox Host (192.168.0.x)                  │        │
│  │      - LXC 107 (192.168.0.57)                      │        │
│  │      - Local devices (when on same LAN)            │        │
│  │                                                     │        │
│  │    Purpose: Infrastructure management only         │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Security Boundaries**:

1. **Firebase Hosting**: Public CDN with global edge locations
2. **Firebase Auth**: Authentication layer (email/password + MFA)
3. **Firestore Rules**: Backend access control independent of network
4. **Tailscale Layer**: Developer-only access to local dev environment
5. **LXC Isolation**: Container isolation for development environment

---

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Network Security                                      │
│    ✓ Tailscale zero-trust authentication                        │
│    ✓ Encrypted mesh network (WireGuard)                        │
│    ✓ ACL-based access control                                  │
│    ✓ No public internet exposure                               │
│                                                                  │
│  Layer 2: Application Security                                  │
│    ✓ Firebase Authentication (email + MFA)                      │
│    ✓ TOTP multi-factor authentication                          │
│    ✓ Session management                                        │
│    ✓ Input validation & sanitization                           │
│                                                                  │
│  Layer 3: Data Security                                         │
│    ✓ Firestore security rules (owner-based access)             │
│    ✓ Permission-based sharing (read/transact/manage)           │
│    ✓ Audit trails for shared accounts                          │
│    ✓ Encryption at rest (Firebase)                             │
│    ✓ Encryption in transit (HTTPS + Tailscale)                 │
│                                                                  │
│  Layer 4: Infrastructure Security                               │
│    ✓ LXC container isolation                                   │
│    ✓ Unprivileged containers (non-root)                        │
│    ✓ SSH key-based authentication                              │
│    ✓ Minimal attack surface                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User                    Client                    Firebase     │
│    │                       │                          │         │
│    │ 1. Enter credentials  │                          │         │
│    ├──────────────────────>│                          │         │
│    │                       │ 2. signInWithEmailAndPassword      │
│    │                       ├─────────────────────────>│         │
│    │                       │                          │         │
│    │                       │ 3. Return auth token     │         │
│    │                       │<─────────────────────────┤         │
│    │                       │                          │         │
│    │ 4. If MFA enabled:    │                          │         │
│    │                       │ 5. Request TOTP code     │         │
│    │                       │<─────────────────────────┤         │
│    │                       │                          │         │
│    │ 6. Enter TOTP code    │                          │         │
│    ├──────────────────────>│                          │         │
│    │                       │ 7. Verify TOTP           │         │
│    │                       ├─────────────────────────>│         │
│    │                       │                          │         │
│    │                       │ 8. Grant full access     │         │
│    │                       │<─────────────────────────┤         │
│    │                       │                          │         │
│    │ 9. Redirect to dashboard                         │         │
│    │<──────────────────────┤                          │         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Patterns

### Read Path (Personal Accounts)

```
Component (FinanceView)
    │
    └─→ useQuery('accounts')
            │
            └─→ AccountService.getAccounts()
                    │
                    └─→ Firestore.getDocs(collection(users/{userId}/accounts))
                            │
                            ├─→ Security Rule Check (owner?)
                            │       │
                            │       └─→ ✓ Allow
                            │
                            └─→ Return documents
                                    │
                                    └─→ React Query Cache
                                            │
                                            └─→ Component Re-renders
```

### Read Path (Shared Accounts - Collection Group Query)

```
Component (FinanceView)
    │
    └─→ useQuery('sharedAccounts')
            │
            └─→ AccountService.getSharedAccounts()
                    │
                    └─→ Firestore.collectionGroup('accounts')
                            │   .where('sharedWith.{userId}', '!=', null)
                            │
                            ├─→ Security Rule Check (collection group)
                            │       │
                            │       └─→ Check EACH document's sharedWith map
                            │               │
                            │               └─→ ✓ Allow documents where user in sharedWith
                            │
                            └─→ Return matching documents
                                    │
                                    └─→ React Query Cache
                                            │
                                            └─→ Component Re-renders
```

### Write Path (Transaction on Shared Account)

```
Component (TransactionForm)
    │
    └─→ useMutation('createTransaction')
            │
            └─→ FinanceService.createTransaction()
                    │
                    ├─→ 1. Validate input (client-side)
                    │       │
                    │       └─→ sanitize, validate types
                    │
                    ├─→ 2. Create transaction document
                    │       │
                    │       └─→ Firestore.setDoc(finance/{txId}, {
                    │               ...data,
                    │               accountShares: { ownerUid: true, memberUid: true }
                    │           })
                    │               │
                    │               ├─→ Security Rule Check
                    │               │       │
                    │               │       └─→ Verify user has 'transact' permission
                    │               │               │
                    │               │               └─→ ✓ Allow
                    │               │
                    │               └─→ ✓ Document created
                    │
                    ├─→ 3. Update account balance
                    │       │
                    │       └─→ Firestore.updateDoc(accounts/{accountId}, {
                    │               balanceCents: increment(-amountCents)
                    │           })
                    │               │
                    │               └─→ ✓ Balance updated
                    │
                    ├─→ 4. Create activity log entry
                    │       │
                    │       └─→ Firestore.setDoc(activity/{activityId}, {
                    │               action: 'transaction_added',
                    │               actorId, actorName, timestamp, details
                    │           })
                    │               │
                    │               └─→ ✓ Activity logged
                    │
                    └─→ 5. Invalidate React Query cache
                            │
                            └─→ queryClient.invalidateQueries(['accounts', 'transactions'])
                                    │
                                    └─→ Components re-fetch and re-render
```

---

## Deployment Architecture

### Build & Deploy Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  BUILD & DEPLOY PIPELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Developer Machine (Teeto via Tailscale)                        │
│      │                                                           │
│      ├─→ git commit                                             │
│      │       │                                                   │
│      │       └─→ git push origin master                           │
│      │                                                           │
│  LXC 107 (Development Environment)                              │
│      │                                                           │
│      ├─→ SSH into container (via Tailscale)                     │
│      │       │                                                   │
│      │       └─→ ssh root@anchor.tail2fa2e.ts.net              │
│      │                                                           │
│      ├─→ Pull latest code                                       │
│      │       │                                                   │
│      │       └─→ cd /root/anchor-os && git pull                 │
│      │                                                           │
│      ├─→ Install dependencies (if needed)                       │
│      │       │                                                   │
│      │       └─→ npm install                                    │
│      │                                                           │
│      ├─→ Run tests                                              │
│      │       │                                                   │
│      │       └─→ npm run test:run                               │
│      │                                                           │
│      ├─→ Build for target environment                           │
│      │       │                                                   │
│      │       ├─→ npm run build:dev (for dev)                    │
│      │       ├─→ npm run build:staging (for staging)            │
│      │       └─→ npm run build:production (for production)      │
│      │               │                                           │
│      │               └─→ Output: dist/ directory                │
│      │                                                           │
│      ├─→ Deploy to Firebase Hosting                             │
│      │       │                                                   │
│      │       ├─→ firebase deploy --only hosting:dev             │
│      │       │       │                                           │
│      │       │       └─→ https://anchor-os-dev-1c6ec.web.app/  │
│      │       │                                                   │
│      │       ├─→ firebase deploy --only hosting:staging         │
│      │       │       │                                           │
│      │       │       └─→ https://anchor-os-staging.web.app/    │
│      │       │                                                   │
│      │       └─→ firebase deploy --only hosting:production      │
│      │               │                                           │
│      │               └─→ https://anchor-os.web.app/            │
│      │                                                           │
│      └─→ ✓ Deployment complete (live in seconds via CDN)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Development Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Local Development (Hot Reload):                                │
│      1. SSH into LXC: ssh root@anchor.tail2fa2e.ts.net         │
│      2. Start dev server: npm run dev                           │
│      3. Access via Tailscale: https://anchor.tail2fa2e.ts.net:5173 │
│      4. Make changes → Hot reload automatically                 │
│      5. Test locally with dev Firebase project                  │
│                                                                  │
│  Deploy to Dev Environment (For Testing):                       │
│      1. Build: npm run build:dev                                │
│      2. Deploy: firebase deploy --only hosting:dev              │
│      3. Test: https://anchor-os-dev-1c6ec.web.app/             │
│      4. Share with family for testing (real URL)               │
│                                                                  │
│  Deploy to Staging (Pre-Production):                            │
│      1. Build: npm run build:staging                            │
│      2. Deploy: firebase deploy --only hosting:staging          │
│      3. Test: https://anchor-os-staging.web.app/               │
│      4. Run E2E tests against staging                           │
│                                                                  │
│  Deploy to Production (Live):                                   │
│      1. Verify staging tests pass                               │
│      2. Build: npm run build:production                         │
│      3. Deploy: firebase deploy --only hosting:production       │
│      4. Monitor: https://anchor-os.web.app/                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Runtime Architecture

**Firebase Hosting (Production/Staging/Dev)**:
```
Firebase CDN Edge Location (User's nearest location)
    │
    ├─→ Serve cached static assets (HTML, CSS, JS)
    ├─→ SPA routing (redirect all to index.html)
    ├─→ Gzip/Brotli compression
    └─→ Automatic SSL/TLS (Google-managed certificates)
```

**Local Development (Tailscale-only)**:
```
LXC Container (Ubuntu 24.04)
    │
    ├─→ Vite Dev Server (Port 5173)
    │       │
    │       ├─→ Hot Module Replacement (HMR)
    │       ├─→ Serve source files with instant updates
    │       └─→ Source maps for debugging
    │
    ├─→ Tailscale Client
    │       │
    │       └─→ Secure tunnel to developer devices
    │
    └─→ Git Repository
            │
            └─→ /root/anchor-os
                    │
                    ├─→ src/ (source code)
                    ├─→ dist/ (build output)
                    └─→ node_modules/ (dependencies)
```

---

## Additional Resources

### Related Documentation

- **FIRESTORE_SCHEMA.md** - Database schema and security rules
- **TESTING_STRATEGY.md** - Testing architecture and patterns
- **ENVIRONMENT_SETUP.md** - Deployment and configuration
- **FAMILY_SHARING_V3_IMPLEMENTATION.md** - Family Mode architecture
- **DESIGN_PHILOSOPHY.md** - UI/UX architecture principles
- **CLAUDE.md** - Development constitution

### Architecture Diagrams

For detailed system diagrams, see:
- `docs/architecture/INFRASTRUCTURE.md` (to be created)
- `docs/architecture/DATA_FLOW.md` (to be created)
- `docs/architecture/FAMILY_MODE_ARCHITECTURE.md` (to be created)

---

## Maintenance & Updates

This document should be updated when:
- Major architectural changes occur
- New infrastructure components are added
- Technology stack changes
- Security model evolves

**Document Owner**: Anchor OS Core Team  
**Review Cadence**: Quarterly or after major releases  
**Last Reviewed**: January 26, 2026

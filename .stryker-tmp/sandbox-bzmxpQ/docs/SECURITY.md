# Security Documentation - Anchor OS

**Version**: 1.0  
**Last Updated**: January 26, 2026  
**Status**: Authoritative Reference  
**Security Model**: Zero Trust, Defense in Depth

---

## Table of Contents

1. [Security Philosophy](#security-philosophy)
2. [Threat Model](#threat-model)
3. [Security Architecture](#security-architecture)
4. [Authentication & Authorization](#authentication--authorization)
5. [Data Security](#data-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Security Review Checklist](#security-review-checklist)
8. [Incident Response](#incident-response)
9. [Vulnerability Disclosure](#vulnerability-disclosure)

---

## Security Philosophy

### Core Principles

1. **Zero Trust**: Never trust, always verify. Every request is authenticated and authorized
2. **Defense in Depth**: Multiple layers of security - if one fails, others protect
3. **Least Privilege**: Users and services get minimum permissions needed
4. **Explicit Permissions**: All access must be explicitly granted, deny by default
5. **Audit Everything**: All sensitive actions are logged and traceable

### Security vs. Usability

Anchor OS prioritizes security while maintaining usability:
- Multi-factor authentication (MFA) is encouraged but not forced
- Family Mode requires explicit consent and verification codes
- Sensitive operations require re-authentication
- Clear visual indicators for security states

---

## Threat Model

### Assets to Protect

| Asset | Sensitivity | Threat Level | Protection Priority |
|-------|-------------|--------------|---------------------|
| **User Authentication Credentials** | Critical | High | Highest |
| **Financial Data** (accounts, transactions) | Critical | High | Highest |
| **Personal Commitments** | High | Medium | High |
| **Family Connections** | High | Medium | High |
| **User Profile Data** | Medium | Medium | Medium |
| **Activity Logs** | Medium | Low | Medium |

### Threat Actors

1. **External Attackers**
   - Goal: Steal credentials, access financial data
   - Vectors: Phishing, credential stuffing, SQL injection
   - Mitigation: Firebase Auth, Firestore security rules, input validation

2. **Malicious Family Members**
   - Goal: Unauthorized access to shared accounts, data tampering
   - Vectors: Social engineering, permission escalation
   - Mitigation: Explicit sharing, permission boundaries, audit trails

3. **Compromised User Devices**
   - Goal: Session hijacking, token theft
   - Vectors: Malware, keyloggers
   - Mitigation: Session timeouts, MFA, secure token storage

4. **Insider Threats** (Developer Access)
   - Goal: Unauthorized data access during development
   - Vectors: Firebase console access, Cloud Functions
   - Mitigation: Admin SDK audit logs, production access restrictions

### Attack Vectors & Mitigations

| Attack Vector | Risk Level | Mitigation |
|--------------|------------|------------|
| **SQL/NoSQL Injection** | HIGH | Parameterized queries, Firebase SDK (prevents injection) |
| **Cross-Site Scripting (XSS)** | HIGH | Input sanitization, React auto-escaping, CSP headers |
| **Cross-Site Request Forgery (CSRF)** | MEDIUM | Firebase Auth tokens (not cookies), SameSite headers |
| **Session Hijacking** | HIGH | HTTPS only, secure token storage, session timeouts |
| **Brute Force Attacks** | MEDIUM | Rate limiting, account lockouts (Firebase Auth) |
| **Phishing** | HIGH | MFA, email verification, security awareness |
| **Man-in-the-Middle** | HIGH | HTTPS everywhere, Firebase Hosting SSL/TLS |
| **Privilege Escalation** | HIGH | Firestore security rules, permission validation |
| **Data Exfiltration** | HIGH | Collection group query restrictions, audit logs |

---

## Security Architecture

### Defense in Depth Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: Network Security                                       │
│   ✓ HTTPS/TLS encryption (Firebase Hosting)                    │
│   ✓ Tailscale zero-trust (dev environment only)                │
│   ✓ No direct database access (Firestore only via SDK)         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 2: Application Security                                   │
│   ✓ Firebase Authentication (email + password)                  │
│   ✓ TOTP Multi-Factor Authentication (optional)                │
│   ✓ Session management (automatic token refresh)               │
│   ✓ Input validation (client & server-side)                    │
│   ✓ Output sanitization (XSS prevention)                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 3: Data Security                                          │
│   ✓ Firestore security rules (owner-based access)              │
│   ✓ Permission-based sharing (read/transact/manage)            │
│   ✓ Field-level validation                                     │
│   ✓ Audit trails for shared accounts                           │
│   ✓ Encryption at rest (Firebase managed)                      │
│   ✓ Encryption in transit (HTTPS + Tailscale)                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 4: Infrastructure Security                                │
│   ✓ LXC container isolation (dev environment)                  │
│   ✓ Unprivileged containers (non-root)                         │
│   ✓ SSH key-based authentication                               │
│   ✓ Minimal attack surface (no unnecessary services)           │
│   ✓ Firebase security monitoring                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### Authentication Mechanisms

#### Primary Authentication (Email + Password)

```typescript
// Email/password authentication with Firebase
const signIn = async (email: string, password: string) => {
  try {
    // 1. Validate input
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    // 2. Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // 3. Check if MFA is enrolled
    if (userCredential.user.multiFactor.enrolledFactors.length > 0) {
      // Prompt for TOTP code
      await verifyMFA(userCredential.user);
    }
    
    return userCredential.user;
  } catch (error) {
    // Log failed attempts (for monitoring)
    console.error('[Auth] Sign-in failed:', error.code);
    throw error;
  }
};
```

**Security Features**:
- Password requirements enforced by Firebase (min 6 chars)
- Rate limiting on failed attempts (Firebase managed)
- Email verification required
- Password reset via secure email link

#### Multi-Factor Authentication (TOTP)

**Enrollment Flow**:
```typescript
// 1. User requests MFA enrollment
const session = await multiFactor(user).getSession();

// 2. Generate TOTP secret
const totpSecret = await TotpMultiFactorGenerator.generateSecret(session);

// 3. Display QR code for authenticator app
const qrCodeUrl = totpSecret.generateQrCodeUrl(
  user.email,
  'Anchor OS'
);

// 4. User scans QR code with authenticator app

// 5. User enters verification code
const code = '123456'; // From authenticator app

// 6. Enroll MFA
const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
  totpSecret,
  code
);
await multiFactor(user).enroll(assertion, 'Authenticator App');
```

**Verification Flow**:
```typescript
// During sign-in, if MFA is enrolled
const resolver = error.resolver; // From sign-in error
const selectedHint = resolver.hints[0]; // TOTP hint

// User enters TOTP code
const code = '123456';

// Verify and complete sign-in
const assertion = TotpMultiFactorGenerator.assertionForSignIn(
  selectedHint.uid,
  code
);
const userCredential = await resolver.resolveSignIn(assertion);
```

**Security Benefits**:
- Protection against credential theft
- Time-based codes (30-second expiry)
- Works offline (no SMS required)
- Industry-standard TOTP algorithm

### Authorization Model

#### Permission Levels

| Permission | Read | Create | Update | Delete | Share |
|-----------|------|--------|--------|--------|-------|
| **Owner** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manage** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Transact** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Read** | ✅ | ❌ | ❌ | ❌ | ❌ |

#### Firestore Security Rules

**Owner-Based Access**:
```javascript
// Personal accounts - owner only
match /users/{userId}/accounts/{accountId} {
  allow read, write: if request.auth.uid == userId;
}
```

**Shared Access with Permissions**:
```javascript
// Shared accounts - owner or shared member
match /users/{userId}/accounts/{accountId} {
  function hasPermission(perm) {
    let account = resource.data;
    let userPerm = account.get('sharedWith', {})[request.auth.uid];
    return userPerm == perm || account.ownerId == request.auth.uid;
  }
  
  // Read: owner or any shared member
  allow read: if request.auth.uid == userId 
                || resource.data.get('sharedWith', {})[request.auth.uid] != null;
  
  // Create transaction: owner or transact+ permission
  allow create: if request.auth.uid == userId 
                || hasPermission('transact')
                || hasPermission('manage');
  
  // Update: owner or manage permission only
  allow update: if request.auth.uid == userId 
                || hasPermission('manage');
  
  // Delete: owner only
  allow delete: if request.auth.uid == userId;
}
```

**Family Mode Connection Verification**:
```javascript
// Check if users are connected family members
function isConnectedFamilyMember(userId) {
  return exists(/databases/$(database)/documents/artifacts/anchor-os/family_connections/$(userId + '_' + request.auth.uid)) ||
         exists(/databases/$(database)/documents/artifacts/anchor-os/family_connections/$(request.auth.uid + '_' + userId));
}
```

---

## Data Security

### Input Validation

**Client-Side Validation** (First Line of Defense):

```typescript
// src/utils/validation.ts

// Detect dangerous patterns (XSS, script injection)
export const containsDangerousPatterns = (input: string): boolean => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers (onclick, onerror, etc.)
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
    /data:text\/html/gi,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
};

// Validate string input
export const validateString = (
  value: string | null | undefined,
  fieldName: string,
  options: ValidationOptions = {}
): ValidationError | null => {
  // Check required
  if (!value || value.trim() === '') {
    return options.required 
      ? { field: fieldName, message: `${fieldName} is required` }
      : null;
  }
  
  // Check length constraints
  if (options.minLength && value.length < options.minLength) {
    return { 
      field: fieldName, 
      message: `${fieldName} must be at least ${options.minLength} characters` 
    };
  }
  
  if (options.maxLength && value.length > options.maxLength) {
    return { 
      field: fieldName, 
      message: `${fieldName} must be ${options.maxLength} characters or fewer` 
    };
  }
  
  // Check for dangerous patterns
  if (containsDangerousPatterns(value)) {
    return { 
      field: fieldName, 
      message: `${fieldName} contains invalid characters` 
    };
  }
  
  return null;
};
```

**Server-Side Validation** (Firestore Security Rules):

```javascript
// Type validation in Firestore rules
function isValidTransaction(data) {
  return data.title is string && data.title.size() > 0
      && data.title.size() <= 200  // Max length
      && data.amountCents is int && data.amountCents >= 0
      && data.type in ['income', 'expense', 'transfer']
      && data.date is string
      && data.category is string && data.category.size() <= 50;
}

// Use in rules
match /users/{userId}/finance/{txId} {
  allow create: if isValidTransaction(request.resource.data);
}
```

### Output Sanitization

**React Auto-Escaping**:
```typescript
// React automatically escapes dangerous content
const UserInput: React.FC<{ text: string }> = ({ text }) => {
  // This is SAFE - React escapes HTML entities
  return <div>{text}</div>;
  
  // DANGEROUS - Never use dangerouslySetInnerHTML with user input
  // return <div dangerouslySetInnerHTML={{ __html: text }} />;
};
```

**Additional Sanitization** (when needed):
```typescript
// src/utils/sanitize.ts
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .substring(0, 500); // Enforce max length
};
```

### Data Encryption

**Encryption at Rest**:
- Firestore automatically encrypts all data at rest
- Google-managed encryption keys
- No configuration required

**Encryption in Transit**:
- HTTPS enforced on all Firebase Hosting
- TLS 1.3 (latest protocol)
- Strong cipher suites only

**Sensitive Data Handling**:
```typescript
// ❌ NEVER store sensitive data in Firestore
// - Credit card numbers
// - Social Security Numbers
// - Passwords (use Firebase Auth)
// - API keys or secrets

// ✅ DO store financial metadata
// - Account balances (as cents integers)
// - Transaction titles (user-provided descriptions)
// - Categories, dates, amounts
```

### Audit Trails

**Activity Logging for Shared Accounts**:

```typescript
// Log all actions on shared accounts
const createActivityLog = async (
  accountId: string,
  accountOwnerId: string,
  action: ActivityAction,
  details: ActivityDetails
) => {
  const activityRef = doc(
    collection(
      db, 
      `users/${accountOwnerId}/accounts/${accountId}/activity`
    )
  );
  
  await setDoc(activityRef, {
    accountId,
    accountOwnerId,
    action, // 'transaction_added', 'transaction_edited', etc.
    actorId: currentUser.uid,
    actorName: currentUser.displayName,
    timestamp: new Date().toISOString(),
    details,
  });
};

// Usage
await createActivityLog(
  accountId,
  accountOwnerId,
  'transaction_added',
  {
    transactionId: tx.id,
    transactionTitle: tx.title,
    amountCents: tx.amountCents,
    currency: tx.currency,
    type: tx.type,
  }
);
```

**Audit Trail Properties**:
- Append-only (cannot be modified or deleted by clients)
- Includes actor ID and name
- Timestamp for chronological ordering
- Sufficient details for forensic analysis

---

## Infrastructure Security

### Firebase Security

**Project-Level Security**:
- Separate projects for dev, staging, production
- Production console access restricted
- API keys are public (security via Firestore rules, not client keys)

**Firestore Security Rules Review**:
```bash
# Review security rules before deployment
firebase deploy --only firestore:rules --dry-run

# Test rules with emulator
firebase emulators:start --only firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### Development Environment Security

**LXC Container Isolation**:
- Unprivileged containers (non-root)
- No unnecessary services running
- SSH key-based authentication only
- Tailscale-only access (no public exposure)

**SSH Hardening**:
```bash
# /etc/ssh/sshd_config
PermitRootLogin prohibit-password  # No password auth
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
```

**Tailscale ACL** (for dev environment):
```json
{
  "tagOwners": {
    "tag:anchor": ["teeto@adedamola.us"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["teeto@adedamola.us"],
      "dst": ["tag:anchor:*"]
    }
  ]
}
```

---

## Security Review Checklist

Use this checklist when implementing new features:

### Authentication & Authorization

- [ ] Does this feature require authentication?
- [ ] Are permissions properly checked (owner, manage, transact, read)?
- [ ] Is MFA considered for sensitive operations?
- [ ] Are session tokens properly validated?

### Input Validation

- [ ] All user inputs validated on client-side
- [ ] All user inputs validated in Firestore security rules
- [ ] String length constraints enforced
- [ ] Dangerous patterns (XSS, script injection) rejected
- [ ] Type validation for all fields

### Data Security

- [ ] No sensitive data stored in Firestore (credit cards, SSNs, passwords)
- [ ] Proper permission checks in Firestore rules
- [ ] Audit trail for shared account actions
- [ ] No direct database access (Firebase SDK only)
- [ ] Collection group queries use permission maps

### API Security

- [ ] Cloud Functions require authentication
- [ ] Rate limiting implemented for expensive operations
- [ ] Error messages don't leak sensitive info
- [ ] Input validation in Cloud Functions
- [ ] Admin SDK used appropriately (not client SDK)

### Family Mode Security

- [ ] Invitation requires verification code (6-digit)
- [ ] Connection requires explicit acceptance
- [ ] Account sharing requires owner permission
- [ ] Permissions are granular (read/transact/manage)
- [ ] Activity logs for all shared account actions
- [ ] Disconnection revokes all access

### Frontend Security

- [ ] React auto-escaping used (no `dangerouslySetInnerHTML` with user input)
- [ ] HTTPS enforced everywhere
- [ ] No API keys or secrets in client code
- [ ] Session tokens stored securely (Firebase handles this)
- [ ] Error handling doesn't expose stack traces to users

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **Critical** | Data breach, authentication bypass | Immediate | User credentials leaked |
| **High** | Permission escalation, data loss | 4 hours | Unauthorized account access |
| **Medium** | Feature abuse, denial of service | 24 hours | Rate limit bypass |
| **Low** | Minor security issue, low impact | 7 days | Verbose error messages |

### Response Procedure

**CRITICAL INCIDENT**:
```
1. CONTAIN
   - Revoke compromised credentials
   - Disable affected features if needed
   - Block malicious IPs (if applicable)

2. INVESTIGATE
   - Check Firebase Auth logs
   - Review Firestore activity logs
   - Identify scope of breach

3. NOTIFY
   - Affected users (via email)
   - Team members
   - Document incident

4. REMEDIATE
   - Fix vulnerability
   - Deploy security patch
   - Test thoroughly

5. POST-MORTEM
   - Root cause analysis
   - Document lessons learned
   - Update security measures
```

### Emergency Contacts

- **Firebase Support**: https://firebase.google.com/support
- **Security Issues**: Report via GitHub Issues (if using) or email
- **Developer**: Teeto (teeto@adedamola.us)

---

## Vulnerability Disclosure

### Reporting Security Issues

If you discover a security vulnerability:

**DO**:
1. Email: teeto@adedamola.us
2. Subject: "[SECURITY] Vulnerability in Anchor OS"
3. Include: Description, steps to reproduce, potential impact
4. Allow 7 days for response before public disclosure

**DON'T**:
- Post publicly on GitHub Issues
- Attempt to exploit the vulnerability
- Access user data without permission

### Responsible Disclosure Timeline

```
Day 0:  Vulnerability reported
Day 1:  Acknowledgment sent to reporter
Day 7:  Initial assessment completed
Day 14: Fix developed and tested
Day 21: Patch deployed to production
Day 28: Public disclosure (if appropriate)
```

---

## Security Monitoring

### Firebase Monitoring

**Enable in Firebase Console**:
- Authentication anomaly detection
- Firestore usage monitoring
- Cloud Functions error tracking
- Hosting traffic analytics

### Manual Reviews

**Monthly**:
- Review Firestore security rules
- Check for unused Firebase services
- Audit user permissions in production
- Review activity logs for suspicious patterns

**Quarterly**:
- Penetration testing (if resources allow)
- Security rule updates
- Dependency vulnerability scans (`npm audit`)

---

## Best Practices Summary

### For Developers

1. **Never Trust User Input**: Always validate and sanitize
2. **Least Privilege**: Grant minimum permissions needed
3. **Defense in Depth**: Multiple layers of security
4. **Audit Everything**: Log all sensitive actions
5. **Fail Secure**: Default to denying access, not granting

### For Users

1. **Enable MFA**: Two-factor authentication highly recommended
2. **Strong Passwords**: Use unique passwords (Bitwarden integration helps)
3. **Verify Connections**: Only accept Family Mode invitations from known contacts
4. **Review Activity**: Check activity logs on shared accounts
5. **Report Issues**: Report suspicious activity immediately

---

## Related Documentation

- **FIRESTORE_SCHEMA.md** - Complete security rules
- **ARCHITECTURE_OVERVIEW.md** - Security architecture layers
- **TESTING_STRATEGY.md** - Security testing patterns
- **ENVIRONMENT_SETUP.md** - Secure deployment practices

---

## Maintenance & Updates

This document should be updated when:
- New security features are added
- Vulnerabilities are discovered and fixed
- Threat model changes
- Security incidents occur

**Document Owner**: Anchor OS Security Team  
**Review Cadence**: Quarterly  
**Last Security Audit**: January 26, 2026  
**Next Audit Due**: April 26, 2026

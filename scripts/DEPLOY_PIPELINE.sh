#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# ============================================================================
# ANCHOR OS DEPLOYMENT PIPELINE
# ============================================================================
#
# USAGE:
#   ./DEPLOY_PIPELINE.sh --env=development    # Deploy to dev
#   ./DEPLOY_PIPELINE.sh --env=staging        # Deploy to staging
#   ./DEPLOY_PIPELINE.sh --env=production     # Deploy to production
#
# FIREBASE HOSTING TARGETS (defined in firebase.json & .firebaserc):
#   - dev        → anchor-os-dev-1c6ec.web.app
#   - staging    → anchor-os-staging.web.app
#   - production → anchor-os.web.app
#
# ⚠️  IMPORTANT: Always use target names (dev/staging/production), NOT project IDs.
#     ❌ WRONG:  firebase deploy --only hosting:anchor-os-dev-1c6ec
#     ✅ RIGHT:  firebase deploy --only hosting:dev --project anchor-os-dev-1c6ec
#
# ============================================================================

# Ensure we are running from the project root
cd "$(dirname "$0")/.."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
ENV="production"
DRY_RUN=false
SKIP_E2E=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --env=*)
            ENV="${1#*=}"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-e2e)
            SKIP_E2E=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}🚀 Starting CI/CD Pipeline for ${BLUE}${ENV}${YELLOW} environment...${NC}"
echo -e "Version: $(node -p "require('./package.json').version")"

# 1. Quality Assurance (Linting)
echo -e "\n${YELLOW}🔎 Stage 1: Quality Assurance (Linting)${NC}"
if npm run lint; then
    echo -e "${GREEN}✅ Linting passed.${NC}"
else
    echo -e "${RED}❌ Linting failed. Fix potential errors/warnings.${NC}"
    exit 1
fi

# 1b. Security Audit
echo -e "\n${YELLOW}🔒 Stage 1b: Security Audit (npm audit)${NC}"
AUDIT_LEVEL="high"
if [[ "$ENV" == "production" ]]; then
    AUDIT_LEVEL="moderate"
fi
if npm audit --audit-level="$AUDIT_LEVEL" 2>/dev/null; then
    echo -e "${GREEN}✅ No ${AUDIT_LEVEL}+ vulnerabilities found.${NC}"
else
    echo -e "${RED}❌ npm audit found ${AUDIT_LEVEL}+ severity vulnerabilities. Deployment blocked.${NC}"
    echo -e "${YELLOW}   Run 'npm audit' for details and 'npm audit fix' to resolve.${NC}"
    exit 1
fi

# 2. Automated Unit Testing
echo -e "\n${YELLOW}🧪 Stage 2: Automated Testing (Unit & Integration)${NC}"
if npm run test:run; then
    echo -e "${GREEN}✅ All unit tests passed.${NC}"
else
    echo -e "${RED}❌ Unit tests failed. Deployment prevented.${NC}"
    exit 1
fi

# 3. Build (with environment mode)
echo -e "\n${YELLOW}🏗️  Stage 3: Build (${ENV})${NC}"
BUILD_SCRIPT="build"
if [[ "$ENV" == "development" ]]; then
    BUILD_SCRIPT="build:dev"
elif [[ "$ENV" == "staging" ]]; then
    BUILD_SCRIPT="build:staging"
elif [[ "$ENV" == "production" ]]; then
    BUILD_SCRIPT="build:production"
fi
if npm run "$BUILD_SCRIPT"; then
    echo -e "${GREEN}✅ Build successful.${NC}"
else
    echo -e "${RED}❌ Build failed.${NC}"
    exit 1
fi

# 3b. Verify build environment marker
echo -e "\n${YELLOW}🔍 Stage 3b: Verify Build Environment${NC}"
if ./scripts/verify-build-env.sh "$ENV"; then
    echo -e "${GREEN}✅ Build environment verified.${NC}"
else
    echo -e "${RED}❌ Build environment mismatch. Deployment blocked.${NC}"
    exit 1
fi

# 3c. Mutation Testing (production only - catches weak tests)
if [[ "$ENV" == "production" ]]; then
    echo -e "\n${YELLOW}🧬 Stage 3c: Mutation Testing${NC}"
    if npm run test:mutation; then
        echo -e "${GREEN}✅ Mutation tests passed (score above threshold).${NC}"
    else
        echo -e "${RED}❌ Mutation score below threshold. Deployment blocked.${NC}"
        exit 1
    fi
else
    echo -e "\n${YELLOW}⏭️  Stage 3c: Mutation Tests Skipped (${ENV} only)${NC}"
fi

# 3d. Firestore Rules Testing (staging + production)
if [[ "$ENV" != "development" ]]; then
    echo -e "\n${YELLOW}🔒 Stage 3d: Firestore Rules Testing${NC}"
    if command -v firebase &> /dev/null; then
        if npm run test:rules; then
            echo -e "${GREEN}✅ Firestore rules tests passed.${NC}"
        else
            echo -e "${RED}❌ Firestore rules tests failed. Deployment blocked.${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Firebase CLI not found — skipping rules tests.${NC}"
    fi
else
    echo -e "\n${YELLOW}⏭️  Stage 3d: Rules Tests Skipped (dev only)${NC}"
fi

# 4. E2E Testing (only for staging and production, unless skipped)
if [[ "$SKIP_E2E" == false ]] && [[ "$ENV" != "development" ]]; then
    echo -e "\n${YELLOW}🎭 Stage 4: End-to-End Testing${NC}"
    if npm run test:e2e -- --reporter=line; then
        echo -e "${GREEN}✅ All E2E tests passed.${NC}"
    else
        echo -e "${RED}❌ E2E tests failed. Deployment blocked.${NC}"
        exit 1
    fi
else
    echo -e "\n${YELLOW}⏭️  Stage 4: E2E Tests Skipped${NC}"
fi

# 5. Deployment Gate
echo -e "\n${YELLOW}🛡️  Stage 5: Deployment Gate${NC}"

if [[ "$DRY_RUN" == true ]]; then
    echo -e "${GREEN}✅ Dry Run Complete. Skipping actual deployment.${NC}"
    exit 0
fi

# Environment-specific deployment targets
case $ENV in
    development)
        FIREBASE_PROJECT="anchor-os-dev-1c6ec"
        HOSTING_URL="anchor-os-dev-1c6ec.web.app"
        HOSTING_TARGET="dev"
        ;;
    staging)
        FIREBASE_PROJECT="anchor-os-staging"
        HOSTING_URL="anchor-os-staging.web.app"
        HOSTING_TARGET="staging"
        ;;
    production)
        FIREBASE_PROJECT="anchor-os"
        HOSTING_URL="anchor-os.web.app"
        HOSTING_TARGET="production"
        ;;
esac

if [[ "$ENV" == "production" ]]; then
    echo -e "${RED}⚠️  WARNING: You are about to deploy to PRODUCTION (${HOSTING_URL}).${NC}"
    echo -e "This step will make your changes live to all users."
    read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}🚫 Deployment cancelled by user.${NC}"
        exit 0
    fi
fi

# 6. Deployment
echo -e "\n${YELLOW}🚀 Stage 6: Deploying to ${ENV^}...${NC}"
if firebase deploy --only hosting:"$HOSTING_TARGET",firestore:rules --project "$FIREBASE_PROJECT"; then
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "🌍 Live at: https://${HOSTING_URL}"
else
    echo -e "${RED}❌ Deployment failed.${NC}"
    exit 1
fi

# 7. Dashboard Sync
echo -e "\n${YELLOW}🔄 Stage 7: Syncing Internal Dashboard...${NC}"
# Dashboard URLs:
#   - Local API: http://localhost:3001
#   - Browser: https://anchor.tail2fa2e.ts.net:3443/
# Use a timeout to prevent hanging if dashboard is down
if curl -m 5 -X POST http://localhost:3001/api/refresh -s > /dev/null; then
    echo -e "${GREEN}✅ Internal Dashboard updated.${NC}"
    echo -e "   🌐 View at: https://anchor.tail2fa2e.ts.net:3443/"
else
    echo -e "${YELLOW}⚠️  Dashboard not responding (is it running at :3001?). Deployment successful otherwise.${NC}"
fi

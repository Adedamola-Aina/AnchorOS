#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# ============================================================================
# ANCHOR OS DEPLOYMENT PIPELINE
# ============================================================================
#
# USAGE:
#   ./DEPLOY_PIPELINE.sh --env=staging        # Deploy to staging
#   ./DEPLOY_PIPELINE.sh --env=production     # Deploy to production
#
# Environments (canonical):
#   - staging    → anchor-os-staging.web.app
#   - production → anchor-os.web.app
#
# There is NO deployable development cloud environment. Development is the
# local Firebase Emulator Suite; the former dev project is retired forever.
#
# ⚠️  IMPORTANT: Always use target names (staging/production), NOT project IDs.
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
SKIP_TESTS=false
SKIP_LINT=false
SKIP_AUDIT=false
SKIP_MUTATION=false
SKIP_VERSION_BUMP=false
YES=false
# Deployment surfaces (comma-separated subset of: hosting,rules,indexes,functions).
# Empty = deploy all surfaces (legacy behavior).
SURFACES=""
# Optional Cloud Functions allow-list (comma-separated). Empty = deploy the
# functions surface as a whole.
FUNCTIONS_FILTER=""
NO_DEPLOY_MARKER=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --env=*)
            ENV="${1#*=}"
            shift
            ;;
        --surfaces=*)
            SURFACES="${1#*=}"
            shift
            ;;
        --functions=*)
            FUNCTIONS_FILTER="${1#*=}"
            shift
            ;;
        --no-deploy-marker)
            NO_DEPLOY_MARKER=true
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
        --skip-mutation)
            SKIP_MUTATION=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            SKIP_E2E=true
            shift
            ;;
        --skip-lint)
            SKIP_LINT=true
            shift
            ;;
        --skip-audit)
            SKIP_AUDIT=true
            shift
            ;;
        --skip-version-bump)
            SKIP_VERSION_BUMP=true
            shift
            ;;
        --yes|-y)
            YES=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

read_env_value() {
    local env_file="$1"
    local env_key="$2"

    if [[ ! -f "$env_file" ]]; then
        return 0
    fi

    grep -E "^${env_key}=" "$env_file" | tail -n 1 | cut -d '=' -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

# ---------------------------------------------------------------------------
# Deployment surface selection
# ---------------------------------------------------------------------------
# SURFACES is a comma-separated subset of: hosting,rules,indexes,functions.
# Empty means "all surfaces" (legacy full deployment). Unknown surface names
# fail hard: a typo must never silently skip or add a deployment surface.
DEPLOY_HOSTING=false
DEPLOY_RULES=false
DEPLOY_INDEXES=false
DEPLOY_FUNCTIONS=false

if [[ -z "$SURFACES" ]]; then
    DEPLOY_HOSTING=true
    DEPLOY_RULES=true
    DEPLOY_INDEXES=true
    DEPLOY_FUNCTIONS=true
else
    IFS=',' read -ra SURFACE_LIST <<< "$SURFACES"
    for surface in "${SURFACE_LIST[@]}"; do
        surface="$(echo "$surface" | tr -d '[:space:]')"
        case "$surface" in
            hosting)   DEPLOY_HOSTING=true ;;
            rules)     DEPLOY_RULES=true ;;
            indexes)   DEPLOY_INDEXES=true ;;
            functions) DEPLOY_FUNCTIONS=true ;;
            "")
              ;;
            *)
                echo -e "${RED}❌ Unknown deployment surface: '$surface'. Allowed: hosting,rules,indexes,functions.${NC}"
                exit 1
                ;;
        esac
    done
fi

if [[ "$DEPLOY_HOSTING" == false && "$DEPLOY_RULES" == false && "$DEPLOY_INDEXES" == false && "$DEPLOY_FUNCTIONS" == false ]]; then
    echo -e "${RED}❌ Empty deployment surface set — nothing to deploy.${NC}"
    exit 1
fi

echo -e "Deployment surfaces: hosting=$DEPLOY_HOSTING rules=$DEPLOY_RULES indexes=$DEPLOY_INDEXES functions=$DEPLOY_FUNCTIONS${FUNCTIONS_FILTER:+ (functions: $FUNCTIONS_FILTER)}"

# 0. Preflight: App Check guardrails for public environments
if [[ "$ENV" == "staging" || "$ENV" == "production" ]]; then
    echo -e "\n${YELLOW}🛡️  Stage 0: App Check Guardrails${NC}"

    FRONTEND_ENV_FILE=".env.${ENV}"
    if [[ ! -f "$FRONTEND_ENV_FILE" ]]; then
        echo -e "${RED}❌ Missing ${FRONTEND_ENV_FILE}. Deployment blocked.${NC}"
        exit 1
    fi

    APP_CHECK_SITE_KEY="${VITE_FIREBASE_APP_CHECK_SITE_KEY:-$(read_env_value "$FRONTEND_ENV_FILE" "VITE_FIREBASE_APP_CHECK_SITE_KEY")}"
    if [[ -z "$APP_CHECK_SITE_KEY" || "$APP_CHECK_SITE_KEY" == "your-app-check-site-key" ]]; then
        echo -e "${RED}❌ VITE_FIREBASE_APP_CHECK_SITE_KEY is not set for ${ENV}. Deployment blocked.${NC}"
        exit 1
    fi

    FUNCTIONS_ENV_FILE="functions/.env.${ENV}"
    if [[ ! -f "$FUNCTIONS_ENV_FILE" ]]; then
        echo -e "${RED}❌ Missing ${FUNCTIONS_ENV_FILE}. Deployment blocked.${NC}"
        exit 1
    fi

    ENFORCE_APP_CHECK_VALUE="${ENFORCE_APPCHECK:-$(read_env_value "$FUNCTIONS_ENV_FILE" "ENFORCE_APPCHECK")}"
    if [[ "$ENFORCE_APP_CHECK_VALUE" != "true" ]]; then
        echo -e "${RED}❌ ENFORCE_APPCHECK must be true in ${FUNCTIONS_ENV_FILE} for ${ENV}. Deployment blocked.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ App Check guardrails verified.${NC}"
fi

echo -e "${YELLOW}🚀 Starting CI/CD Pipeline for ${BLUE}${ENV}${YELLOW} environment...${NC}"
echo -e "Version: $(node -p "require('./package.json').version")"

# 1. Quality Assurance (Linting)
echo -e "\n${YELLOW}🔎 Stage 1: Quality Assurance (Linting)${NC}"
if [[ "$SKIP_LINT" == true ]]; then
    echo -e "${YELLOW}⏭️  Stage 1: Linting Skipped (--skip-lint)${NC}"
elif npm run lint; then
    echo -e "${GREEN}✅ Linting passed.${NC}"
else
    echo -e "${RED}❌ Linting failed. Fix potential errors/warnings.${NC}"
    exit 1
fi

# 1b. Security Audit
echo -e "\n${YELLOW}🔒 Stage 1b: Security Audit (npm audit)${NC}"
if [[ "$SKIP_AUDIT" == true ]]; then
    echo -e "${YELLOW}⏭️  Stage 1b: Security Audit Skipped (--skip-audit)${NC}"
else
    AUDIT_LEVEL="high"
    if [[ "$ENV" == "production" ]]; then
        AUDIT_LEVEL="moderate"
    fi
    if npm audit --audit-level="$AUDIT_LEVEL" --omit=dev 2>/dev/null; then
        echo -e "${GREEN}✅ No ${AUDIT_LEVEL}+ vulnerabilities found in production dependencies.${NC}"
    else
        echo -e "${RED}❌ npm audit found ${AUDIT_LEVEL}+ severity vulnerabilities. Deployment blocked.${NC}"
        echo -e "${YELLOW}   Run 'npm audit' for details and 'npm audit fix' to resolve.${NC}"
        exit 1
    fi
fi

# 2. Automated Unit Testing
if [[ "$SKIP_TESTS" == true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 2: Unit Tests Skipped (--skip-tests)${NC}"
else
    echo -e "\n${YELLOW}🧪 Stage 2: Automated Testing (Unit & Integration)${NC}"
    if npm run test:run; then
        echo -e "${GREEN}✅ All unit tests passed.${NC}"
    else
        echo -e "${RED}❌ Unit tests failed. Deployment prevented.${NC}"
        exit 1
    fi
fi
# 2b. Version Bump (automatic per environment)
if [[ "$SKIP_VERSION_BUMP" == true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 2b: Version Bump Skipped (--skip-version-bump)${NC}"
else
    echo -e "\n${YELLOW}📦 Stage 2b: Version Bump (${ENV})${NC}"
    if ./scripts/bump-version.sh --env="$ENV"; then
        NEW_VERSION=$(node -p "require('./package.json').version")
        echo -e "${GREEN}✅ Version bumped to ${NEW_VERSION}${NC}"
    else
        echo -e "${RED}❌ Version bump failed.${NC}"
        exit 1
    fi
fi

# 3. Build (with environment mode) — only the Hosting surface needs a build
if [[ "$DEPLOY_HOSTING" == true ]]; then
echo -e "\n${YELLOW}🏗️  Stage 3: Build (${ENV})${NC}"
BUILD_SCRIPT="build"
if [[ "$ENV" == "staging" ]]; then
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
else
    echo -e "\n${YELLOW}⏭️  Stage 3: Build Skipped (hosting surface not selected)${NC}"
fi

# 3c. Mutation Testing (production only - catches weak tests)
if [[ "$SKIP_MUTATION" == true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 3c: Mutation Tests Skipped (--skip-mutation)${NC}"
elif [[ "$ENV" == "production" ]]; then
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

# 3d. Firestore Rules Testing (only when the rules surface is deployed)
if [[ "$SKIP_TESTS" == true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 3d: Rules Tests Skipped (--skip-tests)${NC}"
elif [[ "$DEPLOY_RULES" != true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 3d: Rules Tests Skipped (rules surface not selected)${NC}"
else
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
fi

# 4. E2E Testing (only when not skipped — CI passes --skip-e2e after the
#    same-SHA validation gate has already proven the commit)
if [[ "$SKIP_E2E" == false ]]; then
    echo -e "\n${YELLOW}🎭 Stage 4: End-to-End Testing${NC}"
    if npm run test:e2e -- --project=smoke --reporter=line; then
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
    *)
        echo -e "${RED}❌ Unknown environment '$ENV'. Allowed: staging, production.${NC}"
        echo -e "${RED}   There is no deployable development cloud; development is local emulators only.${NC}"
        exit 1
        ;;
esac

if [[ "$ENV" == "production" ]]; then
    if [[ "$YES" == true ]]; then
        echo -e "${YELLOW}⚠️  Auto-confirming production deploy (--yes flag).${NC}"
    else
        echo -e "${RED}⚠️  WARNING: You are about to deploy to PRODUCTION (${HOSTING_URL}).${NC}"
        echo -e "This step will make your changes live to all users."
        read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}🚫 Deployment cancelled by user.${NC}"
            exit 0
        fi
    fi
fi

# 6. Capture pre-deploy version for rollback
echo -e "\n${YELLOW}📸 Stage 6: Capturing rollback snapshot...${NC}"
PRE_DEPLOY_VERSION=$(firebase hosting:channel:list --project "$FIREBASE_PROJECT" 2>/dev/null | head -1 || true)
echo -e "${GREEN}✅ Rollback snapshot ready.${NC}"

# 6a. Deployment (surface-aware)
echo -e "\n${YELLOW}🚀 Stage 6a: Deploying to ${ENV^}...${NC}"

DEPLOY_TARGETS=()
if [[ "$DEPLOY_HOSTING" == true ]]; then
    DEPLOY_TARGETS+=("hosting:${HOSTING_TARGET}")
fi
if [[ "$DEPLOY_RULES" == true ]]; then
    DEPLOY_TARGETS+=("firestore:rules")
fi
if [[ "$DEPLOY_INDEXES" == true ]]; then
    DEPLOY_TARGETS+=("firestore:indexes")
fi
if [[ "$DEPLOY_FUNCTIONS" == true ]]; then
    if [[ -n "$FUNCTIONS_FILTER" ]]; then
        # Ordered/selective Functions rollout (e.g. B1 step B): deploy ONLY the
        # functions named in the filter. firebase-tools scopes a bare
        # `functions:<name>` filter to the DEFAULT codebase; because
        # firebase.json declares a NAMED functions codebase, the filter must be
        # qualified as `functions:<codebase>:<name>`, otherwise firebase aborts
        # with "No function matches given --only filters."
        FN_TARGETS_JOINED="$(node scripts/ci/deploy-targets.js --functions "$FUNCTIONS_FILTER")"
        if [[ -z "$FN_TARGETS_JOINED" ]]; then
            echo -e "${RED}❌ Functions filter produced an empty deploy target list.${NC}"
            exit 1
        fi
        IFS=',' read -ra FN_TARGET_ARRAY <<< "$FN_TARGETS_JOINED"
        DEPLOY_TARGETS+=("${FN_TARGET_ARRAY[@]}")
    else
        DEPLOY_TARGETS+=("functions")
    fi
fi

if [[ ${#DEPLOY_TARGETS[@]} -eq 0 ]]; then
    echo -e "${RED}❌ No deployment surfaces selected — nothing to deploy.${NC}"
    exit 1
fi

DEPLOY_ONLY="$(IFS=,; echo "${DEPLOY_TARGETS[*]}")"
echo -e "Deploy targets: ${DEPLOY_ONLY}"
if firebase deploy --only "$DEPLOY_ONLY" --project "$FIREBASE_PROJECT"; then
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "🌍 Live at: https://${HOSTING_URL}"
else
    echo -e "${RED}❌ Deployment failed.${NC}"
    exit 1
fi

# 6b. Post-deploy health check with automated rollback (SRE-002)
# Hosting-only concern: backend-only deploys do not alter the served site.
if [[ "$DEPLOY_HOSTING" == true ]]; then
echo -e "\n${YELLOW}🏥 Stage 6b: Post-Deploy Health Check...${NC}"
HEALTH_URL="https://${HOSTING_URL}"
HEALTH_RETRIES=3
HEALTH_DELAY=5
HEALTH_OK=false

for i in $(seq 1 $HEALTH_RETRIES); do
    echo -e "  Attempt $i/$HEALTH_RETRIES: checking ${HEALTH_URL}..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 10 "$HEALTH_URL" 2>/dev/null || echo "000")
    if [[ "$HTTP_STATUS" -ge 200 && "$HTTP_STATUS" -lt 400 ]]; then
        echo -e "${GREEN}  ✅ Health check passed (HTTP $HTTP_STATUS).${NC}"
        HEALTH_OK=true
        break
    else
        echo -e "${YELLOW}  ⚠️  Health check returned HTTP $HTTP_STATUS.${NC}"
        if [[ $i -lt $HEALTH_RETRIES ]]; then
            echo -e "  Retrying in ${HEALTH_DELAY}s..."
            sleep $HEALTH_DELAY
        fi
    fi
done

if [[ "$HEALTH_OK" == false ]]; then
    echo -e "${RED}❌ Health check failed after $HEALTH_RETRIES attempts. Initiating rollback...${NC}"
    if firebase hosting:rollback --project "$FIREBASE_PROJECT" --site "$FIREBASE_PROJECT" --confirm 2>/dev/null || \
       firebase hosting:rollback --project "$FIREBASE_PROJECT" --confirm 2>/dev/null; then
        echo -e "${GREEN}✅ Rollback successful. Previous version restored.${NC}"
    else
        echo -e "${RED}⚠️  Automated rollback failed. Manual intervention required:${NC}"
        echo -e "${RED}   firebase hosting:rollback --project $FIREBASE_PROJECT${NC}"
    fi
    exit 1
fi
else
    echo -e "\n${YELLOW}⏭️  Stage 6b: Health Check Skipped (hosting surface not selected)${NC}"
fi

# 6c. Deploy Marker (legacy — disabled)
# Deployment provenance is the successful workflow run for this SHA
# (see scripts/ci/last-deployed-sha.js). Empty deploy-marker commits pushed
# to master are no longer created. --no-deploy-marker remains an accepted
# no-op flag for workflow argument compatibility.
if [[ "$NO_DEPLOY_MARKER" == true ]]; then
    echo -e "\n${YELLOW}⏭️  Stage 6c: Deploy Marker Skipped (--no-deploy-marker)${NC}"
else
    echo -e "\n${YELLOW}⏭️  Stage 6c: Deploy Marker Disabled (provenance = workflow run)${NC}"
fi

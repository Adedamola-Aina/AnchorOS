#!/bin/bash
# ============================================================================
# VERIFY BUILD ENVIRONMENT
# ============================================================================
# This script verifies that the dist/ folder was built with the correct
# environment mode. It prevents deploying a dev build to staging or production.
#
# USAGE:
#   ./scripts/verify-build-env.sh <expected-env>
#   
# EXAMPLES:
#   ./scripts/verify-build-env.sh development
#   ./scripts/verify-build-env.sh staging
#   ./scripts/verify-build-env.sh production
#
# HOW IT WORKS:
# 1. Vite injects VITE_APP_ENV into the JS bundle at build time
# 2. This script greps the built JS files for the env marker
# 3. If the marker doesn't match, deployment is blocked
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

EXPECTED_ENV="$1"

if [[ -z "$EXPECTED_ENV" ]]; then
    echo -e "${RED}❌ Error: Expected environment not specified${NC}"
    echo "Usage: ./scripts/verify-build-env.sh <development|staging|production>"
    exit 1
fi

if [[ ! -d "dist" ]]; then
    echo -e "${RED}❌ Error: dist/ folder not found. Run build first.${NC}"
    exit 1
fi

# Check for the build marker file
MARKER_FILE="dist/.build-env"

if [[ ! -f "$MARKER_FILE" ]]; then
    echo -e "${RED}❌ Error: Build marker not found at ${MARKER_FILE}${NC}"
    echo -e "${YELLOW}This build was created before the verification system was added.${NC}"
    echo -e "${YELLOW}Please rebuild using: npm run build:${EXPECTED_ENV}${NC}"
    exit 1
fi

ACTUAL_ENV=$(cat "$MARKER_FILE")

if [[ "$ACTUAL_ENV" != "$EXPECTED_ENV" ]]; then
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ BUILD ENVIRONMENT MISMATCH${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e ""
    echo -e "  Expected:  ${GREEN}${EXPECTED_ENV}${NC}"
    echo -e "  Actual:    ${RED}${ACTUAL_ENV}${NC}"
    echo -e ""
    echo -e "  The dist/ folder was built for ${RED}${ACTUAL_ENV}${NC}"
    echo -e "  but you're trying to deploy to ${GREEN}${EXPECTED_ENV}${NC}."
    echo -e ""
    echo -e "  ${YELLOW}FIX: Rebuild with the correct mode:${NC}"
    echo -e "       npm run build:${EXPECTED_ENV}"
    echo -e ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build environment verified: ${ACTUAL_ENV}${NC}"
exit 0

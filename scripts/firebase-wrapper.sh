#!/bin/bash
# ============================================================================
# FIREBASE DEPLOY WRAPPER
# ============================================================================
# This script wraps firebase commands to prevent accidental direct deploys.
# It intercepts `firebase deploy` commands and redirects to the proper pipeline.
#
# INSTALLATION:
#   Add this to your shell profile (.bashrc, .zshrc, etc.):
#   alias firebase="./scripts/firebase-wrapper.sh"
#
# WHY THIS EXISTS:
#   Direct `firebase deploy` commands bypass the build environment verification,
#   which can result in deploying a dev build to staging or production.
#   This wrapper catches those commands and tells you how to deploy correctly.
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if this is a deploy command
if [[ "$1" == "deploy" ]]; then
    # Check if it's a hosting deploy
    if [[ "$*" == *"hosting"* ]]; then
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}❌ DIRECT FIREBASE DEPLOY BLOCKED${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e ""
        echo -e "  Direct ${YELLOW}firebase deploy${NC} commands are blocked to prevent"
        echo -e "  deploying builds with the wrong environment configuration."
        echo -e ""
        echo -e "  ${GREEN}USE THESE COMMANDS INSTEAD:${NC}"
        echo -e ""
        echo -e "    ${GREEN}npm run deploy:dev${NC}        → Deploy to development"
        echo -e "    ${GREEN}npm run deploy:staging${NC}    → Deploy to staging"
        echo -e "    ${GREEN}npm run deploy:production${NC} → Deploy to production"
        echo -e ""
        echo -e "  These commands ensure the build matches the target environment."
        echo -e ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        exit 1
    fi
fi

# For all other firebase commands, pass through to real firebase
exec firebase "$@"

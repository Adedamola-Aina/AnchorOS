#!/bin/bash
# Anchor OS Deployment Script
# This script ensures the correct build is deployed to the correct environment
# NEVER deploy without using this script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENV=$1

if [ -z "$ENV" ]; then
    echo -e "${RED}ERROR: Environment required${NC}"
    echo ""
    echo "Usage: ./scripts/deploy.sh <environment>"
    echo ""
    echo "Environments:"
    echo "  dev      - Deploy to Dev (blue banner)"
    echo "  staging  - Deploy to Staging (yellow banner)"
    echo "  prod     - Deploy to Production (requires confirmation)"
    echo "  all      - Deploy to Dev AND Staging (NOT production)"
    echo ""
    exit 1
fi

cd /root/anchor-os

case $ENV in
    dev)
        echo -e "${BLUE}═══════════════════════════════════════════${NC}"
        echo -e "${BLUE}  DEPLOYING TO DEV ENVIRONMENT${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════${NC}"
        echo ""
        echo -e "${YELLOW}Building with --mode development...${NC}"
        npm run build:dev
        echo ""
        echo -e "${YELLOW}Deploying to hosting:dev...${NC}"
        firebase deploy --only hosting:dev
        echo ""
        echo -e "${GREEN}✓ Dev deployment complete!${NC}"
        echo -e "${GREEN}  URL: https://anchor-os-dev-1c6ec.web.app${NC}"
        echo -e "${GREEN}  Banner: BLUE (Development)${NC}"
        ;;
    staging)
        echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
        echo -e "${YELLOW}  DEPLOYING TO STAGING ENVIRONMENT${NC}"
        echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
        echo ""
        echo -e "${YELLOW}Building with --mode staging...${NC}"
        npm run build:staging
        echo ""
        echo -e "${YELLOW}Deploying to hosting:staging...${NC}"
        firebase deploy --only hosting:staging
        echo ""
        echo -e "${GREEN}✓ Staging deployment complete!${NC}"
        echo -e "${GREEN}  URL: https://anchor-os-staging.web.app${NC}"
        echo -e "${GREEN}  Banner: YELLOW (Staging)${NC}"
        ;;
    prod|production)
        echo -e "${RED}═══════════════════════════════════════════${NC}"
        echo -e "${RED}  ⚠️  PRODUCTION DEPLOYMENT ⚠️${NC}"
        echo -e "${RED}═══════════════════════════════════════════${NC}"
        echo ""
        echo -e "${RED}WARNING: You are about to deploy to PRODUCTION!${NC}"
        echo ""
        read -p "Type 'DEPLOY PRODUCTION' to confirm: " confirm
        if [ "$confirm" != "DEPLOY PRODUCTION" ]; then
            echo -e "${RED}Deployment cancelled.${NC}"
            exit 1
        fi
        echo ""
        echo -e "${YELLOW}Building with --mode production...${NC}"
        npm run build:production
        echo ""
        echo -e "${YELLOW}Deploying to hosting:production...${NC}"
        firebase deploy --only hosting:production
        echo ""
        echo -e "${GREEN}✓ Production deployment complete!${NC}"
        echo -e "${GREEN}  URL: https://anchor-os.web.app${NC}"
        echo -e "${GREEN}  Banner: NONE (Production)${NC}"
        ;;
    all)
        echo -e "${BLUE}═══════════════════════════════════════════${NC}"
        echo -e "${BLUE}  DEPLOYING TO DEV + STAGING${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════${NC}"
        echo ""
        
        # Dev first
        echo -e "${BLUE}[1/2] Building for DEV...${NC}"
        npm run build:dev
        echo -e "${BLUE}[1/2] Deploying to DEV...${NC}"
        firebase deploy --only hosting:dev
        echo ""
        
        # Then staging
        echo -e "${YELLOW}[2/2] Building for STAGING...${NC}"
        npm run build:staging
        echo -e "${YELLOW}[2/2] Deploying to STAGING...${NC}"
        firebase deploy --only hosting:staging
        echo ""
        
        echo -e "${GREEN}═══════════════════════════════════════════${NC}"
        echo -e "${GREEN}✓ Both deployments complete!${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════${NC}"
        echo -e "${BLUE}  Dev:     https://anchor-os-dev-1c6ec.web.app (BLUE banner)${NC}"
        echo -e "${YELLOW}  Staging: https://anchor-os-staging.web.app (YELLOW banner)${NC}"
        ;;
    *)
        echo -e "${RED}ERROR: Unknown environment '$ENV'${NC}"
        echo "Valid environments: dev, staging, prod, all"
        exit 1
        ;;
esac

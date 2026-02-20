#!/bin/bash
set -e

# ============================================================================
# ANCHOR OS VERSION BUMP SCRIPT
# ============================================================================
#
# Called by DEPLOY_PIPELINE.sh before the build step.
# Bumps the version in package.json based on target environment:
#
#   development: prerelease with --prerelease dev (e.g., 1.7.8-dev.0)
#   staging:     prerelease with --prerelease rc  (e.g., 1.8.0-rc.0)
#   production:  full release from commit history (e.g., 1.8.0)
#
# USAGE:
#   ./scripts/bump-version.sh --env=development
#   ./scripts/bump-version.sh --env=staging
#   ./scripts/bump-version.sh --env=production
# ============================================================================

cd "$(dirname "$0")/.."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse arguments
ENV="development"
while [[ $# -gt 0 ]]; do
    case $1 in
        --env=*) ENV="${1#*=}"; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

OLD_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}📦 Current version: ${OLD_VERSION}${NC}"

case $ENV in
    development)
        npx commit-and-tag-version --prerelease dev --skip.commit --skip.tag
        ;;
    staging)
        npx commit-and-tag-version --prerelease rc --skip.commit --skip.tag
        ;;
    production)
        npx commit-and-tag-version --skip.commit --skip.tag
        ;;
    *)
        echo "Unknown environment: $ENV"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✅ Bumped: ${OLD_VERSION} → ${NEW_VERSION}${NC}"

# Commit the version bump
git add package.json CHANGELOG.md 2>/dev/null || git add package.json
git commit --no-verify -m "chore(release): ${ENV} v${NEW_VERSION}" || true

# For production: create and push git tag
if [[ "$ENV" == "production" ]]; then
    git tag "v${NEW_VERSION}"
    echo -e "${GREEN}🏷  Tagged: v${NEW_VERSION}${NC}"
    git push --no-verify origin master --tags 2>/dev/null || true
fi

echo -e "${GREEN}📦 Version bump complete: v${NEW_VERSION} (${ENV})${NC}"

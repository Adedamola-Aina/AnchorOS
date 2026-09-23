#!/usr/bin/env bash
#
# Deploy AnchorOS to a Firebase environment.
#
#   ./scripts/deploy.sh --env=staging
#   ./scripts/deploy.sh --env=production --yes
#
# Assumes the environment files already exist (the Deploy workflow writes them
# from GitHub secrets):
#   .env.<env>                  app config, read by Vite at build time
#   functions/.env.<projectId>  Functions config, read by firebase-tools
#
# Deploys every surface together: hosting, Firestore rules + indexes, storage
# rules, and Cloud Functions.
set -euo pipefail

cd "$(dirname "$0")/.."

ENV=""
CONFIRM=0

for arg in "$@"; do
  case "$arg" in
    --env=*) ENV="${arg#*=}" ;;
    --yes|-y) CONFIRM=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

case "$ENV" in
  staging)    PROJECT="anchor-os-staging" ;;
  production) PROJECT="anchor-os" ;;
  *) echo "Usage: ./scripts/deploy.sh --env=staging|production [--yes]" >&2; exit 1 ;;
esac

if [ -n "$(git status --porcelain)" ]; then
  echo "Refusing to deploy: working tree is not clean." >&2
  exit 1
fi

if [ "$ENV" = "production" ] && [ "$CONFIRM" -ne 1 ]; then
  echo "Refusing production deploy without --yes." >&2
  exit 1
fi

echo "Building the $ENV bundle..."
npm run "build:$ENV"

echo "Deploying $ENV ($PROJECT)..."
firebase deploy \
  --project "$PROJECT" \
  --only "hosting:$ENV,firestore:rules,firestore:indexes,storage,functions"

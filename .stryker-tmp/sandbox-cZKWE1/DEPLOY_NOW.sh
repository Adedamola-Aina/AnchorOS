#!/bin/bash

# Anchor OS - Firestore Rules Deployment Script
# This script deploys the security rules to Firebase

set -e  # Exit on error

echo "=========================================="
echo "  Anchor OS - Firestore Rules Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo -e "${GREEN}✅ Firebase CLI installed${NC}"
echo ""

# Check if user is logged in
echo "Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo ""
    echo "Opening browser for authentication..."
    echo "Please complete the login process in your browser."
    echo ""
    firebase login
else
    echo -e "${GREEN}✅ Already logged in to Firebase${NC}"
fi

echo ""
echo "=========================================="
echo "  Deploying Firestore Security Rules"
echo "=========================================="
echo ""

# Show current project
CURRENT_PROJECT=$(firebase use)
echo "Current Firebase project: $CURRENT_PROJECT"
echo ""

# Check if rules file exists
if [ ! -f "firestore.rules" ]; then
    echo -e "${RED}❌ firestore.rules file not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Rules file found${NC}"
echo ""
echo "Deploying rules to Firebase..."
echo ""

# Deploy only Firestore rules
if firebase deploy --only firestore:rules; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
    echo "=========================================="
    echo ""
    echo "Your Firestore security rules are now live!"
    echo ""
    echo "Next steps:"
    echo "  1. Verify rules in Firebase Console:"
    echo "     https://console.firebase.google.com/project/anchor-os/firestore/rules"
    echo ""
    echo "  2. Test the rules using the Rules Playground"
    echo ""
    echo "  3. Monitor for any permission errors in your app"
    echo ""
else
    echo ""
    echo "=========================================="
    echo -e "${RED}❌ DEPLOYMENT FAILED${NC}"
    echo "=========================================="
    echo ""
    echo "Please check the error messages above and try again."
    exit 1
fi

#!/bin/bash
# Script to run integration tests with Firebase Emulator

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔥 Starting Firebase Emulators...${NC}"

# Check if emulators are already running
if lsof -i:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Firestore emulator already running on port 8080${NC}"
    EMULATOR_ALREADY_RUNNING=true
else
    EMULATOR_ALREADY_RUNNING=false
fi

if [ "$EMULATOR_ALREADY_RUNNING" = false ]; then
    # Start emulators in background
    firebase emulators:start --only auth,firestore,functions &
    EMULATOR_PID=$!
    
    # Wait for emulators to be ready
    echo -e "${YELLOW}⏳ Waiting for emulators to start...${NC}"
    
    # Wait for Firestore emulator (port 8080) - longer timeout for first run
    for i in {1..90}; do
        if curl -s http://localhost:8080 > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Firestore emulator ready${NC}"
            break
        fi
        if [ $i -eq 90 ]; then
            echo -e "${RED}✗ Timeout waiting for Firestore emulator${NC}"
            kill $EMULATOR_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done
    
    # Wait for Auth emulator (port 9099)
    for i in {1..10}; do
        if curl -s http://localhost:9099 > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Auth emulator ready${NC}"
            break
        fi
        sleep 1
    done
fi

# Run integration tests
echo -e "${YELLOW}🧪 Running integration tests...${NC}"
FIRESTORE_EMULATOR_HOST=localhost:8080 \
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
npm test -- --run --testNamePattern="Integration"

TEST_EXIT_CODE=$?

# Cleanup if we started the emulators
if [ "$EMULATOR_ALREADY_RUNNING" = false ]; then
    echo -e "${YELLOW}🛑 Stopping emulators...${NC}"
    kill $EMULATOR_PID 2>/dev/null || true
fi

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All integration tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
fi

exit $TEST_EXIT_CODE

#!/bin/sh

BASE_URL=${1:-"http://localhost:8080"}

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Running Smoke Tests against $BASE_URL..."
FAIL_COUNT=0

# Test 1: GET /api/health
echo "Test 1: GET /api/health"
HEALTH_RES=$(curl -s -w "%{http_code}" $BASE_URL/api/health)
HTTP_CODE=${HEALTH_RES: -3}
BODY=${HEALTH_RES::-3}

if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q '"ok"'; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC} (Code: $HTTP_CODE)"
  FAIL_COUNT=$((FAIL_COUNT+1))
fi

# Test 2: POST /api/chat with valid payload
echo "Test 2: POST /api/chat valid payload"
CHAT_RES=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"message":"What is EVM?"}' $BASE_URL/api/chat)
HTTP_CODE=${CHAT_RES: -3}

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC} (Code: $HTTP_CODE)"
  FAIL_COUNT=$((FAIL_COUNT+1))
fi

# Test 3: POST /api/chat with empty body
echo "Test 3: POST /api/chat empty body"
EMPTY_RES=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" $BASE_URL/api/chat)
HTTP_CODE=${EMPTY_RES: -3}

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC} (Code: $HTTP_CODE)"
  FAIL_COUNT=$((FAIL_COUNT+1))
fi

# Test 4: Rate limit hit
echo "Test 4: POST /api/chat 21 times rapidly"
RATE_FAIL=0
for i in $(seq 1 21); do
  RES=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"message":"spam"}' $BASE_URL/api/chat)
  CODE=${RES: -3}
  if [ "$CODE" = "429" ]; then
    RATE_FAIL=1
    break
  fi
done

if [ "$RATE_FAIL" = "1" ]; then
  echo -e "${GREEN}PASS${NC}"
else
  echo -e "${RED}FAIL${NC} (No 429 received)"
  FAIL_COUNT=$((FAIL_COUNT+1))
fi

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo -e "${RED}Smoke tests failed with $FAIL_COUNT errors.${NC}"
  exit 1
else
  echo -e "${GREEN}All smoke tests passed successfully!${NC}"
  exit 0
fi

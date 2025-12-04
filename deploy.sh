#!/bin/bash
set -e

echo "Production Deployment for multiplicationmaster"
echo "=============================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Step 1: Building CSS assets...${NC}"
cd gameon && npx grunt less && cd ..
echo -e "${GREEN}Assets built${NC}"

echo -e "\n${YELLOW}Step 2: Syncing static files to R2${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"
SYNC_OPTS="--endpoint-url $R2_ENDPOINT --size-only"

aws s3 sync ./static s3://multiplicationmasterstatic/static $SYNC_OPTS
aws s3 sync ./gameon/static s3://multiplicationmasterstatic/gameon/static $SYNC_OPTS
aws s3 sync ./templates s3://multiplicationmasterstatic/templates $SYNC_OPTS

echo -e "${GREEN}Static files synced to R2${NC}"

echo -e "\n${YELLOW}Step 3: Clearing Cloudflare cache${NC}"
if [[ -n "$CLOUDFLARE_API_KEY" && -f "../netwrck/clear_caches.py" ]]; then
    python3 ../netwrck/clear_caches.py
    echo -e "${GREEN}Cache cleared${NC}"
else
    echo -e "${YELLOW}Skipping cache clear${NC}"
fi

echo -e "\n${GREEN}Deployment complete!${NC}"
echo "Next: Upload and restart server"

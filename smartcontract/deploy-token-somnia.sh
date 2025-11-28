#!/bin/bash
# Deploy only the token to Somnia

NETWORK="somnia-dream"

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

PRIVATE_KEY=$(echo "$PRIVATE_KEY" | xargs)
if [[ ! "$PRIVATE_KEY" =~ ^0x ]]; then
    PRIVATE_KEY="0x$PRIVATE_KEY"
fi

echo "Deploying BaseToken to Somnia..."
forge script script/DeployToken.s.sol:DeployToken \
    --rpc-url $NETWORK \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --slow \
    --gas-limit 1000000


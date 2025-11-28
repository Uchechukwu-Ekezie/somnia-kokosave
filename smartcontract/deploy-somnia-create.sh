#!/bin/bash
# Deploy to Somnia using forge create (bypasses script simulation issues)

NETWORK="somnia-dream"

echo "Loading .env file..."

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

echo ""
echo "Deploying to Somnia Dream Testnet (Chain ID: 50312)..."
echo "⚠️  Make sure you have STT tokens for gas fees!"
echo ""

# Deploy BaseToken
echo "Step 1: Deploying BaseToken..."
TOKEN_OUTPUT=$(forge create src/BaseToken.sol:BaseToken \
    --rpc-url $NETWORK \
    --private-key "$PRIVATE_KEY" \
    --constructor-args "Base Safe Token" "BST" \
    --legacy \
    --gas-limit 1000000 \
    --broadcast 2>&1)

TOKEN_ADDRESS=$(echo "$TOKEN_OUTPUT" | grep -oP "Deployed to: \K0x[a-fA-F0-9]{40}" || echo "")

if [ -z "$TOKEN_ADDRESS" ]; then
    echo "❌ Failed to deploy BaseToken"
    echo "$TOKEN_OUTPUT"
    exit 1
fi

echo "✅ BaseToken deployed at: $TOKEN_ADDRESS"
echo ""

# Deploy BaseSafeFactory
TREASURY="0xa91D5A0a64ED5eeF11c4359C4631279695A338ef"
echo "Step 2: Deploying BaseSafeFactory..."
echo "Using Token: $TOKEN_ADDRESS"
echo "Using Treasury: $TREASURY"
echo ""

FACTORY_OUTPUT=$(forge create src/BaseSafeFactory.sol:BaseSafeFactory \
    --rpc-url $NETWORK \
    --private-key "$PRIVATE_KEY" \
    --constructor-args "$TOKEN_ADDRESS" "$TREASURY" \
    --legacy \
    --gas-limit 5000000 \
    --broadcast 2>&1)

FACTORY_ADDRESS=$(echo "$FACTORY_OUTPUT" | grep -oP "Deployed to: \K0x[a-fA-F0-9]{40}" || echo "")

if [ -z "$FACTORY_ADDRESS" ]; then
    echo "❌ Failed to deploy BaseSafeFactory"
    echo "$FACTORY_OUTPUT"
    exit 1
fi

echo "✅ BaseSafeFactory deployed at: $FACTORY_ADDRESS"
echo ""
echo "=== Deployment Summary ==="
echo "Token Address: $TOKEN_ADDRESS"
echo "Factory Address: $FACTORY_ADDRESS"
echo "Treasury Address: $TREASURY"
echo ""
echo "📝 Next steps:"
echo "   1. Update frontend/.env.local with these addresses"
echo "   2. Update smartcontract/DEPLOYMENTS.md"
echo "   3. Test the contracts on Somnia testnet"


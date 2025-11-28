#!/bin/bash
# Script to update .env.local with Somnia addresses

ENV_FILE=".env.local"

echo "Updating frontend/.env.local with Somnia addresses..."

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating new .env.local file..."
    cat > "$ENV_FILE" << 'EOF'
# Somnia Dream Testnet - Deployed Contracts
NEXT_PUBLIC_FACTORY_ADDRESS=0x2431B645983ef9A58042479095B80d72100BFf04
NEXT_PUBLIC_TOKEN_ADDRESS=0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773

# Somnia Network Configuration
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network

# Supabase Configuration
# Add your Supabase credentials here
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF
    echo "✅ Created .env.local file"
else
    echo "Updating existing .env.local file..."
    
    # Backup original
    cp "$ENV_FILE" "${ENV_FILE}.backup"
    echo "✅ Created backup: ${ENV_FILE}.backup"
    
    # Update factory address
    sed -i.bak 's/^NEXT_PUBLIC_FACTORY_ADDRESS=.*/NEXT_PUBLIC_FACTORY_ADDRESS=0x2431B645983ef9A58042479095B80d72100BFf04/' "$ENV_FILE"
    
    # Update token address
    sed -i.bak 's/^NEXT_PUBLIC_TOKEN_ADDRESS=.*/NEXT_PUBLIC_TOKEN_ADDRESS=0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773/' "$ENV_FILE"
    
    # Add Somnia config if not present
    if ! grep -q "NEXT_PUBLIC_CHAIN_ID" "$ENV_FILE"; then
        echo "" >> "$ENV_FILE"
        echo "# Somnia Network Configuration" >> "$ENV_FILE"
        echo "NEXT_PUBLIC_CHAIN_ID=50312" >> "$ENV_FILE"
        echo "NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network" >> "$ENV_FILE"
    fi
    
    # Clean up backup files
    rm -f "${ENV_FILE}.bak"
    
    echo "✅ Updated .env.local file"
fi

echo ""
echo "✅ Done! Your .env.local has been updated with Somnia addresses."
echo ""
echo "Next steps:"
echo "1. Restart your Next.js dev server (npm run dev)"
echo "2. Connect MetaMask to Somnia Dream (Chain ID: 50312)"
echo "3. Test your application!"


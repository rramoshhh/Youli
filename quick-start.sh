#!/bin/bash

# Youli-Next Quick Start Script
# This script helps you get started with local development

set -e

echo "🚀 Youli-Next Quick Start"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js 20+ required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version OK: $(node -v)${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm version: $(npm -v)${NC}"
echo ""

# Ask what to install
echo "What would you like to set up?"
echo "1) Storefront only (Next.js)"
echo "2) Storefront + Medusa (Commerce)"
echo "3) Storefront + Strapi (CMS)"
echo "4) Full stack (Storefront + Medusa + Strapi)"
echo ""
read -p "Enter your choice (1-4): " choice

# Install storefront
install_storefront() {
    echo ""
    echo "📦 Installing Storefront dependencies..."
    npm install
    
    if [ ! -f .env.local ]; then
        echo ""
        echo "📝 Creating .env.local file..."
        cat > .env.local << EOF
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MEDUSA_API_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=
EOF
        echo -e "${GREEN}✅ Created .env.local${NC}"
        echo -e "${YELLOW}⚠️  Remember to update the API keys later${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.local already exists, skipping${NC}"
    fi
}

# Install Medusa
install_medusa() {
    echo ""
    echo "📦 Installing Medusa dependencies..."
    cd commerce
    npm install
    
    if [ ! -f .env ]; then
        echo ""
        echo "📝 Creating commerce/.env file..."
        cat > .env << EOF
DATABASE_URL=sqlite://./data/medusa.db
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
MEDUSA_BACKEND_URL=http://localhost:9000
ADMIN_CORS=http://localhost:7001,http://localhost:9000
STORE_CORS=http://localhost:3000
EOF
        echo -e "${GREEN}✅ Created commerce/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  commerce/.env already exists, skipping${NC}"
    fi
    
    cd ..
}

# Install Strapi
install_strapi() {
    echo ""
    echo "📦 Installing Strapi dependencies..."
    cd cms
    npm install
    
    if [ ! -f .env ]; then
        echo ""
        echo "📝 Creating cms/.env file..."
        cat > .env << EOF
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
EOF
        echo -e "${GREEN}✅ Created cms/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  cms/.env already exists, skipping${NC}"
    fi
    
    cd ..
}

# Execute based on choice
case $choice in
    1)
        install_storefront
        ;;
    2)
        install_storefront
        install_medusa
        ;;
    3)
        install_storefront
        install_strapi
        ;;
    4)
        install_storefront
        install_medusa
        install_strapi
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📚 Next steps:"
echo ""

case $choice in
    1)
        echo "Start the storefront:"
        echo "  npm run dev"
        echo ""
        echo "Then visit: http://localhost:3000"
        ;;
    2)
        echo "1. Start Medusa (in a new terminal):"
        echo "     cd commerce && npm run dev"
        echo ""
        echo "2. Start the storefront:"
        echo "     npm run dev"
        echo ""
        echo "Then visit:"
        echo "  - Storefront: http://localhost:3000"
        echo "  - Medusa Admin: http://localhost:9000/app"
        ;;
    3)
        echo "1. Start Strapi (in a new terminal):"
        echo "     cd cms && npm run develop"
        echo ""
        echo "2. Start the storefront:"
        echo "     npm run dev"
        echo ""
        echo "Then visit:"
        echo "  - Storefront: http://localhost:3000"
        echo "  - Strapi Admin: http://localhost:1337/admin"
        ;;
    4)
        echo "1. Start Medusa (in a new terminal):"
        echo "     cd commerce && npm run dev"
        echo ""
        echo "2. Start Strapi (in another terminal):"
        echo "     cd cms && npm run develop"
        echo ""
        echo "3. Start the storefront:"
        echo "     npm run dev"
        echo ""
        echo "Then visit:"
        echo "  - Storefront: http://localhost:3000"
        echo "  - Medusa Admin: http://localhost:9000/app"
        echo "  - Strapi Admin: http://localhost:1337/admin"
        ;;
esac

echo ""
echo -e "${YELLOW}📖 For deployment instructions, see DEPLOYMENT.md${NC}"
echo ""

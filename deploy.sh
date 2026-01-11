#!/bin/bash

# Ayyappa Swami Temple Website - Deployment Script
# This script automates the build and deployment process

echo "🏛️  Ayyappa Swami Temple Website Deployment"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Firebase is installed
if ! command -v firebase &> /dev/null
then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Build the project
echo -e "${YELLOW}🔨 Building Angular project for production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Deploy to Firebase
echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"
firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "🎉 Your website is now live!"
    echo ""
    echo "📱 View your website:"
    firebase hosting:channel:list
    echo ""
    echo -e "${GREEN}Swamiye Saranam Ayyappa! 🙏${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Please check the error messages above."
    exit 1
fi

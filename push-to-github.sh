#!/bin/bash

# Stock Market App - GitHub Push Script
# 
# Instructions:
# 1. First create a repository on GitHub.com with the name: StockMarketApp
# 2. Replace YOUR_USERNAME with your actual GitHub username
# 3. Run this script: bash push-to-github.sh

echo "🚀 Pushing Stock Market App to GitHub..."

# Replace YOUR_USERNAME with your actual GitHub username
GITHUB_USERNAME="YOUR_USERNAME"
REPO_NAME="StockMarketApp"

# Check if username is set
if [ "$GITHUB_USERNAME" = "YOUR_USERNAME" ]; then
    echo "❌ Please edit this script and replace YOUR_USERNAME with your actual GitHub username"
    exit 1
fi

# Add remote origin
echo "📡 Adding GitHub remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Your repository is now available at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Add a repository description and topics"
echo "3. Consider adding a license"
echo "4. Start developing amazing features!"

#!/bin/bash

# Stock Market App - GitHub CLI Setup Script
# This script installs GitHub CLI and creates the repository automatically

echo "🚀 Setting up GitHub CLI and creating repository..."

# Install GitHub CLI
echo "📦 Installing GitHub CLI..."
brew install gh

# Authenticate with GitHub
echo "🔐 Please authenticate with GitHub..."
gh auth login

# Create repository on GitHub
echo "📁 Creating repository on GitHub..."
gh repo create StockMarketApp --public --description "Modern cross-platform stock market mobile application built with React Native and Expo" --source=. --remote=origin --push

echo "✅ Repository created and pushed successfully!"
echo "🌐 Your repository is available at: https://github.com/$(gh api user --jq .login)/StockMarketApp"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Add topics like: react-native, expo, typescript, stock-market, mobile-app"
echo "3. Consider adding a license"
echo "4. Start developing amazing features!"

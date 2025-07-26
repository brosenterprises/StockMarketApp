# Deployment Guide - Stock Market Mobile App

This guide covers deploying your stock market mobile app to both the Apple App Store and Google Play Store using Expo Application Services (EAS) - completely free for basic usage.

## Overview

We'll use **Expo Application Services (EAS)** which provides:
- ✅ **Free tier available** (limited builds per month)
- ✅ **Automated builds** for iOS and Android
- ✅ **Over-the-air updates** without app store approval
- ✅ **Preview builds** for testing
- ✅ **Automated submission** to app stores

## Prerequisites

### 1. Expo Account
```bash
# Create account at https://expo.dev/
# Then login via CLI
npx eas-cli login
```

### 2. Apple Developer Account (iOS)
- **Cost**: $99/year
- **Required for**: App Store deployment
- **Sign up**: https://developer.apple.com/programs/

### 3. Google Play Console Account (Android)
- **Cost**: $25 one-time fee
- **Required for**: Google Play Store deployment
- **Sign up**: https://play.google.com/console/

## Initial Setup

### 1. Configure EAS
```bash
cd "/Users/talusaws/Desktop/Personal Projects/StockMarketApp"

# Initialize EAS configuration
npx eas build:configure

# This creates eas.json with build profiles
```

### 2. Update App Configuration
Edit `app.json` with your app details:
```json
{
  "expo": {
    "name": "Stock Market Pro",
    "slug": "stock-market-pro",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.stockmarketpro",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.stockmarketpro",
      "versionCode": 1
    }
  }
}
```

## Development Builds (Free Testing)

### 1. Create Development Build
```bash
# Build for development/testing (free)
npx eas build --profile development --platform all

# Or build for specific platform
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

### 2. Install on Device
- Download the build from EAS dashboard
- Install on your device for testing
- No need for Expo Go app

### 3. Preview Builds (Share with Testers)
```bash
# Create preview build for sharing
npx eas build --profile preview --platform all

# Share the generated QR code with testers
```

## Production Deployment

### 1. iOS App Store Deployment

#### Step 1: Configure iOS Settings
Update `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

#### Step 2: Create Production Build
```bash
# Build for App Store
npx eas build --profile production --platform ios
```

#### Step 3: Submit to App Store
```bash
# Automated submission
npx eas submit --platform ios

# Or manual submission via App Store Connect
```

#### Step 4: App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create new app
3. Fill in app information:
   - **Name**: Stock Market Pro
   - **Category**: Finance
   - **Description**: Modern stock market tracking app
   - **Keywords**: stocks, finance, portfolio, trading
   - **Screenshots**: Required for different device sizes
4. Set pricing (Free recommended initially)
5. Submit for review

### 2. Google Play Store Deployment

#### Step 1: Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create service account for Play Console API
3. Download JSON key file
4. Add to `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

#### Step 2: Create Production Build
```bash
# Build for Google Play
npx eas build --profile production --platform android
```

#### Step 3: Submit to Google Play
```bash
# Automated submission
npx eas submit --platform android
```

#### Step 4: Google Play Console Setup
1. Go to [Google Play Console](https://play.google.com/console/)
2. Create new app
3. Fill in app details:
   - **App name**: Stock Market Pro
   - **Category**: Finance
   - **Description**: Comprehensive stock market tracking
   - **Screenshots**: Required for phones and tablets
4. Set up content rating
5. Create release and submit for review

## Over-the-Air Updates (OTA)

### 1. Publish Updates
```bash
# Publish JavaScript/asset updates without app store
npx eas update --branch production --message "Bug fixes and improvements"

# For specific platforms
npx eas update --branch production --platform ios
npx eas update --branch production --platform android
```

### 2. Configure Update Channels
In `app.json`:
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

## Free Tier Limitations & Costs

### EAS Free Tier Includes:
- ✅ **Unlimited OTA updates**
- ✅ **Limited builds per month** (check current limits)
- ✅ **Basic analytics**
- ✅ **Preview builds**

### Paid Plans Start At:
- **Production Plan**: $29/month
- **Enterprise Plan**: $99/month
- More builds, priority support, advanced features

### App Store Costs:
- **Apple Developer**: $99/year
- **Google Play**: $25 one-time

## Testing Strategy

### 1. Internal Testing (Free)
```bash
# Create internal test build
npx eas build --profile preview --platform all

# Share with team via QR code
```

### 2. Beta Testing

#### iOS TestFlight
- Automatic with App Store Connect
- Up to 10,000 beta testers
- 90-day testing periods

#### Android Internal Testing
- Upload to Google Play Console
- Share with up to 100 testers
- Instant distribution

### 3. Staged Rollout
```bash
# Gradual rollout to percentage of users
npx eas submit --platform android --track production --rollout 0.1
```

## Monitoring & Analytics

### 1. Expo Analytics (Free)
- Basic usage statistics
- Crash reporting
- Update adoption rates

### 2. Third-party Analytics
Add to your app:
- **Firebase Analytics** (Free)
- **Amplitude** (Free tier)
- **Mixpanel** (Free tier)

## Automation & CI/CD

### 1. GitHub Actions Integration
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm install
      - run: npm test
      - uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npx eas build --platform all --non-interactive
```

### 2. Automated Testing
```bash
# Add to package.json scripts
"scripts": {
  "deploy:preview": "eas build --profile preview --platform all",
  "deploy:production": "eas build --profile production --platform all",
  "submit:all": "eas submit --platform all"
}
```

## Security Best Practices

### 1. Environment Variables
```bash
# Set secrets in EAS
npx eas secret:create --scope project --name API_KEY --value your-secret-key

# Use in app.json
{
  "expo": {
    "extra": {
      "apiKey": "$API_KEY"
    }
  }
}
```

### 2. Code Obfuscation
```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "proguardEnabled": true
          }
        }
      ]
    ]
  }
}
```

## Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Clear EAS cache
npx eas build:clear-cache

# Check build logs
npx eas build:list
```

#### 2. Submission Errors
- Verify app bundle identifiers match
- Check app store metadata requirements
- Ensure all required screenshots are uploaded

#### 3. Update Issues
```bash
# Check update status
npx eas update:list

# Roll back if needed
npx eas update:rollback
```

## Launch Checklist

### Pre-Launch:
- [ ] Test on multiple devices and OS versions
- [ ] Verify all API keys are working
- [ ] Test offline functionality
- [ ] Performance testing
- [ ] Security audit
- [ ] App store assets ready (icons, screenshots, descriptions)

### Launch Day:
- [ ] Submit to both app stores
- [ ] Monitor crash reports
- [ ] Prepare marketing materials
- [ ] Set up customer support
- [ ] Monitor user feedback

### Post-Launch:
- [ ] Regular OTA updates
- [ ] Monitor analytics
- [ ] Respond to user reviews
- [ ] Plan feature updates
- [ ] Scale infrastructure as needed

## Resources

- [EAS Documentation](https://docs.expo.dev/eas/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [Expo Application Services](https://expo.dev/eas)

---

**Ready to deploy?** Start with development builds and work your way up to production! 🚀

# Development Setup Guide

This guide will help you set up the Stock Market Mobile App for development and testing.

## Prerequisites

### Required Software
1. **Node.js** (v16 or higher)
   ```bash
   # Check version
   node --version
   
   # Install via Homebrew (macOS)
   brew install node
   ```

2. **Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Git** (for version control)
   ```bash
   # Check if installed
   git --version
   ```

### Mobile Development Tools

#### For iOS Development (macOS only)
1. **Xcode** (from Mac App Store)
2. **iOS Simulator** (included with Xcode)

#### For Android Development
1. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK and emulator

## Project Setup

### 1. Clone and Install Dependencies
```bash
cd "/Users/talusaws/Desktop/Personal Projects/StockMarketApp"
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
nano .env
```

### 3. Get Free API Keys

#### Alpha Vantage (Stock Data)
1. Visit: https://www.alphavantage.co/support/#api-key
2. Sign up for free account
3. Get API key (500 requests/day free)
4. Add to `.env`: `EXPO_PUBLIC_ALPHA_VANTAGE_API_KEY=your_key`

#### IEX Cloud (Market Data)
1. Visit: https://iexcloud.io/
2. Create free account (100,000 requests/month)
3. Get publishable token
4. Add to `.env`: `EXPO_PUBLIC_IEX_CLOUD_API_KEY=your_key`

#### Finnhub (Real-time Data)
1. Visit: https://finnhub.io/
2. Sign up for free account
3. Get API key (60 requests/minute free)
4. Add to `.env`: `EXPO_PUBLIC_FINNHUB_API_KEY=your_key`

#### News API (Financial News)
1. Visit: https://newsapi.org/
2. Register for free account
3. Get API key (1000 requests/day free)
4. Add to `.env`: `EXPO_PUBLIC_NEWS_API_KEY=your_key`

## Development Workflow

### 1. Start Development Server
```bash
# Start Expo development server
npm start

# Or start with specific platform
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

### 2. Testing on Real Devices

#### Install Expo Go App
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

#### Connect Device
1. Ensure device and computer are on same WiFi
2. Scan QR code from terminal with Expo Go app
3. App will load on your device

### 3. Code Quality Tools
```bash
# Run linting
npm run lint
npm run lint:fix

# Run type checking
npm run type-check

# Run tests
npm test
npm run test:watch
npm run test:coverage
```

## Building and Deployment

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Configure EAS
```bash
# Login to Expo account
eas login

# Configure project
eas build:configure
```

### 3. Build for Testing
```bash
# Build preview version
eas build --platform all --profile preview

# Build for internal testing
eas build --platform all --profile development
```

### 4. Production Builds
```bash
# Build for app stores
eas build --platform all --profile production
```

### 5. Submit to App Stores
```bash
# Submit to App Store (iOS)
eas submit --platform ios

# Submit to Google Play (Android)
eas submit --platform android
```

## Testing Strategy

### 1. Local Testing
- Use Expo Go app for instant testing
- Test on multiple device sizes
- Test both iOS and Android

### 2. Preview Builds
- Create preview builds for stakeholders
- Share via QR code or direct link
- Test on real devices without Expo Go

### 3. Automated Testing
```bash
# Unit tests
npm test

# E2E tests (when configured)
npm run test:e2e
```

## Debugging

### 1. React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Enable debugging in Expo
# Shake device or press Cmd+D in simulator
# Select "Debug JS Remotely"
```

### 2. Flipper (Advanced Debugging)
1. Install Flipper: https://fbflipper.com/
2. Configure for React Native
3. Debug network requests, Redux state, etc.

### 3. Console Logging
```javascript
// Use console.log for debugging
console.log('Debug info:', data);

// Use console.warn for warnings
console.warn('Warning message');

// Use console.error for errors
console.error('Error occurred:', error);
```

## Common Issues and Solutions

### 1. Metro Bundler Issues
```bash
# Clear cache
npx expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

### 2. iOS Simulator Issues
```bash
# Reset iOS Simulator
# Device > Erase All Content and Settings

# Restart simulator
# Device > Restart
```

### 3. Android Emulator Issues
```bash
# Cold boot emulator
# In Android Studio: AVD Manager > Cold Boot Now

# Wipe emulator data
# AVD Manager > Wipe Data
```

### 4. Dependency Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npx expo export --dump-assetmap

# Use React Native Bundle Visualizer
npm install --save-dev react-native-bundle-visualizer
```

### 2. Image Optimization
- Use WebP format for images
- Compress images before adding to project
- Use appropriate image sizes for different screen densities

### 3. Code Splitting
- Implement lazy loading for screens
- Use React.lazy() for components
- Split large bundles into smaller chunks

## Continuous Integration

### 1. GitHub Actions (Example)
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run lint
      - run: npm run type-check
```

### 2. Automated Builds
- Set up EAS Build triggers
- Configure automatic builds on push
- Set up preview builds for pull requests

## Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### Tools
- [Expo Snack](https://snack.expo.dev/) - Online playground
- [React Native Directory](https://reactnative.directory/) - Package directory
- [Expo Application Services](https://expo.dev/eas) - Build and deployment

## Support

If you encounter any issues during setup:

1. Check the [troubleshooting guide](./TROUBLESHOOTING.md)
2. Search existing issues in the repository
3. Create a new issue with detailed information
4. Join our development Discord channel

---

Happy coding! 🚀

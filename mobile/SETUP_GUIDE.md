# Mobile App Setup Guide

## Installation Steps

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI installed globally
- iOS Simulator (Mac only) or Android Emulator
- Or Expo Go app on your physical device

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 2: Install Dependencies
```bash
cd mobile
npm install
```

### Step 3: Configure API URL

Edit `services/api.js` and update the `API_URL` constant:

For **iOS Simulator**:
```javascript
const API_URL = 'http://localhost:5000/api';
```

For **Android Emulator**:
```javascript
const API_URL = 'http://10.0.2.2:5000/api';
```

For **Physical Device**:
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:5000/api';
```

To find your computer's IP:
- **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

Also update the Socket URL in `services/socket.js`:
```javascript
const SOCKET_URL = 'http://YOUR_IP:5000';
```

### Step 4: Start the Development Server
```bash
npm start
```

This will open the Expo DevTools in your browser.

### Step 5: Run the App

Choose one of the following options:

#### Option A: iOS Simulator (Mac only)
Press `i` in the terminal or click "Run on iOS simulator" in DevTools

#### Option B: Android Emulator
1. Start your Android emulator first
2. Press `a` in the terminal or click "Run on Android device/emulator" in DevTools

#### Option C: Physical Device
1. Install "Expo Go" app from App Store or Google Play
2. Scan the QR code shown in the terminal or DevTools
3. The app will load on your device

## Common Issues & Solutions

### Issue: Metro bundler fails to start
**Solution**: 
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm start -- --clear
```

### Issue: Cannot connect to backend API
**Solution**:
1. Ensure backend server is running on port 5000
2. Check API_URL in `services/api.js`
3. For physical device, ensure device and computer are on the same network
4. Check firewall settings

### Issue: Socket connection fails
**Solution**:
1. Update SOCKET_URL in `services/socket.js`
2. Ensure backend WebSocket server is running
3. Check that Socket.io versions match between backend and mobile

### Issue: React Native errors during development
**Solution**:
```bash
# Clear cache and restart
npm start -- --clear
```

## Development Tips

### Hot Reload
- Changes to code will automatically reload the app
- If not working, shake your device (or Cmd+D on iOS, Cmd+M on Android) and enable "Fast Refresh"

### Debugging
1. Shake device or press Cmd+D (iOS) / Cmd+M (Android)
2. Select "Debug" to open Chrome DevTools
3. Use `console.log()` statements to debug

### Testing on Multiple Devices
You can test the app on multiple devices simultaneously by scanning the same QR code.

## Building for Production

### iOS (Mac only)
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Note: You'll need an Expo account and appropriate app store accounts to publish.

## Expo Documentation
For more information, visit: https://docs.expo.dev/

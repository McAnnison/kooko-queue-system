# Quick Start Guide

This guide will help you get the Kooko Queue System up and running in the fastest way possible.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v14+): Run `node --version`
- ✅ npm: Run `npm --version`
- ✅ MongoDB: Run `mongod --version` (or use MongoDB Atlas)
- ✅ Expo CLI: Run `expo --version` (or install with `npm install -g expo-cli`)

## 5-Minute Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/McAnnison/kooko-queue-system.git
cd kooko-queue-system

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### Step 2: Configure Backend (1 minute)

```bash
# In the backend directory
cd backend
cp .env.example .env
```

Edit `.env` (use default values for quick start):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kooko-queue
JWT_SECRET=kooko_secret_key_for_development_only
NODE_ENV=development
```

### Step 3: Start MongoDB (30 seconds)

Choose one option:

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and update MONGODB_URI in .env

### Step 4: Start Backend (30 seconds)

```bash
# In backend directory
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

### Step 5: Start Mobile App (1 minute)

```bash
# In mobile directory
cd ../mobile
npm start
```

Then:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Or scan QR code with Expo Go app on your phone

## First Time Usage

### Create Vendor Account
1. Open the app
2. Click "Register"
3. Fill in details and select "Vendor" role
4. Login with your credentials
5. You'll see the vendor dashboard

### Create Customer Account
1. Register another account
2. Select "Customer" role
3. Login and browse the menu
4. Place an order
5. Track your order in "My Orders"

### Test the Flow
1. **As Customer**: Place an order
2. **As Vendor**: Open vendor dashboard and see the new order
3. **As Vendor**: Update order status (Pending → Preparing → Ready → Completed)
4. **As Customer**: Watch the order status update in real-time

## Common Quick Start Issues

### Issue: "Cannot connect to MongoDB"
**Solution**: 
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list             # Mac

# Or start it
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # Mac
```

### Issue: "Port 5000 already in use"
**Solution**:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env to 5001
```

### Issue: "Expo app can't connect to backend"
**Solution**:
1. For physical device, update API_URL in `mobile/services/api.js`:
```javascript
// Find your IP: ifconfig (Mac/Linux) or ipconfig (Windows)
const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```
2. Update SOCKET_URL in `mobile/services/socket.js` similarly

### Issue: "Module not found"
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

✅ You're all set! Here's what you can explore:

1. **Explore Features**: Try all the features mentioned in README.md
2. **Customize**: Modify menu items, pricing, or add new features
3. **Deploy**: Follow DEPLOYMENT_GUIDE.md to deploy to production
4. **Contribute**: Check CONTRIBUTING.md to contribute to the project

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🔧 Backend setup: [backend/DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md)
- 📱 Mobile setup: [mobile/SETUP_GUIDE.md](mobile/SETUP_GUIDE.md)
- 🐛 Found a bug? [Create an issue](https://github.com/McAnnison/kooko-queue-system/issues)

## Development Tips

```bash
# Backend: Auto-reload on changes
cd backend
npm run dev

# Mobile: Clear cache if issues occur
cd mobile
npm start -- --clear

# View backend logs in real-time
cd backend
tail -f logs/app.log  # If you add logging

# Check API is working
curl http://localhost:5000/
```

## Architecture Overview

```
Customer App → API Server → MongoDB
                 ↓
            Socket.io (Real-time updates)
                 ↓
              Vendor App
```

**Happy Coding! 🎉**

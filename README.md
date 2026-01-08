# Kooko Queue System

A full-stack mobile application for an online queue system designed for a porridge (Kooko) vendor and her customers. This app allows customers to place orders for their porridge before arriving, helping them save time and avoid hunger while waiting.

## 🌟 Features

### For Customers:
- **User Registration & Authentication**: Secure sign-up and login
- **Browse Menu**: View available porridge types, sizes, and extras
- **Place Orders**: Order porridge with customization options
- **Real-time Queue Status**: View current queue length and estimated wait time
- **Order Tracking**: Track order status (Pending → Preparing → Ready → Completed)
- **Order History**: View past and current orders
- **Order Cancellation**: Cancel orders before they're completed

### For Vendors:
- **Dashboard Overview**: View statistics of pending, preparing, and ready orders
- **Order Management**: View all orders with filtering options
- **Status Updates**: Update order status in real-time
- **Customer Information**: Access customer details for each order
- **Queue Management**: Manage the order queue efficiently

### Real-time Features:
- Live order updates via WebSocket (Socket.io)
- Instant queue position changes
- Push notifications for order status changes

## 🛠 Tech Stack

### Backend:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Password Hashing**: bcryptjs
- **CORS**: For cross-origin requests

### Frontend (Mobile):
- **Framework**: React Native with Expo
- **UI Library**: React Native Paper
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Local Storage**: AsyncStorage
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
kooko-queue-system/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   └── orderController.js
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.js        # Authentication middleware
│   │   ├── models/            # Database models
│   │   │   ├── User.js
│   │   │   └── Order.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   └── orders.js
│   │   └── server.js          # Entry point
│   ├── .env.example           # Environment variables template
│   └── package.json
│
└── mobile/                    # React Native mobile app
    ├── screens/               # App screens
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── HomeScreen.js
    │   ├── PlaceOrderScreen.js
    │   ├── MyOrdersScreen.js
    │   └── VendorScreen.js
    ├── navigation/            # Navigation configuration
    │   └── AppNavigator.js
    ├── services/              # API and Socket services
    │   ├── api.js
    │   └── socket.js
    ├── App.js                 # Root component
    ├── app.json               # Expo configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Expo CLI (for mobile development)
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kooko-queue
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Run the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend API will be available at `http://localhost:5000`

### Mobile App Setup

1. **Navigate to the mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally (if not already installed):**
   ```bash
   npm install -g expo-cli
   ```

4. **Update API URL:**
   
   Edit `mobile/services/api.js` and update the API_URL:
   - For iOS Simulator: `http://localhost:5000/api`
   - For Android Emulator: `http://10.0.2.2:5000/api`
   - For physical device: Use your computer's IP address `http://YOUR_IP:5000/api`

5. **Start the Expo development server:**
   ```bash
   npm start
   ```

6. **Run the app:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 Using the App

### Customer Flow:
1. **Register/Login**: Create an account or login as a customer
2. **Browse Menu**: View available porridge options on the home screen
3. **Place Order**: 
   - Select porridge type (Plain, With Milk, With Sugar, Special)
   - Choose size (Small, Medium, Large)
   - Select quantity
   - Add extras (Groundnut, Milk, Sugar, Dates)
   - Add special instructions
   - Submit order
4. **Track Order**: View order status and queue position in "My Orders"
5. **Receive Notification**: Get notified when order status changes

### Vendor Flow:
1. **Register/Login**: Create an account with vendor role
2. **View Dashboard**: See overview of pending, preparing, and ready orders
3. **Manage Orders**: Filter orders by status
4. **Update Status**: Change order status through the workflow:
   - Pending → Preparing → Ready → Completed
5. **Monitor Queue**: Keep track of queue length and manage efficiently

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Orders
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/my-orders` - Get customer's orders (authenticated)
- `GET /api/orders/queue-status` - Get current queue status (public)
- `GET /api/orders/:id` - Get order by ID (authenticated)
- `GET /api/orders` - Get all orders (vendor only)
- `PUT /api/orders/:id/status` - Update order status (vendor only)
- `DELETE /api/orders/:id` - Cancel order (authenticated)

## 💰 Pricing Structure

### Base Prices (by size and type):
- **Plain Kooko**: Small (₦200), Medium (₦300), Large (₦400)
- **With Milk**: Small (₦250), Medium (₦350), Large (₦450)
- **With Sugar**: Small (₦250), Medium (₦350), Large (₦450)
- **Special**: Small (₦300), Medium (₦400), Large (₦500)

### Extras:
- Groundnut: +₦50
- Milk: +₦50
- Sugar: +₦30
- Dates: +₦100

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with authentication middleware
- Role-based access control (Customer/Vendor)
- CORS configuration for secure API access

## 🌐 Real-time Updates

The app uses Socket.io for real-time communication:
- New orders instantly appear on vendor dashboard
- Order status updates reflect immediately for customers
- Queue position updates in real-time
- Automatic reconnection handling

## 🧪 Testing

### Backend Testing:
```bash
cd backend
npm test
```

### Mobile Testing:
```bash
cd mobile
npm test
```

## 📝 Future Enhancements

- [ ] Payment integration (Paystack, Flutterwave)
- [ ] Push notifications (Expo Notifications)
- [ ] Order rating and reviews
- [ ] Multiple vendor support
- [ ] Location-based vendor discovery
- [ ] Loyalty points system
- [ ] Order scheduling for future pickup
- [ ] Analytics dashboard for vendors
- [ ] SMS notifications
- [ ] Photo upload for menu items

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Initial development for Hausa Kooko vendors and their customers

## 🙏 Acknowledgments

- React Native community
- Express.js documentation
- MongoDB documentation
- All contributors and testers

## 📧 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for Kooko lovers everywhere**

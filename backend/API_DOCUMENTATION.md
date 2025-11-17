# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "08012345678",
  "role": "customer"  // or "vendor"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "role": "customer"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "role": "customer"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "08012345678",
    "role": "customer",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "porridgeType": "with-milk",
  "size": "medium",
  "quantity": 2,
  "extras": ["groundnut", "dates"],
  "specialInstructions": "Extra hot please"
}
```

**Response (201):**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "customer": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "customerPhone": "08012345678",
    "porridgeType": "with-milk",
    "size": "medium",
    "quantity": 2,
    "extras": ["groundnut", "dates"],
    "specialInstructions": "Extra hot please",
    "status": "pending",
    "queuePosition": 3,
    "totalPrice": 1000,
    "estimatedTime": 15,
    "createdAt": "2024-01-01T10:30:00.000Z"
  }
}
```

#### Get My Orders
```http
GET /api/orders/my-orders
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "customerName": "John Doe",
      "porridgeType": "with-milk",
      "size": "medium",
      "quantity": 2,
      "status": "pending",
      "queuePosition": 3,
      "totalPrice": 1000,
      "estimatedTime": 15,
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "customer": "507f1f77bcf86cd799439011",
    "customerName": "John Doe",
    "customerPhone": "08012345678",
    "porridgeType": "with-milk",
    "size": "medium",
    "quantity": 2,
    "extras": ["groundnut", "dates"],
    "specialInstructions": "Extra hot please",
    "status": "pending",
    "queuePosition": 3,
    "totalPrice": 1000,
    "estimatedTime": 15,
    "createdAt": "2024-01-01T10:30:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

#### Get All Orders (Vendor Only)
```http
GET /api/orders?status=pending
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, preparing, ready, completed, cancelled)

**Response (200):**
```json
{
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "customerName": "John Doe",
      "customerPhone": "08012345678",
      "porridgeType": "with-milk",
      "size": "medium",
      "quantity": 2,
      "status": "pending",
      "queuePosition": 3,
      "totalPrice": 1000,
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

#### Update Order Status (Vendor Only)
```http
PUT /api/orders/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Response (200):**
```json
{
  "message": "Order status updated",
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "preparing",
    "updatedAt": "2024-01-01T10:35:00.000Z"
  }
}
```

#### Get Queue Status (Public)
```http
GET /api/orders/queue-status
```

**Response (200):**
```json
{
  "queueLength": 5,
  "estimatedWaitTime": 25,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "queuePosition": 1,
      "status": "preparing"
    }
  ]
}
```

#### Cancel Order
```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "cancelled"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common error status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## WebSocket Events

### Client → Server Events

#### Join Queue
```javascript
socket.emit('joinQueue', userId);
```

### Server → Client Events

#### New Order
```javascript
socket.on('newOrder', (order) => {
  console.log('New order received:', order);
});
```

#### Order Updated
```javascript
socket.on('orderUpdated', (order) => {
  console.log('Order updated:', order);
});
```

#### Order Cancelled
```javascript
socket.on('orderCancelled', (order) => {
  console.log('Order cancelled:', order);
});
```

---

## Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: ['customer', 'vendor']),
  createdAt: Date
}
```

### Order Model
```javascript
{
  customer: ObjectId (ref: 'User'),
  customerName: String,
  customerPhone: String,
  porridgeType: String (enum: ['plain', 'with-milk', 'with-sugar', 'special']),
  quantity: Number,
  size: String (enum: ['small', 'medium', 'large']),
  extras: [String],
  specialInstructions: String,
  status: String (enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled']),
  queuePosition: Number,
  totalPrice: Number,
  estimatedTime: Number (in minutes),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. It's recommended to add rate limiting in production.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

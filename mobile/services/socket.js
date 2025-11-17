import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinQueue(userId) {
    if (this.socket) {
      this.socket.emit('joinQueue', userId);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('newOrder', callback);
    }
  }

  onOrderUpdated(callback) {
    if (this.socket) {
      this.socket.on('orderUpdated', callback);
    }
  }

  onOrderCancelled(callback) {
    if (this.socket) {
      this.socket.on('orderCancelled', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();

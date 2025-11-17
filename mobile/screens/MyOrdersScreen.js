import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, Chip, Button } from 'react-native-paper';
import { orderService } from '../services/api';
import socketService from '../services/socket';

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();

    socketService.onOrderUpdated(handleOrderUpdate);

    return () => {
      socketService.removeAllListeners('orderUpdated');
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      preparing: '#2196F3',
      ready: '#4CAF50',
      completed: '#757575',
      cancelled: '#F44336',
    };
    return colors[status] || '#757575';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          Place Your First Order
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <Title style={styles.title}>My Orders</Title>
        {orders.map((order) => (
          <Card key={order._id} style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderHeader}>
                <Text style={styles.orderType}>{order.porridgeType.replace('-', ' ')}</Text>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}
                  textStyle={styles.statusText}
                >
                  {order.status.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.orderDetails}>
                <Text>Size: {order.size}</Text>
                <Text>Quantity: {order.quantity}</Text>
                {order.extras.length > 0 && (
                  <Text>Extras: {order.extras.join(', ')}</Text>
                )}
              </View>

              {order.status === 'pending' || order.status === 'preparing' ? (
                <View style={styles.queueInfo}>
                  <Text style={styles.queueText}>
                    Queue Position: #{order.queuePosition}
                  </Text>
                  <Text style={styles.queueText}>
                    Estimated Time: {order.estimatedTime} min
                  </Text>
                </View>
              ) : null}

              <View style={styles.orderFooter}>
                <Text style={styles.price}>₦{order.totalPrice}</Text>
                <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
              </View>

              {order.specialInstructions && (
                <Text style={styles.instructions}>
                  Note: {order.specialInstructions}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#8B4513',
  },
  orderCard: {
    marginBottom: 15,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderType: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    marginBottom: 10,
  },
  queueInfo: {
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  queueText: {
    fontSize: 14,
    marginVertical: 2,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  instructions: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8B4513',
  },
});

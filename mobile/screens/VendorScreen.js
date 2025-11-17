import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Card, Title, Text, Button, Chip, Divider, Menu } from 'react-native-paper';
import { orderService } from '../services/api';
import socketService from '../services/socket';

export default function VendorScreen() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    fetchOrders();

    socketService.onNewOrder(handleNewOrder);
    socketService.onOrderUpdated(handleOrderUpdate);

    return () => {
      socketService.removeAllListeners();
    };
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const status = filter === 'all' ? undefined : filter;
      const data = await orderService.getAllOrders(status);
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleNewOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      closeMenu(orderId);
      Alert.alert('Success', 'Order status updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const openMenu = (orderId) => {
    setMenuVisible(prev => ({ ...prev, [orderId]: true }));
  };

  const closeMenu = (orderId) => {
    setMenuVisible(prev => ({ ...prev, [orderId]: false }));
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

  const getStats = () => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const preparing = orders.filter(o => o.status === 'preparing').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    return { pending, preparing, ready };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Vendor Dashboard</Title>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.preparing}</Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.ready}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={filter === 'pending'}
          onPress={() => setFilter('pending')}
          style={styles.filterChip}
        >
          Pending
        </Chip>
        <Chip
          selected={filter === 'preparing'}
          onPress={() => setFilter('preparing')}
          style={styles.filterChip}
        >
          Preparing
        </Chip>
        <Chip
          selected={filter === 'ready'}
          onPress={() => setFilter('ready')}
          style={styles.filterChip}
        >
          Ready
        </Chip>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          orders.map((order) => (
            <Card key={order._id} style={styles.orderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderType}>
                      {order.porridgeType.replace('-', ' ')} - {order.size}
                    </Text>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                  </View>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}
                    textStyle={styles.statusText}
                  >
                    {order.status.toUpperCase()}
                  </Chip>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.orderDetails}>
                  <Text>Phone: {order.customerPhone}</Text>
                  <Text>Quantity: {order.quantity}</Text>
                  {order.extras.length > 0 && (
                    <Text>Extras: {order.extras.join(', ')}</Text>
                  )}
                  {order.specialInstructions && (
                    <Text style={styles.instructions}>
                      Note: {order.specialInstructions}
                    </Text>
                  )}
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.price}>₦{order.totalPrice}</Text>
                  <Text style={styles.queuePosition}>#{order.queuePosition}</Text>
                </View>

                <Text style={styles.date}>{formatDate(order.createdAt)}</Text>

                <Menu
                  visible={menuVisible[order._id]}
                  onDismiss={() => closeMenu(order._id)}
                  anchor={
                    <Button
                      mode="contained"
                      onPress={() => openMenu(order._id)}
                      style={styles.actionButton}
                    >
                      Update Status
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => updateOrderStatus(order._id, 'pending')}
                    title="Pending"
                  />
                  <Menu.Item
                    onPress={() => updateOrderStatus(order._id, 'preparing')}
                    title="Preparing"
                  />
                  <Menu.Item
                    onPress={() => updateOrderStatus(order._id, 'ready')}
                    title="Ready"
                  />
                  <Menu.Item
                    onPress={() => updateOrderStatus(order._id, 'completed')}
                    title="Completed"
                  />
                  <Menu.Item
                    onPress={() => updateOrderStatus(order._id, 'cancelled')}
                    title="Cancel"
                  />
                </Menu>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  filterChip: {
    marginRight: 5,
  },
  scrollView: {
    flex: 1,
  },
  orderCard: {
    margin: 10,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderType: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  orderDetails: {
    marginBottom: 10,
  },
  instructions: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  queuePosition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  actionButton: {
    marginTop: 10,
    backgroundColor: '#8B4513',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

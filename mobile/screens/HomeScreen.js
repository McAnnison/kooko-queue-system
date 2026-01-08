import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, Chip, Divider } from 'react-native-paper';
import { orderService } from '../services/api';
import socketService from '../services/socket';

export default function HomeScreen({ navigation }) {
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQueueStatus();
    
    socketService.connect();
    socketService.onNewOrder(handleNewOrder);
    socketService.onOrderUpdated(handleOrderUpdate);

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const fetchQueueStatus = async () => {
    setLoading(true);
    try {
      const data = await orderService.getQueueStatus();
      setQueueStatus(data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    fetchQueueStatus();
  };

  const handleOrderUpdate = () => {
    fetchQueueStatus();
  };

  const menuItems = [
    { 
      type: 'plain', 
      name: 'Plain Kooko', 
      description: 'Classic millet porridge',
      price: '₦200-400'
    },
    { 
      type: 'with-milk', 
      name: 'Kooko with Milk', 
      description: 'Creamy porridge with fresh milk',
      price: '₦250-450'
    },
    { 
      type: 'with-sugar', 
      name: 'Kooko with Sugar', 
      description: 'Sweet and delicious',
      price: '₦250-450'
    },
    { 
      type: 'special', 
      name: 'Special Kooko', 
      description: 'Our signature blend',
      price: '₦300-500'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Welcome to Kooko Queue</Title>
        <Text style={styles.subtitle}>Order your favorite porridge</Text>
      </View>

      <Card style={styles.queueCard}>
        <Card.Content>
          <Title>Current Queue Status</Title>
          {queueStatus && (
            <>
              <View style={styles.queueInfo}>
                <Text style={styles.queueText}>
                  Orders in Queue: {queueStatus.queueLength}
                </Text>
                <Text style={styles.queueText}>
                  Est. Wait Time: {queueStatus.estimatedWaitTime} min
                </Text>
              </View>
              <Button 
                mode="outlined" 
                onPress={fetchQueueStatus}
                loading={loading}
                style={styles.refreshButton}
              >
                Refresh Status
              </Button>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.menuSection}>
        <Title style={styles.sectionTitle}>Our Menu</Title>
        {menuItems.map((item, index) => (
          <Card key={index} style={styles.menuCard}>
            <Card.Content>
              <View style={styles.menuHeader}>
                <Title style={styles.menuTitle}>{item.name}</Title>
                <Chip style={styles.priceChip}>{item.price}</Chip>
              </View>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Button
        mode="contained"
        icon="cart-plus"
        onPress={() => navigation.navigate('PlaceOrder')}
        style={styles.orderButton}
        contentStyle={styles.orderButtonContent}
      >
        Place New Order
      </Button>

      <View style={styles.extraSection}>
        <Title style={styles.sectionTitle}>Available Extras</Title>
        <View style={styles.extraChips}>
          <Chip icon="peanut" style={styles.chip}>Groundnut (+₦50)</Chip>
          <Chip icon="cup" style={styles.chip}>Milk (+₦50)</Chip>
          <Chip icon="grain" style={styles.chip}>Sugar (+₦30)</Chip>
          <Chip icon="food" style={styles.chip}>Dates (+₦100)</Chip>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#8B4513',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  queueCard: {
    margin: 15,
    elevation: 4,
  },
  queueInfo: {
    marginVertical: 15,
  },
  queueText: {
    fontSize: 16,
    marginVertical: 5,
  },
  refreshButton: {
    marginTop: 10,
  },
  menuSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: '#8B4513',
  },
  menuCard: {
    marginBottom: 15,
    elevation: 2,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 18,
  },
  priceChip: {
    backgroundColor: '#8B4513',
  },
  menuDescription: {
    color: '#666',
  },
  orderButton: {
    margin: 15,
    backgroundColor: '#8B4513',
  },
  orderButtonContent: {
    paddingVertical: 8,
  },
  extraSection: {
    padding: 15,
    marginBottom: 20,
  },
  extraChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
});

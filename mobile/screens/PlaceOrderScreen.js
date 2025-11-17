import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, RadioButton, Chip } from 'react-native-paper';
import { orderService } from '../services/api';

export default function PlaceOrderScreen({ navigation }) {
  const [porridgeType, setPorridgeType] = useState('plain');
  const [size, setSize] = useState('medium');
  const [quantity, setQuantity] = useState('1');
  const [extras, setExtras] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleExtra = (extra) => {
    setExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  const calculateTotal = () => {
    const basePrices = {
      'plain': { small: 200, medium: 300, large: 400 },
      'with-milk': { small: 250, medium: 350, large: 450 },
      'with-sugar': { small: 250, medium: 350, large: 450 },
      'special': { small: 300, medium: 400, large: 500 }
    };

    const extraPrices = {
      'groundnut': 50,
      'milk': 50,
      'sugar': 30,
      'dates': 100
    };

    let total = basePrices[porridgeType][size] * parseInt(quantity || 1);
    
    extras.forEach(extra => {
      total += (extraPrices[extra] || 0) * parseInt(quantity || 1);
    });

    return total;
  };

  const handlePlaceOrder = async () => {
    if (!quantity || parseInt(quantity) < 1) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        porridgeType,
        size,
        quantity: parseInt(quantity),
        extras,
        specialInstructions
      };

      const response = await orderService.createOrder(orderData);
      Alert.alert(
        'Order Placed!',
        `Your order has been placed successfully. Queue position: ${response.order.queuePosition}`,
        [{ text: 'OK', onPress: () => navigation.navigate('MyOrders') }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Place Your Order</Title>

        <View style={styles.section}>
          <Text style={styles.label}>Porridge Type:</Text>
          <RadioButton.Group onValueChange={setPorridgeType} value={porridgeType}>
            <View style={styles.radioItem}>
              <RadioButton value="plain" />
              <Text>Plain Kooko</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="with-milk" />
              <Text>With Milk</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="with-sugar" />
              <Text>With Sugar</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="special" />
              <Text>Special</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Size:</Text>
          <RadioButton.Group onValueChange={setSize} value={size}>
            <View style={styles.radioRow}>
              <View style={styles.radioItem}>
                <RadioButton value="small" />
                <Text>Small</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="medium" />
                <Text>Medium</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="large" />
                <Text>Large</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Quantity:</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Extras:</Text>
          <View style={styles.chipsContainer}>
            <Chip
              selected={extras.includes('groundnut')}
              onPress={() => toggleExtra('groundnut')}
              style={styles.chip}
            >
              Groundnut (+₦50)
            </Chip>
            <Chip
              selected={extras.includes('milk')}
              onPress={() => toggleExtra('milk')}
              style={styles.chip}
            >
              Milk (+₦50)
            </Chip>
            <Chip
              selected={extras.includes('sugar')}
              onPress={() => toggleExtra('sugar')}
              style={styles.chip}
            >
              Sugar (+₦30)
            </Chip>
            <Chip
              selected={extras.includes('dates')}
              onPress={() => toggleExtra('dates')}
              style={styles.chip}
            >
              Dates (+₦100)
            </Chip>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Special Instructions:</Text>
          <TextInput
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Any special requests..."
            style={styles.input}
          />
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalPrice}>₦{calculateTotal()}</Text>
        </View>

        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Place Order
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B4513',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    backgroundColor: 'white',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: '#8B4513',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

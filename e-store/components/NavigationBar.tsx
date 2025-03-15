import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, Modal, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, Image 
} from 'react-native';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

type NavigationBarProps = {
  setCurrentPage: (page: string) => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage:', error);
      }
    };

    fetchEmail();
  }, []);

  const fetchCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error fetching cart items from AsyncStorage:', error);
    }
  };

  const handleCartPress = useCallback(() => {
    fetchCartItems();
    setEmailModalVisible(true);
  }, []);

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const buyOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Your cart is empty.');
      return;
    }
    Alert.alert('Order placed successfully!');
    clearCart();
  };

  const groupItems = () => {
    const groupedItems: any = {};
    let totalPrice = 0;

    cartItems.forEach((item: any) => {
      const itemName = item.name;
      const itemPrice = parseFloat(item.price?.$numberDecimal || item.price);
      
      if (!isNaN(itemPrice)) {
        if (groupedItems[itemName]) {
          groupedItems[itemName].quantity += 1;
          groupedItems[itemName].totalPrice += itemPrice;
        } else {
          groupedItems[itemName] = {
            quantity: 1,
            price: itemPrice,
            totalPrice: itemPrice,
          };
        }
      }
    });

    Object.values(groupedItems).forEach((group: any) => {
      totalPrice += group.totalPrice;
    });

    return { groupedItems, totalPrice };
  };

  const { groupedItems, totalPrice } = groupItems();

  return (
    <View style={styles.container}>
      <Image source={require('../app/assets/icon.png')} style={styles.icon} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#5E4B3C' }]} onPress={() => setCurrentPage('store')}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#5E4B3C' }]} onPress={() => setCurrentPage('catalog')}>
          <Text style={styles.buttonText}>Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleCartPress}>
          <Text style={styles.buttonText}>Cart ({cartItems.length})</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isEmailModalVisible} animationType="slide" onRequestClose={() => setEmailModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Your Cart</Text>
          <ScrollView style={styles.scrollView}>
            {Object.keys(groupedItems).length === 0 ? (
              <Text>No items in your cart yet.</Text>
            ) : (
              Object.entries(groupedItems).map(([itemName, item]: any) => (
                <View key={itemName} style={styles.cartItem}>
                  <Text>{itemName} x {item.quantity}</Text>
                  <Text>€{item.totalPrice.toFixed(2)}</Text>
                </View>
              ))
            )}
          </ScrollView>
          <Text style={styles.totalPrice}>Total: €{totalPrice.toFixed(2)}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#5E4B3C' }]} onPress={() => setEmailModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={clearCart}>
            <Text style={styles.buttonText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'blue' }]} onPress={buyOrder}>
            <Text style={styles.buttonText}>Buy Order</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    backgroundColor: '#F9E3C2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: '#B39272',
    borderWidth: 2,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  icon: {
    width: 140,
    height: 50,
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: screenHeight * 0.5,
    width: '100%',
  },
});

export default NavigationBar;

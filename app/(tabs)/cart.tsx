import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('https://66752c35a8d2b4d072eef61d.mockapi.io/cart');
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartItems();
  }, []);

  const totalAmount = cartItems.reduce((total, item) => {
    if (item.selected) {
      const price = parseFloat(item.price.replace(/\./g, '').replace(',', '.'));
      return total + (price * item.quantity);
    }
    return total;
  }, 0);

  const updateQuantity = (id, change) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) }; // Ensure quantity does not go below 1
        }
        return item;
      });
    });
  };

  const toggleSelect = (id) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected }; // Toggle the selected state
        }
        return item;
      });
    });
  };

  const removeItem = async (id) => {
    await fetch(`https://66752c35a8d2b4d072eef61d.mockapi.io/cart/${id}`, {
      method: 'DELETE',
    });
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán.');
      return;
    }

    // Handle checkout process
    const newCartItems = cartItems.filter(item => !item.selected);
    setCartItems(newCartItems);
    await AsyncStorage.setItem('cartItems', JSON.stringify(newCartItems));

    Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua hàng!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={() => toggleSelect(item.id)}>
        <Text style={item.selected ? styles.checkboxSelected : styles.checkbox}>
          {item.selected ? '✓' : '☐'}
        </Text>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemTitle}>{item.title || item.nameProduct}</Text>
        <Text style={styles.cartItemPrice}>
          {(parseFloat(item.price.replace(/\./g, '').replace(',', '.')) * item.quantity).toLocaleString()} VND
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('home')}>
        <Text style={{ fontSize: 24, color: '#000' }}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Giỏ hàng</Text>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cartList}
      />
      
      <View style={styles.paymentOptions}>
        <View style={styles.paymentOption}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setPaymentMethod(paymentMethod === 'online' ? null : 'online')}
          >
            <Text style={paymentMethod === 'online' ? styles.checkboxSelected : styles.checkbox}>
              {paymentMethod === 'online' ? '✓' : '☐'}
            </Text>
            <Text style={styles.paymentText}>Thanh toán online</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paymentOption}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setPaymentMethod(paymentMethod === 'cod' ? null : 'cod')}
          >
            <Text style={paymentMethod === 'cod' ? styles.checkboxSelected : styles.checkbox}>
              {paymentMethod === 'cod' ? '✓' : '☐'}
            </Text>
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng giá: {totalAmount.toLocaleString()} VND</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={handleCheckout}
      >
        <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    justifyContent: 'space-between',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
  },
  totalContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  paymentOptions: {
    marginVertical: 20,
    marginBottom: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 24,
    marginRight: 10,
  },
  checkboxSelected: {
    fontSize: 24,
    marginRight: 10,
    color: '#000',
  },
  paymentText: {
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Cart;

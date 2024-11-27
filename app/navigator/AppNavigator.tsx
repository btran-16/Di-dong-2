import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../(tabs)/home'; // Trang chính
import ProductDetail from '../(tabs)/ProductDetail'; // Trang chi tiết sản phẩm
import Cart from '../(tabs)/cart'; // Trang giỏ hàng


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Cart" component={Cart} />
        </Stack.Navigator>
    );
};

export default AppNavigator;

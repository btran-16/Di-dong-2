import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ProductDetail: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params || {};

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const response = await fetch(`https://66752c35a8d2b4d072eef61d.mockapi.io/product/${productId}`);
                const data = await response.json();
                setProduct(data);

                // Fetch related products based on category
                const relatedResponse = await fetch('https://66752c35a8d2b4d072eef61d.mockapi.io/product');
                const allProducts = await relatedResponse.json();
                const related = allProducts.filter(item => item.category === data.category && item.id !== productId);
                setRelatedProducts(related.slice(0, 3));
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = async () => {
        if (product) {
            const cartItem = {
                id: product.id,
                title: product.nameProduct,
                price: product.price,
                image: product.image,
                quantity: 1,
                selected: true,
            };

            await fetch('https://66752c35a8d2b4d072eef61d.mockapi.io/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem),
            });

            alert(`${product.nameProduct} đã được thêm vào giỏ hàng!`);
        }
    };

    if (!product) {
        return <Text>Loading...</Text>;
    }

    const renderRelatedProduct = ({ item }) => (
        <TouchableOpacity 
            style={styles.relatedProductItem} 
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
            <Text style={styles.relatedProductTitle}>{item.nameProduct}</Text>
            <Text style={styles.relatedProductPrice}>{item.price} VND</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.navigate('home')}>
                    <Text style={{ fontSize: 24, color: '#000' }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}></Text>
                <TouchableOpacity onPress={() => navigation.navigate('cart')}>
                    <MaterialIcon name="shopping-cart" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{product.nameProduct}</Text>
                <Text style={styles.price}>{product.price} VND</Text>
                <Text style={styles.stock}>Hàng tồn: {product.stock}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <Text style={styles.relatedProductsTitle}>Sản phẩm liên quan</Text>
            <FlatList
                data={relatedProducts}
                renderItem={renderRelatedProduct}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
        position: 'absolute',
        top: 0,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        marginTop: 50, // Adjust for navbar height
    },
    detailsContainer: {
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 18,
        color: 'gray',
        marginVertical: 5,
    },
    stock: {
        fontSize: 16,
        color: '#555',
    },
    addToCartButton: {
        backgroundColor: '#d3d3d3',
        padding: 5,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#000',
        fontSize: 18,
    },
    relatedProductsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    relatedProductItem: {
        marginRight: 10,
        alignItems: 'center',
    },
    relatedProductImage: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    relatedProductTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    relatedProductPrice: {
        fontSize: 12,
        color: '#888',
    },
});

export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, Image, FlatList, Keyboard } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const categories = [
    { id: '1', title: 'iPhone' },
    { id: '2', title: 'iPad' },
    { id: '3', title: "Watch" },
];

const App = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productsData, setProductsData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://66752c35a8d2b4d072eef61d.mockapi.io/product');
                const data = await response.json();
                setProductsData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    const handleCategorySelect = (categoryTitle) => {
        setSelectedCategory(categoryTitle);
        setSearchQuery('');
        const products = productsData.filter(product => product.category === categoryTitle);
        setFilteredProducts(products);
    };

    const handleSearch = () => {
        const products = selectedCategory 
            ? productsData.filter(product => product.category === selectedCategory && product.title.toLowerCase().includes(searchQuery.toLowerCase()))
            : productsData.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));

        setFilteredProducts(products);
        Keyboard.dismiss(); // Close keyboard
    };

    const renderProductList = () => {
        const productsToDisplay = filteredProducts.length > 0 
            ? filteredProducts 
            : (selectedCategory ? productsData.filter(product => product.category === selectedCategory) : productsData);

        if (productsToDisplay.length === 0) {
            return <Text style={styles.noProductsText}>No products found</Text>;
        }

        return (
            <FlatList
                data={productsToDisplay}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.productItem} 
                        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                    >
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{item.nameProduct}</Text>
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productPrice}>{item.price} VND</Text>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>
                <Image source={require('./../../assets/images/logo.png')} style={styles.logo} />
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <MaterialIcon name="search" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('cart')}>
                    <MaterialIcon name="shopping-cart" size={20} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.categoryContainer}>
                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.categoryItem}
                            onPress={() => handleCategorySelect(item.title)}
                        >
                            <Text style={styles.categoryText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <Image source={require("./../../assets/images/slider.jpg")} style={styles.image} />

            <View>
                <Text style={styles.textList}>Mua hàng</Text>
            </View>
            <View style={styles.productContainer}>
                {renderProductList()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginTop: StatusBar.currentHeight || 0,
        paddingHorizontal: 16,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        padding: 5,
        elevation: 2,
    },
    logo: {
        width: 30,
        height: 30,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    searchButton: {
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryContainer: {
        marginVertical: 10,
    },
    categoryItem: {
        padding: 10,
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    image: {
        width: '70%',
        height: 200,
        marginVertical: 10,
    },
    textList: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 12,
    },
    productContainer: {
        flex: 1,
        width: '80%',
    },
    productItem: {
        flex: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 2,
        padding: 10,
        width: '50%',
    },
    productImage: {
        width: '100%',
        height: 125,
        marginBottom: 5,
        borderRadius: 10,
    },
    productDetails: {
        alignItems: 'flex-start',
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
    },
    noProductsText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 20,
        color: '#888',
    },
});

export default App;

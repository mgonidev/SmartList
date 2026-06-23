import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';
import { COLORS } from '../constants/colors';
import useProductsStore from '../store/useProductsStore';

function HomeScreen({ navigation }) {
    const { products, setProducts, removeProduct } = useProductsStore();

    const loadProducts = async () => {
        try {
            const savedProducts = await AsyncStorage.getItem('smartlist_products');

            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error al cargar productos', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const updatedProducts = products.filter((product) => product.id !== id);

            await AsyncStorage.setItem(
                'smartlist_products',
                JSON.stringify(updatedProducts)
            );

            removeProduct(id);
        } catch (error) {
            console.error('Error al eliminar producto', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadProducts();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🛒</Text>
            <Text style={styles.title}>Lista de Compras</Text>

            {products.length === 0 ? (
                <Text style={styles.emptyText}>No hay productos cargados</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProductItem product={item} onDelete={handleDeleteProduct} />
                    )}
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.buttonText}>Agregar producto</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.textMuted,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    emoji: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10,
    },

});

export default HomeScreen;

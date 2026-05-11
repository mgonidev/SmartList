import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/colors';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


function AddProductScreen({ navigation }) {
    const [productName, setProductName] = useState('');
    const [error, setError] = useState('');

    const requestNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    };

    const handleAddProduct = async () => {
        if (!productName) {
            setError('Ingresa un producto');
            return;
        }

        const productToSave = productName;

        try {
            const savedProducts = await AsyncStorage.getItem('smartlist_products');
            const products = savedProducts ? JSON.parse(savedProducts) : [];

            const newProduct = {
                id: Date.now().toString(),
                name: productToSave,
            };
            const hasPermission = await requestNotificationPermission();

            const updatedProducts = [...products, newProduct];

            await AsyncStorage.setItem(
                'smartlist_products',
                JSON.stringify(updatedProducts)
            );

            setError('');
            setProductName('');

            if (hasPermission) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Recordatorio de compra',
                        body: `Recordá comprar: ${productToSave}`,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: 5,
                    },
                });
            }
            navigation.goBack();
        } catch (error) {
            setError('Error al guardar el producto');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.emoji}>➕</Text>
            <Text style={styles.title}>Agregar Producto</Text>
            <TextInput
                placeholder="Nombre del producto"
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                <Text style={styles.buttonText}>Agregar Producto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Volver a Home</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: COLORS.surface,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    error: {
        color: COLORS.error,
        marginBottom: 10,
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: COLORS.secondary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    emoji: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default AddProductScreen;

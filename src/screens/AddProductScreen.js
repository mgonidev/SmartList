import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import useProductsStore from '../store/useProductsStore';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


function AddProductScreen({ navigation }) {
    const { products, addProduct } = useProductsStore();

    const [availableContacts, setAvailableContacts] = useState([]);
    const [contactSearch, setContactSearch] = useState('');
    const [showContactsList, setShowContactsList] = useState(false);
    const [calendarEventId, setCalendarEventId] = useState(null);
    const [contact, setContact] = useState(null);
    const [location, setLocation] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [productName, setProductName] = useState('');
    const [error, setError] = useState('');

    const requestNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            setError('Permiso de galería denegado');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setError('');
        }
    };

    const handleTakePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            setError('Permiso de cámara denegado');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setError('');
        }
    };

    const handleSelectImageSource = () => {
        Alert.alert(
            'Agregar foto',
            'Seleccioná una opción',
            [
                { text: 'Cámara', onPress: handleTakePhoto },
                { text: 'Galería', onPress: handlePickImage },
                { text: 'Cancelar', style: 'cancel' },
            ]
        );
    };

    const handleGetLocation = async () => {
        const permissionResult = await Location.requestForegroundPermissionsAsync();

        if (!permissionResult.granted) {
            setError('Permiso de ubicación denegado');
            return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});

        setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
        });

        setError('');
    };

    const handlePickContact = async () => {
        const permissionResult = await Contacts.requestPermissionsAsync();

        if (!permissionResult.granted) {
            setError('Permiso de contactos denegado');
            return;
        }

        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length === 0) {
            setError('No se encontraron contactos');
            return;
        }

        const validContacts = data.filter((item) => item.name);

        if (validContacts.length === 0) {
            setError('No se encontró un contacto válido');
            return;
        }

        setAvailableContacts(validContacts);
        setContactSearch('');
        setShowContactsList(true);
        setError('');
    };

    const handleSelectContact = (selectedContact) => {
        setContact({
            id: selectedContact.id,
            name: selectedContact.name,
            phoneNumber: selectedContact.phoneNumbers?.[0]?.number || null,
        });
        setContactSearch('');
        setShowContactsList(false);
        setError('');
    };

    const handleCreateCalendarEvent = async () => {
        if (!productName) {
            setError('Primero ingresa el nombre del producto');
            return;
        }

        const permissionResult = await Calendar.requestCalendarPermissionsAsync();

        if (!permissionResult.granted) {
            setError('Permiso de calendario denegado');
            return;
        }

        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

        if (calendars.length === 0) {
            setError('No se encontró un calendario disponible');
            return;
        }

        const defaultCalendar = calendars.find((calendar) => calendar.allowsModifications);

        if (!defaultCalendar) {
            setError('No se encontró un calendario editable');
            return;
        }

        const now = new Date();
        const endDate = new Date(now.getTime() + 60 * 60 * 1000);

        const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
            title: `Comprar: ${productName}`,
            startDate: now,
            endDate: endDate,
            notes: 'Recordatorio creado desde SmartList',
        });

        setCalendarEventId(eventId);
        setError('');
    };

    const handleAddProduct = async () => {
        if (!productName) {
            setError('Ingresa un producto');
            return;
        }

        const productToSave = productName;

        try {
            const newProduct = {
                id: Date.now().toString(),
                name: productToSave,
                imageUri: imageUri,
                location: location,
                contact: contact,
                calendarEventId: calendarEventId,
            };

            const hasPermission = await requestNotificationPermission();

            const updatedProducts = [...products, newProduct];

            await AsyncStorage.setItem(
                'smartlist_products',
                JSON.stringify(updatedProducts)
            );

            addProduct(newProduct);

            setError('');
            setProductName('');
            setImageUri(null);
            setLocation(null);
            setContact(null);
            setAvailableContacts([]);
            setContactSearch('');
            setShowContactsList(false);
            setCalendarEventId(null);

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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.emoji}>➕</Text>
                <Text style={styles.title}>Agregar Producto</Text>
                <TextInput
                    placeholder="Nombre del producto"
                    placeholderTextColor={COLORS.textMuted}
                    value={productName}
                    onChangeText={setProductName}
                    style={styles.input}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.actionGrid}>
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, imageUri && styles.actionButtonActive]}
                            onPress={handleSelectImageSource}
                        >
                            <Text style={styles.buttonText}>
                                {imageUri ? 'Foto lista' : 'Agregar foto'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, location && styles.actionButtonActive]}
                            onPress={handleGetLocation}
                        >
                            <Text style={styles.buttonText}>
                                {location ? 'Ubicación lista' : 'Ubicación'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, contact && styles.actionButtonActive]}
                            onPress={handlePickContact}
                        >
                            <Text style={styles.buttonText}>
                                {contact ? 'Contacto listo' : 'Contacto'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, calendarEventId && styles.actionButtonActive]}
                            onPress={handleCreateCalendarEvent}
                        >
                            <Text style={styles.buttonText}>
                                {calendarEventId ? 'Recordatorio listo' : 'Calendario'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showContactsList ? (
                    <View style={styles.summaryCard}>
                        <Text style={styles.contactListTitle}>Seleccioná un contacto</Text>
                        <TextInput
                            placeholder="Buscar contacto por nombre"
                            placeholderTextColor={COLORS.textMuted}
                            value={contactSearch}
                            onChangeText={setContactSearch}
                            style={styles.contactSearchInput}
                        />
                        {contactSearch.trim().length > 0 ? (
                            availableContacts
                                .filter((item) =>
                                    item.name?.toLowerCase().includes(contactSearch.toLowerCase())
                                )
                                .slice(0, 6)
                                .map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.contactOption}
                                        onPress={() => handleSelectContact(item)}
                                    >
                                        <Text style={styles.contactOptionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))
                        ) : (
                            <Text style={styles.summaryItem}>Escribí un nombre para buscar contactos</Text>
                        )}
                    </View>
                ) : null}

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryItem}>
                        Imagen: {imageUri ? 'seleccionada' : 'pendiente'}
                    </Text>
                    <Text style={styles.summaryItem}>
                        Ubicación: {location
                            ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                            : 'pendiente'}
                    </Text>
                    <Text style={styles.summaryItem}>
                        Contacto: {contact ? contact.name : 'pendiente'}
                    </Text>
                    <Text style={styles.summaryItem}>
                        Calendario: {calendarEventId ? 'creado' : 'pendiente'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                    <Text style={styles.buttonText}>Agregar Producto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tertiaryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Volver a Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.background,
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    actionGrid: {
        marginTop: 14,
        gap: 10,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: 52,
    },
    actionButtonPlaceholder: {
        flex: 1,
    },
    actionButtonActive: {
        backgroundColor: COLORS.primary,
    },
    tertiaryButton: {
        backgroundColor: COLORS.surface,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emoji: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10,
    },
    link: {
        marginTop: 10,
        textAlign: 'center',
        color: COLORS.primary,
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
    },
    summaryItem: {
        color: COLORS.textMuted,
        marginBottom: 6,
    },
    contactListTitle: {
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contactOption: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    contactOptionText: {
        color: COLORS.text,
    },
    contactSearchInput: {
        backgroundColor: COLORS.background,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
});

export default AddProductScreen;

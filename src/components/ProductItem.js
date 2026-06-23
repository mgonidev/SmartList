import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/colors';

function ProductItem({ product, onDelete }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                {product.imageUri ? (
                    <Image source={{ uri: product.imageUri }} style={styles.productImage} />
                ) : null}
                <View style={styles.infoContent}>
                    <Text style={styles.productName}>{product.name}</Text>
                    {product.location ? (
                        <Text style={styles.metaText}>
                            Ubicación: {product.location.latitude.toFixed(4)}, {product.location.longitude.toFixed(4)}
                        </Text>
                    ) : (
                        <Text style={styles.metaText}>Ubicación: pendiente</Text>
                    )}
                    {product.contact ? (
                        <Text style={styles.metaText}>Contacto: {product.contact.name}</Text>
                    ) : (
                        <Text style={styles.metaText}>Contacto: pendiente</Text>
                    )}
                    <Text style={styles.metaText}>
                        Calendario: {product.calendarEventId ? 'creado' : 'pendiente'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(product.id)}
            >
                <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: COLORS.danger,
        borderColor: COLORS.border,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    deleteText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoContent: {
        flex: 1,
    },
    metaText: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
});

export default ProductItem;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

function ProductItem({ product, onDelete }) {
    return (
        <View style={styles.container}>
            <Text style={styles.productName}>{product.name}</Text>

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
    },
    deleteButton: {
        backgroundColor: 'grey',
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
});

export default ProductItem;

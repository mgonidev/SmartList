import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../constants/colors';

function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!username || !password) {
            setError('Completa todos los campos');
            return;
        }

        try {
            await AsyncStorage.setItem(
                'smartlist_user',
                JSON.stringify({ username, password })
            );

            setError('');
            setUsername('');
            setPassword('');
            navigation.goBack();
        } catch (error) {
            setError('Error al guardar el usuario');
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.emoji}>📝</Text>
            <Text style={styles.title}>Registro</Text>

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Volver a Login</Text>
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
        marginBottom: 20,
        textAlign: 'center',
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
    link: {
        marginTop: 16,
        textAlign: 'center',
        color: COLORS.primary,
    },
    error: {
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: 12,
    },
    emoji: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10,
    },
});


export default RegisterScreen;

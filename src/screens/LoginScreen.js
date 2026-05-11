import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import { COLORS } from '../constants/colors';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async () => {
        if (!username || !password) {
            setError('Completa todos los campos');
            return;
        }

        try {
            const savedUser = await AsyncStorage.getItem('smartlist_user');

            if (!savedUser) {
                setError('No hay un usuario registrado. Por favor, regístrate primero.');
                return;
            }

            const parsedUser = JSON.parse(savedUser);

            if (parsedUser.username === username && parsedUser.password === password) {
                setError('');
                navigation.replace('Home');
            }
            else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <Text style={styles.emoji}>🔐</Text>
                <Text style={styles.title}>Iniciar Sesión</Text>

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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Ir a Registro</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
        marginTop: 18,
        textAlign: 'center',
        color: COLORS.primary,
        fontWeight: '600',
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

export default LoginScreen;

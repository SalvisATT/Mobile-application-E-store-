import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }

        setLoading(true);
        setError(""); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });

            if (response.data.status === "Admin") {
                router.replace('/adminPage'); // Redirect to admin page if admin logs in
            } else if (response.data.status === "Success") {
                await AsyncStorage.setItem('userEmail', email);
                router.replace('/home'); // Redirect to home after login
            } else {
                setError(response.data.message); // Show backend error
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred, please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Log in</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.registerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.register}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8f4f8', // Light gradient background for a modern feel
        paddingHorizontal: width * 0.05,
    },
    form: {
        width: width * 0.9,
        maxWidth: 400,
        padding: height * 0.03,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
    },
    title: {
        fontSize: height * 0.035,
        fontWeight: 'bold',
        marginBottom: height * 0.02,
        color: '#333',
    },
    input: {
        width: '100%',
        height: height * 0.06,
        borderColor: '#ddd',
        borderWidth: 1.5,
        borderRadius: 10,
        marginBottom: height * 0.02,
        paddingHorizontal: 15,
        fontSize: height * 0.02,
        backgroundColor: '#f9f9f9',
    },
    error: {
        color: '#ff4d4d',
        marginBottom: height * 0.02,
        textAlign: 'center',
        fontSize: height * 0.02,
    },
    button: {
        width: '100%',
        paddingVertical: height * 0.015,
        backgroundColor: '#4CAF50', // Modern green button
        borderRadius: 10,
        marginBottom: height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: height * 0.02,
        color: 'white',
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: height * 0.02,
        textAlign: 'center',
        fontSize: height * 0.018,
        color: '#666',
    },
    register: {
        fontSize: height * 0.02,
        color: '#4CAF50', // Green color for the "Register" text
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
    // Explicitly typing the state variables
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const validateEmail = (email: string): boolean => {
        return email.includes('@');
    };

    const validatePassword = (password: string): boolean => {
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        return hasSymbol && hasNumber && hasUpperCase;
    };

    const handleSubmit = async (): Promise<void> => {
        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must contain at least one symbol, one number, and one uppercase letter.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/register", { name, email, password });

            if (response.data.status === "Success") {
                Alert.alert("Registration Successful", "You can now log in.");
                router.replace('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Register</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.loginLink}>Login</Text>
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
        backgroundColor: '#e8f4f8', // Light background for a modern feel
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
    loginText: {
        marginTop: height * 0.02,
        textAlign: 'center',
        fontSize: height * 0.018,
        color: '#666',
    },
    loginLink: {
        fontSize: height * 0.02,
        color: '#4CAF50', // Green for the login link
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

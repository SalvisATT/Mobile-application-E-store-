import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { router } from 'expo-router';

type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;
    size: string;
    material: string;
    type: string;
};

export default function AdminHome() {
    const navigation = useNavigation();
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Product>({
        _id: '',
        name: '',
        price: 0,
        image: '',
        size: '',
        material: '',
        type: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product>({ ...newProduct });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<{ data: Product[] }>('http://localhost:5000/products');
            setProducts(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch products');
        }
    };

    const handleInputChange = (field: keyof Product, value: string) => {
        setNewProduct({ ...newProduct, [field]: value });
    };

    const handleEditChange = (field: keyof Product, value: string) => {
        setEditingProduct({ ...editingProduct, [field]: value });
    };

    const addProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.size || !newProduct.material || !newProduct.type) {
            Alert.alert('Error', 'All fields are required');
            return;
        }
        try {
            const { _id, ...productWithoutId } = newProduct;
            const response = await axios.post<{ data: Product }>('http://localhost:5000/products', productWithoutId);
            setProducts([...products, response.data.data]);
            setNewProduct({ _id: '', name: '', price: 0, image: '', size: '', material: '', type: '' });
        } catch (error) {
            Alert.alert('Error', 'Failed to add product');
        }
    };

    const updateProduct = async (id: string) => {
        try {
            await axios.put(`http://localhost:5000/products/update/${id}`, editingProduct);
            setProducts(products.map(product => (product._id === id ? { ...product, ...editingProduct } : product)));
            setEditingId(null);
            setEditingProduct({ ...newProduct });
        } catch (error) {
            Alert.alert('Error', 'Failed to update product');
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/products/delete/${id}`);
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete product');
        }
    };
    
    const handleLogout = () => {
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Admin Panel</Text>
                <Button title="Logout" onPress={handleLogout} color="#dc3545" />
            </View>
            <View style={styles.inputContainer}>
                {Object.keys(newProduct).map((key) => (
                    key !== '_id' && (
                        <TextInput
                            key={key}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={(newProduct as any)[key]}
                            onChangeText={(text) => handleInputChange(key as keyof Product, text)}
                            style={styles.input}
                        />
                    )
                ))}
                <Button title="Add Product" onPress={addProduct} color="#28a745" />
            </View>
            
            <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.details}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productInfo}>${item.price.toFixed(2)}</Text>
                            <Text style={styles.productInfo}>{item.size} - {item.material} - {item.type}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setEditingId(item._id); setEditingProduct(item); }}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteProduct(item._id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    header: { fontSize: 24, fontWeight: 'bold' },
    inputContainer: { marginBottom: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 3 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 2 },
    image: { width: 60, height: 60, borderRadius: 5, marginRight: 10 },
    details: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold' },
    productInfo: { color: '#555' },
    editText: { color: '#007bff', marginHorizontal: 10 },
    deleteText: { color: '#dc3545' },
});

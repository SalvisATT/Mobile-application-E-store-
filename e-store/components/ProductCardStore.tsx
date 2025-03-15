import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

interface Product {
  _id: string;
  image?: string;
  name: string;
  price?: any;
  size?: string;
  type?: string;
  material?: string;
}

interface ProductCardStoreHomeProps {
  product: Product;
}

const ProductCardStoreHome = ({ product }: ProductCardStoreHomeProps) => {
  const formattedPrice = product.price
    ? parseFloat(product.price.$numberDecimal || product.price.toString()).toFixed(2)
    : "0.00";

  const { _id, image = "https://via.placeholder.com/150", name = "Unknown Product", size = "Not specified", type = "Unknown", material = "Unknown" } = product || {};

  const addToCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      const cart = storedCart ? JSON.parse(storedCart) : [];
      cart.push(product);
      await AsyncStorage.setItem("cart", JSON.stringify(cart));

      // Show toast notification
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: `${name} added to cart`,
        text2: 'You can continue shopping or view your cart.',
        visibilityTime: 2000,
        autoHide: true,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: image }} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>€{formattedPrice}</Text>
        <Text style={styles.productDetails}>Size: {size}</Text>
        <Text style={styles.productDetails}>Material: {material}</Text>
        <Button title="Add to Cart" onPress={addToCart} color="#5E4B3C" />
      </View>

      {/* Place this Toast container at the root of your app or in a component */}
      <Toast />
    </View>
  );
};

ProductCardStoreHome.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.any,
    size: PropTypes.string,
    type: PropTypes.string,
    material: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FAF3E0",
    borderWidth: 2,
    borderColor: "#B39272",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 16,
  },
  productImage: {
    height: 160,
    width: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDetails: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default ProductCardStoreHome;

import React, { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, useWindowDimensions, FlatList
} from "react-native";
import axios from 'axios';
import ProductCardStoreHome from "../../components/StoreHomePageCard";

type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  type: string;
  material: string;
};

function StorePage() {
  const { width } = useWindowDimensions();
  const [products, setProducts] = useState<Product[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerRow = 2;
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.headerContainer} showsHorizontalScrollIndicator={false}>
        <Image source={require("../../app/assets/photo1.jpg")} style={styles.headerImage} />
        <Image source={require("../../app/assets/photo2.jpg")} style={styles.headerImage} />
      </ScrollView>

      <Text style={styles.title}>Visas Preces:</Text>

      <FlatList
        data={products.slice(startIndex, startIndex + itemsPerPage)}
        keyExtractor={(item) => item._id}
        horizontal
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <View style={[styles.productCardContainer, { width: (width / itemsPerRow) - 24 }]}> 
            <ProductCardStoreHome product={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={startIndex === 0}
          style={[styles.paginationButton, startIndex === 0 && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Iepriekšējie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={startIndex + itemsPerPage >= products.length}
          style={[styles.paginationButton, startIndex + itemsPerPage >= products.length && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Nākamie</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    height: 150, // Reduced height for better mobile fitting
    width: "100%", // Takes full screen width
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center", // Centers images
  },
  headerImage: {
    width: 200, // Reduced width for smaller screens
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 5, // Reduced margin for better spacing
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F3A2A",
    textAlign: "center",
    marginBottom: 10,
  },
  productList: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  productCardContainer: {
    marginHorizontal: 12,
    borderRadius: 8,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 16,
  },
  paginationButton: {
    width: "45%",
    borderRadius: 8,
    backgroundColor: "#B39272",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#D3B8A3",
  },
});

export default StorePage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
} from "react-native";
import ProductCardStore from "../../components/ProductCardStore";

interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
  size: string;
  type: string;
  material: string;
}

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "krekls",
    "bikses",
    "džemperis",
    "kurpes",
    "T-krekls",
    "jaka",
    "cepures",
    "zeķes",
  ];

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const filteredProducts =
    selectedCategories.length > 0
      ? products.filter((product: Product) =>
          selectedCategories.includes(product.type.trim().toLowerCase())
        )
      : products;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarHeading}>Filtrēt pēc kategorijas</Text>
          <View style={styles.filterContainer}>
            {categories.map((category, index) => (
              <View key={category} style={styles.filterItem}>
                <Switch
                  value={selectedCategories.includes(category)}
                  onValueChange={() => handleToggleCategory(category)}
                  trackColor={{ false: "#ccc", true: "#7B5A44" }}
                  thumbColor={
                    selectedCategories.includes(category) ? "#EAD7BB" : "#fff"
                  }
                />
                <Text style={styles.filterLabel}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.mainHeading}>Piedāvātie produkti</Text>
          <View style={styles.productGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
                <View key={product._id} style={styles.productItem}>
                  <ProductCardStore product={product} />
                </View>
              ))
            ) : (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>Nav atrasti produkti 😞</Text>
                <Text style={styles.noProductsSubText}>
                  Pārbaudiet vēlāk, lai atrastu lieliskus piedāvājumus!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4E9D8",
    padding: 16,
  },
  sidebar: {
    backgroundColor: "#EAD7BB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#7B5A44",
    marginBottom: 16,
  },
  sidebarHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A3B2D",
    textAlign: "center",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  filterItem: {
    width: "30%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 9,
    color: "#4A3B2D",
    marginLeft: 6,
  },
  mainContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8C6D50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3B2D",
    textAlign: "center",
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
    marginBottom: 16,
  },
  noProductsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  noProductsText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4A3B2D",
  },
  noProductsSubText: {
    fontSize: 10,
    color: "#4A3B2D",
  },
});

export default CatalogPage;

import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import NavigationBar from "../../components/NavigationBar";
import StorePage from "./StorePage";
import CatalogPage from "./CatalogPage";
import StoreFooter from "../../components/StoreFooter";

function Store() {
    const [currentPage, setCurrentPage] = useState("store");

    return (
        <View style={styles.container}>
            <NavigationBar setCurrentPage={setCurrentPage} />
            {/* Conditionally render StorePage or CatalogPage */}
            {currentPage === "store" ? (
                <View style={styles.storeContainer}>
                    <StorePage />
                </View>
            ) : (
                <View style={styles.storeContainer}>
                    <CatalogPage />
                </View>
            )}
            <StoreFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: 'flex-start', // Align items at the top of the screen
        alignItems: 'center',         // Center horizontally
        backgroundColor: '#F9E3C2',  // Optional, to match your vintage skin tone style
        overflowY: 'scroll',
    },
    storeContainer: {
        width: "80%",
        height: "100%", // Ensure StorePage takes up 80% of the height
    },
});

export default Store;
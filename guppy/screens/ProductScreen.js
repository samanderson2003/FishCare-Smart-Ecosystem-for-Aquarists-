import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseconfig";

// Static product categories with correct screen names from App.js
const productCategories = [
  { id: "1", title: "Live Fish", image: require("../assets/images/fish.png"), screenName: "LiveFish" },
  { id: "2", title: "Fish Food", image: require("../assets/images/food.png"), screenName: "FishFood" },
  { id: "3", title: "Medicines", image: require("../assets/images/medicine.png"), screenName: "Medicines" },
  { id: "4", title: "Aquarium Plants", image: require("../assets/images/plant.png"), screenName: "AquariumPlants" },
  { id: "5", title: "Decorations", image: require("../assets/images/decorations.png"), screenName: "Decorations" },
  { id: "6", title: "Tank & Accessories", image: require("../assets/images/tanks.png"), screenName: "TankAccessories" },
  { id: "7", title: "Breeding Supplies", image: require("../assets/images/breeding.png"), screenName: "BreedingSupplies" },
  { id: "8", title: "Aquascaping Tools", image: require("../assets/images/tool.png"), screenName: "AquascapingTools" },
];

const ProductScreen = ({ navigation }) => {
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch product counts for each category
  useEffect(() => {
    const fetchProductCounts = async () => {
      let counts = {};
      try {
        for (let category of productCategories) {
          const q = query(collection(db, "products"), where("category", "==", category.title));
          const querySnapshot = await getDocs(q);
          counts[category.id] = querySnapshot.size;
        }
        setProductCounts(counts);
      } catch (error) {
        console.error("Error fetching product counts:", error);
      }
      setLoading(false);
    };

    fetchProductCounts();
  }, []);

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Product Categories</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#00c6ff" />
        ) : (
          <FlatList
            data={productCategories}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate(item.screenName)} // ✅ Correct navigation from App.js
              >
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.bottomOverlay}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.productCount}>
                    {productCounts[item.id] || 0} Products
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 20,
  },
  card: {
    width: "45%",
    height: 160,
    backgroundColor: "#1F2A38",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#00c6ff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#E0E0E0",
    textAlign: "center",
  },
  productCount: {
    fontSize: 12,
    color: "#B0BEC5",
    textAlign: "center",
    marginTop: 2,
  },
});

export default ProductScreen;

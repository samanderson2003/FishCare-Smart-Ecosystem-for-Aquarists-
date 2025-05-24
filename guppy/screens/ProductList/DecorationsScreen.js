import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseconfig";

const { width } = Dimensions.get("window");
const defaultImage = "https://via.placeholder.com/150";

const DecorationsScreen = ({ navigation }) => {
  const [decorations, setDecorations] = useState([]);
  const [cart, setCart] = useState([]);  // Local state for instant cart updates
  const [loading, setLoading] = useState(true);

  // Fetch Decorations in Real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Decorations"), (snapshot) => {
      const decorationList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown Decoration",
          description: data.description || "No description available",
          imageUrl: data.imageUrl?.startsWith("http") ? data.imageUrl : defaultImage,
          price: data.price ? parseFloat(data.price) : null,
          oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        };
      });
      setDecorations(decorationList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Cart Updates in Real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Cart"), (snapshot) => {
      const cartItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(cartItems);  // Update local state instantly
    });

    return () => unsubscribe();
  }, []);

  // Add Item to Cart & Update UI Instantly
  const addToCart = async (item) => {
    try {
      const newCartItem = {
        productId: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: 1,
        addedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "Cart"), newCartItem);

      // Update local cart state for instant UI update
      setCart((prevCart) => [...prevCart, newCartItem]);

      Alert.alert("Success", `${item.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Decorations</Text>
        <Text style={styles.subtitle}>Browse all available aquarium decorations.</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#00c6ff" />
        ) : (
          <>
            {/* Cart Button */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('CartScreen')}
            >
              <Ionicons name="cart" size={24} color="white" />
              {cart.length > 0 && (  // Show cart count
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Product List */}
            <FlatList
              data={decorations}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.discountPrice}>
                      {item.price !== null ? `₹${item.price.toFixed(2)}` : "Price N/A"}
                    </Text>
                    {item.oldPrice !== null && (
                      <Text style={styles.oldPrice}>₹{item.oldPrice.toFixed(2)}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, alignItems: "center", padding: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#00c6ff", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#E0E0E0", textAlign: "center", marginBottom: 20 },
  listContainer: { paddingBottom: 80, paddingHorizontal: 5 },
  productCard: {
    backgroundColor: "#1F2A38",
    borderRadius: 15,
    padding: 10,
    margin: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: width * 0.45,
    minHeight: 230,
    justifyContent: "space-between",
  },
  productImage: {
    width: "100%",
    height: 130,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  productName: { fontSize: 16, fontWeight: "bold", color: "#FFFFFF", textAlign: "center" },
  productDescription: { fontSize: 12, color: "#B0B0B0", textAlign: "center", marginBottom: 5 },
  priceContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 5 },
  discountPrice: { fontSize: 18, fontWeight: "bold", color: "#FFD700", marginRight: 5 },
  oldPrice: { fontSize: 14, color: "#B0B0B0", textDecorationLine: "line-through" },
  addButton: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#FF6F00", borderRadius: 20, padding: 5 },
  cartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6F00",
    borderRadius: 25,
    padding: 10,
    zIndex: 1,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
});

export default DecorationsScreen;
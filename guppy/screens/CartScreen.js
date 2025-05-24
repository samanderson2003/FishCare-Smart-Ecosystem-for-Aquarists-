import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseconfig";

const { width } = Dimensions.get("window");
const defaultImage = "https://via.placeholder.com/150";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate total price whenever cart items change
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const cartQuery = query(collection(db, "Cart"), orderBy("addedAt", "desc"));
      const querySnapshot = await getDocs(cartQuery);
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          productId: data.productId,
          name: data.name || "Unknown Product",
          description: data.description || "No description available",
          imageUrl: data.imageUrl?.startsWith("http")
            ? data.imageUrl
            : defaultImage,
          price: data.price ? parseFloat(data.price) : 0,
          quantity: data.quantity || 1,
        };
      });
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Alert.alert("Error", "Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Update quantity in Firestore
      const itemRef = doc(db, "Cart", id);
      await updateDoc(itemRef, { quantity: newQuantity });

      // Update local state
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (id, name) => {
    try {
      // Confirm before deletion
      Alert.alert(
        "Remove Item",
        `Are you sure you want to remove ${name} from your cart?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              // Delete from Firestore
              await deleteDoc(doc(db, "Cart", id));

              // Update local state
              setCartItems(cartItems.filter((item) => item.id !== id));
              Alert.alert("Success", `${name} removed from cart!`);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete all cart items from Firestore
              const deletePromises = cartItems.map((item) =>
                deleteDoc(doc(db, "Cart", item.id))
              );
              await Promise.all(deletePromises);

              // Update local state
              setCartItems([]);
              Alert.alert("Success", "Cart cleared successfully!");
            } catch (error) {
              console.error("Error clearing cart:", error);
              Alert.alert("Error", "Failed to clear cart. Please try again.");
            }
          },
        },
      ]
    );
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checkout.");
      return;
    }

    // Navigate to PaymentScreen with cart items and total price
    navigation.navigate("Payment", {
      cartItems,
      totalPrice,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color="#00c6ff" />
      <Text style={styles.emptyCartText}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtext}>
        Browse breeding supplies and add items to your cart
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
          <View style={styles.placeholderIcon} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#00c6ff" style={styles.loader} />
        ) : cartItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.cartItemCard}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.cartItemImage}
                  />
                  <View style={styles.cartItemDetails}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      ₹{item.price.toFixed(2)}
                    </Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id, item.name)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#FF6F00" />
                  </TouchableOpacity>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            <View style={styles.cartSummary}>
              <View style={styles.cartSummaryRow}>
                <Text style={styles.cartSummaryLabel}>Total Items</Text>
                <Text style={styles.cartSummaryValue}>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
              <View style={styles.cartSummaryRow}>
                <Text style={styles.cartSummaryLabel}>Total Amount</Text>
                <Text style={styles.cartSummaryValue}>
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={clearCart}
                >
                  <Text style={styles.buttonText}>Clear Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.checkoutButton]}
                  onPress={proceedToCheckout}
                >
                  <Text style={styles.buttonText}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
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
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  placeholderIcon: {
    width: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00c6ff",
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
    paddingBottom: 190, // Space for the summary section
  },
  cartItemCard: {
    backgroundColor: "#1F2A38",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: "cover",
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#243B55",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 15,
  },
  removeButton: {
    padding: 5,
  },
  cartSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1F2A38",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  cartSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cartSummaryLabel: {
    fontSize: 16,
    color: "#E0E0E0",
  },
  cartSummaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#243B55",
    borderWidth: 1,
    borderColor: "#00c6ff",
  },
  checkoutButton: {
    backgroundColor: "#FF6F00",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: "#00c6ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartScreen;
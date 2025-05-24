import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseconfig";

const PaymentScreen = ({ route, navigation }) => {
  const { cartItems, totalPrice, totalItems } = route.params;
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const validateAddress = () => {
    // Address validation
    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.addressLine1.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      Alert.alert("Incomplete Address", "Please fill all required address fields");
      return false;
    }

    if (address.phone.trim().length !== 10 || !/^\d+$/.test(address.phone)) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number");
      return false;
    }

    if (address.pincode.trim().length !== 6 || !/^\d+$/.test(address.pincode)) {
      Alert.alert("Invalid Pincode", "Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateAddress()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order in Firestore
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        totalItems: totalItems,
        paymentMethod: "cod", // Only Cash on Delivery
        shippingAddress: address,
        status: "Pending",
        orderId: `ORD${Date.now()}`,
        paymentId: `PAY${Math.floor(Math.random() * 1000000)}`,
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "Orders"), orderData);

      // Navigate to receipt screen
      navigation.navigate("Receipt", {
        order: {
          ...orderData,
          id: orderRef.id,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Order processing error:", error);
      Alert.alert(
        "Order Failed",
        "There was an error processing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.title}>Payment</Text>
          <View style={styles.placeholderIcon} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Items</Text>
              <Text style={styles.orderValue}>{totalItems}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Amount</Text>
              <Text style={styles.orderValue}>₹{totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#7A8194"
                value={address.name}
                onChangeText={(text) => setAddress({ ...address, name: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#7A8194"
                keyboardType="phone-pad"
                maxLength={10}
                value={address.phone}
                onChangeText={(text) => setAddress({ ...address, phone: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address Line 1 *</Text>
              <TextInput
                style={styles.input}
                placeholder="House/Flat number, Building name"
                placeholderTextColor="#7A8194"
                value={address.addressLine1}
                onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address Line 2</Text>
              <TextInput
                style={styles.input}
                placeholder="Street, Area (optional)"
                placeholderTextColor="#7A8194"
                value={address.addressLine2}
                onChangeText={(text) => setAddress({ ...address, addressLine2: text })}
              />
            </View>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#7A8194"
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#7A8194"
                  value={address.state}
                  onChangeText={(text) => setAddress({ ...address, state: text })}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit pincode"
                placeholderTextColor="#7A8194"
                keyboardType="numeric"
                maxLength={6}
                value={address.pincode}
                onChangeText={(text) => setAddress({ ...address, pincode: text })}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity
                style={[styles.paymentOption, styles.paymentOptionSelected]}
              >
                <Ionicons name="cash-outline" size={24} color="#00c6ff" />
                <Text style={[styles.paymentOptionText, styles.paymentOptionTextSelected]}>
                  Cash on Delivery
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentDetails}>
              <Text style={styles.codNote}>
                Pay in cash at the time of delivery. Please keep exact change
                ready.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.payButton}
            onPress={processPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholderIcon: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "white",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  rowInputs: {
    flexDirection: "row",
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paymentOptionSelected: {
    backgroundColor: "#00c6ff",
  },
  paymentOptionText: {
    color: "white",
    marginLeft: 10,
  },
  paymentOptionTextSelected: {
    fontWeight: "bold",
  },
  codNote: {
    color: "white",
    fontStyle: "italic",
  },
  payButton: {
    backgroundColor: "#00c6ff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;
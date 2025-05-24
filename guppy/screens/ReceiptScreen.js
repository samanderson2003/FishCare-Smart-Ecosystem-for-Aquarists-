import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ReceiptScreen = ({ route }) => {
  const { order } = route.params;

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Order Receipt</Text>
        <ScrollView style={styles.scrollView}>
          <View style={styles.orderDetails}>
            <Text style={styles.orderId}>Order ID: {order.orderId}</Text>
            <Text style={styles.paymentId}>Payment ID: {order.paymentId}</Text>
            <Text style={styles.status}>Status: {order.status}</Text>
            <Text style={styles.totalAmount}>
              Total Amount: ₹{order.totalAmount.toFixed(2)}
            </Text>
            <Text style={styles.sectionTitle}>Items:</Text>
            {order.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Shipping Address:</Text>
            <Text style={styles.addressText}>{order.shippingAddress.name}</Text>
            <Text style={styles.addressText}>{order.shippingAddress.addressLine1}</Text>
            <Text style={styles.addressText}>{order.shippingAddress.addressLine2}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </Text>
            <Text style={styles.addressText}>Phone: {order.shippingAddress.phone}</Text>
          </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00c6ff",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  orderDetails: {
    backgroundColor: "#1F2A38",
    borderRadius: 10,
    padding: 15,
  },
  orderId: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  paymentId: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    color: "#00FF00",
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00c6ff",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  itemPrice: {
    fontSize: 16,
    color: "#FFD700",
  },
  addressText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
});

export default ReceiptScreen;
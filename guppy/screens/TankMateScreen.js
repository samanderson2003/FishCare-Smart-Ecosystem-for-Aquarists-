import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TankMateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TankMate Harmony</Text>
      <Text style={styles.text}>Check which fish breeds can coexist peacefully in a community tank.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
  title: { fontSize: 24, fontWeight: "bold", color: "#00c6ff" },
  text: { fontSize: 16, color: "#E0E0E0", textAlign: "center", marginTop: 10, paddingHorizontal: 20 }
});

export default TankMateScreen;

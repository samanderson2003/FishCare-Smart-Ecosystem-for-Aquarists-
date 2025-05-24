import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GuideScreen = () => {
  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Fish Tank Setup & Maintenance Guide</Text>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.sectionText}>
            Aquarium keeping is a popular and rewarding hobby. This guide will help you set up and maintain a healthy tank.
          </Text>
        </View>

        {/* Selecting Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecting Equipment</Text>
          <Text style={styles.sectionText}>
            - Choose a tank size based on the fish you plan to keep.
            - Use a reliable filtration system and heater (if required).
            - A lid and lighting are recommended for visibility and safety.
          </Text>
        </View>

        {/* Setting Up the Tank */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setting Up the Tank</Text>
          <Text style={styles.sectionText}>
            1. Rinse the tank and decorations before use.
            2. Add gravel and fill with dechlorinated water.
            3. Install filtration, heater, and thermometer.
            4. Let the tank cycle for at least 24 hours before adding fish.
          </Text>
        </View>

        {/* Filtration & Maintenance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtration & Maintenance</Text>
          <Text style={styles.sectionText}>
            - Use a good quality filter to remove debris and waste.
            - Perform a 20-25% water change every 2 weeks.
            - Monitor water parameters regularly (pH, ammonia, nitrate levels).
          </Text>
        </View>

        {/* Feeding & Fish Care */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeding & Fish Care</Text>
          <Text style={styles.sectionText}>
            - Feed fish 2-3 times daily with high-quality food.
            - Avoid overfeeding; remove uneaten food after 10 minutes.
            - Observe fish behavior and health daily.
          </Text>
        </View>

        {/* Common Problems & Solutions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Problems & Solutions</Text>
          <Text style={styles.sectionText}>
            - Cloudy Water: Caused by overfeeding or new tank bacteria bloom.
            - Algae Growth: Reduce light exposure and control feeding.
            - Sick Fish: Quarantine new fish and monitor water conditions.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#00c6ff", textAlign: "center", marginBottom: 15 },
  section: { backgroundColor: "rgba(255, 255, 255, 0.1)", padding: 15, borderRadius: 10, marginBottom: 15, width: "100%" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#00c6ff", marginBottom: 5 },
  sectionText: { fontSize: 14, color: "#E0E0E0" }
});

export default GuideScreen;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import LoginScreen from "./screens/Login";
import HomeScreen from "./screens/Home";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AquaCareScreen from "./screens/AquaCareScreen";
import TankMateScreen from "./screens/TankMateScreen";
import ExpertAquaristScreen from "./screens/ExpertAquaristScreen";
import BreedingZoneScreen from "./screens/BreedingZoneScreen";
import GuideScreen from "./screens/GuideScreen";
import CartScreen from "./screens/CartScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ReceiptScreen from "./screens/ReceiptScreen"; // Import ReceiptScreen

// Import Product Category Screens
import LiveFishScreen from "./screens/ProductList/LiveFishScreen";
import FishFoodScreen from "./screens/ProductList/FishFoodScreen";
import MedicinesScreen from "./screens/ProductList/MedicinesScreen";
import AquariumPlantsScreen from "./screens/ProductList/AquariumPlantsScreen";
import DecorationsScreen from "./screens/ProductList/DecorationsScreen";
import TankAccessoriesScreen from "./screens/ProductList/TankAccessoriesScreen";
import BreedingSuppliesScreen from "./screens/ProductList/BreedingSuppliesScreen";
import AquascapingToolsScreen from "./screens/ProductList/AquascapingToolsScreen";
import Register from "./screens/Register";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tab Navigation (For Home, Products, Profile)
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Products") iconName = "fish";
          else if (route.name === "Cart") iconName = "cart";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00c6ff",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ✅ Stack Navigation (Handles Authentication, Tabs & Feature Screens)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Authentication */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />


        {/* Main Tab Navigation */}
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* Feature Screens */}
        <Stack.Screen name="AquaCare" component={AquaCareScreen} />
        <Stack.Screen name="TankMate" component={TankMateScreen} />
        <Stack.Screen name="ExpertAquarist" component={ExpertAquaristScreen} />
        <Stack.Screen name="BreedingZone" component={BreedingZoneScreen} />
        <Stack.Screen name="GuideScreen" component={GuideScreen} />

        {/* Cart, Payment, and Receipt Screens */}
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Receipt"
          component={ReceiptScreen}
          options={{ headerShown: false }}
        />

        {/* Product Category Screens */}
        <Stack.Screen name="LiveFish" component={LiveFishScreen} />
        <Stack.Screen name="FishFood" component={FishFoodScreen} />
        <Stack.Screen name="Medicines" component={MedicinesScreen} />
        <Stack.Screen name="AquariumPlants" component={AquariumPlantsScreen} />
        <Stack.Screen name="Decorations" component={DecorationsScreen} />
        <Stack.Screen name="TankAccessories" component={TankAccessoriesScreen} />
        <Stack.Screen name="BreedingSupplies" component={BreedingSuppliesScreen} />
        <Stack.Screen name="AquascapingTools" component={AquascapingToolsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
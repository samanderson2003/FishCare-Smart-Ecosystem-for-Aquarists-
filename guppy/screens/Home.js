import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

// Import images
const localWeatherIcon = require("../assets/images/snow_4834548.png");
const aquaCareImage = require("../assets/images/aquacare.png");
const tankMateImage = require("../assets/images/tankmate.png");
const expertAquaristImage = require("../assets/images/expertaquarist.png");
const breedingZoneImage = require("../assets/images/fishbreeding.png");

const API_KEY = "41cca5743d38ae0b1310eb3827620a00";

const HomeScreen = ({ navigation }) => {
  const [temperature, setTemperature] = useState(null);
  const [weatherComment, setWeatherComment] = useState("");
  const [weatherIcon, setWeatherIcon] = useState(localWeatherIcon);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  const getLocationAndFetchWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to get weather updates.");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchWeather(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Location Error:", error);
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        console.error("Weather API Error:", data.message);
        setWeatherComment(`⚠️ ${data.message}`);
        setLoading(false);
        return;
      }

      setTemperature(data.main.temp);
      setWeatherComment(getWeatherComment(data.main.temp));

      setWeatherIcon(localWeatherIcon);
      setLoading(false);
    } catch (error) {
      console.error("Weather Fetch Error:", error);
      setWeatherComment("⚠️ Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const getWeatherComment = (temp) => {
    if (temp > 35) return "🔥 Extreme heat! Provide shade and increase aeration.";
    if (temp > 30) return "☀️ Warm weather! Monitor water quality and keep tanks cool.";
    if (temp >= 24) return "🌤️ Ideal temperature! Great for fish health.";
    if (temp >= 20) return "🌥️ Slightly cool! Reduce feeding if needed.";
    return "❄️ Cold alert! Consider using a heater for tropical fish.";
  };

  const featureCards = [
    { id: "1", title: "AquaCare", description: "Complete fish care guide: water quality, feeding & disease prevention.", image: aquaCareImage, screen: "AquaCare" },
    { id: "2", title: "TankMate Harmony", description: "Check which fish breeds can coexist peacefully in a community tank.", image: tankMateImage, screen: "TankMate" },
    { id: "3", title: "Expert Aquarist", description: "Book professional aquarists for tank setup, maintenance, and expert advice.", image: expertAquaristImage, screen: "ExpertAquarist" },
    { id: "4", title: "Breeding Zone", description: "Learn fish breeding techniques and how to care for young fry.", image: breedingZoneImage, screen: "BreedingZone" }
  ];

  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Fish Care Weather</Text>

        {/* Weather Card */}
        {loading ? (
          <ActivityIndicator size="large" color="#00c6ff" />
        ) : (
          <View style={styles.weatherCard}>
            <View style={styles.weatherRow}>
              <Image source={weatherIcon} style={styles.weatherIcon} />
              <Text style={styles.temperature}>{temperature}°C</Text>
            </View>
            <Text style={styles.comment}>{weatherComment}</Text>
          </View>
        )}

        {/* Feature Cards with Navigation */}
        <View style={styles.cardsGrid}>
          {featureCards.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate(item.screen)}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 20,
  },
  weatherCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    width: "90%",
    marginBottom: 20,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  weatherIcon: {
    width: 80, 
    height: 80,
  },
  temperature: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#00c6ff",
    marginLeft: 10,
  },
  comment: {
    fontSize: 16,
    color: "#E0E0E0",
    textAlign: "center",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1F2A38",
    width: "47%",
    padding: 15,
    height: 230,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#00c6ff",
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00c6ff",
  },
  cardDescription: {
    fontSize: 12,
    color: "#B0BEC5",
    textAlign: "center",
    marginTop: 5,
  },
});

export default HomeScreen;

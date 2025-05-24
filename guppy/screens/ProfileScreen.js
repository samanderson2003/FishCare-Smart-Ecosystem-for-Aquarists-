import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [interestTags, setInterestTags] = useState([]);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (interests) {
      const tags = interests.split(',').map(tag => tag.trim()).filter(tag => tag);
      setInterestTags(tags);
    } else {
      setInterestTags([]);
    }
  }, [interests]);

  const handleSave = () => {
    if (!name || !gender || !bio || !interests) {
      Alert.alert("Incomplete Profile", "Please fill all fields before saving.");
      return;
    }
    setIsEditing(false);
    
    // Animation when profile is saved
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    Alert.alert("Success", "Profile updated successfully!");
  };

  const renderProfilePicture = () => {
    if (gender === "male") {
      return (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.avatarGradient}
          >
            <Text style={styles.profilePicture}>👨</Text>
          </LinearGradient>
        </View>
      );
    } else if (gender === "female") {
      return (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#ff9a9e", "#fad0c4"]}
            style={styles.avatarGradient}
          >
            <Text style={styles.profilePicture}>👩</Text>
          </LinearGradient>
        </View>
      );
    } else {
      return (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#a18cd1", "#fbc2eb"]}
            style={styles.avatarGradient}
          >
            <Text style={styles.profilePicture}>👤</Text>
          </LinearGradient>
        </View>
      );
    }
  };

  return (
    <LinearGradient 
      colors={["#0F2027", "#203A43", "#2C5364"]} 
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Floating bubbles background */}
        <View style={styles.bubblesContainer}>
          {[...Array(5)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.bubble, 
                { 
                  left: 20 + (i * 70), 
                  top: 100 + (i * 120), 
                  width: 100 + (i * 10),
                  height: 100 + (i * 10),
                  opacity: 0.1 - (i * 0.01)
                }
              ]} 
            />
          ))}
        </View>
        
        <ScrollView contentContainerStyle={styles.container}>
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.profileHeader}>
              {renderProfilePicture()}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>My Profile</Text>
                <View style={styles.divider} />
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <LinearGradient
                  colors={isEditing ? ["#FF512F", "#DD2476"] : ["#43cea2", "#185a9d"]}
                  style={styles.editButtonGradient}
                >
                  <Ionicons
                    name={isEditing ? "close" : "create-outline"}
                    size={22}
                    color="white"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="person-outline" size={16} color="#a0e6ff" /> Name
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#7A8194"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="male-female-outline" size={16} color="#a0e6ff" /> Gender
                  </Text>
                  <View style={styles.genderOptions}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        gender === "male" && styles.genderButtonSelected,
                      ]}
                      onPress={() => setGender("male")}
                    >
                      <LinearGradient
                        colors={gender === "male" ? ["#4facfe", "#00f2fe"] : ["transparent", "transparent"]}
                        style={styles.genderGradient}
                      >
                        <Text style={styles.genderText}>👨 Male</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        gender === "female" && styles.genderButtonSelected,
                      ]}
                      onPress={() => setGender("female")}
                    >
                      <LinearGradient
                        colors={gender === "female" ? ["#ff9a9e", "#fad0c4"] : ["transparent", "transparent"]}
                        style={styles.genderGradient}
                      >
                        <Text style={styles.genderText}>👩 Female</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="information-circle-outline" size={16} color="#a0e6ff" /> Bio
                  </Text>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    placeholder="Tell us about yourself"
                    placeholderTextColor="#7A8194"
                    multiline
                    value={bio}
                    onChangeText={setBio}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="heart-outline" size={16} color="#a0e6ff" /> Areas of Interest
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Fishkeeping, Aquascaping (comma separated)"
                    placeholderTextColor="#7A8194"
                    value={interests}
                    onChangeText={setInterests}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.saveButtonContainer}
                  onPress={handleSave}
                >
                  <LinearGradient
                    colors={["#43cea2", "#185a9d"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.profileDetails}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="person" size={20} color="#a0e6ff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailText}>{name || "Not set"}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="male-female" size={20} color="#a0e6ff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailText}>{gender || "Not set"}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <FontAwesome name="info-circle" size={20} color="#a0e6ff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Bio</Text>
                    <Text style={styles.detailText}>{bio || "Not set"}</Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <MaterialCommunityIcons name="heart-multiple" size={20} color="#a0e6ff" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Interests</Text>
                    {interestTags.length > 0 ? (
                      <View style={styles.tagsContainer}>
                        {interestTags.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.detailText}>Not set</Text>
                    )}
                  </View>
                </View>

                {name && gender && bio && interests ? (
                  <View style={styles.completionContainer}>
                    <LinearGradient
                      colors={["#43cea2", "#185a9d"]}
                      style={styles.completionBadge}
                    >
                      <Ionicons name="checkmark-circle" size={16} color="white" />
                      <Text style={styles.completionText}>Profile Complete</Text>
                    </LinearGradient>
                  </View>
                ) : null}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'white',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: 'rgba(25, 42, 66, 0.8)',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profilePicture: {
    fontSize: 40,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.5,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: "#43cea2",
    marginTop: 8,
    borderRadius: 2,
  },
  editButton: {
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  genderButtonSelected: {
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  genderGradient: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  genderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonContainer: {
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  saveButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  profileDetails: {
    marginTop: 20,
    paddingTop: 5,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 22,
    alignItems: "flex-start",
  },
  detailIcon: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: "#a0e6ff",
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.8,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tag: {
    backgroundColor: "rgba(67, 206, 162, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(67, 206, 162, 0.5)",
  },
  tagText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  completionContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  completionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 16,
  },
  completionText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default ProfileScreen;
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";

const diseases = [
  {
    name: "Swim Bladder Disease",
    symptoms: ["Floating upside down", "Sinking to bottom", "Difficulty swimming"],
    causes: "Overfeeding, constipation, or bacterial infection.",
    treatment: "Fast the fish for 24-48 hours, feed peas (without skin), and maintain clean water.",
    medicine: { name: "Swim Bladder Treatment", image: require("../assets/images/swim_bladder_treatment.png") }
  },
  {
    name: "Dropsy",
    symptoms: ["Swollen, bloated belly", "Scales sticking out", "Lethargy"],
    causes: "Kidney failure caused by bacterial infection or poor water quality.",
    treatment: "Isolate the fish, use antibacterial medication, add Epsom salt, and improve tank conditions.",
    medicine: { name: "Dropsy Cure", image: require("../assets/images/dropsy_cure.png") }
  },
  {
    name: "Fin Rot",
    symptoms: ["Frayed, torn, or disintegrating fins", "Reddened edges", "Lethargy"],
    causes: "Bacterial infection due to poor water quality or injury.",
    treatment: "Improve water quality, use antibacterial medication, and remove infected fish if necessary.",
    medicine: { name: "Fin Rot Cure", image: require("../assets/images/fin_rot_cure.png") }
  }
];

const allSymptoms = [
  "Floating upside down", "Sinking to bottom", "Difficulty swimming",
  "Swollen, bloated belly", "Scales sticking out", "Lethargy",
  "Frayed, torn, or disintegrating fins", "Reddened edges"
];

const AquaCareScreen = ({ navigation }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosedDisease, setDiagnosedDisease] = useState(null);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const diagnoseDisease = () => {
    for (let disease of diseases) {
      if (selectedSymptoms.every((symptom) => disease.symptoms.includes(symptom))) {
        setDiagnosedDisease(disease);
        return;
      }
    }
    setDiagnosedDisease(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AquaCare</Text>
      <Text style={styles.text}>Select symptoms to identify fish disease.</Text>

      <FlatList
        data={allSymptoms}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.symptomButton, selectedSymptoms.includes(item) && styles.symptomButtonSelected]}
            onPress={() => toggleSymptom(item)}
          >
            <Text style={styles.symptomText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.diagnoseButton} onPress={diagnoseDisease}>
        <Text style={styles.diagnoseText}>Diagnose Disease</Text>
      </TouchableOpacity>

      {diagnosedDisease && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>{diagnosedDisease.name}</Text>
          <Text style={styles.resultText}>Causes: {diagnosedDisease.causes}</Text>
          <Text style={styles.resultText}>Treatment: {diagnosedDisease.treatment}</Text>
          <View style={styles.medicineContainer}>
            <Text style={styles.medicineTitle}>Suggested Medicine:</Text>
            <Image source={diagnosedDisease.medicine.image} style={styles.medicineImage} />
            <Text style={styles.medicineText}>{diagnosedDisease.medicine.name}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.guideButton} onPress={() => navigation.navigate("GuideScreen")}>
        <Text style={styles.guideText}>📖 Open Fish Tank Setup & Maintenance Guide</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00c6ff", textAlign: "center", marginBottom: 10 },
  text: { fontSize: 16, color: "#E0E0E0", textAlign: "center", marginBottom: 20 },
  symptomButton: { flex: 1, backgroundColor: "#1F2A38", padding: 10, margin: 5, borderRadius: 8, alignItems: "center" },
  symptomButtonSelected: { backgroundColor: "#00c6ff" },
  diagnoseButton: { backgroundColor: "#00c6ff", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  diagnoseText: { color: "#121212", fontSize: 16, fontWeight: "bold" },
  guideButton: { marginTop: 20, backgroundColor: "#00c6ff", padding: 10, borderRadius: 8, alignItems: "center" },
  guideText: { color: "#121212", fontSize: 14, fontWeight: "bold" },
});

export default AquaCareScreen;

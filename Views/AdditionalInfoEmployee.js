import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Birthday from "../components/Birthday";
import UploadImage from "../components/UploadImage";
import AdditionalInfo from "../components/AdditionalInfo";
import AccessLocation from "../components/AccessLocation";
import { updateDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

const AdditionalInfoEmployee = ({ navigation, route }) => {
  const { userId } = route.params || { userId: "" };

  const [experience, setExperience] = useState("");
  const [username, setUsername] = useState("");
  const [info, setInfo] = useState("");
  const [salary, setSalary] = useState("");
  const [time, setTime] = useState("");
  const [work, setWork] = useState("");

  const saveAdditionalInfo = () => {
    const userRef = doc(FIRESTORE_DB, "users", userId);

    updateDoc(userRef, {
      username,
      salary,
      experience,
      time,
      work,
      info,
    })
      .then(() => {
        console.log("Additional info saved successfully!");
      })
      .catch((error) => {
        console.log("Error saving additional info:", error);
      });
  };

  const handleNextPress = () => {
    navigation.navigate("Account");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/TidyLink.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <AdditionalInfo
            text={experience}
            onChangeText={setExperience}
            title="How many years of experience do you have"
            placeholder="How long have you been working for"
            editable={false}
          />

          <AdditionalInfo
            text={username}
            onChangeText={setUsername}
            title="Choose a username"
            placeholder="Enter a unique username"
            editable={false}
          />

          <AdditionalInfo
            text={salary}
            onChangeText={setSalary}
            title="How much salary are you expecting per month"
            placeholder="Enter expected salary per month (Rupees)"
            editable={false}
          />

          <AdditionalInfo
            text={time}
            onChangeText={setTime}
            title="What time slot would you prefer"
            placeholder="Preferred timeslot(eg: 9am - 1pm)"
            editable={false}
          />

          <AdditionalInfo
            text={work}
            onChangeText={setWork}
            title="How many hours do you want to work"
            placeholder="Enter number of hours"
            editable={false}
          />

          <AdditionalInfo
            text={info}
            onChangeText={setInfo}
            title="Tell me about yourself and your past experiences"
            placeholder="Enter bio"
            editable={true}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveAdditionalInfo}
          >
            <Text style={styles.saveButtonText}>Save Information</Text>
          </TouchableOpacity>

          <View style={styles.additionalInfoContainer}>
            <UploadImage userId={userId} />
          </View>

          <View style={styles.additionalInfoContainer}>
            <Birthday userId={userId} />
          </View>

          <AccessLocation userId={userId} />

          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  image: {
    width: 130,
    height: 110,
  },
  content: {
    width: "100%",
  },
  additionalInfoContainer: {
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdditionalInfoEmployee;

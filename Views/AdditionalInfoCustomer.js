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
} from "react-native";
import Birthday from "../components/Birthday";
import UploadImage from "../components/UploadImage";
import AdditionalInfo from "../components/AdditionalInfo";
import AccessLocation from "../components/AccessLocation";
import { updateDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

const AdditionalInfoCustomer = ({ navigation, route }) => {
  const { userId } = route.params || { userId: "" };

  const [rooms, setRooms] = useState("");
  const [username, setUsername] = useState("");
  const [salary, setSalary] = useState("");
  const [time, setTime] = useState("");
  const [age, setAge] = useState("");
  const [family, setFamily] = useState("");
  const [other, setOther] = useState("");

  const saveAdditionalInfo = () => {
    const userRef = doc(FIRESTORE_DB, "users", userId);

    updateDoc(userRef, {
      rooms,
      username,
      salary,
      time,
      age,
      family,
      other,
    })
      .then(() => {
        console.log("Additional info saved successfully!");
      })
      .catch((error) => {
        console.log("Error saving additional info:", error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/ubc.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <AdditionalInfo
            text={rooms}
            onChangeText={setRooms}
            title="How many rooms do you want to have cleaned?"
            placeholder="Number of rooms"
          />

          <AdditionalInfo
            text={username}
            onChangeText={setUsername}
            title="Choose a username"
            placeholder="Enter a unique username"
          />

          <AdditionalInfo
            text={salary}
            onChangeText={setSalary}
            title="How much salary are you willing to give?"
            placeholder="Enter expected salary per month (Rupees)"
          />

          <AdditionalInfo
            text={time}
            onChangeText={setTime}
            title="What time slot would you prefer?"
            placeholder="Preferred timeslot"
          />

          <AdditionalInfo
            text={age}
            onChangeText={setAge}
            title="What age would you prefer for the maids?"
            placeholder="Enter preferred age"
          />

          <AdditionalInfo
            text={other}
            onChangeText={setOther}
            title="Do you want to get utensils cleaned, clothes washed and ironed, or just rooms cleaned?"
            placeholder="Enter answer"
          />

          <AdditionalInfo
            text={family}
            onChangeText={setFamily}
            title="How many family members live in the house?"
            placeholder="Number of Family Members"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveAdditionalInfo}
          >
            <Text style={styles.saveButtonText}>Save Information</Text>
          </TouchableOpacity>

          <View style={styles.birth}>
            <UploadImage userId={userId} />
          </View>

          <View style={styles.birth}>
            <Birthday userId={userId} />
          </View>

          <AccessLocation userId={userId} />

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate("Account", { userId: userId })}
          >
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 110,
    marginTop: 20,
    marginBottom: 40,
    top: 20,
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  birth: {
    marginBottom: 50,
  },
  saveButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdditionalInfoCustomer;

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

function Selection({ navigation, route }) {
  const { UserId } = route.params;
  console.log(route.params);

  const handleCleanerSelection = () => {
    saveOccupation("cleaner");
    navigation.navigate("AdditionalEmployer", { userId: UserId });
  };

  const handleCustomerSelection = () => {
    saveOccupation("customer");
    navigation.navigate("AdditionalCustomer", { userId: UserId });
  };

  const saveOccupation = (occupation) => {
    console.log(UserId);
    const userRef = doc(FIRESTORE_DB, "users", UserId);

    updateDoc(userRef, { occupation })
      .then(() => {
        console.log("Occupation saved successfully!");
      })
      .catch((error) => {
        console.log("Error saving occupation:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/ubc.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCleanerSelection}
        >
          <Text style={styles.buttonText}>I am a cleaner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCustomerSelection}
        >
          <Text style={styles.buttonText}>I am a customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 110,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Selection;

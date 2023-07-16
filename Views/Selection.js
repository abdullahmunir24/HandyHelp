import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

function Selection({ navigation }) {
  const handleCleanerSelection = () => {
    navigation.navigate("AdditionalEmployer");
  };

  const handleCustomerSelection = () => {
    navigation.navigate("AdditionalCustomer");
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

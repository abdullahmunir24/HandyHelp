import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import { updateDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

export default function AccessLocation({ userId }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [showLocation, setShowLocation] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );
      setShowLocation(true);
    }
  }, [location]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const firstAddress = addressResponse[0];
        const formattedAddress = ` ${firstAddress.city}, ${firstAddress.region}, ${firstAddress.country}`;
        setAddress(formattedAddress);
        setNewAddress(formattedAddress); // Set the newAddress state to the current address
      } else {
        setAddress("Address not found");
        setNewAddress("Address not found"); // Set the newAddress state to the current address
      }
    } catch (error) {
      console.log("Error getting address: ", error);
    }
  };

  const handleEditAddress = () => {
    setEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      setAddress(newAddress); // Update the address state with the new address
      setEditingAddress(false);

      // Update the user's collection in Firestore with the new address
      const userRef = doc(FIRESTORE_DB, "users", userId);
      await updateDoc(userRef, { address: newAddress });

      console.log("Address saved successfully!");
    } catch (error) {
      console.log("Error saving address:", error);
    }
  };

  return (
    <View style={styles.container}>
      {showLocation && location && (
        <View style={styles.addressContainer}>
          {editingAddress ? (
            <TextInput
              style={styles.editAddressInput}
              value={newAddress}
              onChangeText={setNewAddress}
            />
          ) : (
            <Text style={styles.addressText}>Address: {address}</Text>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAddress}
            disabled={!editingAddress} // Disable the save button when not in editing mode
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditAddress}
            disabled={editingAddress} // Disable the edit button when in editing mode
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  editAddressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

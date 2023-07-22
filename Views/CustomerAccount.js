import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

function CustomerAccount() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userData } = route.params || { userId: "", userData: null };
  const [user, setUser] = useState(userData);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      )}
      <Text style={styles.heading}>Account Information:</Text>
      <Text style={styles.text}>
        Username: {user?.username || "Not filled"}
      </Text>
      <Text style={styles.text}>Email: {user?.email || "Not filled"}</Text>
      <Text style={styles.text}>Address: {user?.address || "Not filled"}</Text>
      <Text style={styles.text}>Age: {user?.age || "Not filled"}</Text>
      <Text style={styles.text}>
        First Name: {user?.firstName || "Not filled"}
      </Text>
      <Text style={styles.text}>
        Last Name: {user?.lastName || "Not filled"}
      </Text>
      <Text style={styles.text}>
        Occupation: {user?.occupation || "Not filled"}
      </Text>
      <Text style={styles.text}>Room: {user?.room || "Not filled"}</Text>
      <Text style={styles.text}>Others: {user?.others || "Not filled"}</Text>
      <Text style={styles.text}>Family: {user?.family || "Not filled"}</Text>
      <Text style={styles.text}>Salary: {user?.salary || "Not filled"}</Text>
      <Text style={styles.text}>Time: {user?.time || "Not filled"}</Text>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Chat", { userId: userId })}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});

export default CustomerAccount;

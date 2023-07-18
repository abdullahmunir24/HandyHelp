import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

function Account() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || { userId: "" };
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchProfileImage();
  }, []);

  const fetchUserData = async () => {
    try {
      const userSnapshot = await getDoc(doc(FIRESTORE_DB, "users", userId));
      if (userSnapshot.exists()) {
        setUser(userSnapshot.data());
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const imageName = `user_${userId}.jpg`;
      const imageRef = ref(getStorage(), `images/${imageName}`);
      const url = await getDownloadURL(imageRef);
      setProfileImage(url);
    } catch (error) {
      console.log("Error fetching profile image:", error);
    }
  };

  const deleteUserAccount = async () => {
    try {
      const userAuth = getAuth().currentUser;

      // Delete the user document from Firestore
      await deleteDoc(doc(FIRESTORE_DB, "users", userId));

      // Delete the user from Firebase Authentication
      await deleteUser(userAuth);

      navigation.navigate("Login");
    } catch (error) {
      console.log("Error deleting user account:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      )}
      <Text style={styles.heading}>Account Information:</Text>
      <Text style={styles.text}>
        Username: {user?.username || "Not filled"}
      </Text>
      <Text style={styles.text}>
        Email: {FIREBASE_AUTH.currentUser?.email || "Not filled"}
      </Text>
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
      <Button title="Delete User" onPress={deleteUserAccount} />
      <Button title="Sign Out" onPress={signOutUser} />
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

export default Account;

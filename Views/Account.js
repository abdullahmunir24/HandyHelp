import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

function Account() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchProfileImage();
  }, []);

  const fetchUserData = async () => {
    try {
      const userAuth = FIREBASE_AUTH.currentUser;
      if (userAuth) {
        const uid = userAuth.uid;
        const userSnapshot = await getDoc(doc(FIRESTORE_DB, "users", uid));
        if (userSnapshot.exists()) {
          setCurrentUser(userSnapshot.data());
        } else {
          console.log("User data not found");
        }
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const userAuth = FIREBASE_AUTH.currentUser;
      if (userAuth) {
        const uid = userAuth.uid;
        const imageName = `user_${uid}.jpg`;
        const imageRef = ref(getStorage(), `images/${imageName}`);
        const url = await getDownloadURL(imageRef);
        setProfileImage(url);
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.log("Error fetching profile image:", error);
    }
  };

  const deleteUserAccount = async () => {
    try {
      const userAuth = getAuth().currentUser;

      // Delete the user document from Firestore
      await deleteDoc(doc(FIRESTORE_DB, "users", userAuth.uid));

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
      {currentUser ? (
        <>
          <Text style={styles.text}>
            Username: {currentUser.username || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Email: {FIREBASE_AUTH.currentUser?.email || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Address: {currentUser.address || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Age: {currentUser.age || "Not filled"}
          </Text>
          <Text style={styles.text}>
            First Name: {currentUser.firstName || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Last Name: {currentUser.lastName || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Occupation: {currentUser.occupation || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Room: {currentUser.room || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Others: {currentUser.others || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Family: {currentUser.family || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Salary: {currentUser.salary || "Not filled"}
          </Text>
          <Text style={styles.text}>
            Time: {currentUser.time || "Not filled"}
          </Text>
        </>
      ) : (
        <Text>No user data available</Text>
      )}

      <Button title="Delete User" onPress={deleteUserAccount} />
      <Button title="Sign Out" onPress={signOutUser} />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Chat", { userId: userId })}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Customer Profiles")}
      >
        <Text>Customer</Text>
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

export default Account;

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";

function Account() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null); // State to store userId

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchProfileImage();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const userAuth = FIREBASE_AUTH.currentUser;
      if (userAuth) {
        const uid = userAuth.uid;
        setUserId(uid); // Set userId state
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
      if (userAuth) {
        await deleteDoc(doc(FIRESTORE_DB, "users", userAuth.uid));
        await deleteUser(userAuth);

        console.log("User account deleted successfully");
        navigation.navigate("Login");
      } else {
        console.log("No authenticated user found");
      }
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

  const navigateToFavorites = () => {
    if (currentUser.occupation === "cleaner") {
      navigation.navigate("CleanerFavourites", { userId });
    } else {
      navigation.navigate("CustomerFavourites", { userId });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        {currentUser && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text style={styles.userOccupation}>
              {currentUser.occupation || "Occupation not filled"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Messages")}
        >
          <Text style={styles.actionText}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToFavorites}
        >
          <Text style={styles.actionText}>Favorite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Email</Text>
        <Text style={styles.detailText}>
          {FIREBASE_AUTH.currentUser?.email || "Not filled"}
        </Text>

        <Text style={styles.detailTitle}>Address</Text>
        <Text style={styles.detailText}>
          {currentUser?.address || "Not filled"}
        </Text>

        <Text style={styles.detailTitle}>Age</Text>
        <Text style={styles.detailText}>
          {currentUser?.age || "Not filled"}
        </Text>

        {currentUser?.occupation === "cleaner" ? (
          <>
            <Text style={styles.detailTitle}>Years of Experience</Text>
            <Text style={styles.detailText}>
              {currentUser?.experience || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Expected Salary</Text>
            <Text style={styles.detailText}>
              {currentUser?.salary || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Hours Wanted to work</Text>
            <Text style={styles.detailText}>
              {currentUser?.work || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Time Slot</Text>
            <Text style={styles.detailText}>
              {currentUser?.time || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Bio</Text>
            <Text style={styles.detailText}>
              {currentUser?.info || "Not filled"}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.detailTitle}>Family</Text>
            <Text style={styles.detailText}>
              {currentUser?.family || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Room</Text>
            <Text style={styles.detailText}>
              {currentUser?.room || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Others</Text>
            <Text style={styles.detailText}>
              {currentUser?.others || "Not filled"}
            </Text>

            <Text style={styles.detailTitle}>Salary</Text>
            <Text style={styles.detailText}>
              {currentUser?.salary || "Not filled"}
            </Text>
          </>
        )}
      </View>

      <View style={styles.profileButtons}>
        {currentUser?.occupation === "cleaner" ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Customer Profiles")}
          >
            <Text style={styles.profileButtonText}>View Customers</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Cleaner Profiles")}
          >
            <Text style={styles.profileButtonText}>View Cleaners</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteUserAccount}
        >
          <Text style={styles.deleteButtonText}>Delete User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={signOutUser}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 30,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    marginTop: 10,
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  userOccupation: {
    fontSize: 16,
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
  },
  details: {
    paddingHorizontal: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginTop: 5,
  },
  profileButtons: {
    marginVertical: 20,
    alignItems: "center",
  },
  profileButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Account;

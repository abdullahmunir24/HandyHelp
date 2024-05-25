import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

function CleanerAccount() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, userData } = route.params || { userId: "", userData: null };
  const [user, setUser] = useState(userData);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  useEffect(() => {}, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {`${user?.firstName || "First"} ${user?.lastName || "Last"}`}
          </Text>
          <Text style={styles.userOccupation}>
            {user?.occupation || "Occupation"}
          </Text>
          <Text style={styles.userLocation}>{user?.address || "Location"}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailTitle}>Username</Text>
        <Text style={styles.detailText}>{user?.username || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Email</Text>
        <Text style={styles.detailText}>{user?.email || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Address</Text>
        <Text style={styles.detailText}>{user?.address || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Age</Text>
        <Text style={styles.detailText}>{user?.age || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Years of Experience</Text>
        <Text style={styles.detailText}>
          {user?.experience || "Not filled"}
        </Text>

        <Text style={styles.detailTitle}>Expected Salary</Text>
        <Text style={styles.detailText}>{user?.salary || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Hours Wanted to Work</Text>
        <Text style={styles.detailText}>{user?.work || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Time Slot</Text>
        <Text style={styles.detailText}>{user?.time || "Not filled"}</Text>

        <Text style={styles.detailTitle}>Bio</Text>
        <Text style={styles.detailText}>{user?.info || "Not filled"}</Text>
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => navigation.navigate("Chat", { userId: userId })}
      >
        <Text style={styles.messageButtonText}>Message</Text>
      </TouchableOpacity>
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
  userLocation: {
    fontSize: 16,
    color: "#fff",
  },
  details: {
    paddingHorizontal: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  messageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CleanerAccount;

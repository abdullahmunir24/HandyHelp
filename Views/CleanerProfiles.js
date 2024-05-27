import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig"; // Ensure FIREBASE_AUTH is imported
import { FontAwesome } from "@expo/vector-icons";

function CleanerProfiles() {
  const navigation = useNavigation();
  const [cleaners, setCleaners] = useState([]);
  const [favorites, setFavorites] = useState({});
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    fetchCleaners();
    fetchFavorites();
  }, []);

  const fetchCleaners = async () => {
    try {
      const cleanersRef = collection(FIRESTORE_DB, "users");
      const cleanersSnapshot = await getDocs(cleanersRef);

      const fetchedCleaners = [];
      for (const doc of cleanersSnapshot.docs) {
        const cleaner = doc.data();
        if (cleaner.occupation === "cleaner") {
          fetchedCleaners.push({ ...cleaner, id: doc.id });
        }
      }

      setCleaners(fetchedCleaners);
    } catch (error) {
      console.log("Error fetching cleaners:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const favoritesRef = collection(FIRESTORE_DB, "favorites");
      const favoritesSnapshot = await getDocs(favoritesRef);

      const userFavorites = {};
      favoritesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId) {
          userFavorites[data.cleanerId] = true;
        }
      });

      setFavorites(userFavorites);
    } catch (error) {
      console.log("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (cleanerId) => {
    const favoriteRef = doc(
      FIRESTORE_DB,
      "favorites",
      `${userId}_${cleanerId}`
    );
    try {
      if (favorites[cleanerId]) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { userId, cleanerId });
      }
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [cleanerId]: !prevFavorites[cleanerId],
      }));
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  };

  const renderCleanerCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cleanerCard}
      onPress={() =>
        navigation.navigate("Cleaner Account", {
          userId: item.id,
          userData: item,
        })
      }
    >
      <View style={styles.cleanerImageContainer}>
        <Image
          source={
            item.profileImage
              ? { uri: item.profileImage }
              : require("../assets/default_profile_image.webp")
          }
          style={styles.cleanerImage}
        />
      </View>

      <View style={styles.cleanerInfo}>
        <Text style={styles.cleanerName}>
          {item.firstName + " " + item.lastName}
        </Text>
        <Text style={styles.cleanerUsername}>{item.username}</Text>
        <Text style={styles.cleanerOccupation}>{item.occupation}</Text>
        <Text style={styles.cleanerAge}>Age: {item.age || "N/A"}</Text>
        <Text style={styles.cleanerBio}>{item.info || "No bio available"}</Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <FontAwesome
          name="star"
          size={24}
          color={favorites[item.id] ? "#FFD700" : "#888"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cleaners}
        renderItem={renderCleanerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cleanerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cleanerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  cleanerImage: {
    width: "100%",
    height: "100%",
  },
  cleanerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cleanerUsername: {
    fontSize: 16,
    color: "#888",
  },
  cleanerOccupation: {
    fontSize: 14,
    color: "#555",
  },
  cleanerAge: {
    fontSize: 14,
    color: "#555",
  },
  cleanerBio: {
    fontSize: 14,
    color: "#555",
  },
  favoriteButton: {
    marginLeft: 10,
  },
});

export default CleanerProfiles;

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
  getDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { FontAwesome } from "@expo/vector-icons";

function CleanerFavourites() {
  const navigation = useNavigation();
  const userId = FIREBASE_AUTH.currentUser?.uid;
  const [favorites, setFavorites] = useState({});
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favoritesRef = collection(FIRESTORE_DB, "favorites");
      const favoritesSnapshot = await getDocs(favoritesRef);
      const favoriteCustomerIds = [];
      const userFavorites = {};

      favoritesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.cleanerId === userId) {
          favoriteCustomerIds.push(data.customerId);
          userFavorites[data.customerId] = true;
        }
      });

      const fetchedCustomers = [];
      for (const customerId of favoriteCustomerIds) {
        const customerDoc = await getDoc(
          doc(FIRESTORE_DB, "users", customerId)
        );
        if (customerDoc.exists()) {
          fetchedCustomers.push({ ...customerDoc.data(), id: customerDoc.id });
        }
      }

      setCustomers(fetchedCustomers);
      setFavorites(userFavorites);
    } catch (error) {
      console.log("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (customerId) => {
    const favoriteRef = doc(
      FIRESTORE_DB,
      "favorites",
      `${userId}_${customerId}`
    );
    try {
      if (favorites[customerId]) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { cleanerId: userId, customerId });
      }
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [customerId]: !prevFavorites[customerId],
      }));
      fetchFavorites();
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  };

  const renderCustomerCard = ({ item }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() =>
        navigation.navigate("Customer Account", {
          userId: item.id,
          userData: item,
        })
      }
    >
      <View style={styles.customerImageContainer}>
        <Image
          source={
            item.profileImage
              ? { uri: item.profileImage }
              : require("../assets/default_profile_image.webp")
          }
          style={styles.customerImage}
        />
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>
          {item.firstName + " " + item.lastName}
        </Text>
        <Text style={styles.customerUsername}>{item.username}</Text>
        <Text style={styles.customerOccupation}>{item.occupation}</Text>
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
        data={customers}
        renderItem={renderCustomerCard}
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
  customerCard: {
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
  customerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  customerImage: {
    width: "100%",
    height: "100%",
  },
  customerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  customerUsername: {
    fontSize: 16,
    color: "#888",
  },
  customerOccupation: {
    fontSize: 14,
    color: "#555",
  },
  favoriteButton: {
    marginLeft: 10,
  },
});

export default CleanerFavourites;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../FirebaseConfig";

function CustomerProfiles() {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customersRef = collection(FIRESTORE_DB, "users");
      const customersSnapshot = await getDocs(customersRef);

      const fetchedCustomers = [];
      for (const doc of customersSnapshot.docs) {
        const customer = doc.data();
        if (customer.occupation === "customer") {
          fetchedCustomers.push({ ...customer, id: doc.id });
        }
      }

      setCustomers(fetchedCustomers);
    } catch (error) {
      console.log("Error fetching customers:", error);
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
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  listContainer: {
    paddingVertical: 20,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
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
});

export default CustomerProfiles;

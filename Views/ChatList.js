import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { FIRESTORE_DB } from "../FirebaseConfig";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const currentUserUid = getAuth()?.currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    if (!currentUserUid) {
      console.log("No current user UID");
      return;
    }

    console.log("Current User UID:", currentUserUid);

    const fetchChats = async () => {
      try {
        const q = query(
          collection(FIRESTORE_DB, "chats"),
          where("participants", "array-contains", currentUserUid),
          orderBy("lastMessageCreatedAt", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        console.log("Fetched chats:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.log("No chats found");
          setChats([]);
          return;
        }

        const chatList = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            console.log("Chat data:", data);

            const participants = data.participants || [];
            const receiverUid = participants.find(
              (uid) => uid !== currentUserUid
            );

            const userDoc = await getDoc(
              doc(FIRESTORE_DB, "users", receiverUid)
            );
            const userData = userDoc.data();
            const receiverName = userData
              ? userData.firstName + " " + userData.lastName
              : "Unknown";

            const messagesCollection = collection(
              FIRESTORE_DB,
              "chats",
              docSnapshot.id,
              "messages"
            );
            const messagesQuery = query(
              messagesCollection,
              orderBy("createdAt", "desc"),
              limit(1)
            );
            const messagesSnapshot = await getDocs(messagesQuery);
            const lastMessage = messagesSnapshot.docs[0]?.data() || {};
            const lastMessageText = lastMessage.text || "";
            const lastMessageCreatedAt = lastMessage.createdAt
              ? new Date(lastMessage.createdAt.toMillis())
              : null;

            return {
              id: docSnapshot.id,
              receiverUid,
              receiverName,
              lastMessageText,
              lastMessageCreatedAt,
            };
          })
        );

        setChats(chatList);
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUserUid]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { userId: item.receiverUid })}
    >
      <View style={styles.chatItem}>
        <Text style={styles.participants}>{item.receiverName}</Text>
        <Text style={styles.lastMessage}>
          Last Message: {item.lastMessageText}
        </Text>
        {item.lastMessageCreatedAt && (
          <Text style={styles.lastMessageTime}>
            {item.lastMessageCreatedAt.toLocaleString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.chatList}
    />
  );
}

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  participants: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
  lastMessageTime: {
    fontSize: 12,
    color: "#aaa",
  },
});

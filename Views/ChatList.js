import React, { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const currentUserUid = getAuth()?.currentUser?.uid;

  useEffect(() => {
    // Fetch the list of chat documents where the current user is participating
    const q = query(
      collection(FIRESTORE_DB, "chats"),
      where("participantsList_", "array-contains", {
        user: { _id: currentUserUid },
      }),
      orderBy("lastMessageCreatedAt", "desc"),
      limit(10)
    );

    const fetchChats = async () => {
      try {
        const querySnapshot = await getDocs(q);

        // Process each chat document to extract the user's information
        const chatList = querySnapshot.docs.map((doc) => {
          const participantsList = doc.data().participantsList_;

          // Filter out any sender objects from the participantsList_ array
          const userParticipants = participantsList.filter(
            (participant) => participant.user
          );

          // Extract the user's information from the filtered array
          const participants = userParticipants.map((participant) => ({
            name: participant.user.name,
            username: participant.user.username,
          }));

          // Extract the last message and its creation timestamp
          const lastMessage = doc.data().messages[0]; // Assuming the messages are ordered by createdAt in descending order
          const lastMessageText = lastMessage?.text || "";
          const lastMessageCreatedAt = lastMessage?.createdAt?.toDate() || null;

          return {
            id: doc.id,
            participants,
            lastMessageText,
            lastMessageCreatedAt,
          };
        });

        setChats(chatList);
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [currentUserUid]);

  const renderItem = ({ item }) => (
    <View style={styles.chatItem}>
      <Text style={styles.participants}>
        {item.participants
          .map(
            (participant) => `${participant.name} (@${participant.username})`
          )
          .join(", ")}
      </Text>
      <Text style={styles.lastMessage}>
        Last Message: {item.lastMessageText}
      </Text>
      {item.lastMessageCreatedAt && (
        <Text style={styles.lastMessageTime}>
          {item.lastMessageCreatedAt.toLocaleString()}
        </Text>
      )}
    </View>
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

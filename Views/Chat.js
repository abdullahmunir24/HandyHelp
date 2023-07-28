import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Text, Image, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || { userId: "" };
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(null);

  useEffect(() => {
    const chatId = constructChatId(getAuth()?.currentUser?.uid, userId);
    const collectionRef = collection(FIRESTORE_DB, "chats", chatId, "messages");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsubscribe");

      // Fetch the user's profile image from the "users" collection based on the user ID
      const userDocRef = doc(FIRESTORE_DB, "users", userId);
      getDoc(userDocRef)
        .then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedMessages = querySnapshot.docs.map((doc) => ({
              _id: doc.id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              profileImage: userData.profileImage || null, // Set the profile image URL for each message
              user: doc.data().user,
            }));
            setMessages(updatedMessages);
          }
        })
        .catch((error) => {
          console.log("Error fetching user profile image:", error);
        });
    });

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    fetchUserData();
    fetchUserProfileImage();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // Fetch user data from the "users" collection based on the user ID
      const userDocRef = doc(FIRESTORE_DB, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          _id: userId,
          name: `${userData.firstName} ${userData.lastName}`,
          username: userData.username,
        });
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const fetchUserProfileImage = async () => {
    try {
      // Fetch the user's profile image from the "users" collection based on the user ID
      const userDocRef = doc(FIRESTORE_DB, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profileImage = userData.profileImage || null;
        setUserProfileImage(profileImage); // Set the profile image URL in the state
      }
    } catch (error) {
      console.log("Error fetching user profile image:", error);
    }
  };

  const onSend = useCallback(
    async (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      const { _id, createdAt, text } = messages[0];
      const senderId = getAuth()?.currentUser?.uid;
      const chatId = constructChatId(senderId, userId);

      try {
        // Check if the chat document already exists
        const chatDocRef = doc(FIRESTORE_DB, "chats", chatId);
        const chatDocSnap = await getDoc(chatDocRef);

        // If the chat document doesn't exist, create a new one with the required fields
        if (!chatDocSnap.exists()) {
          await setDoc(chatDocRef, {
            participantsList_: [
              { user: { _id: userId, name: user.name } },
              { sender: { senderId: senderId } },
            ],
            lastMessageCreatedAt: createdAt,
          });
        } else {
          // If the chat document exists, update the lastMessageCreatedAt field to the timestamp of the latest message
          await setDoc(chatDocRef, {
            participantsList_: [
              { user: { _id: userId, name: user.name } },
              { sender: { senderId: senderId } },
            ],
            lastMessageCreatedAt: createdAt,
          });
        }

        // Create a new message document in the "messages" subcollection of the chat document
        await addDoc(collection(chatDocRef, "messages"), {
          _id,
          createdAt,
          text,
          user: {
            _id: userId,
            name: user.name,
          },
        });
      } catch (error) {
        console.log("Error sending message:", error);
      }
    },
    [userId, user]
  );

  const constructChatId = (senderId, receiverId) => {
    if (senderId < receiverId) {
      return `${senderId}_${receiverId}`;
    } else {
      return `${receiverId}_${senderId}`;
    }
  };

  return (
    <>
      {user && (
        <>
          <View style={styles.userInfoContainer}>
            <Image
              source={
                userProfileImage
                  ? { uri: userProfileImage }
                  : require("../assets/default_profile_image.webp")
              }
              style={styles.userProfileImage}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userUsername}>@{user.username}</Text>
          </View>
        </>
      )}

      {lastMessage && (
        <Text style={styles.lastMessage}>Last Message: {lastMessage}</Text>
      )}

      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={(messages) => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: "#fff",
        }}
        textInputStyle={{
          backgroundColor: "#fff",
          borderRadius: 20,
        }}
        user={user}
      />
    </>
  );
}

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userUsername: {
    fontSize: 14,
    color: "#888",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
});

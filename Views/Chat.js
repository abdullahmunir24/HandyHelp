// Chat.js
import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Avatar } from "react-native-elements";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || { userId: "" };
  const [user, setUser] = useState(null);

  useEffect(() => {
    const chatId = constructChatId(getAuth()?.currentUser?.uid, userId);
    const collectionRef = collection(FIRESTORE_DB, "chats", chatId, "messages");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("querySnapshot unsubscribe");
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.id, // Use doc.id as the unique ID for gifted-chat
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const imageName = `user_${userId}.jpg`;
      const imagePath = `images/${imageName}`;
      const storageRef = FIRESTORE_DB.storage().ref();

      const url = await getDownloadURL(ref(storageRef, imagePath));
      setUser((prevUser) => ({
        ...prevUser,
        avatar: url,
      }));
    } catch (error) {
      console.log("Error fetching profile image:", error);
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
        await addDoc(collection(FIRESTORE_DB, "chats", chatId, "messages"), {
          _id,
          createdAt,
          text,
          user: {
            _id: senderId,
          },
        });
      } catch (error) {
        console.log("Error sending message:", error);
      }
    },
    [userId]
  );

  const constructChatId = (senderId, receiverId) => {
    if (senderId < receiverId) {
      return `${senderId}_${receiverId}`;
    } else {
      return `${receiverId}_${senderId}`;
    }
  };

  return (
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
      user={{
        _id: getAuth()?.currentUser?.uid,
        avatar: user?.avatar,
      }}
      renderAvatar={(props) => (
        <Avatar
          size="medium"
          source={
            props.currentMessage.user.avatar && {
              uri: props.currentMessage.user.avatar,
            }
          }
        />
      )}
    />
  );
}

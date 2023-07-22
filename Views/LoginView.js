import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import InputStuff from "../components/inputStuff";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || { userId: "" };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      const idToken = await user.getIdToken();
      console.log("Firebase ID token:", idToken);
      alert("Logged in successfully");
      setEmail("");
      setPassword("");
      navigation.navigate("Account", { userId: userId });
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const isFormValid = () => {
    return email.includes("@") && password.length >= 6;
  };

  const checkUserExists = async () => {
    const usersCollection = collection(FIRESTORE_DB, "users");
    const userQuery = query(usersCollection, where("email", "==", email));
    const userQuerySnapshot = await getDocs(userQuery);
    return !userQuerySnapshot.empty;
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      alert("Please enter a valid email and password.");
      return;
    }

    try {
      const userExists = await checkUserExists();
      if (userExists) {
        await signIn();
      } else {
        alert("User does not exist. Create a new account.");
      }
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../assets/ubc.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <InputStuff
            value={email}
            title="Email Address"
            placeholder="examplename@gmail.com"
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <InputStuff
            value={password}
            title="Password"
            placeholder="Enter Password"
            isSecure={true}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isFormValid() ? null : styles.disabledButton]}
        onPress={handleLogin}
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>Log In</Text>
        <AntDesign name="caretright" style={styles.buttonIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("Registration")}
      >
        <Text style={styles.signUpButtonText}>
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 110,
    paddingVertical: 20,
  },
  formContainer: {
    marginTop: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 10,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "red",
  },
  buttonIcon: {
    marginLeft: 5,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: 10,
  },
  signUpButtonText: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});

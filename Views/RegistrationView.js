import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import InputStuff from "../components/inputStuff";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDoc, setDoc, doc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_APP, FIRESTORE_DB } from "../FirebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [InputError, setInputError] = useState("");
  const [UserId, setUserId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (password !== confirmpassword && confirmpassword !== "") {
      setInputError("Passwords do not match");
    } else if (password.length < 6 && password !== "") {
      setInputError("Password must be at least 6 characters long");
    } else if (firstname === "") {
      setInputError("Enter First Name");
    } else if (!email.includes("@") && email !== "") {
      setInputError("Enter a valid email address");
    } else if (lastname === "") {
      setInputError("Enter Last Name");
    } else {
      setInputError("");
    }
  }, [password, confirmpassword, email, firstname, lastname]);

  const signUp = async () => {
    if (password !== confirmpassword) {
      setInputError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setInputError("Password must be at least 6 characters long");
      return;
    }
    if (firstname === "") {
      setInputError("Enter First Name");
      return;
    }
    if (!email.includes("@") && email !== "") {
      setInputError("Enter a valid email address");
      return;
    }
    if (lastname === "") {
      setInputError("Enter Last Name");
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = response.user;

      const userRef = doc(FIRESTORE_DB, "users", user.uid);
      await setDoc(userRef, {
        firstName: firstname,
        lastName: lastname,
        email: email,
      });

      setUserId(user.uid);
      console.log(UserId);

      alert("Your account has been created");
      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
      setConfirmPassword("");
      navigation.navigate("Select", { UserId: user.uid });
    } catch (error) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  const isFormValid = () => {
    return (
      email !== "" &&
      email.includes("@") &&
      password !== "" &&
      password.length >= 6 &&
      password === confirmpassword &&
      firstname !== "" &&
      lastname !== ""
    );
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
            value={firstname}
            title="First Name"
            placeholder="Enter First Name"
            onChangeText={setFirstname}
          />
        </View>

        <View style={styles.inputContainer}>
          <InputStuff
            value={lastname}
            title="Last Name"
            placeholder="Enter Last Name"
            onChangeText={setLastname}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <View style={styles.confirmPasswordContainer}>
            <InputStuff
              value={confirmpassword}
              title="Confirm Password"
              placeholder="Reenter Password"
              isSecure={true}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isFormValid() ? null : styles.disabledButton]}
          onPress={signUp}
          disabled={!isFormValid()}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
          <AntDesign name="caretright" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.signInButtonText}>
          If you already have an account, please sign in
        </Text>
        <Text style={styles.errorMessage}>{InputError}</Text>
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
  confirmPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmPasswordIcon: {
    fontSize: 20,
    marginLeft: 5,
    color: "green",
    fontWeight: "bold",
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
  signInButton: {
    marginTop: 10,
  },
  signInButtonText: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

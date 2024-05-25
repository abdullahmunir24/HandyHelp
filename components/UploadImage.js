import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { ProgressBar } from "react-native-paper";

const storage = getStorage();

export default function UploadImage({ userId }) {
  const [image, setImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [libraryPermission, setLibraryPermission] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setCameraPermission(cameraStatus === "granted");
      setLibraryPermission(libraryStatus === "granted");
    })();
  }, []);

  const pickImage = async () => {
    if (libraryPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri); // Update how you access the selected image URI
      }
    } else {
      requestLibraryPermission();
    }
  };

  const uploadPicture = async () => {
    if (uploading) {
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      const response = await fetch(image);
      const blob = await response.blob();
      const imageName = `user_${userId}.jpg`;
      const storageRef = ref(storage, `images/${imageName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log("Error uploading image:", error);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Now, you can store the downloadURL in Firestore under the user's document
            const userRef = doc(FIRESTORE_DB, "users", userId);
            await setDoc(
              userRef,
              { profileImage: downloadURL },
              { merge: true } // Use { merge: true } to merge the new data with existing data in the document
            );

            console.log("Image URL stored in Firestore!");
          } catch (error) {
            console.log("Error storing image URL in Firestore:", error);
          }

          console.log("Image uploaded successfully!");
          setUploading(false);
        }
      );
    } catch (error) {
      console.log("Error uploading image:", error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          !libraryPermission || uploading ? styles.buttonDisabled : {},
        ]}
        onPress={pickImage}
        disabled={!libraryPermission || uploading}
      >
        <Text style={styles.buttonText}>Choose Picture</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity
        style={[
          styles.button,
          !image || uploading ? styles.buttonDisabled : {},
        ]}
        onPress={uploadPicture}
        disabled={!image || uploading}
      >
        <Text style={styles.buttonText}>Upload Picture</Text>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
          <ProgressBar
            progress={uploadProgress / 100}
            color="#0000ff"
            style={styles.progressBar}
          />
          <Text style={styles.uploadProgress}>
            {Math.round(uploadProgress)}%
          </Text>
        </View>
      )}
      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a9a9a9",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  uploadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0000ff",
  },
  progressBar: {
    width: 200,
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  uploadProgress: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0000ff",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});

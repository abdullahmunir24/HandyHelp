import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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
        setImage(result.uri);
      }
    } else {
      requestLibraryPermission();
    }
  };

  const uploadPicture = async () => {
    if (uploading) {
      // If an upload is already in progress, return
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      const response = await fetch(image);
      const blob = await response.blob();
      const imageName = `user_${userId}.jpg`;
      const storageRef = ref(storage, `images/${imageName}`);
      const uploadTask = uploadBytes(storageRef, blob);

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
        () => {
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
      <Button
        title="Choose Picture"
        onPress={pickImage}
        disabled={!libraryPermission || uploading} // Disable when uploading is in progress
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button
        title="Upload Picture"
        onPress={uploadPicture}
        disabled={!image || uploading} // Disable when no image selected or uploading is in progress
      />
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
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
    top: 50,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  uploadingContainer: {
    marginTop: 20,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  uploadProgress: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});

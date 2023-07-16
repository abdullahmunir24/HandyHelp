import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

function AdditionalInfo(props) {
  const { text, title, placeholder, editable, onChangeText } = props;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {editable ? (
        <TextInput
          multiline
          numberOfLines={4}
          value={text}
          onChangeText={onChangeText}
          style={styles.textEditor}
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={text}
          onChangeText={onChangeText}
          style={styles.textInput}
        />
      )}
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 7,
  },
  textInput: {
    height: 40,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888888",
    paddingHorizontal: 8,
  },
  textEditor: {
    height: 100,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888888",
    paddingHorizontal: 8,
    paddingTop: 8,
    textAlignVertical: "top",
  },
  divider: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});

export default AdditionalInfo;

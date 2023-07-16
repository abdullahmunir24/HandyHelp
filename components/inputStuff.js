import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

function inputStuff(props) {
  const { text, title, placeholder, isSecure, onChangeText } = props;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {isSecure ? (
        <TextInput
          secureTextEntry
          placeholder={placeholder}
          value={text}
          onChangeText={onChangeText}
          style={styles.input}
        />
      ) : (
        <TextInput
          placeholder={placeholder}
          value={text}
          onChangeText={onChangeText}
          style={styles.input}
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
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
  },
  divider: {
    borderBottomWidth: 1,
  },
});

export default inputStuff;

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function AccountInfo(props) {
    const { imageName, title, color } = props;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageName }}
        style={[styles.icon, { tintColor: color }]}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    marginLeft: 12,
    color: 'black',
  },
});

export default AccountInfo;
